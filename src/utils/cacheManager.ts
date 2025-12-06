interface CacheItem<T = any> {
  data: T;
  timestamp: number;
  ttl: number;
}

interface CacheStats {
  size: number;
  hits: number;
  misses: number;
  hitRate: number;
  memory: number;
}

class CacheManager {
  private cache = new Map<string, CacheItem>();
  private stats = {
    hits: 0,
    misses: 0
  };

  set<T>(key: string, data: T, ttl: number = 300000): void { // 5 min par défaut
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      ttl
    });
  }

  get<T>(key: string): T | null {
    const item = this.cache.get(key);
    
    if (!item) {
      this.stats.misses++;
      return null;
    }

    const now = Date.now();
    if (now - item.timestamp > item.ttl) {
      this.cache.delete(key);
      this.stats.misses++;
      return null;
    }

    this.stats.hits++;
    return item.data;
  }

  has(key: string): boolean {
    const item = this.cache.get(key);
    if (!item) return false;
    
    const now = Date.now();
    if (now - item.timestamp > item.ttl) {
      this.cache.delete(key);
      return false;
    }
    
    return true;
  }

  delete(key: string): boolean {
    return this.cache.delete(key);
  }

  clear(): void {
    this.cache.clear();
    this.stats.hits = 0;
    this.stats.misses = 0;
  }

  getStats(): CacheStats {
    const total = this.stats.hits + this.stats.misses;
    const hitRate = total > 0 ? (this.stats.hits / total) * 100 : 0;
    
    // Estimation de la mémoire utilisée
    let memory = 0;
    for (const [key, value] of this.cache) {
      memory += key.length * 2; // String chars = 2 bytes each
      memory += JSON.stringify(value.data).length * 2;
      memory += 24; // Overhead timestamp + ttl
    }

    return {
      size: this.cache.size,
      hits: this.stats.hits,
      misses: this.stats.misses,
      hitRate: Math.round(hitRate * 100) / 100,
      memory: Math.round(memory / 1024) // KB
    };
  }

  // Cache avec fonction de récupération
  async remember<T>(
    key: string, 
    fetcher: () => Promise<T>, 
    ttl: number = 300000
  ): Promise<T> {
    const cached = this.get<T>(key);
    if (cached !== null) {
      return cached;
    }

    const data = await fetcher();
    this.set(key, data, ttl);
    return data;
  }

  // Nettoyage automatique des entrées expirées
  cleanup(): void {
    const now = Date.now();
    for (const [key, item] of this.cache) {
      if (now - item.timestamp > item.ttl) {
        this.cache.delete(key);
      }
    }
  }
}

export const cacheManager = new CacheManager();

// Nettoyage automatique toutes les 5 minutes
if (typeof window !== 'undefined') {
  setInterval(() => {
    cacheManager.cleanup();
  }, 300000);
}