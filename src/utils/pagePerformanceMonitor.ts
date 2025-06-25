interface PerformanceMetrics {
  route: string;
  loadTime: number;
  timestamp: number;
}

class PagePerformanceMonitor {
  private metrics: Map<string, PerformanceMetrics[]> = new Map();
  private enrichedPages = [
    // Phase 1
    '/onboarding', '/preferences', '/notifications', '/breathwork', '/settings',
    // Phase 2  
    '/b2b', '/vr-galactique', '/mood-mixer', '/help-center', '/audit',
    // Phase 3
    '/boss-level-grit', '/bounce-back-battle', '/story-synth-lab', 
    '/screen-silk-break', '/flash-glow'
  ];

  recordPageLoad(route: string, loadTime: number) {
    const timestamp = Date.now();
    const metric = { route, loadTime, timestamp };

    if (this.metrics.has(route)) {
      this.metrics.get(route)?.push(metric);
    } else {
      this.metrics.set(route, [metric]);
    }

    console.log(`⏱️  Performance recorded for ${route}: ${loadTime}ms`);
  }

  getPageMetrics(route: string): PerformanceMetrics[] {
    return this.metrics.get(route) || [];
  }

  clearPageMetrics(route: string) {
    this.metrics.delete(route);
  }

  generateReport(): string {
    let report = '📊 RAPPORT DE PERFORMANCE GLOBAL\n';
    report += '=====================================\n';

    this.metrics.forEach((metrics, route) => {
      const avgLoadTime = metrics.reduce((sum, m) => sum + m.loadTime, 0) / metrics.length;
      report += `${route}: ${avgLoadTime.toFixed(2)}ms (${metrics.length} samples)\n`;
    });

    return report;
  }

  generateEnrichedPagesReport(): string {
    const enrichedMetrics = this.enrichedPages
      .map(page => this.getPageMetrics(page))
      .filter(metrics => metrics.length > 0);

    if (enrichedMetrics.length === 0) {
      return '📊 PAGES ENRICHIES - Aucune donnée de performance disponible';
    }

    const totalPages = enrichedMetrics.length;
    const avgLoadTime = enrichedMetrics.reduce((sum, pageMetrics) => {
      const avgPage = pageMetrics.reduce((s, m) => s + m.loadTime, 0) / pageMetrics.length;
      return sum + avgPage;
    }, 0) / totalPages;

    const fastPages = enrichedMetrics.filter(pageMetrics => {
      const avg = pageMetrics.reduce((s, m) => s + m.loadTime, 0) / pageMetrics.length;
      return avg < 2000;
    }).length;

    let report = '📊 RAPPORT PERFORMANCE PAGES ENRICHIES\n';
    report += '=====================================\n';
    report += `📈 Pages enrichies surveillées: ${totalPages}/15\n`;
    report += `⚡ Temps de chargement moyen: ${avgLoadTime.toFixed(0)}ms\n`;
    report += `🚀 Pages rapides (<2s): ${fastPages}/${totalPages} (${Math.round(fastPages/totalPages*100)}%)\n\n`;

    // Détail par phase
    const phases = {
      'Phase 1': this.enrichedPages.slice(0, 5),
      'Phase 2': this.enrichedPages.slice(5, 10), 
      'Phase 3': this.enrichedPages.slice(10, 15)
    };

    Object.entries(phases).forEach(([phase, pages]) => {
      report += `🔸 ${phase}:\n`;
      pages.forEach(page => {
        const metrics = this.getPageMetrics(page);
        if (metrics.length > 0) {
          const avg = metrics.reduce((s, m) => s + m.loadTime, 0) / metrics.length;
          const status = avg < 2000 ? '🟢' : avg < 4000 ? '🟡' : '🔴';
          report += `  ${status} ${page}: ${avg.toFixed(0)}ms\n`;
        }
      });
      report += '\n';
    });

    return report;
  }

  getSlowestPages(limit: number = 5): PerformanceMetrics[] {
    const allMetrics: PerformanceMetrics[] = [];
    this.metrics.forEach(metrics => allMetrics.push(...metrics));

    const sortedMetrics = allMetrics.sort((a, b) => b.loadTime - a.loadTime);
    return sortedMetrics.slice(0, limit);
  }

  clearAllMetrics() {
    this.metrics.clear();
  }
}

// Instance globale pour faciliter l'utilisation
export const performanceMonitor = new PagePerformanceMonitor();

// Fonction utilitaire pour enregistrer facilement les temps de chargement
export const recordPerformance = (route: string, loadTime: number) => {
  performanceMonitor.recordPageLoad(route, loadTime);
};
