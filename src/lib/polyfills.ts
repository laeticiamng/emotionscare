
// Add polyfills for missing array functions

if (!Array.prototype.findLast) {
  Array.prototype.findLast = function(predicate) {
    for (let i = this.length - 1; i >= 0; i--) {
      const element = this[i];
      if (predicate(element, i, this)) {
        return element;
      }
    }
    return undefined;
  };
}

// Extend the Array prototype
declare global {
  interface Array<T> {
    findLast(predicate: (value: T, index: number, obj: T[]) => unknown): T | undefined;
  }
}

export {};
