/** biome-ignore-all lint/security/noDangerouslySetInnerHtml: highlited code */
import 'server-only';

function stripOuter(html: string) {
  return html
    .replace(/^\s*<pre[^>]*>/, '')
    .replace(/<\/pre>\s*$/, '')
    .replace(/^\s*<code[^>]*>/, '')
    .replace(/<\/code>\s*$/, '');
}

export function renderHighlightedHtml(html: string) {
  const safe = stripOuter(html);
  return <code dangerouslySetInnerHTML={{ __html: safe }} />;
}
