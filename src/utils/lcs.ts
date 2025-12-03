// src/utils/lcs.ts

import { diffIds } from './fast-diff';

export type LCSPair = {
  aIndex: number;
  bIndex: number;
};

export type ComputeLCSOptions = {
  /**
   * If provided and inputs are "hashable" (Object.is), try the fast Myers-based path.
   * Default: true
   */
  preferFastPath?: boolean;

  /**
   * Forwarded to fast diff path when applicable.
   */
  maxMillis?: number;
  budgetBytes?: number;

  /**
   * Upper bound for DP fallback size.
   * DP is O(N*M) memory, so keep this conservative.
   * Default: 20_000 (e.g. 100x200, 140x140, etc.)
   */
  maxDpCells?: number;
};

/**
 * Compute the Longest Common Subsequence (LCS) between two sequences.
 *
 * Strategy:
 * - If isEqual is Object.is (hashable equality) and preferFastPath=true:
 *   run Myers-based LCS via diffIds (fast, budgeted).
 * - Otherwise (custom equality), use DP (correct, but O(N*M)).
 */
export function computeLCSPairs<T>(
  a: readonly T[],
  b: readonly T[],
  isEqual: (x: T, y: T) => boolean,
  opts: ComputeLCSOptions = {},
): LCSPair[] {
  const preferFastPath = opts.preferFastPath ?? true;

  // Only safe to hash when equality is exactly Object.is semantics.
  // If callers pass a custom comparator, hashing would be incorrect.
  const canUseFastPath = preferFastPath && isEqual === Object.is;

  if (canUseFastPath) {
    return computeLCSPairsHashed(a, b, {
      budgetBytes: opts.budgetBytes,
      maxMillis: opts.maxMillis,
    });
  }

  return computeLCSPairsDP(a, b, isEqual, { maxDpCells: opts.maxDpCells });
}

function computeLCSPairsHashed<T>(
  a: readonly T[],
  b: readonly T[],
  opts: { maxMillis?: number; budgetBytes?: number },
): LCSPair[] {
  // Map unique values from A to ids (requires Object.is semantics).
  const map = new Map<T, number>();
  const idsA = new Int32Array(a.length);
  let nextId = 0;

  for (let i = 0; i < a.length; i++) {
    const v = a[i];
    let id = map.get(v);
    if (id === undefined) {
      id = nextId++;
      map.set(v, id);
    }
    idsA[i] = id;
  }

  // Reuse ids for B (add new ids as needed).
  const idsB = new Int32Array(b.length);
  for (let i = 0; i < b.length; i++) {
    const v = b[i];
    let id = map.get(v);
    if (id === undefined) {
      id = nextId++;
      map.set(v, id);
    }
    idsB[i] = id;
  }

  // diffIds returns LCSPair[] already (LCS pairs).
  const { pairs } = diffIds(idsA, idsB, {
    budgetBytes: opts.budgetBytes,
    maxMillis: opts.maxMillis,
  });

  return pairs;
}

/**
 * DP fallback for custom equality.
 * Time/space: O(N*M). Keep this for "small diff hunks" or non-hashable comparators.
 */
function computeLCSPairsDP<T>(
  a: readonly T[],
  b: readonly T[],
  isEqual: (x: T, y: T) => boolean,
  opts: { maxDpCells?: number } = {},
): LCSPair[] {
  const n = a.length;
  const m = b.length;

  const maxDpCells = opts.maxDpCells ?? 20_000;
  if (n * m > maxDpCells) {
    // Strict by design: avoid accidental OOM.
    throw new Error('computeLCSPairsDP: input too large for DP fallback');
  }

  const dp: number[][] = Array.from({ length: n + 1 }, () =>
    Array(m + 1).fill(0),
  );

  for (let i = 1; i <= n; i++) {
    for (let j = 1; j <= m; j++) {
      if (isEqual(a[i - 1], b[j - 1])) dp[i][j] = dp[i - 1][j - 1] + 1;
      else dp[i][j] = Math.max(dp[i - 1][j], dp[i][j - 1]);
    }
  }

  const pairs: LCSPair[] = [];
  let i = n;
  let j = m;

  while (i > 0 && j > 0) {
    if (isEqual(a[i - 1], b[j - 1])) {
      pairs.push({ aIndex: i - 1, bIndex: j - 1 });
      i--;
      j--;
    } else if (dp[i - 1][j] >= dp[i][j - 1]) {
      i--;
    } else {
      j--;
    }
  }

  pairs.reverse();
  return pairs;
}
