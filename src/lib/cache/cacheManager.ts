
interface CacheEntry<T> {
  data: T;
  timestamp: number;
  ttl: number;
  accessCount: number;
  lastAccess: number;
}

class CacheManager<T> {
  private cache = new Map<string, CacheEntry<T>>();
  private maxSize: number;
  private hits = 0;
  private misses = 0;

  constructor(maxSize: number = 500) {
    this.maxSize = maxSize;
  }

  set(key: string, data: T, ttl: number = 5 * 60 * 1000): void {
    // Nettoyer le cache si nécessaire
    this.evictExpired();
    
    if (this.cache.size >= this.maxSize) {
      this.evictLRU();
    }

    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      ttl,
      accessCount: 0,
      lastAccess: Date.now()
    });
  }

  get(key: string): T | null {
    const entry = this.cache.get(key);
    
    if (!entry) {
      this.misses++;
      return null;
    }

    // Vérifier l'expiration
    if (Date.now() - entry.timestamp > entry.ttl) {
      this.cache.delete(key);
      this.misses++;
      return null;
    }

    // Mettre à jour les statistiques d'accès
    entry.accessCount++;
    entry.lastAccess = Date.now();
    this.hits++;

    return entry.data;
  }

  has(key: string): boolean {
    return this.get(key) !== null;
  }

  delete(key: string): boolean {
    return this.cache.delete(key);
  }

  clear(): void {
    this.cache.clear();
    this.hits = 0;
    this.misses = 0;
  }

  // Nettoyage intelligent
  private evictExpired(): void {
    const now = Date.now();
    for (const [key, entry] of this.cache.entries()) {
      if (now - entry.timestamp > entry.ttl) {
        this.cache.delete(key);
      }
    }
  }

  private evictLRU(): void {
    let oldestKey = '';
    let oldestTime = Date.now();

    for (const [key, entry] of this.cache.entries()) {
      if (entry.lastAccess < oldestTime) {
        oldestTime = entry.lastAccess;
        oldestKey = key;
      }
    }

    if (oldestKey) {
      this.cache.delete(oldestKey);
    }
  }

  // Statistiques
  getStats() {
    const total = this.hits + this.misses;
    return {
      size: this.cache.size,
      maxSize: this.maxSize,
      hitRate: total > 0 ? this.hits / total : 0,
      hits: this.hits,
      misses: this.misses
    };
  }

  // Préchargement intelligent
  async preload(keys: Array<{ key: string; loader: () => Promise<T> }>, ttl?: number): Promise<void> {
    const promises = keys.map(async ({ key, loader }) => {
      if (!this.has(key)) {
        try {
          const data = await loader();
          this.set(key, data, ttl);
        } catch (error) {
          console.warn(`Failed to preload cache key: ${key}`, error);
        }
      }
    });

    await Promise.allSettled(promises);
  }
}

// Instances globales spécialisées
export const apiCache = new CacheManager<any>(200);
export const imageCache = new CacheManager<string>(100);
export const userCache = new CacheManager<any>(50);
export const staticCache = new CacheManager<any>(1000);

// Cache manager global unifié
export const globalCache = {
  api: apiCache,
  image: imageCache,
  user: userCache,
  static: staticCache,
  
  getStats() {
    return {
      api: apiCache.getStats(),
      image: imageCache.getStats(),
      user: userCache.getStats(),
      static: staticCache.getStats()
    };
  },

  clearAll() {
    apiCache.clear();
    imageCache.clear();
    userCache.clear();
    staticCache.clear();
  }
};
