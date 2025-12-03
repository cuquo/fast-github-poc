import 'server-only';

import { clsx } from 'clsx/lite';
import { use } from 'react';

import { renderHTML } from '@/utils/render-html';

export default function Markdown({
  className,
  context,
  text,
}: {
  className?: string;
  context: string;
  text?: string | null;
}) {
  if (!text) return null;

  const markdownHtml = use(renderHTML(text, context, 'markdown', true));

  if (!markdownHtml) return <span>Unable to render markdown.</span>;

  return (
    <>
      <link href="/assets/markdown.css" precedence="medium" rel="stylesheet" />
      <link
        href="/assets/syntax-highlighting.css"
        precedence="medium"
        rel="stylesheet"
      />
      <article
        className={clsx('markdown-body', className)}
        // biome-ignore lint/security/noDangerouslySetInnerHtml: necessary for markdown rendering
        dangerouslySetInnerHTML={{ __html: markdownHtml }}
      />
    </>
  );
}
