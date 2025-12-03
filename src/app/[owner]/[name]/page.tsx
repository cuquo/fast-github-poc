import 'server-only';

import { Suspense } from 'react';

import Repo from '@/views/Repo';

export default function Page({
  params,
}: {
  params: Promise<{ name: string; owner: string }>;
}) {
  return (
    <Suspense>
      <Repo params={params} />
    </Suspense>
  );
}
