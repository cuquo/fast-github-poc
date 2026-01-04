import { notFound } from 'next/navigation';
import { Suspense, use } from 'react';

import { ALLOWED_REPOS } from '@/constants/options';
import Owner from '@/views/Owner';

export default function Page({
  params,
}: {
  params: Promise<{ owner: string }>;
}) {
  return (
    <Suspense>
      <Route owner={params.then((p) => p.owner)} />
    </Suspense>
  );
}

function Route({ owner }: { owner: Promise<string> }) {
  const path = use(owner);

  if (!ALLOWED_REPOS.includes(path)) notFound();

  return <Owner owner={path} />;
}
