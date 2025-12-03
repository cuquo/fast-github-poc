/*
  Line helpers (outside the component)
  - isVisuallyEmpty: a line that contains only tags/nbsp
  - ensureVisibleLine: inject &nbsp; when a line would collapse
  - countTrailingVisuallyEmpty: how many empty-visual lines at the tail
 */
function isVisuallyEmpty(html: string): boolean {
  const plain = (html ?? '')
    .replace(/<[^>]*>/g, '') // strip tags
    .replace(/&nbsp;|&#160;/gi, ' ') // normalize nbsp
    .trim();
  return plain.length === 0;
}

export function ensureVisibleLine(html: string): string {
  if (html == null) return '&nbsp;';
  if (!isVisuallyEmpty(html)) return html;

  // Special case: empty <code></code> → put a NBSP inside to preserve height
  if (/<code[^>]*><\/code>/i.test(html)) {
    return html.replace(/(<code[^>]*>)(<\/code>)/i, '$1&nbsp;$2');
  }
  return '&nbsp;';
}

export function countTrailingVisuallyEmpty(lines: string[]): number {
  let n = 0;
  for (let i = lines.length - 1; i >= 0; i--) {
    if (isVisuallyEmpty(lines[i])) n++;
    else break;
  }
  return n;
}
