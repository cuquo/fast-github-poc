import 'server-only';

import { clsx } from 'clsx/lite';

import type { PRFilesFragment$data } from '@/graphql/fragments/__generated__/PRFilesFragment.graphql';

import ChevronDownIcon from '../icons/chevron-down-icon';
import FileAddedIcon from '../icons/file-added-icon';
import FileDiffIcon from '../icons/file-diff-icon';
import FileDirectoryIcon from '../icons/file-directory-icon';
import FileDirectoryOpenIcon from '../icons/file-directory-open-icon';
import FileMovedIcon from '../icons/file-moved-icon';
import FileRemovedIcon from '../icons/file-removed-icon';

type SidebarChangeType = NonNullable<
  NonNullable<PRFilesFragment$data['nodes']>[number]
>['changeType'];

export default function PullSidebarItem({
  filePath,
  level = 0,
  changeType,
  isTreeItem = false,
  folderDomId,
}: {
  filePath: string;
  level?: number;
  changeType?: SidebarChangeType;
  isTreeItem?: boolean;
  folderDomId?: string;
}) {
  const id = isTreeItem ? folderDomId : undefined;

  return (
    <>
      {isTreeItem && (
        <input
          className="collapse-folder-state hidden"
          id={id}
          type="checkbox"
        />
      )}
      <a
        className="prItem hover:no-underline! flex h-8 w-full items-center rounded-(--borderRadius-medium) text-fg-default! hover:bg-bg-neutral-muted!"
        href="#chunk-1"
      >
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
          <label
            className={clsx(
              'collapse-button flex h-8 w-4 shrink-0 cursor-pointer select-none items-center justify-center hover:bg-[#656c7633]',
              level === 0 &&
                'rounded-tl-(--borderRadius-medium) rounded-bl-(--borderRadius-medium)',
            )}
            htmlFor={id}
          >
            <ChevronDownIcon className="fill-fg-muted" />
          </label>
        )}
        <span
          className={clsx(
            'ml-2 flex h-8 w-full min-w-0 items-center pr-file',
            !isTreeItem && 'ml-6',
          )}
        >
          {getIcon(isTreeItem, changeType)}
          <span className="min-w-0 truncate leading-3.5" title={filePath}>
            {filePath}
          </span>
        </span>
      </a>
    </>
  );
}

function getIcon(isTreeItem: boolean, changeType?: SidebarChangeType) {
  if (isTreeItem) {
    return (
      <>
        <FileDirectoryIcon className="dir-open mr-2 hidden shrink-0 fill-fg-muted" />
        <FileDirectoryOpenIcon className="dir-close mr-2 hidden shrink-0 fill-fg-muted" />
      </>
    );
  }

  if (changeType === 'ADDED') {
    return <FileAddedIcon className="mr-2 shrink-0 fill-[#3fb950]" />;
  }
  if (changeType === 'DELETED') {
    return <FileRemovedIcon className="mr-2 shrink-0 fill-[#f85149]" />;
  }
  if (changeType === 'RENAMED') {
    return <FileMovedIcon className="mr-2 shrink-0 fill-[#d29922]" />;
  }

  return <FileDiffIcon className="mr-2 shrink-0 fill-fg-muted" />;
}
