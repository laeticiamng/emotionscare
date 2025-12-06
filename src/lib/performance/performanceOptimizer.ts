// @ts-nocheck

import { logger } from '@/lib/logger';

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
      logger.warn('PerformanceObserver not supported', error as Error, 'SYSTEM');
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
      logger.debug(`📊 Navigation Timing`, {
        loadTime: `${loadTime.toFixed(2)}ms`,
        domTime: `${domTime.toFixed(2)}ms`,
        ttfb: `${(entry.responseStart - entry.requestStart).toFixed(2)}ms`
      }, 'ANALYTICS');
    }

    // Alertes de performance
    if (loadTime > 3000) {
      logger.warn('⚠️ Slow page load detected', { loadTime: `${loadTime.toFixed(2)}ms` }, 'SYSTEM');
    }
  }

  private analyzePaintTiming(entry: PerformanceEntry) {
    if (entry.name === 'first-contentful-paint') {
      const fcp = entry.startTime;
      if (import.meta.env.DEV) {
        logger.debug(`🎨 First Contentful Paint: ${fcp.toFixed(2)}ms`, {}, 'ANALYTICS');
      }
      
      if (fcp > 1500) {
        logger.warn('⚠️ Slow FCP detected', { fcp: `${fcp.toFixed(2)}ms` }, 'SYSTEM');
      }
    }
  }

  private analyzeLCP(entry: PerformanceEntry) {
    const lcp = entry.startTime;
    if (import.meta.env.DEV) {
      logger.debug(`🖼️ Largest Contentful Paint: ${lcp.toFixed(2)}ms`, {}, 'ANALYTICS');
    }
    
    if (lcp > 2500) {
      logger.warn('⚠️ Slow LCP detected', { lcp: `${lcp.toFixed(2)}ms` }, 'SYSTEM');
    }
  }

  private analyzeCLS(entry: any) {
    const cls = entry.value;
    if (import.meta.env.DEV) {
      logger.debug(`📐 Cumulative Layout Shift: ${cls.toFixed(4)}`, {}, 'ANALYTICS');
    }
    
    if (cls > 0.1) {
      logger.warn('⚠️ High CLS detected', { cls: cls.toFixed(4) }, 'SYSTEM');
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
    
    logger.info('🚀 Performance optimizations started', {}, 'SYSTEM');
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
