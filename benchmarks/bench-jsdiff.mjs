// bench-jsdiff.mjs
import fs from 'node:fs';

import * as Diff from 'diff';

const textA = fs.readFileSync('fileA.txt', 'utf-8');
const textB = fs.readFileSync('fileB.txt', 'utf-8');

const start = performance.now();

// diffLines is the comparable method (Line Mode)
const changes = Diff.diffLines(textA, textB);

const end = performance.now();

console.log(
  `jsdiff: Chunks=${changes.length} Time=${(end - start).toFixed(2)}ms`,
);
