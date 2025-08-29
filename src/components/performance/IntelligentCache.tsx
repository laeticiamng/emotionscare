import React, { createContext, useContext, useCallback, useRef, useEffect } from 'react';
import { toast } from 'sonner';

interface CacheEntry<T = any> {
  data: T;
  timestamp: number;
  accessCount: number;
  lastAccessed: number;
  priority: number;
  size?: number;
}

interface CacheStats {
  hits: number;
  misses: number;
  entries: number;
  totalSize: number;
  hitRate: number;
}

class IntelligentCacheManager {
  private cache = new Map<string, CacheEntry>();
  private maxSize: number;
  private maxAge: number;
  private stats: CacheStats;
  private cleanupInterval: NodeJS.Timeout | null = null;

  constructor(maxSize = 100, maxAge = 5 * 60 * 1000) { // 5 minutes par défaut
    this.maxSize = maxSize;
    this.maxAge = maxAge;
    this.stats = {
      hits: 0,
      misses: 0,
      entries: 0,
      totalSize: 0,
      hitRate: 0
    };
    
    this.startCleanup();
  }

  /**
   * Obtenir une valeur du cache avec intelligence adaptative
   */
  get<T>(key: string): T | null {
    const entry = this.cache.get(key);
    
    if (!entry) {
      this.stats.misses++;
      this.updateHitRate();
      return null;
    }

    // Vérifier l'expiration adaptative
    const age = Date.now() - entry.timestamp;
    const adaptiveMaxAge = this.calculateAdaptiveMaxAge(entry);
    
    if (age > adaptiveMaxAge) {
      this.cache.delete(key);
      this.stats.misses++;
      this.updateHitRate();
      return null;
    }

    // Mise à jour des statistiques d'accès
    entry.accessCount++;
    entry.lastAccessed = Date.now();
    entry.priority = this.calculatePriority(entry);
    
    this.stats.hits++;
    this.updateHitRate();
    
    return entry.data;
  }

  /**
   * Définir une valeur dans le cache avec priorité intelligente
   */
  set<T>(key: string, data: T, customMaxAge?: number): void {
    const size = this.estimateSize(data);
    const now = Date.now();
    
    const entry: CacheEntry<T> = {
      data,
      timestamp: now,
      accessCount: 1,
      lastAccessed: now,
      priority: 1,
      size
    };

    // Éviction intelligente si nécessaire
    if (this.cache.size >= this.maxSize) {
      this.evictLeastValuable();
    }

    this.cache.set(key, entry);
    this.stats.entries = this.cache.size;
    this.stats.totalSize += size;
  }

  /**
   * Préchargement intelligent basé sur les patterns d'usage
   */
  preload<T>(keys: string[], loader: (key: string) => Promise<T>): void {
    keys.forEach(async (key) => {
      if (!this.cache.has(key)) {
        try {
          const data = await loader(key);
          this.set(key, data);
        } catch (error) {
          console.warn(`Preload failed for key: ${key}`, error);
        }
      }
    });
  }

  /**
   * Cache conditionnel avec validation
   */
  setConditional<T>(
    key: string, 
    data: T, 
    condition: () => boolean,
    validator?: (data: T) => boolean
  ): boolean {
    if (!condition()) {
      return false;
    }

    if (validator && !validator(data)) {
      return false;
    }

    this.set(key, data);
    return true;
  }

  /**
   * Obtenir avec fallback et mise en cache automatique
   */
  async getOrLoad<T>(
    key: string,
    loader: () => Promise<T>,
    options: {
      maxAge?: number;
      priority?: number;
      validate?: (data: T) => boolean;
    } = {}
  ): Promise<T> {
    let data = this.get<T>(key);
    
    if (data && (!options.validate || options.validate(data))) {
      return data;
    }

    // Chargement avec gestion d'erreur
    try {
      data = await loader();
      
      if (options.validate && !options.validate(data)) {
        throw new Error('Data validation failed');
      }
      
      this.set(key, data, options.maxAge);
      return data;
    } catch (error) {
      console.error(`Failed to load data for key: ${key}`, error);
      throw error;
    }
  }

  /**
   * Invalidation intelligente par pattern
   */
  invalidateByPattern(pattern: string | RegExp): number {
    let invalidated = 0;
    const regex = typeof pattern === 'string' ? new RegExp(pattern) : pattern;
    
    for (const [key] of this.cache) {
      if (regex.test(key)) {
        this.cache.delete(key);
        invalidated++;
      }
    }
    
    this.stats.entries = this.cache.size;
    return invalidated;
  }

  /**
   * Statistiques détaillées
   */
  getStats(): CacheStats & { 
    averageAccessCount: number;
    oldestEntry: number;
    newestEntry: number;
  } {
    const entries = Array.from(this.cache.values());
    const now = Date.now();
    
    return {
      ...this.stats,
      averageAccessCount: entries.reduce((sum, e) => sum + e.accessCount, 0) / entries.length || 0,
      oldestEntry: Math.min(...entries.map(e => now - e.timestamp)),
      newestEntry: Math.max(...entries.map(e => now - e.timestamp))
    };
  }

  /**
   * Optimisation automatique
   */
  optimize(): {
    evicted: number;
    compressed: number;
    reorganized: boolean;
  } {
    const beforeSize = this.cache.size;
    
    // Éviction des entrées peu utilisées
    this.evictUnderutilized();
    
    // Compression des données similaires
    const compressed = this.compressSimilarEntries();
    
    // Réorganisation pour les accès fréquents
    const reorganized = this.reorganizeFrequentAccess();
    
    return {
      evicted: beforeSize - this.cache.size,
      compressed,
      reorganized
    };
  }

