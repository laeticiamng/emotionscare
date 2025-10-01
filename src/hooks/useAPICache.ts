// @ts-nocheck

import { useState, useCallback, useRef } from 'react';

interface CacheEntry<T> {
  data: T;
  timestamp: number;
  ttl: number;
}

interface CacheOptions {
  ttl?: number; // Time to live in milliseconds
  maxSize?: number;
}

export const useAPICache = <T = any>(options: CacheOptions = {}) => {
  const { ttl = 5 * 60 * 1000, maxSize = 100 } = options; // 5 minutes default TTL
  const cache = useRef(new Map<string, CacheEntry<T>>());
  const [isLoading, setIsLoading] = useState(false);

  const set = useCallback((key: string, data: T, customTtl?: number) => {
    const entry: CacheEntry<T> = {
      data,
      timestamp: Date.now(),
      ttl: customTtl || ttl,
    };

    // Remove oldest entries if cache is full
    if (cache.current.size >= maxSize) {
      const oldestKey = cache.current.keys().next().value;
      cache.current.delete(oldestKey);
    }

    cache.current.set(key, entry);
  }, [ttl, maxSize]);

  const get = useCallback((key: string): T | null => {
    const entry = cache.current.get(key);
    
    if (!entry) return null;

    // Check if entry has expired
    if (Date.now() - entry.timestamp > entry.ttl) {
      cache.current.delete(key);
      return null;
    }

    return entry.data;
  }, []);

  const invalidate = useCallback((key?: string) => {
    if (key) {
      cache.current.delete(key);
    } else {
      cache.current.clear();
    }
  }, []);

  const fetchWithCache = useCallback(async <TResult = T>(
    key: string,
    fetcher: () => Promise<TResult>,
    customTtl?: number
  ): Promise<TResult> => {
    // Try to get from cache first
    const cached = get(key) as TResult;
    if (cached) {
      return cached;
    }

    setIsLoading(true);
    try {
      const data = await fetcher();
      set(key, data as unknown as T, customTtl);
      return data;
    } finally {
      setIsLoading(false);
    }
  }, [get, set]);

  const getStats = useCallback(() => ({
    size: cache.current.size,
    maxSize,
    keys: Array.from(cache.current.keys()),
  }), [maxSize]);

  return {
    get,
    set,
    invalidate,
    fetchWithCache,
    getStats,
    isLoading,
  };
};

export default useAPICache;
