import { notFound } from 'next/navigation';
import { Suspense } from 'react';

import PullRequestSkeleton from '@/components/pull-request-skeleton';
import PullRequest from '@/views/PullRequest';

export default function PullRequestPage({
  params,
}: {
  params: Promise<{
    owner: string;
    name: string;
    data: string[];
  }>;
}) {
  const data = params.then((p) => {
    const [prId] = p.data;
    const parsed = Number.parseInt(prId, 10);

    if (!Number.isInteger(parsed)) {
      notFound();
    }

    return { name: p.name, owner: p.owner, prId: parsed };
  });

  return (
    <Suspense fallback={<PullRequestSkeleton />}>
      <PullRequest data={data} />
    </Suspense>
  );
}
