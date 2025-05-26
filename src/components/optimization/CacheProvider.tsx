
import React, { createContext, useContext, useCallback, useRef } from 'react';

interface CacheItem<T> {
  data: T;
  timestamp: number;
  ttl: number;
}

interface CacheContextType {
  get: <T>(key: string) => T | null;
  set: <T>(key: string, data: T, ttl?: number) => void;
  invalidate: (key: string) => void;
  clear: () => void;
  getStats: () => { size: number; hitRate: number };
}

const CacheContext = createContext<CacheContextType | null>(null);

export const CacheProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const cache = useRef(new Map<string, CacheItem<any>>());
  const stats = useRef({ hits: 0, misses: 0 });

  const get = useCallback(<T,>(key: string): T | null => {
    const item = cache.current.get(key);
    
    if (!item) {
      stats.current.misses++;
      return null;
    }

    // Vérifier l'expiration
    if (Date.now() - item.timestamp > item.ttl) {
      cache.current.delete(key);
      stats.current.misses++;
      return null;
    }

    stats.current.hits++;
    return item.data as T;
  }, []);

  const set = useCallback(<T,>(key: string, data: T, ttl: number = 5 * 60 * 1000) => {
    // Nettoyer le cache si trop volumineux
    if (cache.current.size > 100) {
      const oldestKey = cache.current.keys().next().value;
      if (oldestKey) cache.current.delete(oldestKey);
    }

    cache.current.set(key, {
      data,
      timestamp: Date.now(),
      ttl
    });
  }, []);

  const invalidate = useCallback((key: string) => {
    cache.current.delete(key);
  }, []);

  const clear = useCallback(() => {
    cache.current.clear();
    stats.current = { hits: 0, misses: 0 };
  }, []);

  const getStats = useCallback(() => {
    const total = stats.current.hits + stats.current.misses;
    return {
      size: cache.current.size,
      hitRate: total > 0 ? stats.current.hits / total : 0
    };
  }, []);

  // Nettoyage automatique toutes les 5 minutes
  React.useEffect(() => {
    const interval = setInterval(() => {
      const now = Date.now();
      for (const [key, item] of cache.current.entries()) {
        if (now - item.timestamp > item.ttl) {
          cache.current.delete(key);
        }
      }
    }, 5 * 60 * 1000);

    return () => clearInterval(interval);
  }, []);

  const value: CacheContextType = {
    get,
    set,
    invalidate,
    clear,
    getStats
  };

  return (
    <CacheContext.Provider value={value}>
      {children}
    </CacheContext.Provider>
  );
};

export const useCache = () => {
  const context = useContext(CacheContext);
  if (!context) {
    throw new Error('useCache must be used within a CacheProvider');
  }
  return context;
};

// Hook pour les requêtes mises en cache
export const useCachedQuery = <T,>(
  key: string, 
  queryFn: () => Promise<T>, 
  ttl?: number
) => {
  const cache = useCache();
  const [data, setData] = React.useState<T | null>(null);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<Error | null>(null);

  const execute = useCallback(async () => {
    // Vérifier le cache d'abord
    const cached = cache.get<T>(key);
    if (cached) {
      setData(cached);
      return cached;
    }

    setLoading(true);
    setError(null);

    try {
      const result = await queryFn();
      cache.set(key, result, ttl);
      setData(result);
      return result;
    } catch (err) {
      setError(err as Error);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [key, queryFn, cache, ttl]);

  React.useEffect(() => {
    execute();
  }, [execute]);

  const invalidate = useCallback(() => {
    cache.invalidate(key);
    setData(null);
  }, [cache, key]);

  return { data, loading, error, refetch: execute, invalidate };
};
