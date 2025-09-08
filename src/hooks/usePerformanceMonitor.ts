import { useState, useEffect } from 'react';

interface PerformanceMetrics {
  renderTime: number;
  memoryUsage?: number;
  componentMountTime: number;
}

export const usePerformanceMonitor = (componentName: string): PerformanceMetrics | null => {
  const [metrics, setMetrics] = useState<PerformanceMetrics | null>(null);

  useEffect(() => {
    const startTime = performance.now();

    // Simuler des métriques de base
    const mockMetrics: PerformanceMetrics = {
      renderTime: 50,
      memoryUsage: 50 * 1024 * 1024, // 50MB
      componentMountTime: performance.now() - startTime
    };

    setMetrics(mockMetrics);
  }, [componentName]);

  return metrics;
};