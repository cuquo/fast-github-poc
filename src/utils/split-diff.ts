import 'server-only';

import { computeLCSPairs } from './lcs';
import type { DiffHunk, DiffLine } from './parse-unified-diff';

export type SplitRowKind = 'context' | 'add' | 'del' | 'change' | 'no-eol';

export type SplitDiffRow = {
  kind: SplitRowKind;
  oldLine: number | null;
  newLine: number | null;
  oldContent: string | null;
  newContent: string | null;
};

export type SplitRenderableRow =
  | {
      type: 'hunk';
      hunkIndex: number;
      header: string;
      oldStart: number;
      newStart: number;
    }
  | {
      type: 'line';
      hunkIndex: number;
      row: SplitDiffRow;
    };

const NO_EOL_MARKER = '\\ No newline at end of file';

function pushNoEolRowIfNeeded(
  out: SplitDiffRow[],
  flags: { old?: boolean; new?: boolean },
) {
  if (!flags.old && !flags.new) return;

  out.push({
    kind: 'no-eol',
    newContent: flags.new ? NO_EOL_MARKER : null,
    newLine: null,
    oldContent: flags.old ? NO_EOL_MARKER : null,
    oldLine: null,
  });
}

/**
 * Convert a single hunk into split-view rows using LCS pairing
 * for blocks of deletions followed by additions.
 *
 */
