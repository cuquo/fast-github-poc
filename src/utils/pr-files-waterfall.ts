import 'server-only';

import { cacheLife } from 'next/cache';
import { cache, cacheSignal } from 'react';

import {
  DIFFS_PER_PAGE,
  INITIAL_SYNTAX_HIGHLIGHT_DIFF,
  PAGE_SIZE,
  TOO_LARGE_DIFF_THRESHOLD,
} from '@/constants/options';

import { processFileHighlight } from './batch-highlight';
import { github } from './github-octokit';
import type { PullRequestFile } from './pr-diff-types';
import { buildPrTreeFromPaths, flattenPrTreeFiles } from './pr-path-tree';

type FetchListFilesResponse = {
  data: PullRequestFile[];
  headers: Awaited<ReturnType<typeof github.rest.pulls.listFiles>>['headers'];
} | null;

/* Global map to store in-flight promises.
  This acts as a synchronous memory lock to prevent the "Thundering Herd" problem.
  If 5 requests ask for "Page 1" simultaneously, they will all await the SAME promise.
*/
const globalPendingRequests = new Map<
  string,
  Promise<FetchListFilesResponse>
>();

export function splitRootFiles<T extends { filename: string }>(files: T[]) {
  const root: T[] = [];
  const nonRoot: T[] = [];

  for (const f of files) {
    (f.filename.includes('/') ? nonRoot : root).push(f);
  }

  return { nonRoot, root };
}

export function sortFilesFoldersFirst<T extends { filename: string }>(
  files: T[],
): T[] {
  const tree = buildPrTreeFromPaths(
    files.map((file) => ({
      path: file.filename,
      payload: file,
    })),
    'folders-first',
  );

  return flattenPrTreeFiles(tree) as T[];
}

export type FetchFilesPageArgs = {
  owner: string;
  name: string;
  prId: number;
  perPage: number;
  page: number;
};

export type FetchFilesPageResult = {
  files: PullRequestFile[];
  hasMore: boolean;
  page: number;
};

export type FetchSortedSplitPageResult = {
  nonRoot: PullRequestFile[];
  root: PullRequestFile[];
  hasMore: boolean;
  page: number;
};

/**
 * Inner function responsible for the actual Data Cache interaction.
 * This function handles the persistence layer (Redis/FileSystem).
 * It will only be called if there is no in-flight promise in the global map.
 */
const fetchListFilesCached = async (
  owner: string,
  name: string,
  prId: number,
  page: number,
): Promise<FetchListFilesResponse> => {
  // 👇 3. Explicit return type
  'use cache: remote';
  cacheLife('poc');

  // Debug log to verify we are not hitting this multiple times unnecessarily
  if (process.env.NODE_ENV !== 'production') {
    console.log(
      `[pr-files] Cache MISS/Revalidate - Fetching GitHub Page ${page}`,
    );
  }

  const signal = cacheSignal();

  try {
    const { headers, data } = await github.rest.pulls.listFiles({
      owner,
      page,
      per_page: PAGE_SIZE,
      pull_number: prId,
      repo: name,
      request: signal ? { signal } : undefined,
    });

    // Enrich the file data with pagination metadata.
    // This allows us to generate unique keys and track relative positions
    // without relying on client-side index calculations later.
    // NOTE: We cast to PullRequestFile[] assuming the type in pr-diff-types
    // allows for 'index' and 'page' or receives the intersection.
    const enrichedData = data.map((file, index) => ({
      ...file,
      index,
      page,
    })) as PullRequestFile[];

    return {
      data: enrichedData,
      headers,
    };
  } catch (error) {
    if (!signal?.aborted) {
      console.error(
        `[pr-files] Error fetching page ${page} for ${owner}/${name}#${prId}`,
        error,
      );
    }

    return null;
  }
};

/**
 * Outer function responsible for Request Memoization and In-flight Deduplication.
 * This is the entry point for the application.
 */
export const fetchListFiles = cache(
  async (
    owner: string,
    name: string,
    prId: number,
    page: number,
  ): Promise<FetchListFilesResponse> => {
    // Generate a unique key for this specific resource request
    const dedupKey = `${owner}/${name}/${prId}/page-${page}`;

    // 1. Check if there is already a promise in flight for this key
    // Optimization: We utilize .get() directly instead of .has() + .get()
    // to avoid double lookup and satisfy the linter (no non-null assertion needed).
    const pendingRequest = globalPendingRequests.get(dedupKey);

    if (pendingRequest) {
      if (process.env.NODE_ENV !== 'production') {
        console.log(`[Dedup] Reusing in-flight promise for: ${dedupKey}`);
      }
      // Return the existing promise to queue this caller behind the first one
      return pendingRequest;
    }

    // 2. If not, create a new promise by calling the cached function
    const promise = fetchListFilesCached(owner, name, prId, page);

    // 3. Register the promise in the global map so others can share it
    globalPendingRequests.set(dedupKey, promise);

    try {
      // Await the result (whether from remote cache or fresh API call)
      const result = await promise;
      return result;
    } finally {
      // 4. Cleanup: Remove the promise from the map once it settles (success or error).
      // Future requests will go through the standard cache flow.
      globalPendingRequests.delete(dedupKey);
    }
  },
);

