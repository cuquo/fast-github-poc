import 'server-only';

import { cacheLife } from 'next/cache';
import { cacheSignal } from 'react';
import { codeToHtml } from 'shiki';

import { github } from './github-octokit';

/**
 * renderHTML
 *
 * Calls GitHub's Markdown API and returns rendered HTML.
 * Automatically tied to React's cache lifetime:
 * - Aborts the request if the render is no longer needed.
 * - Silently ignores AbortErrors caused by cache invalidation.
 */
export async function renderHTML(
  text: string,
  context: string,
  language: string,
  renderMarkdown = false,
): Promise<string | null> {
  if (renderMarkdown) return renderMarkdownQuery(text, context);

  const data = await codeToHtml(text, {
    lang: language,
    theme: 'github-dark',
  });

  return data;
}

async function renderMarkdownQuery(text: string, context: string) {
  'use cache: remote';
  cacheLife('poc');

  // Abort when React no longer needs this cached render
  const signal = cacheSignal();

  try {
    const { data } = await github.rest.markdown.render({
      context,
      mode: 'markdown',
      request: signal ? { signal } : undefined,
      text,
    });

    return data;
  } catch (error) {
    // Ignore abort errors triggered by React's cache cancellation
    if (!signal?.aborted) {
      console.error('Markdown render error', error);
    }
    return null;
  }
}
