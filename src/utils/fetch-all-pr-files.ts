import type { PRFilesFragment$data } from '@/graphql/fragments/__generated__/PRFilesFragment.graphql';
import PRFilesFragment, {
  type PRFilesFragment$key,
} from '@/graphql/fragments/__generated__/PRFilesFragment.graphql';
import PullRequestFilesQueryNode, {
  type PullRequestFilesQuery,
  type PullRequestFilesQuery$data,
} from '@/graphql/queries/__generated__/PullRequestFilesQuery.graphql';
import getServerFragment from '@/graphql/relay/get-server-fragment';
import {
  getQueryFromRelayStore,
  loadSerializableQuery,
} from '@/graphql/relay/load-serializable-query';

type PullRequestFilesConnection = PRFilesFragment$data;
type PullRequestFileNode = NonNullable<
  PullRequestFilesConnection['nodes']
>[number];

type FetchFilesPageArgs = {
  owner: string;
  name: string;
  number: number;
  after: string | null;
};

type FetchFilesPageResult = PullRequestFilesConnection;

/**
 * Low-level fetch for a single page.
 * You need to implement this using your real GraphQL layer
 * (loadSerializableQuery, fetchQuery, fetch(...), etc).
 */
async function fetchPullRequestFilesPage(
  args: FetchFilesPageArgs,
): Promise<FetchFilesPageResult> {
  await loadSerializableQuery<
    typeof PullRequestFilesQueryNode,
    PullRequestFilesQuery
  >(PullRequestFilesQueryNode, args);
  const { repository } = getQueryFromRelayStore<PullRequestFilesQuery$data>(
    PullRequestFilesQueryNode,
    args,
  );

  if (!repository?.pullRequest?.files) {
    throw new Error('Missing files connection in response');
  }

  return getServerFragment<PRFilesFragment$key>(
    PRFilesFragment,
    repository.pullRequest.files,
  );
}

/**
 * Collect all files for a PR, starting from the initial connection that
 * came in PullRequestQuery.
 *
 * Returns a flat array of nodes (easier to consumir en el sidebar),
 * and opcionalmente la info de pageInfo/totalCount si la quieres.
 */
export async function fetchAllPullRequestFiles(options: {
  owner: string;
  name: string;
  number: number;
  initialFiles: PullRequestFilesConnection;
}): Promise<{
  nodes: PullRequestFileNode[];
  totalCount: number;
}> {
  const { owner, name, number, initialFiles } = options;

  let allNodes: PullRequestFileNode[] = [...(initialFiles.nodes ?? [])];

  let hasNextPage = initialFiles.pageInfo.hasNextPage;
  let cursor = initialFiles.pageInfo.endCursor;

  while (hasNextPage && cursor) {
    const nextPage = await fetchPullRequestFilesPage({
      after: cursor,
      name,
      number,
      owner,
    });

    if (nextPage.nodes) {
      allNodes = allNodes.concat(nextPage.nodes);
    }

    hasNextPage = nextPage.pageInfo.hasNextPage;
    cursor = nextPage.pageInfo.endCursor;
  }

  return {
    nodes: allNodes,
    totalCount: initialFiles.totalCount,
  };
}
