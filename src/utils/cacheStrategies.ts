
/**
 * Stratégies de cache optimisées pour l'application
 */

interface CacheEntry<T> {
  data: T;
  timestamp: number;
  ttl: number;
}

/**
 * Cache LRU simple et efficace
 */
export class LRUCache<T> {
  private cache = new Map<string, CacheEntry<T>>();
  private maxSize: number;

  constructor(maxSize: number = 100) {
    this.maxSize = maxSize;
  }

  set(key: string, data: T, ttl: number = 5 * 60 * 1000): void {
    // Nettoyer le cache si plein
    if (this.cache.size >= this.maxSize) {
      const firstKey = this.cache.keys().next().value;
      this.cache.delete(firstKey);
    }

    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      ttl
    });
  }

  get(key: string): T | null {
    const entry = this.cache.get(key);
    if (!entry) return null;

    // Vérifier TTL
    if (Date.now() - entry.timestamp > entry.ttl) {
      this.cache.delete(key);
      return null;
    }

    // Déplacer à la fin (LRU)
    this.cache.delete(key);
    this.cache.set(key, entry);
    
    return entry.data;
  }

  has(key: string): boolean {
    return this.get(key) !== null;
  }

  clear(): void {
    this.cache.clear();
  }

  size(): number {
    return this.cache.size;
  }
}

/**
 * Cache API global
 */
export const apiCache = new LRUCache<any>(200);

/**
 * Wrapper de cache pour fonctions
 */
export function withCache<T>(
  fn: () => Promise<T>,
  cache: LRUCache<T>,
  keyFn: () => string,
  ttl?: number
): () => Promise<T> {
  return async () => {
    const key = keyFn();
    const cached = cache.get(key);
    
    if (cached !== null) {
      return cached;
    }

    const result = await fn();
    cache.set(key, result, ttl);
    return result;
  };
}

/**
 * Cache pour les requêtes utilisateur
 */
export const userCache = new LRUCache<any>(50);

/**
 * Cache pour les données statiques
 */
export const staticCache = new LRUCache<any>(500);
