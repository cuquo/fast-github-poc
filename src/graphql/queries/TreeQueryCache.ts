import { cache } from 'react';

import { loadSerializableQuery } from '../relay/load-serializable-query';
import TreeQueryNode, {
  type TreeQuery,
} from './__generated__/TreeQuery.graphql';

export const treeQueryCache = cache(
  (owner: string, name: string, expr: string, path: string) =>
    loadSerializableQuery<typeof TreeQueryNode, TreeQuery>(TreeQueryNode, {
      expr,
      name,
      owner,
      path,
      withMeta: true,
    }),
);
