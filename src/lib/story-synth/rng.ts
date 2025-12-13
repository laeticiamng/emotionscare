// @ts-nocheck
/**
 * RNG - Générateur de nombres aléatoires déterministes
 * Algorithmes de hash, générateurs de séquences et utilitaires de sélection
 */

/** État du générateur */
export interface RNGState {
  seed: number;
  calls: number;
  algorithm: RNGAlgorithm;
}

/** Algorithme de génération */
export type RNGAlgorithm = 'mulberry32' | 'xorshift128' | 'pcg32' | 'lcg';

/** Configuration du générateur */
export interface RNGConfig {
  algorithm: RNGAlgorithm;
  minValue: number;
  maxValue: number;
}

/** Options de distribution */
export interface DistributionOptions {
  mean?: number;
  stdDev?: number;
  min?: number;
  max?: number;
}

// Configuration par défaut
const DEFAULT_CONFIG: RNGConfig = {
  algorithm: 'mulberry32',
  minValue: 0,
  maxValue: 1
};

/** Calculer un hash depuis une string (djb2 amélioré) */
export function hashSeed(s: string): number {
  let h = 1779033703 ^ s.length;
  for (let i = 0; i < s.length; i++) {
    h = Math.imul(h ^ s.charCodeAt(i), 3432918353);
    h = (h << 13) | (h >>> 19);
  }
  return (h >>> 0) || 1;
}

/** Calculer un hash FNV-1a */
export function fnv1aHash(s: string): number {
  let hash = 2166136261;
  for (let i = 0; i < s.length; i++) {
    hash ^= s.charCodeAt(i);
    hash = Math.imul(hash, 16777619);
  }
  return hash >>> 0;
}

/** Calculer un hash MurmurHash3 simplifié */
export function murmurHash(s: string, seed: number = 0): number {
  let h = seed;
  for (let i = 0; i < s.length; i++) {
    const k = s.charCodeAt(i);
    h = Math.imul(h ^ k, 0x5bd1e995);
    h ^= h >>> 15;
  }
  h = Math.imul(h, 0x5bd1e995);
  h ^= h >>> 15;
  return h >>> 0;
}

/** Combiner plusieurs seeds */
export function combinedSeed(...seeds: (string | number)[]): number {
  let combined = 0;
  for (const seed of seeds) {
    const hash = typeof seed === 'string' ? hashSeed(seed) : seed;
    combined = (combined * 31 + hash) >>> 0;
  }
  return combined || 1;
}

/** Générateur Mulberry32 */
function mulberry32(seed: number): () => number {
  let t = seed >>> 0;
  return function rand() {
    t += 0x6D2B79F5;
    let r = Math.imul(t ^ (t >>> 15), 1 | t);
    r ^= r + Math.imul(r ^ (r >>> 7), 61 | r);
    return ((r ^ (r >>> 14)) >>> 0) / 4294967296;
  };
}

/** Générateur XorShift128 */
function xorshift128(seed: number): () => number {
  let x = seed >>> 0 || 1;
  let y = (seed * 2654435761) >>> 0 || 1;
  let z = (seed * 2246822519) >>> 0 || 1;
  let w = (seed * 3266489917) >>> 0 || 1;

  return function rand() {
    const t = x ^ (x << 11);
    x = y;
    y = z;
    z = w;
    w = w ^ (w >>> 19) ^ (t ^ (t >>> 8));
    return (w >>> 0) / 4294967296;
  };
}

/** Générateur PCG-32 simplifié */
function pcg32(seed: number): () => number {
  let state = BigInt(seed) | (BigInt(seed) << 32n);
  const multiplier = 6364136223846793005n;
  const increment = 1442695040888963407n;

  return function rand() {
    const oldState = state;
    state = (oldState * multiplier + increment) & ((1n << 64n) - 1n);
    const xorshifted = Number((((oldState >> 18n) ^ oldState) >> 27n) & 0xFFFFFFFFn);
    const rot = Number(oldState >> 59n);
    const result = ((xorshifted >>> rot) | (xorshifted << ((32 - rot) & 31))) >>> 0;
    return result / 4294967296;
  };
}

/** Générateur LCG (Linear Congruential Generator) */
function lcg(seed: number): () => number {
  let state = seed >>> 0 || 1;
  const a = 1664525;
  const c = 1013904223;

  return function rand() {
    state = (Math.imul(state, a) + c) >>> 0;
    return state / 4294967296;
  };
}

/** Créer un générateur aléatoire */
export function createRng(seedStr: string, algorithm: RNGAlgorithm = 'mulberry32'): () => number {
  const seed = hashSeed(seedStr);

  switch (algorithm) {
    case 'xorshift128':
      return xorshift128(seed);
    case 'pcg32':
      return pcg32(seed);
    case 'lcg':
      return lcg(seed);
    case 'mulberry32':
    default:
      return mulberry32(seed);
  }
}

/** Créer un générateur depuis un seed numérique */
export function createRngFromSeed(seed: number, algorithm: RNGAlgorithm = 'mulberry32'): () => number {
  switch (algorithm) {
    case 'xorshift128':
      return xorshift128(seed);
    case 'pcg32':
      return pcg32(seed);
    case 'lcg':
      return lcg(seed);
    case 'mulberry32':
    default:
      return mulberry32(seed);
  }
}

/** Sélectionner un élément aléatoire */
export function pick<T>(rand: () => number, arr: T[]): T {
  if (arr.length === 0) {
    throw new Error('Cannot pick from empty array');
  }
  return arr[Math.floor(rand() * arr.length)];
}

