/**
 * 🚀 OPTIMISEUR DE PERFORMANCES PREMIUM
 * Système avancé d'optimisation des performances
 */

import { startTransition, useDeferredValue, useMemo, useCallback } from 'react';

// ==================== TYPES ====================

export interface PerformanceMetrics {
  renderTime: number;
  memoryUsage: number;
  bundleSize: number;
  cacheHitRate: number;
  errorRate: number;
}

export interface OptimizationConfig {
  enableVirtualization: boolean;
  enableLazyLoading: boolean;
  enableCodeSplitting: boolean;
  enableImageOptimization: boolean;
  enableCaching: boolean;
  cacheStrategy: 'memory' | 'localStorage' | 'indexedDB';
  maxCacheSize: number;
}

// ==================== CACHE INTELLIGENT ====================

class IntelligentCache {
  private cache = new Map<string, { data: any; timestamp: number; hitCount: number }>();
  private maxSize: number;
  private ttl: number;

  constructor(maxSize = 1000, ttl = 300000) { // 5 min TTL
    this.maxSize = maxSize;
    this.ttl = ttl;
    this.startCleanupInterval();
  }

  set(key: string, data: any): void {
    if (this.cache.size >= this.maxSize) {
      this.evictLeastUsed();
    }

    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      hitCount: 0
    });
  }

  get(key: string): any {
    const item = this.cache.get(key);
    if (!item) return null;

    // Check TTL
    if (Date.now() - item.timestamp > this.ttl) {
      this.cache.delete(key);
      return null;
    }

    // Increment hit count for LRU
    item.hitCount++;
    return item.data;
  }

  has(key: string): boolean {
    return this.get(key) !== null;
  }

  delete(key: string): void {
    this.cache.delete(key);
  }

  clear(): void {
    this.cache.clear();
  }

  private evictLeastUsed(): void {
    let leastUsedKey = '';
    let minHits = Infinity;

    for (const [key, item] of this.cache) {
      if (item.hitCount < minHits) {
        minHits = item.hitCount;
        leastUsedKey = key;
      }
    }

    if (leastUsedKey) {
      this.cache.delete(leastUsedKey);
    }
  }

  private startCleanupInterval(): void {
    setInterval(() => {
      const now = Date.now();
      for (const [key, item] of this.cache) {
        if (now - item.timestamp > this.ttl) {
          this.cache.delete(key);
        }
      }
    }, 60000); // Cleanup every minute
  }

  getStats() {
    return {
      size: this.cache.size,
      maxSize: this.maxSize,
      hitRate: this.calculateHitRate()
    };
  }

  private calculateHitRate(): number {
    const totalHits = Array.from(this.cache.values())
      .reduce((sum, item) => sum + item.hitCount, 0);
    return this.cache.size > 0 ? totalHits / this.cache.size : 0;
  }
}

// ==================== RESOURCE PRELOADER ====================

class ResourcePreloader {
  private preloadQueue = new Set<string>();
  private loadedResources = new Set<string>();

  preloadImage(src: string, priority: 'high' | 'medium' | 'low' = 'medium'): Promise<void> {
    if (this.loadedResources.has(src)) {
      return Promise.resolve();
    }

    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => {
        this.loadedResources.add(src);
        this.preloadQueue.delete(src);
        resolve();
      };
      img.onerror = reject;
      img.src = src;
      
      // Set loading priority
      if ('loading' in img) {
        img.loading = priority === 'high' ? 'eager' : 'lazy';
      }
    });
  }

  preloadComponent(importFn: () => Promise<any>): Promise<any> {
    return importFn().catch(error => {
      console.warn('Failed to preload component:', error);
      return null;
    });
  }

  preloadRoute(routePath: string): void {
    if ('requestIdleCallback' in window) {
      window.requestIdleCallback(() => {
        const link = document.createElement('link');
        link.rel = 'prefetch';
        link.href = routePath;
        document.head.appendChild(link);
      });
    }
  }

  getStats() {
    return {
      queueSize: this.preloadQueue.size,
      loadedCount: this.loadedResources.size
    };
  }
}

// ==================== PERFORMANCE MONITOR ====================

class PerformanceMonitor {
  private metrics: PerformanceMetrics[] = [];
  private observers: PerformanceObserver[] = [];

  constructor() {
    this.setupObservers();
  }

  private setupObservers(): void {
    // Observe navigation timing
    if ('PerformanceObserver' in window) {
      const navObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        entries.forEach((entry) => {
          if (entry.entryType === 'navigation') {
            this.recordMetric({
              renderTime: entry.loadEventEnd - entry.loadEventStart,
              memoryUsage: this.getMemoryUsage(),
              bundleSize: this.getBundleSize(),
              cacheHitRate: globalCache.getStats().hitRate,
              errorRate: 0
            });
          }
        });
      });
      
      navObserver.observe({ entryTypes: ['navigation'] });
      this.observers.push(navObserver);

