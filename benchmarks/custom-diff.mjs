// custom-diff.mjs
import fs from 'node:fs';
import { performance } from 'node:perf_hooks';
import { fileURLToPath } from 'node:url';

// --- CUSTOM ALGORITHM ---

const SPLIT_RE = /\r\n|\r|\n/;

function shouldMoveDown(vLeft, vDown) {
  if (vLeft === -1 && vDown === -1) return false;
  if (vLeft === -1) return true;
  if (vDown === -1) return false;
  return vLeft < vDown;
}

function hashLines(lines) {
  const uniqueMap = new Map();
  const ids = new Int32Array(lines.length);
  let nextId = 0;
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    let id = uniqueMap.get(line);
    if (id === undefined) {
      id = nextId++;
      uniqueMap.set(line, id);
    }
    ids[i] = id;
  }
  return { ids, map: uniqueMap };
}

// EXPORT ADDED HERE
export function fastDiff(textA, textB, opts) {
  if (textA.length === 0 && textB.length === 0)
    return { didFallback: false, pairs: [] };

  const linesA = textA.length === 0 ? [] : textA.split(SPLIT_RE);
  const linesB = textB.length === 0 ? [] : textB.split(SPLIT_RE);

  const { ids: idsA, map } = hashLines(linesA);
  const idsB = new Int32Array(linesB.length);
  let nextId = map.size;
  for (let i = 0; i < linesB.length; i++) {
    let id = map.get(linesB[i]);
    if (id === undefined) {
      id = nextId++;
      map.set(linesB[i], id);
    }
    idsB[i] = id;
  }

  return diffIds(idsA, idsB, opts);
}

export function diffIds(idsA, idsB, opts = {}) {
  const n = idsA.length;
  const m = idsB.length;
  const pairs = [];
  const maxMillis = opts.maxMillis ?? 100;
  const budgetBytes = opts.budgetBytes ?? 32 * 1024 * 1024;
  const failOnFallback = opts.failOnFallback ?? false;

  let start = 0;
  while (start < n && start < m && idsA[start] === idsB[start]) start++;

  let endA = n - 1;
  let endB = m - 1;
  while (endA >= start && endB >= start && idsA[endA] === idsB[endB]) {
    endA--;
    endB--;
  }

  for (let i = 0; i < start; i++) pairs.push({ aIndex: i, bIndex: i });

  const lenA = endA - start + 1;
  const lenB = endB - start + 1;
  let didFallback = false;
  let reason;

  if (lenA > 0 && lenB > 0) {
    const safeBudget = Math.max(0, budgetBytes - 50_000);
    const availableInts = Math.floor(safeBudget / 4);
    const memLimit = Math.floor(Math.sqrt(Math.max(0, availableInts) / 2)) - 5;

    if (memLimit < 1) {
      didFallback = true;
      reason = 'memory';
      if (failOnFallback) return { didFallback, pairs, reason };
    } else {
      const limit = Math.min(lenA + lenB, memLimit, 20000);

      const res = computeBoundedMyers(
        idsA,
        start,
        lenA,
        idsB,
        start,
        lenB,
        limit,
        Date.now() + maxMillis,
      );

      if (res.success) {
        for (const p of res.pairs) pairs.push(p);
      } else {
        didFallback = true;
        reason = res.reason;
        if (failOnFallback) return { didFallback, pairs, reason };
      }
    }
  }

  const suffixLen = Math.max(0, n - 1 - endA);
  for (let i = 0; i < suffixLen; i++) {
    pairs.push({ aIndex: endA + 1 + i, bIndex: endB + 1 + i });
  }

  return { didFallback, pairs, reason };
}

