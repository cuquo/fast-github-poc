import 'server-only';

import { Octokit } from 'octokit';

export const github = new Octokit({
  auth: process.env.GITHUB_TOKEN,
  retry: { enabled: false },
  throttle: { enabled: false },
  userAgent: 'wtbb/1.0.1',
});
