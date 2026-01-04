import 'server-only';

import { clsx } from 'clsx/lite';

import FoldUpIcon from '@/icons/fold-up-icon';
import KebabHorizontalIcon from '@/icons/kebab-horizontal-icon';
import UnfoldIcon from '@/icons/unfold-icon';
import type { SplitRenderableRow } from '@/utils/split-diff';

export function renderHunkRow(
  row: Extract<SplitRenderableRow, { type: 'hunk' }>,
  index: number,
  hasLargeRow: boolean,
) {
  const hunkIcon =
    index === 0 && (row.newStart === 1 || row.oldStart === 1) ? (
      <KebabHorizontalIcon className="fill-fg-default" />
    ) : index === 0 && (row.newStart > 1 || row.oldStart > 1) ? (
      <FoldUpIcon className="fill-fg-muted" />
    ) : (
      <UnfoldIcon className="fill-fg-muted" />
    );

  return (
    <tr className="h-6 leading-6" key={`hunk-${index}`}>
      <td className="align-top" colSpan={4}>
        <div className="flex w-full">
          <span
            className={clsx(
              'flex shrink-0 items-center justify-center bg-[#0c2d6b]',
              hasLargeRow ? 'w-13' : 'w-10',
            )}
          >
            {hunkIcon}
          </span>
          <span className="flex w-full select-none bg-[#131D2E] px-6 font-mono text-fg-muted text-xs leading-6">
            {row.header}
          </span>
        </div>
      </td>
    </tr>
  );
}
