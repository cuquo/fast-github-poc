import { cache } from 'react';
import {
  type CacheConfig,
  Environment,
  type GraphQLResponse,
  Network,
  QueryResponseCache,
  RecordSource,
  type RequestParameters,
  Store,
  type Variables,
} from 'relay-runtime';
import type { Network as NetworkType } from 'relay-runtime/lib/network/RelayNetworkTypes';

import { networkFetch } from './network-fetch';

const CACHE_TTL = 5 * 1000; // 5 seconds, to resolve preloaded results

/**
 * responseCache
 */
export const responseCache = new QueryResponseCache({
  size: 100,
  ttl: CACHE_TTL,
});

/**
 * CreateNetwork
 *
 */
export function createNetwork(): NetworkType {
  /**
   *fetchResponse
   *
   * @param params -fetch response parameters
   * @param variables - variables to pass to the query
   * @param cacheConfig - cache configuration
   */
  async function fetchResponse(
    params: RequestParameters,
    variables: Variables,
    cacheConfig: CacheConfig,
  ): Promise<GraphQLResponse> {
    const isQuery = params.operationKind === 'query';
    const cacheKey = params.id ?? params.cacheID;
    const forceFetch = cacheConfig?.force && typeof window !== 'undefined';

    if (responseCache != null && isQuery && !forceFetch) {
      const fromCache = responseCache.get(cacheKey, variables);

      if (fromCache != null) {
        return Promise.resolve(fromCache);
      }
    }

    return networkFetch(params, variables) as Promise<GraphQLResponse>;
  }

  const network = Network.create(fetchResponse);

  /* @ts-expect-error Private API Hackery? 🤷‍♂️ */
  network.responseCache = responseCache;

  return network;
}

/**
 * clientEnvironment
 *
 */
export function clientEnvironment(): Environment | null {
  if (typeof window === 'undefined') return null;

  const network = createNetwork();

  const environment = new Environment({
    isServer: false,
    network,
    store: new Store(new RecordSource()),
  });

  /* @ts-expect-error Private API Hackery? 🤷‍♂️ */
  environment.getNetwork().responseCache = network.responseCache;

  return environment;
}

/**
 * serverEnvironmentWithoutCache
 */
export const serverEnvironmentWithoutCache = (): Environment => {
  const network = createNetwork();

  const relayServerEnvironment = new Environment({
    isServer: true,
    network,
    store: new Store(new RecordSource()),
  });

  /* @ts-expect-error Private API Hackery? 🤷‍♂️ */
  relayServerEnvironment.getNetwork().responseCache = network.responseCache;

  return relayServerEnvironment;
};

export const environment = clientEnvironment();
export const serverEnvironment = cache(serverEnvironmentWithoutCache);
