// @ts-nocheck
import React from 'react';
import { logger } from '@/lib/logger';

// Mesure des Web Vitals
export const measureWebVitals = async (): Promise<Record<string, number>> => {
  return new Promise((resolve) => {
    const vitals: Record<string, number> = {};

    // First Contentful Paint
    if ('performance' in window && 'getEntriesByName' in performance) {
      const fcpEntry = performance.getEntriesByName('first-contentful-paint')[0];
      if (fcpEntry) {
        vitals.fcp = fcpEntry.startTime;
      }
    }

    // Largest Contentful Paint
    if ('PerformanceObserver' in window) {
      const observer = new PerformanceObserver((entryList) => {
        const entries = entryList.getEntries();
        const lastEntry = entries[entries.length - 1];
        vitals.lcp = lastEntry.startTime;
      });
      
      try {
        observer.observe({ entryTypes: ['largest-contentful-paint'] });
        setTimeout(() => observer.disconnect(), 3000);
      } catch (e) {
        logger.warn('LCP observation not supported', e as Error, 'SYSTEM');
      }
    }

    // Cumulative Layout Shift
    if ('PerformanceObserver' in window) {
      let clsValue = 0;
      const observer = new PerformanceObserver((entryList) => {
        for (const entry of entryList.getEntries()) {
          if (!(entry as any).hadRecentInput) {
            clsValue += (entry as any).value;
          }
        }
        vitals.cls = clsValue;
      });
      
      try {
        observer.observe({ entryTypes: ['layout-shift'] });
        setTimeout(() => observer.disconnect(), 3000);
      } catch (e) {
        logger.warn('CLS observation not supported', e as Error, 'SYSTEM');
      }
    }

    // First Input Delay simulation (approximation)
    let fidMeasured = false;
    const measureFID = () => {
      if (!fidMeasured) {
        const start = performance.now();
        setTimeout(() => {
          vitals.fid = performance.now() - start;
          fidMeasured = true;
        }, 0);
      }
    };

    document.addEventListener('click', measureFID, { once: true });
    document.addEventListener('keydown', measureFID, { once: true });

    // Retourner les résultats après 3 secondes
    setTimeout(() => {
      resolve(vitals);
    }, 3000);
  });
};

// Preload des ressources critiques
export const preloadCriticalResources = async (): Promise<void> => {
  const criticalResources = [
    { href: '/fonts/inter.woff2', as: 'font', type: 'font/woff2' },
    { href: '/images/logo.webp', as: 'image' },
    { href: '/api/user/profile', as: 'fetch' }
  ];

  const promises = criticalResources.map(resource => {
    return new Promise<void>((resolve) => {
      const link = document.createElement('link');
      link.rel = 'preload';
      link.href = resource.href;
      link.as = resource.as;
      if (resource.type) link.type = resource.type;
      
      link.onload = () => resolve();
      link.onerror = () => resolve(); // Continue même en cas d'erreur
      
      document.head.appendChild(link);
    });
  });

  await Promise.all(promises);
};

// Optimisation des images
export const optimizeImage = (src: string, width?: number, height?: number): string => {
  if (!src) return '';

  // Si c'est une URL complète, on la retourne telle quelle
  if (src.startsWith('http')) return src;

  // Construction de l'URL optimisée
  const params = new URLSearchParams();
  if (width) params.set('w', width.toString());
  if (height) params.set('h', height.toString());
  params.set('f', 'webp');
  params.set('q', '80');

  const queryString = params.toString();
  return queryString ? `${src}?${queryString}` : src;
};

// Lazy loading des composants
export const createLazyComponent = <T extends React.ComponentType<any>>(
  importFn: () => Promise<{ default: T }>
) => {
  return React.lazy(importFn);
};

// Débounce pour les recherches
export const debounce = <T extends (...args: any[]) => void>(
  func: T,
  wait: number
): T => {
  let timeout: NodeJS.Timeout;
  
  return ((...args: any[]) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  }) as T;
};

// Throttle pour les événements de scroll
export const throttle = <T extends (...args: any[]) => void>(
  func: T,
  limit: number
): T => {
  let inThrottle: boolean;
  
  return ((...args: any[]) => {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  }) as T;
};