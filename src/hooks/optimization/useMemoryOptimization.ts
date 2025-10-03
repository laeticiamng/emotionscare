import { useEffect, useCallback, useRef } from 'react';

interface MemoryOptimizationConfig {
  maxCacheSize?: number;
  cleanupInterval?: number;
  memoryThreshold?: number; // MB
}

/**
 * Hook pour l'optimisation automatique de la mémoire
 */
export function useMemoryOptimization(config: MemoryOptimizationConfig = {}) {
  const { 
    maxCacheSize = 50, 
    cleanupInterval = 30000, // 30 secondes
    memoryThreshold = 100 // 100MB
  } = config;
  
  const cacheRef = useRef<Map<string, any>>(new Map());
  const timersRef = useRef<Set<NodeJS.Timeout>>(new Set());
  const observersRef = useRef<Set<any>>(new Set());
  
  // Surveillance de la mémoire
  const checkMemoryUsage = useCallback(() => {
    if ('memory' in performance) {
      const memory = (performance as any).memory;
      const usedMB = memory.usedJSHeapSize / (1024 * 1024);
      
      if (usedMB > memoryThreshold) {
        console.warn(`Memory usage high: ${usedMB.toFixed(2)}MB`);
        
        // Nettoyage agressif du cache
        const cacheSize = cacheRef.current.size;
        const toDelete = Math.floor(cacheSize * 0.3); // Supprimer 30%
        
        const keys = Array.from(cacheRef.current.keys());
        for (let i = 0; i < toDelete; i++) {
          cacheRef.current.delete(keys[i]);
        }
        
        // Forcer le garbage collection si disponible
        if ('gc' in window) {
          (window as any).gc();
        }
        
        return true; // Nettoyage effectué
      }
    }
    return false;
  }, [memoryThreshold]);
  
  // Nettoyage automatique du cache
  const cleanupCache = useCallback(() => {
    if (cacheRef.current.size > maxCacheSize) {
      const keys = Array.from(cacheRef.current.keys());
      const toDelete = keys.slice(0, keys.length - maxCacheSize);
      
      toDelete.forEach(key => {
        cacheRef.current.delete(key);
      });
    }
  }, [maxCacheSize]);
  
  // Ajouter un élément au cache optimisé
  const addToCache = useCallback((key: string, value: any) => {
    // Vérifier la taille du cache
    if (cacheRef.current.size >= maxCacheSize) {
      const oldestKey = cacheRef.current.keys().next().value;
      cacheRef.current.delete(oldestKey);
    }
    
    cacheRef.current.set(key, value);
  }, [maxCacheSize]);
  
  // Récupérer du cache
  const getFromCache = useCallback((key: string) => {
    return cacheRef.current.get(key);
  }, []);
  
  // Enregistrer un timer pour nettoyage automatique
  const registerTimer = useCallback((timer: NodeJS.Timeout) => {
    timersRef.current.add(timer);
    
    // Auto-nettoyage après expiration
    const originalTimer = timer;
    setTimeout(() => {
      timersRef.current.delete(originalTimer);
    }, 1000);
    
    return timer;
  }, []);
  
  // Enregistrer un observer pour nettoyage automatique
  const registerObserver = useCallback((observer: any) => {
    observersRef.current.add(observer);
    return observer;
  }, []);
  
  // Nettoyage complet
  const cleanup = useCallback(() => {
    // Nettoyer les timers
    timersRef.current.forEach(timer => {
      clearTimeout(timer);
      clearInterval(timer);
    });
    timersRef.current.clear();
    
    // Nettoyer les observers
    observersRef.current.forEach(observer => {
      if (observer.disconnect) observer.disconnect();
      if (observer.unobserve) observer.unobserve();
    });
    observersRef.current.clear();
    
    // Vider le cache
    cacheRef.current.clear();
  }, []);
  
  // Configuration du nettoyage automatique
  useEffect(() => {
    const interval = setInterval(() => {
      checkMemoryUsage();
      cleanupCache();
    }, cleanupInterval);
    
    return () => {
      clearInterval(interval);
      cleanup();
    };
  }, [checkMemoryUsage, cleanupCache, cleanupInterval, cleanup]);
  
  // Nettoyage au démontage du composant
  useEffect(() => {
    return cleanup;
  }, [cleanup]);
  
  return {
    addToCache,
    getFromCache,
    registerTimer,
    registerObserver,
    cleanup,
    checkMemoryUsage,
    getCacheSize: () => cacheRef.current.size,
    getTimersCount: () => timersRef.current.size,
    getObserversCount: () => observersRef.current.size
  };
}