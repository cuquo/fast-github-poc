import 'server-only';

import type {
  GraphQLResponse,
  GraphQLTaggedNode,
  OperationType,
  PayloadData,
  PayloadError,
  VariablesOf,
} from 'relay-runtime';
import { createOperationDescriptor, getRequest } from 'relay-runtime';
import type { ConcreteRequest } from 'relay-runtime/lib/util/RelayConcreteNode';

import * as ServerStore from '@/utils/server-store';

import { serverEnvironment } from './environment';
import { networkFetch } from './network-fetch';

export interface SerializablePreloadedQuery<
  TRequest extends ConcreteRequest,
  TQuery extends OperationType,
> {
  params: TRequest['params'];
  variables: VariablesOf<TQuery>;
  response: GraphQLResponse & { errors?: PayloadError[] } & {
    data: TQuery['response'];
  };
}

interface LoadSerializableQueryOptions {
  addToClient?: boolean;
  maskedData?: boolean;
}

/**
 * Fetches a query from the Relay environment.
 *
 * @param query - GraphQL query
 * @param variables - fetch query variables
 * @param optionalCacheKey - optional cache key to use instead of the request id
 * @param options - additional options
 */
export async function loadSerializableQuery<
  TRequest extends ConcreteRequest,
  TQuery extends OperationType,
>(
  query: GraphQLTaggedNode,
  variables: TQuery['variables'],
  options?: LoadSerializableQueryOptions,
): Promise<SerializablePreloadedQuery<TRequest, TQuery>> {
  const { addToClient = false, maskedData = false } = options || {};
  const environment = serverEnvironment();
  const request = getRequest(query);
  const response = (await networkFetch(
    request.params,
    variables,
  )) as SerializablePreloadedQuery<TRequest, TQuery>['response'];

  const operationDescriptor = createOperationDescriptor(request, variables);
  const data = response && 'data' in response ? response?.data : null;

  if (data) {
    environment?.commitPayload(operationDescriptor, data);

    if (!Array.isArray(response) && addToClient) {
      const fetchedQueries = ServerStore.fetchedQueries();

      // Add the operation to the client cache
      fetchedQueries.push({ operationDescriptor, response });
    }

    return {
      params: request.params,
      response: maskedData
        ? environment.lookup(operationDescriptor.fragment)
        : response,
      variables,
    };
  } else {
    return {
      params: request.params,
      response,
      variables,
    };
  }
}

/**
 * Returns the queried data from the Relay store.
 *
 * @param query - GraphQL query
 * @param variables - fetch query variables
 */
export function getQueryFromRelayStore<TQuery>(
  query: GraphQLTaggedNode,
  variables: OperationType['variables'],
): TQuery {
  const environment = serverEnvironment();
  const request = getRequest(query);
  const operationDescriptor = createOperationDescriptor(request, variables);

  return environment?.lookup?.(operationDescriptor.fragment)?.data as TQuery;
}

/**
 * Adds a query to the Relay store.
 *
 * @param query - GraphQL query
 * @param variables - fetch query variables
 * @param data - data to add to the store
 */
export function addQueryToRelayStore(
  query: GraphQLTaggedNode,
  variables: OperationType['variables'],
  data: PayloadData,
): void {
  const environment = serverEnvironment();
  const request = getRequest(query);
  const operationDescriptor = createOperationDescriptor(request, variables);

  environment?.commitPayload(operationDescriptor, data);
}
