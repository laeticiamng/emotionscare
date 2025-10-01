// @ts-nocheck
import { useEffect, useCallback, useRef } from 'react';
import { logProductionEvent } from '@/utils/consoleCleanup';

interface PerformanceMetrics {
  renderTime: number;
  memoryUsage: number;
  networkLatency: number;
  bundleSize: number;
}

interface PerformanceOptions {
  enableMetrics?: boolean;
  enableOptimizations?: boolean;
  threshold?: {
    renderTime: number;
    memoryUsage: number;
    networkLatency: number;
  };
}

const defaultOptions: PerformanceOptions = {
  enableMetrics: process.env.NODE_ENV === 'development',
  enableOptimizations: true,
  threshold: {
    renderTime: 16.67, // 60fps
    memoryUsage: 50 * 1024 * 1024, // 50MB
    networkLatency: 200 // 200ms
  }
};

/**
 * Advanced Performance Monitoring Hook
 * Features: Real-time metrics, automatic optimizations, memory management
 */
export const useOptimizedPerformance = (
  componentName: string,
  options: PerformanceOptions = {}
) => {
  const opts = { ...defaultOptions, ...options };
  const metricsRef = useRef<PerformanceMetrics>({
    renderTime: 0,
    memoryUsage: 0,
    networkLatency: 0,
    bundleSize: 0
  });
  const renderStartRef = useRef<number>(0);

  // Start performance measurement
  const startMeasurement = useCallback(() => {
    if (!opts.enableMetrics) return;
    renderStartRef.current = performance.now();
  }, [opts.enableMetrics]);

  // End performance measurement
  const endMeasurement = useCallback(() => {
    if (!opts.enableMetrics || !renderStartRef.current) return;
    
    const renderTime = performance.now() - renderStartRef.current;
    metricsRef.current.renderTime = renderTime;
    
    // Check if render time exceeds threshold
    if (renderTime > opts.threshold!.renderTime) {
      logProductionEvent(
        'Performance Warning',
        { component: componentName, renderTime, threshold: opts.threshold!.renderTime },
        'warn'
      );
    }
    
    renderStartRef.current = 0;
  }, [opts.enableMetrics, opts.threshold, componentName]);

  // Memory monitoring
  const checkMemoryUsage = useCallback(() => {
    if (!opts.enableMetrics || !(performance as any).memory) return;
    
    const memory = (performance as any).memory;
    const memoryUsage = memory.usedJSHeapSize;
    metricsRef.current.memoryUsage = memoryUsage;
    
    if (memoryUsage > opts.threshold!.memoryUsage) {
      logProductionEvent(
        'Memory Warning',
        { component: componentName, memoryUsage, threshold: opts.threshold!.memoryUsage },
        'warn'
      );
      
      // Trigger garbage collection hint
      if (opts.enableOptimizations && window.gc) {
        window.gc();
      }
    }
  }, [opts.enableMetrics, opts.enableOptimizations, opts.threshold, componentName]);

  // Network latency monitoring
  const measureNetworkLatency = useCallback(async (url: string) => {
    if (!opts.enableMetrics) return;
    
    const start = performance.now();
    try {
      await fetch(url, { method: 'HEAD', cache: 'no-cache' });
      const latency = performance.now() - start;
      metricsRef.current.networkLatency = latency;
      
      if (latency > opts.threshold!.networkLatency) {
        logProductionEvent(
          'Network Latency Warning',
          { component: componentName, latency, threshold: opts.threshold!.networkLatency },
          'warn'
        );
      }
    } catch (error) {
      logProductionEvent('Network Error', { component: componentName, error }, 'error');
    }
  }, [opts.enableMetrics, opts.threshold, componentName]);

  // Bundle size analysis
  const analyzeBundleSize = useCallback(() => {
    if (!opts.enableMetrics) return;
    
    // Estimate bundle size from resource timing
    const resources = performance.getEntriesByType('resource') as PerformanceResourceTiming[];
    const jsResources = resources.filter(r => r.name.includes('.js'));
    const totalSize = jsResources.reduce((acc, r) => acc + (r.transferSize || 0), 0);
    
    metricsRef.current.bundleSize = totalSize;
    
    if (totalSize > 1024 * 1024) { // 1MB threshold
      logProductionEvent(
        'Bundle Size Warning',
        { component: componentName, bundleSize: totalSize },
        'warn'
      );
    }
  }, [opts.enableMetrics, componentName]);

  // Image optimization
  const optimizeImages = useCallback(() => {
    if (!opts.enableOptimizations) return;
    
    const images = document.querySelectorAll('img');
    images.forEach(img => {
      // Add lazy loading if not present
      if (!img.loading) {
        img.loading = 'lazy';
      }
      
      // Add decoding optimization
      if (!img.decoding) {
        img.decoding = 'async';
      }
      
      // Check for missing alt attributes
      if (!img.alt && process.env.NODE_ENV === 'development') {
        logProductionEvent(
          'Accessibility Warning',
          { component: componentName, issue: 'Missing alt attribute', element: img.src },
          'warn'
        );
      }
    });
  }, [opts.enableOptimizations, componentName]);

  // Prefetch critical resources
  const prefetchResources = useCallback((urls: string[]) => {
    if (!opts.enableOptimizations) return;
    
    urls.forEach(url => {
      const link = document.createElement('link');
      link.rel = 'prefetch';
      link.href = url;
      document.head.appendChild(link);
    });
  }, [opts.enableOptimizations]);

  // Setup performance monitoring
  useEffect(() => {
    if (!opts.enableMetrics) return;
    
    const observer = new PerformanceObserver((list) => {
      list.getEntries().forEach((entry) => {
        if (entry.entryType === 'measure' && entry.name.includes(componentName)) {
          logProductionEvent('Performance Measure', {
            component: componentName,
            duration: entry.duration,
            startTime: entry.startTime
          });
        }
      });
    });
    
    observer.observe({ entryTypes: ['measure', 'navigation', 'resource'] });
    
    // Regular memory checks
    const memoryInterval = setInterval(checkMemoryUsage, 10000); // Every 10 seconds
    
    // Initial optimizations
    optimizeImages();
    analyzeBundleSize();
    
    return () => {
      observer.disconnect();
      clearInterval(memoryInterval);
    };
  }, [opts.enableMetrics, componentName, checkMemoryUsage, optimizeImages, analyzeBundleSize]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (opts.enableOptimizations) {
        // Clean up any intervals, observers, or cached data
        logProductionEvent('Component Cleanup', { component: componentName });
      }
    };
  }, [opts.enableOptimizations, componentName]);

  return {
    startMeasurement,
    endMeasurement,
    measureNetworkLatency,
    optimizeImages,
    prefetchResources,
    metrics: metricsRef.current,
    
    // Performance utilities
    debounce: (fn: Function, delay: number) => {
      let timeoutId: NodeJS.Timeout;
      return (...args: any[]) => {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => fn.apply(null, args), delay);
      };
    },
    
    throttle: (fn: Function, limit: number) => {
      let inThrottle: boolean;
      return (...args: any[]) => {
        if (!inThrottle) {
          fn.apply(null, args);
          inThrottle = true;
          setTimeout(() => inThrottle = false, limit);
        }
      };
    },
    
    // Memory management
    clearMemoryLeaks: () => {
      // Clear any potential memory leaks
      if (typeof window !== 'undefined' && window.gc) {
        window.gc();
      }
    }
  };
};