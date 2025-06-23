
interface CacheItem<T> {
  data: T;
  timestamp: number;
  ttl: number;
  accessCount: number;
  lastAccess: number;
}

class LRUCache<T> {
  private cache = new Map<string, CacheItem<T>>();
  private maxSize: number;
  private defaultTTL: number;

  constructor(maxSize = 100, defaultTTL = 5 * 60 * 1000) { // 5 minutes par défaut
    this.maxSize = maxSize;
    this.defaultTTL = defaultTTL;
  }

  set(key: string, data: T, ttl = this.defaultTTL): void {
    // Supprimer l'ancienne entrée si elle existe
    if (this.cache.has(key)) {
      this.cache.delete(key);
    }

    // Si le cache est plein, supprimer l'élément le moins récemment utilisé
    if (this.cache.size >= this.maxSize) {
      const lruKey = this.findLRU();
      if (lruKey) {
        this.cache.delete(lruKey);
      }
    }

    const now = Date.now();
    this.cache.set(key, {
      data,
      timestamp: now,
      ttl,
      accessCount: 1,
      lastAccess: now
    });
  }

  get(key: string): T | null {
    const item = this.cache.get(key);
    if (!item) return null;

    const now = Date.now();
    
    // Vérifier si l'élément a expiré
    if (now - item.timestamp > item.ttl) {
      this.cache.delete(key);
      return null;
    }

    // Mettre à jour les statistiques d'accès
    item.accessCount++;
    item.lastAccess = now;

    return item.data;
  }

  has(key: string): boolean {
    return this.get(key) !== null;
  }

  delete(key: string): boolean {
    return this.cache.delete(key);
  }

  clear(): void {
    this.cache.clear();
  }

  size(): number {
    return this.cache.size;
  }

  private findLRU(): string | null {
    let lruKey: string | null = null;
    let oldestTime = Date.now();

    for (const [key, item] of this.cache.entries()) {
      if (item.lastAccess < oldestTime) {
        oldestTime = item.lastAccess;
        lruKey = key;
      }
    }

    return lruKey;
  }

  getStats() {
    const items = Array.from(this.cache.values());
    return {
      size: this.cache.size,
      maxSize: this.maxSize,
      hitRate: items.reduce((sum, item) => sum + item.accessCount, 0),
      averageAge: items.length > 0 
        ? items.reduce((sum, item) => sum + (Date.now() - item.timestamp), 0) / items.length 
        : 0
    };
  }
}

// Cache Manager avec différents types de cache
class CacheManager {
  private apiCache = new LRUCache<any>(50, 2 * 60 * 1000); // 2 minutes pour l'API
  private imageCache = new LRUCache<string>(200, 30 * 60 * 1000); // 30 minutes pour les images
  private userCache = new LRUCache<any>(20, 15 * 60 * 1000); // 15 minutes pour les données utilisateur
  private staticCache = new LRUCache<any>(100, 60 * 60 * 1000); // 1 heure pour le contenu statique

  // API Cache
  setApiData(key: string, data: any, ttl?: number): void {
    this.apiCache.set(key, data, ttl);
  }

  getApiData(key: string): any | null {
    return this.apiCache.get(key);
  }

  // Image Cache
  setImage(url: string, data: string): void {
    this.imageCache.set(url, data);
  }

  getImage(url: string): string | null {
    return this.imageCache.get(url);
  }

  // User Data Cache
  setUserData(userId: string, data: any): void {
    this.userCache.set(userId, data);
  }

  getUserData(userId: string): any | null {
    return this.userCache.get(userId);
  }

  // Static Content Cache
  setStaticContent(key: string, data: any): void {
    this.staticCache.set(key, data);
  }

  getStaticContent(key: string): any | null {
    return this.staticCache.get(key);
  }

  // Méthodes utilitaires
  clearAll(): void {
    this.apiCache.clear();
    this.imageCache.clear();
    this.userCache.clear();
    this.staticCache.clear();
  }

  getGlobalStats() {
    return {
      api: this.apiCache.getStats(),
      images: this.imageCache.getStats(),
      user: this.userCache.getStats(),
      static: this.staticCache.getStats()
    };
  }

  // Préchargement intelligent basé sur les patterns d'utilisation
  preloadCriticalData(keys: string[]): Promise<void[]> {
    const promises = keys.map(async (key) => {
      if (!this.apiCache.has(key)) {
        // Simuler le chargement de données critiques
        await new Promise(resolve => setTimeout(resolve, 10));
      }
    });

    return Promise.all(promises);
  }
}

export const cacheManager = new CacheManager();
export { LRUCache };
