import 'server-only';

import { cacheLife } from 'next/cache';
import { cache } from 'react';

import { TOO_LARGE_DIFF_THRESHOLD } from '../constants/options';
import { estimateDiffIntrinsicBlockSize } from './diff-height';
import { guessLanguageFromFile } from './guess-language-from-file';
import { getPatchToRenderableRows } from './patch-to-renderable-rows';
import type { PullRequestFile } from './pr-diff-types';
import { fetchListFiles } from './pr-files-waterfall';
import { renderHTML } from './render-html';
import type { SplitRenderableRow } from './split-diff';

export type HighlightedFileData =
  | {
      additions: number;
      aproximateHeight: number;
      deletions: number;
      filename: string;
      hasLargeRow: boolean;
      highlightedNew: string[];
      highlightedOld: string[];
      previous_filename: string | undefined;
      rows: SplitRenderableRow[];
    }
  | undefined;

const processFileHighlightCached = cache(
  async (
    filename: string,
    status: PullRequestFile['status'],
    changes: number,
    patch: string | null | undefined,
    additions: number,
    deletions: number,
    previous_filename: string | undefined,
  ): Promise<HighlightedFileData> => {
    if (!patch || status === 'removed' || changes > TOO_LARGE_DIFF_THRESHOLD) {
      return undefined;
    }

    const lang = guessLanguageFromFile(filename);
    const rows = getPatchToRenderableRows(patch);
    const aproximateHeight = estimateDiffIntrinsicBlockSize(rows);

    const lastRow = rows[rows.length - 1];
    const hasLargeRow = !!(
      lastRow.type === 'line' &&
      ((lastRow.row.newLine && lastRow.row.newLine >= 1000) ||
        (lastRow.row.oldLine && lastRow.row.oldLine >= 1000))
    );

    const lineRows = rows.filter((r) => r.type === 'line');

    const oldBody = lineRows
      // why? markdown could ignore the first empty line
      .map((r) => (r.row.oldContent === '' ? ' ' : r.row.oldContent))
      .filter((v) => v !== null)
      .join('\n');

    const newBody = lineRows
      // why? markdown could ignore the first empty line
      .map((r) => (r.row.newContent === '' ? ' ' : r.row.newContent))
      .filter((v) => v !== null)
      .join('\n');

    const [oldHtml, newHtml] = await Promise.all([
      renderHTML(oldBody, 'diff-old-context', lang),
      renderHTML(newBody, 'diff-new-context', lang),
    ]);

    return {
      additions,
      aproximateHeight,
      deletions,
      filename,
      hasLargeRow,
      highlightedNew: newHtml?.split('\n') || [],
      highlightedOld: oldHtml?.split('\n') || [],
      previous_filename,
      rows,
    };
  },
);

export async function processFileHighlight(
  file: PullRequestFile,
): Promise<HighlightedFileData> {
  // Dedupe highlight work per-file within a single RSC request.
  return processFileHighlightCached(
    file.filename,
    file.status,
    file.changes,
    file.patch,
    file.additions,
    file.deletions,
    file.previous_filename,
  );
}

export const getPageHighlights = cache(
  async (owner: string, name: string, prId: number, page: number) => {
    'use cache: remote';
    cacheLife('poc');

    if (process.env.NODE_ENV !== 'production') {
      console.log(`[Batch Highlight] Processing Page ${page}...`);
    }

    const fileData = await fetchListFiles(owner, name, prId, page);

    if (!fileData || !fileData.data) return {};

    const results = await Promise.all(
      fileData.data.map(async (file) => {
        try {
          const processed = await processFileHighlight(file);
          return { data: processed, index: file.index };
        } catch (e) {
          console.error(`Error highlighting file ${file.filename}`, e);
          return { data: null, index: file.index };
        }
      }),
    );

    const resultMap: Record<number, HighlightedFileData> = {};

    results.forEach((r) => {
      if (r?.data) resultMap[r.index] = r.data;
    });

    return resultMap;
  },
);
