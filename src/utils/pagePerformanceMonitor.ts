
interface PageMetrics {
  route: string;
  loadTime: number;
  renderTime: number;
  interactionTime: number;
  timestamp: Date;
}

class PagePerformanceMonitor {
  private metrics: PageMetrics[] = [];
  private observers: PerformanceObserver[] = [];

  constructor() {
    this.initializeObservers();
  }

  private initializeObservers() {
    // Observer pour les métriques de navigation
    if ('PerformanceObserver' in window) {
      const navObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        entries.forEach((entry) => {
          if (entry.entryType === 'navigation') {
            const navEntry = entry as PerformanceNavigationTiming;
            this.recordMetric({
              route: window.location.pathname,
              loadTime: navEntry.loadEventEnd - navEntry.loadEventStart,
              renderTime: navEntry.domContentLoadedEventEnd - navEntry.domContentLoadedEventStart,
              interactionTime: navEntry.domInteractive - navEntry.fetchStart,
              timestamp: new Date()
            });
          }
        });
      });

      try {
        navObserver.observe({ entryTypes: ['navigation'] });
        this.observers.push(navObserver);
      } catch (error) {
        console.warn('Navigation timing observer not supported:', error);
      }
    }
  }

  private recordMetric(metric: PageMetrics) {
    this.metrics.push(metric);
    
    // Garder seulement les 100 dernières métriques
    if (this.metrics.length > 100) {
      this.metrics = this.metrics.slice(-100);
    }

    // Log des performances critiques
    if (metric.loadTime > 3000) {
      console.warn(`Slow page load detected: ${metric.route} took ${metric.loadTime}ms`);
    }
  }

  public getMetricsForRoute(route: string): PageMetrics[] {
    return this.metrics.filter(m => m.route === route);
  }

  public getAverageLoadTime(route?: string): number {
    const relevantMetrics = route 
      ? this.getMetricsForRoute(route)
      : this.metrics;
    
    if (relevantMetrics.length === 0) return 0;
    
    const totalTime = relevantMetrics.reduce((sum, m) => sum + m.loadTime, 0);
    return totalTime / relevantMetrics.length;
  }

  public getSlowestPages(limit: number = 5): Array<{route: string, averageTime: number}> {
    const routeGroups = this.metrics.reduce((groups, metric) => {
      if (!groups[metric.route]) {
        groups[metric.route] = [];
      }
      groups[metric.route].push(metric);
      return groups;
    }, {} as Record<string, PageMetrics[]>);

    return Object.entries(routeGroups)
      .map(([route, metrics]) => ({
        route,
        averageTime: metrics.reduce((sum, m) => sum + m.loadTime, 0) / metrics.length
      }))
      .sort((a, b) => b.averageTime - a.averageTime)
      .slice(0, limit);
  }

  public generateReport(): string {
    const totalPages = new Set(this.metrics.map(m => m.route)).size;
    const averageLoadTime = this.getAverageLoadTime();
    const slowestPages = this.getSlowestPages(3);

    return `
📊 RAPPORT DE PERFORMANCE DES PAGES

📈 Statistiques générales:
- Pages surveillées: ${totalPages}
- Temps de chargement moyen: ${averageLoadTime.toFixed(2)}ms
- Métriques collectées: ${this.metrics.length}

🐌 Pages les plus lentes:
${slowestPages.map(p => `- ${p.route}: ${p.averageTime.toFixed(2)}ms`).join('\n')}

🎯 Recommandations:
${averageLoadTime > 2000 ? '⚠️  Optimisation nécessaire: temps de chargement élevé' : '✅ Performances correctes'}
${slowestPages.length > 0 && slowestPages[0].averageTime > 3000 ? '🔧 Focus sur: ' + slowestPages[0].route : ''}
    `.trim();
  }

  public destroy() {
    this.observers.forEach(observer => observer.disconnect());
    this.observers = [];
    this.metrics = [];
  }
}

// Instance globale
export const performanceMonitor = new PagePerformanceMonitor();

// Hook React pour utiliser le monitoring
export const usePagePerformance = (routeName: string) => {
  React.useEffect(() => {
    const startTime = performance.now();
    
    return () => {
      const endTime = performance.now();
      console.log(`Page ${routeName} was active for ${endTime - startTime}ms`);
    };
  }, [routeName]);
};

// Fonction utilitaire pour marquer les événements personnalisés
export const markPageEvent = (eventName: string, route?: string) => {
  if ('performance' in window && 'mark' in performance) {
    const markName = `${route || window.location.pathname}:${eventName}`;
    performance.mark(markName);
  }
};

export default PagePerformanceMonitor;
