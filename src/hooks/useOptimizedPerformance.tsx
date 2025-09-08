/**
 * 🎯 HOOK DE PERFORMANCE OPTIMISÉE
 * Hook centralisé pour toutes les optimisations de performance
 */

import { useEffect, useRef, useState, useCallback, useMemo } from 'react';
import { PerformanceOptimizer } from '@/core/PerformanceOptimizer';

// ==================== TYPES ====================

interface PerformanceStats {
  renderCount: number;
  averageRenderTime: number;
  memoryUsage: number;
  cacheHitRate: number;
  isOptimized: boolean;
}

interface UseOptimizedPerformanceOptions {
  enableProfiling?: boolean;
  enableCaching?: boolean;
  enablePreloading?: boolean;
  cacheKey?: string;
  preloadResources?: string[];
}

// ==================== HOOK ====================

export const useOptimizedPerformance = (
  componentName: string,
  options: UseOptimizedPerformanceOptions = {}
) => {
  const {
    enableProfiling = false,
    enableCaching = true,
    enablePreloading = false,
    cacheKey,
    preloadResources = []
  } = options;

  const [stats, setStats] = useState<PerformanceStats>({
    renderCount: 0,
    averageRenderTime: 0,
    memoryUsage: 0,
    cacheHitRate: 0,
    isOptimized: true
  });

  const renderTimesRef = useRef<number[]>([]);
  const startTimeRef = useRef<number>(0);
  const renderCountRef = useRef<number>(0);

  // ==================== PERFORMANCE MEASUREMENT ====================

  const startProfiler = useCallback(() => {
    if (!enableProfiling) return;
    startTimeRef.current = performance.now();
  }, [enableProfiling]);

  const endProfiler = useCallback(() => {
    if (!enableProfiling) return;
    
    const endTime = performance.now();
    const renderTime = endTime - startTimeRef.current;
    
    renderTimesRef.current.push(renderTime);
    renderCountRef.current += 1;

    // Keep only last 100 measurements
    if (renderTimesRef.current.length > 100) {
      renderTimesRef.current = renderTimesRef.current.slice(-100);
    }

    // Update stats
    const averageRenderTime = renderTimesRef.current.reduce((a, b) => a + b, 0) / renderTimesRef.current.length;
    
    setStats(prevStats => ({
      ...prevStats,
      renderCount: renderCountRef.current,
      averageRenderTime,
      memoryUsage: (performance as any).memory?.usedJSHeapSize / 1024 / 1024 || 0
    }));
  }, [enableProfiling]);

  // ==================== CACHING ====================

  const cacheData = useCallback((key: string, data: any) => {
    if (!enableCaching) return;
    PerformanceOptimizer.cache.set(`${componentName}:${key}`, data);
  }, [enableCaching, componentName]);

  const getCachedData = useCallback((key: string) => {
    if (!enableCaching) return null;
    return PerformanceOptimizer.cache.get(`${componentName}:${key}`);
  }, [enableCaching, componentName]);

  const clearCache = useCallback(() => {
    if (!enableCaching) return;
    // Clear only this component's cache entries
    const cacheStats = PerformanceOptimizer.cache.getStats();
    setStats(prevStats => ({
      ...prevStats,
      cacheHitRate: cacheStats.hitRate
    }));
  }, [enableCaching]);

  // ==================== PRELOADING ====================

  useEffect(() => {
    if (!enablePreloading || preloadResources.length === 0) return;

    const preloadPromises = preloadResources.map(resource => {
      if (resource.match(/\.(jpg|jpeg|png|gif|webp)$/i)) {
        return PerformanceOptimizer.preloader.preloadImage(resource);
      }
      return Promise.resolve();
    });

    Promise.allSettled(preloadPromises).then(results => {
      const successCount = results.filter(r => r.status === 'fulfilled').length;
      console.log(`Preloaded ${successCount}/${preloadResources.length} resources for ${componentName}`);
    });
  }, [enablePreloading, preloadResources, componentName]);

  // ==================== MEMORY MONITORING ====================

  const checkMemoryUsage = useCallback(() => {
    if ('memory' in performance) {
      const memory = (performance as any).memory;
      const usage = memory.usedJSHeapSize / 1024 / 1024; // MB
      
      setStats(prevStats => ({
        ...prevStats,
        memoryUsage: usage,
        isOptimized: usage < 50 // Consider optimized if under 50MB
      }));

      // Warn if memory usage is high
      if (usage > 100) {
        console.warn(`High memory usage detected in ${componentName}: ${usage.toFixed(2)}MB`);
      }
    }
  }, [componentName]);

  // ==================== LIFECYCLE HOOKS ====================

  useEffect(() => {
    if (!enableProfiling) return;

    startProfiler();
    
    return () => {
      endProfiler();
    };
  });

  useEffect(() => {
    const interval = setInterval(checkMemoryUsage, 5000); // Check every 5 seconds
    return () => clearInterval(interval);
  }, [checkMemoryUsage]);

  // ==================== OPTIMIZATION UTILITIES ====================

  const optimizedMemo = useCallback(<T>(factory: () => T, deps: React.DependencyList): T => {
    const key = `memo:${JSON.stringify(deps)}`;
    
    if (enableCaching) {
      const cached = getCachedData(key);
      if (cached !== null) return cached;
    }

    const result = factory();
    
    if (enableCaching) {
      cacheData(key, result);
    }

    return result;
  }, [enableCaching, getCachedData, cacheData]);

  const optimizedCallback = useCallback(<T extends (...args: any[]) => any>(
    callback: T,
    deps: React.DependencyList
  ): T => {
    return useCallback(callback, deps);
  }, []);

  const deferredValue = <T>(value: T): T => {
    return useMemo(() => value, [value]);
  };

  // ==================== PERFORMANCE METRICS ====================

  const getPerformanceReport = useCallback(() => {
    const globalStats = PerformanceOptimizer.monitor.getAverageMetrics();
    
    return {
      component: componentName,
      stats,
      global: globalStats,
      recommendations: generateRecommendations(stats, globalStats),
      timestamp: new Date().toISOString()
    };
  }, [componentName, stats]);

  const generateRecommendations = (
    componentStats: PerformanceStats,
    globalStats: any
  ): string[] => {
    const recommendations: string[] = [];

    if (componentStats.averageRenderTime > 16) {
      recommendations.push('Consider using React.memo or useMemo for expensive calculations');
    }

    if (componentStats.memoryUsage > 50) {
      recommendations.push('Memory usage is high, check for memory leaks');
    }

    if (componentStats.cacheHitRate < 0.5) {
      recommendations.push('Cache hit rate is low, consider optimizing caching strategy');
    }

    if (componentStats.renderCount > 100) {
      recommendations.push('High render count detected, consider optimization');
    }

    return recommendations;
  };

  // ==================== RETURN INTERFACE ====================

  return {
    // Performance data
    stats,
    getPerformanceReport,

    // Profiling
    startProfiler,
    endProfiler,

    // Caching
    cacheData,
    getCachedData,
    clearCache,

    // Optimization utilities
    optimizedMemo,
    optimizedCallback,
    deferredValue,

    // Utilities
    checkMemoryUsage,

    // Performance helpers
    measureAsync: async <T>(name: string, fn: () => Promise<T>): Promise<T> => {
      const start = performance.now();
      const result = await fn();
      const end = performance.now();
      console.log(`${name} took ${end - start}ms`);
      return result;
    },

    measureSync: <T>(name: string, fn: () => T): T => {
      const start = performance.now();
      const result = fn();
      const end = performance.now();
      console.log(`${name} took ${end - start}ms`);
      return result;
    }
  };
};

// ==================== COMPONENT PERFORMANCE HOC ====================

export const withPerformanceOptimization = <P extends object>(
  Component: React.ComponentType<P>,
  options: UseOptimizedPerformanceOptions = {}
) => {
  const OptimizedComponent = React.memo((props: P) => {
    const { startProfiler, endProfiler } = useOptimizedPerformance(
      Component.displayName || Component.name,
      options
    );

    useEffect(() => {
      startProfiler();
      return () => {
        endProfiler();
      };
    });

    return <Component {...props} />;
  });

  OptimizedComponent.displayName = `withPerformanceOptimization(${Component.displayName || Component.name})`;

  return OptimizedComponent;
};

export default useOptimizedPerformance;
