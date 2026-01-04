import 'server-only';

import { cacheLife } from 'next/cache';
import { cacheSignal } from 'react';
import type {
  GraphQLResponse,
  GraphQLResponseWithData,
  GraphQLResponseWithoutData,
  RequestParameters,
  Variables,
} from 'relay-runtime';

import { github } from '@/utils/github-octokit';

type RequestWithCacheID = RequestParameters & {
  cacheID?: string;
};

/**
 * In-flight dedupe (same worker only).
 */
const pending = new Map<
  string,
  Promise<GraphQLResponseWithoutData | GraphQLResponse | null>
>();

function dedupeKey(request: RequestParameters, variables: Variables): string {
  const { cacheID, id, name } = request as RequestWithCacheID;

  return `${cacheID ?? id ?? name}:${JSON.stringify(variables)}`;
}

async function fetchGraphQL(
  request: RequestParameters,
  variables: Variables,
): Promise<GraphQLResponseWithoutData | GraphQLResponse | null> {
  'use cache: remote';
  cacheLife('poc');

  const signal = cacheSignal();

  try {
    const text = request.text;

    if (!text) return null;

    const data = await github.graphql(text, {
      ...variables,
      request: signal ? { signal } : undefined,
    });

    return { data } as GraphQLResponseWithData;
  } catch (error) {
    if (!signal?.aborted) {
      console.error('Network fetch error', error);
    }
    return null;
  }
}

/**
 * Public API used by Relay server helpers.
 */
export function networkFetch(
  request: RequestParameters,
  variables: Variables,
): Promise<GraphQLResponseWithoutData | GraphQLResponse | null> {
  const key = dedupeKey(request, variables);

  const existing = pending.get(key);
  if (existing) return existing;

  const p = fetchGraphQL(request, variables).finally(() => {
    pending.delete(key);
  });

  pending.set(key, p);
  return p;
}
