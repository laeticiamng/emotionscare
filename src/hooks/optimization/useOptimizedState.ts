import { useState, useCallback, useMemo, useRef, useEffect } from 'react';
import { logger } from '@/lib/logger';

/**
 * Hook d'état optimisé avec debounce et cache automatique
 */
export function useOptimizedState<T>(
  initialValue: T,
  options: {
    debounceMs?: number;
    enableCache?: boolean;
    cacheKey?: string;
    validator?: (value: T) => boolean;
  } = {}
) {
  const { debounceMs = 300, enableCache = false, cacheKey, validator } = options;
  
  // Cache local
  const cacheRef = useRef<Map<string, T>>(new Map());
  const debounceRef = useRef<NodeJS.Timeout>();
  
  // État initial avec cache
  const getInitialValue = useMemo(() => {
    if (enableCache && cacheKey && cacheRef.current.has(cacheKey)) {
      return cacheRef.current.get(cacheKey) as T;
    }
    return initialValue;
  }, [initialValue, enableCache, cacheKey]);
  
  const [state, setState] = useState<T>(getInitialValue);
  const [debouncedState, setDebouncedState] = useState<T>(getInitialValue);
  
  // Fonction optimisée de mise à jour
  const updateState = useCallback((newValue: T | ((prev: T) => T)) => {
    setState(prev => {
      const nextValue = typeof newValue === 'function' 
        ? (newValue as (prev: T) => T)(prev)
        : newValue;
      
      // Validation
      if (validator && !validator(nextValue)) {
        logger.warn('Invalid state value rejected', { nextValue }, 'SYSTEM');
        return prev;
      }
      
      // Cache
      if (enableCache && cacheKey) {
        cacheRef.current.set(cacheKey, nextValue);
      }
      
      // Debounce pour les changements fréquents
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
      
      debounceRef.current = setTimeout(() => {
        setDebouncedState(nextValue);
      }, debounceMs);
      
      return nextValue;
    });
  }, [validator, enableCache, cacheKey, debounceMs]);
  
  // Nettoyage
  useEffect(() => {
    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
    };
  }, []);
  
  // Méthodes utilitaires
  const reset = useCallback(() => {
    updateState(initialValue);
  }, [initialValue, updateState]);
  
  const clearCache = useCallback(() => {
    if (cacheKey) {
      cacheRef.current.delete(cacheKey);
    }
  }, [cacheKey]);
  
  return {
    value: state,
    debouncedValue: debouncedState,
    setValue: updateState,
    reset,
    clearCache,
    isCached: enableCache && cacheKey ? cacheRef.current.has(cacheKey) : false
  };
}