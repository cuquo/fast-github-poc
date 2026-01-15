import 'server-only';

import { bundledLanguages } from 'shiki';

/**
 * Best-effort guess of the Shiki language ID from a file path.
 *
 * Rules:
 * - Only Shiki language IDs (validated against bundledLanguages)
 * - Fallback MUST be 'text'
 * - Path-based only
 */
const SHIKI_LANGUAGES = new Set(Object.keys(bundledLanguages));

// Extension to Shiki language mapping (only validated mappings)
const EXTENSION_MAP: Record<string, string> = {
  adoc: 'asciidoc',
  asciidoc: 'asciidoc',

  // Other
  asm: 'asm',
  bash: 'bash',
  bat: 'batch',
  // Compound extensions (checked first)
  'blade.php': 'blade',
  cairo: 'cairo',
  cc: 'cpp',
  cfg: 'ini',
  cjs: 'javascript',
  clj: 'clojure',
  cljc: 'clojure',
  cljs: 'clojure',
  cmd: 'batch',
  'component.html': 'angular-html',
  'component.ts': 'angular-ts',
  conf: 'nginx',
  cr: 'crystal',
  cs: 'csharp',
  cxx: 'cpp',
  el: 'emacs-lisp',

  // Data formats
  env: 'dotenv',
  erl: 'erlang',
  ex: 'elixir',
  exs: 'elixir',
  fish: 'fish',
  frag: 'glsl',
  fs: 'fsharp',
  fsi: 'fsharp',
  fsx: 'fsharp',
  gemspec: 'ruby',
  glsl: 'glsl',
  gql: 'graphql',

  // C family
  h: 'c',
  handlebars: 'handlebars',
  hbs: 'handlebars',
  hcl: 'hcl',
  hh: 'cpp',
  hlsl: 'hlsl',
  hpp: 'cpp',
  hrl: 'erlang',
  hs: 'haskell',
  htm: 'html',
  ini: 'ini',
  jade: 'pug',
  jl: 'julia',
  json: 'jsonc',
  jsonl: 'jsonl',
  kt: 'kotlin',
  kts: 'kotlin',
  lhs: 'haskell',
  lisp: 'lisp',
  markdown: 'markdown',

  // Docs
  md: 'markdown',
  mediawiki: 'wikitext',
  mermaid: 'mermaid',

  // Web
  mjs: 'javascript',
  ml: 'ocaml',
  mli: 'ocaml',
  mm: 'objective-cpp',
  mmd: 'mermaid',
  move: 'move',
  nim: 'nim',
  nims: 'nim',
  nu: 'nushell',
  pas: 'pascal',
  pcss: 'postcss',
  pl: 'perl',
  plist: 'xml',
  pm: 'perl',
  properties: 'properties',
  proto: 'protobuf',

  // Shell
  ps1: 'powershell',
  psd1: 'powershell',
  psm1: 'powershell',

  // Database
  psql: 'sql',
  py: 'python',
  pyi: 'python',
  pyw: 'python',
  rake: 'ruby',
  rb: 'ruby',
  rbw: 'ruby',
  rkt: 'racket',

  // Language shortcuts
  rs: 'rust',
  rst: 'rst',
  s: 'asm',
  scm: 'scheme',
  sh: 'bash',
  sol: 'solidity',
  ss: 'scheme',
  styl: 'stylus',
  stylus: 'stylus',
  sv: 'system-verilog',
  svh: 'system-verilog',

  // DevOps
  tf: 'terraform',
  tfvars: 'terraform',
  v: 'verilog',
  vert: 'glsl',
  vhd: 'vhdl',
  vhdl: 'vhdl',
  vy: 'vyper',
  wasm: 'wasm',
  wat: 'wasm',
  wgsl: 'wgsl',
  wiki: 'wikitext',

  // Common aliases
  yml: 'yaml',
  zig: 'zig',
  zsh: 'zsh',
};

// Special filenames (case-insensitive matching)
const SPECIAL_FILES: Record<string, string> = {
  '.dockerignore': 'text',
  '.editorconfig': 'ini',
  '.eslintignore': 'text',
  '.git-blame-ignore-revs': 'text',
  '.gitattributes': 'gitignore',
  '.gitignore': 'gitignore',
  '.npmrc': 'ini',
  '.nvmrc': 'text',
  '.prettierignore': 'text',
  'cargo.lock': 'toml',
  'cmakelists.txt': 'cmake',
  codeowners: 'codeowners',
  dockerfile: 'dockerfile',
  gemfile: 'ruby',
  makefile: 'makefile',
  rakefile: 'ruby',
};

// Pre-validated extension map (only includes languages that exist in Shiki)
const VALIDATED_EXTENSION_MAP = new Map<string, string>();
const VALIDATED_SPECIAL_FILES = new Map<string, string>();

// Validate mappings at module load time (once)
for (const [ext, lang] of Object.entries(EXTENSION_MAP)) {
  if (SHIKI_LANGUAGES.has(lang)) {
    VALIDATED_EXTENSION_MAP.set(ext, lang);
  }
}

for (const [file, lang] of Object.entries(SPECIAL_FILES)) {
  if (lang === 'text' || SHIKI_LANGUAGES.has(lang)) {
    VALIDATED_SPECIAL_FILES.set(file, lang);
  }
}

export function guessLanguageFromFile(path: string): string {
  if (!path) return 'text';

  // Extract filename from path (faster than split)
  const lastSlash = path.lastIndexOf('/');
  const fileName = (
    lastSlash === -1 ? path : path.slice(lastSlash + 1)
  ).toLowerCase();

  // O(1) lookup for exact special filename match
  const specialLang = VALIDATED_SPECIAL_FILES.get(fileName);
  if (specialLang) return specialLang;

  // Check suffix-based special files (dockerfile, makefile, etc.)
  if (fileName.endsWith('dockerfile')) return 'dockerfile';
  if (fileName.endsWith('makefile')) return 'makefile';

  // Find last dot for extension
  const lastDot = fileName.lastIndexOf('.');
  if (lastDot === -1) return 'text';

  // Check compound extension first (e.g., .blade.php -> blade.php)
  const secondLastDot = fileName.lastIndexOf('.', lastDot - 1);
  if (secondLastDot !== -1) {
    const compoundExt = fileName.slice(secondLastDot + 1);
    const compoundLang = VALIDATED_EXTENSION_MAP.get(compoundExt);
    if (compoundLang) return compoundLang;
  }

  // Simple extension lookup
  const ext = fileName.slice(lastDot + 1);

  // O(1) Map lookup
  const mappedLang = VALIDATED_EXTENSION_MAP.get(ext);
  if (mappedLang) return mappedLang;

  // Direct Shiki language match
  if (SHIKI_LANGUAGES.has(ext)) return ext;

  return 'text';
}
