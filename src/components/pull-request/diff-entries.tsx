import 'server-only';

import { Fragment, Suspense, use } from 'react';

import {
  CHUNK_DELAY_MS,
  CHUNK_SIZE,
  MAX_FILES_TO_RENDER,
  PAGE_SIZE,
  PLACEHOLDER_COST_LINES,
  TARGET_EFFECTIVE_LINES_PER_CHUNK,
  TOO_LARGE_DIFF_THRESHOLD,
} from '@/constants/options';
import type { PullRequestFile } from '@/utils/pr-diff-types';
import { fetchPullRequestFilesTail } from '@/utils/pr-files-waterfall';

import { PerformanceMarker } from '../performance-marker';
import DiffEntry from './diff-entry';
import DiffEntrySkeleton from './diff-entry-skeleton';
import LoadMoreSkeleton from './load-more-skeleton';
import { SidebarActivator } from './sidebar-activator';

async function delay(ms: number) {
  if (ms <= 0) return;
  await new Promise((resolve) => setTimeout(resolve, ms));
}

export default function DiffEntries({
  hasEnhancedSidebar = false,
  name,
  owner,
  prId,
  first,
  hasMore,
  remainderNonRoot,
  remainderRoot,
}: {
  hasEnhancedSidebar: boolean;
  name: string;
  owner: string;
  prId: number;
  first: PullRequestFile[];
  hasMore: boolean;
  remainderNonRoot: PullRequestFile[];
  remainderRoot: PullRequestFile[];
}) {
  const shouldRenderRest =
    hasMore || remainderNonRoot.length > 0 || remainderRoot.length > 0;

  return (
    <>
      <PerformanceMarker name="[PrDiff]-initial" type="mark" />
      {first.map((file, index) => (
        <DiffEntry
          file={file}
          isFirstChunk
          key={file.filename}
          name={name}
          owner={owner}
          prId={prId}
          skipRendering={file.index > MAX_FILES_TO_RENDER - 1}
        >
          {!shouldRenderRest &&
            hasEnhancedSidebar &&
            index === first.length - 1 && <SidebarActivator />}
        </DiffEntry>
      ))}

      {shouldRenderRest && (
        <Suspense
          fallback={
            <>
              <PerformanceMarker
                name="[PrDiff]-rest:fallback-shown"
                type="mark"
              />
              <LoadMoreSkeleton />
            </>
          }
        >
          <PrDiffPage
            hasEnhancedSidebar={hasEnhancedSidebar}
            hasMore={hasMore}
            name={name}
            owner={owner}
            prId={prId}
            remainderNonRoot={remainderNonRoot}
            remainderRoot={remainderRoot}
          />
        </Suspense>
      )}
    </>
  );
}

function PrDiffPage({
  hasEnhancedSidebar,
  hasMore,
  name,
  owner,
  prId,
  remainderNonRoot,
  remainderRoot,
}: {
  hasEnhancedSidebar: boolean;
  hasMore: boolean;
  name: string;
  owner: string;
  prId: number;
  remainderNonRoot: PullRequestFile[];
  remainderRoot: PullRequestFile[];
}) {
  // Fetch + process pages 2..N only if hasMore.
  const tail = hasMore
    ? use(fetchPullRequestFilesTail(name, owner, prId))
    : { nonRoot: [], root: [] };

  // Preserve ordering: nonRoot first, then root tail.
  const ordered = [
    ...remainderNonRoot,
    ...tail.nonRoot,
    ...remainderRoot,
    ...tail.root,
  ];

  if (ordered.length === 0) return null;

  const chunkingOpts: ChunkingOptions = {
    maxEffectiveLinesPerChunk: 1200,
    targetEffectiveLinesPerChunk: TARGET_EFFECTIVE_LINES_PER_CHUNK,
    targetFilesPerChunk: CHUNK_SIZE,
  };

  const chunks = chunkByEffectiveLines(ordered, chunkingOpts);
  const lastChunkIndex = chunks.length - 1;

  return (
    <>
      <PerformanceMarker name="[PrDiff]-rest:tail-fetched" type="mark" />
      <PerformanceMarker name="[PrDiff]-rest:chunks-ready" type="mark" />
      {chunks.map((chunk, chunkIndex) => (
        <Suspense
          fallback={<DiffEntrySkeleton />}
          key={`chunk-${chunk[0].filename}`}
        >
          <DiffEntryChunk
            chunk={chunk}
            hasEnhancedSidebar={hasEnhancedSidebar}
            isFirstChunk={chunkIndex === 0}
            isLastChunk={chunkIndex === lastChunkIndex}
            name={name}
            owner={owner}
            prId={prId}
          />
        </Suspense>
      ))}
    </>
  );
}

