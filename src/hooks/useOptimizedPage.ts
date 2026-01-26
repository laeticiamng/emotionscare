/**
 * useOptimizedPage - Hook pour optimiser automatiquement chaque page
 * Combine prefetch, preload, et mesure de performance
 */

import { useEffect, useRef, useCallback, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { preloadCriticalResources, prefetchRoutes, measureComponentRender, observeWebVitals } from '@/lib/performance/preloadCritical';
import { logger } from '@/lib/logger';

interface PagePerformanceMetrics {
  route: string;
  loadTime: number;
  fcp?: number;
  lcp?: number;
  cls?: number;
}

export function useOptimizedPage(pageName: string) {
  const location = useLocation();
  const mountTime = useRef(performance.now());
  const metricsRef = useRef<Partial<PagePerformanceMetrics>>({});

  // Mesurer le temps de mount
  useEffect(() => {
    const loadTime = performance.now() - mountTime.current;
    
    metricsRef.current = {
      route: location.pathname,
      loadTime,
    };

    // Logger si lent
    if (loadTime > 1000) {
      logger.warn(`[Page] ${pageName} slow load: ${loadTime.toFixed(0)}ms`, {}, 'SYSTEM');
    }

    // Précharger les routes adjacentes après le render
    const timer = setTimeout(() => {
      prefetchRoutes();
    }, 1000);

    return () => clearTimeout(timer);
  }, [location.pathname, pageName]);

  // Observer les Web Vitals pour cette page
  useEffect(() => {
    observeWebVitals((metric) => {
      metricsRef.current[metric.name.toLowerCase() as 'fcp' | 'lcp' | 'cls'] = metric.value;
    });
  }, []);

  // Précharger les ressources critiques au premier render
  useEffect(() => {
    preloadCriticalResources();
  }, []);

  // Fonction pour mesurer un sous-composant
  const measureSubComponent = useCallback((componentName: string) => {
    return measureComponentRender(`${pageName}/${componentName}`);
  }, [pageName]);

  // Récupérer les métriques finales
  const getMetrics = useCallback((): PagePerformanceMetrics => {
    return {
      route: location.pathname,
      loadTime: metricsRef.current.loadTime || 0,
      fcp: metricsRef.current.fcp,
      lcp: metricsRef.current.lcp,
      cls: metricsRef.current.cls,
    };
  }, [location.pathname]);

  return {
    measureSubComponent,
    getMetrics,
    isOptimized: true,
  };
}

/**
 * Hook simplifié pour les composants qui n'ont pas besoin de toutes les métriques
 */
export function useFastRender() {
  useEffect(() => {
    // Forcer le navigateur à flusher les styles avant le paint
    if (typeof window !== 'undefined') {
      void document.body.offsetHeight;
    }
  }, []);
}

/**
 * Hook pour précharger les données d'une page
 */
export function useDataPrefetch<T>(
  fetcher: () => Promise<T>,
  deps: unknown[] = []
): { data: T | null; isLoading: boolean; error: Error | null } {
  const [data, setData] = useState<T | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    let cancelled = false;

    const fetchData = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const result = await fetcher();
        if (!cancelled) {
          setData(result);
        }
      } catch (e) {
        if (!cancelled) {
          setError(e as Error);
        }
      } finally {
        if (!cancelled) {
          setIsLoading(false);
        }
      }
    };

    fetchData();

    return () => {
      cancelled = true;
    };
  }, deps);

  return { data, isLoading, error };
}

export default useOptimizedPage;
