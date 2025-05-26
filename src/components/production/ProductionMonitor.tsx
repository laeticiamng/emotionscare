
import React, { useEffect, useState } from 'react';
import { performanceMonitor } from '@/lib/performance/performanceMonitor';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Activity, Zap, AlertTriangle } from 'lucide-react';

const ProductionMonitor: React.FC = () => {
  const [metrics, setMetrics] = useState(performanceMonitor.getVitalMetrics());
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setMetrics(performanceMonitor.getVitalMetrics());
    }, 5000);

    // Show monitor only if performance issues detected
    const hasIssues = metrics.averageRenderTime > 100 || 
                     (metrics.memoryUsage && metrics.memoryUsage > 50 * 1024 * 1024);
    setIsVisible(hasIssues);

    return () => clearInterval(interval);
  }, [metrics]);

  if (!isVisible || !import.meta.env.PROD) {
    return null;
  }

  const getPerformanceStatus = () => {
    if (metrics.averageRenderTime > 200) return { status: 'critical', color: 'destructive' };
    if (metrics.averageRenderTime > 100) return { status: 'warning', color: 'secondary' };
    return { status: 'good', color: 'default' };
  };

  const status = getPerformanceStatus();

  return (
    <div className="fixed bottom-4 right-4 z-50 max-w-sm">
      <Card className="border-l-4 border-l-primary">
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center gap-2 text-sm">
            <Activity className="h-4 w-4" />
            Performance Monitor
            <Badge variant={status.color as any}>{status.status}</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-0 space-y-2">
          <div className="flex items-center gap-2 text-xs">
            <Zap className="h-3 w-3" />
            <span>Render: {metrics.averageRenderTime.toFixed(1)}ms</span>
          </div>
          
          {metrics.memoryUsage && (
            <div className="flex items-center gap-2 text-xs">
              <AlertTriangle className="h-3 w-3" />
              <span>Memory: {(metrics.memoryUsage / 1024 / 1024).toFixed(1)}MB</span>
            </div>
          )}

          <div className="flex items-center gap-2 text-xs">
            <Activity className="h-3 w-3" />
            <span>API: {metrics.averageApiCall.toFixed(1)}ms</span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProductionMonitor;
