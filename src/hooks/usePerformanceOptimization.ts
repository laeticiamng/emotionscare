// @ts-nocheck
import { useCallback, useRef, useEffect, useState } from 'react';
import { logger } from '@/lib/logger';

interface PerformanceMetrics {
  renderTime: number;
  lastRender: number;
  renderCount: number;
}

export const usePerformanceOptimization = (componentName: string) => {
  const metricsRef = useRef<PerformanceMetrics>({
    renderTime: 0,
    lastRender: Date.now(),
    renderCount: 0,
  });

  // Mesure le temps de rendu
  const measureRender = useCallback(() => {
    const now = Date.now();
    const renderTime = now - metricsRef.current.lastRender;
    
    metricsRef.current = {
      renderTime,
      lastRender: now,
      renderCount: metricsRef.current.renderCount + 1,
    };

    // Log les performances en développement
    if (import.meta.env.DEV && renderTime > 100) {
      logger.warn(`Slow render detected in ${componentName}`, { renderTime: `${renderTime}ms` }, 'SYSTEM');
    }
  }, [componentName]);

  // Debounce pour éviter les re-rendus trop fréquents
  const debounce = useCallback((func: Function, delay: number) => {
    let timeoutId: NodeJS.Timeout;
    return (...args: any[]) => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => func.apply(null, args), delay);
    };
  }, []);

  // Memoization intelligente
  const memoize = useCallback(<T extends (...args: any[]) => any>(fn: T): T => {
    const cache = new Map();
    return ((...args: any[]) => {
      const key = JSON.stringify(args);
      if (cache.has(key)) {
        return cache.get(key);
      }
      const result = fn(...args);
      cache.set(key, result);
      return result;
    }) as T;
  }, []);

  useEffect(() => {
    measureRender();
  });

  return {
    measureRender,
    debounce,
    memoize,
    metrics: metricsRef.current,
  };
};

// Hook pour le lazy loading conditionnel des composants
export const useConditionalLazyLoad = (shouldLoad: boolean, importFn: () => Promise<any>) => {
  const [component, setComponent] = useState<React.ComponentType | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (shouldLoad && !component) {
      setLoading(true);
      importFn()
        .then((module) => {
          setComponent(() => module.default || module);
          setLoading(false);
        })
        .catch((error) => {
          logger.error('Lazy loading failed', error as Error, 'SYSTEM');
          setLoading(false);
        });
    }
  }, [shouldLoad, component, importFn]);

  return { component, loading };
};
