/** biome-ignore-all lint/performance/noImgElement: use cached assets */
import 'server-only';

import { Fragment } from 'react';

import DirectoryIcon from '@/icons/directory-icon';

import Link from './link';

export default function TreeSkeleton({
  branch,
  data,
  name,
  owner,
}: {
  branch: string;
  data: string[];
  name: string;
  owner: string;
}) {
  const path = decodeURIComponent(data.slice(0).join('/'));
  const pathSegments = path.split('/');
  const previousPath =
    pathSegments.length > 1 &&
    `/${owner}/${name}/tree/${branch}/${pathSegments.slice(0, -1).join('/')}`;

  return (
    <>
      <link
        href="/assets/syntax-highlighting.css"
        precedence="medium"
        rel="stylesheet"
      />
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
          <div className="contain-[layout_paint_style] mt-4 mb-10 flex min-w-0 flex-col overflow-hidden rounded-(--borderRadius-medium) border border-border-default">
            <table className="Table-module w-full table-fixed">
              <thead className="border-b-(length:--borderWidth-thin) border-border-default bg-bg-muted">
                <tr className="h-10">
                  <th className="w-full pl-4 text-left font-semibold text-fg-muted text-xs md:w-[40%]">
                    Name
                  </th>
                  <th className="hidden w-[calc(100%-136px)] pl-4 text-left font-semibold text-fg-muted text-xs md:table-cell md:w-[40%]">
                    Last commit message
                  </th>
                  <th className="w-34 pr-4 text-right font-semibold text-fg-muted text-xs">
                    Last commit date
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b-(length:--borderWidth-thin) border-border-default hover:bg-bg-muted">
                  <td className="w-full" colSpan={3}>
                    <Link
                      className="hover:no-underline! flex h-10 items-center text-fg-default! tracking-[2px] hover:text-fg-accent!"
                      href={previousPath || `/${owner}/${name}`}
                      prefetch
                    >
                      <DirectoryIcon className="mr-2.5 ml-4 inline-block h-4 w-4 fill-fg-muted align-middle" />
                      ..
                    </Link>
                  </td>
                </tr>
                <tr
                  className={
                    'border-b-(length:--borderWidth-thin) table-row border-border-default last:border-0 hover:bg-bg-muted'
                  }
                >
                  <td className="w-[calc(100%-136px)] pl-4 md:w-[40%]">
                    <div className="flex h-10 items-center truncate">
                      <DirectoryIcon className="mr-2.5 inline-block h-4 w-4 fill-fg-muted align-middle" />
                      <div className="mr-4 h-4 w-26 @[540px]:max-w-100 animate-pulse rounded-sm bg-mirage" />
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
}
