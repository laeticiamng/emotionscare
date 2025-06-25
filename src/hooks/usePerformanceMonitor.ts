
import { useState, useEffect } from 'react';

interface PerformanceMetrics {
  fcp: number;
  lcp: number;
  cls: number;
  fid: number;
  renderTime: number;
  memoryUsage: number;
  bundleSize: number;
}

export const usePerformanceMonitor = () => {
  const [metrics, setMetrics] = useState<PerformanceMetrics>({
    fcp: 0,
    lcp: 0,
    cls: 0,
    fid: 0,
    renderTime: 0,
    memoryUsage: 0,
    bundleSize: 0,
  });

  useEffect(() => {
    // Mesurer les Web Vitals
    const measureWebVitals = () => {
      if ('performance' in window) {
        // First Contentful Paint
        const fcpEntry = performance.getEntriesByName('first-contentful-paint')[0];
        if (fcpEntry) {
          setMetrics(prev => ({ ...prev, fcp: fcpEntry.startTime }));
        }

        // Largest Contentful Paint
        const observer = new PerformanceObserver((list) => {
          const entries = list.getEntries();
          const lastEntry = entries[entries.length - 1];
          if (lastEntry) {
            setMetrics(prev => ({ ...prev, lcp: lastEntry.startTime }));
          }
        });

        try {
          observer.observe({ entryTypes: ['largest-contentful-paint'] });
        } catch (e) {
          console.warn('LCP observer not supported');
        }

        // Memory usage (approximation)
        if ('memory' in performance) {
          const memory = (performance as any).memory;
          const memoryUsage = (memory.usedJSHeapSize / memory.jsHeapSizeLimit) * 100;
          setMetrics(prev => ({ ...prev, memoryUsage }));
        }

        // Render time approximation
        const renderStart = performance.now();
        requestAnimationFrame(() => {
          const renderEnd = performance.now();
          setMetrics(prev => ({ ...prev, renderTime: renderEnd - renderStart }));
        });
      }
    };

    measureWebVitals();

    // Mesure périodique
    const interval = setInterval(measureWebVitals, 5000);

    return () => {
      clearInterval(interval);
    };
  }, []);

  return metrics;
};
