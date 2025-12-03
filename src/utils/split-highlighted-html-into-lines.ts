/**
 * Split highlighted HTML (inner of <pre>) into per-line HTML strings,
 * preserving tag balance across line breaks and matching trailing-newline semantics.
 */
export function splitHighlightedHtmlIntoLines(
  fullHtml: string,
  hadTrailingNewline: boolean,
): string[] {
  const preInner = extractPreInner(fullHtml);
  if (preInner == null) {
    const lines = fullHtml.split('\n');
    if (
      !hadTrailingNewline &&
      lines.length > 0 &&
      lines[lines.length - 1] === ''
    )
      lines.pop();
    return lines;
  }

  const tokens = tokenize(preInner);
  const openStack: string[] = [];
  const lines: string[] = [''];

  const append = (s: string) => {
    lines[lines.length - 1] += s;
  };

  const lineBreak = () => {
    // close all
    for (let i = openStack.length - 1; i >= 0; i--) {
      append(`</${tagName(openStack[i])}>`);
    }
    // new line
    lines.push('');
    // reopen all
    for (let i = 0; i < openStack.length; i++) {
      append(openStack[i]);
    }
  };

  for (const tok of tokens) {
    if (tok.startsWith('<')) {
      if (isSelfClosingTag(tok)) {
        append(tok);
      } else if (isOpeningTag(tok)) {
        openStack.push(tok);
        append(tok);
      } else if (isClosingTag(tok)) {
        append(tok);
        const name = tagName(tok);
        for (let i = openStack.length - 1; i >= 0; i--) {
          if (tagName(openStack[i]) === name) {
            openStack.splice(i, 1);
            break;
          }
        }
      } else {
        append(tok);
      }
    } else {
      if (tok.includes('\n')) {
        const parts = tok.split('\n');
        parts.forEach((seg, idx) => {
          append(seg);
          if (idx < parts.length - 1) lineBreak();
        });
      } else {
        append(tok);
      }
    }
  }

  // Close anything still open at EOF
  if (openStack.length > 0) {
    for (let i = openStack.length - 1; i >= 0; i--) {
      append(`</${tagName(openStack[i])}>`);
    }
    openStack.length = 0;
  }

  // Remove final empty line only if original text did NOT end with newline
  if (!hadTrailingNewline && lines.length > 0 && lines[lines.length - 1] === '')
    lines.pop();

  return lines;
}

function extractPreInner(html: string): string | null {
  if (!html.includes('<pre')) return null;
  const m = html.match(/<pre[^>]*>([\s\S]*?)<\/pre>/i);
  return m ? m[1] : null;
}

function tagName(tok: string): string {
  const m = tok.match(/^<\/?\s*([a-zA-Z][^\s/>]*)/);
  return m ? m[1].toLowerCase() : '';
}

function tokenize(html: string): string[] {
  const parts = html.split(/(<[^>]+>)/g);
  return parts.filter((p) => p.length > 0);
}

function isSelfClosingTag(tok: string): boolean {
  return /^<[^>]+\/>$/.test(tok);
}

function isClosingTag(tok: string): boolean {
  return /^<\/[^>]+>$/.test(tok);
}

function isOpeningTag(tok: string): boolean {
  return /^<([a-zA-Z][^\s/>]*)(?:\s[^>]*)?>$/.test(tok);
}
