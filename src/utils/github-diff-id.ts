import 'server-only';

import { createHash } from 'node:crypto';

export function githubDiffId(path: string): string {
  const hash = createHash('sha256').update(path).digest('hex');

  return `diff-${hash}`;
}
