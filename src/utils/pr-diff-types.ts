import 'server-only';

import type { HighlightedFileData } from './batch-highlight';
import type { github } from './github-octokit';

export type PullRequestFile = Awaited<
  ReturnType<typeof github.rest.pulls.listFiles>
>['data'][number] & {
  index: number;
  page: number;
  fcp: HighlightedFileData;
};

export type InitialPatchesResult = {
  firstFiles: PullRequestFile[];
  hasMore: boolean;
  rootFiles: PullRequestFile[];
};
