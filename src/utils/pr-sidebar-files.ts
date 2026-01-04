import 'server-only';

import type { PullRequestFile } from './pr-diff-types';
import {
  fetchPullRequestFilesTail,
  getInitialPatches,
} from './pr-files-waterfall';

export async function fetchSidebarFiles(
  owner: string,
  name: string,
  prId: number,
): Promise<PullRequestFile[] | null> {
  const initial = await getInitialPatches(owner, name, prId);

  if (!initial) return null;

  const { first, hasMore, remainderNonRoot, remainderRoot } = initial;

  const tail = hasMore
    ? await fetchPullRequestFilesTail(name, owner, prId)
    : { nonRoot: [], root: [] };

  const ordered = [
    ...first,
    ...remainderNonRoot,
    ...tail.nonRoot,
    ...remainderRoot,
    ...tail.root,
  ];

  return ordered;
}
