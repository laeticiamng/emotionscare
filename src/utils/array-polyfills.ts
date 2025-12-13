// @ts-nocheck
/**
 * Array Polyfills - Polyfills et utilitaires avancés pour les tableaux
 * Méthodes manquantes et helpers fonctionnels
 */

// ============================================
// Polyfills ES2023+
// ============================================

/** Polyfill for Array.prototype.findLast */
if (!Array.prototype.findLast) {
  Array.prototype.findLast = function<T>(
    this: T[],
    predicate: (value: T, index: number, array: T[]) => boolean
  ): T | undefined {
    for (let i = this.length - 1; i >= 0; i--) {
      const element = this[i];
      if (predicate(element, i, this)) {
        return element;
      }
    }
    return undefined;
  };
}

/** Polyfill for Array.prototype.findLastIndex */
if (!Array.prototype.findLastIndex) {
  Array.prototype.findLastIndex = function<T>(
    this: T[],
    predicate: (value: T, index: number, array: T[]) => boolean
  ): number {
    for (let i = this.length - 1; i >= 0; i--) {
      if (predicate(this[i], i, this)) {
        return i;
      }
    }
    return -1;
  };
}

/** Polyfill for Array.prototype.at */
if (!Array.prototype.at) {
  Array.prototype.at = function<T>(this: T[], index: number): T | undefined {
    const len = this.length;
    const relativeIndex = index >= 0 ? index : len + index;
    if (relativeIndex < 0 || relativeIndex >= len) return undefined;
    return this[relativeIndex];
  };
}

/** Polyfill for Array.prototype.toReversed */
if (!Array.prototype.toReversed) {
  Array.prototype.toReversed = function<T>(this: T[]): T[] {
    return [...this].reverse();
  };
}

/** Polyfill for Array.prototype.toSorted */
if (!Array.prototype.toSorted) {
  Array.prototype.toSorted = function<T>(
    this: T[],
    compareFn?: (a: T, b: T) => number
  ): T[] {
    return [...this].sort(compareFn);
  };
}

/** Polyfill for Array.prototype.toSpliced */
if (!Array.prototype.toSpliced) {
  Array.prototype.toSpliced = function<T>(
    this: T[],
    start: number,
    deleteCount?: number,
    ...items: T[]
  ): T[] {
    const copy = [...this];
    copy.splice(start, deleteCount ?? 0, ...items);
    return copy;
  };
}

/** Polyfill for Array.prototype.with */
if (!Array.prototype.with) {
  Array.prototype.with = function<T>(this: T[], index: number, value: T): T[] {
    const len = this.length;
    const relativeIndex = index >= 0 ? index : len + index;
    if (relativeIndex < 0 || relativeIndex >= len) {
      throw new RangeError(`Invalid index: ${index}`);
    }
    const copy = [...this];
    copy[relativeIndex] = value;
    return copy;
  };
}

// ============================================
// Utilitaires de tableau avancés
// ============================================

/** Options de chunk */
export interface ChunkOptions {
  preserveRemainder?: boolean;
}

/** Diviser un tableau en morceaux */
export function chunk<T>(array: T[], size: number, options?: ChunkOptions): T[][] {
  if (size <= 0) throw new Error('Chunk size must be positive');
  const chunks: T[][] = [];
  for (let i = 0; i < array.length; i += size) {
    const chunk = array.slice(i, i + size);
    if (options?.preserveRemainder === false && chunk.length < size) {
      continue;
    }
    chunks.push(chunk);
  }
  return chunks;
}

/** Aplatir un tableau récursivement */
export function flattenDeep<T>(array: unknown[]): T[] {
  return array.reduce<T[]>((acc, val) => {
    if (Array.isArray(val)) {
      return acc.concat(flattenDeep<T>(val));
    }
    return acc.concat(val as T);
  }, []);
}

/** Dédupliquer un tableau */
export function unique<T>(array: T[], keyFn?: (item: T) => unknown): T[] {
  if (keyFn) {
    const seen = new Set();
    return array.filter(item => {
      const key = keyFn(item);
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });
  }
  return [...new Set(array)];
}

