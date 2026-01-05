import 'server-only';

import { clsx } from 'clsx/lite';
import { cacheLife } from 'next/cache';
import Link from 'next/link';
import { cacheSignal } from 'react';

import { DIFFS_PER_PAGE, SIZE_TO_PREFETCH } from '@/constants/options';
import type { TreeFragment$data } from '@/graphql/fragments/__generated__/TreeFragment.graphql';
import { pullRequestQueryCache } from '@/graphql/queries/PullRequestQueryCache';
import DirectoryIcon from '@/icons/directory-icon';
import FileIcon from '@/icons/file-icon';
import SymlinkIcon from '@/icons/symlink-icon';
import { github } from '@/utils/github-octokit';

type ListCommitsItem = Awaited<
  ReturnType<typeof github.rest.repos.listCommits>
>['data'][number];

type CommitFilesCount = number;

type LastCommitInfo = {
  commit: ListCommitsItem | null;
  filesCount: CommitFilesCount | null;
};

const toPath = (e: NonNullable<TreeFragment$data['entries']>[number]) =>
  e.type === 'tree' ? `${e.name}/` : e.name;

async function fetchLastCommit(
  owner: string,
  repo: string,
  path: string,
  branch = 'HEAD',
): Promise<ListCommitsItem | null> {
  'use cache: remote';
  cacheLife('poc');

  const signal = cacheSignal();

  try {
    const { data } = await github.rest.repos.listCommits({
      owner,
      path,
      per_page: 1,
      repo,
      request: signal ? { signal } : undefined,
      sha: branch,
    });

    return data?.[0];
  } catch (error) {
    // Ignore abort errors triggered by React's cache cancellation
    if (!signal?.aborted) {
      console.error('Markdown render error', error);
    }

    return null;
  }
}

async function fetchLastCommitInfo(
  owner: string,
  name: string,
  path: string,
  branch = 'HEAD',
): Promise<LastCommitInfo> {
  const commit = await fetchLastCommit(owner, name, path, branch);
  const message = commit?.commit?.message;
  const commitMessage =
    message && typeof message === 'string' ? message.split('\n')[0] : null;

  const prId = commitMessage?.match(/#(\d+)/)?.[1] ?? null;

  let filesCount: CommitFilesCount | null = null;

  if (prId) {
    const data = await pullRequestQueryCache(owner, name, Number(prId));

    if (
      typeof data?.response?.data?.repository?.pullRequest?.changedFiles ===
      'number'
    ) {
      filesCount = data.response.data.repository.pullRequest.changedFiles;
    }
  }

  return { commit, filesCount };
}

function fetchLastCommitsForEntries(
  owner: string,
  repo: string,
  entries: NonNullable<TreeFragment$data['entries']>,
  branch = 'HEAD',
) {
  return Promise.all(
    entries.map((e) =>
      fetchLastCommitInfo(owner, repo, e.path || toPath(e), branch).then(
        (info) => [toPath(e), info] as const,
      ),
    ),
  );
}

export default async function ListFilesWithCommits({
  owner,
  repo,
  branch,
  files,
}: {
  owner: string;
  repo: string;
  branch: string;
  files: NonNullable<TreeFragment$data['entries']>;
}) {
  const hasShowMore = false;

  const results = await fetchLastCommitsForEntries(owner, repo, files, branch);

  const commitsMap = new Map(results);

  return files.map((file, index) => {
    const path = toPath(file);
    const info = commitsMap.get(path) ?? null;
    const commit = info?.commit ?? null;
    const filesCount = info?.filesCount ?? null;
    const message = commit?.commit.message;

    let commitMessage =
      message && typeof message === 'string' ? message.split('\n')[0] : null;

    const pr = commitMessage?.match(/#(\d+)/)?.[1] ?? null;

    commitMessage =
      pr && commitMessage
        ? commitMessage.replace(`(#${pr})`, '').trim()
        : commitMessage;

    return (
      <tr
        className={clsx(
          'border-b-(length:--borderWidth-thin) border-border-default last:border-0 hover:bg-bg-muted',
          index > 9 && hasShowMore
            ? 'extra-content hidden md:table-row'
            : 'table-row',
        )}
        key={file?.name}
      >
        <td className="w-[calc(100%-136px)] pl-4 md:w-[40%]">
          <div className="flex h-10 items-center">
            {file?.mode === 16384 ? (
              <DirectoryIcon className="mr-2.5 inline-block h-4 w-4 fill-fg-muted align-middle" />
            ) : file?.mode === 40960 ? (
              <SymlinkIcon className="mr-2.5 inline-block h-4 w-4 fill-fg-muted align-middle" />
            ) : (
              <FileIcon className="mr-2.5 inline-block h-4 w-4 fill-fg-muted align-middle" />
            )}
            <Link
              className="block truncate text-fg-default! hover:text-fg-accent!"
              href={`/${owner}/${repo}/${file.type}/${branch}/${file?.path}`}
              prefetch={file.size <= SIZE_TO_PREFETCH}
            >
              {file?.name}
            </Link>
          </div>
        </td>
        <td className="w-0 sm:w-auto">
          {commitMessage ? (
            <div className="ml-4 block truncate">
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
                    href={`/${owner}/${repo}/pull/${pr}`}
                    prefetch={
                      typeof filesCount === 'number'
                        ? filesCount <= DIFFS_PER_PAGE
                        : false
                    }
                    title={message}
                  >
                    #{pr}
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
        </td>
        <td className="w-30 pl-5"></td>
      </tr>
    );
  });
}
