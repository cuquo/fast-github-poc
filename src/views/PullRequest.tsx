import 'server-only';

import { notFound } from 'next/navigation';
import { Suspense, use } from 'react';

import { PerformanceMarker } from '@/components/performance-marker';
import DiffEntries from '@/components/pull-request/diff-entries';
import PRStatus from '@/components/pull-request/pr-status';
import PullRequestSidebar from '@/components/pull-request/pull-request-sidebar';
import PullSidebarSkeleton from '@/components/pull-request/pull-sidebar-skeleton';
import { ALLOWED_REPOS } from '@/constants/options';
import PullRequestQueryNode, {
  type PullRequestQuery$data,
} from '@/graphql/queries/__generated__/PullRequestQuery.graphql';
import { pullRequestQueryCache } from '@/graphql/queries/PullRequestQueryCache';
import { getQueryFromRelayStore } from '@/graphql/relay/load-serializable-query';
import CodeIcon from '@/icons/code-icon';
import CommentIcon from '@/icons/comment-icon';
import CopyIcon from '@/icons/copy-icon';
import SidebarCollapseIcon from '@/icons/sidebar-collapse-icon';
import SidebarExpandIcon from '@/icons/sidebar-expand-icon';
import TriangleDownIcon from '@/icons/triangle-down-icon';
import { numberFormatter } from '@/utils/number-formatter';
import { getInitialPatches } from '@/utils/pr-files-waterfall';

