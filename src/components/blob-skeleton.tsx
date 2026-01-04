import 'server-only';

import { clsx } from 'clsx/lite';
import { Fragment } from 'react';

import Link from './link';

export default function BlobSkeleton({
  branch,
  data,
  name,
  owner,
  isMarkdown,
}: {
  branch: string;
  data: string[];
  name: string;
  owner: string;
  isMarkdown: boolean;
}) {
  const path = decodeURIComponent(data.slice(0).join('/'));
  const pathSegments = path.split('/');

  return (
    <div className="flex w-full min-w-0 flex-col">
      <div className="mx-4 flex flex-col">
        <div className="mt-4 flex h-8 w-full items-center text-base">
          <Link
            className="font-semibold text-fg-default"
            href={`/${owner}/${name}`}
            prefetch
          >
            {name}
          </Link>
          {pathSegments.map((segment, index) => {
            const isLast = index === pathSegments.length - 1;
            const partialPath = pathSegments.slice(0, index + 1).join('/');

            return (
              <Fragment key={`path-segment-${segment}`}>
                <span className="mx-1 text-fg-muted">/</span>
                {isLast ? (
                  <span className="font-semibold text-fg-default">
                    {segment}
                  </span>
                ) : (
                  <Link
                    className="font-semibold"
                    href={`/${owner}/${name}/tree/${branch}/${partialPath}`}
                    prefetch
                  >
                    {segment}
                  </Link>
                )}
              </Fragment>
            );
          })}
        </div>
        <div className="border-(length:--borderWidth-thin) mt-4 flex h-11 w-full items-center rounded-(--borderRadius-medium) border-border-default">
          <div className="ml-3 flex shrink-0 animate-pulse items-center">
            <div className="mr-2 h-5 w-5 rounded-full bg-bg-neutral-muted" />
            <div className="h-3 w-25 rounded-(--borderRadius-small) bg-bg-neutral-muted" />
          </div>
        </div>
        <div className="mt-4 flex h-11.5 w-full items-center rounded-t-(--borderRadius-medium) border border-border-default bg-bg-muted">
          <span className="border-(length:--borderWidth-thin) ml-2 flex h-7 items-center rounded-(--borderRadius-medium) border-[#3d444d] bg-[#010409] px-3 font-semibold">
            {isMarkdown ? 'Preview' : 'Code'}
          </span>
          <span
            className={clsx(
              'ml-2 h-4 w-[30%] animate-pulse',
              'block rounded-(--borderRadius-small) bg-bg-neutral-muted',
            )}
          />
        </div>
        <div className="border-(length:--borderWidth-thin) mb-10 flex min-w-0 flex-col rounded-b-(--borderRadius-medium) border-border-default border-t-0 pt-2 leading-5">
          <div className="relative w-full pb-2">
            <div className="flex flex-col">
              {isMarkdown ? (
                <div className="container-lg w-full animate-pulse p-8">
                  <div className="h-4 w-[40%] rounded-(--borderRadius-small) bg-bg-neutral-muted" />
                  <div className="mt-6 h-4 w-full rounded-(--borderRadius-small) bg-bg-neutral-muted" />
                  <div className="mt-3 h-4 w-[95%] rounded-(--borderRadius-small) bg-bg-neutral-muted" />
                  <div className="mt-3 h-4 w-[98%] rounded-(--borderRadius-small) bg-bg-neutral-muted" />
                  <div className="mt-3 h-4 w-[92%] rounded-(--borderRadius-small) bg-bg-neutral-muted" />
                  <div className="mt-3 h-4 w-[97%] rounded-(--borderRadius-small) bg-bg-neutral-muted" />
                  <div className="mt-3 h-4 w-[91%] rounded-(--borderRadius-small) bg-bg-neutral-muted" />
                  <div className="mt-3 h-4 w-[94%] rounded-(--borderRadius-small) bg-bg-neutral-muted" />
                  <div className="mt-3 h-4 w-[44%] rounded-(--borderRadius-small) bg-bg-neutral-muted" />
                </div>
              ) : (
                <>
                  <div className="my-1 flex w-full animate-pulse">
                    <span
                      className={clsx(
                        'ml-11 h-3 w-4',
                        'block rounded-(--borderRadius-small) bg-bg-neutral-muted',
                      )}
                    />
                    <span
                      className={clsx(
                        'ml-8 h-3 w-20',
                        'block rounded-(--borderRadius-small) bg-bg-neutral-muted',
                      )}
                    />
                  </div>
                  <div className="my-1 flex w-full animate-pulse">
                    <span
                      className={clsx(
                        'ml-11 h-3 w-4',
                        'block rounded-(--borderRadius-small) bg-bg-neutral-muted',
                      )}
                    />
                    <span
                      className={clsx(
                        'ml-8 h-3 w-30',
                        'block rounded-(--borderRadius-small) bg-bg-neutral-muted',
                      )}
                    />
                  </div>
                  <div className="my-1 flex w-full animate-pulse">
                    <span
                      className={clsx(
                        'ml-11 h-3 w-4',
                        'block rounded-(--borderRadius-small) bg-bg-neutral-muted',
                      )}
                    />
                    <span
                      className={clsx(
                        'ml-8 h-3 w-25',
                        'block rounded-(--borderRadius-small) bg-bg-neutral-muted',
                      )}
                    />
                  </div>
                  <div className="my-1 flex w-full animate-pulse">
                    <span
                      className={clsx(
                        'ml-11 h-3 w-4',
                        'block rounded-(--borderRadius-small) bg-bg-neutral-muted',
                      )}
                    />
                  </div>
                  <div className="my-1 flex w-full animate-pulse">
                    <span
                      className={clsx(
                        'ml-11 h-3 w-4',
                        'block rounded-(--borderRadius-small) bg-bg-neutral-muted',
                      )}
                    />
                    <span
                      className={clsx(
                        'ml-8 h-3 w-45',
                        'block rounded-(--borderRadius-small) bg-bg-neutral-muted',
                      )}
                    />
                  </div>
                  <div className="my-1 flex w-full animate-pulse">
                    <span
                      className={clsx(
                        'ml-11 h-3 w-4',
                        'block rounded-(--borderRadius-small) bg-bg-neutral-muted',
                      )}
                    />
                    <span
                      className={clsx(
                        'ml-8 h-3 w-20',
                        'block rounded-(--borderRadius-small) bg-bg-neutral-muted',
                      )}
                    />
                  </div>
                  <div className="my-1 flex w-full animate-pulse">
                    <span
                      className={clsx(
                        'ml-11 h-3 w-4',
                        'block rounded-(--borderRadius-small) bg-bg-neutral-muted',
                      )}
                    />
                    <span
                      className={clsx(
                        'ml-8 h-3 w-25',
                        'block rounded-(--borderRadius-small) bg-bg-neutral-muted',
                      )}
                    />
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
