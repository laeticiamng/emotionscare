
interface PerformanceConfig {
  enableOptimizations: boolean;
  cacheStrategy: 'aggressive' | 'conservative' | 'disabled';
  imageOptimization: boolean;
  bundleOptimization: boolean;
}

class PerformanceOptimizer {
  private config: PerformanceConfig = {
    enableOptimizations: import.meta.env.PROD,
    cacheStrategy: 'conservative',
    imageOptimization: true,
    bundleOptimization: true
  };

  private performanceObserver: PerformanceObserver | null = null;

  constructor() {
    this.initPerformanceObserver();
  }

  private initPerformanceObserver() {
    if (typeof window === 'undefined' || !window.PerformanceObserver) return;

    try {
      this.performanceObserver = new PerformanceObserver((list) => {
        list.getEntries().forEach((entry) => {
          this.handlePerformanceEntry(entry);
        });
      });

      this.performanceObserver.observe({ 
        entryTypes: ['navigation', 'paint', 'largest-contentful-paint', 'layout-shift'] 
      });
    } catch (error) {
      console.warn('PerformanceObserver not supported:', error);
    }
  }

  private handlePerformanceEntry(entry: PerformanceEntry) {
    if (entry.entryType === 'navigation') {
      const navEntry = entry as PerformanceNavigationTiming;
      this.analyzeNavigationTiming(navEntry);
    } else if (entry.entryType === 'paint') {
      this.analyzePaintTiming(entry);
    } else if (entry.entryType === 'largest-contentful-paint') {
      this.analyzeLCP(entry);
    } else if (entry.entryType === 'layout-shift') {
      this.analyzeCLS(entry as any);
    }
  }

  private analyzeNavigationTiming(entry: PerformanceNavigationTiming) {
    const loadTime = entry.loadEventEnd - entry.loadEventStart;
    const domTime = entry.domContentLoadedEventEnd - entry.domContentLoadedEventStart;
    
    if (import.meta.env.DEV) {
      console.log(`📊 Navigation Timing:`, {
        loadTime: `${loadTime.toFixed(2)}ms`,
        domTime: `${domTime.toFixed(2)}ms`,
        ttfb: `${(entry.responseStart - entry.requestStart).toFixed(2)}ms`
      });
    }

    // Alertes de performance
    if (loadTime > 3000) {
      console.warn('⚠️ Slow page load detected:', `${loadTime.toFixed(2)}ms`);
    }
  }

  private analyzePaintTiming(entry: PerformanceEntry) {
    if (entry.name === 'first-contentful-paint') {
      const fcp = entry.startTime;
      if (import.meta.env.DEV) {
        console.log(`🎨 First Contentful Paint: ${fcp.toFixed(2)}ms`);
      }
      
      if (fcp > 1500) {
        console.warn('⚠️ Slow FCP detected:', `${fcp.toFixed(2)}ms`);
      }
    }
  }

  private analyzeLCP(entry: PerformanceEntry) {
    const lcp = entry.startTime;
    if (import.meta.env.DEV) {
      console.log(`🖼️ Largest Contentful Paint: ${lcp.toFixed(2)}ms`);
    }
    
    if (lcp > 2500) {
      console.warn('⚠️ Slow LCP detected:', `${lcp.toFixed(2)}ms`);
    }
  }

  private analyzeCLS(entry: any) {
    const cls = entry.value;
    if (import.meta.env.DEV) {
      console.log(`📐 Cumulative Layout Shift: ${cls.toFixed(4)}`);
    }
    
    if (cls > 0.1) {
      console.warn('⚠️ High CLS detected:', cls.toFixed(4));
    }
  }

  /**
   * Optimise les images automatiquement
   */
  optimizeImages() {
    if (!this.config.imageOptimization) return;

    const images = document.querySelectorAll('img[data-src]');
    const imageObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const img = entry.target as HTMLImageElement;
          const src = img.dataset.src;
          if (src) {
            img.src = src;
            img.removeAttribute('data-src');
            imageObserver.unobserve(img);
          }
        }
      });
    });

    images.forEach(img => imageObserver.observe(img));
  }

  /**
   * Précharge les ressources critiques
   */
  preloadCriticalResources() {
    const criticalResources = [
      '/fonts/Inter-Regular.woff2',
      '/images/logo.svg'
    ];

    criticalResources.forEach(resource => {
      const link = document.createElement('link');
      link.rel = 'preload';
      link.href = resource;
      link.as = resource.includes('.woff') ? 'font' : 'image';
      if (link.as === 'font') {
        link.crossOrigin = 'anonymous';
      }
      document.head.appendChild(link);
    });
  }

  /**
   * Démarre toutes les optimisations
   */
  startOptimizations() {
    if (!this.config.enableOptimizations) return;

    this.optimizeImages();
    this.preloadCriticalResources();
    
    console.log('🚀 Performance optimizations started');
  }

  /**
   * Nettoie les observateurs
   */
  cleanup() {
    if (this.performanceObserver) {
      this.performanceObserver.disconnect();
      this.performanceObserver = null;
    }
  }
}

export const performanceOptimizer = new PerformanceOptimizer();

// Auto-start en production
if (import.meta.env.PROD) {
  performanceOptimizer.startOptimizations();
}

// Cleanup lors du déchargement
if (typeof window !== 'undefined') {
  window.addEventListener('beforeunload', () => {
    performanceOptimizer.cleanup();
  });
}
