import 'server-only';

import { bundledLanguages } from 'shiki';

/**
 * Best-effort guess of the Shiki language ID from a file path.
 *
 * Rules:
 * - Only Shiki language IDs
 * - Fallback MUST be 'text'
 * - Path-based only
 */
const SHIKI_LANGUAGES = new Set(Object.keys(bundledLanguages));

export function guessLanguageFromFile(path: string): string {
  if (!path) return 'text';

  const name = path.toLowerCase();

  // --- Special filenames ---
  if (name.endsWith('cargo.lock')) return 'toml';
  if (name.toLowerCase().includes('codeowners')) return 'codeowners';
  if (name.endsWith('dockerfile')) return 'dockerfile';
  if (name.endsWith('makefile')) return 'makefile';
  if (name.endsWith('.editorconfig')) return 'ini';

  // --- Explicit plaintext files ---
  if (
    name.endsWith('.prettierignore') ||
    name.endsWith('.eslintignore') ||
    name.endsWith('.git-blame-ignore-revs')
  ) {
    return 'text';
  }

  const idx = name.lastIndexOf('.');
  if (idx === -1) return 'text';

  const ext = name.slice(idx + 1);

  // --- Required mappings ---
  switch (ext) {
    case 'json':
      return SHIKI_LANGUAGES.has('jsonc') ? 'jsonc' : 'text';
    case 'yml':
      return SHIKI_LANGUAGES.has('yaml') ? 'yaml' : 'text';
    case 'plist':
      return SHIKI_LANGUAGES.has('xml') ? 'xml' : 'text';
    case 'sh':
      return SHIKI_LANGUAGES.has('bash') ? 'bash' : 'text';
    case 'rs':
      return 'rust';
    case 'py':
      return 'python';
    case 'kt':
      return 'kotlin';
    case 'h':
      return 'c';
    case 'env':
      return 'dotenv';
  }

  if (SHIKI_LANGUAGES.has(ext)) {
    return ext;
  }

  return 'text';
}
