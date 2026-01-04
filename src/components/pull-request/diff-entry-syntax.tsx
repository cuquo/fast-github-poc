import 'server-only';

import { use } from 'react';

import { getPageHighlights } from '@/utils/batch-highlight';
import type { PullRequestFile } from '@/utils/pr-diff-types';

import DiffEntryWrapper from './diff-entry-wrapper';
import { renderHunkRow } from './render-hunk-row';
import { renderLineRow } from './render-line-row';

export default function DiffEntrySyntax({
  fcp,
  fileIndex,
  id,
  inputId,
  name,
  owner,
  page,
  prId,
}: {
  fcp?: PullRequestFile['fcp'];
  fileIndex: number;
  id: string;
  inputId: string;
  name: string;
  owner: string;
  page: number;
  prId: number;
}) {
  const data =
    fcp || use(getPageHighlights(owner, name, prId, page))[fileIndex];

  if (!data) return null;

  const {
    aproximateHeight,
    additions,
    deletions,
    filename,
    previous_filename,
    hasLargeRow,
    rows,
    highlightedNew,
    highlightedOld,
  } = data;

  let oldIndex = 0;
  let newIndex = 0;

  return (
    <DiffEntryWrapper
      additions={additions}
      aproximateHeight={aproximateHeight}
      deletions={deletions}
      filename={filename}
      id={id}
      inputId={inputId}
      previous_filename={previous_filename}
      shouldNotRender={false}
    >
      <table
        className="diff-table w-full min-w-full table-fixed border-collapse"
        {...(fcp && { 'data-fcp': true })}
      >
        <colgroup>
          <col width={hasLargeRow ? 52 : 40} />
          <col />
          <col width={hasLargeRow ? 52 : 40} />
          <col />
        </colgroup>
        <thead className="sr-only">
          <tr>
            <th scope="col">Original file line number</th>
            <th scope="col">Original file line</th>
            <th scope="col">Diff line number</th>
            <th scope="col">Diff line change</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((item, index) => {
            if (item.type === 'hunk') {
              return renderHunkRow(item, index, hasLargeRow);
            }

            const row = item.row;
            let oldHtml: string | null = null;
            let newHtml: string | null = null;

            if (row.oldContent != null && highlightedOld) {
              oldHtml = highlightedOld[oldIndex] ?? null;
              oldIndex += 1;
            }
            if (row.newContent != null && highlightedNew) {
              newHtml = highlightedNew[newIndex] ?? null;
              newIndex += 1;
            }

            return renderLineRow(id, index, row, true, {
              newHtml,
              oldHtml,
            });
          })}
        </tbody>
      </table>
    </DiffEntryWrapper>
  );
}
