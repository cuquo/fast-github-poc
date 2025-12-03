import 'server-only';

import type { Metadata } from 'next';
import { Suspense } from 'react';

import RepoQueryNode, {
  type RepoQuery$data,
} from '@/graphql/queries/__generated__/RepoQuery.graphql';
import { repoQueryCache } from '@/graphql/queries/RepoQueryCache';
import { getQueryFromRelayStore } from '@/graphql/relay/load-serializable-query';
import Repo from '@/views/Repo';

type PageParams = {
  owner: string;
  name: string;
};

export default function Page({ params }: { params: Promise<PageParams> }) {
  return (
    <Suspense>
      <Repo params={params} />
    </Suspense>
  );
}

export async function generateMetadata({
  params,
}: {
  params: Promise<PageParams>;
}): Promise<Metadata> {
  const { owner, name } = await params;

  await repoQueryCache(owner, name);

  const { repository } = getQueryFromRelayStore<RepoQuery$data>(RepoQueryNode, {
    name,
    owner,
  });

  if (!repository) {
    return {};
  }

  const metaTitle = `${owner}/${name}: ${repository.description}`;

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
