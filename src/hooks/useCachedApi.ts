
import { useCallback } from 'react';
import { useQuery, useQueryClient, QueryKey } from '@tanstack/react-query';
import { apiCache, withCache } from '@/utils/cacheStrategies';

interface CachedApiOptions {
  cacheTime?: number;
  staleTime?: number;
  useMemoryCache?: boolean;
}

/**
 * Hook pour les appels API avec cache intelligent
 */
export const useCachedApi = <T>(
  queryKey: QueryKey,
  queryFn: () => Promise<T>,
  options: CachedApiOptions = {}
) => {
  const queryClient = useQueryClient();
  const { cacheTime = 5 * 60 * 1000, staleTime = 2 * 60 * 1000, useMemoryCache = true } = options;

  // Wrapper avec cache mémoire si activé
  const cachedQueryFn = useCallback(() => {
    if (useMemoryCache) {
      const cacheKey = JSON.stringify(queryKey);
      return withCache(queryFn, apiCache, () => cacheKey)();
    }
    return queryFn();
  }, [queryFn, queryKey, useMemoryCache]);

  return useQuery({
    queryKey,
    queryFn: cachedQueryFn,
    gcTime: cacheTime,
    staleTime,
    retry: (failureCount, error) => {
      // Retry logic intelligent basé sur le type d'erreur
      if (error instanceof Error && error.message.includes('Network')) {
        return failureCount < 3;
      }
      return failureCount < 1;
    },
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  });
};

/**
 * Hook pour précharger des données
 */
export const usePrefetchData = () => {
  const queryClient = useQueryClient();

  const prefetchQuery = useCallback(
    <T>(queryKey: QueryKey, queryFn: () => Promise<T>, options: CachedApiOptions = {}) => {
      const { staleTime = 5 * 60 * 1000 } = options;
      
      return queryClient.prefetchQuery({
        queryKey,
        queryFn,
        staleTime,
      });
    },
    [queryClient]
  );

  return { prefetchQuery };
};
