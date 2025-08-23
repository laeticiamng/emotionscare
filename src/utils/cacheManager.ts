import React from 'react';

interface CacheItem<T> {
  data: T;
  timestamp: number;
  ttl: number;
  accessCount: number;
  lastAccessed: number;
}

/**
 * Gestionnaire de cache ultra-optimisé avec LRU et analytics
 */
class OptimizedCacheManager {
  private cache = new Map<string, CacheItem<any>>();
  private maxSize: number;
  private hitCount = 0;
  private missCount = 0;
  private cleanupInterval: NodeJS.Timeout | null = null;

  constructor(maxSize: number = 100) {
    this.maxSize = maxSize;
    this.startPeriodicCleanup();
  }

  /**
   * Ajouter un élément au cache avec optimisation LRU
   */
  set<T>(key: string, data: T, ttlMinutes: number = 5): void {
    const now = Date.now();
    
    // Nettoyer si nécessaire avant d'ajouter
    this.evictIfNeeded();

    const cacheItem: CacheItem<T> = {
      data,
      timestamp: now,
      ttl: ttlMinutes * 60 * 1000,
      accessCount: 0,
      lastAccessed: now
    };

    this.cache.set(key, cacheItem);
  }

  /**
   * Récupérer un élément du cache avec comptage d'accès
   */
  get<T>(key: string): T | null {
    const item = this.cache.get(key);
    
    if (!item) {
      this.missCount++;
      return null;
    }

    const now = Date.now();
    
    // Vérifier expiration
    if (now - item.timestamp > item.ttl) {
      this.cache.delete(key);
      this.missCount++;
      return null;
    }

    // Mettre à jour les statistiques d'accès
    item.accessCount++;
    item.lastAccessed = now;
    this.hitCount++;
    
    return item.data as T;
  }

  /**
   * Supprimer avec nettoyage intelligent
   */
  delete(key: string): boolean {
    return this.cache.delete(key);
  }

  /**
   * Éviction intelligente basée sur LRU et fréquence d'usage
   */
  private evictIfNeeded(): void {
    if (this.cache.size < this.maxSize) return;

    const now = Date.now();
    const entries = Array.from(this.cache.entries());
    
    // Trier par score (combinaison de récence et fréquence)
    entries.sort((a, b) => {
      const scoreA = this.calculateEvictionScore(a[1], now);
      const scoreB = this.calculateEvictionScore(b[1], now);
      return scoreA - scoreB; // Score plus bas = candidat à l'éviction
    });

    // Supprimer les 25% les moins utilisés
    const toEvict = Math.floor(entries.length * 0.25);
    for (let i = 0; i < toEvict; i++) {
      this.cache.delete(entries[i][0]);
    }
  }

  /**
   * Calculer le score d'éviction (plus bas = plus susceptible d'être évincé)
   */
  private calculateEvictionScore(item: CacheItem<any>, now: number): number {
    const age = now - item.timestamp;
    const recentAccess = now - item.lastAccessed;
    const frequency = item.accessCount;
    
    // Score basé sur la récence d'accès et la fréquence d'utilisation
    return (frequency + 1) * 1000 - recentAccess - age * 0.1;
  }

  /**
   * Nettoyage automatique des éléments expirés
   */
  private cleanup(): void {
    const now = Date.now();
    const keysToDelete: string[] = [];

    this.cache.forEach((item, key) => {
      if (now - item.timestamp > item.ttl) {
        keysToDelete.push(key);
      }
    });

    keysToDelete.forEach(key => this.cache.delete(key));
  }

  /**
   * Démarrer le nettoyage périodique
   */
  private startPeriodicCleanup(): void {
    this.cleanupInterval = setInterval(() => {
      this.cleanup();
    }, 5 * 60 * 1000); // Toutes les 5 minutes
  }

  /**
   * Arrêter le nettoyage périodique
   */
  stopPeriodicCleanup(): void {
    if (this.cleanupInterval) {
      clearInterval(this.cleanupInterval);
      this.cleanupInterval = null;
    }
  }

  /**
   * Vider complètement le cache
   */
  clear(): void {
    this.cache.clear();
    this.hitCount = 0;
    this.missCount = 0;
  }

