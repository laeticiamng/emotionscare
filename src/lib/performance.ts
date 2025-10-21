// @ts-nocheck
/**
 * Performance monitoring utilities for Web Vitals and bundle analysis
 */

import { logger } from '@/lib/logger';

type WebVitalsMetric = {
  name: string;
  value: number;
  rating: 'good' | 'needs-improvement' | 'poor';
  delta: number;
  id: string;
};

interface PerformanceMetric {
  name: string;
  value: number;
  rating?: string;
}

/**
 * Calculate rating based on metric thresholds
 */
function getRating(name: string, value: number): 'good' | 'needs-improvement' | 'poor' {
  const thresholds: Record<string, [number, number]> = {
    CLS: [0.1, 0.25],
    FID: [100, 300],
    FCP: [1800, 3000],
    LCP: [2500, 4000],
    TTFB: [800, 1800],
  };

  const [good, poor] = thresholds[name] || [1000, 3000];
  
  if (value <= good) return 'good';
  if (value <= poor) return 'needs-improvement';
  return 'poor';
}

/**
 * Report Web Vitals metrics to analytics
 */
function reportWebVitals(metric: PerformanceMetric): void {
  const { name, value } = metric;
  const rating = getRating(name, value);

  // Send to analytics
  if (window.va) {
    window.va.track('web_vitals', {
      metric: name,
      value: Math.round(value),
      rating,
    });
  }

  // Log in development
  if (import.meta.env.DEV) {
    logger.debug(`[Web Vitals] ${name}`, {
      value: `${Math.round(value)}ms`,
      rating,
    }, 'ANALYTICS');
  }

  // Send to Supabase for custom tracking
  if (typeof window !== 'undefined' && (window as any).supabase) {
    const supabase = (window as any).supabase;
    supabase.from('performance_metrics').insert({
      metric_name: name,
      metric_value: value,
      rating,
      timestamp: new Date().toISOString(),
      user_agent: navigator.userAgent,
      url: window.location.pathname,
    }).catch((err: Error) => {
      logger.warn('Failed to log performance metric', err, 'ANALYTICS');
    });
  }
}

/**
 * Initialize Web Vitals monitoring using native Performance APIs
 */
export function initPerformanceMonitoring(): void {
  if (typeof window === 'undefined') return;

  // Observe Core Web Vitals using PerformanceObserver
  try {
    // Cumulative Layout Shift (CLS)
    const clsObserver = new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        if ((entry as any).hadRecentInput) continue;
        reportWebVitals({
          name: 'CLS',
          value: (entry as any).value,
        });
      }
    });
    clsObserver.observe({ type: 'layout-shift', buffered: true });

    // Largest Contentful Paint (LCP)
    const lcpObserver = new PerformanceObserver((list) => {
      const entries = list.getEntries();
      const lastEntry = entries[entries.length - 1];
      reportWebVitals({
        name: 'LCP',
        value: lastEntry.startTime,
      });
    });
    lcpObserver.observe({ type: 'largest-contentful-paint', buffered: true });

    // First Input Delay (FID)
    const fidObserver = new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        reportWebVitals({
          name: 'FID',
          value: (entry as any).processingStart - entry.startTime,
        });
      }
    });
    fidObserver.observe({ type: 'first-input', buffered: true });

    // First Contentful Paint (FCP)
    const fcpObserver = new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        if (entry.name === 'first-contentful-paint') {
          reportWebVitals({
            name: 'FCP',
            value: entry.startTime,
          });
        }
      }
    });
    fcpObserver.observe({ type: 'paint', buffered: true });

    logger.info('[Performance] Web Vitals monitoring initialized', {}, 'SYSTEM');
  } catch (error) {
    logger.warn('[Performance] Failed to initialize monitoring', error as Error, 'SYSTEM');
  }
}

/**
 * Measure component render time
 */
export function measureRender(componentName: string): () => void {
  const start = performance.now();

  return () => {
    const duration = performance.now() - start;
    
    if (import.meta.env.DEV && duration > 16) {
      logger.warn(`[Performance] ${componentName} render took ${duration.toFixed(2)}ms (>16ms)`, {}, 'SYSTEM');
    }

    if (window.va) {
      window.va.track('component_render', {
        component: componentName,
        duration: Math.round(duration),
      });
    }
  };
}

/**
 * Get performance budget violations
 */
export function checkPerformanceBudget(): {
  violations: string[];
  passed: boolean;
} {
  const violations: string[] = [];
  
  // Check bundle size (if available)
  if (performance.getEntriesByType) {
    const resources = performance.getEntriesByType('resource') as PerformanceResourceTiming[];
    const totalSize = resources.reduce((sum, r) => sum + (r.transferSize || 0), 0);
    const totalSizeKB = Math.round(totalSize / 1024);

    if (totalSizeKB > 500) {
      violations.push(`Bundle size ${totalSizeKB}KB exceeds 500KB budget`);
    }
  }

  // Check FCP
  const fcpEntries = performance.getEntriesByName('first-contentful-paint');
  if (fcpEntries.length > 0) {
    const fcp = fcpEntries[0].startTime;
    if (fcp > 1500) {
      violations.push(`FCP ${Math.round(fcp)}ms exceeds 1500ms budget`);
    }
  }

  return {
    violations,
    passed: violations.length === 0,
  };
}

/**
 * Export performance report
 */
export function exportPerformanceReport(): string {
  const budget = checkPerformanceBudget();
  const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;

  const report = {
    timestamp: new Date().toISOString(),
    url: window.location.href,
    userAgent: navigator.userAgent,
    budget,
    timing: {
      dns: Math.round(navigation.domainLookupEnd - navigation.domainLookupStart),
      tcp: Math.round(navigation.connectEnd - navigation.connectStart),
      request: Math.round(navigation.responseStart - navigation.requestStart),
      response: Math.round(navigation.responseEnd - navigation.responseStart),
      dom: Math.round(navigation.domContentLoadedEventEnd - navigation.domContentLoadedEventStart),
      load: Math.round(navigation.loadEventEnd - navigation.loadEventStart),
    },
  };

  return JSON.stringify(report, null, 2);
}