      // Observe paint timing
      const paintObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        entries.forEach((entry) => {
          if (entry.name === 'first-contentful-paint') {
            performance.mark('fcp', { detail: entry.startTime });
          }
        });
      });
      
      paintObserver.observe({ entryTypes: ['paint'] });
      this.observers.push(paintObserver);
    }
  }

  private recordMetric(metric: PerformanceMetrics): void {
    this.metrics.push(metric);
    
    // Keep only last 100 metrics
    if (this.metrics.length > 100) {
      this.metrics = this.metrics.slice(-100);
    }
  }

  private getMemoryUsage(): number {
    if ('memory' in performance) {
      return (performance as any).memory.usedJSHeapSize / 1024 / 1024; // MB
    }
    return 0;
  }

  private getBundleSize(): number {
    const scripts = Array.from(document.querySelectorAll('script[src]'));
    return scripts.reduce((size, script) => {
      const src = (script as HTMLScriptElement).src;
      return size + (src.includes('chunk') ? 1 : 0);
    }, 0);
  }

  getAverageMetrics(): PerformanceMetrics | null {
    if (this.metrics.length === 0) return null;

    const avg = this.metrics.reduce(
      (acc, metric) => ({
        renderTime: acc.renderTime + metric.renderTime,
        memoryUsage: acc.memoryUsage + metric.memoryUsage,
        bundleSize: acc.bundleSize + metric.bundleSize,
        cacheHitRate: acc.cacheHitRate + metric.cacheHitRate,
        errorRate: acc.errorRate + metric.errorRate
      }),
      { renderTime: 0, memoryUsage: 0, bundleSize: 0, cacheHitRate: 0, errorRate: 0 }
    );

    const count = this.metrics.length;
    return {
      renderTime: avg.renderTime / count,
      memoryUsage: avg.memoryUsage / count,
      bundleSize: avg.bundleSize / count,
      cacheHitRate: avg.cacheHitRate / count,
      errorRate: avg.errorRate / count
    };
  }

  dispose(): void {
    this.observers.forEach(observer => observer.disconnect());
    this.observers = [];
  }
}

// ==================== OPTIMIZATION HOOKS ====================

export const useOptimizedCallback = <T extends (...args: any[]) => any>(
  callback: T,
  deps: React.DependencyList
): T => {
  return useCallback(callback, deps);
};

export const useOptimizedMemo = <T>(
  factory: () => T,
  deps: React.DependencyList
): T => {
  return useMemo(factory, deps);
};

export const useDeferredState = <T>(value: T): T => {
  return useDeferredValue(value);
};

export const useTransition = () => {
  const [isPending, startOptimizedTransition] = React.useTransition();
  
  const optimizedStartTransition = useCallback((callback: () => void) => {
    startOptimizedTransition(() => {
      startTransition(callback);
    });
  }, [startOptimizedTransition]);

  return [isPending, optimizedStartTransition] as const;
};

// ==================== BATCH OPERATIONS ====================

export class BatchProcessor<T> {
  private queue: T[] = [];
  private batchSize: number;
  private processingFn: (batch: T[]) => Promise<void>;
  private timer: NodeJS.Timeout | null = null;

  constructor(
    processingFn: (batch: T[]) => Promise<void>,
    batchSize = 10,
    delay = 100
  ) {
    this.processingFn = processingFn;
    this.batchSize = batchSize;
  }

  add(item: T): void {
    this.queue.push(item);
    
    if (this.queue.length >= this.batchSize) {
      this.flush();
    } else if (!this.timer) {
      this.timer = setTimeout(() => this.flush(), 100);
    }
  }

  private async flush(): Promise<void> {
    if (this.timer) {
      clearTimeout(this.timer);
      this.timer = null;
    }

    if (this.queue.length === 0) return;

    const batch = this.queue.splice(0, this.batchSize);
    try {
      await this.processingFn(batch);
    } catch (error) {
      console.error('Batch processing failed:', error);
    }
  }

  async flushAll(): Promise<void> {
    while (this.queue.length > 0) {
      await this.flush();
    }
  }
}

// ==================== EXPORTS ====================

export const globalCache = new IntelligentCache();
export const resourcePreloader = new ResourcePreloader();
export const performanceMonitor = new PerformanceMonitor();

export const PerformanceOptimizer = {
  cache: globalCache,
  preloader: resourcePreloader,
  monitor: performanceMonitor,
  
  // Utility functions
  optimizeImage: (src: string, width?: number, height?: number) => {
    const url = new URL(src, window.location.origin);
    if (width) url.searchParams.set('w', width.toString());
    if (height) url.searchParams.set('h', height.toString());
    url.searchParams.set('q', '85'); // Quality
    url.searchParams.set('fm', 'webp'); // Format
    return url.toString();
  },

  debounce: <T extends (...args: any[]) => any>(
    func: T,
    delay: number
  ): ((...args: Parameters<T>) => void) => {
    let timeoutId: NodeJS.Timeout;
    return (...args: Parameters<T>) => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => func(...args), delay);
    };
  },

  throttle: <T extends (...args: any[]) => any>(
    func: T,
    limit: number
  ): ((...args: Parameters<T>) => void) => {
    let inThrottle: boolean;
    return (...args: Parameters<T>) => {
      if (!inThrottle) {
        func(...args);
        inThrottle = true;
        setTimeout(() => (inThrottle = false), limit);
      }
    };
  },

  createMemoizedSelector: <T, R>(
    selector: (state: T) => R
  ) => {
    let lastInput: T;
    let lastOutput: R;
    
    return (input: T): R => {
      if (input !== lastInput) {
        lastInput = input;
        lastOutput = selector(input);
      }
      return lastOutput;
    };
  }
};

// Initialize performance monitoring
if (typeof window !== 'undefined') {
  // Mark app start
  performance.mark('app-start');
  
  // Cleanup on unload
  window.addEventListener('beforeunload', () => {
    performanceMonitor.dispose();
  });
}
