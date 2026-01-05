import type { PullRequestFile } from './pr-diff-types';
import { buildPrTreeFromPaths } from './pr-path-tree';

export function buildSidebarTree(nodes: PullRequestFile[]) {
  const entries = nodes
    .map((fileNode) => {
      return {
        path: fileNode.filename,
        payload: fileNode,
      };
    })
    .filter((entry) => entry.path.length > 0);

  return buildPrTreeFromPaths(entries);
}
