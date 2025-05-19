
/**
 * Polyfill pour Array.prototype.findLast
 * Notez que cela n'est pas nécessaire en ES2023 et versions ultérieures
 */
if (!Array.prototype.findLast) {
  Array.prototype.findLast = function<T>(
    predicate: (value: T, index: number, obj: T[]) => boolean,
    thisArg?: any
  ): T | undefined {
    for (let i = this.length - 1; i >= 0; i--) {
      if (predicate.call(thisArg, this[i], i, this as any)) {
        return this[i];
      }
    }
    return undefined;
  };
}

/**
 * Autres polyfills pour la rétro-compatibilité peuvent être ajoutés ici
 */
