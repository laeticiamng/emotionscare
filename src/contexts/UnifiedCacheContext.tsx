/**
 * CACHE CONTEXT UNIFIÉ - EmotionsCare
 * Fusion optimisée des trois versions de cache existantes
 */

import React, { createContext, useContext, useCallback, useRef, useEffect, useState, ReactNode } from 'react';

// Types unifiés
export type CacheKey = string;
export type CacheValue = any;

export interface CacheEntry<T = any> {
  value: T;
  timestamp: number;
  ttl: number;
  accessCount: number;
  lastAccessed: number;
  priority: number;
  tags?: string[];
  size?: number;
}

export interface CacheStats {
  hits: number;
  misses: number;
  entries: number;
  totalSize: number;
  hitRate: number;
}

export interface CacheContextType {
  // Operations de base
  get: <T>(key: CacheKey) => T | null;
  set: <T>(key: CacheKey, value: T, ttl?: number, tags?: string[]) => void;
  has: (key: CacheKey) => boolean;
  delete: (key: CacheKey) => boolean;
  clear: () => void;
  
  // Operations avancées
  invalidateByTag: (tag: string) => void;
  cleanup: () => void;
  size: () => number;
  getStats: () => CacheStats;
  
  // Persistence
  persist: () => void;
  restore: () => void;
}

// Configuration
const DEFAULT_TTL = 5 * 60 * 1000; // 5 minutes
const MAX_CACHE_SIZE = 1000;
const STORAGE_KEY = 'emotionscare-unified-cache';

// Cache Manager unifié
class UnifiedCacheManager {
  private cache = new Map<CacheKey, CacheEntry>();
  private stats: CacheStats = {
    hits: 0,
    misses: 0,
    entries: 0,
    totalSize: 0,
    hitRate: 0
  };

  constructor(private maxSize = MAX_CACHE_SIZE, private defaultTtl = DEFAULT_TTL) {}

  private isValid(entry: CacheEntry): boolean {
    return Date.now() - entry.timestamp < entry.ttl;
  }

  private updateStats() {
    this.stats.entries = this.cache.size;
    this.stats.totalSize = Array.from(this.cache.values())
      .reduce((total, entry) => total + (entry.size || 0), 0);
    
    const total = this.stats.hits + this.stats.misses;
    this.stats.hitRate = total > 0 ? this.stats.hits / total : 0;
  }

  private evictIfNeeded() {
    if (this.cache.size < this.maxSize) return;

    // Stratégie LFU + LRU combinée
    const entries = Array.from(this.cache.entries());
    entries.sort(([, a], [, b]) => {
      // Trier par priority d'abord, puis par accessCount, puis par lastAccessed
      if (a.priority !== b.priority) return a.priority - b.priority;
      if (a.accessCount !== b.accessCount) return a.accessCount - b.accessCount;
      return a.lastAccessed - b.lastAccessed;
    });

    // Supprimer 10% des entrées les moins utilisées
    const toRemove = Math.ceil(this.maxSize * 0.1);
    for (let i = 0; i < toRemove && i < entries.length; i++) {
      this.cache.delete(entries[i][0]);
    }
  }

  get<T>(key: CacheKey): T | null {
    const entry = this.cache.get(key);
    
    if (!entry) {
      this.stats.misses++;
      this.updateStats();
      return null;
    }

    if (!this.isValid(entry)) {
      this.cache.delete(key);
      this.stats.misses++;
      this.updateStats();
      return null;
    }

    // Mettre à jour les stats d'accès
    entry.accessCount++;
    entry.lastAccessed = Date.now();
    entry.priority = Math.min(entry.priority + 1, 10); // Max priority 10

    this.stats.hits++;
    this.updateStats();

    return entry.value as T;
  }

  set<T>(key: CacheKey, value: T, ttl = this.defaultTtl, tags: string[] = []): void {
    this.evictIfNeeded();

    const now = Date.now();
    const entry: CacheEntry<T> = {
      value,
      timestamp: now,
      ttl,
      accessCount: 1,
      lastAccessed: now,
      priority: 1,
      tags,
      size: this.estimateSize(value)
    };

    this.cache.set(key, entry);
    this.updateStats();
  }

  private estimateSize(value: any): number {
    try {
      return JSON.stringify(value).length;
    } catch {
      return 0;
    }
  }

  has(key: CacheKey): boolean {
    const entry = this.cache.get(key);
    return entry ? this.isValid(entry) : false;
  }

  delete(key: CacheKey): boolean {
    const deleted = this.cache.delete(key);
    if (deleted) this.updateStats();
    return deleted;
  }

  clear(): void {
    this.cache.clear();
    this.stats = {
      hits: 0,
      misses: 0,
      entries: 0,
      totalSize: 0,
      hitRate: 0
    };
  }

