import { notFound } from 'next/navigation';
import { Suspense, use } from 'react';

import TreeSkeleton from '@/components/tree-skeleton';
import Tree from '@/views/Tree';

export default function Page({
  params,
}: {
  params: Promise<{
    branch: string;
    data: string[];
    name: string;
    owner: string;
  }>;
}) {
  return (
    <Suspense>
      <Route params={params} />
    </Suspense>
  );
}

function Route({
  params,
}: {
  params: Promise<{
    branch: string;
    data: string[];
    name: string;
    owner: string;
  }>;
}) {
  const { name, owner, data, branch } = use(params);

  if (!['vercel', 'facebook', 'oven-sh'].includes(owner)) notFound();

  return (
    <Suspense
      fallback={
        <TreeSkeleton branch={branch} data={data} name={name} owner={owner} />
      }
    >
      <Tree branch={branch} data={data} name={name} owner={owner} />
    </Suspense>
  );
}
