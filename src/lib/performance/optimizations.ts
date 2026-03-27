// @ts-nocheck
/**
 * Performance optimizations for production
 */

import { logger, logPerformance } from '@/lib/logger';

// Bundle splitting and lazy loading
export const lazyLoad = (factory: () => Promise<any>, fallback?: React.ComponentType) => {
  return React.lazy(() => {
    const start = performance.now();
    return factory().then((module) => {
      const duration = performance.now() - start;
      logPerformance('Lazy Load', duration);
      return module;
    });
  });
};

// Image optimization
export const optimizeImage = (src: string, width?: number, height?: number): string => {
  if (!src) return '';
  
  // If it's already optimized or external, return as is
  if (src.includes('optimized') || src.startsWith('http')) {
    return src;
  }

  // Add optimization parameters
  const params = new URLSearchParams();
  if (width) params.set('w', width.toString());
  if (height) params.set('h', height.toString());
  params.set('q', '80'); // Quality
  params.set('f', 'webp'); // Format

  return `${src}?${params.toString()}`;
};

// Debounce for frequent operations
export const debounce = <T extends (...args: any[]) => any>(
  func: T,
  delay: number
): (...args: Parameters<T>) => void => {
  let timeoutId: NodeJS.Timeout;
  return (...args: Parameters<T>) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func(...args), delay);
  };
};

// Throttle for performance-critical operations
export const throttle = <T extends (...args: any[]) => any>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void => {
  let inThrottle: boolean;
  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
};

// Virtual scrolling helper
export const getVisibleRange = (
  scrollTop: number,
  itemHeight: number,
  containerHeight: number,
  totalItems: number,
  overscan = 3
) => {
  const startIndex = Math.max(0, Math.floor(scrollTop / itemHeight) - overscan);
  const endIndex = Math.min(
    totalItems - 1,
    Math.ceil((scrollTop + containerHeight) / itemHeight) + overscan
  );
  
  return { startIndex, endIndex };
};

// Memory management
export class MemoryManager {
  private static instance: MemoryManager;
  private cache = new Map<string, { data: any; timestamp: number; ttl: number }>();
  private readonly maxSize = 100;
  private readonly defaultTTL = 5 * 60 * 1000; // 5 minutes

  static getInstance(): MemoryManager {
    if (!MemoryManager.instance) {
      MemoryManager.instance = new MemoryManager();
    }
    return MemoryManager.instance;
  }

  set(key: string, data: any, ttl = this.defaultTTL): void {
    if (this.cache.size >= this.maxSize) {
      const oldestKey = this.cache.keys().next().value;
      this.cache.delete(oldestKey);
    }

    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      ttl,
    });
  }

  get(key: string): any | null {
    const entry = this.cache.get(key);
    if (!entry) return null;

    if (Date.now() - entry.timestamp > entry.ttl) {
      this.cache.delete(key);
      return null;
    }

    return entry.data;
  }

  clear(): void {
    this.cache.clear();
  }

  size(): number {
    return this.cache.size;
  }
}

// Performance monitoring
export class PerformanceTracker {
  private measurements = new Map<string, number>();

  startMeasurement(name: string): void {
    this.measurements.set(name, performance.now());
  }

  endMeasurement(name: string): number {
    const startTime = this.measurements.get(name);
    if (!startTime) {
      logger.warn(`No start time found for measurement: ${name}`, {}, 'PERF');
      return 0;
    }

    const duration = performance.now() - startTime;
    this.measurements.delete(name);
    
    logPerformance(name, duration);
    return duration;
  }

  measureAsync<T>(name: string, fn: () => Promise<T>): Promise<T> {
    this.startMeasurement(name);
    return fn().finally(() => {
      this.endMeasurement(name);
    });
  }

  measureSync<T>(name: string, fn: () => T): T {
    this.startMeasurement(name);
    try {
      return fn();
    } finally {
      this.endMeasurement(name);
    }
  }
}

export const perfTracker = new PerformanceTracker();
export const memoryManager = MemoryManager.getInstance();

// React performance hooks
export const useDebounce = <T>(value: T, delay: number): T => {
  const [debouncedValue, setDebouncedValue] = React.useState<T>(value);

  React.useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
};

export const useThrottle = <T>(value: T, limit: number): T => {
  const [throttledValue, setThrottledValue] = React.useState<T>(value);
  const lastRan = React.useRef(Date.now());

  React.useEffect(() => {
    const handler = setTimeout(() => {
      if (Date.now() - lastRan.current >= limit) {
        setThrottledValue(value);
        lastRan.current = Date.now();
      }
    }, limit - (Date.now() - lastRan.current));

    return () => {
      clearTimeout(handler);
    };
  }, [value, limit]);

  return throttledValue;
};

// Web Vitals tracking
export const trackWebVitals = () => {
  if (typeof window === 'undefined') return;

  // Track LCP (Largest Contentful Paint)
  const observer = new PerformanceObserver((list) => {
    for (const entry of list.getEntries()) {
      if (entry.entryType === 'largest-contentful-paint') {
        logPerformance('LCP', entry.startTime);
      }
      if (entry.entryType === 'first-input') {
        logPerformance('FID', (entry as any).processingStart - entry.startTime);
      }
    }
  });

  observer.observe({ entryTypes: ['largest-contentful-paint', 'first-input'] });

  // Track CLS (Cumulative Layout Shift)
  let clsValue = 0;
  const clsObserver = new PerformanceObserver((list) => {
    for (const entry of list.getEntries()) {
      if (!(entry as any).hadRecentInput) {
        clsValue += (entry as any).value;
      }
    }
    logPerformance('CLS', clsValue);
  });

  clsObserver.observe({ entryTypes: ['layout-shift'] });
};