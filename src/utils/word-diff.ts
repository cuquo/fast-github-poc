import 'server-only';

import { diffIds } from './fast-diff';

export type DiffSegment = {
  type: 'same' | 'del' | 'add';
  text: string;
};

export type WordDiffResult = {
  oldSegments: DiffSegment[];
  newSegments: DiffSegment[];
};

/**
 * Compute word-level diff between two strings.
 * Uses Myers algorithm from fast-diff for memory efficiency.
 */
export function computeWordDiff(
  oldStr: string,
  newStr: string,
): WordDiffResult {
  // Tokenize into words (preserving whitespace as separate tokens)
  const oldTokens = tokenize(oldStr);
  const newTokens = tokenize(newStr);

  // Hash tokens to integer IDs for fast-diff
  const { idsA, idsB } = hashTokens(oldTokens, newTokens);

  // Use Myers algorithm from fast-diff
  const { pairs } = diffIds(idsA, idsB, {
    budgetBytes: 1024 * 1024, // 1MB budget for word-level diff
    maxMillis: 10, // 10ms max per line
  });

  // Convert pairs to LCS format
  const lcs = pairs.map((p) => ({ newIdx: p.bIndex, oldIdx: p.aIndex }));

  // Build segments from LCS
  const oldSegments = buildSegments(oldTokens, lcs, 'old');
  const newSegments = buildSegments(newTokens, lcs, 'new');

  return { newSegments, oldSegments };
}

/**
 * Tokenize string into words, whitespace, and punctuation.
 * Separates punctuation to allow finer-grained diffs.
 * Example: "headers()" → ["headers", "(", ")"]
 */
function tokenize(str: string): string[] {
  // Match: whitespace | word characters | single punctuation/symbol
  const regex = /(\s+|[\w]+|[^\s\w])/g;
  return str.match(regex) ?? [];
}

/**
 * Hash tokens to integer IDs for use with diffIds.
 */
function hashTokens(
  oldTokens: string[],
  newTokens: string[],
): { idsA: Int32Array; idsB: Int32Array } {
  const map = new Map<string, number>();
  let nextId = 0;

  const idsA = new Int32Array(oldTokens.length);
  for (let i = 0; i < oldTokens.length; i++) {
    const token = oldTokens[i];
    let id = map.get(token);
    if (id === undefined) {
      id = nextId++;
      map.set(token, id);
    }
    idsA[i] = id;
  }

  const idsB = new Int32Array(newTokens.length);
  for (let i = 0; i < newTokens.length; i++) {
    const token = newTokens[i];
    let id = map.get(token);
    if (id === undefined) {
      id = nextId++;
      map.set(token, id);
    }
    idsB[i] = id;
  }

  return { idsA, idsB };
}

type LCSPair = { oldIdx: number; newIdx: number };

/**
 * Build segments from tokens and LCS pairs.
 */
function buildSegments(
  tokens: string[],
  lcs: LCSPair[],
  side: 'old' | 'new',
): DiffSegment[] {
  const segments: DiffSegment[] = [];
  const lcsSet = new Set(
    lcs.map((p) => (side === 'old' ? p.oldIdx : p.newIdx)),
  );

  let currentSegment: DiffSegment | null = null;

  for (let i = 0; i < tokens.length; i++) {
    const token = tokens[i];
    const isMatch = lcsSet.has(i);
    const type: DiffSegment['type'] = isMatch
      ? 'same'
      : side === 'old'
        ? 'del'
        : 'add';

    if (currentSegment && currentSegment.type === type) {
      // Extend current segment
      currentSegment.text += token;
    } else {
      // Start new segment
      if (currentSegment) {
        segments.push(currentSegment);
      }
      currentSegment = { text: token, type };
    }
  }

  if (currentSegment) {
    segments.push(currentSegment);
  }

  return segments;
}

/**
 * Convert segments to HTML with diff highlighting classes.
 */
export function segmentsToHtml(segments: DiffSegment[]): string {
  return segments
    .map((seg) => {
      const escaped = escapeHtml(seg.text);

      if (seg.type === 'same') {
        return escaped;
      }

      const className = seg.type === 'del' ? 'wd-del' : 'wd-add';
      return `<span class="${className}">${escaped}</span>`;
    })
    .join('');
}

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}