/**
 * Fetches ONE page and returns it already sorted + split.
 * This is intentionally small so Vercel remote cache can store it reliably.
 */
export async function fetchPullRequestFilesPageSortedSplit(
  name: string,
  owner: string,
  page: number,
  prId: number,
): Promise<FetchSortedSplitPageResult | null> {
  if (process.env.NODE_ENV !== 'production') {
    console.log(
      `[pr-files-page] Processing page ${page} for ${owner}/${name}#${prId}`,
    );
  }

  try {
    const fetch = await fetchListFiles(owner, name, prId, page);

    if (!fetch) {
      return null;
    }

    const { headers, data } = fetch;

    const hasNextFromLink =
      typeof headers.link === 'string'
        ? headers.link.includes('rel="next"')
        : false;

    // Defensive: if GitHub gives us a full page, there might still be more.
    const hasMore = hasNextFromLink || data.length === PAGE_SIZE;

    const sorted = sortFilesFoldersFirst(data);
    const { nonRoot, root } = splitRootFiles(sorted);

    return {
      hasMore,
      nonRoot,
      page,
      root,
    };
  } catch (error) {
    console.error(
      `[pr-files-page] Error fetching page ${page} for ${owner}/${name}#${prId}`,
      error,
    );

    return null;
  }
}

/**
 * Fetches pages startPage..N by calling the per-page cached function.
 * IMPORTANT: Do NOT remote-cache this whole tail result (it can be huge).
 * We want many small cached keys (per page), not one giant value.
 */
export async function fetchPullRequestFilesTail(
  name: string,
  owner: string,
  prId: number,
): Promise<{ nonRoot: PullRequestFile[]; root: PullRequestFile[] }> {
  const nonRoot: PullRequestFile[] = [];
  const root: PullRequestFile[] = [];

  let page = 2;
  let hasMore = true;

  while (hasMore) {
    // Sequential fetching ensures correct waterfall order and prevents
    // flooding the "dedup" map with too many concurrent pages if not needed.
    const res = await fetchPullRequestFilesPageSortedSplit(
      name,
      owner,
      page,
      prId,
    );

    if (!res) break;

    nonRoot.push(...res.nonRoot);
    root.push(...res.root);

    hasMore = res.hasMore;
    page += 1;

    // Extra defensive stop: if a short page slips through, bail.
    // (Normally `hasMore` already covers it.)
    if (res.nonRoot.length + res.root.length < PAGE_SIZE) {
      break;
    }
  }

  return { nonRoot, root };
}

export const getInitialPatches = async (
  owner: string,
  name: string,
  prId: number,
) => {
  'use cache: remote';
  cacheLife('poc');

  try {
    const fetch = await fetchListFiles(owner, name, prId, 1);

    if (!fetch) {
      return null;
    }

    const { headers, data } = fetch;

    const hasNextFromLink =
      typeof headers.link === 'string'
        ? headers.link.includes('rel="next"')
        : false;

    const hasMore = hasNextFromLink || data.length === PAGE_SIZE;

    const sorted = sortFilesFoldersFirst(data);

    const { root, nonRoot } = hasMore
      ? splitRootFiles(sorted)
      : { nonRoot: sorted, root: [] };

    // FCP control: only render the first DIFFS_PER_PAGE from the nonRoot set.
    const first = nonRoot.slice(0, DIFFS_PER_PAGE);

    let processedCount = 0;
    // Preload syntax highlighting for FCP files
    await Promise.all(
      first.map(async (file) => {
        if (
          processedCount < INITIAL_SYNTAX_HIGHLIGHT_DIFF &&
          file.changes <= TOO_LARGE_DIFF_THRESHOLD &&
          file.patch &&
          file.status !== 'removed'
        ) {
          processedCount++;
          file.fcp = await processFileHighlight(file);
        }
      }),
    );

    // Preserve global ordering behavior:
    // - remainderNonRoot still comes before root tail
    const remainderNonRoot = nonRoot.slice(DIFFS_PER_PAGE);
    const remainderRoot = root;

    return {
      first,
      hasMore,
      remainderNonRoot,
      remainderRoot,
    };
  } catch (error) {
    console.error(
      `[pr-files] Error fetching initial patches for ${owner}/${name}#${prId}`,
      error,
    );

    return null;
  }
};
