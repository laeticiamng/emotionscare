// @ts-nocheck

import { logger } from '@/lib/logger';

// Monitoring de performance simple
interface PerformanceMetric {
  name: string;
  value: number;
  timestamp: number;
}

class PerformanceMonitor {
  private metrics: PerformanceMetric[] = [];
  private readonly maxMetrics = 100;

  recordMetric(name: string, value: number): void {
    this.metrics.push({
      name,
      value,
      timestamp: Date.now()
    });

    // Limiter le nombre de métriques stockées
    if (this.metrics.length > this.maxMetrics) {
      this.metrics.shift();
    }

    if (import.meta.env.DEV) {
      logger.debug(`📊 Performance: ${name} = ${value.toFixed(2)}ms`, {}, 'ANALYTICS');
    }
  }

  getMetrics(): PerformanceMetric[] {
    return [...this.metrics];
  }

  getAverageMetric(name: string): number {
    const filteredMetrics = this.metrics.filter(m => m.name === name);
    if (filteredMetrics.length === 0) return 0;
    
    const sum = filteredMetrics.reduce((acc, metric) => acc + metric.value, 0);
    return sum / filteredMetrics.length;
  }

  clearMetrics(): void {
    this.metrics = [];
  }
}

export const performanceMonitor = new PerformanceMonitor();