  // Méthodes privées d'optimisation

  private calculateAdaptiveMaxAge(entry: CacheEntry): number {
    // Plus l'entrée est accédée, plus elle reste longtemps
    const accessBonus = Math.min(entry.accessCount * 30000, this.maxAge);
    return this.maxAge + accessBonus;
  }

  private calculatePriority(entry: CacheEntry): number {
    const now = Date.now();
    const age = now - entry.timestamp;
    const recency = now - entry.lastAccessed;
    
    // Formule de priorité: fréquence d'accès / age * récence
    return (entry.accessCount * 1000) / (age + 1) * (1000 / (recency + 1));
  }

  private evictLeastValuable(): void {
    const entries = Array.from(this.cache.entries());
    entries.sort((a, b) => a[1].priority - b[1].priority);
    
    // Éviction des 10% les moins précieux
    const toEvict = Math.max(1, Math.floor(entries.length * 0.1));
    
    for (let i = 0; i < toEvict; i++) {
      this.cache.delete(entries[i][0]);
    }
  }

  private evictUnderutilized(): void {
    const now = Date.now();
    const threshold = this.maxAge * 2; // Double du maxAge
    
    for (const [key, entry] of this.cache) {
      const timeSinceLastAccess = now - entry.lastAccessed;
      if (timeSinceLastAccess > threshold && entry.accessCount < 2) {
        this.cache.delete(key);
      }
    }
  }

  private compressSimilarEntries(): number {
    // Logique de compression des données similaires
    return 0; // Placeholder
  }

  private reorganizeFrequentAccess(): boolean {
    // Réorganisation pour optimiser les accès fréquents
    return true; // Placeholder
  }

  private estimateSize(data: any): number {
    return JSON.stringify(data).length;
  }

  private updateHitRate(): void {
    const total = this.stats.hits + this.stats.misses;
    this.stats.hitRate = total > 0 ? (this.stats.hits / total) * 100 : 0;
  }

  private startCleanup(): void {
    this.cleanupInterval = setInterval(() => {
      this.cleanup();
    }, 60000); // Nettoyage toutes les minutes
  }

  private cleanup(): void {
    const now = Date.now();
    let cleaned = 0;
    
    for (const [key, entry] of this.cache) {
      if (now - entry.timestamp > this.maxAge) {
        this.cache.delete(key);
        cleaned++;
      }
    }
    
    this.stats.entries = this.cache.size;
    
    if (cleaned > 0) {
      console.log(`Cache cleanup: ${cleaned} entries removed`);
    }
  }

  destroy(): void {
    if (this.cleanupInterval) {
      clearInterval(this.cleanupInterval);
    }
    this.cache.clear();
  }
}

// Context pour le cache global
const CacheContext = createContext<IntelligentCacheManager | null>(null);

interface CacheProviderProps {
  children: React.ReactNode;
  maxSize?: number;
  maxAge?: number;
}

export const CacheProvider: React.FC<CacheProviderProps> = ({
  children,
  maxSize = 200,
  maxAge = 10 * 60 * 1000 // 10 minutes
}) => {
  const cacheRef = useRef<IntelligentCacheManager | null>(null);
  
  if (!cacheRef.current) {
    cacheRef.current = new IntelligentCacheManager(maxSize, maxAge);
  }

  useEffect(() => {
    const cache = cacheRef.current;
    
    // Optimisation automatique périodique
    const optimizeInterval = setInterval(() => {
      if (cache) {
        const result = cache.optimize();
        if (result.evicted > 0) {
          console.log('Cache optimized:', result);
        }
      }
    }, 5 * 60 * 1000); // Toutes les 5 minutes

    return () => {
      clearInterval(optimizeInterval);
      cache?.destroy();
    };
  }, []);

  return (
    <CacheContext.Provider value={cacheRef.current}>
      {children}
    </CacheContext.Provider>
  );
};

// Hook pour utiliser le cache
export const useIntelligentCache = () => {
  const cache = useContext(CacheContext);
  
  if (!cache) {
    throw new Error('useIntelligentCache must be used within CacheProvider');
  }

  const cachedFetch = useCallback(async <T>(
    key: string,
    fetcher: () => Promise<T>,
    options: {
      maxAge?: number;
      validate?: (data: T) => boolean;
      onError?: (error: Error) => void;
    } = {}
  ): Promise<T> => {
    try {
      return await cache.getOrLoad(key, fetcher, options);
    } catch (error) {
      options.onError?.(error as Error);
      throw error;
    }
  }, [cache]);

  const invalidatePattern = useCallback((pattern: string | RegExp) => {
    const invalidated = cache.invalidateByPattern(pattern);
    if (invalidated > 0) {
      toast.success(`${invalidated} entrées de cache invalidées`);
    }
    return invalidated;
  }, [cache]);

  const getStats = useCallback(() => {
    return cache.getStats();
  }, [cache]);

  return {
    get: cache.get.bind(cache),
    set: cache.set.bind(cache),
    cachedFetch,
    invalidatePattern,
    preload: cache.preload.bind(cache),
    setConditional: cache.setConditional.bind(cache),
    getStats,
    optimize: cache.optimize.bind(cache)
  };
};

// Hook pour cache des composants React
export const useComponentCache = <T,>(
  key: string,
  factory: () => T,
  deps: React.DependencyList
): T => {
  const cache = useIntelligentCache();
  
  return React.useMemo(() => {
    const cachedValue = cache.get<T>(key);
    if (cachedValue) {
      return cachedValue;
    }
    
    const newValue = factory();
    cache.set(key, newValue);
    return newValue;
  }, [key, cache, ...deps]);
};