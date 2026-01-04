import 'server-only';

import { clsx } from 'clsx/lite';

import NoEntryIcon from '@/icons/no-entry-icon';
import type { SplitDiffRow } from '@/utils/split-diff';

import { renderHighlightedHtml } from './render-highlighted-html';

function codePrefixClass(side: 'left' | 'right', kind: SplitDiffRow['kind']) {
  const needsPrefix =
    (side === 'right' && (kind === 'add' || kind === 'change')) ||
    (side === 'left' && (kind === 'del' || kind === 'change'));

  if (!needsPrefix) return 'px-6';

  const symbol =
    kind === 'change'
      ? side === 'left'
        ? '-'
        : '+'
      : kind === 'add'
        ? '+'
        : '-';
  const contentClass =
    symbol === '+' ? "before:content-['+']" : "before:content-['-']";

  return clsx(
    'relative pl-6',
    'before:-ml-4 before:inline-block before:w-4',
    'before:select-none before:font-mono before:text-fg-default',
    contentClass,
  );
}

export function renderLineRow(
  id: string,
  index: number,
  row: SplitDiffRow,
  hasSyntaxHighlighting: boolean,
  highlight?: { oldHtml: string | null; newHtml: string | null },
) {
  const { oldLine, newLine, oldContent, newContent, kind } = row;

  const isNoEol = row.kind === 'no-eol';
  const hasNoNewlineLeft = isNoEol && row.oldContent != null;
  const hasNoNewlineRight = isNoEol && row.newContent != null;

  const leftColumnContent = hasNoNewlineLeft ? (
    <span className="flex h-6 items-center">
      <NoEntryIcon className="fill-[#f85149]" />
    </span>
  ) : highlight?.oldHtml ? (
    renderHighlightedHtml(highlight.oldHtml) || '\u00A0'
  ) : (
    oldContent || '\u00A0'
  );
  const rightColumnContent = hasNoNewlineRight ? (
    <span className="flex h-6 items-center">
      <NoEntryIcon className="fill-[#f85149]" />
    </span>
  ) : highlight?.newHtml ? (
    renderHighlightedHtml(highlight.newHtml) || '\u00A0'
  ) : (
    newContent || '\u00A0'
  );

  return (
    <tr
      className="leading-6 contain-layout"
      id={`line-${id}-${index}`}
      key={`line-${id}-${index}`}
    >
      <td
        className={clsx(
          'w-[1%] min-w-3 select-none text-center align-top text-xs',
          kind === 'del' || kind === 'change'
            ? 'bg-[#552527] text-fg-default'
            : 'text-fg-muted',
          kind === 'add' && 'bg-[#151b23]',
        )}
        {...(oldLine !== null && { id: `${id}L${oldLine}` })}
        tabIndex={-1}
      >
        <code className="font-mono leading-6">{oldLine ?? ''}</code>
      </td>

      <td
        className={clsx(
          'border-r-(length:--borderWidth-thin) relative border-border-default align-top',
          !hasSyntaxHighlighting && 'text-fg-muted',
          (kind === 'del' || kind === 'change') && 'bg-[#26191C]',
          kind === 'add' && 'bg-[#151b23]',
        )}
      >
        <div
          className={clsx(
            'diff-code diff-code-left wrap-break-word flex whitespace-pre-wrap text-wrap px-6 font-mono text-xs leading-6 [text-rendering:optimizeSpeed]',
            codePrefixClass('left', kind),
            row.oldContent === null && 'select-none!',
          )}
          tabIndex={-1}
        >
          {leftColumnContent}
        </div>
      </td>

      <td
        className={clsx(
          'w-[1%] min-w-13 select-none text-center align-top text-xs',
          kind === 'add' || kind === 'change'
            ? 'bg-[#1F4429] text-fg-default'
            : 'text-fg-muted',
          kind === 'del' && 'bg-[#151b23]',
        )}
        {...(newLine !== null && { id: `${id}R${newLine}` })}
        tabIndex={-1}
      >
        <code className="font-mono leading-6">{newLine ?? ''}</code>
      </td>

      <td
        className={clsx(
          'relative',
          (kind === 'add' || kind === 'change') && 'bg-[#14261D] align-top',
          kind === 'del' && 'bg-[#151b23]',
        )}
      >
        <div
          className={clsx(
            'diff-code wrap-break-word diff-code-right flex whitespace-pre-wrap text-wrap px-6 font-mono text-xs leading-6 [text-rendering:optimizeSpeed]',
            codePrefixClass('right', kind),
            row.newContent === null && 'select-none!',
          )}
          tabIndex={-1}
        >
          {rightColumnContent}
        </div>
      </td>
    </tr>
  );
}
