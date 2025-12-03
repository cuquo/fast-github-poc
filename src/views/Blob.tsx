/** biome-ignore-all lint/performance/noImgElement: use already optimized image from github */
import 'server-only';

import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Fragment, Suspense, use } from 'react';

import BlobHighlight from '@/components/blob-highlight';
import ButtonTop from '@/components/button';
import Markdown from '@/components/markdown';
import BlobByPathQueryNode, {
  type BlobByPathQuery,
  type BlobByPathQuery$data,
} from '@/graphql/queries/__generated__/BlobByPathQuery.graphql';
import {
  getQueryFromRelayStore,
  loadSerializableQuery,
} from '@/graphql/relay/load-serializable-query';
import { formatBytes } from '@/utils/format-bytes';
import { countLinesAndLoc } from '@/utils/number-of-lines';

export default function Blob({
  branch,
  data,
  isMarkdown,
  name,
  owner,
}: {
  branch: string;
  data: string[];
  isMarkdown: boolean;
  name: string;
  owner: string;
}) {
  const path = decodeURIComponent(data.slice(0).join('/'));

  use(
    loadSerializableQuery<typeof BlobByPathQueryNode, BlobByPathQuery>(
      BlobByPathQueryNode,
      {
        expr: `${branch}:${path}`,
        name,
        owner,
        path,
        withMeta: true,
      },
    ),
  );

  const { repository } = getQueryFromRelayStore<BlobByPathQuery$data>(
    BlobByPathQueryNode,
    {
      expr: `${branch}:${path}`,
      name,
      owner,
      path,
      withMeta: true,
    },
  );

  if (!repository) notFound();

  const blob = repository.object;
  const text = blob?.text;
  const isBinary = blob?.isBinary;
  const size = blob?.byteSize ?? 0;
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
  const isPendingTooLarge = size > 409600;

  // If the blob is not found, return 404
  // if (!text && !isBinary) return notFound();

  const linesOfCode =
    typeof text === 'string' &&
    countLinesAndLoc(text, { trimFinalNewline: true });
  const pathSegments = path ? path.split('/') : [];
  const fileInfo =
    linesOfCode && linesOfCode.total > 0
      ? `${linesOfCode.total} line${linesOfCode.total > 1 ? 's' : ''} (${linesOfCode.loc} loc) · ${formatBytes(size ?? 0)}`
      : '';

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
                      prefetch
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
          <div className="relative z-11 flex w-full">
            <div className="absolute top-1 flex h-5 w-full overflow-hidden bg-bg-default pt-3">
              <div className="flex h-11.5 w-full rounded-t-(--borderRadius-medium) border border-border-default bg-bg-muted"></div>
            </div>
          </div>
          <div className="sticky top-[45px] z-10 mt-4 flex h-[46px] w-full items-center border border-border-default border-t-0 bg-bg-muted pt-px">
            <span className="border-(length:--borderWidth-thin) ml-2 flex h-7 items-center rounded-(--borderRadius-medium) border-[#3d444d] bg-[#010409] px-3 font-semibold">
              {isMarkdown ? 'Preview' : 'Code'}
            </span>
            {linesOfCode && linesOfCode.total > 0 && (
              <span className="ml-2 font-mono text-fg-muted text-xs">
                {fileInfo}
              </span>
            )}
            <div className="-top-2.5 absolute left-0 h-2.5 w-full bg-linear-to-t from-bg-muted to-transparent">
              <div className="absolute bottom-0 h-px w-full bg-border-default"></div>
            </div>
          </div>
          <div className="-mt-[45px] sticky top-0 z-9 flex w-full">
            <div className="flex h-[45px] w-full items-center justify-between border border-border-default border-t-0 bg-bg-muted pr-2 pl-4">
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
          <div className="contain-[layout_paint_style] mb-10 flex min-w-0 flex-col rounded-b-(--borderRadius-medium) border border-border-default border-t-0 pt-2 leading-5">
            <div className="relative w-full pb-2">
              {isMarkdown ? (
                <Markdown
                  className="container-lg w-full p-8"
                  context={`${owner}/${name}/${branch}/${path}`}
                  text={text}
                />
              ) : !isPendingTooLarge && typeof text === 'string' ? (
                <div className="scroll-pt-[30vh] overflow-x-scroll">
                  <Suspense fallback={<pre className="pl-23">{text}</pre>}>
                    <BlobHighlight
                      context={`${owner}/${name}/${branch}/${path}`}
                      isBinary={isBinary}
                      path={path}
                      text={text}
                    />
                  </Suspense>
                </div>
              ) : (
                <span className="ml-4 text-fg-muted">
                  Batch logic for larger files is still pending.
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
