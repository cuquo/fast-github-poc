import 'server-only';

import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { Suspense } from 'react';

import PullRequestSkeleton from '@/components/pull-request/pull-request-skeleton';
import PullRequestQueryNode, {
  type PullRequestQuery$data,
} from '@/graphql/queries/__generated__/PullRequestQuery.graphql';
import { pullRequestQueryCache } from '@/graphql/queries/PullRequestQueryCache';
import { getQueryFromRelayStore } from '@/graphql/relay/load-serializable-query';
import PullRequest from '@/views/PullRequest';

type PageParams = {
  owner: string;
  name: string;
  data: string[];
};

async function getPullRequestParams(
  paramsPromise: Promise<PageParams>,
): Promise<{ owner: string; name: string; prId: number }> {
  const p = await paramsPromise;

  const [prId] = p.data;
  const parsed = Number.parseInt(prId, 10);

  if (!Number.isInteger(parsed)) notFound();

  return { name: p.name, owner: p.owner, prId: parsed };
}

export async function generateMetadata({
  params,
}: {
  params: Promise<PageParams>;
}): Promise<Metadata> {
  const { owner, name, prId } = await getPullRequestParams(params);

  await pullRequestQueryCache(owner, name, prId);

  const { repository } = getQueryFromRelayStore<PullRequestQuery$data>(
    PullRequestQueryNode,
    {
      name,
      number: prId,
      owner,
    },
  );

  if (!repository || !repository.pullRequest) return {};

  const pullRequest = repository.pullRequest;
  const { title } = pullRequest;

  const metaTitle = `${title} · Pull Request #${prId} · ${owner}/${name}`;

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

export default function PullRequestPage({
  params,
}: {
  params: Promise<PageParams>;
}) {
  const data = getPullRequestParams(params);

  return (
    <Suspense fallback={<PullRequestSkeleton />}>
      <PullRequest data={data} />
    </Suspense>
  );
}
