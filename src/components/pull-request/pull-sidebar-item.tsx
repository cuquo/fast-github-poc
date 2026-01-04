import 'server-only';

import { clsx } from 'clsx/lite';

import ChevronDownIcon from '@/icons/chevron-down-icon';
import FileAddedIcon from '@/icons/file-added-icon';
import FileDiffIcon from '@/icons/file-diff-icon';
import FileDirectoryIcon from '@/icons/file-directory-icon';
import FileDirectoryOpenIcon from '@/icons/file-directory-open-icon';
import FileMovedIcon from '@/icons/file-moved-icon';
import FileRemovedIcon from '@/icons/file-removed-icon';
import { githubDiffId } from '@/utils/github-diff-id';
import type { PullRequestFile } from '@/utils/pr-diff-types';

export default function PullSidebarItem({
  filePath,
  level = 0,
  changeType,
  isTreeItem = false,
  folderDomId,
  fullPath,
}: {
  filePath: string;
  level?: number;
  changeType?: PullRequestFile['status'];
  isTreeItem?: boolean;
  folderDomId?: string;
  fullPath: string;
}) {
  const id = isTreeItem
    ? (folderDomId as string)
    : `#${githubDiffId(fullPath)}`;

  return (
    <>
      {isTreeItem && (
        <input
          className="collapse-folder-state hidden"
          id={id}
          type="checkbox"
        />
      )}
      <PullSidebarItemWrapper id={id} isTreeItem={isTreeItem}>
        {level > 0 &&
          Array.from({ length: level }).map((_, idx) => {
            return (
              <span
                className="border-r-(length:--borderWidth-thin) prSep h-8 w-2 shrink-0 border-[#0000]"
                key={`sep-${folderDomId ?? filePath}-${idx}`}
              />
            );
          })}
        {isTreeItem && (
          <div
            className={clsx(
              'collapse-button flex h-8 w-4 shrink-0 cursor-pointer select-none items-center justify-center hover:bg-[#2D3239]',
              level === 0 &&
                'rounded-tl-(--borderRadius-medium) rounded-bl-(--borderRadius-medium)',
            )}
          >
            <ChevronDownIcon className="fill-fg-muted" />
          </div>
        )}
        <span
          className={clsx(
            'ml-2 flex h-8 w-full min-w-0 items-center pr-file',
            !isTreeItem && 'ml-6',
          )}
        >
          {getIcon(isTreeItem, changeType)}
          <span
            className="min-w-0 select-text truncate pr-2 font-normal leading-3.5 [direction:rtl]"
            title={filePath}
          >
            {'\u200E'}
            {filePath}
            {'\u200E'}
          </span>
        </span>
      </PullSidebarItemWrapper>
    </>
  );
}

function PullSidebarItemWrapper({
  children,
  id,
  isTreeItem,
}: {
  children: React.ReactNode;
  id: string;
  isTreeItem: boolean;
}) {
  return isTreeItem ? (
    <label
      className="prItem hover:no-underline! flex h-8 w-full cursor-pointer select-none items-center rounded-(--borderRadius-medium) text-fg-default! hover:bg-bg-neutral-muted!"
      htmlFor={id}
    >
      {children}
    </label>
  ) : (
    <a
      className="prItem hover:no-underline! flex h-8 w-full items-center rounded-(--borderRadius-medium) text-fg-default! hover:bg-bg-neutral-muted!"
      href={id}
    >
      {children}
    </a>
  );
}

function getIcon(isTreeItem: boolean, changeType?: PullRequestFile['status']) {
  if (isTreeItem) {
    return (
      <>
        <FileDirectoryIcon className="dir-open mr-2 hidden shrink-0 fill-fg-muted" />
        <FileDirectoryOpenIcon className="dir-close mr-2 hidden shrink-0 fill-fg-muted" />
      </>
    );
  }

  if (changeType === 'added') {
    return <FileAddedIcon className="mr-2 shrink-0 fill-[#3fb950]" />;
  }
  if (changeType === 'removed') {
    return <FileRemovedIcon className="mr-2 shrink-0 fill-[#f85149]" />;
  }
  if (changeType === 'renamed') {
    return <FileMovedIcon className="mr-2 shrink-0 fill-[#d29922]" />;
  }

  return <FileDiffIcon className="mr-2 shrink-0 fill-fg-muted" />;
}
