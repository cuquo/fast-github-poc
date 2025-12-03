import { notFound } from 'next/navigation';
import { Suspense, use } from 'react';

import BlobSkeleton from '@/components/blob-skeleton';
import Blob from '@/views/Blob';

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
  const lastItem = data[data.length - 1];
  const isMarkdown =
    lastItem.endsWith('.md') ||
    lastItem.endsWith('.markdown') ||
    lastItem.endsWith('.mdx');

  if (!['vercel', 'facebook', 'oven-sh'].includes(owner)) notFound();

  return (
    <Suspense
      fallback={
        <BlobSkeleton
          branch={branch}
          data={data}
          isMarkdown={isMarkdown}
          name={name}
          owner={owner}
        />
      }
    >
      <Blob
        branch={branch}
        data={data}
        isMarkdown={isMarkdown}
        name={name}
        owner={owner}
      />
    </Suspense>
  );
}
