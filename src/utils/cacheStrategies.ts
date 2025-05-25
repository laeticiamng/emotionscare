
/**
 * Stratégies de cache avancées pour optimiser les performances
 */

interface CacheEntry<T> {
  data: T;
  timestamp: number;
  ttl: number;
  accessCount: number;
  lastAccessed: number;
}

interface CacheStats {
  hits: number;
  misses: number;
  size: number;
  hitRate: number;
}

/**
 * Cache LRU (Least Recently Used) avec TTL
 */
export class LRUCache<T> {
  private cache = new Map<string, CacheEntry<T>>();
  private maxSize: number;
  private defaultTTL: number;
  private stats: CacheStats = { hits: 0, misses: 0, size: 0, hitRate: 0 };

  constructor(maxSize = 100, defaultTTL = 5 * 60 * 1000) {
    this.maxSize = maxSize;
    this.defaultTTL = defaultTTL;
  }

  set(key: string, data: T, customTTL?: number): void {
    const now = Date.now();
    const ttl = customTTL || this.defaultTTL;

    // Supprimer l'entrée existante pour la réinsérer en fin
    if (this.cache.has(key)) {
      this.cache.delete(key);
    }

    // Éviction LRU si le cache est plein
    if (this.cache.size >= this.maxSize) {
      const oldestKey = this.cache.keys().next().value;
      this.cache.delete(oldestKey);
    }

    this.cache.set(key, {
      data,
      timestamp: now,
      ttl,
      accessCount: 0,
      lastAccessed: now
    });

    this.updateStats();
  }

  get(key: string): T | null {
    const entry = this.cache.get(key);
    const now = Date.now();

    if (!entry) {
      this.stats.misses++;
      this.updateHitRate();
      return null;
    }

    // Vérifier l'expiration
    if (now - entry.timestamp > entry.ttl) {
      this.cache.delete(key);
      this.stats.misses++;
      this.updateHitRate();
      return null;
    }

    // Mettre à jour les statistiques d'accès
    entry.accessCount++;
    entry.lastAccessed = now;

    // Réorganiser pour LRU (supprimer et réinsérer)
    this.cache.delete(key);
    this.cache.set(key, entry);

    this.stats.hits++;
    this.updateHitRate();
    return entry.data;
  }

  has(key: string): boolean {
    return this.get(key) !== null;
  }

  delete(key: string): boolean {
    const result = this.cache.delete(key);
    this.updateStats();
    return result;
  }

  clear(): void {
    this.cache.clear();
    this.stats = { hits: 0, misses: 0, size: 0, hitRate: 0 };
  }

  getStats(): CacheStats {
    return { ...this.stats };
  }

  private updateStats(): void {
    this.stats.size = this.cache.size;
  }

  private updateHitRate(): void {
    const total = this.stats.hits + this.stats.misses;
    this.stats.hitRate = total > 0 ? this.stats.hits / total : 0;
  }

  // Nettoyage automatique des entrées expirées
  cleanup(): void {
    const now = Date.now();
    for (const [key, entry] of this.cache.entries()) {
      if (now - entry.timestamp > entry.ttl) {
        this.cache.delete(key);
      }
    }
    this.updateStats();
  }
}

/**
 * Cache global pour l'application
 */
export const apiCache = new LRUCache<any>(200, 5 * 60 * 1000); // 200 entrées, 5 min TTL

/**
 * Cache pour les images avec TTL plus long
 */
export const imageCache = new LRUCache<string>(50, 30 * 60 * 1000); // 50 images, 30 min TTL

/**
 * Cache pour les données utilisateur
 */
export const userCache = new LRUCache<any>(100, 10 * 60 * 1000); // 100 utilisateurs, 10 min TTL

/**
 * Wrapper pour cache avec fallback
 */
export function withCache<T>(
  fetchFn: () => Promise<T>,
  cache: LRUCache<T>,
  keyGenerator: () => string,
  ttl?: number
) {
  return async (): Promise<T> => {
    const key = keyGenerator();
    
    // Tenter de récupérer du cache
    const cached = cache.get(key);
    if (cached !== null) {
      return cached;
    }

    // Fetcher et mettre en cache
    try {
      const data = await fetchFn();
      cache.set(key, data, ttl);
      return data;
    } catch (error) {
      // En cas d'erreur, ne pas mettre en cache
      throw error;
    }
  };
}

/**
 * Nettoyage automatique des caches
 */
setInterval(() => {
  apiCache.cleanup();
  imageCache.cleanup();
  userCache.cleanup();
}, 2 * 60 * 1000); // Nettoyage toutes les 2 minutes

/**
 * Statistiques des caches (développement)
 */
if (import.meta.env.DEV) {
  (window as any).getCacheStats = () => ({
    api: apiCache.getStats(),
    image: imageCache.getStats(),
    user: userCache.getStats()
  });
}
