import 'server-only';

export type PrTreeNode<TPayload> =
  | {
      kind: 'folder';
      name: string;
      fullPath: string;
      children: PrTreeNode<TPayload>[];
    }
  | {
      kind: 'file';
      name: string;
      fullPath: string;
      payload: TPayload;
    };

type FolderNode<TPayload> = {
  kind: 'folder';
  name: string;
  fullPath: string;
  children: PrTreeNode<TPayload>[];
};

type PrSortMode = 'folders-first' | 'flat-path';

function createFolder<TPayload>(
  name: string,
  fullPath: string,
): FolderNode<TPayload> {
  return {
    children: [],
    fullPath,
    kind: 'folder',
    name,
  };
}

function ensureFolderChild<TPayload>(
  parent: FolderNode<TPayload>,
  name: string,
  fullPath: string,
): FolderNode<TPayload> {
  const existing = parent.children.find(
    (child): child is FolderNode<TPayload> =>
      child.kind === 'folder' && child.name === name,
  );

  if (existing) return existing;

  const folder = createFolder<TPayload>(name, fullPath);
  parent.children.push(folder);
  return folder;
}

function sortTree<TPayload>(
  folder: FolderNode<TPayload>,
  mode: PrSortMode,
): void {
  for (const child of folder.children) {
    if (child.kind === 'folder') {
      sortTree(child as FolderNode<TPayload>, mode);
    }
  }

  folder.children.sort((a, b) => {
    if (mode === 'folders-first') {
      if (a.kind !== b.kind) {
        return a.kind === 'folder' ? -1 : 1;
      }
      return a.name.localeCompare(b.name);
    }

    return a.name.localeCompare(b.name);
  });
}

function compressNode<TPayload>(
  node: PrTreeNode<TPayload>,
): PrTreeNode<TPayload> {
  if (node.kind === 'file') return node;

  let current: FolderNode<TPayload> = node as FolderNode<TPayload>;
  let displayName = current.name;
  let fullPath = current.fullPath;

  while (
    current.children.length === 1 &&
    current.children[0].kind === 'folder'
  ) {
    const onlyChild = current.children[0] as FolderNode<TPayload>;
    displayName = displayName
      ? `${displayName}/${onlyChild.name}`
      : onlyChild.name;
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

/**
 * Build a PR path tree from a list of `{ path, payload }` entries.
 * `path` is always the full path (e.g. "src/components/Button.tsx").
 */
export function buildPrTreeFromPaths<TPayload>(
  entries: readonly { path: string; payload: TPayload }[] | null | undefined,
  mode: PrSortMode = 'folders-first',
): PrTreeNode<TPayload>[] {
  const root: FolderNode<TPayload> = createFolder<TPayload>('', '');

  for (const entry of entries ?? []) {
    const segments = entry.path.split('/');
    let prefix = '';
    let current = root;

    segments.forEach((segment, index) => {
      const isLast = index === segments.length - 1;
      prefix = prefix ? `${prefix}/${segment}` : segment;

      if (isLast) {
        current.children.push({
          fullPath: entry.path,
          kind: 'file',
          name: segment,
          payload: entry.payload,
        });
      } else {
        current = ensureFolderChild(current, segment, prefix);
      }
    });
  }

  sortTree(root, mode);

  return root.children.map((child) => compressNode(child));
}

// Flatten only FILE nodes, in tree order
export function flattenPrTreeFiles<TPayload>(
  nodes: PrTreeNode<TPayload>[],
  out: TPayload[] = [],
): TPayload[] {
  for (const node of nodes) {
    if (node.kind === 'file') {
      out.push(node.payload);
    } else {
      flattenPrTreeFiles(node.children, out);
    }
  }
  return out;
}
