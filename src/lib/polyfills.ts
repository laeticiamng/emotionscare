
/**
 * Polyfill for Array.findLast method
 * @returns The last element that satisfies the predicate, or undefined if none is found
 */
if (!Array.prototype.findLast) {
  Array.prototype.findLast = function(predicate: (value: any, index: number, obj: any[]) => boolean): any {
    for (let i = this.length - 1; i >= 0; i--) {
      if (predicate(this[i], i, this)) {
        return this[i];
      }
    }
    return undefined;
  };
}

// Extend ArrayLike types to include our polyfills
declare global {
  interface Array<T> {
    findLast(predicate: (value: T, index: number, obj: T[]) => boolean): T | undefined;
  }
}

export {};
