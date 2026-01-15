/* number of lines per visible chunks in blob view */
export const NUMBER_OF_VISIBLE_LINES = 70;

/* Allowed size in bytes to prefetch */
export const SIZE_TO_PREFETCH = 20 * 1024; // 20 KB

/* number of diffs to load at first */
export const DIFFS_PER_PAGE = 20;

/* number of diffs to syntax highlight for initial paint */
export const INITIAL_SYNTAX_HIGHLIGHT_DIFF = 10;

/* page size when fetching listing PR files */
export const PAGE_SIZE = 100;

/* maximum number of files to render in a pull request diff */
export const MAX_FILES_TO_RENDER = 500;

/* number of files in a pull request to start virtualizing the sidebar */
export const FILES_VIRTUALIZATION_THRESHOLD = 80;

/* number of lines added + removed to consider a diff as too large
   (large diffs render a lightweight placeholder instead of full content) */
export const TOO_LARGE_DIFF_THRESHOLD = 500;

/* Min DiffEntry we render per Suspense boundary after initial load. */
export const CHUNK_SIZE = 30;

/* delay (in ms) between chunks to throttle server streaming cadence
   and give the browser time to paint and process streamed HTML */
export const CHUNK_DELAY_MS = 10;

/* approximate "render cost" in lines for a placeholder diff
   used to avoid over-penalizing large files when chunking by effective weight */
export const PLACEHOLDER_COST_LINES = 5;

/* target effective render budget per streamed chunk, based on
   additions + deletions for real diffs and PLACEHOLDER_COST_LINES for large ones.
   This controls chunk size to smooth streaming bursts without over-throttling. */
export const TARGET_EFFECTIVE_LINES_PER_CHUNK = 900;

/* List of allowed GitHub repositories for demonstration or testing purposes */
export const ALLOWED_REPOS = ['vercel', 'facebook', 'oven-sh', 'oxc-project'];
