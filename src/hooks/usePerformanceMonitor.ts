
import { useEffect, useState } from 'react';

interface PerformanceMetrics {
  fcp: number | null; // First Contentful Paint
  lcp: number | null; // Largest Contentful Paint
  cls: number | null; // Cumulative Layout Shift
  fid: number | null; // First Input Delay
  renderTime: number;
  memoryUsage: number;
}

export const usePerformanceMonitor = () => {
  const [metrics, setMetrics] = useState<PerformanceMetrics>({
    fcp: null,
    lcp: null,
    cls: null,
    fid: null,
    renderTime: 0,
    memoryUsage: 0
  });

  useEffect(() => {
    const observer = new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        switch (entry.entryType) {
          case 'paint':
            if (entry.name === 'first-contentful-paint') {
              setMetrics(prev => ({ ...prev, fcp: entry.startTime }));
            }
            break;
          case 'largest-contentful-paint':
            setMetrics(prev => ({ ...prev, lcp: entry.startTime }));
            break;
          case 'layout-shift':
            if (!(entry as any).hadRecentInput) {
              setMetrics(prev => ({ 
                ...prev, 
                cls: (prev.cls || 0) + (entry as any).value 
              }));
            }
            break;
          case 'first-input':
            setMetrics(prev => ({ ...prev, fid: (entry as any).processingStart - entry.startTime }));
            break;
        }
      }
    });

    try {
      observer.observe({ entryTypes: ['paint', 'largest-contentful-paint', 'layout-shift', 'first-input'] });
    } catch (e) {
      console.warn('Performance observer not supported');
    }

    // Mesure du temps de rendu
    const renderStart = performance.now();
    
    const measureRender = () => {
      const renderEnd = performance.now();
      setMetrics(prev => ({ ...prev, renderTime: renderEnd - renderStart }));
    };

    // Mesure de la mémoire (si disponible)
    const measureMemory = () => {
      if ('memory' in performance) {
        const mem = (performance as any).memory;
        setMetrics(prev => ({ 
          ...prev, 
          memoryUsage: mem.usedJSHeapSize / 1048576 // MB
        }));
      }
    };

    const timeoutId = setTimeout(() => {
      measureRender();
      measureMemory();
    }, 100);

    // Log des métriques en développement
    if (process.env.NODE_ENV === 'development') {
      const logInterval = setInterval(() => {
        console.log('🚀 Performance Metrics:', metrics);
      }, 5000);

      return () => {
        clearInterval(logInterval);
        clearTimeout(timeoutId);
        observer.disconnect();
      };
    }

    return () => {
      clearTimeout(timeoutId);
      observer.disconnect();
    };
  }, []);

  return metrics;
};
