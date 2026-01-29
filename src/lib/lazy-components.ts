/**
 * Lazy Components - Code-splitting pour les modules lourds
 * Utilise React.lazy avec retry automatique
 */

import { lazy, ComponentType, LazyExoticComponent } from 'react';

// === UTILITY: Lazy with retry ===
function lazyWithRetry<T extends ComponentType<any>>(
  importFn: () => Promise<{ default: T }>,
  retries = 3,
  delay = 1000
): LazyExoticComponent<T> {
  return lazy(() => {
    const attempt = (retriesLeft: number): Promise<{ default: T }> => {
      return importFn().catch((error) => {
        if (retriesLeft <= 0) throw error;
        return new Promise((resolve) => setTimeout(resolve, delay)).then(() =>
          attempt(retriesLeft - 1)
        );
      });
    };
    return attempt(retries);
  });
}

// === AR Components ===
export const LazyARFilters = lazyWithRetry(
  () => import('@/components/ar/AREmotionFilters')
);

export const LazyARExperience = lazyWithRetry(
  () => import('@/components/ar/ARExperience')
);

// === PRELOAD FUNCTIONS ===
export const preloadAR = () => {
  import('@/components/ar/AREmotionFilters');
  import('@/components/ar/ARExperience');
};

// === CHUNK NAMES ===
export const chunkNames = {
  ar: 'feature-ar',
  charts: 'vendor-recharts',
} as const;

export default {
  LazyARFilters,
  LazyARExperience,
  preloadAR,
};
