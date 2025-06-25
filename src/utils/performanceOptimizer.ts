
// Utilitaires d'optimisation des performances

export const measureWebVitals = async (): Promise<{[key: string]: number}> => {
  const vitals: {[key: string]: number} = {};

  if (typeof window !== 'undefined' && 'performance' in window) {
    // First Contentful Paint
    const fcpEntries = performance.getEntriesByName('first-contentful-paint');
    if (fcpEntries.length > 0) {
      vitals.fcp = fcpEntries[0].startTime;
    }

    // Navigation timing
    const navEntries = performance.getEntriesByType('navigation') as PerformanceNavigationTiming[];
    if (navEntries.length > 0) {
      const nav = navEntries[0];
      vitals.domContentLoaded = nav.domContentLoadedEventEnd - nav.domContentLoadedEventStart;
      vitals.loadComplete = nav.loadEventEnd - nav.loadEventStart;
    }

    // Memory (si disponible)
    if ('memory' in performance) {
      const memory = (performance as any).memory;
      vitals.memoryPressure = memory.usedJSHeapSize / 1024 / 1024; // MB
    }
  }

  return vitals;
};

export const preloadCriticalResources = async (): Promise<void> => {
  // Précharger les ressources critiques
  const criticalResources = [
    '/index.css',
    '/favicon.ico'
  ];

  const promises = criticalResources.map(resource => {
    return new Promise((resolve, reject) => {
      const link = document.createElement('link');
      link.rel = 'preload';
      link.href = resource;
      link.as = resource.endsWith('.css') ? 'style' : 'image';
      link.onload = () => resolve(resource);
      link.onerror = () => reject(new Error(`Failed to preload ${resource}`));
      document.head.appendChild(link);
    });
  });

  try {
    await Promise.all(promises);
    console.log('✅ Critical resources preloaded');
  } catch (error) {
    console.warn('⚠️ Some resources failed to preload:', error);
  }
};

// Optimisation du lazy loading
export const createIntersectionObserver = (callback: IntersectionObserverCallback) => {
  if (typeof window === 'undefined' || !('IntersectionObserver' in window)) {
    return null;
  }

  return new IntersectionObserver(callback, {
    rootMargin: '50px',
    threshold: 0.1
  });
};

// Debounce pour optimiser les événements
export const debounce = <T extends (...args: any[]) => any>(
  func: T,
  wait: number
): ((...args: Parameters<T>) => void) => {
  let timeout: NodeJS.Timeout;
  
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
};

// Throttle pour limiter la fréquence d'exécution
export const throttle = <T extends (...args: any[]) => any>(
  func: T,
  limit: number
): ((...args: Parameters<T>) => void) => {
  let inThrottle: boolean;
  
  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
};
