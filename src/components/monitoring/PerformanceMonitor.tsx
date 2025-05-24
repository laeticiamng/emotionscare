
import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface PerformanceMetrics {
  loadTime: number;
  renderTime: number;
  memoryUsage: number;
  fps: number;
}

const PerformanceMonitor: React.FC<{ enabled?: boolean }> = ({ enabled = false }) => {
  const [metrics, setMetrics] = useState<PerformanceMetrics | null>(null);

  useEffect(() => {
    if (!enabled || process.env.NODE_ENV !== 'development') return;

    const measurePerformance = () => {
      const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
      const memory = (performance as any).memory;

      setMetrics({
        loadTime: navigation.loadEventEnd - navigation.loadEventStart,
        renderTime: navigation.domContentLoadedEventEnd - navigation.domContentLoadedEventStart,
        memoryUsage: memory ? Math.round(memory.usedJSHeapSize / 1024 / 1024) : 0,
        fps: 60 // Simplified - would need more complex measurement for real FPS
      });
    };

    measurePerformance();
    const interval = setInterval(measurePerformance, 5000);

    return () => clearInterval(interval);
  }, [enabled]);

  if (!enabled || !metrics || process.env.NODE_ENV !== 'development') {
    return null;
  }

  const getPerformanceStatus = (value: number, thresholds: [number, number]) => {
    if (value < thresholds[0]) return 'good';
    if (value < thresholds[1]) return 'warning';
    return 'poor';
  };

  return (
    <Card className="fixed bottom-4 right-4 w-64 z-50 bg-background/95 backdrop-blur">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm">Performance Monitor</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        <div className="flex justify-between items-center">
          <span className="text-xs">Load Time:</span>
          <Badge variant={getPerformanceStatus(metrics.loadTime, [1000, 3000]) === 'good' ? 'default' : 'destructive'}>
            {metrics.loadTime.toFixed(0)}ms
          </Badge>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-xs">Render Time:</span>
          <Badge variant={getPerformanceStatus(metrics.renderTime, [500, 1500]) === 'good' ? 'default' : 'destructive'}>
            {metrics.renderTime.toFixed(0)}ms
          </Badge>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-xs">Memory:</span>
          <Badge variant={getPerformanceStatus(metrics.memoryUsage, [50, 100]) === 'good' ? 'default' : 'destructive'}>
            {metrics.memoryUsage}MB
          </Badge>
        </div>
      </CardContent>
    </Card>
  );
};

export default PerformanceMonitor;
