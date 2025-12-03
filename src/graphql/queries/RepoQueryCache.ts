import { cache } from 'react';

import { loadSerializableQuery } from '../relay/load-serializable-query';
import RepoQueryNode, {
  type RepoQuery,
} from './__generated__/RepoQuery.graphql';

export const repoQueryCache = cache((owner: string, name: string) =>
  loadSerializableQuery<typeof RepoQueryNode, RepoQuery>(RepoQueryNode, {
    name,
    owner,
  }),
);
