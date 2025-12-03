import 'server-only';

import type { SplitRenderableRow } from './split-diff';

const DIFF_ROW_HEIGHT_PX = 24;
const DIFF_FILE_HEADER_PX = 42;

export function estimateDiffIntrinsicBlockSize(
  rows: SplitRenderableRow[],
): number {
  const rowsHeight = rows.length * DIFF_ROW_HEIGHT_PX;

  // 1px from border + shadow + padding + margin
  const padding = 21;

  return DIFF_FILE_HEADER_PX + rowsHeight + padding;
}
