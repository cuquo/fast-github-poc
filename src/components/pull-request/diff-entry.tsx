import 'server-only';

import { Suspense } from 'react';

import { TOO_LARGE_DIFF_THRESHOLD } from '@/constants/options';
import LoadDiffIcon from '@/icons/load-diff-icon';
import { githubDiffId } from '@/utils/github-diff-id';
import { getPatchToRenderableRows } from '@/utils/patch-to-renderable-rows';
import type { PullRequestFile } from '@/utils/pr-diff-types';

import DiffEntrySkeleton from './diff-entry-skeleton';
import DiffEntrySyntax from './diff-entry-syntax';
import DiffEntryWrapper from './diff-entry-wrapper';

export default function DiffEntry({
  children,
  file,
  isFirstChunk = false,
  name,
  owner,
  prId,
  skipRendering = false,
}: {
  children?: React.ReactNode;
  file: PullRequestFile;
  isFirstChunk?: boolean;
  name: string;
  owner: string;
  prId: number;
  skipRendering?: boolean;
}) {
  const {
    additions,
    changes,
    deletions,
    filename,
    index: fileIndex,
    page,
    patch,
    previous_filename,
    status,
  } = file;
  const isModified = status === 'modified';
  const isRenamed = status === 'renamed';
  const isTooLarge = changes >= TOO_LARGE_DIFF_THRESHOLD;

  if (!patch && !isModified && !isRenamed && !isTooLarge) return null;

  const isRemoved = status === 'removed';

  let renderStatus = '';

  if (isRemoved) {
    renderStatus = 'This file was deleted.';
  } else if (isModified && !patch) {
    renderStatus = 'Some generated files are not rendered by default.';
  } else if (isTooLarge) {
    renderStatus = 'Large diffs are not rendered by default.';
  }

  const id = githubDiffId(filename);
  const inputId = `diff-block-${id}`;

  // Early return for files renamed without a patch
  if (!patch && isRenamed) {
    return (
      <>
        <DiffEntryWrapper
          additions={additions}
          aproximateHeight={0}
          deletions={deletions}
          filename={filename}
          id={id}
          inputId={inputId}
          previous_filename={previous_filename}
          shouldNotRender={true}
        >
          <div className="p-2 text-fg-muted">File renamed without changes.</div>
        </DiffEntryWrapper>
        {children}
      </>
    );
  }

  // Early return for files without a patch and modified status
  if (!patch || isTooLarge || isRemoved || skipRendering) {
    return (
      <>
        <DiffEntryWrapper
          additions={additions}
          aproximateHeight={0}
          deletions={deletions}
          filename={filename}
          id={id}
          inputId={inputId}
          shouldNotRender={true}
        >
          <div className="relative flex h-33 w-full items-center justify-center contain-strict [contain-intrinsic-size:auto_132px] [content-visibility:auto]">
            <div className="z-1 flex flex-col">
              <button
                className="h-8 cursor-default! items-center rounded-(--borderRadius-medium)! px-3 font-semibold! text-base! text-fg-accent hover:bg-bg-neutral-muted"
                type="button"
              >
                Load Diff
              </button>
              <span className="mt-1 text-fg-muted">{renderStatus}</span>
            </div>
            <div className="absolute left-4 z-0">
              <LoadDiffIcon className="fill-bg-muted" />
            </div>
          </div>
        </DiffEntryWrapper>
        {children}
      </>
    );
  }

  const rows = getPatchToRenderableRows(patch);

  return file.fcp ? (
    <>
      <DiffEntrySyntax
        fcp={file.fcp}
        fileIndex={fileIndex}
        id={id}
        inputId={inputId}
        name={name}
        owner={owner}
        page={page}
        prId={prId}
      />
      {children}
    </>
  ) : (
    <Suspense
      fallback={
        isFirstChunk ? (
          <DiffEntrySkeleton numberOfPendingRows={rows.length - 6} />
        ) : null
      }
    >
      <DiffEntrySyntax
        fileIndex={fileIndex}
        id={id}
        inputId={inputId}
        name={name}
        owner={owner}
        page={page}
        prId={prId}
      />
      {children}
    </Suspense>
  );
}
