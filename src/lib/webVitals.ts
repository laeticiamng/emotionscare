/**
 * Web Vitals Tracking pour EmotionsCare
 * Intégration avec Sentry pour monitoring production
 */

import * as Sentry from '@sentry/react';
import { logger } from '@/lib/logger';

export interface WebVitalMetric {
  name: 'CLS' | 'FID' | 'FCP' | 'LCP' | 'TTFB' | 'INP';
  value: number;
  rating: 'good' | 'needs-improvement' | 'poor';
  delta: number;
  id: string;
  navigationType: string;
}

/**
 * Seuils pour les Core Web Vitals (en ms ou score)
 */
const THRESHOLDS = {
  // Largest Contentful Paint (ms)
  LCP: {
    good: 2500,
    poor: 4000,
  },
  // First Input Delay (ms)
  FID: {
    good: 100,
    poor: 300,
  },
  // Cumulative Layout Shift (score)
  CLS: {
    good: 0.1,
    poor: 0.25,
  },
  // First Contentful Paint (ms)
  FCP: {
    good: 1800,
    poor: 3000,
  },
  // Time to First Byte (ms)
  TTFB: {
    good: 800,
    poor: 1800,
  },
  // Interaction to Next Paint (ms)
  INP: {
    good: 200,
    poor: 500,
  },
} as const;

/**
 * Calcule le rating d'une métrique
 */
function getRating(
  name: WebVitalMetric['name'],
  value: number
): WebVitalMetric['rating'] {
  const threshold = THRESHOLDS[name];
  
  if (value <= threshold.good) return 'good';
  if (value <= threshold.poor) return 'needs-improvement';
  return 'poor';
}

/**
 * Formate une valeur pour l'affichage
 */
function formatValue(name: WebVitalMetric['name'], value: number): string {
  if (name === 'CLS') {
    return value.toFixed(3);
  }
  return `${Math.round(value)}ms`;
}

/**
 * Envoie une métrique à Sentry
 */
function sendToSentry(metric: WebVitalMetric): void {
  // Envoyer comme mesure personnalisée
  Sentry.metrics.distribution(`web_vitals.${metric.name.toLowerCase()}`, metric.value, {
    unit: metric.name === 'CLS' ? 'none' : 'millisecond',
    tags: {
      rating: metric.rating,
      navigation_type: metric.navigationType,
    },
  });

  // Si la métrique est "poor", envoyer aussi un événement
  if (metric.rating === 'poor') {
    Sentry.captureMessage(`Poor Web Vital: ${metric.name}`, {
      level: 'warning',
      contexts: {
        webVital: {
          name: metric.name,
          value: metric.value,
          rating: metric.rating,
          id: metric.id,
          navigationType: metric.navigationType,
        },
      },
    });
  }

  logger.debug(
    `[Web Vitals] ${metric.name}: ${formatValue(metric.name, metric.value)} (${metric.rating})`,
    { metric },
    'ANALYTICS'
  );
}

/**
 * Envoie une métrique à l'Analytics backend (optionnel)
 */
async function sendToAnalytics(metric: WebVitalMetric): Promise<void> {
  if (!import.meta.env.VITE_ANALYTICS_ENDPOINT) {
    return;
  }

  try {
    await fetch(import.meta.env.VITE_ANALYTICS_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        type: 'web_vital',
        metric: {
          name: metric.name,
          value: metric.value,
          rating: metric.rating,
          id: metric.id,
          navigationType: metric.navigationType,
          timestamp: Date.now(),
          url: window.location.pathname,
          userAgent: navigator.userAgent,
        },
      }),
      // Ne pas bloquer la page
      keepalive: true,
    });
  } catch (error) {
    logger.warn('[Web Vitals] Failed to send to analytics', error as Error, 'ANALYTICS');
  }
}

/**
 * Handler pour traiter une métrique Web Vital
 */
