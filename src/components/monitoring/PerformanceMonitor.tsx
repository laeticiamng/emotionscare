// @ts-nocheck
import React, { useEffect, useState } from 'react';
import { Activity } from 'lucide-react';
import { logger } from '@/lib/logger';

export const PerformanceMonitor: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [metrics, setMetrics] = useState({
    fcp: 0,
    lcp: 0,
    memoryUsage: 0
  });

  useEffect(() => {
    if (process.env.NODE_ENV !== 'development') return;

    const observer = new PerformanceObserver((list) => {
      const entries = list.getEntries();
      entries.forEach((entry) => {
        if (entry.name === 'first-contentful-paint') {
          setMetrics(prev => ({ ...prev, fcp: entry.startTime }));
        }
      });
    });
    
    try {
      observer.observe({ entryTypes: ['paint'] });
    } catch (error) {
      logger.warn('Performance Observer not supported', error as Error, 'SYSTEM');
    }

    return () => observer.disconnect();
  }, []);

  if (process.env.NODE_ENV !== 'development') return null;

  return (
    <>
      <button
        onClick={() => setIsVisible(!isVisible)}
        className="fixed bottom-20 right-4 z-40 p-2 bg-card border rounded-full shadow-lg"
        title="Performance"
      >
        <Activity className="h-4 w-4" />
      </button>

      {isVisible && (
        <div className="fixed bottom-32 right-4 z-40 w-64 bg-card border rounded-lg shadow-xl p-4">
          <h3 className="font-semibold mb-2">Performance</h3>
          <div className="text-xs space-y-1">
            <div>FCP: {Math.round(metrics.fcp)}ms</div>
            <div>LCP: {Math.round(metrics.lcp)}ms</div>
          </div>
        </div>
      )}
    </>
  );
};

export default PerformanceMonitor;