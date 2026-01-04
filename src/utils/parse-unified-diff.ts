import 'server-only';

export type DiffLineKind = 'context' | 'add' | 'del' | 'hunk' | 'no-eol';

export type DiffLine = {
  kind: DiffLineKind; // 'context' | 'add' | 'del' (parser no emite 'no-eol')
  /** Line number in old file (null for pure additions) */
  oldLine: number | null;
  /** Line number in new file (null for pure deletions) */
  newLine: number | null;
  /** Raw line content without prefix (" ", "+", "-") */
  content: string;

  /**
   * Git marker: "\ No newline at end of file"
   * This does NOT represent a real diff line; it annotates the previous emitted line.
   *
   * - noEolOld: marker applies to the old side of the previous line (usually after a '-' line)
   * - noEolNew: marker applies to the new side of the previous line (usually after a '+' line)
   */
  noEolOld?: boolean;
  noEolNew?: boolean;
};

export type DiffHunk = {
  header: string;
  oldStart: number;
  oldLines: number | null;
  newStart: number;
  newLines: number | null;
  lines: DiffLine[];
};

/**
 * Parse a unified diff patch (GitHub pulls.listFiles `patch` field)
 * into hunks and typed lines with line numbers.
 *
 * Important:
 * - We DO NOT emit a synthetic "no-eol" line.
 * - Instead, we annotate the previous emitted line with noEolOld/noEolNew flags.
 *   The UI layer (patchToRenderableRows) can "expand" those flags into a render-only row.
 */
export function parseUnifiedPatch(patch: string): DiffHunk[] {
  const lines = patch.split('\n');
  const hunks: DiffHunk[] = [];

  let currentHunk: DiffHunk | null = null;
  let oldLine = 0;
  let newLine = 0;

  const hunkHeaderRegex = /^@@ -(\d+)(?:,(\d+))? \+(\d+)(?:,(\d+))? @@(.*)$/;

  for (const rawLine of lines) {
    const headerMatch = rawLine.match(hunkHeaderRegex);

    if (headerMatch) {
      const [, oldStartStr, oldLinesStr, newStartStr, newLinesStr] =
        headerMatch;

      const oldStart = Number(oldStartStr);
      const newStart = Number(newStartStr);
      const oldLinesCount = oldLinesStr ? Number(oldLinesStr) : null;
      const newLinesCount = newLinesStr ? Number(newLinesStr) : null;

      currentHunk = {
        header: rawLine,
        lines: [],
        newLines: newLinesCount,
        newStart,
        oldLines: oldLinesCount,
        oldStart,
      };

      hunks.push(currentHunk);

      // Initialize line counters for this hunk
      oldLine = oldStart;
      newLine = newStart;

      continue;
    }

    if (!currentHunk) {
      // Lines before first hunk header are rare; ignore them safely
      continue;
    }

    // Special Git diff marker: annotate the previous emitted line
    if (rawLine === '\\ No newline at end of file') {
      const last = currentHunk.lines[currentHunk.lines.length - 1];
      if (last) {
        // Decide which side this marker belongs to based on the last line kind
        // - after '-' => old side has no EOL
        // - after '+' => new side has no EOL
        // - after 'context' => both sides (rare, but safe)
        if (last.kind === 'del') last.noEolOld = true;
        else if (last.kind === 'add') last.noEolNew = true;
        else {
          last.noEolOld = true;
          last.noEolNew = true;
        }
      }
      continue;
    }

    const prefix = rawLine[0];
    const content = rawLine.slice(1);

    switch (prefix) {
      case ' ': {
        currentHunk.lines.push({
          content,
          kind: 'context',
          newLine,
          oldLine,
        });
        oldLine += 1;
        newLine += 1;
        break;
      }
      case '-': {
        currentHunk.lines.push({
          content,
          kind: 'del',
          newLine: null,
          oldLine,
        });
        oldLine += 1;
        break;
      }
      case '+': {
        currentHunk.lines.push({
          content,
          kind: 'add',
          newLine,
          oldLine: null,
        });
        newLine += 1;
        break;
      }
      default: {
        // Fallback: treat as context line without prefix
        currentHunk.lines.push({
          content: rawLine,
          kind: 'context',
          newLine,
          oldLine,
        });
        oldLine += 1;
        newLine += 1;
      }
    }
  }

  return hunks;
}