export function hunkToSplitRows(hunk: DiffHunk): SplitDiffRow[] {
  const rows: SplitDiffRow[] = [];
  const lines = hunk.lines;
  let i = 0;

  while (i < lines.length) {
    const line = lines[i];

    // Context lines map 1:1 on both sides
    if (line.kind === 'context') {
      rows.push({
        kind: 'context',
        newContent: line.content,
        newLine: line.newLine,
        oldContent: line.content,
        oldLine: line.oldLine,
      });

      // Expand "no newline at end of file" markers that annotate this line.
      pushNoEolRowIfNeeded(rows, {
        new: line.noEolNew === true,
        old: line.noEolOld === true,
      });

      i += 1;
      continue;
    }

    // Block starting with deletions: collect contiguous dels then contiguous adds,
    // then use LCS to align them.
    if (line.kind === 'del') {
      const deletions: DiffLine[] = [];
      const additions: DiffLine[] = [];

      // Collect consecutive deletions
      let j = i;
      while (j < lines.length && lines[j].kind === 'del') {
        deletions.push(lines[j]);
        j += 1;
      }

      // Collect consecutive additions right after the deletions
      let k = j;
      while (k < lines.length && lines[k].kind === 'add') {
        additions.push(lines[k]);
        k += 1;
      }

      // If there are no additions, this is a pure deletion block
      if (additions.length === 0) {
        for (const delLine of deletions) {
          rows.push({
            kind: 'del',
            newContent: null,
            newLine: null,
            oldContent: delLine.content,
            oldLine: delLine.oldLine,
          });

          // Marker applies to old side for deletions
          pushNoEolRowIfNeeded(rows, {
            new: false,
            old: delLine.noEolOld === true,
          });
        }

        i = j;
        continue;
      }

      // LCS on line content (string tokens) to enable hashing + fast diff path.
      const delTokens = deletions.map((d) => d.content);
      const addTokens = additions.map((a) => a.content);

      const pairs = computeLCSPairs(delTokens, addTokens, Object.is, {
        budgetBytes: 8 * 1024 * 1024,
        // Optional: keep this block-level diff cheap. Tune as needed.
        maxMillis: 25,
        preferFastPath: true,
      });

      let delIndex = 0;
      let addIndex = 0;
      let pairIndex = 0;

      const emitSegment = (delTo: number, addTo: number) => {
        const delCount = delTo - delIndex;
        const addCount = addTo - addIndex;
        const count = Math.max(delCount, addCount);

        for (let offset = 0; offset < count; offset += 1) {
          const delLine =
            delIndex + offset < delTo ? deletions[delIndex + offset] : null;
          const addLine =
            addIndex + offset < addTo ? additions[addIndex + offset] : null;

          if (delLine && addLine) {
            // Both sides present → treat as a changed line (single row)
            rows.push({
              kind: 'change',
              newContent: addLine.content,
              newLine: addLine.newLine,
              oldContent: delLine.content,
              oldLine: delLine.oldLine,
            });

            // Markers: old from delLine, new from addLine
            pushNoEolRowIfNeeded(rows, {
              new: addLine.noEolNew === true,
              old: delLine.noEolOld === true,
            });
          } else if (delLine) {
            rows.push({
              kind: 'del',
              newContent: null,
              newLine: null,
              oldContent: delLine.content,
              oldLine: delLine.oldLine,
            });

            pushNoEolRowIfNeeded(rows, {
              new: false,
              old: delLine.noEolOld === true,
            });
          } else if (addLine) {
            rows.push({
              kind: 'add',
              newContent: addLine.content,
              newLine: addLine.newLine,
              oldContent: null,
              oldLine: null,
            });

            pushNoEolRowIfNeeded(rows, {
              new: addLine.noEolNew === true,
              old: false,
            });
          }
        }

        delIndex = delTo;
        addIndex = addTo;
      };

      // Walk over LCS pairs, emitting unmatched segments as changes/del/add,
      // and matched pairs as context lines.
      while (pairIndex < pairs.length) {
        const pair = pairs[pairIndex];

        // Emit unmatched region before this pair
        if (pair.aIndex > delIndex || pair.bIndex > addIndex) {
          emitSegment(pair.aIndex, pair.bIndex);
        }

        const delLine = deletions[pair.aIndex];
        const addLine = additions[pair.bIndex];

        // This line is identical on both sides → context row inside the block
        rows.push({
          kind: 'context',
          newContent: addLine.content,
          newLine: addLine.newLine,
          oldContent: delLine.content,
          oldLine: delLine.oldLine,
        });

        // Markers can still be present; preserve them.
        pushNoEolRowIfNeeded(rows, {
          new: addLine.noEolNew === true,
          old: delLine.noEolOld === true,
        });

        delIndex = pair.aIndex + 1;
        addIndex = pair.bIndex + 1;
        pairIndex += 1;
      }

      // Emit any trailing unmatched region after the last pair
      if (delIndex < deletions.length || addIndex < additions.length) {
        emitSegment(deletions.length, additions.length);
      }

      i = k;
      continue;
    }

    // Block starting with additions (no preceding deletions)
    if (line.kind === 'add') {
      const additions: DiffLine[] = [];
      let j = i;

      while (j < lines.length && lines[j].kind === 'add') {
        additions.push(lines[j]);
        j += 1;
      }

      for (const addLine of additions) {
        rows.push({
          kind: 'add',
          newContent: addLine.content,
          newLine: addLine.newLine,
          oldContent: null,
          oldLine: null,
        });

        // Marker applies to new side for additions
        pushNoEolRowIfNeeded(rows, {
          new: addLine.noEolNew === true,
          old: false,
        });
      }

      i = j;
      continue;
    }

    // Fallback: treat anything unexpected as context
    rows.push({
      kind: 'context',
      newContent: line.content,
      newLine: line.newLine,
      oldContent: line.content,
      oldLine: line.oldLine,
    });

    pushNoEolRowIfNeeded(rows, {
      new: line.noEolNew === true,
      old: line.noEolOld === true,
    });

    i += 1;
  }

  return rows;
}

/**
 * Convert a full patch (all hunks) into split-view rows.
 */
export function patchToSplitRows(hunks: DiffHunk[]): SplitDiffRow[] {
  return hunks.flatMap((hunk) => hunkToSplitRows(hunk));
}

/**
 * Convert a full patch (all hunks) into a flat list of
 * renderable rows (hunk headers + line rows).
 */
export function patchToRenderableRows(hunks: DiffHunk[]): SplitRenderableRow[] {
  return hunks.flatMap((hunk, hunkIndex) => {
    const headerRow: SplitRenderableRow = {
      header: hunk.header,
      hunkIndex,
      newStart: hunk.newStart,
      oldStart: hunk.oldStart,
      type: 'hunk',
    };

    const lineRows: SplitRenderableRow[] = hunkToSplitRows(hunk).map((row) => ({
      hunkIndex,
      row,
      type: 'line',
    }));

    return [headerRow, ...lineRows];
  });
}