function handleWebVital(metric: any): void {
  const webVitalMetric: WebVitalMetric = {
    name: metric.name,
    value: metric.value,
    rating: getRating(metric.name, metric.value),
    delta: metric.delta,
    id: metric.id,
    navigationType: metric.navigationType || 'unknown',
  };

  // Envoyer à Sentry
  sendToSentry(webVitalMetric);

  // Envoyer à l'Analytics backend (optionnel)
  sendToAnalytics(webVitalMetric);

  // Log en développement
  if (import.meta.env.DEV) {
    console.log(
      `%c[Web Vitals] ${webVitalMetric.name}`,
      `color: ${
        webVitalMetric.rating === 'good'
          ? 'green'
          : webVitalMetric.rating === 'needs-improvement'
          ? 'orange'
          : 'red'
      }; font-weight: bold`,
      formatValue(webVitalMetric.name, webVitalMetric.value),
      webVitalMetric.rating
    );
  }
}

/**
 * Initialise le tracking des Web Vitals
 * Charge dynamiquement la bibliothèque web-vitals
 */
export async function initWebVitals(): Promise<void> {
  try {
    // Import dynamique de web-vitals (via CDN si package non installé)
    const webVitalsModule = await import('web-vitals').catch(async () => {
      // Fallback: Charger depuis CDN
      const script = document.createElement('script');
      script.src = 'https://unpkg.com/web-vitals@3/dist/web-vitals.iife.js';
      script.async = true;
      
      await new Promise((resolve, reject) => {
        script.onload = resolve;
        script.onerror = reject;
        document.head.appendChild(script);
      });
      
      return (window as any).webVitals;
    });

    // Mesurer les Core Web Vitals
    webVitalsModule.onCLS(handleWebVital);
    webVitalsModule.onFID?.(handleWebVital); // FID deprecated, remplacé par INP
    webVitalsModule.onINP?.(handleWebVital); // Interaction to Next Paint (nouveau)
    webVitalsModule.onLCP(handleWebVital);
    webVitalsModule.onFCP(handleWebVital);
    webVitalsModule.onTTFB(handleWebVital);

    logger.info('[Web Vitals] Tracking initialized', {}, 'ANALYTICS');
  } catch (error) {
    logger.error(
      '[Web Vitals] Failed to initialize tracking',
      error as Error,
      'ANALYTICS'
    );
  }
}

/**
 * Observer manuel pour le GDPR Dashboard spécifiquement
 */
export function observeGDPRDashboardPerformance(): void {
  // Observer le chargement des graphiques Chart.js
  const observer = new PerformanceObserver((list) => {
    for (const entry of list.getEntries()) {
      if (entry.name.includes('chart') || entry.name.includes('gdpr')) {
        logger.debug(
          `[Performance] ${entry.name}: ${entry.duration.toFixed(2)}ms`,
          { entry },
          'ANALYTICS'
        );

        // Envoyer à Sentry si le temps est long
        if (entry.duration > 1000) {
          Sentry.metrics.distribution('gdpr_dashboard.chart_load', entry.duration, {
            unit: 'millisecond',
            tags: {
              component: entry.name,
              performance: entry.duration > 3000 ? 'poor' : 'slow',
            },
          });
        }
      }
    }
  });

  try {
    observer.observe({ entryTypes: ['measure', 'resource'] });
  } catch (error) {
    logger.warn('[Performance] Failed to observe', error as Error, 'ANALYTICS');
  }
}

/**
 * Mesure personnalisée pour un composant
 */
export function measureComponentRender(componentName: string, duration: number): void {
  Sentry.metrics.distribution('component.render_time', duration, {
    unit: 'millisecond',
    tags: {
      component: componentName,
      performance:
        duration < 100 ? 'good' : duration < 500 ? 'needs-improvement' : 'poor',
    },
  });

  if (import.meta.env.DEV) {
    console.log(`[Performance] ${componentName} rendered in ${duration.toFixed(2)}ms`);
  }
}

/**
 * Hook pour mesurer le temps de rendu d'un composant
 */
export function useComponentPerformance(componentName: string): () => void {
  const startTime = performance.now();

  return () => {
    const duration = performance.now() - startTime;
    measureComponentRender(componentName, duration);
  };
}
