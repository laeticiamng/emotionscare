
import { useEffect, useCallback } from 'react';

/**
 * Hook pour le monitoring en production
 */
export const useProductionMonitoring = () => {
  
  /**
   * Monitore les performances Web Vitals
   */
  const monitorWebVitals = useCallback(() => {
    if (import.meta.env.PROD && 'web-vital' in window) {
      // Core Web Vitals monitoring
      import('web-vitals').then(({ getCLS, getFID, getFCP, getLCP, getTTFB }) => {
        getCLS(console.log);
        getFID(console.log);
        getFCP(console.log);
        getLCP(console.log);
        getTTFB(console.log);
      }).catch(() => {
        // Silently ignore if web-vitals not available
      });
    }
  }, []);

  /**
   * Monitore les erreurs JavaScript
   */
  const monitorErrors = useCallback(() => {
    if (import.meta.env.PROD) {
      window.addEventListener('error', (event) => {
        console.error('Global error:', {
          message: event.message,
          filename: event.filename,
          lineno: event.lineno,
          colno: event.colno,
          stack: event.error?.stack
        });
      });

      window.addEventListener('unhandledrejection', (event) => {
        console.error('Unhandled promise rejection:', {
          reason: event.reason,
          promise: event.promise
        });
      });
    }
  }, []);

  /**
   * Monitore les performances de navigation
   */
  const monitorNavigation = useCallback(() => {
    if (import.meta.env.PROD && 'performance' in window) {
      const observer = new PerformanceObserver((list) => {
        list.getEntries().forEach((entry) => {
          if (entry.entryType === 'navigation') {
            const navEntry = entry as PerformanceNavigationTiming;
            console.log('Navigation timing:', {
              domContentLoaded: navEntry.domContentLoadedEventEnd - navEntry.domContentLoadedEventStart,
              loadComplete: navEntry.loadEventEnd - navEntry.loadEventStart,
              firstPaint: navEntry.responseEnd - navEntry.requestStart
            });
          }
        });
      });

      observer.observe({ entryTypes: ['navigation'] });
    }
  }, []);

  /**
   * Monitore l'utilisation mémoire
   */
  const monitorMemory = useCallback(() => {
    if (import.meta.env.PROD && 'memory' in performance) {
      setInterval(() => {
        const memory = (performance as any).memory;
        if (memory) {
          const used = Math.round(memory.usedJSHeapSize / 1048576);
          const total = Math.round(memory.totalJSHeapSize / 1048576);
          
          // Alert si utilisation mémoire > 100MB
          if (used > 100) {
            console.warn(`High memory usage: ${used}MB / ${total}MB`);
          }
        }
      }, 30000); // Check every 30 seconds
    }
  }, []);

  useEffect(() => {
    monitorWebVitals();
    monitorErrors();
    monitorNavigation();
    monitorMemory();
  }, [monitorWebVitals, monitorErrors, monitorNavigation, monitorMemory]);

  return {
    isMonitoring: import.meta.env.PROD
  };
};
