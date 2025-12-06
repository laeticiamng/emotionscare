
/**
 * Moniteur de performance pour l'application
 * Collecte et rapporte les métriques de performance clés
 */

interface PerformanceMetrics {
  loadTime: number;
  firstContentfulPaint: number;
  largestContentfulPaint: number;
  firstInputDelay: number;
  cumulativeLayoutShift: number;
  memoryUsage?: number;
}

interface PerformanceThresholds {
  loadTime: { good: number; poor: number };
  fcp: { good: number; poor: number };
  lcp: { good: number; poor: number };
  fid: { good: number; poor: number };
  cls: { good: number; poor: number };
}

class PerformanceMonitor {
  private metrics: Partial<PerformanceMetrics> = {};
  private thresholds: PerformanceThresholds = {
    loadTime: { good: 1000, poor: 3000 },
    fcp: { good: 1800, poor: 3000 },
    lcp: { good: 2500, poor: 4000 },
    fid: { good: 100, poor: 300 },
    cls: { good: 0.1, poor: 0.25 }
  };

  constructor() {
    this.initializeMonitoring();
  }

  private initializeMonitoring(): void {
    if (typeof window === 'undefined') return;

    // Observer pour les Core Web Vitals
    this.observeWebVitals();
    
    // Mesures de navigation
    this.measureNavigationTiming();
    
    // Mesures de mémoire si disponibles
    this.measureMemoryUsage();
  }

  private observeWebVitals(): void {
    // First Contentful Paint
    new PerformanceObserver((list) => {
      const entries = list.getEntries();
      const fcp = entries.find(entry => entry.name === 'first-contentful-paint');
      if (fcp) {
        this.metrics.firstContentfulPaint = fcp.startTime;
      }
    }).observe({ entryTypes: ['paint'] });

    // Largest Contentful Paint
    new PerformanceObserver((list) => {
      const entries = list.getEntries();
      const lastEntry = entries[entries.length - 1];
      this.metrics.largestContentfulPaint = lastEntry.startTime;
    }).observe({ entryTypes: ['largest-contentful-paint'] });

    // First Input Delay
    new PerformanceObserver((list) => {
      const entries = list.getEntries();
      const firstInput = entries[0];
      if (firstInput) {
        this.metrics.firstInputDelay = firstInput.processingStart - firstInput.startTime;
      }
    }).observe({ entryTypes: ['first-input'] });

    // Cumulative Layout Shift
    let clsValue = 0;
    new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        if (!(entry as any).hadRecentInput) {
          clsValue += (entry as any).value;
        }
      }
      this.metrics.cumulativeLayoutShift = clsValue;
    }).observe({ entryTypes: ['layout-shift'] });
  }

  private measureNavigationTiming(): void {
    window.addEventListener('load', () => {
      const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
      if (navigation) {
        this.metrics.loadTime = navigation.loadEventEnd - navigation.loadEventStart;
      }
    });
  }

  private measureMemoryUsage(): void {
    if ('memory' in performance) {
      const memory = (performance as any).memory;
      this.metrics.memoryUsage = Math.round(memory.usedJSHeapSize / 1024 / 1024); // MB
    }
  }

  /**
   * Obtient les métriques actuelles
   */
  public getMetrics(): Partial<PerformanceMetrics> {
    return { ...this.metrics };
  }

  /**
   * Évalue la performance selon les seuils
   */
  public getPerformanceScore(): {
    overall: 'good' | 'needs-improvement' | 'poor';
    details: Record<string, 'good' | 'needs-improvement' | 'poor'>;
  } {
    const details: Record<string, 'good' | 'needs-improvement' | 'poor'> = {};
    
    // Évaluer chaque métrique
    if (this.metrics.loadTime !== undefined) {
      details.loadTime = this.evaluateMetric(this.metrics.loadTime, this.thresholds.loadTime);
    }
    if (this.metrics.firstContentfulPaint !== undefined) {
      details.fcp = this.evaluateMetric(this.metrics.firstContentfulPaint, this.thresholds.fcp);
    }
    if (this.metrics.largestContentfulPaint !== undefined) {
      details.lcp = this.evaluateMetric(this.metrics.largestContentfulPaint, this.thresholds.lcp);
    }
    if (this.metrics.firstInputDelay !== undefined) {
      details.fid = this.evaluateMetric(this.metrics.firstInputDelay, this.thresholds.fid);
    }
    if (this.metrics.cumulativeLayoutShift !== undefined) {
      details.cls = this.evaluateMetric(this.metrics.cumulativeLayoutShift, this.thresholds.cls);
    }

    // Score global
    const scores = Object.values(details);
    const goodCount = scores.filter(s => s === 'good').length;
    const poorCount = scores.filter(s => s === 'poor').length;
    
    let overall: 'good' | 'needs-improvement' | 'poor';
    if (poorCount > 0) {
      overall = 'poor';
    } else if (goodCount >= scores.length * 0.75) {
      overall = 'good';
    } else {
      overall = 'needs-improvement';
    }

    return { overall, details };
  }

  private evaluateMetric(
    value: number, 
    threshold: { good: number; poor: number }
  ): 'good' | 'needs-improvement' | 'poor' {
    if (value <= threshold.good) return 'good';
    if (value <= threshold.poor) return 'needs-improvement';
    return 'poor';
  }

  /**
   * Rapporte les métriques (en développement seulement)
   */
  public reportMetrics(): void {
    if (import.meta.env.DEV) {
      console.group('🔍 Performance Metrics');
      console.table(this.metrics);
      console.log('📊 Performance Score:', this.getPerformanceScore());
      console.groupEnd();
    }
  }

  /**
   * Marque un événement personnalisé
   */
  public markEvent(name: string): void {
    performance.mark(name);
  }

  /**
   * Mesure le temps entre deux marqueurs
   */
  public measureBetween(startMark: string, endMark: string, measureName: string): number {
    performance.measure(measureName, startMark, endMark);
    const measure = performance.getEntriesByName(measureName)[0];
    return measure ? measure.duration : 0;
  }
}

export const performanceMonitor = new PerformanceMonitor();

// Auto-report en développement
if (import.meta.env.DEV) {
  window.addEventListener('load', () => {
    setTimeout(() => performanceMonitor.reportMetrics(), 2000);
  });
}
