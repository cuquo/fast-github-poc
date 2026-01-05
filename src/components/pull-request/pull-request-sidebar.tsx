import 'server-only';

import { cacheLife } from 'next/cache';

import { FILES_VIRTUALIZATION_THRESHOLD } from '@/constants/options';
import type { PullRequestFile } from '@/utils/pr-diff-types';
import type { PrTreeNode } from '@/utils/pr-path-tree';
import { fetchSidebarFiles } from '@/utils/pr-sidebar-files';
import { buildSidebarTree } from '@/utils/sidebar-tree';

import PullSidebarItem from './pull-sidebar-item';

export default async function PullRequestSidebar({
  name,
  owner,
  prId,
}: {
  name: string;
  owner: string;
  prId: number;
}) {
  'use cache: remote';
  cacheLife('poc');

  const files = await fetchSidebarFiles(owner, name, prId);

  if (!files) return null;

  const tree = buildSidebarTree(files);
  const isLargeSidebar = files.length >= FILES_VIRTUALIZATION_THRESHOLD;

  return (
    <aside
      className="sidebar sidebar-virtualized border-r-(length:--borderWidth-thin) sticky top-15 hidden h-[calc(100vh-59px)] w-80 shrink-0 overflow-y-scroll border-border-default bg-bg-default contain-content [overflow-anchor:none] [scrollbar-gutter:stable] lg:block"
      data-virtualized={isLargeSidebar}
    >
      <div className="topShadow sticky top-0 z-2" />
      <ul className="sidebar-container my-3! w-full px-4">
        {renderSidebarNodes(tree)}
      </ul>
      <div className="bottomShadow sticky bottom-0" />
    </aside>
  );
}

function makeFolderDomId(fullPath: string) {
  const safe = fullPath.replace(/[^a-zA-Z0-9_-]/g, '_') || 'root';
  return `pr-sidebar-folder-${safe}`;
}

function renderSidebarNodes(nodes: PrTreeNode<PullRequestFile>[], level = 0) {
  return nodes.map((node) => {
    if (node.kind === 'folder') {
      const domId = makeFolderDomId(node.fullPath || node.name);

      return (
        <li className="w-full" key={domId}>
          <PullSidebarItem
            filePath={node.name}
            folderDomId={domId}
            fullPath={node.fullPath}
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
          changeType={node.payload.status}
          filePath={node.name}
          fullPath={node.fullPath}
          level={level}
        />
      </li>
    );
  });
}
