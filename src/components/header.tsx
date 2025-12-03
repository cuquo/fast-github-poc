import 'server-only';

import Link from 'next/link';
import { Suspense } from 'react';

import AltIcon from '@/icons/alt-icon';
import SeparatorIcon from '@/icons/separator-icon';

import HeaderSegment from './header-segment';

export default function Header() {
  return (
    <header className="border-b-(length:--borderWidth-thin) flex h-16 w-full items-center border-b-[#3E444D] sm:h-14">
      <Link href="/" prefetch>
        <AltIcon className="ml-4 size-8 fill-fg-default sm:ml-15" />
      </Link>
      <Suspense>
        <HeaderSegment>
          <SeparatorIcon className="size-4 fill-fg-muted" />
        </HeaderSegment>
      </Suspense>
    </header>
  );
}
