
import React from 'react';

const PerformanceMonitor: React.FC = () => {
  const [metrics, setMetrics] = React.useState({
    renderTime: 0,
    memoryUsage: 0,
    loadTime: 0
  });

  React.useEffect(() => {
    // Surveillance des performances
    const observer = new PerformanceObserver((list) => {
      const entries = list.getEntries();
      entries.forEach((entry) => {
        if (entry.entryType === 'navigation') {
          setMetrics(prev => ({
            ...prev,
            loadTime: Math.round(entry.duration)
          }));
        }
      });
    });

    try {
      observer.observe({ entryTypes: ['navigation', 'measure'] });
    } catch (error) {
      console.log('Performance Observer not supported:', error);
    }

    // Mesure de la mémoire si disponible
    if ('memory' in performance) {
      const memory = (performance as any).memory;
      setMetrics(prev => ({
        ...prev,
        memoryUsage: Math.round(memory.usedJSHeapSize / 1024 / 1024)
      }));
    }

    return () => {
      try {
        observer.disconnect();
      } catch (error) {
        console.log('Observer disconnect failed:', error);
      }
    };
  }, []);

  if (process.env.NODE_ENV !== 'development') {
    return null;
  }

  return (
    <div className="fixed bottom-4 right-4 bg-black/80 text-white p-2 rounded text-xs z-50">
      <div>Load: {metrics.loadTime}ms</div>
      <div>Memory: {metrics.memoryUsage}MB</div>
    </div>
  );
};

export default PerformanceMonitor;
