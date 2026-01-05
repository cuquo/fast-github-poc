'use client';

import { useSelectedLayoutSegments } from 'next/navigation';

import Link from './link';

export default function HeaderSegment({
  children,
}: {
  children: React.ReactNode;
}) {
  const [owner, name] = useSelectedLayoutSegments();

  if (!owner) return null;

  return (
    <>
      <span
        // href={`/${owner}`}
        className="hover:no-underline! ffont-semibold ml-2 flex h-7 select-none items-center rounded-(--borderRadius-medium) px-1.5 py-1 text-fg-default! hover:bg-[#2D3239]!"
        // prefetch
      >
        {owner}
      </span>
      {name && (
        <>
          {children}
          <Link
            className="hover:no-underline! flex h-7 items-center rounded-(--borderRadius-medium) px-1.5 py-1 font-semibold text-fg-default! hover:bg-[#2D3239]!"
            href={`/${owner}/${name}`}
            prefetch
          >
            {name}
          </Link>
        </>
      )}
    </>
  );
}
