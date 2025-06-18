import { useAppStore } from '@/store/appStore';
import { useErrorHandler } from '@/contexts/ErrorContext';
import { useCache } from '@/contexts/CacheContext';

/**
 * Hook centralisé pour gérer l'état global de l'application
 * Combine Zustand store, gestion d'erreurs et cache
 */
export const useGlobalState = () => {
  const store = useAppStore();
  const errorHandler = useErrorHandler();
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
      errorHandler.addError({
        message: errorMessage,
        severity: 'medium',
        context: { originalError: error },
      });
      return null;
    }
  };

  // Wrapper pour les actions du store avec gestion d'erreurs
  const wrappedActions = {
    setUser: (user: any) => safeAction(() => store.setUser(user), 'Erreur lors de la mise à jour de l\'utilisateur'),
    setTheme: (theme: any) => safeAction(() => store.setTheme(theme), 'Erreur lors du changement de thème'),
    updatePreferences: (prefs: any) => safeAction(() => store.updatePreferences(prefs), 'Erreur lors de la mise à jour des préférences'),
    updateMusicState: (state: any) => safeAction(() => store.updateMusicState(state), 'Erreur lors de la mise à jour de la musique'),
    updateEmotionState: (state: any) => safeAction(() => store.updateEmotionState(state), 'Erreur lors de la mise à jour des émotions'),
    updateJournalState: (state: any) => safeAction(() => store.updateJournalState(state), 'Erreur lors de la mise à jour du journal'),
    updateCoachState: (state: any) => safeAction(() => store.updateCoachState(state), 'Erreur lors de la mise à jour du coach'),
  };

  return {
    // État du store
    ...store,
    
    // Actions wrappées
    actions: {
      ...wrappedActions,
      ...store,
    },
    
    // Gestion d'erreurs
    errors: errorHandler,
    
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
          console.error('Failed to save to localStorage:', error);
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
  const errorHandler = useErrorHandler();

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
      errorHandler.addError({
        message: error.message,
        severity: 'medium',
        context: { attempt, retries },
      });
      return null;
    } finally {
      setLoading(false);
    }
  }, [operation, retries, retryDelay, onError, errorHandler]);

  React.useEffect(() => {
    execute();
  }, dependencies);

  return { data, loading, error, retry: () => execute() };
};