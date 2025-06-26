
import React from 'react';

const PerformanceMonitor: React.FC = () => {
  const [metrics, setMetrics] = React.useState({
    renderTime: 0,
    memoryUsage: 0,
    loadTime: 0
  });

  React.useEffect(() => {
    if (typeof window === 'undefined' || typeof performance === 'undefined') {
      return;
    }

    try {
      // Surveillance des performances avec protection d'erreurs renforcée
      if ('PerformanceObserver' in window) {
        const observer = new PerformanceObserver((list) => {
          try {
            const entries = list.getEntries();
            entries.forEach((entry) => {
              if (entry.entryType === 'navigation') {
                setMetrics(prev => ({
                  ...prev,
                  loadTime: Math.round(entry.duration || 0)
                }));
              }
            });
          } catch (error) {
            console.log('⚠️ Performance entries processing failed:', error);
          }
        });

        try {
          observer.observe({ entryTypes: ['navigation', 'measure'] });
        } catch (error) {
          console.log('⚠️ Performance Observer setup failed:', error);
        }

        // Mesure de la mémoire si disponible
        try {
          if ('memory' in performance) {
            const memory = (performance as any).memory;
            if (memory && typeof memory.usedJSHeapSize === 'number') {
              setMetrics(prev => ({
                ...prev,
                memoryUsage: Math.round(memory.usedJSHeapSize / 1024 / 1024)
              }));
            }
          }
        } catch (error) {
          console.log('⚠️ Memory measurement failed:', error);
        }

        return () => {
          try {
            if (observer && typeof observer.disconnect === 'function') {
              observer.disconnect();
            }
          } catch (error) {
            console.log('⚠️ Observer disconnect failed:', error);
          }
        };
      }
    } catch (error) {
      console.log('⚠️ Performance monitoring setup failed:', error);
    }
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