  /**
   * Précharger des données avec priorité
   */
  async preload(key: string, dataLoader: () => Promise<any>, ttlMinutes: number = 10, priority: 'low' | 'high' = 'low'): Promise<void> {
    try {
      const data = await dataLoader();
      this.set(key, data, ttlMinutes);
      
      // Si priorité haute, augmenter artificiellement le count d'accès
      if (priority === 'high') {
        const item = this.cache.get(key);
        if (item) {
          item.accessCount = 10; // Priorité élevée
        }
      }
      
    } catch (error) {
      console.warn(`Failed to preload cache for: ${key}`, error);
    }
  }

  /**
   * Obtenir les statistiques détaillées du cache
   */
  getStats() {
    const totalAccess = this.hitCount + this.missCount;
    const hitRate = totalAccess > 0 ? (this.hitCount / totalAccess) * 100 : 0;
    
    return {
      size: this.cache.size,
      maxSize: this.maxSize,
      hitCount: this.hitCount,
      missCount: this.missCount,
      hitRate: Math.round(hitRate * 100) / 100,
      keys: Array.from(this.cache.keys()),
      memoryUsage: this.estimateMemoryUsage()
    };
  }

  /**
   * Estimer l'utilisation mémoire du cache
   */
  private estimateMemoryUsage(): number {
    let totalSize = 0;
    
    this.cache.forEach((item, key) => {
      totalSize += key.length * 2; // char = 2 bytes
      totalSize += JSON.stringify(item.data).length * 2;
      totalSize += 64; // metadata overhead estimé
    });
    
    return Math.round(totalSize / 1024); // Retourner en KB
  }

  /**
   * Méthodes pour compatibilité avec l'ancien CacheManager
   */
  clearAll(): void {
    this.clear();
  }

  getGlobalStats() {
    return this.getStats();
  }
}

// Instance globale optimisée
export const cacheManager = new OptimizedCacheManager(100);

/**
 * Hook React optimisé pour utiliser le cache avec retry et fallback
 */
export const useOptimizedCache = <T>(
  key: string, 
  dataLoader: () => Promise<T>, 
  options: {
    ttlMinutes?: number;
    retryCount?: number;
    fallbackValue?: T;
    enabled?: boolean;
  } = {}
) => {
  const { 
    ttlMinutes = 5, 
    retryCount = 1, 
    fallbackValue = null,
    enabled = true 
  } = options;
  
  const [data, setData] = React.useState<T | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<Error | null>(null);
  const [retryAttempts, setRetryAttempts] = React.useState(0);

  React.useEffect(() => {
    if (!enabled) {
      setLoading(false);
      return;
    }

    const loadData = async (attempt: number = 0) => {
      try {
        setLoading(true);
        setError(null);

        // Vérifier le cache d'abord
        const cachedData = cacheManager.get<T>(key);
        if (cachedData) {
          setData(cachedData);
          setLoading(false);
          return;
        }

        // Charger les données si pas en cache
        const freshData = await dataLoader();
        cacheManager.set(key, freshData, ttlMinutes);
        setData(freshData);
        setRetryAttempts(0);
        
      } catch (err) {
        const error = err as Error;
        setError(error);
        
        // Retry logic
        if (attempt < retryCount) {
          console.warn(`Retry attempt ${attempt + 1} for key: ${key}`);
          setTimeout(() => {
            loadData(attempt + 1);
          }, 1000 * (attempt + 1)); // Exponential backoff
          setRetryAttempts(attempt + 1);
        } else {
          // Utiliser la valeur de fallback si disponible
          if (fallbackValue !== null) {
            setData(fallbackValue);
          }
        }
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [key, ttlMinutes, enabled]);

  const refetch = React.useCallback(async () => {
    cacheManager.delete(key);
    try {
      const freshData = await dataLoader();
      cacheManager.set(key, freshData, ttlMinutes);
      setData(freshData);
      setError(null);
    } catch (err) {
      setError(err as Error);
    }
  }, [key, dataLoader, ttlMinutes]);

  return { 
    data, 
    loading, 
    error, 
    refetch, 
    retryAttempts,
    isFromCache: !loading && !error && data !== null
  };
};

// Nettoyage automatique à la fermeture de la page
if (typeof window !== 'undefined') {
  window.addEventListener('beforeunload', () => {
    cacheManager.stopPeriodicCleanup();
  });
}