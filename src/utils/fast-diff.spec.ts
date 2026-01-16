import { describe, expect, it } from 'bun:test';

import * as fc from 'fast-check';

import { diffIds, fastDiff, type LCSPair, SPLIT_RE } from './fast-diff';

function assertInvariants(
  tokensA: string[],
  tokensB: string[],
  pairs: LCSPair[],
) {
  let prevA = -1;
  let prevB = -1;
  for (let i = 0; i < pairs.length; i++) {
    const { aIndex, bIndex } = pairs[i];
    if (aIndex < 0 || aIndex >= tokensA.length) throw new Error(`aIndex OOB`);
    if (bIndex < 0 || bIndex >= tokensB.length) throw new Error(`bIndex OOB`);
    if (aIndex <= prevA) throw new Error(`aIndex non-monotonic`);
    if (bIndex <= prevB) throw new Error(`bIndex non-monotonic`);
    if (tokensA[aIndex] !== tokensB[bIndex])
      throw new Error(`Mismatch content`);
    prevA = aIndex;
    prevB = bIndex;
  }
}

function computeLCSLengthDP(tokensA: string[], tokensB: string[]): number {
  const N = tokensA.length;
  const M = tokensB.length;
  let prev = new Int32Array(M + 1);
  let curr = new Int32Array(M + 1);

  for (let i = 1; i <= N; i++) {
    curr[0] = 0;
    const valA = tokensA[i - 1];
    for (let j = 1; j <= M; j++) {
      if (valA === tokensB[j - 1]) curr[j] = prev[j - 1] + 1;
      else curr[j] = Math.max(prev[j], curr[j - 1]);
    }
    const temp = prev;
    prev = curr;
    curr = temp;
  }
  return prev[M];
}

describe('FastDiff Final Release', () => {
  const tokensArb = fc.array(fc.constantFrom('A', 'B', 'C'), { maxLength: 80 });

  it('Invariants: monotonicity & equality', () => {
    fc.assert(
      fc.property(tokensArb, tokensArb, (tokensA, tokensB) => {
        const textA = tokensA.join('\n');
        const textB = tokensB.join('\n');
        const realA = textA === '' ? [] : textA.split(SPLIT_RE);
        const realB = textB === '' ? [] : textB.split(SPLIT_RE);

        const { pairs } = fastDiff(textA, textB);
        assertInvariants(realA, realB, pairs);
      }),
      { numRuns: 500, seed: 4242 },
    );
  });

  it('Maximality: matches DP (oracle check)', () => {
    const smallArb = fc.array(fc.constantFrom('A', 'B', 'C', 'D'), {
      maxLength: 40,
    });
    fc.assert(
      fc.property(smallArb, smallArb, (tokensA, tokensB) => {
        const textA = tokensA.join('\n');
        const textB = tokensB.join('\n');
        const realA = textA === '' ? [] : textA.split(SPLIT_RE);
        const realB = textB === '' ? [] : textB.split(SPLIT_RE);

        const { pairs, didFallback } = fastDiff(textA, textB);

        if (!didFallback) {
          const expectedLen = computeLCSLengthDP(realA, realB);
          expect(pairs.length).toBe(expectedLen);
        }
      }),
      { numRuns: 200, seed: 1234 },
    );
  });

  it('Regression: Massive Tie-Breaks (CI Tolerant)', () => {
    const block = Array(800).fill('A');
    const largeA = [...block, 'X', ...block].join('\n');
    const largeB = [...block, 'Y', ...block].join('\n');

    const { pairs, didFallback, reason } = fastDiff(largeA, largeB, {
      budgetBytes: 128 * 1024 * 1024,
      maxMillis: 20000,
    });

    if (!didFallback) {
      expect(pairs.length).toBe(1600);
    } else {
      expect(reason).toBe('time');
    }
  });

  it('Regression: Empty inputs', () => {
    expect(fastDiff('', 'A').pairs).toHaveLength(0);
    expect(fastDiff('A', '').pairs).toHaveLength(0);
    expect(fastDiff('', '').pairs).toHaveLength(0);
  });
});

describe('diffIds small arrays (word-diff case)', () => {
  it('should find LCS in small token arrays', () => {
    // This is the word-diff case: "Other", vs 'Other',
    // Tokens: ['"', 'Other', '"', ','] vs ["'", 'Other', "'", ',']
    // IDs:    [0, 1, 0, 2]              vs [3, 1, 3, 2]
    const idsA = new Int32Array([0, 1, 0, 2]);
    const idsB = new Int32Array([3, 1, 3, 2]);

    const result = diffIds(idsA, idsB, {
      budgetBytes: 1024 * 1024,
      maxMillis: 100,
    });

    // Should find matches at index 1 (Other) and index 3 (comma)
    expect(result.didFallback).toBe(false);
    expect(result.pairs).toContainEqual({ aIndex: 1, bIndex: 1 });
    expect(result.pairs).toContainEqual({ aIndex: 3, bIndex: 3 });
    expect(result.pairs).toHaveLength(2);
  });

  it('should handle single element difference', () => {
    // [A, B] vs [C, B] - should match B
    const idsA = new Int32Array([0, 1]);
    const idsB = new Int32Array([2, 1]);

    const result = diffIds(idsA, idsB);

    expect(result.didFallback).toBe(false);
    expect(result.pairs).toContainEqual({ aIndex: 1, bIndex: 1 });
  });

  it('should handle prefix/suffix matches', () => {
    // [A, X, B] vs [A, Y, B]
    const idsA = new Int32Array([0, 1, 2]);
    const idsB = new Int32Array([0, 3, 2]);

    const result = diffIds(idsA, idsB);

    expect(result.didFallback).toBe(false);
    expect(result.pairs).toHaveLength(2);
    expect(result.pairs).toContainEqual({ aIndex: 0, bIndex: 0 });
    expect(result.pairs).toContainEqual({ aIndex: 2, bIndex: 2 });
  });
});
