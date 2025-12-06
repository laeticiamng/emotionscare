
/**
 * This file contains polyfills for browser APIs that may be missing
 */

// Polyfill for Array.findLast if not available
if (!Array.prototype.findLast) {
  Array.prototype.findLast = function<T>(
    predicate: (value: T, index: number, array: T[]) => boolean,
    thisArg?: any
  ): T | undefined {
    if (this == null) {
      throw new TypeError('Array.prototype.findLast called on null or undefined');
    }
    if (typeof predicate !== 'function') {
      throw new TypeError('predicate must be a function');
    }

    const array = Object(this);
    const length = array.length >>> 0;
    
    for (let i = length - 1; i >= 0; i--) {
      const value = array[i];
      if (predicate.call(thisArg, value, i, array)) {
        return value;
      }
    }
    
    return undefined;
  };
}

export {};

// Add type definition to make TypeScript happy
declare global {
  interface Array<T> {
    findLast(predicate: (value: T, index: number, obj: T[]) => boolean, thisArg?: any): T | undefined;
  }
}
