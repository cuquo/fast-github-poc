/** biome-ignore-all lint/performance/noImgElement: caching */

import { cacheLife } from 'next/cache';

import Link from '@/components/link';
import Markdown from '@/components/markdown';

import { gist, title } from './_gist';

export default async function IloveDogs() {
  'use cache';
  cacheLife('days');

  return (
    <main className="flex min-h-screen flex-col items-center justify-center font-sans antialiased">
      <div className="markdown-body mt-10 max-w-4xl px-10">
        <blockquote
          className="markdown-body markdown-alert markdown-alert-important border-l-[#8957e5]! text-fg-default!"
          dir="auto"
        >
          <p
            className="markdown-alert-title flex items-center fill-[#ab7df8] font-medium! text-[#ab7df8]"
            dir="auto"
          >
            <svg
              aria-hidden="true"
              className="octicon octicon-report mr-2"
              height="16"
              version="1.1"
              viewBox="0 0 16 16"
              width="16"
            >
              <path d="M0 1.75C0 .784.784 0 1.75 0h12.5C15.216 0 16 .784 16 1.75v9.5A1.75 1.75 0 0 1 14.25 13H8.06l-2.573 2.573A1.458 1.458 0 0 1 3 14.543V13H1.75A1.75 1.75 0 0 1 0 11.25Zm1.75-.25a.25.25 0 0 0-.25.25v9.5c0 .138.112.25.25.25h2a.75.75 0 0 1 .75.75v2.19l2.72-2.72a.749.749 0 0 1 .53-.22h6.5a.25.25 0 0 0 .25-.25v-9.5a.25.25 0 0 0-.25-.25Zm7 2.25v2.5a.75.75 0 0 1-1.5 0v-2.5a.75.75 0 0 1 1.5 0ZM9 9a1 1 0 1 1-2 0 1 1 0 0 1 2 0Z" />
            </svg>
            Important
          </p>
          <p dir="auto">This is a naive implementation.</p>
          <p dir="auto">
            GitHub is an extremely complex product, with many constraints and
            internal decisions I don’t see. This project ignores most of that on
            purpose.
          </p>
          <p dir="auto">
            The intent isn’t to claim a better solution, but to explore ideas,
            learn from them, and test assumptions around performance and the
            code review experience.
          </p>
          <p dir="auto">
            If any of this ends up being useful to the GitHub team, I’d honestly
            be honored.
          </p>
        </blockquote>
      </div>
      <Markdown className="mt-6 max-w-4xl px-10" context="gist" text={title} />
      <div className="mt-8 mb-2 flex w-full max-w-4xl flex-col px-10 md:flex-row">
        <Link
          className="border-(length:--borderWidth-thin) mb-2 flex h-10 items-center rounded-(--borderRadius-medium) border-[#ffffff26] bg-[#131D2E]! px-2 text-fg-default! hover:text-fg-default! md:mr-2 md:mb-0 md:h-12 md:w-1/3 md:px-4"
          href="/vercel/next.js/pull/84800"
          prefetch
        >
          <span className="font-medium">Small Pull Request</span>
        </Link>
        <Link
          className="border-(length:--borderWidth-thin) mb-2 flex h-10 items-center rounded-(--borderRadius-medium) border-[#ffffff26] bg-[#131D2E]! px-2 text-fg-default! hover:text-fg-default! md:mb-0 md:h-12 md:w-1/3 md:px-4"
          href="/oven-sh/bun/pull/23169"
        >
          <span className="font-medium">Medium Pull Request</span>
        </Link>
        <Link
          className="border-(length:--borderWidth-thin) flex h-10 items-center rounded-(--borderRadius-medium) border-[#ffffff26] bg-[#131D2E]! px-2 text-fg-default! hover:text-fg-default! md:ml-2 md:h-12 md:w-1/3 md:px-4"
          href="/facebook/react/pull/30205"
        >
          <span className="font-medium">Large Pull Request</span>
        </Link>
      </div>
      <p>
        or click any <span className="text-fg-accent">(#pull)</span> in the
        repo/tree/blob view
      </p>
      <div className="mt-1 mb-8 flex w-full max-w-4xl flex-col px-10 md:flex-row">
        <Link
          className="border-(length:--borderWidth-thin) mb-2 flex h-10 items-center rounded-(--borderRadius-medium) border-[#ffffff26] bg-[#131D2E]! px-2 text-fg-default! hover:text-fg-default! md:mr-2 md:mb-0 md:h-12 md:w-1/3 md:px-4"
          href="/facebook/react"
          prefetch
        >
          <img
            alt="facebook avatar"
            className="border-(length:--borderWidth-thin) mr-2 flex h-6 w-6 rounded-(--borderRadius-medium) border-[#ffffff26] [border-style:inherit]!"
            height="24"
            src="https://avatars.githubusercontent.com/u/69631?s=48&amp;v=4"
            width="24"
          ></img>
          <span className="font-medium">React repo</span>
        </Link>
        <Link
          className="border-(length:--borderWidth-thin) mb-2 flex h-10 items-center rounded-(--borderRadius-medium) border-[#ffffff26] bg-[#131D2E]! px-2 text-fg-default! hover:text-fg-default! md:mb-0 md:h-12 md:w-1/3 md:px-4"
          href="/vercel/next.js"
          prefetch
        >
          <img
            alt="Next.js avatar"
            className="border-(length:--borderWidth-thin) mr-2 flex h-6 w-6 rounded-(--borderRadius-medium) border-[#ffffff26] [border-style:inherit]!"
            height="24"
            src="https://avatars.githubusercontent.com/u/194854876?s=40&u=524238e200f56e3258c4b8e22f5328bd99a650b5&v=4"
            width="24"
          ></img>
          <span className="font-medium">NextJS repo</span>
        </Link>
        <Link
          className="border-(length:--borderWidth-thin) flex h-10 items-center rounded-(--borderRadius-medium) border-[#ffffff26] bg-[#131D2E]! px-2 text-fg-default! hover:text-fg-default! md:ml-2 md:h-12 md:w-1/3 md:px-4"
          href="/oven-sh/bun"
          prefetch
        >
          <img
            alt="Bun avatar"
            className="border-(length:--borderWidth-thin) mr-2 flex h-6 w-6 rounded-(--borderRadius-medium) border-[#ffffff26] [border-style:inherit]!"
            height="24"
            src="https://avatars.githubusercontent.com/u/108928776?s=48&v=4"
            width="24"
          ></img>
          <span className="font-medium">Bun repo</span>
        </Link>
      </div>
      <Markdown
        className="i-love-dogs mb-16 max-w-4xl px-10"
        context="gist"
        text={gist}
      />
    </main>
  );
}

export function generateMetadata() {
  return {
    description:
      'I built a version of the GitHub pull request experience that feels instantly responsive, dramatically improves navigation and diff rendering for large PRs — so reviewing code stays focused on understanding, not waiting.',
    title: 'I Love Dogs',
  };
}
