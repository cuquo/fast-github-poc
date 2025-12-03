import type { PRFilesFragment$data } from '@/graphql/fragments/__generated__/PRFilesFragment.graphql';

type PRFileNode = NonNullable<
  NonNullable<PRFilesFragment$data['nodes']>[number]
>;

// Final structure used by the sidebar renderer
export type SidebarNode =
  | {
      kind: 'folder';
      name: string; // label (may contain slashes after compression)
      fullPath: string; // full prefix path for this folder
      children: SidebarNode[];
    }
  | {
      kind: 'file';
      name: string; // just the file name (last segment)
      fullPath: string; // full file path (as sent by the API)
      node: PRFileNode;
    };

// Internal mutable folder node used while building the tree
type FolderNode = {
  kind: 'folder';
  name: string;
  fullPath: string;
  children: SidebarNode[];
};

function createFolder(name: string, fullPath: string): FolderNode {
  return {
    children: [],
    fullPath,
    kind: 'folder',
    name,
  };
}

function ensureFolderChild(
  parent: FolderNode,
  name: string,
  fullPath: string,
): FolderNode {
  const existing = parent.children.find(
    (child): child is FolderNode =>
      child.kind === 'folder' && child.name === name,
  );

  if (existing) return existing;

  const folder = createFolder(name, fullPath);
  parent.children.push(folder);
  return folder;
}

function sortTree(folder: FolderNode): void {
  for (const child of folder.children) {
    if (child.kind === 'folder') {
      sortTree(child as FolderNode);
    }
  }

  folder.children.sort((a, b) => {
    if (a.kind !== b.kind) {
      return a.kind === 'folder' ? -1 : 1;
    }

    return a.name.localeCompare(b.name);
  });
}

// Compress folder chains like:
// .devcontainer -> rust -> devcontainer-feature.json
// into a single folder node ".devcontainer/rust"
function compressNode(node: SidebarNode): SidebarNode {
  if (node.kind === 'file') return node;

  let current: FolderNode = node as FolderNode;
  let displayName = current.name;
  let fullPath = current.fullPath;

  // Merge consecutive folders with a single folder child and no files
  while (
    current.children.length === 1 &&
    current.children[0].kind === 'folder'
  ) {
    const onlyChild = current.children[0] as FolderNode;
    displayName = `${displayName}/${onlyChild.name}`;
    fullPath = onlyChild.fullPath;
    current = onlyChild;
  }

  return {
    children: current.children.map((child) => compressNode(child)),
    fullPath,
    kind: 'folder',
    name: displayName,
  };
}

export function buildSidebarTree(
  nodes: PRFilesFragment$data['nodes'],
): SidebarNode[] {
  const root: FolderNode = createFolder('', '');

  for (const fileNode of nodes ?? []) {
    if (!fileNode) continue;

    const segments = fileNode.path.split('/');
    let prefix = '';
    let current = root;

    segments.forEach((segment, index) => {
      const isLast = index === segments.length - 1;
      prefix = prefix ? `${prefix}/${segment}` : segment;

      if (isLast) {
        current.children.push({
          fullPath: fileNode.path,
          kind: 'file',
          name: segment,
          node: fileNode,
        });
      } else {
        current = ensureFolderChild(current, segment, prefix);
      }
    });
  }

  // Sort folders/files as GitHub does
  sortTree(root);

  // Compress folder chains from the root down
  return root.children.map((child) => compressNode(child));
}
