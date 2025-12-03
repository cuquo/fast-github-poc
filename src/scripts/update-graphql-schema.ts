#!/usr/bin/env bun
/**
 * Download GitHub public GraphQL schema (SDL).
 * - No fallback to introspection
 * - Always writes to: src/graphql/schema/github.schema.graphql
 * - Uses ETag to skip download if unchanged (304 Not Modified)
 * - Does NOT require a GitHub token
 */

export {}; // ensure TS treats file as module (needed for top-level await)

// GitHub public schema endpoint
const PUBLIC_SCHEMA_URL =
  'https://docs.github.com/public/fpt/schema.docs.graphql';

// Hard-coded output paths
const OUT_FILE = 'src/graphql/schema/github.schema.graphql';
const ETAG_FILE = 'src/graphql/schema/.github.schema.etag';

function log(msg: string) {
  console.log(`[schema] ${msg}`);
}

async function readIfExists(path: string): Promise<string | null> {
  try {
    const f = Bun.file(path);
    if (!(await f.exists())) return null;
    return await f.text();
  } catch {
    return null;
  }
}

async function writeText(path: string, data: string) {
  await Bun.write(path, data);
}

async function ensureDir() {
  // `mkdir -p` will create nested directories if missing
  await Bun.$`mkdir -p src/graphql/schema`;
}

async function main() {
  await ensureDir();

  const headers: HeadersInit = {
    Accept: 'application/graphql+schema',
  };

  // ETag mechanism: if the file has not changed GitHub will return 304
  const prevETag = await readIfExists(ETAG_FILE);
  if (prevETag) {
    headers['If-None-Match'] = prevETag;
  }

  log(`Downloading public schema… (${PUBLIC_SCHEMA_URL})`);
  const res = await fetch(PUBLIC_SCHEMA_URL, {
    headers,
    redirect: 'follow',
  });

  if (res.status === 304) {
    log('No changes detected (304 Not Modified).');
    return;
  }

  if (!res.ok) {
    log(`Download failed: HTTP ${res.status}`);
    process.exitCode = 1;
    return;
  }

  const text = await res.text();
  if (!text || text.trim().length === 0) {
    log('Schema body is empty or invalid.');
    process.exitCode = 1;
    return;
  }

  await writeText(OUT_FILE, text);

  const newETag = res.headers.get('etag');
  if (newETag) {
    await writeText(ETAG_FILE, newETag);
  }

  log(`Schema updated → ${OUT_FILE}`);
}

await main();
