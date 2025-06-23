
import { cacheManager } from './cacheManager';
import { lazy } from 'react';

// Lazy loading intelligent des composants
export const lazyLoadComponent = (importFn: () => Promise<any>, chunkName?: string) => {
  return lazy(async () => {
    const cacheKey = `component_${chunkName || 'unknown'}`;
    
    // Vérifier si le composant est en cache
    const cached = cacheManager.getStaticContent(cacheKey);
    if (cached) {
      return cached;
    }

    try {
      const module = await importFn();
      cacheManager.setStaticContent(cacheKey, module);
      return module;
    } catch (error) {
      console.error(`Failed to load component ${chunkName}:`, error);
      throw error;
    }
  });
};

// Préchargement des ressources critiques
export const preloadCriticalResources = async () => {
  const criticalResources = [
    '/images/logo.png',
    '/fonts/main.woff2',
    '/sounds/notification.mp3'
  ];

  const preloadPromises = criticalResources.map(resource => {
    return new Promise<void>((resolve) => {
      if (resource.endsWith('.png') || resource.endsWith('.jpg') || resource.endsWith('.webp')) {
        const img = new Image();
        img.onload = img.onerror = () => resolve();
        img.src = resource;
      } else if (resource.endsWith('.woff2') || resource.endsWith('.woff')) {
        const font = new FontFace('MainFont', `url(${resource})`);
        font.load().then(() => {
          document.fonts.add(font);
          resolve();
        }).catch(() => resolve());
      } else if (resource.endsWith('.mp3')) {
        const audio = new Audio();
        audio.oncanplaythrough = audio.onerror = () => resolve();
        audio.src = resource;
      } else {
        resolve();
      }
    });
  });

  await Promise.allSettled(preloadPromises);
};

// Mesure des Web Vitals
export const measureWebVitals = (): Promise<{[key: string]: number}> => {
  return new Promise((resolve) => {
    const vitals: {[key: string]: number} = {};
    
    // First Contentful Paint
    new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        if (entry.name === 'first-contentful-paint') {
          vitals.fcp = entry.startTime;
        }
      }
    }).observe({ entryTypes: ['paint'] });

    // Largest Contentful Paint
    new PerformanceObserver((list) => {
      const entries = list.getEntries();
      const lastEntry = entries[entries.length - 1];
      vitals.lcp = lastEntry.startTime;
    }).observe({ entryTypes: ['largest-contentful-paint'] });

    // Cumulative Layout Shift
    let clsValue = 0;
    new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        if (!(entry as any).hadRecentInput) {
          clsValue += (entry as any).value;
        }
      }
      vitals.cls = clsValue;
    }).observe({ entryTypes: ['layout-shift'] });

    // First Input Delay
    new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        vitals.fid = (entry as any).processingStart - entry.startTime;
      }
    }).observe({ entryTypes: ['first-input'] });

    // Résoudre après 3 secondes ou quand toutes les métriques sont collectées
    setTimeout(() => {
      resolve(vitals);
    }, 3000);
  });
};

// Optimisation des images avec intersection observer
export const createImageObserver = (callback: (entry: IntersectionObserverEntry) => void) => {
  if (!('IntersectionObserver' in window)) {
    return null;
  }

  return new IntersectionObserver((entries) => {
    entries.forEach(callback);
  }, {
    root: null,
    rootMargin: '50px',
    threshold: 0.1
  });
};

// Bundle analyzer leger
export const analyzeBundleSize = () => {
  if (process.env.NODE_ENV === 'development') {
    const scripts = Array.from(document.scripts);
    const totalSize = scripts.reduce((size, script) => {
      if (script.src && script.src.includes('/src/')) {
        // Estimation de la taille (approximation)
        return size + (script.innerHTML?.length || 1024);
      }
      return size;
    }, 0);

    console.log(`📦 Estimated bundle size: ${(totalSize / 1024).toFixed(2)} KB`);
  }
};

// Performance budget checker
export const checkPerformanceBudget = (metrics: {[key: string]: number}) => {
  const budgets = {
    fcp: 1500, // 1.5s
    lcp: 2500, // 2.5s
    cls: 0.1,  // 0.1
    fid: 100   // 100ms
  };

  const violations: string[] = [];

  Object.entries(budgets).forEach(([metric, budget]) => {
    if (metrics[metric] && metrics[metric] > budget) {
      violations.push(`${metric.toUpperCase()}: ${metrics[metric]}ms > ${budget}ms`);
    }
  });

  if (violations.length > 0) {
    console.warn('⚠️ Performance budget violations:', violations);
  } else {
    console.log('✅ All performance budgets met!');
  }

  return violations.length === 0;
};
