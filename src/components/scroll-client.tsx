'use client';

import { memo, useLayoutEffect, useRef, useState } from 'react';

let lastSidebarScroll = 0; // persists across navigations while the app is loaded

function SidebarScroll({ children }: { children: React.ReactNode }) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [number, setNumber] = useState(0);
  console.log('mount', number);

  useLayoutEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    setNumber((n) => n + 1);

    // Restore previous scroll position *before* paint
    el.scrollTop = lastSidebarScroll;

    const onScroll = () => {
      // Persist scroll position in module scope
      lastSidebarScroll = el.scrollTop;
    };

    el.addEventListener('scroll', onScroll);
    el.classList.remove('hide-chrome-scrollbar');

    return () => {
      el.classList.add('hide-chrome-scrollbar');
      el.removeEventListener('scroll', onScroll);
    };
  }, []);

  return (
    <div
      className="contain-[layout_paint_style] h-screen overflow-y-auto bg-bg-canvas [scrollbar-gutter:stable]"
      ref={containerRef}
    >
      <div className="my-2 w-full px-4">
        <ul className="w-full">{children}</ul>
      </div>
    </div>
  );
}

export default memo(SidebarScroll);
