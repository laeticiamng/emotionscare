
/**
 * Stratégies de cache avancées pour optimiser les performances
 */

interface CacheConfig {
  ttl: number; // Time to live en millisecondes
  maxSize: number; // Taille max du cache
  strategy: 'lru' | 'fifo' | 'lfu'; // Stratégie d'éviction
}

class AdvancedCache<T> {
  private cache = new Map<string, { data: T; timestamp: number; accessCount: number }>();
  private accessOrder: string[] = [];
  private config: CacheConfig;

  constructor(config: CacheConfig) {
    this.config = config;
  }

  set(key: string, data: T): void {
    const now = Date.now();
    
    // Nettoyer le cache si nécessaire
    this.cleanup();
    
    // Ajouter la nouvelle entrée
    this.cache.set(key, { data, timestamp: now, accessCount: 1 });
    this.updateAccessOrder(key);
    
    // Éviction si dépassement de taille
    while (this.cache.size > this.config.maxSize) {
      this.evict();
    }
  }

  get(key: string): T | null {
    const entry = this.cache.get(key);
    
    if (!entry) return null;
    
    // Vérifier TTL
    if (Date.now() - entry.timestamp > this.config.ttl) {
      this.cache.delete(key);
      return null;
    }
    
    // Mettre à jour les statistiques d'accès
    entry.accessCount++;
    this.updateAccessOrder(key);
    
    return entry.data;
  }

  private cleanup(): void {
    const now = Date.now();
    for (const [key, entry] of this.cache.entries()) {
      if (now - entry.timestamp > this.config.ttl) {
        this.cache.delete(key);
        this.removeFromAccessOrder(key);
      }
    }
  }

  private evict(): void {
    let keyToEvict: string;
    
    switch (this.config.strategy) {
      case 'lru':
        keyToEvict = this.accessOrder[0];
        break;
      case 'lfu':
        keyToEvict = Array.from(this.cache.entries())
          .sort(([,a], [,b]) => a.accessCount - b.accessCount)[0][0];
        break;
      case 'fifo':
      default:
        keyToEvict = this.cache.keys().next().value;
        break;
    }
    
    this.cache.delete(keyToEvict);
    this.removeFromAccessOrder(keyToEvict);
  }

  private updateAccessOrder(key: string): void {
    this.removeFromAccessOrder(key);
    this.accessOrder.push(key);
  }

  private removeFromAccessOrder(key: string): void {
    const index = this.accessOrder.indexOf(key);
    if (index > -1) {
      this.accessOrder.splice(index, 1);
    }
  }

  clear(): void {
    this.cache.clear();
    this.accessOrder = [];
  }

  size(): number {
    return this.cache.size;
  }
}

// Instances de cache spécialisées
export const apiCache = new AdvancedCache({
  ttl: 5 * 60 * 1000, // 5 minutes
  maxSize: 100,
  strategy: 'lru'
});

export const imageCache = new AdvancedCache({
  ttl: 30 * 60 * 1000, // 30 minutes
  maxSize: 50,
  strategy: 'lfu'
});

export const userDataCache = new AdvancedCache({
  ttl: 15 * 60 * 1000, // 15 minutes
  maxSize: 20,
  strategy: 'lru'
});

// Utilitaires de cache pour les hooks
export const withCache = <T extends (...args: any[]) => Promise<any>>(
  fn: T,
  cache: AdvancedCache<any>,
  keyGenerator: (...args: Parameters<T>) => string
): T => {
  return (async (...args: Parameters<T>) => {
    const key = keyGenerator(...args);
    
    // Vérifier le cache
    const cached = cache.get(key);
    if (cached) {
      return cached;
    }
    
    // Exécuter la fonction et mettre en cache
    const result = await fn(...args);
    cache.set(key, result);
    
    return result;
  }) as T;
};