async function DiffEntryChunk({
  chunk,
  hasEnhancedSidebar,
  isFirstChunk = false,
  isLastChunk = false,
  name,
  owner,
  prId,
}: {
  chunk: PullRequestFile[];
  hasEnhancedSidebar: boolean;
  isFirstChunk?: boolean;
  isLastChunk?: boolean;
  name: string;
  owner: string;
  prId: number;
}) {
  // Reuse the exact same effective-cost logic used by the chunker to avoid drift.
  const effectiveLines = chunk.reduce((sum, file) => {
    return sum + getEffectiveLines(file);
  }, 0);

  // This is a server-side throttle for streaming cadence (not a browser main-thread yield).
  const shouldDelay =
    CHUNK_DELAY_MS > 0 &&
    !isLastChunk &&
    effectiveLines >= Math.floor(0.25 * TARGET_EFFECTIVE_LINES_PER_CHUNK);

  const shouldDelayForInitialSidebarPaint = CHUNK_DELAY_MS > 0 && isFirstChunk;

  if (shouldDelayForInitialSidebarPaint) {
    await delay(300);
  } else if (shouldDelay) {
    await delay(CHUNK_DELAY_MS);
  }

  const lastChunkItemIndex = chunk.length - 1;

  return (
    <>
      {chunk.map((file, index) => (
        <Fragment key={file.filename}>
          <DiffEntry
            file={file}
            name={name}
            owner={owner}
            prId={prId}
            skipRendering={
              file.index + file.page * PAGE_SIZE > MAX_FILES_TO_RENDER - 1
            }
          />

          {isLastChunk &&
            index === lastChunkItemIndex &&
            hasEnhancedSidebar && (
              <>
                <PerformanceMarker
                  name="[PrDiff]-rest:render-end"
                  type="mark"
                />
                <SidebarActivator />
              </>
            )}
        </Fragment>
      ))}
    </>
  );
}

type ChunkingOptions = {
  targetFilesPerChunk: number;
  targetEffectiveLinesPerChunk: number;
  maxEffectiveLinesPerChunk: number;
};

function getEffectiveLines(file: PullRequestFile) {
  const { changes, status, patch, index, page } = file;

  // If we won't render the full diff, treat it as cheap.
  if (
    changes > TOO_LARGE_DIFF_THRESHOLD ||
    status === 'removed' ||
    !patch ||
    index + page * PAGE_SIZE > MAX_FILES_TO_RENDER - 1
  )
    return PLACEHOLDER_COST_LINES;

  return changes;
}

function chunkByEffectiveLines(
  files: PullRequestFile[],
  opts: ChunkingOptions,
): PullRequestFile[][] {
  const out: PullRequestFile[][] = [];

  let current: PullRequestFile[] = [];
  let currentFiles = 0;
  let currentEff = 0;

  const flush = () => {
    if (current.length === 0) return;
    out.push(current);
    current = [];
    currentFiles = 0;
    currentEff = 0;
  };

  for (const file of files) {
    const eff = getEffectiveLines(file);

    const nextFiles = currentFiles + 1;
    const nextEff = currentEff + eff;

    const wouldExceedHardLimits =
      nextFiles > CHUNK_SIZE || nextEff > opts.maxEffectiveLinesPerChunk;

    // If adding this file breaks hard limits, start a new chunk first.
    if (wouldExceedHardLimits) {
      flush();
      current.push(file);
      currentFiles = 1;
      currentEff = eff;
      continue;
    }

    current.push(file);
    currentFiles = nextFiles;
    currentEff = nextEff;

    // Soft target: once we hit targets, cut the chunk to keep cadence steady.
    const hitSoftTargets =
      currentFiles >= opts.targetFilesPerChunk ||
      currentEff >= opts.targetEffectiveLinesPerChunk;

    if (hitSoftTargets) flush();
  }

  flush();
  return out;
}
