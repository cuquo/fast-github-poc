# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a high-performance GitHub repository viewer built with Next.js 16 canary, demonstrating advanced streaming and caching techniques for instant page loads. The project replicates GitHub's repository, tree, blob, and pull request views with dramatically faster perceived performance by eliminating the "blue loading bar" through aggressive streaming and caching.

## Commands

```bash
# Install dependencies (requires Bun)
bun install

# Development server
bun dev

# Development with Rspack bundler
bun dev:rspack

# Production build
bun build

# Production server
bun start

# Linting (runs oxlint with type checking + biome)
bun lint

# Compile Relay GraphQL
bun relay-compile

# Update GitHub GraphQL schema
bun update:github-schema
```

## Environment Setup

Requires a `GITHUB_TOKEN` environment variable with GitHub API access. Copy `.env.example` to `.env` and add your token.

## Architecture

### Data Fetching Layer

**Relay GraphQL** (`src/graphql/`):
- `relay/environment.ts` - Request-scoped Relay environments for RSC with response caching
- `relay/load-serializable-query.ts` - Core pattern for loading queries and committing to Relay store
- `relay/get-server-fragment.ts` - Custom fragment reader for React Server Components
- `queries/` - GraphQL queries with corresponding `*Cache.ts` files using React's `cache()` for request deduplication
- `fragments/` - Reusable GraphQL fragments
- `schema/github.schema.graphql` - GitHub's GraphQL schema (auto-generated via `update:github-schema`)

**GitHub REST API** (`src/utils/github-octokit.ts`):
- Octokit client for PR file listings and patches (REST API provides richer diff data than GraphQL)

### Caching Strategy

- `cacheLife('poc')` with custom profile in `next.config.ts` (1 day TTL)
- `'use cache: remote'` directive for server-side cache segments
- React `cache()` for request-level deduplication
- Relay's `QueryResponseCache` for short-lived GraphQL response caching

### View Components (`src/views/`)

Main page-level components that orchestrate data loading and rendering:
- `Repo.tsx` - Repository homepage with file listing and README
- `Tree.tsx` - Directory tree navigation
- `Blob.tsx` - File content viewer with syntax highlighting
- `PullRequest.tsx` - PR diff viewer with sidebar
- `Owner.tsx` - User/org profile page

### Pull Request Diff System (`src/components/pull-request/`)

Complex streaming architecture for large PR diffs:
- `DiffEntries.tsx` - Orchestrates chunked streaming of diff entries
- `diff-entry-syntax.tsx` - Syntax-highlighted diff rendering
- `pull-request-sidebar.tsx` - File tree sidebar with scroll markers
- Uses Suspense boundaries with progressive loading

**Key utilities** (`src/utils/`):
- `batch-highlight.ts` - Server-side syntax highlighting with Shiki
- `pr-files-waterfall.ts` - Waterfall loading strategy for PR files
- `patch-to-renderable-rows.ts` - Unified diff parsing for split view
- `split-diff.ts` - Side-by-side diff data structures

### Performance Constants (`src/constants/options.ts`)

Tunable thresholds controlling streaming behavior:
- `DIFFS_PER_PAGE` - Initial diff batch size
- `TOO_LARGE_DIFF_THRESHOLD` - When to show placeholder instead of full diff
- `CHUNK_SIZE`, `CHUNK_DELAY_MS` - Streaming chunk configuration
- `ALLOWED_REPOS` - Whitelist of GitHub orgs for demo purposes

### Styling

- Tailwind CSS 4 with custom properties
- CSS files in `src/css/` defining color tokens and breakpoints
- GitHub-inspired dark theme

## Key Patterns

**Server Components with `'server-only'`**: Most view components import `server-only` to ensure they only run on the server.

**Relay in RSC**: Uses `getQueryFromRelayStore()` after awaiting cached query loaders, enabling synchronous data access in render.

**Streaming with Suspense**: Strategic `<Suspense>` boundaries enable progressive page hydration while maintaining native browser search.

**Path aliases**: Use `@/*` for imports from `src/` (configured in `tsconfig.json`).

## Plan Mode

- Make the plan extremely concise. Sacrifice grammar for the sake of concision.
- At the end of each plan, give me a list of unresolved questions to answer, if any.

## Preferences

- Never commit changes automatically. Always let the user review and commit manually.
- All code comments must be written in English.
