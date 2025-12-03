import 'server-only';

import { clsx } from 'clsx/lite';
import { cacheLife } from 'next/cache';
import Link from 'next/link';
import { cacheSignal, use } from 'react';

import DirectoryIcon from '@/icons/directory-icon';
import FileIcon from '@/icons/file-icon';
import SymlinkIcon from '@/icons/symlink-icon';

import { SIZE_TO_PREFETCH } from '../constants/options';
import type { TreeFragment$data } from '../graphql/fragments/__generated__/TreeFragment.graphql';

const API = 'https://api.github.com';

type LastCommit = {
  sha: string;
  html_url: string;
  commit: { author?: { date?: string; name?: string }; message: string };
  author?: { login?: string; avatar_url?: string };
};

const toPath = (e: NonNullable<TreeFragment$data['entries']>[number]) =>
  e.type === 'tree' ? `${e.name}/` : e.name;

async function fetchLastCommit(
  owner: string,
  repo: string,
  path: string,
  token: string,
  branch = 'HEAD',
): Promise<LastCommit | null> {
  'use cache';
  cacheLife('poc');

  const url = new URL(`${API}/repos/${owner}/${repo}/commits`);
  url.searchParams.set('sha', branch);
  url.searchParams.set('path', path);
  url.searchParams.set('per_page', '1');

  const signal = cacheSignal();

  try {
    const res = await fetch(url.toString(), {
      headers: {
        Accept: 'application/vnd.github+json',
        'Accept-Encoding': 'gzip, deflate, br',
        Authorization: `Bearer ${token}`,
      },
      next: { revalidate: 3600 },
      signal: signal ?? undefined,
    });

    if (!res.ok) {
      if (!signal?.aborted) {
        console.error(
          `Failed to fetch last commit for ${owner}/${repo}/${path}: ${res.status} ${res.statusText}`,
        );
      }
      return null;
    }

    const arr = (await res.json()) as LastCommit[];
    return arr[0] ?? null;
  } catch (err: unknown) {
    if (!signal?.aborted) {
      console.error(`Error fetching commit for ${owner}/${repo}/${path}:`, err);
    }
    return null;
  }
}

function fetchLastCommitsForEntries(
  owner: string,
  repo: string,
  entries: NonNullable<TreeFragment$data['entries']>,
  token: string,
  branch = 'HEAD',
) {
  return Promise.all(
    entries.map((e) =>
      fetchLastCommit(owner, repo, e.path || toPath(e), token, branch).then(
        (c) => [toPath(e), c] as const,
      ),
    ),
  );
}

export default function ListFilesWithCommits({
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
  const hasShowMore = files.length > 14;

  const results = use(
    fetchLastCommitsForEntries(
      owner,
      repo,
      files,
      process.env.GITHUB_TOKEN as string,
      branch,
    ),
  );

  const commitsMap = new Map(results) as Map<string, LastCommit | null>;

  return files.map((file, index) => {
    const path = toPath(file);
    const commit = commitsMap.get(path) ?? null;
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
                    prefetch
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
