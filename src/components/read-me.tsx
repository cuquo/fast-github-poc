import 'server-only';

import { Suspense, use } from 'react';

import BlobByOidQueryNode, {
  type BlobByOidQuery,
} from '@/graphql/queries/__generated__/BlobByOidQuery.graphql';
import BlobByPathQueryNode, {
  type BlobByPathQuery,
} from '@/graphql/queries/__generated__/BlobByPathQuery.graphql';
import { loadSerializableQuery } from '@/graphql/relay/load-serializable-query';

import type { TreeFragment$data } from '../graphql/fragments/__generated__/TreeFragment.graphql';
import Markdown from './markdown';
import TextSkeleton from './text-skeleton';

export default function Readme({
  name,
  owner,
  files,
}: {
  name: string;
  owner: string;
  files: TreeFragment$data['entries'];
}) {
  if (!files) return null;

  const entry = files.find(
    (e) => e.type === 'blob' && /^readme(\.(md|rst|txt))?$/i.test(e.name),
  );

  if (!entry?.mode) return null;

  const isSymlink = entry.mode === 40960;

  let readmeText: string | null | undefined = null;

  const readmeFile = use(
    loadSerializableQuery<typeof BlobByOidQueryNode, BlobByOidQuery>(
      BlobByOidQueryNode,
      {
        name,
        oid: entry?.oid,
        owner,
      },
    ),
  );

  const readmeBlob = readmeFile.response.data.repository?.object?.text;

  if (!isSymlink) {
    readmeText = readmeBlob;
  } else {
    const target = readmeBlob?.trim();

    if (target) {
      const resolved = target.replace(/^\.\//, '');
      const readmeFile = use(
        loadSerializableQuery<typeof BlobByPathQueryNode, BlobByPathQuery>(
          BlobByPathQueryNode,
          {
            expr: `HEAD:${resolved}`,
            name,
            owner,
          },
        ),
      );
      const readmeBlob = readmeFile.response.data.repository?.object?.text;
      readmeText = readmeBlob;
    }
  }

  if (readmeText) {
    return (
      <Suspense fallback={<TextSkeleton className="mb-16 px-4" />}>
        <Markdown
          className="px-4 py-8"
          context={`${owner}/${name}`}
          text={readmeText}
        />
      </Suspense>
    );
  }

  return <div>Readme View {isSymlink ? ' (symlink)' : ' (direct)'}</div>;
}
