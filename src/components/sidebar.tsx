import 'server-only';

import Link from 'next/link';
import { use } from 'react';

import TreeFragment, {
  type TreeFragment$key,
} from '@/graphql/fragments/__generated__/TreeFragment.graphql';
import TreeQueryNode, {
  type TreeQuery,
  type TreeQuery$data,
} from '@/graphql/queries/__generated__/TreeQuery.graphql';
import {
  getQueryFromRelayStore,
  loadSerializableQuery,
} from '@/graphql/relay/load-serializable-query';
import DirectoryIcon from '@/icons/directory-icon';
import FileIcon from '@/icons/file-icon';
import SymlinkIcon from '@/icons/symlink-icon';

import { SIZE_TO_PREFETCH } from '../constants/options';
import getServerFragment from '../graphql/relay/get-server-fragment';

export default function Sidebar({
  params,
}: {
  params: Promise<{
    branch: string;
    name: string;
    owner: string;
  }>;
}) {
  const { name, owner, branch } = use(params);

  use(
    loadSerializableQuery<typeof TreeQueryNode, TreeQuery>(TreeQueryNode, {
      expr: `HEAD:`,
      name: name,
      owner: owner,
    }),
  );

  const { repository } = getQueryFromRelayStore<TreeQuery$data>(TreeQueryNode, {
    expr: `HEAD:`,
    name: name,
    owner: owner,
  });

  if (!repository || !repository?.files) return null;

  const { entries } = getServerFragment<TreeFragment$key>(
    TreeFragment,
    repository.files.treeHierarchyFragment,
  );

  const branchRef = repository?.defaultBranchRef?.name;

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

  return (
    <div className="contain-[layout_paint_style] h-screen overflow-y-auto bg-bg-canvas [scrollbar-gutter:stable]">
      <div className="my-2 w-full px-4">
        <ul className="w-full">
          {files?.map((file) => (
            <li className="w-full" key={file.oid}>
              <Link
                className="hover:no-underline! flex h-8 w-full items-center rounded-(--borderRadius-medium) pl-6 text-fg-default! hover:bg-bg-neutral-muted!"
                href={`/${owner}/${name}/${file.type}/${branchRef || branch}/${file.name}`}
                prefetch={file.size <= SIZE_TO_PREFETCH}
              >
                {file?.mode === 16384 ? (
                  <DirectoryIcon className="mr-2.5 inline-block fill-fg-muted align-middle" />
                ) : file?.mode === 40960 ? (
                  <SymlinkIcon className="mr-2.5 inline-block fill-fg-muted align-middle" />
                ) : (
                  <FileIcon className="mr-2.5 inline-block fill-fg-muted align-middle" />
                )}
                <span className="truncate">{file.name}</span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
