
import { useQuery, UseQueryOptions, QueryKey } from '@tanstack/react-query';
import { useCallback, useMemo } from 'react';
import { apiCache, withCache } from '@/utils/cacheStrategies';

interface OptimizedQueryOptions<T> extends Omit<UseQueryOptions<T>, 'queryKey' | 'queryFn'> {
  useMemoryCache?: boolean;
  cacheTime?: number;
  backgroundRefresh?: boolean;
}

/**
 * Hook optimisé pour les requêtes avec cache intelligent
 */
export const useOptimizedQuery = <T>(
  queryKey: QueryKey,
  queryFn: () => Promise<T>,
  options: OptimizedQueryOptions<T> = {}
) => {
  const {
    useMemoryCache = true,
    cacheTime = 5 * 60 * 1000,
    backgroundRefresh = true,
    staleTime = 2 * 60 * 1000,
    ...queryOptions
  } = options;

  // Wrapper avec cache mémoire optionnel
  const optimizedQueryFn = useCallback(() => {
    if (useMemoryCache) {
      const cacheKey = JSON.stringify(queryKey);
      return withCache(queryFn, apiCache, () => cacheKey, cacheTime)();
    }
    return queryFn();
  }, [queryFn, queryKey, useMemoryCache, cacheTime]);

  // Configuration optimisée de React Query
  const queryConfig: UseQueryOptions<T> = useMemo(() => ({
    queryKey,
    queryFn: optimizedQueryFn,
    staleTime,
    gcTime: cacheTime,
    refetchOnWindowFocus: backgroundRefresh,
    refetchOnReconnect: true,
    retry: (failureCount, error) => {
      // Retry intelligent basé sur le type d'erreur
      const errorMessage = error instanceof Error ? error.message : String(error);
      
      if (errorMessage.includes('Network') || errorMessage.includes('fetch')) {
        return failureCount < 3;
      }
      
      if (errorMessage.includes('500')) {
        return failureCount < 2;
      }
      
      return failureCount < 1;
    },
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
    ...queryOptions,
  }), [queryKey, optimizedQueryFn, staleTime, cacheTime, backgroundRefresh, queryOptions]);

  return useQuery(queryConfig);
};

/**
 * Hook pour les requêtes de données critiques (toujours fraîches)
 */
export const useCriticalQuery = <T>(
  queryKey: QueryKey,
  queryFn: () => Promise<T>,
  options: OptimizedQueryOptions<T> = {}
) => {
  return useOptimizedQuery(queryKey, queryFn, {
    ...options,
    useMemoryCache: false,
    staleTime: 0,
    backgroundRefresh: true,
    refetchInterval: 30000, // Refresh toutes les 30 secondes
  });
};

/**
 * Hook pour les requêtes de données statiques (cache long)
 */
export const useStaticQuery = <T>(
  queryKey: QueryKey,
  queryFn: () => Promise<T>,
  options: OptimizedQueryOptions<T> = {}
) => {
  return useOptimizedQuery(queryKey, queryFn, {
    ...options,
    useMemoryCache: true,
    staleTime: 24 * 60 * 60 * 1000, // 24 heures
    cacheTime: 24 * 60 * 60 * 1000,
    backgroundRefresh: false,
    refetchOnWindowFocus: false,
  });
};

/**
 * Hook pour précharger des données
 */
export const usePrefetchQuery = () => {
  const prefetch = useCallback(
    <T>(queryKey: QueryKey, queryFn: () => Promise<T>, options: OptimizedQueryOptions<T> = {}) => {
      // Utiliser le cache pour éviter les doublons
      const cacheKey = JSON.stringify(queryKey);
      if (apiCache.has(cacheKey)) {
        return Promise.resolve();
      }

      return queryFn().then(data => {
        if (options.useMemoryCache !== false) {
          apiCache.set(cacheKey, data, options.cacheTime);
        }
      }).catch(() => {
        // Ignorer les erreurs de prefetch
      });
    },
    []
  );

  return { prefetch };
};
