
import { useEffect, useRef, useState } from 'react';
import { performanceMonitor } from '@/lib/performance/performanceMonitor';

interface PerformanceMetrics {
  renderTime: number;
  memoryUsage?: number;
  componentMounts: number;
  rerenders: number;
}

export const usePerformanceMonitor = (componentName: string) => {
  const [metrics, setMetrics] = useState<PerformanceMetrics | null>(null);
  const mountTime = useRef<number>(Date.now());
  const renderCount = useRef<number>(0);
  const mountCount = useRef<number>(0);

  useEffect(() => {
    mountCount.current += 1;
    const startTime = performance.now();

    return () => {
      const endTime = performance.now();
      const renderTime = endTime - startTime;
      
      performanceMonitor.recordMetric(`${componentName}-render`, renderTime);
      
      setMetrics({
        renderTime,
        memoryUsage: (performance as any).memory?.usedJSHeapSize,
        componentMounts: mountCount.current,
        rerenders: renderCount.current
      });
    };
  }, [componentName]);

  useEffect(() => {
    renderCount.current += 1;
  });

  return metrics;
};

export const useProductionMonitoring = () => {
  const [isMonitoring, setIsMonitoring] = useState(false);

  useEffect(() => {
    if (import.meta.env.PROD) {
      setIsMonitoring(true);
      
      // Monitor critical performance metrics
      const observer = new PerformanceObserver((list) => {
        list.getEntries().forEach((entry) => {
          if (entry.entryType === 'largest-contentful-paint') {
            performanceMonitor.recordMetric('LCP', entry.startTime);
          }
          if (entry.entryType === 'first-input') {
            performanceMonitor.recordMetric('FID', entry.processingStart - entry.startTime);
          }
        });
      });

      observer.observe({ entryTypes: ['largest-contentful-paint', 'first-input'] });

      return () => {
        observer.disconnect();
        setIsMonitoring(false);
      };
    }
  }, []);

  return { isMonitoring };
};