/** Sélectionner un élément avec poids */
export function pickWeighted<T>(
  rand: () => number,
  items: T[],
  weights: number[]
): T {
  if (items.length === 0) {
    throw new Error('Cannot pick from empty array');
  }
  if (items.length !== weights.length) {
    throw new Error('Items and weights must have same length');
  }

  const totalWeight = weights.reduce((sum, w) => sum + w, 0);
  let random = rand() * totalWeight;

  for (let i = 0; i < items.length; i++) {
    random -= weights[i];
    if (random <= 0) {
      return items[i];
    }
  }

  return items[items.length - 1];
}

/** Sélectionner plusieurs éléments uniques */
export function pickMultiple<T>(rand: () => number, arr: T[], count: number): T[] {
  if (count > arr.length) {
    throw new Error('Cannot pick more items than available');
  }

  const result: T[] = [];
  const available = [...arr];

  for (let i = 0; i < count; i++) {
    const index = Math.floor(rand() * available.length);
    result.push(available[index]);
    available.splice(index, 1);
  }

  return result;
}

/** Mélanger un tableau (Fisher-Yates) */
export function shuffle<T>(rand: () => number, arr: T[]): T[] {
  const result = [...arr];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

/** Générer un entier dans un intervalle [min, max] inclusif */
export function randomInt(rand: () => number, min: number, max: number): number {
  return Math.floor(rand() * (max - min + 1)) + min;
}

/** Générer un flottant dans un intervalle [min, max) */
export function randomFloat(rand: () => number, min: number, max: number): number {
  return rand() * (max - min) + min;
}

/** Générer un booléen avec probabilité */
export function randomBool(rand: () => number, probability: number = 0.5): boolean {
  return rand() < probability;
}

/** Distribution gaussienne (Box-Muller) */
export function gaussianRandom(
  rand: () => number,
  mean: number = 0,
  stdDev: number = 1
): number {
  const u1 = rand();
  const u2 = rand();
  const z0 = Math.sqrt(-2 * Math.log(u1)) * Math.cos(2 * Math.PI * u2);
  return z0 * stdDev + mean;
}

/** Distribution exponentielle */
export function exponentialRandom(rand: () => number, lambda: number = 1): number {
  return -Math.log(1 - rand()) / lambda;
}

/** Distribution de Poisson */
export function poissonRandom(rand: () => number, lambda: number): number {
  const L = Math.exp(-lambda);
  let k = 0;
  let p = 1;

  do {
    k++;
    p *= rand();
  } while (p > L);

  return k - 1;
}

/** Générer un UUID v4 déterministe */
export function deterministicUUID(rand: () => number): string {
  const bytes = new Uint8Array(16);
  for (let i = 0; i < 16; i++) {
    bytes[i] = Math.floor(rand() * 256);
  }

  bytes[6] = (bytes[6] & 0x0f) | 0x40; // Version 4
  bytes[8] = (bytes[8] & 0x3f) | 0x80; // Variant

  const hex = Array.from(bytes)
    .map(b => b.toString(16).padStart(2, '0'))
    .join('');

  return `${hex.slice(0, 8)}-${hex.slice(8, 12)}-${hex.slice(12, 16)}-${hex.slice(16, 20)}-${hex.slice(20)}`;
}

/** Générer une couleur hexadécimale aléatoire */
export function randomColor(rand: () => number): string {
  const r = Math.floor(rand() * 256);
  const g = Math.floor(rand() * 256);
  const b = Math.floor(rand() * 256);
  return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
}

/** Générer une couleur dans une palette */
export function randomPaletteColor(rand: () => number, saturation: number = 0.7, lightness: number = 0.6): string {
  const hue = Math.floor(rand() * 360);
  return `hsl(${hue}, ${saturation * 100}%, ${lightness * 100}%)`;
}

/** Générer une string aléatoire */
export function randomString(
  rand: () => number,
  length: number,
  charset: string = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
): string {
  let result = '';
  for (let i = 0; i < length; i++) {
    result += charset[Math.floor(rand() * charset.length)];
  }
  return result;
}

/** Créer un générateur avec état sauvegardable */
export function createStatefulRng(seedStr: string, algorithm: RNGAlgorithm = 'mulberry32'): {
  next: () => number;
  getState: () => RNGState;
  jump: (n: number) => void;
  reset: () => void;
} {
  const seed = hashSeed(seedStr);
  let calls = 0;
  let generator = createRngFromSeed(seed, algorithm);

  return {
    next: () => {
      calls++;
      return generator();
    },
    getState: () => ({
      seed,
      calls,
      algorithm
    }),
    jump: (n: number) => {
      for (let i = 0; i < n; i++) {
        generator();
        calls++;
      }
    },
    reset: () => {
      calls = 0;
      generator = createRngFromSeed(seed, algorithm);
    }
  };
}

/** Générer un seed basé sur le temps */
export function timeSeed(): number {
  return Date.now() ^ (Math.random() * 0xFFFFFFFF);
}

/** Obtenir un générateur crypto (non déterministe) */
export function cryptoRandom(): number {
  if (typeof crypto !== 'undefined' && crypto.getRandomValues) {
    const array = new Uint32Array(1);
    crypto.getRandomValues(array);
    return array[0] / 4294967296;
  }
  return Math.random();
}

export default {
  hashSeed,
  fnv1aHash,
  murmurHash,
  combinedSeed,
  createRng,
  createRngFromSeed,
  createStatefulRng,
  pick,
  pickWeighted,
  pickMultiple,
  shuffle,
  randomInt,
  randomFloat,
  randomBool,
  gaussianRandom,
  exponentialRandom,
  poissonRandom,
  deterministicUUID,
  randomColor,
  randomPaletteColor,
  randomString,
  timeSeed,
  cryptoRandom
};
