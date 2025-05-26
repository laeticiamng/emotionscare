
import { useState, useEffect } from 'react';

interface ProductionMetrics {
  isOnline: boolean;
  performance: number;
  errorCount: number;
}

export const useProductionMonitoring = () => {
  const [isMonitoring, setIsMonitoring] = useState(false);
  const [metrics, setMetrics] = useState<ProductionMetrics>({
    isOnline: navigator.onLine,
    performance: 0,
    errorCount: 0
  });

  useEffect(() => {
    if (import.meta.env.PROD) {
      setIsMonitoring(true);

      const updateOnlineStatus = () => {
        setMetrics(prev => ({ ...prev, isOnline: navigator.onLine }));
      };

      const measurePerformance = () => {
        if (performance.navigation) {
          const loadTime = performance.navigation.loadEventEnd - performance.navigation.navigationStart;
          setMetrics(prev => ({ ...prev, performance: loadTime }));
        }
      };

      window.addEventListener('online', updateOnlineStatus);
      window.addEventListener('offline', updateOnlineStatus);
      
      // Mesurer les performances après le chargement
      if (document.readyState === 'complete') {
        measurePerformance();
      } else {
        window.addEventListener('load', measurePerformance);
      }

      return () => {
        window.removeEventListener('online', updateOnlineStatus);
        window.removeEventListener('offline', updateOnlineStatus);
        window.removeEventListener('load', measurePerformance);
      };
    }
  }, []);

  return { isMonitoring, metrics };
};
