import 'server-only';

import type { Element } from 'hast';
import { toHtml } from 'hast-util-to-html';
import { cacheLife } from 'next/cache';
import { cacheSignal } from 'react';
import type { BundledLanguage, BundledTheme, HighlighterGeneric } from 'shiki';
import { createHighlighter } from 'shiki';

import { github } from './github-octokit';

type Highlighter = HighlighterGeneric<BundledLanguage, BundledTheme>;

// Singleton highlighter instance (created once, reused for all requests)
let highlighter: Highlighter | null = null;
let highlighterPromise: Promise<Highlighter> | null = null;

async function getHighlighter(): Promise<Highlighter> {
  // Return cached instance if available
  if (highlighter) return highlighter;

  // Return pending promise if already initializing
  if (highlighterPromise) return highlighterPromise;

  // Create new highlighter (only happens once)
  highlighterPromise = createHighlighter({
    langs: [],
    themes: ['github-dark'],
  });

  highlighter = await highlighterPromise;
  highlighterPromise = null;

  return highlighter;
}

/**
 * renderHTML
 *
 * Renders code with syntax highlighting using a shared Shiki highlighter.
 * For markdown, calls GitHub's Markdown API.
 */
export async function renderHTML(
  text: string,
  context: string,
  language: string,
  renderMarkdown = false,
): Promise<string | null> {
  if (renderMarkdown) return renderMarkdownQuery(text, context);

  const shiki = await getHighlighter();

  // Load language on-demand if not already loaded
  const loadedLangs = shiki.getLoadedLanguages();
  if (!loadedLangs.includes(language)) {
    try {
      await shiki.loadLanguage(
        language as Parameters<typeof shiki.loadLanguage>[0],
      );
    } catch {
      // Fallback to 'text' if language not supported
      return shiki.codeToHtml(text, { lang: 'text', theme: 'github-dark' });
    }
  }

  return shiki.codeToHtml(text, { lang: language, theme: 'github-dark' });
}

/**
 * renderHTMLLines
 *
 * Returns an array of HTML strings, one per input line.
 * Uses HAST to correctly handle lines containing literal \n characters.
 */
export async function renderHTMLLines(
  text: string,
  language: string,
): Promise<string[]> {
  const shiki = await getHighlighter();

  const loadedLangs = shiki.getLoadedLanguages();
  let lang = language;

  if (!loadedLangs.includes(language)) {
    try {
      await shiki.loadLanguage(
        language as Parameters<typeof shiki.loadLanguage>[0],
      );
    } catch {
      lang = 'text';
    }
  }

  const root = shiki.codeToHast(text, { lang, theme: 'github-dark' });

  const preElement = root.children.find(
    (child): child is Element =>
      child.type === 'element' && child.tagName === 'pre',
  );

  if (!preElement) {
    const html = shiki.codeToHtml(text, { lang, theme: 'github-dark' });
    return html.split('\n');
  }

  const codeElement = preElement.children.find(
    (child): child is Element =>
      child.type === 'element' && child.tagName === 'code',
  );

  if (!codeElement) {
    const html = shiki.codeToHtml(text, { lang, theme: 'github-dark' });
    return html.split('\n');
  }

  const lines: string[] = [];

  for (const child of codeElement.children) {
    if (child.type === 'element' && child.tagName === 'span') {
      const lineHtml = child.children.map((c) => toHtml(c)).join('');
      lines.push(lineHtml);
    }
  }

  return lines;
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
