import 'server-only';

import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { Suspense, use } from 'react';

import BlobSkeleton from '@/components/blob-skeleton';
import { ALLOWED_REPOS } from '@/constants/options';
import BlobByPathQueryNode, {
  type BlobByPathQuery$data,
} from '@/graphql/queries/__generated__/BlobByPathQuery.graphql';
import { blobByPathQueryCache } from '@/graphql/queries/BlobByPathQueryCache';
import { getQueryFromRelayStore } from '@/graphql/relay/load-serializable-query';
import Blob from '@/views/Blob';

type PageParams = {
  branch: string;
  data: string[];
  name: string;
  owner: string;
};

export default function Page({ params }: { params: Promise<PageParams> }) {
  return (
    <Suspense>
      <Route params={params} />
    </Suspense>
  );
}

function Route({ params }: { params: Promise<PageParams> }) {
  const { name, owner, data, branch } = use(params);
  const lastItem = data[data.length - 1];
  const isMarkdown =
    lastItem.endsWith('.md') ||
    lastItem.endsWith('.markdown') ||
    lastItem.endsWith('.mdx');

  if (!ALLOWED_REPOS.includes(owner)) notFound();

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

export async function generateMetadata({
  params,
}: {
  params: Promise<PageParams>;
}): Promise<Metadata> {
  const { name, owner, data, branch } = await params;
  const path = decodeURIComponent(data.slice(0).join('/'));

  await blobByPathQueryCache(owner, name, `${branch}:${path}`, path);

  const { repository } = getQueryFromRelayStore<BlobByPathQuery$data>(
    BlobByPathQueryNode,
    {
      expr: `${branch}:${path}`,
      name,
      owner,
      path,
      withMeta: true,
    },
  );

  if (!repository) {
    return {};
  }

  const metaTitle = `${name}/${path} at ${branch} · ${owner}/${name}`;

  return {
    description: repository.description ?? undefined,
    openGraph: {
      description: repository.description ?? undefined,
      images: [
        {
          url: repository.openGraphImageUrl ?? repository.owner.avatarUrl,
        },
      ],
      title: metaTitle,
    },
    title: metaTitle,
  };
}
