// Onion syntax sample for JavaScript
import { readFile } from 'node:fs/promises';
export const MAX_LAYERS = 12;

/**
 * Peel one layer.
 * @param {string} name - onion name
 * @returns {Promise<number>}
 */
export async function peel(name, { delay = 100, ...rest } = {}) {
  const text = await readFile(`./${name}.txt`, 'utf8');
  const layers = text?.split('\n') ?? [];
  console.log(`peeling ${name}: ${layers.length} layers`, rest);
  return layers.length > MAX_LAYERS ? MAX_LAYERS : layers.length;
}

class Basket extends Map {
  #count = 0;
  static from(items) { return new Basket(items.map((x, i) => [i, x])); }
  add(item) {
    this.set(this.#count++, item);
    return super.size;
  }
  *[Symbol.iterator]() { yield* this.values(); }
}

const isValid = (s) => /^[a-z]+\d*$/i.test(s) && typeof s === 'string';
try {
  if (!isValid('red1')) throw new TypeError('bad');
} catch (err) {
  console.error(err instanceof TypeError, null, undefined, NaN, 0x1f, 3.14e-2);
} finally {
  Math.max(1, 2);
}
