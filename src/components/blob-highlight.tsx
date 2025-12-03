/** biome-ignore-all lint/security/noDangerouslySetInnerHtml: needed for blob rendering */
import 'server-only';

import { clsx } from 'clsx/lite';
import { use } from 'react';

import { NUMBER_OF_VISIBLE_LINES } from '@/constants/options';
import { renderHTML } from '@/utils/render-html';
import { splitHighlightedHtmlIntoLines } from '@/utils/split-highlighted-html-into-lines';
import {
  countTrailingVisuallyEmpty,
  ensureVisibleLine,
} from '@/utils/visually-lines';

export default function BlobHighlight({
  context,
  text,
  isBinary,
  path,
}: {
  context: string;
  text: string;
  isBinary?: boolean | null;
  path: string;
}) {
  if (isBinary) return <span>Binary file</span>;

  let blobExtension = path.split('.').pop()?.toLowerCase();
  blobExtension = blobExtension === 'eslintignore' ? 'ignore' : blobExtension;
  blobExtension = blobExtension === 'prettierignore' ? 'ignore' : blobExtension;
  blobExtension = blobExtension === 'plist' ? 'json' : blobExtension;
  blobExtension = blobExtension === 'json' ? 'jsonc' : blobExtension;
  blobExtension = path.toLowerCase().endsWith('cargo.lock')
    ? 'toml'
    : blobExtension;
  blobExtension = path.toLowerCase().endsWith('.git-blame-ignore-revs')
    ? 'ignore'
    : blobExtension;

  const formatText = `\`\`\`${blobExtension ?? ''}\n${text}\n\`\`\``;
  const blobText = use(renderHTML(formatText, context));

  const hadTrailingNewline = text.endsWith('\n');
  const splitText = splitHighlightedHtmlIntoLines(blobText, hadTrailingNewline);

  // group lines by NUMBER_OF_VISIBLE_LINES to apply content-visibility
  const groups: string[][] = [];
  for (let i = 0; i < splitText.length; i += NUMBER_OF_VISIBLE_LINES) {
    groups.push(splitText.slice(i, i + NUMBER_OF_VISIBLE_LINES));
  }

  const chunks = groups.map((group, groupIdx) => {
    const isLastGroup = groupIdx === groups.length - 1;

    // Only trim visually-empty tail from the LAST group
    const trailingEmpty = isLastGroup ? countTrailingVisuallyEmpty(group) : 0;
    const visibleCount = group.length - trailingEmpty;

    const chunk = (
      <div
        className="contain-[layout_paint_style] flex min-w-max"
        key={`group-${
          // biome-ignore lint/suspicious/noArrayIndexKey: check later
          groupIdx
        }-chunk`}
        style={{
          containIntrinsicSize: `0px ${visibleCount * 20}px`,
          contentVisibility: 'auto',
        }}
      >
        <div className="flex w-18 shrink-0 flex-col items-end">
          {Array.from({ length: group.length }, (_, i) => {
            const lineId = groupIdx * NUMBER_OF_VISIBLE_LINES + 1 + i;

            if (isLastGroup && i >= group.length - trailingEmpty) return null;

            return (
              <a
                className={clsx(
                  'hover:no-underline! inline-flex h-5 w-auto items-center justify-end px-4 font-mono text-fg-muted! text-xs hover:text-fg-default!',
                  'target:after:absolute target:after:left-0 target:after:h-5 target:after:w-full target:after:bg-bg-attention-muted',
                  'target:after:border-bg-attention-emphasis target:after:border-l-2',
                  'scroll-mt-[30vh] target:text-fg-default',
                )}
                href={`${path}#L${lineId}`}
                id={`L${lineId}`}
                key={`line-num-${
                  // biome-ignore lint/suspicious/noArrayIndexKey: line number
                  i
                }`}
              >
                {lineId}
              </a>
            );
          })}
        </div>
        <div className="pl-5">
          {group.map((line, i) => {
            // skip visually-empty tail lines on the LAST group
            if (isLastGroup && i >= group.length - trailingEmpty) return null;

            const lineNumber = groupIdx * NUMBER_OF_VISIBLE_LINES + i + 1;

            return (
              <div
                className="h-5 whitespace-pre font-mono text-xs leading-5"
                dangerouslySetInnerHTML={{
                  __html: ensureVisibleLine(line),
                }}
                key={lineNumber}
              />
            );
          })}
        </div>
      </div>
    );

    return chunk;
  });

  return chunks;
}
