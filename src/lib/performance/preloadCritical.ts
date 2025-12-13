/**
 * Critical Resource Preloading & Performance Optimization
 * Optimise la rapidité d'affichage de chaque page
 */

import { logger } from '@/lib/logger';

// Routes critiques à précharger
const CRITICAL_ROUTES = [
  '/app/scan',
  '/app/journal',
  '/app/coach',
  '/app/music',
  '/app/breath',
] as const;

// Ressources statiques critiques
const CRITICAL_ASSETS = [
  '/fonts/inter-var.woff2',
  '/audio/default-ambient.mp3',
] as const;

/**
 * Précharge les ressources critiques pour un affichage rapide
 */
export function preloadCriticalResources(): void {
  if (typeof window === 'undefined') return;

  // Précharger les fonts critiques
  const fontLink = document.createElement('link');
  fontLink.rel = 'preload';
  fontLink.as = 'font';
  fontLink.type = 'font/woff2';
  fontLink.crossOrigin = 'anonymous';
  fontLink.href = CRITICAL_ASSETS[0];
  document.head.appendChild(fontLink);

  logger.debug('[Perf] Critical resources preloaded', {}, 'SYSTEM');
}

/**
 * Prefetch les routes pour navigation instantanée
 */
export function prefetchRoutes(routes: string[] = CRITICAL_ROUTES.slice()): void {
  if (typeof window === 'undefined') return;

  // Utiliser requestIdleCallback pour ne pas bloquer le thread principal
  const prefetch = () => {
    routes.forEach((route) => {
      const link = document.createElement('link');
      link.rel = 'prefetch';
      link.href = route;
      document.head.appendChild(link);
    });
  };

  if ('requestIdleCallback' in window) {
    requestIdleCallback(prefetch, { timeout: 2000 });
  } else {
    setTimeout(prefetch, 100);
  }
}

/**
 * Lazy load un composant avec IntersectionObserver
 */
export function lazyLoadOnVisible(
  element: HTMLElement,
  callback: () => void,
  options: IntersectionObserverInit = {}
): () => void {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          callback();
          observer.disconnect();
        }
      });
    },
    { rootMargin: '200px', threshold: 0.1, ...options }
  );

  observer.observe(element);

  return () => observer.disconnect();
}

/**
 * Debounce utility pour éviter les updates trop fréquents
 */
export function debounce<T extends (...args: unknown[]) => unknown>(
  fn: T,
  delay: number
): (...args: Parameters<T>) => void {
  let timeoutId: ReturnType<typeof setTimeout>;

  return (...args: Parameters<T>) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => fn(...args), delay);
  };
}

/**
 * Throttle utility pour limiter la fréquence d'exécution
 */
export function throttle<T extends (...args: unknown[]) => unknown>(
  fn: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle = false;

  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      fn(...args);
      inThrottle = true;
      setTimeout(() => {
        inThrottle = false;
      }, limit);
    }
  };
}

/**
 * Temps d'affichage minimum pour éviter les flashes
 */
export function minimumLoadingTime<T>(
  promise: Promise<T>,
  minMs: number = 300
): Promise<T> {
  const startTime = Date.now();

  return promise.then((result) => {
    const elapsed = Date.now() - startTime;
    const remaining = Math.max(0, minMs - elapsed);

    return new Promise<T>((resolve) => {
      setTimeout(() => resolve(result), remaining);
    });
  });
}

/**
 * Injecter CSS critique inline pour FCP rapide
 */
export function injectCriticalCSS(css: string): void {
  if (typeof document === 'undefined') return;

  const style = document.createElement('style');
  style.setAttribute('data-critical', 'true');
  style.textContent = css;
  
  // Insérer en premier
  const firstStyle = document.head.querySelector('style, link[rel="stylesheet"]');
  if (firstStyle) {
    document.head.insertBefore(style, firstStyle);
  } else {
    document.head.appendChild(style);
  }
}

/**
 * Optimisation des images avec blur placeholder
 */
export function optimizedImageLoad(
  img: HTMLImageElement,
  src: string,
  placeholderColor: string = '#e5e7eb'
): void {
  // Background placeholder
  img.style.backgroundColor = placeholderColor;
  img.style.transition = 'filter 0.3s ease';
  img.style.filter = 'blur(10px)';

  // Charger l'image
  const tempImg = new Image();
  tempImg.onload = () => {
    img.src = src;
    img.style.filter = 'none';
  };
  tempImg.onerror = () => {
    img.style.filter = 'none';
    logger.warn(`[Perf] Failed to load image: ${src}`, {}, 'SYSTEM');
  };
  tempImg.src = src;
}

/**
 * Observer les Core Web Vitals
 */
export function observeWebVitals(callback: (metric: { name: string; value: number }) => void): void {
  if (typeof window === 'undefined' || !('PerformanceObserver' in window)) return;

  try {
    // LCP
    const lcpObserver = new PerformanceObserver((list) => {
      const entries = list.getEntries();
      const lastEntry = entries[entries.length - 1];
      callback({ name: 'LCP', value: lastEntry.startTime });
    });
    lcpObserver.observe({ type: 'largest-contentful-paint', buffered: true });

    // FCP
    const fcpObserver = new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        if (entry.name === 'first-contentful-paint') {
          callback({ name: 'FCP', value: entry.startTime });
        }
      }
    });
    fcpObserver.observe({ type: 'paint', buffered: true });

    // CLS
    let clsValue = 0;
    const clsObserver = new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        if (!(entry as any).hadRecentInput) {
          clsValue += (entry as any).value;
          callback({ name: 'CLS', value: clsValue });
        }
      }
    });
    clsObserver.observe({ type: 'layout-shift', buffered: true });

  } catch (e) {
    logger.warn('[Perf] Web Vitals observation failed', e, 'SYSTEM');
  }
}

/**
 * Mesurer et logger le temps de render d'un composant
 */
export function measureComponentRender(componentName: string): () => number {
  const startTime = performance.now();

  return () => {
    const duration = performance.now() - startTime;
    
    if (duration > 50) {
      logger.warn(`[Perf] Slow render: ${componentName} took ${duration.toFixed(1)}ms`, {}, 'SYSTEM');
    }

    return duration;
  };
}

export default {
  preloadCriticalResources,
  prefetchRoutes,
  lazyLoadOnVisible,
  debounce,
  throttle,
  minimumLoadingTime,
  injectCriticalCSS,
  optimizedImageLoad,
  observeWebVitals,
  measureComponentRender,
};
