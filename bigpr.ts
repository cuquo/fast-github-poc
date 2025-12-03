// find-big-prs.ts
/** biome-ignore-all lint/suspicious/noExplicitAny: test file */
// Bun script to progressively save big PR results into a JSON file so progress is never lost.

import { existsSync, readFileSync, writeFileSync } from 'node:fs';

const RESULTS_FILE = './big-prs-results.json';

// Load existing results if present
function loadExisting() {
  if (!existsSync(RESULTS_FILE)) {
    return { results: [] as any[], threshold: MIN_CHANGED_FILES };
  }
  try {
    return JSON.parse(readFileSync(RESULTS_FILE, 'utf8'));
  } catch {
    return { results: [] as any[], threshold: MIN_CHANGED_FILES };
  }
}

const GITHUB_TOKEN = process.env.GITHUB_TOKEN;

if (!GITHUB_TOKEN) {
  console.error('ERROR: Please set GITHUB_TOKEN in your environment.');
  process.exit(1);
}

// CLI args
const [, , thresholdArg, maxPagesArg] = process.argv;
const MIN_CHANGED_FILES = thresholdArg ? Number(thresholdArg) : 100;
const MAX_PAGES = maxPagesArg ? Number(maxPagesArg) : null;

// Load previous data if any
const saved = loadExisting();
const seenNumbers = new Set<number>(saved.results.map((pr: any) => pr.number));

if (saved.threshold !== MIN_CHANGED_FILES) {
  console.warn(
    `WARNING: Existing results file uses threshold ${saved.threshold}, ignoring previous data.`,
  );
  saved.results = [];
}

// Utility: save to disk immediately
function saveToDisk() {
  writeFileSync(
    RESULTS_FILE,
    JSON.stringify(
      {
        results: saved.results,
        threshold: MIN_CHANGED_FILES,
      },
      null,
      2,
    ),
    'utf8',
  );
}

type PullRequestNode = {
  number: number;
  url: string;
  changedFiles: number;
};

type PullRequestPage = {
  nodes: PullRequestNode[];
  endCursor: string | null;
  hasNextPage: boolean;
};

const OWNER = 'facebook';
const NAME = 'react';

const QUERY = `
  query BigPullRequests($owner: String!, $name: String!, $after: String) {
    repository(owner: $owner, name: $name) {
      pullRequests(
        states: MERGED
        orderBy: { field: UPDATED_AT, direction: DESC }
        first: 100
        after: $after
      ) {
        nodes {
          number
          url
          changedFiles
        }
        pageInfo {
          hasNextPage
          endCursor
        }
      }
    }
  }
`;

async function fetchPage(after: string | null): Promise<PullRequestPage> {
  const res = await fetch('https://api.github.com/graphql', {
    body: JSON.stringify({
      query: QUERY,
      variables: { after, name: NAME, owner: OWNER },
    }),
    headers: {
      Authorization: `Bearer ${GITHUB_TOKEN}`,
      'Content-Type': 'application/json',
    },
    method: 'POST',
  });

  const json: any = await res.json();
  if (json.errors) {
    console.error(JSON.stringify(json.errors, null, 2));
    throw new Error('GraphQL error');
  }

  const prConn = json.data.repository.pullRequests;

  return {
    endCursor: prConn.pageInfo.endCursor,
    hasNextPage: prConn.pageInfo.hasNextPage,
    nodes: prConn.nodes,
  };
}

async function main() {
  console.log(
    `Scanning merged PRs for ${OWNER}/${NAME} (changedFiles >= ${MIN_CHANGED_FILES})`,
  );

  let after: string | null = null;
  let page = 1;
  let scanned = 0;

  while (true) {
    if (MAX_PAGES !== null && page > MAX_PAGES) break;

    console.error(`Fetching page ${page}...`);

    const { nodes, endCursor, hasNextPage } = await fetchPage(after);
    scanned += nodes.length;

    for (const pr of nodes) {
      if (pr.changedFiles >= MIN_CHANGED_FILES && !seenNumbers.has(pr.number)) {
        seenNumbers.add(pr.number);
        saved.results.push(pr);

        // Sort for nice output
        saved.results.sort(
          (a: { changedFiles: number }, b: { changedFiles: number }) =>
            b.changedFiles - a.changedFiles,
        );

        console.error(
          `  → BIG PR FOUND: #${pr.number} (${pr.changedFiles} files) ${pr.url}`,
        );
        saveToDisk(); // 🧠 save progress immediately
      }
    }

    if (!hasNextPage || !endCursor) break;

    after = endCursor;
    page++;
  }

  console.log(`\nDone.`);
  console.log(`Scanned: ${scanned} PRs`);
  console.log(`Saved big PRs: ${saved.results.length}`);
  console.log(`See results in: ${RESULTS_FILE}`);
}

// oxlint-disable-next-line no-floating-promises
main();