  invalidateByTag(tag: string): void {
    for (const [key, entry] of this.cache) {
      if (entry.tags?.includes(tag)) {
        this.cache.delete(key);
      }
    }
    this.updateStats();
  }

  cleanup(): void {
    for (const [key, entry] of this.cache) {
      if (!this.isValid(entry)) {
        this.cache.delete(key);
      }
    }
    this.updateStats();
  }

  size(): number {
    return this.cache.size;
  }

  getStats(): CacheStats {
    return { ...this.stats };
  }

  persist(): void {
    try {
      const entries = Array.from(this.cache.entries());
      const data = { entries, stats: this.stats };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch (error) {
      console.warn('Failed to persist cache:', error);
    }
  }

  restore(): void {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (!stored) return;

      const { entries, stats } = JSON.parse(stored);
      
      // Restaurer les entrées valides uniquement
      const validEntries = entries.filter(([, entry]: [string, CacheEntry]) => 
        this.isValid(entry)
      );

      this.cache = new Map(validEntries);
      this.stats = stats || this.stats;
      this.updateStats();
    } catch (error) {
      console.warn('Failed to restore cache:', error);
    }
  }
}

// Context
const UnifiedCacheContext = createContext<CacheContextType | undefined>(undefined);

// Provider unifié
export const UnifiedCacheProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const cacheManager = useRef(new UnifiedCacheManager());

  // Restaurer au démarrage
  useEffect(() => {
    cacheManager.current.restore();
  }, []);

  // Nettoyage automatique
  useEffect(() => {
    const interval = setInterval(() => {
      cacheManager.current.cleanup();
    }, 5 * 60 * 1000); // Toutes les 5 minutes

    return () => clearInterval(interval);
  }, []);

  // Persister avant fermeture
  useEffect(() => {
    const handleBeforeUnload = () => {
      cacheManager.current.persist();
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, []);

  const value: CacheContextType = {
    get: useCallback(<T,>(key: CacheKey) => cacheManager.current.get<T>(key), []),
    set: useCallback(<T,>(key: CacheKey, value: T, ttl?: number, tags?: string[]) => 
      cacheManager.current.set(key, value, ttl, tags), []),
    has: useCallback((key: CacheKey) => cacheManager.current.has(key), []),
    delete: useCallback((key: CacheKey) => cacheManager.current.delete(key), []),
    clear: useCallback(() => cacheManager.current.clear(), []),
    invalidateByTag: useCallback((tag: string) => cacheManager.current.invalidateByTag(tag), []),
    cleanup: useCallback(() => cacheManager.current.cleanup(), []),
    size: useCallback(() => cacheManager.current.size(), []),
    getStats: useCallback(() => cacheManager.current.getStats(), []),
    persist: useCallback(() => cacheManager.current.persist(), []),
    restore: useCallback(() => cacheManager.current.restore(), []),
  };

  return (
    <UnifiedCacheContext.Provider value={value}>
      {children}
    </UnifiedCacheContext.Provider>
  );
};

// Hook unifié
export const useUnifiedCache = () => {
  const context = useContext(UnifiedCacheContext);
  if (!context) {
    throw new Error('useUnifiedCache must be used within a UnifiedCacheProvider');
  }
  return context;
};

// Hook pour requêtes mises en cache
export function useUnifiedCachedQuery<T>(
  key: CacheKey,
  queryFn: () => Promise<T>,
  options: {
    ttl?: number;
    tags?: string[];
    enabled?: boolean;
  } = {}
) {
  const cache = useUnifiedCache();
  const [data, setData] = useState<T | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const { ttl = DEFAULT_TTL, tags = [], enabled = true } = options;

  const executeQuery = useCallback(async () => {
    if (!enabled) return;

    // Vérifier le cache
    const cachedData = cache.get<T>(key);
    if (cachedData) {
      setData(cachedData);
      return cachedData;
    }

    setIsLoading(true);
    setError(null);

    try {
      const result = await queryFn();
      cache.set(key, result, ttl, tags);
      setData(result);
      return result;
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Unknown error');
      setError(error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [key, queryFn, ttl, tags, enabled, cache]);

  useEffect(() => {
    if (enabled) {
      executeQuery();
    }
  }, [executeQuery, enabled]);

  const refetch = useCallback(() => {
    cache.delete(key);
    return executeQuery();
  }, [cache, key, executeQuery]);

  return {
    data,
    isLoading,
    error,
    refetch,
  };
}

// Alias pour compatibilité descendante
export const CacheProvider = UnifiedCacheProvider;
export const useCache = useUnifiedCache;
export const useCachedQuery = useUnifiedCachedQuery;