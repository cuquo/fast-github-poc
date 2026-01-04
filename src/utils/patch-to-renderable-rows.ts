import { cache } from 'react';

import { parseUnifiedPatch } from './parse-unified-diff';
import { patchToRenderableRows } from './split-diff';

export const getPatchToRenderableRows = cache((patch: string) => {
  const hunks = parseUnifiedPatch(patch);

  return patchToRenderableRows(hunks);
});
