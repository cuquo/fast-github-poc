import { use } from 'react';

import PRFilesFragment, {
  type PRFilesFragment$key,
} from '@/graphql/fragments/__generated__/PRFilesFragment.graphql';
import PullRequestQueryNode, {
  type PullRequestQuery$data,
} from '@/graphql/queries/__generated__/PullRequestQuery.graphql';
import getServerFragment from '@/graphql/relay/get-server-fragment';
import { getQueryFromRelayStore } from '@/graphql/relay/load-serializable-query';
import {
  buildSidebarTree,
  type SidebarNode,
} from '@/utils/build-pr-sidebar-tree';
import { fetchAllPullRequestFiles } from '@/utils/fetch-all-pr-files';

import PullSidebarItem from './pull-sidebar-item';

const FILES_VIRTUALIZATION_THRESHOLD = 80;

export default function PullSidebar({
  name,
  owner,
  prId,
}: {
  name: string;
  owner: string;
  prId: number;
}) {
  const { repository } = getQueryFromRelayStore<PullRequestQuery$data>(
    PullRequestQueryNode,
    {
      after: null,
      name,
      number: prId,
      owner,
    },
  );

  if (!repository || !repository.pullRequest) return null;

  const initialFiles = getServerFragment<PRFilesFragment$key>(
    PRFilesFragment,
    repository.pullRequest.files,
  );

  const needsMorePages = initialFiles.pageInfo.hasNextPage;

  const { nodes: allFiles } = needsMorePages
    ? use(
        fetchAllPullRequestFiles({
          initialFiles,
          name,
          number: prId,
          owner,
        }),
      )
    : {
        nodes: initialFiles.nodes ?? [],
      };

  const tree = buildSidebarTree(allFiles);
  const isLargeSidebar = allFiles.length >= FILES_VIRTUALIZATION_THRESHOLD;

  return (
    <aside
      className="sidebar sidebar-virtualized border-r-(length:--borderWidth-thin) sticky top-15 hidden h-[calc(100vh-59px)] w-80 shrink-0 overflow-y-scroll border-border-default [scrollbar-gutter:stable] lg:block"
      data-virtualized={isLargeSidebar}
    >
      <ul className="sidebar-container my-3! w-full px-4">
        {renderSidebarNodes(tree)}
      </ul>
    </aside>
  );
}

function makeFolderDomId(fullPath: string) {
  const safe = fullPath.replace(/[^a-zA-Z0-9_-]/g, '_') || 'root';
  return `pr-sidebar-folder-${safe}`;
}

function renderSidebarNodes(nodes: SidebarNode[], level = 0) {
  return nodes.map((node) => {
    if (node.kind === 'folder') {
      const domId = makeFolderDomId(node.fullPath || node.name);

      return (
        <li className="w-full" key={`folder-${node.fullPath}`}>
          <PullSidebarItem
            filePath={node.name}
            folderDomId={domId}
            isTreeItem
            level={level}
          />
          {node.children.length > 0 && (
            <ul>{renderSidebarNodes(node.children, level + 1)}</ul>
          )}
        </li>
      );
    }

    return (
      <li className="h-8 w-full" key={`file-${node.fullPath}`}>
        <PullSidebarItem
          changeType={node.node.changeType}
          filePath={node.name}
          level={level}
        />
      </li>
    );
  });
}
