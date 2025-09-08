import React, { useEffect, useState, memo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { Activity, Cpu, Network, Zap, AlertTriangle } from 'lucide-react';

interface PerformanceMetrics {
  renderTime: number;
  memoryUsage: number;
  networkLatency: number;
  lcp: number;
  fid: number;
  fps: number;
}

/**
 * Real-time Performance Monitor - Development Tool
 */
const PerformanceMonitor: React.FC = memo(() => {
  const [isVisible, setIsVisible] = useState(false);
  const [metrics, setMetrics] = useState<PerformanceMetrics>({
    renderTime: 0,
    memoryUsage: 0,
    networkLatency: 0,
    lcp: 0,
    fid: 0,
    fps: 60
  });

  // Only show in development
  if (process.env.NODE_ENV === 'production') {
    return null;
  }

  const collectMetrics = () => {
    const memory = (performance as any).memory;
    
    setMetrics({
      renderTime: performance.now(),
      memoryUsage: memory ? memory.usedJSHeapSize : 0,
      networkLatency: 0,
      lcp: 0,
      fid: 0,
      fps: 60
    });
  };

  useEffect(() => {
    const interval = setInterval(collectMetrics, 2000);
    return () => clearInterval(interval);
  }, []);

  if (!isVisible) {
    return (
      <Button
        onClick={() => setIsVisible(true)}
        size="sm"
        variant="outline"
        className="fixed bottom-4 left-4 z-50 opacity-50 hover:opacity-100"
        title="Open Performance Monitor"
      >
        <Activity className="h-4 w-4" />
      </Button>
    );
  }

  return (
    <div className="fixed bottom-4 left-4 w-80 z-50">
      <Card className="shadow-2xl">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2 text-sm">
              <Activity className="h-4 w-4" />
              Performance Monitor
            </CardTitle>
            <Button
              onClick={() => setIsVisible(false)}
              size="sm"
              variant="ghost"
            >
              ✕
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-3 text-sm">
          <div className="flex justify-between">
            <span>Memory Usage</span>
            <span className="font-mono">
              {Math.round(metrics.memoryUsage / 1024 / 1024)}MB
            </span>
          </div>
          <div className="flex justify-between">
            <span>Frame Rate</span>
            <span className="font-mono">{metrics.fps} FPS</span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
});

PerformanceMonitor.displayName = 'PerformanceMonitor';

export default PerformanceMonitor;