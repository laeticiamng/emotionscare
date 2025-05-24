
import { useEffect, useRef, useState } from 'react';

interface PerformanceMetrics {
  loadTime: number;
  renderTime: number;
  memoryUsage?: number;
  isSlowNetwork: boolean;
}

/**
 * Hook pour monitorer les performances de l'application
 */
export const usePerformanceMonitor = (componentName?: string) => {
  const [metrics, setMetrics] = useState<PerformanceMetrics | null>(null);
  const renderStartTime = useRef<number>(performance.now());
  const mountTime = useRef<number>(performance.now());

  useEffect(() => {
    const renderEndTime = performance.now();
    const renderTime = renderEndTime - renderStartTime.current;
    
    // Détecter les connexions lentes
    const connection = (navigator as any).connection;
    const isSlowNetwork = connection ? 
      connection.effectiveType === 'slow-2g' || connection.effectiveType === '2g' : 
      false;

    // Mesurer l'utilisation mémoire (si disponible)
    const memoryUsage = (performance as any).memory?.usedJSHeapSize;
    
    // Temps de chargement depuis la navigation
    const loadTime = performance.now() - mountTime.current;

    const newMetrics: PerformanceMetrics = {
      loadTime,
      renderTime,
      memoryUsage,
      isSlowNetwork
    };

    setMetrics(newMetrics);

    // Log pour le monitoring
    if (componentName && (renderTime > 100 || loadTime > 1000)) {
      console.warn(`Performance warning for ${componentName}:`, newMetrics);
    }
  }, [componentName]);

  return metrics;
};
