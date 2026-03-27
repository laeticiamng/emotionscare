// @ts-nocheck
// Polyfill for Array.findLast
if (!Array.prototype.findLast) {
  (Array.prototype as any).findLast = function<T>(this: T[], predicate: (element: T, index: number, array: T[]) => boolean): T | undefined {
    for (let i = this.length - 1; i >= 0; i--) {
      const element = this[i];
      if (predicate(element, i, this)) {
        return element;
      }
    }
    return undefined;
  };
}

// Export empty object to make this a module
export {};
