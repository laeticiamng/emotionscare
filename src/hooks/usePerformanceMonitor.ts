import { useEffect, useRef, useCallback } from 'react';

interface PerformanceMetrics {
  renderTime: number;
  componentName: string;
  timestamp: number;
}

export const usePerformanceMonitor = (componentName: string) => {
  const startTime = useRef<number>(Date.now());
  const metrics = useRef<PerformanceMetrics[]>([]);

  const measureRender = useCallback(() => {
    const renderTime = Date.now() - startTime.current;
    const metric: PerformanceMetrics = {
      renderTime,
      componentName,
      timestamp: Date.now()
    };
    
    metrics.current.push(metric);
    
    // Log slow renders in development
    if (import.meta.env.DEV && renderTime > 100) {
      console.warn(`🐌 Slow render detected: ${componentName} took ${renderTime}ms`);
    }
    
    // Keep only last 50 metrics
    if (metrics.current.length > 50) {
      metrics.current = metrics.current.slice(-50);
    }
  }, [componentName]);

  useEffect(() => {
    startTime.current = Date.now();
  });

  useEffect(() => {
    measureRender();
  });

  const getMetrics = useCallback(() => {
    return metrics.current.filter(m => m.componentName === componentName);
  }, [componentName]);

  const getAverageRenderTime = useCallback(() => {
    const componentMetrics = getMetrics();
    if (componentMetrics.length === 0) return 0;
    
    const total = componentMetrics.reduce((sum, metric) => sum + metric.renderTime, 0);
    return total / componentMetrics.length;
  }, [getMetrics]);

  return {
    getMetrics,
    getAverageRenderTime,
    measureRender
  };
};

export const useWebVitals = () => {
  useEffect(() => {
    if ('web-vitals' in window) return;

    const measureCLS = () => {
      let clsValue = 0;
      let clsEntries: any[] = [];

      const observer = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (!(entry as any).hadRecentInput) {
            const firstSessionEntry = clsEntries[0];
            const lastSessionEntry = clsEntries[clsEntries.length - 1];

            if (!firstSessionEntry || 
                (entry.startTime - lastSessionEntry.startTime < 1000 &&
                 entry.startTime - firstSessionEntry.startTime < 5000)) {
              clsEntries.push(entry);
              clsValue += (entry as any).value;
            } else {
              clsEntries = [entry];
              clsValue = (entry as any).value;
            }
          }
        }
        
        if (import.meta.env.DEV) {
          console.log('CLS:', clsValue);
        }
      });

      observer.observe({ entryTypes: ['layout-shift'] });
      return observer;
    };

    const measureLCP = () => {
      const observer = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        const lastEntry = entries[entries.length - 1];
        
        if (import.meta.env.DEV) {
          console.log('LCP:', lastEntry.startTime);
        }
      });

      observer.observe({ entryTypes: ['largest-contentful-paint'] });
      return observer;
    };

    const measureFID = () => {
      const observer = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (import.meta.env.DEV) {
            console.log('FID:', (entry as any).processingStart - entry.startTime);
          }
        }
      });

      observer.observe({ entryTypes: ['first-input'] });
      return observer;
    };

    const observers = [measureCLS(), measureLCP(), measureFID()];

    return () => {
      observers.forEach(observer => observer?.disconnect());
    };
  }, []);
};
