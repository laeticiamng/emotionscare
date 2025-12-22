import React from 'react';
import { useShallow } from 'zustand/react/shallow';
import { useAppStore } from '@/store/appStore';
import { useError } from '@/contexts';
import { useGlobalStateSlice } from '@/store/hooks';
import { useCache } from '@/contexts/UnifiedCacheContext';
import { logger } from '@/lib/logger';

/**
 * Hook centralisé pour gérer l'état global de l'application
 * Combine Zustand store, gestion d'erreurs et cache
 */
export const useGlobalState = () => {
  const stateSlice = useGlobalStateSlice();

  const actions = useAppStore(
    useShallow((state) => ({
      setUser: state.setUser,
      setTheme: state.setTheme,
      setAuthenticated: state.setAuthenticated,
      setLoading: state.setLoading,
      toggleSidebar: state.toggleSidebar,
      setActiveModule: state.setActiveModule,
      updatePreferences: state.updatePreferences,
      updateMusicState: state.updateMusicState,
      updateEmotionState: state.updateEmotionState,
      updateJournalState: state.updateJournalState,
      updateCoachState: state.updateCoachState,
      setCache: state.setCache,
      getCache: state.getCache,
      clearCache: state.clearCache,
      isCacheValid: state.isCacheValid,
      reset: state.reset,
    }))
  );
  const errorApi = useError();
  const { notify } = errorApi;
  const cache = useCache();

  // Actions combinées avec gestion d'erreurs
  const safeAction = async <T>(
    action: () => Promise<T> | T,
    errorMessage: string = 'Une erreur est survenue'
  ): Promise<T | null> => {
    try {
      const result = await action();
      return result;
    } catch (error) {
      notify(
        {
          code: 'UNKNOWN',
          messageKey: 'errors.unexpectedError',
          cause: error instanceof Error ? { message: error.message, stack: error.stack } : error,
          context: { hint: errorMessage },
        },
        { source: 'useGlobalState.safeAction' },
      );
      return null;
    }
  };

  // Wrapper pour les actions du store avec gestion d'erreurs
  const wrappedActions = {
    setUser: (user: any) => safeAction(() => actions.setUser(user), 'Erreur lors de la mise à jour de l\'utilisateur'),
    setTheme: (theme: any) => safeAction(() => actions.setTheme(theme), 'Erreur lors du changement de thème'),
    updatePreferences: (prefs: any) => safeAction(() => actions.updatePreferences(prefs), 'Erreur lors de la mise à jour des préférences'),
    updateMusicState: (state: any) => safeAction(() => actions.updateMusicState(state), 'Erreur lors de la mise à jour de la musique'),
    updateEmotionState: (state: any) => safeAction(() => actions.updateEmotionState(state), 'Erreur lors de la mise à jour des émotions'),
    updateJournalState: (state: any) => safeAction(() => actions.updateJournalState(state), 'Erreur lors de la mise à jour du journal'),
    updateCoachState: (state: any) => safeAction(() => actions.updateCoachState(state), 'Erreur lors de la mise à jour du coach'),
  };

  return {
    // État du store
    ...stateSlice,

    // Actions exposées en direct
    ...actions,

    // Actions wrappées
    actions: {
      ...wrappedActions,
      ...actions,
    },
    
    // Gestion d'erreurs
    errors: errorApi,
    
    // Cache
    cache,
    
    // Utilitaires
    utils: {
      safeAction,
      isOnline: navigator.onLine,
      deviceInfo: {
        isMobile: /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent),
        isTouch: 'ontouchstart' in window,
        platform: navigator.platform,
      },
    },
  };
};

/**
 * Hook pour persister des données avec cache et localStorage
 */
export const usePersistentState = <T>(
  key: string,
  defaultValue: T,
  options: {
    cache?: boolean;
    localStorage?: boolean;
    ttl?: number;
  } = {}
) => {
  const { cache, localStorage: useLocalStorage = true, ttl = 30 * 60 * 1000 } = options;
  const cacheContext = useCache();
  const [state, setState] = React.useState<T>(() => {
    // Essayer de récupérer depuis le cache d'abord
    if (options.cache && cacheContext.has(key)) {
      return cacheContext.get(key) || defaultValue;
    }
    
    // Puis depuis localStorage
    if (useLocalStorage) {
      try {
        const stored = localStorage.getItem(key);
        return stored ? JSON.parse(stored) : defaultValue;
      } catch {
        return defaultValue;
      }
    }
    
    return defaultValue;
  });

  const setValue = React.useCallback((value: T | ((prev: T) => T)) => {
    setState(prev => {
      const newValue = typeof value === 'function' ? (value as (prev: T) => T)(prev) : value;
      
      // Sauvegarder dans le cache si activé
      if (options.cache) {
        cacheContext.set(key, newValue, ttl);
      }
      
      // Sauvegarder dans localStorage si activé
      if (useLocalStorage) {
        try {
          localStorage.setItem(key, JSON.stringify(newValue));
        } catch (error) {
          logger.error('Failed to save to localStorage', error as Error, 'SYSTEM');
        }
      }
      
      return newValue;
    });
  }, [key, options.cache, useLocalStorage, ttl, cacheContext]);

  return [state, setValue] as const;
};

/**
 * Hook pour les requêtes avec retry automatique et gestion d'erreurs
 */
export const useAsyncOperation = <T>(
  operation: () => Promise<T>,
  dependencies: React.DependencyList = [],
  options: {
    retries?: number;
    retryDelay?: number;
    onError?: (error: Error) => void;
  } = {}
) => {
  const { retries = 2, retryDelay = 1000, onError } = options;
  const [data, setData] = React.useState<T | null>(null);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<Error | null>(null);
  const { notify } = useError();

  const execute = React.useCallback(async (attempt = 0): Promise<T | null> => {
    setLoading(true);
    setError(null);

    try {
      const result = await operation();
      setData(result);
      return result;
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Unknown error');
      
      if (attempt < retries) {
        await new Promise(resolve => setTimeout(resolve, retryDelay));
        return execute(attempt + 1);
      }
      
      setError(error);
      onError?.(error);
      notify(
        {
          code: 'UNKNOWN',
          messageKey: 'errors.unexpectedError',
          cause: { message: error.message, stack: error.stack },
          context: { attempt, retries },
        },
        { source: 'useGlobalState.useAsyncOperation' },
      );
      return null;
    } finally {
      setLoading(false);
    }
  }, [operation, retries, retryDelay, onError, notify]);

  React.useEffect(() => {
    execute();
  }, dependencies);

  return { data, loading, error, retry: () => execute() };
};
