import 'server-only';

import OwnerQueryNode, {
  type OwnerQuery,
} from '@/graphql/queries/__generated__/OwnerQuery.graphql';
import { loadSerializableQuery } from '@/graphql/relay/load-serializable-query';

export default async function Owner({ owner }: { owner: string }) {
  const query = await loadSerializableQuery<typeof OwnerQueryNode, OwnerQuery>(
    OwnerQueryNode,
    { login: owner },
  );

  return <div>Owner Page for {query.response.data.repositoryOwner?.login}</div>;
}
