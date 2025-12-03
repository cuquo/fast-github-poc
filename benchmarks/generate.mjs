/**
 * SEED=1337 LINE_COUNT=20000 CHANGE_RATE=0.2 node generate.mjs
 */
import fs from 'node:fs';

const LINE_COUNT = Number.parseInt(process.env.LINE_COUNT ?? '20000', 10);
// Overall probability that a given line triggers an edit operation.
const CHANGE_RATE = Number.parseFloat(process.env.CHANGE_RATE ?? '0.2');
// Deterministic seed for reproducible fixtures.
const SEED = Number.parseInt(process.env.SEED ?? '1337', 10);

console.log(`Generating files with ${LINE_COUNT} lines...`);

/**
 * Deterministic PRNG for reproducible fixtures.
 * Xorshift32 is fast and good enough for benchmark data.
 */
function createRng(seed) {
  let x = seed | 0;
  return () => {
    x ^= x << 13;
    x ^= x >>> 17;
    x ^= x << 5;
    // Convert to [0, 1)
    return (x >>> 0) / 4294967296;
  };
}

const rng = createRng(SEED);

console.log(`Using SEED=${SEED} CHANGE_RATE=${CHANGE_RATE}`);

const linesA = [];
for (let i = 0; i < LINE_COUNT; i++) {
  linesA.push(
    `Generated text line number ${i} with static content for testing purposes.`,
  );
}

const linesB = [...linesA];
// Introduce chaos
for (let i = 0; i < linesB.length; i++) {
  const rand = rng();

  // Solo entramos si el random es menor que la tasa de cambio total
  if (rand < CHANGE_RATE) {
    // Dividimos el rango de cambio en 3 tipos de operaciones

    // 1. Primer tercio del rango: BORRAR
    if (rand < CHANGE_RATE * 0.33) {
      linesB.splice(i, 1);
      i--;
    }
    // 2. Segundo tercio del rango: MODIFICAR
    else if (rand < CHANGE_RATE * 0.66) {
      linesB[i] = `${linesB[i]} [MODIFIED]`;
    }
    // 3. El resto (hasta llegar a CHANGE_RATE): INSERTAR
    else {
      linesB.splice(i, 0, `NEW line inserted randomly ${rng()}`);
      i++;
    }
  }
}

fs.writeFileSync('fileA.txt', linesA.join('\n'));
fs.writeFileSync('fileB.txt', linesB.join('\n'));

console.log('Files fileA.txt and fileB.txt successfully created.');
