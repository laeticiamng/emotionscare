import { useEffect } from 'react';
import { logger } from '@/lib/logger';

export const usePerformanceMonitoring = (componentName: string) => {
  useEffect(() => {
    const startTime = performance.now();

    // Monitor component mount time
    const observer = new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        if (entry.entryType === 'measure') {
          logger.debug(`${componentName} performance`, {
            name: entry.name,
            duration: entry.duration,
            startTime: entry.startTime
          }, 'SYSTEM');
        }
      }
    });

    observer.observe({ entryTypes: ['measure'] });

    return () => {
      const endTime = performance.now();
      const loadTime = endTime - startTime;
      
      performance.mark(`${componentName}-mount-end`);
      performance.measure(
        `${componentName}-mount-time`,
        `${componentName}-mount-start`, 
        `${componentName}-mount-end`
      );

      logger.info(`${componentName} mounted`, { loadTime: `${loadTime.toFixed(2)}ms` }, 'SYSTEM');
      observer.disconnect();
    };
  }, [componentName]);

  useEffect(() => {
    performance.mark(`${componentName}-mount-start`);
  }, []);
};

export const logWebVitals = () => {
  // Monitor Core Web Vitals
  if ('web-vital' in window) {
    return;
  }

  // FCP - First Contentful Paint
  new PerformanceObserver((list) => {
    for (const entry of list.getEntries()) {
      logger.debug('FCP', { startTime: entry.startTime }, 'SYSTEM');
    }
  }).observe({ entryTypes: ['paint'] });

  // LCP - Largest Contentful Paint
  new PerformanceObserver((list) => {
    for (const entry of list.getEntries()) {
      logger.debug('LCP', { startTime: entry.startTime }, 'SYSTEM');
    }
  }).observe({ entryTypes: ['largest-contentful-paint'] });
};