export default function PullRequest({
  data,
}: {
  data: Promise<{ prId: number; owner: string; name: string }>;
}) {
  const { prId, owner, name } = use(data);

  if (!ALLOWED_REPOS.includes(owner)) notFound();

  use(pullRequestQueryCache(owner, name, prId));

  const { repository } = getQueryFromRelayStore<PullRequestQuery$data>(
    PullRequestQueryNode,
    {
      name,
      number: prId,
      owner,
    },
  );

  if (!repository || !repository.pullRequest) notFound();

  const initial = use(getInitialPatches(owner, name, prId));

  if (!initial) notFound();

  const { first, hasMore, remainderNonRoot, remainderRoot } = initial;

  const pullRequest = repository.pullRequest;
  const {
    additions,
    author,
    baseRefName,
    baseRepository,
    changedFiles,
    closed,
    commits,
    deletions,
    headRefName,
    headRepository,
    merged,
    title,
    totalCommentsCount,
  } = pullRequest;
  const state = merged ? 'merged' : closed ? 'closed' : 'open';
  const authorLogin = author?.login;
  const authorName = author?.name;
  const totalChecks = getChecksCount(repository);
  const totalCommits = commits?.totalCount ?? 0;
  const commitAction = state === 'merged' ? 'merged' : 'wants to merge';
  const sameRepo =
    baseRepository?.id === headRepository?.id &&
    baseRepository !== null &&
    headRepository !== null;
  const baseRepositoryOwner = baseRepository?.owner.login;
  const headRepositoryOwner = headRepository?.owner.login;
  // activate Scroll Markers only for PRs with <= 100 changed files
  const hasEnhancedSidebar = changedFiles > 1 && changedFiles <= 100;

  return (
    <>
      <PerformanceMarker name={`[PrDiff]-start`} type="mark" />
      <input
        className="show-sidebar-state hidden"
        defaultChecked
        id="show-sidebar"
        type="checkbox"
      />
      <div className="sticky z-10 w-full px-4 pt-6 md:px-6 lg:px-8">
        <div className="flex w-full flex-col md:flex-row md:items-center md:justify-between">
          <h1 className="order-2 mb-2! leading-[32.5px]! sm:leading-10 md:order-1">
            <span className="font-normal text-2xl sm:text-[32px]">{title}</span>
            <span className="ml-2 font-light text-2xl text-fg-muted sm:text-[32px]">
              #{prId}
            </span>
          </h1>
          <div className="border-(length:--borderWidth-thin) order-1 mb-6 flex h-7 shrink-0 items-center self-start rounded-(--borderRadius-medium) border-[#3d444d] bg-[#212830] px-2 md:order-2 md:mb-0 md:ml-2 md:self-center">
            <CodeIcon className="mr-1 hidden fill-fg-muted align-text-bottom sm:inline-block" />
            <span className="select-none font-medium text-xs">Code</span>
            <TriangleDownIcon className="ml-1 inline-block fill-fg-muted align-text-bottom" />
          </div>
        </div>
        <div className="relative z-10 flex w-full flex-col bg-bg-default md:flex-row md:items-center">
          <PRStatus className="mb-2 md:mb-0" state={state} />
          <div className="wrap-break-word block min-w-0 select-none text-fg-muted md:ml-2">
            {authorLogin && (
              <span
                className="max-w-31.25 truncate font-semibold underline"
                {...(authorName && { title: authorName })}
              >
                {authorLogin}
              </span>
            )}
            {` ${commitAction} ${totalCommits} ${totalCommits === 1 ? 'commit' : 'commits'} into `}
            <div className="inline-flex flex-wrap rounded-(--borderRadius-medium) bg-[#131D2E] px-1.5 py-0.5 font-mono text-fg-accent text-xs leading-normal">
              {sameRepo ? (
                <span className="max-w-[80vw] truncate">{baseRefName}</span>
              ) : (
                <>
                  <span className="max-w-[80vw] truncate">
                    {baseRepositoryOwner}
                  </span>
                  {':'}
                  <span className="max-w-[80vw] truncate">{baseRefName}</span>
                </>
              )}
            </div>
            {` from `}
            <div className="inline-flex flex-wrap rounded-(--borderRadius-medium) bg-[#131D2E] px-1.5 py-0.5 font-mono text-fg-accent text-xs leading-normal">
              {sameRepo ? (
                <span className="max-w-[80vw] truncate">{headRefName}</span>
              ) : (
                <>
                  <span className="max-w-[80vw] truncate">
                    {headRepositoryOwner || 'unknown'}
                  </span>
                  {':'}
                  <span className="max-w-[80vw] truncate">{headRefName}</span>
                </>
              )}
            </div>
            <span>
              <CopyIcon className="ml-1.5 inline-block h-4 w-4 fill-fg-muted" />
            </span>
            {state === 'merged' && pullRequest.mergedAt && (
              <span className="inline">{` on ${formatPrDate(pullRequest.mergedAt)}`}</span>
            )}
          </div>
        </div>
      </div>
      <div className="sticky z-10 bg-bg-default pt-4">
        <div className="mask-x-from-[calc(100%-16px)] mask-x-to-100% md:mask-none hide-chrome-scrollbar overflow-x-scroll md:overflow-hidden">
          <nav className="inline-flex w-full md:w-[calc(100%-24px)] lg:w-[calc(100%-32px)]">
            <div className="border-b-(length:--borderWidth-thin) ml-4 flex h-10 shrink-0 select-none items-center border-border-default px-4 md:ml-6 lg:ml-8">
              <CommentIcon className="mr-2 inline-block size-4 fill-fg-default" />
              Conversation
              <span className="border-(length:--borderWidth-thin) ml-2 rounded-full border-[#00000000] bg-bg-neutral-muted px-1.5 py-0.5 font-semibold text-xs leading-3">
                {totalCommentsCount}
              </span>
            </div>
            <div className="border-b-(length:--borderWidth-thin) flex h-10 shrink-0 items-center border-border-default px-4">
              <CommentIcon className="mr-2 inline-block size-4 fill-fg-default" />
              Commits
              <span className="border-(length:--borderWidth-thin) ml-2 rounded-full border-[#00000000] bg-bg-neutral-muted px-1.5 py-0.5 font-semibold text-xs leading-3">
                {totalCommits}
              </span>
            </div>
            <div className="border-b-(length:--borderWidth-thin) flex h-10 shrink-0 select-none items-center border-border-default px-4">
              <CommentIcon className="mr-2 inline-block size-4 fill-fg-default" />
              Checks
              <span className="border-(length:--borderWidth-thin) ml-2 rounded-full border-[#00000000] bg-bg-neutral-muted px-1.5 py-0.5 font-semibold text-xs leading-3">
                {totalChecks}
              </span>
            </div>
            <div className="border-(length:--borderWidth-thin) z-1 flex h-10 shrink-0 select-none items-center rounded-t-(--borderRadius-medium) border-border-default border-b-0 bg-bg-default px-4">
              <CommentIcon className="mr-2 inline-block size-4 fill-fg-default" />
              Files changed
              <span className="border-(length:--borderWidth-thin) ml-2 rounded-full border-[#00000000] bg-bg-neutral-muted px-1.5 py-0.5 font-semibold text-xs leading-3">
                {changedFiles}
              </span>
            </div>
            <div className="sm:border-b-(length:--borderWidth-thin) flex h-10 min-w-4 select-none items-center border-border-default sm:flex sm:w-full">
              <div className="md:mask-l-from-50% md:mask-l-to-95% flex w-full md:justify-end">
                <span className="hidden gap-1 font-semibold text-xs md:flex">
                  {additions > 0 && (
                    <span className="text-[#3fb950]">
                      +{numberFormatter.format(additions) ?? 0}
                    </span>
                  )}
                  {deletions > 0 && (
                    <span className="text-[#f85149]">
                      -{numberFormatter.format(deletions) ?? 0}
                    </span>
                  )}
                </span>
              </div>
            </div>
          </nav>
        </div>
      </div>
      <div className="top-0 left-15 z-9 -mt-15 hidden h-15 w-0 md:sticky md:block lg:left-0">
        <div className="relative flex h-14.75 w-[calc(100vw-243px)] bg-bg-default lg:ml-17 lg:w-[calc(100vw-259px)]">
          <div className="flex h-full w-full items-center">
            <PRStatus className="mb-2 md:mb-0" state={state} />
            <div className="ml-2 flex w-full min-w-0 flex-col">
              <div className="-mb-1 inline-flex min-w-0 max-w-full">
                <span className="truncate font-semibold">{title}</span>
                <span className="ml-2 shrink-0 whitespace-nowrap text-fg-muted">
                  #{prId}
                </span>
              </div>
              <div className="flex h-7 w-full min-w-0 items-center text-xs">
                <span className="flex shrink-0 items-center font-medium text-xs">
                  All commits
                  <TriangleDownIcon className="ml-1 inline-block fill-fg-muted align-text-bottom" />
                </span>
                <div className="border-l-(length:--borderWidth-thin) ml-2 h-4 w-px border-border-default" />
                <div className="hidden min-w-0 flex-1 items-baseline overflow-hidden text-fg-muted text-xs md:ml-2 lg:flex">
                  {authorLogin && (
                    <span
                      className="shrink-0 font-semibold underline"
                      {...(authorName && { title: authorName })}
                    >
                      {authorLogin}
                    </span>
                  )}
                  <span className="mx-1 shrink-0">{` ${commitAction} ${totalCommits} ${totalCommits === 1 ? 'commit' : 'commits'} into `}</span>
                  <span className="inline-flex min-w-0 max-w-[25vw] shrink truncate rounded-(--borderRadius-medium) bg-[#131D2E] px-1.5 py-0.5 font-mono text-fg-accent text-xs leading-normal">
                    <span className="truncate">
                      {sameRepo
                        ? baseRefName
                        : `${baseRepositoryOwner}:${baseRefName}`}
                    </span>
                  </span>
                  <span className="mx-1 shrink-0">{` from `}</span>
                  <span className="inline-flex min-w-0 max-w-[25vw] shrink truncate rounded-(--borderRadius-medium) bg-[#131D2E] px-1.5 py-0.5 font-mono text-fg-accent text-xs leading-normal">
                    <span className="truncate">
                      {sameRepo
                        ? headRefName
                        : `${headRepositoryOwner || 'unknown'}:${headRefName}`}
                    </span>
                  </span>
                  <CopyIcon className="ml-2 h-4 w-4 shrink-0 self-center fill-fg-muted" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="info-sticky sticky top-0 z-8 flex h-15 w-full">
        <div className="relative h-15 w-full min-w-0 md:contain-strict">
          <div className="absolute h-14.75 w-full bg-bg-default" />
          <div className="absolute bottom-0 left-4 h-px w-[calc(100%-32px)] bg-[#3d444d] md:left-6 md:w-[calc(100%-48px)] lg:left-8 lg:w-[calc(100%-64px)]" />
          <div className="relative flex h-15 w-full items-start px-4 md:h-30 md:px-6 lg:px-8">
            <div className="sticky top-0 left-0 -z-1 -mt-px block h-15 w-0">
              <div className="-ml-4 h-15 w-screen bg-[#3d444d] md:-ml-6 lg:-ml-8" />
            </div>
            <label
              className="show-sidebar-button pointer-events-none mt-4 flex size-7 shrink-0 select-none items-center justify-center rounded-(--borderRadius-medium) lg:pointer-events-auto lg:cursor-pointer lg:hover:bg-[#2D3239]!"
              htmlFor="show-sidebar"
            >
              <SidebarExpandIcon className="sidebar-expand-icon hidden fill-fg-muted lg:block" />
              <SidebarCollapseIcon className="sidebar-collapse-icon fill-fg-muted lg:hidden" />
            </label>
            <div className="border-(length:--borderWidth-thin) sticky mt-4 ml-2 flex h-7 shrink-0 transform-gpu items-center rounded-(--borderRadius-medium) border-[#3d444d] bg-[#212830] px-2 md:top-16.25">
              <span className="select-none font-medium text-xs">
                All commits
              </span>
              <TriangleDownIcon className="ml-1 inline-block fill-fg-muted align-text-bottom" />
            </div>
            <div className="mask-l-from-80% mask-l-to-100% mt-4 flex w-full justify-end">
              <div className="border-(length:--borderWidth-thin) ml-2 flex h-7 shrink-0 items-center self-center rounded-(--borderRadius-medium) border-[#238636] bg-[#238636] px-2">
                <span className="select-none font-medium text-xs">
                  Submit comments
                </span>
                <TriangleDownIcon className="ml-1 inline-block fill-fg-default align-text-bottom" />
              </div>
            </div>
          </div>
        </div>
      </div>
      <link
        href="/assets/syntax-highlighting.css"
        precedence="medium"
        rel="stylesheet"
      />
      <div className="mainNav flex w-full bg-bg-default px-4 md:px-6 lg:px-8">
        <Suspense fallback={<PullSidebarSkeleton />}>
          <PullRequestSidebar name={name} owner={owner} prId={prId} />
        </Suspense>
        <div className="prc flex w-full min-w-0 flex-col bg-bg-default pt-4 lg:pl-4">
          <DiffEntries
            first={first}
            hasEnhancedSidebar={hasEnhancedSidebar}
            hasMore={hasMore}
            name={name}
            owner={owner}
            prId={prId}
            remainderNonRoot={remainderNonRoot}
            remainderRoot={remainderRoot}
          />
        </div>
      </div>
    </>
  );
}

function getChecksCount(
  repository: PullRequestQuery$data['repository'],
): number {
  const commit = repository?.pullRequest?.commits?.nodes?.[0]?.commit;

  if (!commit) return 0;

  const statusCount = commit?.status?.contexts?.length ?? 0;

  const runsCount =
    commit.checkSuites?.nodes?.reduce(
      (sum: number, suite) => sum + (suite?.checkRuns?.totalCount ?? 0),
      0,
    ) ?? 0;

  return statusCount + runsCount;
}

function formatPrDate(isoDate: string): string {
  const date = new Date(isoDate);

  const nowYear = new Date().getFullYear();
  const year = date.getFullYear();

  const month = date.toLocaleString('en-US', { month: 'short' });
  const day = date.getDate();

  if (year !== nowYear) {
    return `${month} ${day}, ${year}`;
  }

  return `${month} ${day}`;
}
