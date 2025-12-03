/** biome-ignore-all lint/performance/noImgElement: caching */

import { cacheLife } from 'next/cache';
import Link from 'next/link';

import Markdown from '../components/markdown';
import { gist, title } from './_gist';

export default async function RootPage() {
  'use cache';
  cacheLife('days');

  return (
    <main className="flex min-h-screen flex-col items-center justify-center font-sans antialiased">
      <Markdown className="mt-10 max-w-3xl px-10" context="gist" text={title} />
      <div className="mt-8 mb-8 flex w-full max-w-3xl flex-col px-10 md:flex-row">
        <Link
          className="border-(length:--borderWidth-thin) mb-2 flex h-10 items-center rounded-(--borderRadius-medium) border-[#ffffff26] bg-[#388bfd1a]! px-2 text-fg-default! hover:text-fg-default! md:mr-2 md:mb-0 md:h-12 md:w-1/3 md:px-4"
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
          className="border-(length:--borderWidth-thin) mb-2 flex h-10 items-center rounded-(--borderRadius-medium) border-[#ffffff26] bg-[#388bfd1a]! px-2 text-fg-default! hover:text-fg-default! md:mb-0 md:h-12 md:w-1/3 md:px-4"
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
          className="border-(length:--borderWidth-thin) flex h-10 items-center rounded-(--borderRadius-medium) border-[#ffffff26] bg-[#388bfd1a]! px-2 text-fg-default! hover:text-fg-default! md:ml-2 md:h-12 md:w-1/3 md:px-4"
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
      <Markdown className="mb-16 max-w-3xl px-10" context="gist" text={gist} />
    </main>
  );
}
