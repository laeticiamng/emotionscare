import React, { createContext, useContext, useEffect, ReactNode } from 'react';

// Types pour le cache
export type CacheKey = string;
export type CacheValue = any;
export type CacheEntry = {
  value: CacheValue;
  timestamp: number;
  ttl: number; // Time to live en ms
  tags?: string[];
};

export interface CacheContextType {
  // Cache operations
  set: (key: CacheKey, value: CacheValue, ttl?: number, tags?: string[]) => void;
  get: (key: CacheKey) => CacheValue | null;
  has: (key: CacheKey) => boolean;
  delete: (key: CacheKey) => boolean;
  clear: () => void;
  
  // Advanced operations
  invalidateByTag: (tag: string) => void;
  cleanup: () => void;
  size: () => number;
  
  // Persistence
  persist: () => void;
  restore: () => void;
}

// Configuration par défaut
const DEFAULT_TTL = 5 * 60 * 1000; // 5 minutes
const MAX_CACHE_SIZE = 1000;
const STORAGE_KEY = 'emotionscare-cache';

// Context
const CacheContext = createContext<CacheContextType | undefined>(undefined);

// Provider
export const CacheProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [cache, setCache] = React.useState<Map<CacheKey, CacheEntry>>(new Map());

  // Vérifier si une entrée est valide
  const isValid = (entry: CacheEntry): boolean => {
    return Date.now() - entry.timestamp < entry.ttl;
  };

  // Ajouter une entrée au cache
  const set = React.useCallback((
    key: CacheKey, 
    value: CacheValue, 
    ttl: number = DEFAULT_TTL,
    tags: string[] = []
  ) => {
    setCache(prev => {
      const newCache = new Map(prev);
      
      // Si le cache est plein, supprimer les entrées les plus anciennes
      if (newCache.size >= MAX_CACHE_SIZE) {
        const oldestKey = Array.from(newCache.keys())[0];
        newCache.delete(oldestKey);
      }
      
      newCache.set(key, {
        value,
        timestamp: Date.now(),
        ttl,
        tags
      });
      
      return newCache;
    });
  }, []);

  // Récupérer une entrée du cache
  const get = React.useCallback((key: CacheKey): CacheValue | null => {
    const entry = cache.get(key);
    
    if (!entry) {
      return null;
    }
    
    if (!isValid(entry)) {
      // Supprimer l'entrée expirée
      setCache(prev => {
        const newCache = new Map(prev);
        newCache.delete(key);
        return newCache;
      });
      return null;
    }
    
    return entry.value;
  }, [cache]);

  // Vérifier si une clé existe et est valide
  const has = React.useCallback((key: CacheKey): boolean => {
    const entry = cache.get(key);
    return entry ? isValid(entry) : false;
  }, [cache]);

  // Supprimer une entrée
  const deleteEntry = React.useCallback((key: CacheKey): boolean => {
    const hadKey = cache.has(key);
    setCache(prev => {
      const newCache = new Map(prev);
      newCache.delete(key);
      return newCache;
    });
    return hadKey;
  }, [cache]);

  // Vider le cache
  const clear = React.useCallback(() => {
    setCache(new Map());
  }, []);

  // Invalider par tag
  const invalidateByTag = React.useCallback((tag: string) => {
    setCache(prev => {
      const newCache = new Map();
      
      for (const [key, entry] of prev) {
        if (!entry.tags?.includes(tag)) {
          newCache.set(key, entry);
        }
      }
      
      return newCache;
    });
  }, []);

  // Nettoyer les entrées expirées
  const cleanup = React.useCallback(() => {
    setCache(prev => {
      const newCache = new Map();
      
      for (const [key, entry] of prev) {
        if (isValid(entry)) {
          newCache.set(key, entry);
        }
      }
      
      return newCache;
    });
  }, []);

  // Taille du cache
  const size = React.useCallback(() => cache.size, [cache.size]);

  // Persister le cache
  const persist = React.useCallback(() => {
    try {
      const serialized = JSON.stringify(Array.from(cache.entries()));
      localStorage.setItem(STORAGE_KEY, serialized);
    } catch (error) {
      console.error('Failed to persist cache:', error);
    }
  }, [cache]);

  // Restaurer le cache
  const restore = React.useCallback(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const entries = JSON.parse(stored);
        const restoredCache = new Map(entries);
        
        // Nettoyer les entrées expirées lors de la restauration
        const validCache = new Map();
        for (const [key, entry] of restoredCache) {
          if (isValid(entry)) {
            validCache.set(key, entry);
          }
        }
        
        setCache(validCache);
      }
    } catch (error) {
      console.error('Failed to restore cache:', error);
    }
  }, []);

  // Restaurer le cache au démarrage
  useEffect(() => {
    restore();
  }, [restore]);

  // Nettoyer automatiquement toutes les 5 minutes
  useEffect(() => {
    const interval = setInterval(cleanup, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, [cleanup]);

  // Persister avant fermeture
  useEffect(() => {
    const handleBeforeUnload = () => {
      persist();
    };
    
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [persist]);

  const value: CacheContextType = {
    set,
    get,
    has,
    delete: deleteEntry,
    clear,
    invalidateByTag,
    cleanup,
    size,
    persist,
    restore,
  };

  return (
    <CacheContext.Provider value={value}>
      {children}
    </CacheContext.Provider>
  );
};

// Hook
export const useCache = () => {
  const context = useContext(CacheContext);
  if (!context) {
    throw new Error('useCache must be used within a CacheProvider');
  }
  return context;
};

// Hook pour cache avec requête
export const useCachedQuery = <T extends unknown>(
  key: CacheKey,
  queryFn: () => Promise<T>,
  options: {
    ttl?: number;
    tags?: string[];
    enabled?: boolean;
  } = {}
) => {
  const cache = useCache();
  const [data, setData] = React.useState<T | null>(null);
  const [isLoading, setIsLoading] = React.useState(false);
  const [error, setError] = React.useState<Error | null>(null);

  const { ttl = DEFAULT_TTL, tags = [], enabled = true } = options;

  const executeQuery = React.useCallback(async () => {
    if (!enabled) return;

    // Vérifier le cache d'abord
    const cachedData = cache.get(key);
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

  // Exécuter la requête au démarrage si activée
  useEffect(() => {
    if (enabled) {
      executeQuery();
    }
  }, [executeQuery, enabled]);

  const refetch = React.useCallback(() => {
    cache.delete(key);
    return executeQuery();
  }, [cache, key, executeQuery]);

  return {
    data,
    isLoading,
    error,
    refetch,
  };
};