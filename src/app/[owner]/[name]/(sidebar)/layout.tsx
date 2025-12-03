import { Suspense } from 'react';

import Sidebar from '../../../../components/sidebar';
import SidebarSkeleton from '../../../../components/sidebar-skeleton';

export default function RefLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{
    name: string;
    owner: string;
  }>;
}>) {
  return (
    <main className="flex w-full">
      <aside className="border-r-(length:--borderWidth-thin) sticky top-0 hidden h-screen w-80 shrink-0 border-border-default lg:block">
        <div className="block w-full">
          <Suspense fallback={<SidebarSkeleton />}>
            <Sidebar
              params={params.then((p) => ({
                branch: 'HEAD',
                name: p.name,
                owner: p.owner,
              }))}
            />
          </Suspense>
        </div>
      </aside>
      {children}
    </main>
  );
}
