import 'server-only';

import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { Suspense, use } from 'react';

import TreeSkeleton from '@/components/tree-skeleton';
import { ALLOWED_REPOS } from '@/constants/options';
import TreeQueryNode, {
  type TreeQuery$data,
} from '@/graphql/queries/__generated__/TreeQuery.graphql';
import { treeQueryCache } from '@/graphql/queries/TreeQueryCache';
import { getQueryFromRelayStore } from '@/graphql/relay/load-serializable-query';
import Tree from '@/views/Tree';

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

  if (!ALLOWED_REPOS.includes(owner)) notFound();

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

export async function generateMetadata({
  params,
}: {
  params: Promise<PageParams>;
}): Promise<Metadata> {
  const { name, owner, data, branch } = await params;
  const path = decodeURIComponent(data.slice(0).join('/'));

  await treeQueryCache(owner, name, `${branch}:${path}`, path);

  const { repository } = getQueryFromRelayStore<TreeQuery$data>(TreeQueryNode, {
    expr: `${branch}:${path}`,
    name,
    owner,
    path,
    withMeta: true,
  });

  if (!repository || !repository?.files) return {};

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
