/** biome-ignore-all lint/performance/noImgElement: use cached assets */
import 'server-only';

import { notFound } from 'next/navigation';
import { Fragment, use } from 'react';

import ButtonTop from '@/components/button';
import Link from '@/components/link';
import ListFiles from '@/components/list-files';
import TreeFragment, {
  type TreeFragment$key,
} from '@/graphql/fragments/__generated__/TreeFragment.graphql';
import TreeQueryNode, {
  type TreeQuery$data,
} from '@/graphql/queries/__generated__/TreeQuery.graphql';
import { treeQueryCache } from '@/graphql/queries/TreeQueryCache';
import getServerFragment from '@/graphql/relay/get-server-fragment';
import { getQueryFromRelayStore } from '@/graphql/relay/load-serializable-query';

export default function Tree({
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

  use(treeQueryCache(owner, name, `${branch}:${path}`, path));

  const { repository } = getQueryFromRelayStore<TreeQuery$data>(TreeQueryNode, {
    expr: `${branch}:${path}`,
    name,
    owner,
    path,
    withMeta: true,
  });

  if (!repository || !repository?.files) notFound();

  const { entries } = getServerFragment<TreeFragment$key>(
    TreeFragment,
    repository.files.treeHierarchyFragment,
  );

  const history = repository.defaultBranchRef?.target?.history;
  const author = history ? history.nodes?.[0]?.author : null;
  const user = author?.user;
  const userName = author ? author.name : null;
  const login = user ? user.login : null;
  const avatar = user ? user.avatarUrl : null;
  const oid = history ? history.nodes?.[0]?.oid : null;
  const commitUrl = oid ? `/${owner}/${name}/commit/${oid}` : null;
  const lastPr = history
    ? history.nodes?.[0]?.associatedPullRequests?.nodes?.[0]
    : null;
  const pr = lastPr ? lastPr.url : null;
  const message = history ? history.nodes?.[0]?.messageHeadline : null;
  const commitMessage =
    typeof message === 'string' ? message.split('(')[0].trimEnd() : null;
  const files =
    entries &&
    [...entries].sort((a, b) => {
      const isADir = a.type === 'tree';
      const isBDir = b.type === 'tree';
      if (isADir !== isBDir) return isADir ? -1 : 1;

      const isACommit = a.type === 'commit';
      const isBCommit = b.type === 'commit';
      if (isACommit !== isBCommit) return isACommit ? -1 : 1;

      return a.name.localeCompare(b.name, undefined, {
        sensitivity: 'accent',
      });
    });

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
          <div className="relative z-11 flex w-full">
            <div className="border-(length:--borderWidth-thin) mt-4 flex h-11 w-full items-center rounded-(--borderRadius-medium) border-border-default bg-bg-default">
              {login && (
                <span
                  // href={userUrl}
                  className="ml-3 flex shrink-0 select-none items-center font-semibold text-fg-default!"
                >
                  {avatar && (
                    <img
                      alt={userName || login || 'avatar'}
                      className="border-(length:--borderWidth-thin) mr-2 h-5 w-5 rounded-full border-[#ffffff26]"
                      src={avatar}
                    />
                  )}
                  <span>{login}</span>
                </span>
              )}
              {message && commitUrl ? (
                <div className="ml-2 block truncate pr-8">
                  <span
                    // href={commitUrl}
                    className="select-none text-fg-muted! hover:text-fg-accent! hover:underline"
                    title={message}
                  >
                    {commitMessage}
                    {pr ? ` (` : ''}
                  </span>
                  {pr ? (
                    <>
                      <Link
                        className="select-none text-fg-accent hover:text-dodger-blue hover:underline"
                        href={pr.replace(
                          /^(https?:\/\/)?(www\.)?github\.com\//,
                          '/',
                        )}
                        prefetch={false}
                      >
                        #{lastPr?.number}
                      </Link>
                      <span
                        // href={commitUrl}
                        className="select-none text-fg-muted! hover:text-fg-accent! hover:underline"
                        title={message}
                      >
                        {')'}
                      </span>
                    </>
                  ) : null}
                </div>
              ) : null}
            </div>
            <div className="absolute top-13 flex h-5 w-full overflow-hidden bg-bg-default pb-3">
              <div className="absolute bottom-3 flex h-11.5 w-full rounded-b-(--borderRadius-medium) border border-border-default bg-bg-default"></div>
            </div>
            <div className="absolute top-16 flex h-5 w-full overflow-hidden bg-bg-default pt-3">
              <div className="flex h-11.5 w-full rounded-t-(--borderRadius-medium) border border-border-default bg-bg-muted"></div>
            </div>
            <div className="absolute top-1 flex h-5 w-full overflow-hidden bg-bg-default pt-3">
              <div className="flex h-11.5 w-full rounded-t-(--borderRadius-medium) border border-border-default bg-bg-default"></div>
            </div>
          </div>
          <div className="sticky top-0 z-9 -mt-11.25 flex w-full">
            <div className="flex h-11.25 w-full items-center justify-between border border-border-default border-t-0 bg-bg-muted pr-2 pl-4">
              <div className="flex items-center">
                <Link
                  className="font-semibold text-fg-default"
                  href={`/${owner}/${name}`}
                  prefetch
                >
                  {name}
                </Link>
                <span className="mx-1 text-fg-muted">/</span>
                <span className="font-semibold text-fg-default">{path}</span>
              </div>
              <ButtonTop />
            </div>
          </div>
          <div className="contain-[layout_paint_style] mt-4 mb-10 flex min-w-0 flex-col overflow-hidden rounded-(--borderRadius-medium) border border-border-default">
            <ListFiles
              branch={branch}
              files={files}
              isTreeView
              owner={owner}
              previousPath={previousPath || `/${owner}/${name}`}
              repo={name}
            />
          </div>
        </div>
      </div>
    </>
  );
}