/** Compter les occurrences */
export function countBy<T>(array: T[], keyFn: (item: T) => string): Record<string, number> {
  return array.reduce((acc, item) => {
    const key = keyFn(item);
    acc[key] = (acc[key] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
}

/** Grouper par clé */
export function groupBy<T>(array: T[], keyFn: (item: T) => string): Record<string, T[]> {
  return array.reduce((acc, item) => {
    const key = keyFn(item);
    if (!acc[key]) acc[key] = [];
    acc[key].push(item);
    return acc;
  }, {} as Record<string, T[]>);
}

/** Partitionner selon un prédicat */
export function partition<T>(
  array: T[],
  predicate: (item: T, index: number) => boolean
): [T[], T[]] {
  const pass: T[] = [];
  const fail: T[] = [];
  array.forEach((item, index) => {
    (predicate(item, index) ? pass : fail).push(item);
  });
  return [pass, fail];
}

/** Intersecter plusieurs tableaux */
export function intersection<T>(...arrays: T[][]): T[] {
  if (arrays.length === 0) return [];
  if (arrays.length === 1) return [...arrays[0]];

  const [first, ...rest] = arrays;
  return first.filter(item => rest.every(arr => arr.includes(item)));
}

/** Union de plusieurs tableaux */
export function union<T>(...arrays: T[][]): T[] {
  return unique(arrays.flat());
}

/** Différence entre tableaux */
export function difference<T>(array: T[], ...others: T[][]): T[] {
  const excluded = new Set(others.flat());
  return array.filter(item => !excluded.has(item));
}

/** Différence symétrique */
export function symmetricDifference<T>(a: T[], b: T[]): T[] {
  const setA = new Set(a);
  const setB = new Set(b);
  return [
    ...a.filter(x => !setB.has(x)),
    ...b.filter(x => !setA.has(x))
  ];
}

/** Mélanger un tableau (Fisher-Yates) */
export function shuffle<T>(array: T[]): T[] {
  const result = [...array];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

/** Échantillonner des éléments aléatoires */
export function sample<T>(array: T[], count: number = 1): T[] {
  const shuffled = shuffle(array);
  return shuffled.slice(0, Math.min(count, array.length));
}

/** Obtenir un élément aléatoire */
export function randomElement<T>(array: T[]): T | undefined {
  if (array.length === 0) return undefined;
  return array[Math.floor(Math.random() * array.length)];
}

/** Compacter (retirer les valeurs falsy) */
export function compact<T>(array: (T | null | undefined | false | 0 | '')[]): T[] {
  return array.filter(Boolean) as T[];
}

/** Créer une plage de nombres */
export function range(start: number, end?: number, step: number = 1): number[] {
  if (end === undefined) {
    end = start;
    start = 0;
  }

  if (step === 0) throw new Error('Step cannot be zero');

  const result: number[] = [];
  if (step > 0) {
    for (let i = start; i < end; i += step) {
      result.push(i);
    }
  } else {
    for (let i = start; i > end; i += step) {
      result.push(i);
    }
  }
  return result;
}

/** Zipper plusieurs tableaux */
export function zip<T>(...arrays: T[][]): T[][] {
  const maxLength = Math.max(...arrays.map(arr => arr.length));
  return range(maxLength).map(i => arrays.map(arr => arr[i]));
}

/** Dézipper un tableau */
export function unzip<T>(array: T[][]): T[][] {
  if (array.length === 0) return [];
  const maxLength = Math.max(...array.map(arr => arr.length));
  return range(maxLength).map(i => array.map(arr => arr[i]));
}

/** Trier par plusieurs critères */
export function sortBy<T>(
  array: T[],
  ...criterias: ((item: T) => number | string)[]
): T[] {
  return [...array].sort((a, b) => {
    for (const criteria of criterias) {
      const valueA = criteria(a);
      const valueB = criteria(b);
      if (valueA < valueB) return -1;
      if (valueA > valueB) return 1;
    }
    return 0;
  });
}

/** Trouver l'index d'insertion pour un tri binaire */
export function sortedIndex<T>(array: T[], value: T, compareFn?: (a: T, b: T) => number): number {
  let low = 0;
  let high = array.length;

  const compare = compareFn || ((a: T, b: T) => (a < b ? -1 : a > b ? 1 : 0));

  while (low < high) {
    const mid = Math.floor((low + high) / 2);
    if (compare(array[mid], value) < 0) {
      low = mid + 1;
    } else {
      high = mid;
    }
  }
  return low;
}

/** Insérer en maintenant le tri */
export function sortedInsert<T>(array: T[], value: T, compareFn?: (a: T, b: T) => number): T[] {
  const index = sortedIndex(array, value, compareFn);
  const result = [...array];
  result.splice(index, 0, value);
  return result;
}

/** Obtenir le minimum selon un critère */
export function minBy<T>(array: T[], fn: (item: T) => number): T | undefined {
  if (array.length === 0) return undefined;
  return array.reduce((min, item) => fn(item) < fn(min) ? item : min);
}

/** Obtenir le maximum selon un critère */
export function maxBy<T>(array: T[], fn: (item: T) => number): T | undefined {
  if (array.length === 0) return undefined;
  return array.reduce((max, item) => fn(item) > fn(max) ? item : max);
}

/** Calculer la somme */
export function sum(array: number[]): number {
  return array.reduce((acc, val) => acc + val, 0);
}

/** Calculer la somme selon un critère */
export function sumBy<T>(array: T[], fn: (item: T) => number): number {
  return array.reduce((acc, item) => acc + fn(item), 0);
}

/** Calculer la moyenne */
export function average(array: number[]): number {
  if (array.length === 0) return 0;
  return sum(array) / array.length;
}

/** Calculer la médiane */
export function median(array: number[]): number {
  if (array.length === 0) return 0;
  const sorted = [...array].sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);
  return sorted.length % 2 !== 0
    ? sorted[mid]
    : (sorted[mid - 1] + sorted[mid]) / 2;
}

/** Prendre les premiers éléments */
export function take<T>(array: T[], count: number): T[] {
  return array.slice(0, count);
}

/** Prendre les derniers éléments */
export function takeLast<T>(array: T[], count: number): T[] {
  return array.slice(-count);
}

/** Prendre tant que le prédicat est vrai */
export function takeWhile<T>(array: T[], predicate: (item: T, index: number) => boolean): T[] {
  const result: T[] = [];
  for (let i = 0; i < array.length; i++) {
    if (!predicate(array[i], i)) break;
    result.push(array[i]);
  }
  return result;
}

/** Ignorer les premiers éléments */
export function drop<T>(array: T[], count: number): T[] {
  return array.slice(count);
}

/** Ignorer les derniers éléments */
export function dropLast<T>(array: T[], count: number): T[] {
  return array.slice(0, -count);
}

/** Ignorer tant que le prédicat est vrai */
export function dropWhile<T>(array: T[], predicate: (item: T, index: number) => boolean): T[] {
  let startIndex = 0;
  for (let i = 0; i < array.length; i++) {
    if (!predicate(array[i], i)) {
      startIndex = i;
      break;
    }
    startIndex = array.length;
  }
  return array.slice(startIndex);
}

/** Premier élément */
export function first<T>(array: T[]): T | undefined {
  return array[0];
}

/** Dernier élément */
export function last<T>(array: T[]): T | undefined {
  return array[array.length - 1];
}

/** Vérifier si le tableau est vide */
export function isEmpty<T>(array: T[]): boolean {
  return array.length === 0;
}

/** Vérifier si le tableau n'est pas vide */
export function isNotEmpty<T>(array: T[]): boolean {
  return array.length > 0;
}

/** Créer un objet à partir de paires clé-valeur */
export function fromPairs<V>(pairs: [string, V][]): Record<string, V> {
  return Object.fromEntries(pairs);
}

/** Convertir en paires clé-valeur */
export function toPairs<V>(obj: Record<string, V>): [string, V][] {
  return Object.entries(obj);
}

/** Indexer par clé */
export function keyBy<T>(array: T[], keyFn: (item: T) => string): Record<string, T> {
  return array.reduce((acc, item) => {
    acc[keyFn(item)] = item;
    return acc;
  }, {} as Record<string, T>);
}

/** Mapper vers un objet */
export function mapToObject<T, V>(
  array: T[],
  keyFn: (item: T) => string,
  valueFn: (item: T) => V
): Record<string, V> {
  return array.reduce((acc, item) => {
    acc[keyFn(item)] = valueFn(item);
    return acc;
  }, {} as Record<string, V>);
}

/** Vérifier l'égalité de deux tableaux */
export function isEqual<T>(a: T[], b: T[], compareFn?: (x: T, y: T) => boolean): boolean {
  if (a.length !== b.length) return false;
  const compare = compareFn || ((x, y) => x === y);
  return a.every((item, index) => compare(item, b[index]));
}

/** Vérifier si un tableau est un sous-ensemble d'un autre */
export function isSubset<T>(subset: T[], superset: T[]): boolean {
  const superSet = new Set(superset);
  return subset.every(item => superSet.has(item));
}

// Déclarations de types pour les polyfills
declare global {
  interface Array<T> {
    findLast(predicate: (value: T, index: number, array: T[]) => boolean): T | undefined;
    findLastIndex(predicate: (value: T, index: number, array: T[]) => boolean): number;
    at(index: number): T | undefined;
    toReversed(): T[];
    toSorted(compareFn?: (a: T, b: T) => number): T[];
    toSpliced(start: number, deleteCount?: number, ...items: T[]): T[];
    with(index: number, value: T): T[];
  }
}

export {};
