/** biome-ignore-all lint/performance/noImgElement: beta */
import 'server-only';

import { clsx } from 'clsx/lite';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Suspense, use } from 'react';

import ListFiles from '@/components/list-files';
import Readme from '@/components/read-me';
import TextSkeleton from '@/components/text-skeleton';
import { ALLOWED_REPOS } from '@/constants/options';
import TreeFragment, {
  type TreeFragment$key,
} from '@/graphql/fragments/__generated__/TreeFragment.graphql';
import RepoQueryNode, {
  type RepoQuery$data,
} from '@/graphql/queries/__generated__/RepoQuery.graphql';
import { repoQueryCache } from '@/graphql/queries/RepoQueryCache';
import getServerFragment from '@/graphql/relay/get-server-fragment';
import { getQueryFromRelayStore } from '@/graphql/relay/load-serializable-query';
import BranchIcon from '@/icons/branch-icon';
import CodeIcon from '@/icons/code-icon';
import LinkIcon from '@/icons/link-icon';
import TagIcon from '@/icons/tag-icon';
import TriangleDownIcon from '@/icons/triangle-down-icon';
import { numberFormatter } from '@/utils/number-formatter';

export default function Repo({
  params,
}: {
  params: Promise<{ name: string; owner: string }>;
}) {
  const { name, owner } = use(params);

  if (!ALLOWED_REPOS.includes(owner)) notFound();

  use(repoQueryCache(owner, name));

  const { repository } = getQueryFromRelayStore<RepoQuery$data>(RepoQueryNode, {
    name,
    owner,
  });

  if (!repository) {
    notFound();
  }

  const { entries } = getServerFragment<TreeFragment$key>(
    TreeFragment,
    repository?.files?.treeHierarchyFragment,
  );

  const defaultBranch = repository?.defaultBranchRef;
  const target =
    defaultBranch?.target?.__typename === 'Commit'
      ? defaultBranch?.target
      : null;
  const author = target?.author;
  const user = author?.user;
  const userName = author ? author.name : null;
  const login = user ? user.login : null;
  const avatar =
    user && typeof user.avatarUrl === 'string' ? user.avatarUrl : null;
  const userUrl = user && typeof user.url === 'string' ? user.url : null;
  const messageHeadline = target?.messageHeadline;
  const messageBody = target?.messageBody;
  const lastCommitOid = target?.oid;
  const commitUrl =
    lastCommitOid && typeof lastCommitOid === 'string'
      ? `/${owner}/${name}/commit/${lastCommitOid}`
      : null;
  const abbreviatedOid = target?.abbreviatedOid;
  const totalCommits = target?.history?.totalCount;
  const branch = defaultBranch?.name ?? 'HEAD';
  const description = repository?.description;
  const homepageUrl = repository?.homepageUrl;
  const avatarUrl = repository?.owner?.avatarUrl;
  const branchesCount = repository?.branches?.totalCount ?? 0;
  const tagsCount = repository?.tags?.totalCount ?? 0;
  const repositoryTopicsNodes = repository?.repositoryTopics?.nodes;
  const repositoryTopics = repositoryTopicsNodes
    ? repositoryTopicsNodes.reduce((acc, node) => {
        if (node?.topic?.name) {
          acc.push(node.topic.name);
        }
        return acc;
      }, [] as string[])
    : null;
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

  const lastCommitInfo = {
    abbreviatedOid: abbreviatedOid,
    authorAvatar: avatar,
    authorLogin: login,
    authorName: userName,
    authorUrl: userUrl,
    commitBody: messageBody,
    commitMessage: messageHeadline,
    commitUrl,
    totalCommits:
      totalCommits && !Number.isNaN(Number(totalCommits))
        ? numberFormatter.format(Number(totalCommits))
        : null,
  };

  return (
    <div itemScope itemType="http://schema.org/SoftwareSourceCode">
      <main>
        <div className="md:border-b-(length:--borderWidth-thin) mx-auto flex w-full max-w-7xl border-border-default px-4 pt-4 md:px-6 lg:px-8 xl:border-0">
          <div className="xl:border-b-(length:--borderWidth-thin) w-full md:pb-4 xl:border-border-default">
            <span className="flex items-center">
              <img
                alt={`${owner} avatar`}
                className="border-(length:--borderWidth-thin) mr-2 flex h-6 w-6 rounded-(--borderRadius-medium) border-[#3d444d] [border-style:inherit]!"
                height={24}
                src={avatarUrl}
                width={24}
              />
              <Link
                className="flex text-fg-default!"
                href={`/${owner}/${name}`}
                prefetch
              >
                <h1 className="text-xl!">{name}</h1>
              </Link>
              <span className="border-(length:--borderWidth-thin) ml-2 flex rounded-full border-[#3d444d] px-1.5 font-medium text-fg-muted text-xs">
                Public
              </span>
            </span>
          </div>
        </div>
        <div
          className={clsx(
            'mx-auto grid w-full max-w-7xl',
            'px-4 pt-3 md:px-6 lg:px-8',
            'gap-y-4',
            'gap-x-(--Layout-gutter)',
            'md:grid-cols-[minmax(0,calc(100%-var(--Layout-sidebar-width)-var(--Layout-gutter)))_var(--Layout-sidebar-width)]',
            'items-start md:auto-rows-max',
          )}
        >
          <section className="order-2 min-w-0 md:order-0 md:col-start-1 md:row-start-1">
            <div className="mt-2 mb-4 flex">
              <div className="border-(length:--borderWidth-thin) flex h-8 items-center rounded-(--borderRadius-medium) border-[#3d444d] bg-[#212830] px-3">
                <BranchIcon className="mr-2 inline-block fill-fg-muted align-text-bottom" />
                <span className="select-none">{branch}</span>
                <TriangleDownIcon className="ml-2 inline-block fill-fg-muted align-text-bottom" />
              </div>
              {branchesCount > 0 && (
                <div className="ml-2 hidden h-8 select-none items-center rounded-(--borderRadius-medium) px-3 hover:bg-[#2D3239] sm:flex lg:px-1">
                  <BranchIcon className="inline-block fill-fg-muted align-text-bottom" />
                  <span className="ml-2 hidden items-center font-semibold text-fg-default text-sm lg:flex">
                    {branchesCount}
                  </span>
                  <span className="ml-1 hidden items-center font-medium text-fg-muted text-sm lg:flex">
                    {branchesCount === 1 ? 'Branch' : 'Branches'}
                  </span>
                </div>
              )}
              {tagsCount > 0 && (
                <div className="ml-1 hidden h-8 select-none items-center rounded-(--borderRadius-medium) px-3 hover:bg-[#2D3239] sm:flex lg:px-1">
                  <TagIcon className="inline-block fill-fg-muted align-text-bottom" />
                  <span className="ml-2 hidden items-center font-semibold text-fg-default text-sm lg:flex">
                    {tagsCount}
                  </span>
                  <span className="ml-1 hidden items-center font-medium text-fg-muted text-sm lg:flex">
                    {tagsCount === 1 ? 'Tag' : 'Tags'}
                  </span>
                </div>
              )}
              <div className="flex grow items-center justify-end">
                <div className="border-(length:--borderWidth-thin) hidden h-8 items-center rounded-(--borderRadius-medium) border-[#3d444d] bg-[#212830] px-3 md:flex">
                  <span className="select-none font-medium">Add file</span>
                  <TriangleDownIcon className="ml-2 inline-block fill-fg-muted align-text-bottom" />
                </div>
                <div className="border-(length:--borderWidth-thin) ml-2 flex h-8 items-center rounded-(--borderRadius-medium) border-[#ffffff26] bg-[#238636] px-3">
                  <CodeIcon className="mr-2 inline-block fill-fg-default align-text-bottom" />
                  <span className="select-none font-medium">Code</span>
                  <TriangleDownIcon className="ml-2 inline-block fill-fg-default align-text-bottom" />
                </div>
              </div>
            </div>
            <div className="border-(length:--borderWidth-thin) mb-4 overflow-hidden rounded-(--borderRadius-medium) border-border-default">
              <ListFiles
                branch={branch}
                files={files}
                lastCommitInfo={lastCommitInfo}
                owner={owner}
                repo={name}
              />
            </div>
            <div className="border-(length:--borderWidth-thin) -mr-4 mb-4 -ml-4 rounded-(--borderRadius-medium) border-border-default px-4 [ccontent-visibility:auto] [contain-intrinsic-size:auto_800px] sm:mx-0">
              <Suspense fallback={<TextSkeleton className="mb-16 px-4" />}>
                <Readme files={files} name={name} owner={owner} />
              </Suspense>
            </div>
          </section>
          <div className="md:col-start-2 md:row-span-full md:flex md:flex-col md:gap-y-4">
            <section className="order-1 md:order-0 md:pt-3">
              <h2 className="mb-4! hidden text-base! md:block">About</h2>
              <p className="text-base text-fg-muted md:mb-4! md:text-fg-default">
                {description}
              </p>
              {homepageUrl && (
                <p className="text-sm">
                  <LinkIcon className="mr-2 inline-block align-text-bottom" />
                  <a
                    className="font-bold"
                    href={homepageUrl}
                    rel="noopener noreferrer"
                    target="_blank"
                  >
                    {homepageUrl.includes('://')
                      ? homepageUrl.split('://')[1]
                      : homepageUrl}
                  </a>
                </p>
              )}
              {repositoryTopics && repositoryTopics.length > 0 && (
                <div className="mt-4 hidden flex-wrap gap-1 md:flex">
                  {repositoryTopics.map((topic) => (
                    <span
                      className="hover:no-underline! h-5.5 select-none content-center rounded-full bg-[#131D2E]! px-2.5 font-medium text-fg-accent text-xs! hover:bg-[#1f6feb]! hover:text-fg-default!"
                      key={topic}
                      // href={`https://github.com/topics/${topic}`}
                    >
                      {topic}
                    </span>
                  ))}
                </div>
              )}
            </section>
          </div>
        </div>
      </main>
    </div>
  );
}
