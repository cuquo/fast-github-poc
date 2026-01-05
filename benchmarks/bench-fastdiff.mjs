// bench-fastdiff.mjs
import fs from 'node:fs';

import fastDiff from 'fast-diff';

/**
 * This benchmark is intentionally minimal and fair:
 * - hyperfine handles warmup & repetition
 * - file IO is done once
 * - fast-diff runs on line-tokenized input (recommended usage)
 * - no workers, no artificial timeouts, no GC tricks
 */

/**
 * Keep consistent with other benches.
 */
const SPLIT_RE = /\r\n|\r|\n/;

function encodeId(id) {
  const hi = (id >>> 16) & 0xffff;
  const lo = id & 0xffff;
  return String.fromCharCode(hi, lo);
}

/**
 * Converts two texts into tokenized strings where
 * each unique line maps to a stable 2-char token.
 *
 * This is the canonical way to use fast-diff for line diffs.
 */
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
    for (let i = 0; i < lines.length; i++) {
      out[i] = tokenForLine(lines[i]);
    }
    return out.join('');
  }

  return {
    a: toTokenString(linesA),
    b: toTokenString(linesB),
  };
}

// ─────────────────────────────────────────────────────────────
// INPUT (done once, not measured)
// ─────────────────────────────────────────────────────────────

const rawA = fs.readFileSync('fileA.txt', 'utf8');
const rawB = fs.readFileSync('fileB.txt', 'utf8');

// Pre-tokenize once so we measure diff cost, not setup cost
const { a: tokenA, b: tokenB } = buildLineTokenStrings(rawA, rawB);

// ─────────────────────────────────────────────────────────────
// BENCHMARK
// ─────────────────────────────────────────────────────────────

// The return value is intentionally ignored.
// hyperfine measures execution time only.
fastDiff(tokenA, tokenB);
