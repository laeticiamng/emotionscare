
import { useEffect } from 'react';

interface PerformanceMetrics {
  loadTime: number;
  renderTime: number;
  bundleSize?: number;
}

export const usePerformanceMonitoring = (componentName: string) => {
  useEffect(() => {
    const startTime = performance.now();

    // Monitor component mount time
    const observer = new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        if (entry.entryType === 'measure') {
          console.log(`${componentName} performance:`, {
            name: entry.name,
            duration: entry.duration,
            startTime: entry.startTime
          });
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

      console.log(`${componentName} mounted in ${loadTime.toFixed(2)}ms`);
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
      console.log('FCP:', entry.startTime);
    }
  }).observe({ entryTypes: ['paint'] });

  // LCP - Largest Contentful Paint
  new PerformanceObserver((list) => {
    for (const entry of list.getEntries()) {
      console.log('LCP:', entry.startTime);
    }
  }).observe({ entryTypes: ['largest-contentful-paint'] });
};
