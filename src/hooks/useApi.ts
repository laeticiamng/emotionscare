// @ts-nocheck
import { useState, useCallback } from 'react';
import { ApiResponse, ApiError } from '@/services/api-client';

/**
 * Hook pour simplifier l'usage des APIs avec gestion d'état
 * Suit les bonnes pratiques UX pour les chargements et erreurs
 */
export function useApi<T = any>() {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<ApiError | null>(null);

  const execute = useCallback(async (
    apiCall: () => Promise<ApiResponse<T>>,
    options?: {
      onSuccess?: (data: T) => void;
      onError?: (error: ApiError) => void;
      showToast?: boolean;
    }
  ): Promise<T | null> => {
    setLoading(true);
    setError(null);

    try {
      const response = await apiCall();

      if (response.success && response.data) {
        setData(response.data);
        options?.onSuccess?.(response.data);
        return response.data;
      } else if (response.error) {
        setError(response.error);
        options?.onError?.(response.error);
        return null;
      }

      return null;
    } catch (unexpectedError) {
      const fallbackError: ApiError = {
        message: 'Unexpected error',
        userMessage: 'Une erreur inattendue s\'est produite.'
      };
      setError(fallbackError);
      options?.onError?.(fallbackError);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const reset = useCallback(() => {
    setData(null);
    setError(null);
    setLoading(false);
  }, []);

  return {
    data,
    loading,
    error,
    execute,
    reset,
    // États dérivés utiles
    hasData: data !== null,
    hasError: error !== null,
    isIdle: !loading && !error && data === null,
  };
}

/**
 * Hook spécialisé pour les listes de données
 */
export function useApiList<T = any>() {
  const [items, setItems] = useState<T[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<ApiError | null>(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const loadItems = useCallback(async (
    apiCall: (page: number) => Promise<ApiResponse<T[]>>,
    options?: {
      reset?: boolean;
      onSuccess?: (items: T[]) => void;
      onError?: (error: ApiError) => void;
    }
  ) => {
    setLoading(true);
    setError(null);

    const currentPage = options?.reset ? 1 : page;

    try {
      const response = await apiCall(currentPage);

      if (response.success && response.data) {
        const newItems = response.data;
        
        if (options?.reset) {
          setItems(newItems);
          setPage(1);
        } else {
          setItems(prev => [...prev, ...newItems]);
          setPage(prev => prev + 1);
        }

        setHasMore(newItems.length > 0);
        options?.onSuccess?.(newItems);
      } else if (response.error) {
        setError(response.error);
        options?.onError?.(response.error);
      }
    } catch (unexpectedError) {
      const fallbackError: ApiError = {
        message: 'Unexpected error',
        userMessage: 'Une erreur inattendue s\'est produite.'
      };
      setError(fallbackError);
      options?.onError?.(fallbackError);
    } finally {
      setLoading(false);
    }
  }, [page]);

  const refresh = useCallback(async (
    apiCall: (page: number) => Promise<ApiResponse<T[]>>
  ) => {
    return loadItems(apiCall, { reset: true });
  }, [loadItems]);

  const addItem = useCallback((item: T) => {
    setItems(prev => [item, ...prev]);
  }, []);

  const updateItem = useCallback((updatedItem: T, matcher: (item: T) => boolean) => {
    setItems(prev => prev.map(item => matcher(item) ? updatedItem : item));
  }, []);

  const removeItem = useCallback((matcher: (item: T) => boolean) => {
    setItems(prev => prev.filter(item => !matcher(item)));
  }, []);

  const reset = useCallback(() => {
    setItems([]);
    setError(null);
    setLoading(false);
    setPage(1);
    setHasMore(true);
  }, []);

  return {
    items,
    loading,
    error,
    page,
    hasMore,
    loadItems,
    refresh,
    addItem,
    updateItem,
    removeItem,
    reset,
    // États dérivés
    isEmpty: items.length === 0,
    hasItems: items.length > 0,
    hasError: error !== null,
  };
}

export default useApi;