
import { useState, useEffect, useRef } from 'react';

interface PerformanceMetrics {
  renderTime: number;
  memoryUsage: number;
  loadTime: number;
  fcp: number; // First Contentful Paint
  lcp: number; // Largest Contentful Paint
  cls: number; // Cumulative Layout Shift
  fid: number; // First Input Delay
}

export const usePerformanceMonitor = (componentName: string) => {
  const [metrics, setMetrics] = useState<PerformanceMetrics | null>(null);
  const renderStartTime = useRef<number>(0);
  const mountTime = useRef<number>(0);

  useEffect(() => {
    mountTime.current = performance.now();
    renderStartTime.current = performance.now();

    // Mesurer les Web Vitals
    const measureWebVitals = () => {
      // First Contentful Paint
      const fcpEntry = performance.getEntriesByName('first-contentful-paint')[0] as PerformanceEntry;
      
      // Largest Contentful Paint
      const observer = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        const lcpEntry = entries[entries.length - 1];
        
        setMetrics(prev => ({
          ...prev!,
          lcp: lcpEntry.startTime
        }));
      });
      
      observer.observe({ entryTypes: ['largest-contentful-paint'] });

      // Memory usage (si supporté)
      const memory = (performance as any).memory;
      const memoryUsage = memory ? memory.usedJSHeapSize : 0;

      // Navigation timing
      const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
      const loadTime = navigation.loadEventEnd - navigation.loadEventStart;

      setMetrics({
        renderTime: performance.now() - renderStartTime.current,
        memoryUsage,
        loadTime,
        fcp: fcpEntry?.startTime || 0,
        lcp: 0, // Will be updated by observer
        cls: 0, // Simplified for now
        fid: 0  // Simplified for now
      });

      return () => observer.disconnect();
    };

    const cleanup = measureWebVitals();

    // Log performance metrics in development
    if (import.meta.env.DEV) {
      console.log(`🎯 Performance [${componentName}]:`, {
        renderTime: performance.now() - renderStartTime.current,
        memoryUsage: (performance as any).memory?.usedJSHeapSize || 0
      });
    }

    return cleanup;
  }, [componentName]);

  return metrics;
};
