import 'server-only';

export default function LoadMoreSkeleton() {
  return (
    <div className="mb-8 flex h-8 w-full items-center justify-center gap-1">
      <div className="size-2 animate-pulse rounded-full bg-bg-neutral-muted [animation-delay:-0.32s]" />
      <div className="size-2 animate-pulse rounded-full bg-bg-neutral-muted [animation-delay:-0.16s]" />
      <div className="size-2 animate-pulse rounded-full bg-bg-neutral-muted" />
    </div>
  );
}
