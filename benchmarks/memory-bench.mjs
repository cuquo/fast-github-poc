// memory-bench.mjs
import fs from 'node:fs';

import { diffLines as jsdiffLines } from 'diff';
import fastDiff from 'fast-diff';

// Adjust these imports to match your custom diff entry point.
import { fastDiff as customFastDiff } from './custom-diff.mjs';

/**
 * Keep consistent with other benches.
 */
const SPLIT_RE = /\r\n|\r|\n/;

function encodeId(id) {
  const hi = (id >>> 16) & 0xffff;
  const lo = id & 0xffff;
  return String.fromCharCode(hi, lo);
}

function buildLineTokenStrings(textA, textB) {
  const linesA = textA.length === 0 ? [] : textA.split(SPLIT_RE);
  const linesB = textB.length === 0 ? [] : textB.split(SPLIT_RE);

  const map = new Map();
  const tokenCache = [];
  let nextId = 0;

  function tokenForLine(line) {
    let id = map.get(line);
    if (id === undefined) {
      id = nextId++;
      map.set(line, id);
      const tok = encodeId(id);
      tokenCache[id] = tok;
      return tok;
    }
    const cached = tokenCache[id];
    if (cached !== undefined) return cached;
    const tok = encodeId(id);
    tokenCache[id] = tok;
    return tok;
  }

  function toTokenString(lines) {
    const out = new Array(lines.length);
    for (let i = 0; i < lines.length; i++) out[i] = tokenForLine(lines[i]);
    return out.join('');
  }

  return { a: toTokenString(linesA), b: toTokenString(linesB) };
}

function fmtMB(bytes) {
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}

function heapUsed() {
  return process.memoryUsage().heapUsed;
}

function gcHard() {
  if (typeof global.gc !== 'function') {
    throw new Error('Run with: node --expose-gc memory-bench.mjs');
  }
  // A couple cycles to reduce noise
  global.gc();
  global.gc();
}

function measureRetained(name, fn, runs = 20) {
  gcHard();
  const start = heapUsed();

  // Keep outputs alive to measure retained growth
  const keep = [];

  for (let i = 0; i < runs; i++) {
    keep.push(fn());
  }

  gcHard();
  const end = heapUsed();

  const totalGrowth = end - start;
  console.log(`--- Memory (retained outputs): ${name} ---`);
  console.log(`Total Heap Growth (${runs} runs): ${fmtMB(totalGrowth)}`);
  console.log(`Avg Retained per Run:          ${fmtMB(totalGrowth / runs)}`);
  process.stdout.write(''); // keep output stable
}

function measureNoRetention(name, fn, runs = 20) {
  gcHard();
  const start = heapUsed();
  let peak = start;

  for (let i = 0; i < runs; i++) {
    fn(); // do NOT retain
    const cur = heapUsed();
    if (cur > peak) peak = cur;
  }

  gcHard();
  const end = heapUsed();

  console.log(`--- Memory (no retention): ${name} ---`);
  console.log(`Start Heap: ${fmtMB(start)}`);
  console.log(`Peak Heap:  ${fmtMB(peak)}`);
  console.log(`End Heap:   ${fmtMB(end)}`);
  process.stdout.write('');
}

// ─────────────────────────────────────────────────────────────
// INPUT
// ─────────────────────────────────────────────────────────────
const rawA = fs.readFileSync('fileA.txt', 'utf8');
const rawB = fs.readFileSync('fileB.txt', 'utf8');

// Pre-tokenize once for memory benches (so we measure algorithm memory,
// not file IO repeatedly). Tokenization still costs memory; it exists.
const tokenized = buildLineTokenStrings(rawA, rawB);
const tokenA = tokenized.a;
const tokenB = tokenized.b;

// ─────────────────────────────────────────────────────────────
// RUNS
// ─────────────────────────────────────────────────────────────

// 1) Custom diff (line-based)
measureRetained('Custom Myers (line, Int32Array)', () => {
  // For memory fairness: remove time/depth guards
  // Adjust opts signature if needed.
  return customFastDiff(rawA, rawB, {
    budgetBytes: 512 * 1024 * 1024,
    maxMillis: 60_000,
  });
});

measureNoRetention('Custom Myers (line, Int32Array)', () => {
  return customFastDiff(rawA, rawB, {
    budgetBytes: 512 * 1024 * 1024,
    maxMillis: 60_000,
  });
});

// 2) fast-diff (line tokenized)
measureRetained('fast-diff (line tokens, tuple array)', () => {
  return fastDiff(tokenA, tokenB);
});

measureNoRetention('fast-diff (line tokens, tuple array)', () => {
  return fastDiff(tokenA, tokenB);
});

// Optional: fast-diff best case (raw char)
if ((process.env.FASTDIFF_CHAR ?? '0') === '1') {
  measureRetained('fast-diff (char, tuple array)', () => {
    return fastDiff(rawA, rawB);
  });

  measureNoRetention('fast-diff (char, tuple array)', () => {
    return fastDiff(rawA, rawB);
  });
}

// 3) jsdiff (diffLines)
measureRetained('jsdiff diffLines (line, object array)', () => {
  return jsdiffLines(rawA, rawB);
});

measureNoRetention('jsdiff diffLines (line, object array)', () => {
  return jsdiffLines(rawA, rawB);
});
