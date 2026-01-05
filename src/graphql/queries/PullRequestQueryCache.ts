import { cache } from 'react';

import { loadSerializableQuery } from '../relay/load-serializable-query';
import PullRequestQueryNode, {
  type PullRequestQuery,
} from './__generated__/PullRequestQuery.graphql';

export const pullRequestQueryCache = cache(
  (owner: string, name: string, prId: number) =>
    loadSerializableQuery<typeof PullRequestQueryNode, PullRequestQuery>(
      PullRequestQueryNode,
      {
        name,
        number: prId,
        owner,
      },
    ),
);
