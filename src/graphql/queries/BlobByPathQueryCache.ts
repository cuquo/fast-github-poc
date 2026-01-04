import { cache } from 'react';

import { loadSerializableQuery } from '../relay/load-serializable-query';
import BlobByPathQueryNode, {
  type BlobByPathQuery,
} from './__generated__/BlobByPathQuery.graphql';

export const blobByPathQueryCache = cache(
  (owner: string, name: string, expr: string, path: string) =>
    loadSerializableQuery<typeof BlobByPathQueryNode, BlobByPathQuery>(
      BlobByPathQueryNode,
      {
        expr,
        name,
        owner,
        path,
        withMeta: true,
      },
    ),
);
