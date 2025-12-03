/** biome-ignore-all lint/performance/noImgElement: caching */
import 'server-only';

import { clsx } from 'clsx/lite';
import Link from 'next/link';
import { Suspense } from 'react';

import { SIZE_TO_PREFETCH } from '@/constants/options';
import type { TreeFragment$data } from '@/graphql/fragments/__generated__/TreeFragment.graphql';
import DirectoryIcon from '@/icons/directory-icon';
import EllipsisIcon from '@/icons/ellipsis-icon';
import FileIcon from '@/icons/file-icon';
import HistoryIcon from '@/icons/history-icon';
import SymlinkIcon from '@/icons/symlink-icon';
import { extractCommitMessageAndPr } from '@/utils/extract-commit-message-pr';

import ListFilesWithCommits from './list-files-with-commits';

type lastCommitInfo = {
  abbreviatedOid: string | undefined;
  authorAvatar: string | null;
  authorLogin: string | null;
  authorName: string | null | undefined;
  authorUrl: string | null;
  commitBody: string | undefined;
  commitMessage: string | undefined;
  commitUrl: string | null;
  totalCommits: string | null;
};

export default function ListFiles({
  owner,
  repo,
  branch,
  files,
  isTreeView = false,
  lastCommitInfo,
  previousPath,
}: {
  owner: string;
  repo: string;
  branch: string;
  previousPath?: string;
  files: TreeFragment$data['entries'];
  isTreeView?: boolean;
  lastCommitInfo?: lastCommitInfo;
}) {
  if (!files || files.length === 0) return null;

  const hasShowMore = files.length > 14;
  const rawCommitMessage = lastCommitInfo?.commitMessage;
  const { message: commitMessage, pr } =
    extractCommitMessageAndPr(rawCommitMessage);

  const skeleton = files.map((file, index) => {
    const n = Math.floor(Math.random() * 5) + 1;

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
          <div className="flex h-10 items-center truncate">
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
          <div className="relative h-full w-full max-w-100">
            <div
              className={clsx(
                'mr-4 ml-4 h-4 @[540px]:max-w-100 animate-pulse rounded-sm bg-mirage',
                n === 1
                  ? 'w-[80%]'
                  : n === 2
                    ? 'w-[95%]'
                    : n === 3
                      ? 'w-[70%]'
                      : n === 4
                        ? 'w-[50%]'
                        : 'w-[60%]',
              )}
            />
          </div>
        </td>
        <td className="w-30 pl-5">
          <div
            className={clsx(
              'mr-4 ml-auto flex h-4 animate-pulse justify-self-end rounded-sm bg-mirage',
              n === 1
                ? 'w-16'
                : n === 2
                  ? 'w-22'
                  : n === 3
                    ? 'w-20'
                    : n === 4
                      ? 'w-18'
                      : 'w-24',
            )}
          />
        </td>
      </tr>
    );
  });

  return (
    <>
      {hasShowMore && (
        <input
          className="show-more-state hidden"
          id="show-more"
          type="checkbox"
        />
      )}
      {!isTreeView && lastCommitInfo?.commitMessage && (
        <input
          className="show-more-commit-state hidden"
          id="show-more-commit"
          type="checkbox"
        />
      )}
      <table className="Table-module table-fixed! w-full">
        <colgroup>
          <col className="w-[calc(100%-136px)] md:w-[40%]" />
          <col className="w-0 sm:w-auto" />
          <col className="w-34" />
        </colgroup>
        {isTreeView && (
          <thead className="border-b-(length:--borderWidth-thin) border-border-default bg-bg-muted">
            <tr className="h-10">
              <th className="w-full pl-4 text-left font-semibold text-fg-muted text-xs sm:w-[40%]">
                Name
              </th>
              <th className="w-0 overflow-hidden truncate pl-4 text-left font-semibold text-fg-muted text-xs sm:table-cell sm:w-[40%]">
                Last commit message
              </th>
              <th className="w-30 pr-4 text-right font-semibold text-fg-muted text-xs">
                Last commit date
              </th>
            </tr>
          </thead>
        )}
        <tbody>
          <tr className="h-0 overflow-hidden">
            <td className="w-[calc(100%-136px)] pl-4 md:w-[40%]" />
            <td className="w-0 sm:w-auto" />
            <td className="w-30 pl-5" />
          </tr>
          {isTreeView && previousPath && (
            <tr className="border-b-(length:--borderWidth-thin) border-border-default hover:bg-bg-muted">
              <td className="w-full" colSpan={3}>
                <Link
                  className="hover:no-underline! flex h-10 items-center text-fg-default! tracking-[2px] hover:text-fg-accent!"
                  href={previousPath}
                  prefetch
                >
                  <DirectoryIcon className="mr-2.5 ml-4 inline-block h-4 w-4 fill-fg-muted align-middle" />
                  ..
                </Link>
              </td>
            </tr>
          )}
          {!isTreeView && lastCommitInfo && (
            <>
              <tr>
                <td
                  className="info-row border-b-(length:--borderWidth-thin) h-13 border-border-default bg-bg-muted"
                  colSpan={3}
                >
                  <div className="flex h-10 items-center pr-3 pl-3 text-fg-muted!">
                    <div
                      // href={lastCommitInfo.authorUrl || '#'}
                      className="flex shrink-0 select-none items-center font-semibold text-fg-default!"
                      title={
                        lastCommitInfo.authorName ||
                        lastCommitInfo.authorLogin ||
                        'user'
                      }
                    >
                      {lastCommitInfo.authorAvatar && (
                        <img
                          alt={
                            lastCommitInfo.authorName ||
                            lastCommitInfo.authorLogin ||
                            'avatar'
                          }
                          className="border-(length:--borderWidth-thin) flex! box-content! mr-2 h-5 w-5 shrink-0 rounded-full border-[#ffffff26] [border-style:inherit]!"
                          src={lastCommitInfo.authorAvatar}
                        />
                      )}
                      <span>{lastCommitInfo.authorLogin}</span>
                    </div>
                    <span className="mx-2 hidden truncate sm:inline">
                      {`${commitMessage}${pr ? `(` : ''}`}
                      {pr && (
                        <>
                          <Link
                            href={`/${owner}/${repo}/pull/${pr}`}
                            prefetch
                          >{`#${pr}`}</Link>
                          {`)`}
                        </>
                      )}
                    </span>
                    {lastCommitInfo.commitBody && (
                      <label
                        className="show-more-commit-button ml-auto flex size-7 shrink-0 cursor-pointer select-none items-center justify-center rounded-(--borderRadius-medium) hover:bg-[#656c7633]! sm:mr-2 sm:ml-0"
                        htmlFor="show-more-commit"
                      >
                        <EllipsisIcon className="fill-fg-muted" />
                      </label>
                    )}
                    {lastCommitInfo.abbreviatedOid && (
                      <span className="ml-auto hidden text-fg-muted text-xs sm:flex">
                        {lastCommitInfo.abbreviatedOid}
                      </span>
                    )}
                    {lastCommitInfo.totalCommits && (
                      <div
                        className={clsx(
                          'border-(length:--borderWidth-thin) flex h-7 items-center rounded-(--borderRadius-medium) border-transparent! px-2 hover:bg-[#656c7633]!',
                          lastCommitInfo.commitBody
                            ? 'ml-2'
                            : 'ml-auto sm:ml-2',
                        )}
                      >
                        <HistoryIcon className="h-4 w-4 fill-fg-muted" />
                        <span className="ml-1 hidden shrink-0 select-none font-medium text-fg-default text-xs lg:flex">
                          {lastCommitInfo.totalCommits} Commits
                        </span>
                      </div>
                    )}
                  </div>
                </td>
              </tr>
              {lastCommitInfo.commitBody && (
                <tr className="commit-content border-b-(length:--borderWidth-thin) relative hidden border-border-default bg-bg-muted">
                  <td colSpan={3}>
                    <span className="-top-1 absolute left-1 flex h-px w-[calc(100%-8px)] bg-border-default" />
                    <span className="inline-flex w-full whitespace-pre px-5 pt-1.5 pb-3 text-fg-muted text-xs leading-4.5 [text-wrap-mode:wrap]">
                      {lastCommitInfo.commitBody}
                    </span>
                  </td>
                </tr>
              )}
            </>
          )}
          <Suspense fallback={skeleton}>
            <ListFilesWithCommits
              branch={branch}
              files={files}
              owner={owner}
              repo={repo}
            />
          </Suspense>
          {/* {skeleton} */}
        </tbody>
      </table>
      {hasShowMore && (
        <label
          className="show-more-button flex h-10 w-full cursor-pointer select-none items-center justify-center font-normal! text-dodger-blue md:hidden"
          htmlFor="show-more"
        >
          View all files
        </label>
      )}
    </>
  );
}
