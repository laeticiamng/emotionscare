// @ts-nocheck
import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { performanceMonitor } from '@/lib/performance/performanceMonitor';
import { globalCache } from '@/lib/cache/cacheManager';

interface PerformanceData {
  renderTime: number;
  apiCalls: number;
  memoryUsage: number;
  cacheStats: {
    size: number;
    maxSize: number;
    hitRate: number;
  };
}

const PerformanceMetrics: React.FC = () => {
  const [metrics, setMetrics] = useState<PerformanceData>({
    renderTime: 0,
    apiCalls: 0,
    memoryUsage: 0,
    cacheStats: { size: 0, maxSize: 0, hitRate: 0 },
  });

  useEffect(() => {
    const updateMetrics = () => {
      const vitals = performanceMonitor.getVitalMetrics();
      const cacheStats = globalCache.getStats();

      setMetrics({
        renderTime: vitals.averageRenderTime,
        apiCalls: vitals.averageApiCall,
        memoryUsage: vitals.memoryUsage,
        cacheStats,
      });
    };

    // Update metrics every 5 seconds
    const interval = setInterval(updateMetrics, 5000);
    updateMetrics(); // Initial update

    return () => clearInterval(interval);
  }, []);

  const formatBytes = (bytes: number): string => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
  };

  const getPerformanceBadge = (value: number, thresholds: [number, number]) => {
    if (value <= thresholds[0]) return 'default';
    if (value <= thresholds[1]) return 'secondary';
    return 'destructive';
  };

  // Only show in development
  if (process.env.NODE_ENV !== 'development') {
    return null;
  }

  return (
    <Card className="fixed bottom-4 right-4 w-80 z-50 opacity-80 hover:opacity-100 transition-opacity">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm">Métriques de Performance</CardTitle>
        <CardDescription className="text-xs">
          Surveillance en temps réel (dev only)
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-2 text-xs">
        <div className="flex justify-between items-center">
          <span>Rendu moyen:</span>
          <Badge variant={getPerformanceBadge(metrics.renderTime, [16, 33])}>
            {metrics.renderTime.toFixed(1)}ms
          </Badge>
        </div>
        
        <div className="flex justify-between items-center">
          <span>API moyen:</span>
          <Badge variant={getPerformanceBadge(metrics.apiCalls, [200, 500])}>
            {metrics.apiCalls.toFixed(1)}ms
          </Badge>
        </div>
        
        <div className="flex justify-between items-center">
          <span>Mémoire:</span>
          <Badge variant="outline">
            {formatBytes(metrics.memoryUsage)}
          </Badge>
        </div>
        
        <div className="flex justify-between items-center">
          <span>Cache:</span>
          <Badge variant="outline">
            {metrics.cacheStats.size}/{metrics.cacheStats.maxSize}
          </Badge>
        </div>
        
        <div className="pt-1 border-t text-xs text-muted-foreground">
          Actualisé toutes les 5s
        </div>
      </CardContent>
    </Card>
  );
};

export default PerformanceMetrics;
