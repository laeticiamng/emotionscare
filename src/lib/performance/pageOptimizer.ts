/**
 * Page Optimizer - Utilitaires pour optimiser la rapidité d'affichage
 * Preloading, prefetching, lazy loading, cache intelligent
 */

import { logger } from '@/lib/logger';

// Routes critiques à précharger
const CRITICAL_ROUTES = [
  '/app/dashboard',
  '/app/journal',
  '/app/scan',
  '/app/music',
  '/app/coach',
  '/app/breath',
];

// Assets critiques à précharger
const CRITICAL_ASSETS: string[] = [];

/**
 * Précharge les routes critiques pour navigation instantanée
 */
export function prefetchCriticalRoutes(): void {
  if (typeof window === 'undefined') return;
  
  // Utiliser requestIdleCallback si disponible
  const schedule = window.requestIdleCallback || ((cb) => setTimeout(cb, 1));
  
  schedule(() => {
    CRITICAL_ROUTES.forEach(route => {
      const link = document.createElement('link');
      link.rel = 'prefetch';
      link.href = route;
      link.as = 'document';
      document.head.appendChild(link);
    });
    
    logger.debug('[PageOptimizer] Critical routes prefetched', { count: CRITICAL_ROUTES.length }, 'PERFORMANCE');
  });
}

/**
 * Précharge les assets critiques (fonts, images hero)
 */
export function preloadCriticalAssets(): void {
  if (typeof window === 'undefined') return;
  
  CRITICAL_ASSETS.forEach(asset => {
    const existing = document.querySelector(`link[href="${asset}"]`);
    if (existing) return;
    
    const link = document.createElement('link');
    link.rel = 'preload';
    link.href = asset;
    link.as = asset.endsWith('.woff2') ? 'font' : 'image';
    if (asset.endsWith('.woff2')) {
      link.crossOrigin = 'anonymous';
    }
    document.head.appendChild(link);
  });
}

/**
 * Configure le lazy loading intelligent pour images
 */
export function setupLazyLoading(): void {
  if (typeof window === 'undefined' || !('IntersectionObserver' in window)) return;
  
  const imageObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target as HTMLImageElement;
          const src = img.dataset.src;
          
          if (src) {
            img.src = src;
            img.removeAttribute('data-src');
            img.classList.add('loaded');
          }
          
          imageObserver.unobserve(img);
        }
      });
    },
    { rootMargin: '50px 0px', threshold: 0.01 }
  );
  
  // Observer toutes les images avec data-src
  document.querySelectorAll('img[data-src]').forEach(img => {
    imageObserver.observe(img);
  });
}

/**
 * Cache intelligent pour les données fréquemment utilisées
 */
class DataCache {
  private cache = new Map<string, { data: unknown; expires: number }>();
  private maxSize = 100;
  
  get<T>(key: string): T | null {
    const entry = this.cache.get(key);
    if (!entry) return null;
    
    if (Date.now() > entry.expires) {
      this.cache.delete(key);
      return null;
    }
    
    return entry.data as T;
  }
  
  set<T>(key: string, data: T, ttlMs: number = 5 * 60 * 1000): void {
    // Nettoyer si trop d'entrées
    if (this.cache.size >= this.maxSize) {
      const oldestKey = this.cache.keys().next().value;
      if (oldestKey) this.cache.delete(oldestKey);
    }
    
    this.cache.set(key, { data, expires: Date.now() + ttlMs });
  }
  
  invalidate(pattern?: string): void {
    if (!pattern) {
      this.cache.clear();
      return;
    }
    
    for (const key of this.cache.keys()) {
      if (key.includes(pattern)) {
        this.cache.delete(key);
      }
    }
  }
}

export const dataCache = new DataCache();

/**
 * Mesure et log les performances de page
 */
export function measurePagePerformance(pageName: string): () => void {
  const startTime = performance.now();
  
  return () => {
    const duration = performance.now() - startTime;
    logger.debug(`[Performance] ${pageName} rendered`, { durationMs: Math.round(duration) }, 'PERFORMANCE');
    
    // Reporter au Core Web Vitals si disponible
    if ('web-vital' in window) {
      // @ts-ignore
      window['web-vital']?.report?.({ name: 'page-render', value: duration, page: pageName });
    }
  };
}

/**
 * Optimise le First Contentful Paint avec CSS critique inline
 */
export function injectCriticalCSS(): void {
  if (typeof document === 'undefined') return;
  
  const criticalCSS = `
    body { opacity: 1 !important; }
    .skeleton { animation: pulse 1.5s ease-in-out infinite; }
    @keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.5; } }
  `;
  
  const style = document.createElement('style');
  style.id = 'critical-css';
  style.textContent = criticalCSS;
  document.head.insertBefore(style, document.head.firstChild);
}

/**
 * Diffère le chargement des scripts non-critiques
 */
export function deferNonCriticalScripts(): void {
  if (typeof document === 'undefined') return;
  
  // Charger analytics après interaction
  const loadAnalytics = () => {
    // Scripts analytics/tracking à charger après
    document.removeEventListener('scroll', loadAnalytics);
    document.removeEventListener('click', loadAnalytics);
  };
  
  document.addEventListener('scroll', loadAnalytics, { once: true, passive: true });
  document.addEventListener('click', loadAnalytics, { once: true });
}

/**
 * Hook d'initialisation à appeler au démarrage de l'app
 */
export function initializePerformanceOptimizations(): void {
  if (typeof window === 'undefined') return;
  
  // Optimisations immédiates
  injectCriticalCSS();
  preloadCriticalAssets();
  
  // Optimisations différées
  if (document.readyState === 'complete') {
    prefetchCriticalRoutes();
    setupLazyLoading();
    deferNonCriticalScripts();
  } else {
    window.addEventListener('load', () => {
      prefetchCriticalRoutes();
      setupLazyLoading();
      deferNonCriticalScripts();
    });
  }
  
  logger.info('[PageOptimizer] Performance optimizations initialized', {}, 'PERFORMANCE');
}

export default {
  prefetchCriticalRoutes,
  preloadCriticalAssets,
  setupLazyLoading,
  measurePagePerformance,
  initializePerformanceOptimizations,
  dataCache,
};
