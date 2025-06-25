
import { useState, useEffect, useCallback } from 'react';

interface PerformanceMetrics {
  fcp?: number; // First Contentful Paint
  lcp?: number; // Largest Contentful Paint
  cls?: number; // Cumulative Layout Shift
  fid?: number; // First Input Delay
  renderTime: number;
  memoryUsage: number;
}

export const usePerformanceMonitor = () => {
  const [metrics, setMetrics] = useState<PerformanceMetrics>({
    renderTime: 0,
    memoryUsage: 0,
  });

  // Mesurer les Web Vitals
  const measureWebVitals = useCallback(() => {
    if ('performance' in window) {
      // Mesurer FCP et LCP
      const observer = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        entries.forEach((entry) => {
          if (entry.entryType === 'paint' && entry.name === 'first-contentful-paint') {
            setMetrics(prev => ({ ...prev, fcp: entry.startTime }));
          }
          if (entry.entryType === 'largest-contentful-paint') {
            setMetrics(prev => ({ ...prev, lcp: entry.startTime }));
          }
        });
      });

      observer.observe({ entryTypes: ['paint', 'largest-contentful-paint'] });

      // Mesurer la mémoire si disponible
      if ('memory' in performance) {
        const memoryInfo = (performance as any).memory;
        const memoryUsage = (memoryInfo.usedJSHeapSize / memoryInfo.totalJSHeapSize) * 100;
        setMetrics(prev => ({ ...prev, memoryUsage }));
      }
    }
  }, []);

  // Mesurer le temps de rendu
  const measureRenderTime = useCallback(() => {
    const startTime = performance.now();
    
    requestAnimationFrame(() => {
      const endTime = performance.now();
      const renderTime = endTime - startTime;
      setMetrics(prev => ({ ...prev, renderTime }));
    });
  }, []);

  useEffect(() => {
    measureWebVitals();
    measureRenderTime();

    // Nettoyer l'observer au démontage
    return () => {
      // Observer sera nettoyé automatiquement
    };
  }, [measureWebVitals, measureRenderTime]);

  return metrics;
};
