import 'server-only';

import { cacheLife } from 'next/cache';
import { cacheSignal } from 'react';

/**
 * renderHTML
 *
 * Calls GitHub's Markdown API and returns rendered HTML.
 * Automatically tied to React's cache lifetime:
 * - Aborts the request if the render is no longer needed.
 * - Silently ignores AbortErrors caused by cache invalidation.
 */
export async function renderHTML(text: string, context: string) {
  'use cache';
  cacheLife('poc');

  // Abort when React no longer needs this cached render
  const signal = cacheSignal();

  let res: Response;
  try {
    res = await fetch('https://api.github.com/markdown', {
      body: JSON.stringify({
        context,
        mode: 'markdown',
        text,
      }),
      headers: {
        Accept: 'text/html',
        'Accept-Encoding': 'gzip, deflate, br',
        Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
        'Content-Type': 'application/json',
      },
      method: 'POST',
      next: { revalidate: 3600 },
      signal: signal ?? undefined,
    });
  } catch (error) {
    // Ignore abort errors triggered by React's cache cancellation
    if (!signal?.aborted) {
      console.error('Markdown render fetch error', error);
    }
    return '';
  }

  if (!res.ok) {
    // Only log real errors, not aborts
    if (!signal?.aborted) {
      console.error('Markdown render failed', res.status, res.statusText);
    }
    return '';
  }

  try {
    return await res.text();
  } catch (error) {
    // JSON/stream parsing failures should also ignore aborts
    if (!signal?.aborted) {
      console.error('Markdown response parse error', error);
    }
    return '';
  }
}
