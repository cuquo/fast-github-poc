import fs from 'node:fs';

const JQUERY_URL = 'https://code.jquery.com/jquery-3.7.1.js';
const FILE_A = 'fileA.txt';
const FILE_B = 'fileB.txt';

console.log('⏳ Downloading jQuery (Uncompressed)...');

try {
  const response = await fetch(JQUERY_URL);
  if (!response.ok) throw new Error(`Download failed: ${response.statusText}`);

  const originalCode = await response.text();
  // Normalize to LF so our line splitting and file outputs are stable.
  const normalizedCode = originalCode
    .replace(/\r\n/g, '\n')
    .replace(/\r/g, '\n');
  // Split by line to manipulate
  const lines = normalizedCode.split(/\r\n|\r|\n/);

  console.log(`✅ Download complete. Total lines: ${lines.length}`);

  // --- SAVE Original File ---
  fs.writeFileSync(FILE_A, normalizedCode);

  // --- CREATE Modified File (Realistic Simulation) ---
  const modifiedLines = [...lines];

  // 1. Simulate DELETION of a large block (e.g., refactoring or deprecation)
  // Removing 200 lines around line 500
  modifiedLines.splice(500, 200);

  // 2. Simulate scattered MODIFICATIONS (bug fixes)
  if (modifiedLines.length > 2000) {
    modifiedLines[1500] = '// [FIX] Typo fixed here for better type safety';
    modifiedLines[1501] =
      'var fixedVariable = true; // Changed from let to var';

    modifiedLines[4000] = `${modifiedLines[4000]} // TODO: Check performance impact`;
  }

  // 3. Simulate INSERTION of a new feature at the end
  const newFeature = [
    '',
    '// --- NEW FEATURE FLAG ---',
    '(function() {',
    "    console.log('Experimental feature enabled');",
    "    const config = { verbose: true, mode: 'strict' };",
    '    return config;',
    '})();',
  ];
  modifiedLines.push(...newFeature);

  fs.writeFileSync(FILE_B, modifiedLines.join('\n'));

  console.log(`📝 Files created successfully:`);
  console.log(`   - ${FILE_A} (Original jQuery)`);
  console.log(
    `   - ${FILE_B} (Modified version with deletions, edits, and insertions)`,
  );
} catch (error) {
  console.error('❌ Error:', error);
}
