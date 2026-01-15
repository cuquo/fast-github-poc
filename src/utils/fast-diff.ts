export type LCSPair = { aIndex: number; bIndex: number };

export type FastDiffOptions = {
  /** Max execution time in milliseconds. Default: 100ms */
  maxMillis?: number;
  /** Memory budget for Trace Buffer in bytes. Default: 32MB */
  budgetBytes?: number;
};

export type DiffResult = {
  pairs: LCSPair[];
  didFallback: boolean;
  reason?: 'time' | 'depth' | 'memory';
};

/**
 * Standard regex for splitting lines.
 * Exported to ensure absolute consistency in tests.
 */
export const SPLIT_RE = /\r\n|\r|\n/;

/**
 * Decides direction when both neighbors theoretically exist.
 * Deterministic tie-break: strict <.
 * If vLeft < vDown, prefer Down (Insert).
 * If equal or vLeft > vDown, prefer Right (Delete).
 */
function shouldMoveDown(vLeft: number, vDown: number): boolean {
  // Defensive: Can only happen if both neighbors are unreachable/dead.
  // Returns false so prevX becomes -1 (vLeft), and caller treats diagonal as dead.
  if (vLeft === -1 && vDown === -1) return false;

  if (vLeft === -1) return true; // Left dead, force Down
  if (vDown === -1) return false; // Down dead, force Right

  return vLeft < vDown;
}

export function fastDiff(
  textA: string,
  textB: string,
  opts?: FastDiffOptions,
): DiffResult {
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

function hashLines(lines: readonly string[]): {
  ids: Int32Array;
  map: Map<string, number>;
} {
  const uniqueMap = new Map<string, number>();
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

export function diffIds(
  idsA: Int32Array,
  idsB: Int32Array,
  opts: FastDiffOptions = {},
): DiffResult {
  const n = idsA.length;
  const m = idsB.length;
  const pairs: LCSPair[] = [];

  const maxMillis = opts.maxMillis ?? 100;
  const budgetBytes = opts.budgetBytes ?? 32 * 1024 * 1024; // 32MB default

  // 1. Prefix Trim
  let start = 0;
  while (start < n && start < m && idsA[start] === idsB[start]) start++;

  // 2. Suffix Trim
  let endA = n - 1;
  let endB = m - 1;
  while (endA >= start && endB >= start && idsA[endA] === idsB[endB]) {
    endA--;
    endB--;
  }

  for (let i = 0; i < start; i++) pairs.push({ aIndex: i, bIndex: i });

  // 3. Middle Logic
  const lenA = endA - start + 1;
  const lenB = endB - start + 1;
  let didFallback = false;
  let reason: DiffResult['reason'];

  if (lenA > 0 && lenB > 0) {
    const safeBudget = Math.max(0, budgetBytes - 50_000);
    const availableInts = Math.floor(safeBudget / 4);
    // Safe formula: limit <= sqrt(ints / 2)
    const memLimit = Math.floor(Math.sqrt(Math.max(0, availableInts) / 2)) - 5;

    if (memLimit < 1) {
      didFallback = true;
      reason = 'memory';
    } else {
      const limit = Math.min(lenA + lenB, memLimit, 10_000);
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
      }
    }
  }

  const suffixLen = Math.max(0, n - 1 - endA);
  for (let i = 0; i < suffixLen; i++) {
    pairs.push({ aIndex: endA + 1 + i, bIndex: endB + 1 + i });
  }

  return { didFallback, pairs, reason };
}

type MyersResult =
  | { success: true; pairs: LCSPair[] }
  | { success: false; reason: 'time' | 'depth' };

function computeBoundedMyers(
  a: Int32Array,
  startA: number,
  N: number,
  b: Int32Array,
  startB: number,
  M: number,
  limit: number,
  deadline: number,
): MyersResult {
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
      const kIdx = k + offset;
      const vLeft = kIdx - 1 >= 0 ? v[kIdx - 1] : -1;
      const vDown = kIdx + 1 < vSize ? v[kIdx + 1] : -1;

      // FORWARD DECISION (Sentinel aware + Explicit Geometry)
      let moveDown: boolean;
      if (k === -d) {
        // Geometry: Left edge, only insert possible (vDown).
        // Hardening: If vDown is dead (-1), continue (diagonal dead).
        if (vDown === -1) continue;
        moveDown = true;
      } else if (k === d) {
        // Geometry: Right edge, only delete possible (vLeft).
        // Hardening: If vLeft is dead (-1), continue.
        if (vLeft === -1) continue;
        moveDown = false;
      } else {
        // Central case: deterministic tie-break
        moveDown = shouldMoveDown(vLeft, vDown);
      }

      const prevX = moveDown ? vDown : vLeft;

      // Guard: both neighbors dead
      if (prevX === -1) continue;

      let x = moveDown ? prevX : prevX + 1;
      let y = x - k;

      while (x < N && y < M && a[startA + x] === b[startB + y]) {
        x++;
        y++;
      }

      v[kIdx] = x;

      if (x >= N && y >= M) {
        // Store trace BEFORE returning (at end of iteration d)
        for (let kk = -d; kk <= d; kk += 2) {
          trace[d * stride + (kk + offset)] = v[kk + offset];
        }
        const path = backtrack(trace, stride, offset, d, N, M, startA, startB);
        if (!path) return { reason: 'depth', success: false };
        return { pairs: path, success: true };
      }
    }

    // Store trace at END of iteration d (V values after forward pass)
    for (let k = -d; k <= d; k += 2) {
      trace[d * stride + (k + offset)] = v[k + offset];
    }
  }

  return { reason: 'depth', success: false };
}

function backtrack(
  trace: Int32Array,
  stride: number,
  offset: number,
  depth: number,
  N: number,
  M: number,
  startA: number,
  startB: number,
): LCSPair[] | null {
  const res: LCSPair[] = [];
  let x = N;
  let y = M;

  for (let d = depth; d > 0; d--) {
    const k = x - y;
    const kIdx = k + offset;
    const prevRow = (d - 1) * stride; // trace[d-1] stores V at end of d-1

    let vLeft = -1;
    if (kIdx - 1 >= 0) vLeft = trace[prevRow + (kIdx - 1)];

    let vDown = -1;
    if (kIdx + 1 < stride) vDown = trace[prevRow + (kIdx + 1)];

    // ABSOLUTE DEAD END
    if (vLeft === -1 && vDown === -1) return null;

    // BACKTRACK DECISION (Exact symmetry with Forward)
    let moveDown: boolean;
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

    // Integrity Guard
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
