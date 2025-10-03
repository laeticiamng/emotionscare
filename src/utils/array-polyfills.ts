
// Polyfill for Array.findLast
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

// Export empty object to make this a module
export {};
