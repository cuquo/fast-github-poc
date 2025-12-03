import 'server-only';
/**
 * Count lines in a text efficiently.
 * - O(n) time, O(1) extra memory
 * - Handles: LF (\n), CR (\r), CRLF (\r\n)
 * - Optional: trim final newline
 */
export function numberOfLines(
  text: string,
  opts?: { trimFinalNewline?: boolean },
): number {
  const n = text.length;
  if (n === 0) return 0;

  // Lines = newline separators + 1
  let lines = 1;

  for (let i = 0; i < n; i++) {
    const ch = text.charCodeAt(i);

    if (ch === 10) {
      // '\n' (LF) → always counts as new line
      lines++;
    } else if (ch === 13) {
      // '\r' (CR)
      // If CRLF, skip here because next '\n' will be counted
      if (i + 1 < n && text.charCodeAt(i + 1) === 10) {
        // CRLF → do nothing here
      } else {
        // Single CR → counts as new line
        lines++;
      }
    }
  }

  // Optionally remove a trailing blank line
  if (opts?.trimFinalNewline && lines > 0) {
    const last = text.charCodeAt(n - 1);

    // If text ends with \n or \r, then last line is empty → subtract 1
    if (last === 10 || last === 13) {
      lines--;
    }
  }

  return lines;
}

export function countLinesAndLoc(
  text: string,
  opts?: { trimFinalNewline?: boolean },
): { total: number; loc: number } {
  const total = numberOfLines(text, opts);
  const endsWithNewline = text.endsWith('\n') || text.endsWith('\r');

  let lines = text.split(/\r\n|\r|\n/);

  if (
    opts?.trimFinalNewline &&
    endsWithNewline &&
    lines.length > 0 &&
    lines[lines.length - 1] === ''
  ) {
    lines = lines.slice(0, -1);
  }

  let loc = 0;

  for (const line of lines) {
    if (/\S/.test(line)) loc++;
  }

  return { loc, total };
}