function computeBoundedMyers(a, startA, N, b, startB, M, limit, deadline) {
  const offset = limit;
  const vSize = 2 * limit + 1;
  const stride = vSize;
  const v = new Int32Array(vSize).fill(-1);
  v[offset + 1] = 0;
  const trace = new Int32Array((limit + 1) * stride).fill(-1);

  for (let d = 0; d <= limit; d++) {
    if ((d & 31) === 0 && Date.now() > deadline)
      return { reason: 'time', success: false };

    for (let k = -d; k <= d; k += 2) {
      trace[d * stride + (k + offset)] = v[k + offset];
    }

    for (let k = -d; k <= d; k += 2) {
      const kIdx = k + offset;
      const vLeft = kIdx - 1 >= 0 ? v[kIdx - 1] : -1;
      const vDown = kIdx + 1 < vSize ? v[kIdx + 1] : -1;

      let moveDown;
      if (k === -d) {
        if (vDown === -1) continue;
        moveDown = true;
      } else if (k === d) {
        if (vLeft === -1) continue;
        moveDown = false;
      } else {
        moveDown = shouldMoveDown(vLeft, vDown);
      }

      const prevX = moveDown ? vDown : vLeft;
      if (prevX === -1) continue;

      let x = moveDown ? prevX : prevX + 1;
      let y = x - k;

      while (x < N && y < M && a[startA + x] === b[startB + y]) {
        x++;
        y++;
      }
      v[kIdx] = x;

      if (x >= N && y >= M) {
        const path = backtrack(trace, stride, offset, d, N, M, startA, startB);
        if (!path) return { reason: 'depth', success: false };
        return { pairs: path, success: true };
      }
    }
  }
  return { reason: 'depth', success: false };
}

function backtrack(trace, stride, offset, depth, N, M, startA, startB) {
  const res = [];
  let x = N;
  let y = M;

  for (let d = depth; d > 0; d--) {
    const k = x - y;
    const kIdx = k + offset;
    const prevRow = (d - 1) * stride;

    let vLeft = -1;
    if (kIdx - 1 >= 0) vLeft = trace[prevRow + (kIdx - 1)];

    let vDown = -1;
    if (kIdx + 1 < stride) vDown = trace[prevRow + (kIdx + 1)];

    if (vLeft === -1 && vDown === -1) return null;

    let moveDown;
    if (k === -d) {
      if (vDown === -1) return null;
      moveDown = true;
    } else if (k === d) {
      if (vLeft === -1) return null;
      moveDown = false;
    } else {
      moveDown = shouldMoveDown(vLeft, vDown);
    }

    const prevX = moveDown ? vDown : vLeft;
    if (prevX === -1) return null;

    const prevK = moveDown ? k + 1 : k - 1;
    const xSnakeStart = moveDown ? prevX : prevX + 1;
    const ySnakeStart = xSnakeStart - k;

    while (x > xSnakeStart && y > ySnakeStart) {
      res.push({ aIndex: startA + x - 1, bIndex: startB + y - 1 });
      x--;
      y--;
    }

    x = prevX;
    y = x - prevK;
  }
  return res.reverse();
}

// --- HYBRID EXECUTION CHECK ---
// FIX: Also updated filenames here for direct execution
const isMainModule = process.argv[1] === fileURLToPath(import.meta.url);

if (isMainModule) {
  const textA = fs.readFileSync('fileA.txt', 'utf-8');
  const textB = fs.readFileSync('fileB.txt', 'utf-8');

  // End-to-end LINE diff benchmark (split + hash + bounded Myers).
  const start = performance.now();
  const result = fastDiff(textA, textB, {
    budgetBytes: Number.parseInt(
      process.env.BUDGET_BYTES ?? String(32 * 1024 * 1024),
      10,
    ),
    failOnFallback: true,
    // Use a generous window so we can compare algorithmic speed without falling back.
    maxMillis: Number.parseInt(process.env.MAX_MILLIS ?? '5000', 10),
  });
  const end = performance.now();

  // Small sink to ensure work is not optimized away.
  const sink = result.pairs.length;

  console.log(
    JSON.stringify({
      didFallback: result.didFallback,
      mode: 'line',
      ms: Number((end - start).toFixed(3)),
      name: 'custom-myers',
      pairs: sink,
      reason: result.reason ?? null,
    }),
  );
}
