interface PerformanceMetric {
  name: string;
  value: number;
  timestamp: number;
}

class PerformanceMonitor {
  private metrics: PerformanceMetric[] = [];
  private observer: PerformanceObserver | null = null;

  constructor() {
    this.initializeObserver();
  }

  private initializeObserver() {
    if (typeof window === 'undefined' || !('PerformanceObserver' in window)) {
      return;
    }

    this.observer = new PerformanceObserver((list) => {
      const entries = list.getEntries();
      entries.forEach((entry) => {
        this.recordMetric(entry.name, entry.duration || 0);
      });
    });

    this.observer.observe({ entryTypes: ['measure', 'navigation'] });
  }

  recordMetric(name: string, value: number) {
    this.metrics.push({
      name,
      value,
      timestamp: Date.now(),
    });

    // Keep only last 100 metrics to prevent memory leaks
    if (this.metrics.length > 100) {
      this.metrics = this.metrics.slice(-100);
    }
  }

  getMetrics() {
    return [...this.metrics];
  }

  getAverageMetric(name: string): number {
    const relevantMetrics = this.metrics.filter(m => m.name === name);
    if (relevantMetrics.length === 0) return 0;
    
    const sum = relevantMetrics.reduce((acc, m) => acc + m.value, 0);
    return sum / relevantMetrics.length;
  }

  measureFunction<T>(name: string, fn: () => T): T {
    const start = performance.now();
    const result = fn();
    const end = performance.now();
    
    this.recordMetric(name, end - start);
    return result;
  }

  async measureAsyncFunction<T>(name: string, fn: () => Promise<T>): Promise<T> {
    const start = performance.now();
    const result = await fn();
    const end = performance.now();
    
    this.recordMetric(name, end - start);
    return result;
  }

  getVitalMetrics() {
    return {
      averageRenderTime: this.getAverageMetric('component-render'),
      averageApiCall: this.getAverageMetric('api-call'),
      memoryUsage: this.getMemoryUsage(),
    };
  }

  private getMemoryUsage() {
    if ('memory' in performance) {
      return (performance as any).memory.usedJSHeapSize;
    }
    return 0;
  }

  clear() {
    this.metrics = [];
  }

  destroy() {
    if (this.observer) {
      this.observer.disconnect();
      this.observer = null;
    }
    this.clear();
  }
}

export const performanceMonitor = new PerformanceMonitor();
export default PerformanceMonitor;
