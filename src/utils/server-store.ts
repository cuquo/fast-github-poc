import 'server-only';

import type { OperationDescriptor, OperationType } from 'relay-runtime';
import type { ConcreteRequest } from 'relay-runtime/lib/util/RelayConcreteNode';

import type { SerializablePreloadedQuery } from '@/graphql/relay/load-serializable-query';

import createServerStore from './create-server-store';

type FetchedQuery = Readonly<{
  operationDescriptor: OperationDescriptor;
  response: SerializablePreloadedQuery<
    ConcreteRequest,
    OperationType
  >['response'];
}>;

export const [fetchedQueries, setFetchedQueries] = createServerStore<
  FetchedQuery[]
>([]);
