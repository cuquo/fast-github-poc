import 'server-only';

import { graphql } from '@octokit/graphql';
import { cacheLife } from 'next/cache';
import { cacheSignal } from 'react';
import type {
  GraphQLResponse,
  GraphQLResponseWithData,
  GraphQLResponseWithoutData,
  RequestParameters,
  Variables,
} from 'relay-runtime';

/**
 * NetworkFetch
 *
 * @param request - request parameters
 * @param variables - variables to pass to the query
 */
export async function networkFetch(
  request: RequestParameters,
  variables: Variables,
): Promise<GraphQLResponseWithoutData | GraphQLResponse | null> {
  'use cache: remote';
  cacheLife('poc');

  // Abort when this cached render is no longer needed
  const signal = cacheSignal();

  let resp: Response;

  try {
    resp = await graphql(request.text as string, {
      ...variables,
      headers: {
        authorization: `token ${process.env.GITHUB_TOKEN as string}`,
      },
      ...(signal && { request: { signal } }),
    });
  } catch (error) {
    // If the cache lifetime has ended, ignore abort errors
    if (!signal?.aborted) {
      console.error('Network fetch error', error);
    }
    return null;
  }

  return { data: resp } as GraphQLResponseWithData;
}
