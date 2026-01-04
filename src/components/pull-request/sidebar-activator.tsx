'use client';

import { useEffect } from 'react';

/*
  This component activates the sidebar scroll markers when the last chunk of the PR diff is loaded.
  It waits for the next animation frame to ensure that the DOM is fully updated
  before adding the necessary class to the sidebar element.

  Why? Chrome visual render could crash (renderer process termination) if the 
  `scroll-target-group` property (used for Scroll Markers) is active while the DOM 
  is actively mutating via streaming chunks. 

  The browser attempts to recalculate the spatial map for scroll markers on every 
  layout shift caused by incoming chunks, leading to an infinite layout cycle or 
  excessive memory usage. By deferring activation until the stream completes, 
  we ensure the heavy layout calculation happens only once on a stable DOM.
*/
export function SidebarActivator() {
  useEffect(() => {
    let raf = 0;

    raf = requestAnimationFrame(() => {
      const sidebar = document.querySelector<HTMLElement>('.sidebar');
      if (!sidebar) return;

      if (sidebar.classList.contains('f-sidebar')) return;

      sidebar.classList.add('f-sidebar');
    });

    return () => {
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  return null;
}
