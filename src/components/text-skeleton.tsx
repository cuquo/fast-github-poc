import 'server-only';

import { clsx } from 'clsx/lite';

export default function TextSkeleton({ className }: { className?: string }) {
  return (
    <div className={clsx('flex animate-pulse flex-wrap py-12', className)}>
      <div className="mb-3 flex w-full">
        <div className="mr-2 mb-2 h-4 w-32 rounded-sm bg-mirage" />
      </div>
      <div className="mr-2 mb-2 h-4 w-32 rounded-sm bg-mirage" />
      <div className="mr-2 mb-2 h-4 w-8 rounded-sm bg-mirage" />
      <div className="mr-2 mb-2 h-4 w-32 rounded-sm bg-mirage" />
      <div className="mr-2 mb-2 h-4 w-26 rounded-sm bg-mirage" />
      <div className="mr-2 mb-2 h-4 w-18 rounded-sm bg-mirage" />
      <div className="mr-2 mb-2 h-4 w-30 rounded-sm bg-mirage" />
      <div className="mr-2 mb-2 h-4 w-20 rounded-sm bg-mirage" />
      <div className="mr-2 mb-2 h-4 w-14 rounded-sm bg-mirage" />
      <div className="mr-2 mb-2 h-4 w-32 rounded-sm bg-mirage" />
      <div className="mr-2 mb-2 h-4 w-8 rounded-sm bg-mirage" />
      <div className="mr-2 mb-2 h-4 w-32 rounded-sm bg-mirage" />
      <div className="mt-4 flex w-full">
        <div className="mr-2 mb-2 h-4 w-26 rounded-sm bg-mirage" />
        <div className="mr-2 mb-2 h-4 w-18 rounded-sm bg-mirage" />
        <div className="mr-2 mb-2 h-4 w-30 rounded-sm bg-mirage" />
        <div className="mr-2 mb-2 h-4 w-20 rounded-sm bg-mirage" />
        <div className="mr-2 mb-2 h-4 w-40 rounded-sm bg-mirage" />
      </div>
    </div>
  );
}
