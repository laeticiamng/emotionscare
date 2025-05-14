
// Polyfill for Array.prototype.findLast
if (!Array.prototype.findLast) {
  Array.prototype.findLast = function(predicate: (value: any, index: number, obj: any[]) => unknown) {
    if (this == null) {
      throw new TypeError('Array.prototype.findLast called on null or undefined');
    }
    if (typeof predicate !== 'function') {
      throw new TypeError('predicate must be a function');
    }
    
    const array = Object(this);
    let length = array.length >>> 0;
    
    while (length--) {
      const value = array[length];
      if (predicate(value, length, array)) {
        return value;
      }
    }
    
    return undefined;
  };
}

// Add declarations to TypeScript
declare global {
  interface Array<T> {
    findLast(predicate: (value: T, index: number, obj: T[]) => unknown): T | undefined;
  }
}

export {};
