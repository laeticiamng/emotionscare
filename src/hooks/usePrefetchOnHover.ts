// @ts-nocheck
"use client";
/**
 * usePrefetchOnHover - Hook de préchargement au survol
 * Optimisation du chargement des ressources anticipé
 */

import * as React from "react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

/** Configuration du préchargement */
export interface PrefetchConfig {
  delay: number;
  priority: 'low' | 'high' | 'auto';
  timeout: number;
  retries: number;
  cacheTime: number;
  enabled: boolean;
  prefetchImages: boolean;
  prefetchScripts: boolean;
  prefetchStyles: boolean;
  maxConcurrent: number;
}

/** État du préchargement */
export interface PrefetchState {
  isPrefetching: boolean;
  isPrefetched: boolean;
  error: Error | null;
  startTime: number | null;
  endTime: number | null;
  duration: number | null;
  retryCount: number;
}

/** Ressource préchargée */
export interface PrefetchedResource {
  url: string;
  type: ResourceType;
  status: 'pending' | 'loading' | 'loaded' | 'error';
  loadedAt: number | null;
  size?: number;
  error?: string;
}

/** Type de ressource */
export type ResourceType = 'page' | 'image' | 'script' | 'style' | 'data' | 'font';

/** Statistiques de préchargement */
export interface PrefetchStats {
  totalPrefetches: number;
  successfulPrefetches: number;
  failedPrefetches: number;
  averageLoadTime: number;
  totalBytesLoaded: number;
  cacheHits: number;
  cacheMisses: number;
}

/** Résultat du hook */
export interface PrefetchOnHoverResult {
  onMouseEnter: () => void;
  onMouseLeave: () => void;
  onFocus: () => void;
  onBlur: () => void;
  onTouchStart: () => void;
  state: PrefetchState;
  isPrefetched: boolean;
  isPrefetching: boolean;
  prefetch: () => Promise<void>;
  cancel: () => void;
  reset: () => void;
}

// Configuration par défaut
const DEFAULT_CONFIG: PrefetchConfig = {
  delay: 100,
  priority: 'auto',
  timeout: 5000,
  retries: 2,
  cacheTime: 300000, // 5 minutes
  enabled: true,
  prefetchImages: true,
  prefetchScripts: false,
  prefetchStyles: true,
  maxConcurrent: 3
};

// Cache global des ressources préchargées
const prefetchCache = new Map<string, PrefetchedResource>();
const pendingPrefetches = new Set<string>();

// Statistiques globales
const globalStats: PrefetchStats = {
  totalPrefetches: 0,
  successfulPrefetches: 0,
  failedPrefetches: 0,
  averageLoadTime: 0,
  totalBytesLoaded: 0,
  cacheHits: 0,
  cacheMisses: 0
};

/** Vérifier si une URL est dans le cache */
function isInCache(url: string): boolean {
  const cached = prefetchCache.get(url);
  if (!cached) return false;

  // Vérifier si le cache est expiré
  if (cached.loadedAt) {
    const age = Date.now() - cached.loadedAt;
    if (age > DEFAULT_CONFIG.cacheTime) {
      prefetchCache.delete(url);
      return false;
    }
  }

  return cached.status === 'loaded';
}

/** Précharger une page via link prefetch */
function prefetchPage(url: string): Promise<void> {
  return new Promise((resolve, reject) => {
    // Vérifier si déjà préchargé
    if (isInCache(url)) {
      globalStats.cacheHits++;
      resolve();
      return;
    }

    globalStats.cacheMisses++;

    // Vérifier si déjà en cours
    if (pendingPrefetches.has(url)) {
      resolve();
      return;
    }

    pendingPrefetches.add(url);

    const link = document.createElement('link');
    link.rel = 'prefetch';
    link.href = url;
    link.as = 'document';

    link.onload = () => {
      prefetchCache.set(url, {
        url,
        type: 'page',
        status: 'loaded',
        loadedAt: Date.now()
      });
      pendingPrefetches.delete(url);
      globalStats.successfulPrefetches++;
      resolve();
    };

    link.onerror = () => {
      prefetchCache.set(url, {
        url,
        type: 'page',
        status: 'error',
        loadedAt: null,
        error: 'Failed to prefetch'
      });
      pendingPrefetches.delete(url);
      globalStats.failedPrefetches++;
      reject(new Error('Failed to prefetch page'));
    };

    document.head.appendChild(link);
  });
}

/** Précharger une image */
function prefetchImage(url: string): Promise<void> {
  return new Promise((resolve, reject) => {
    if (isInCache(url)) {
      globalStats.cacheHits++;
      resolve();
      return;
    }

    globalStats.cacheMisses++;

    const img = new Image();

    img.onload = () => {
      prefetchCache.set(url, {
        url,
        type: 'image',
        status: 'loaded',
        loadedAt: Date.now()
      });
      globalStats.successfulPrefetches++;
      resolve();
    };

    img.onerror = () => {
      prefetchCache.set(url, {
        url,
        type: 'image',
        status: 'error',
        loadedAt: null,
        error: 'Failed to load image'
      });
      globalStats.failedPrefetches++;
      reject(new Error('Failed to prefetch image'));
    };

    img.src = url;
  });
}

/** Précharger une ressource générique */
function prefetchResource(url: string, type: ResourceType): Promise<void> {
  return new Promise((resolve, reject) => {
    if (isInCache(url)) {
      globalStats.cacheHits++;
      resolve();
      return;
    }

    globalStats.cacheMisses++;

    const link = document.createElement('link');
    link.rel = 'prefetch';
    link.href = url;

    switch (type) {
      case 'script':
        link.as = 'script';
        break;
      case 'style':
        link.as = 'style';
        break;
      case 'font':
        link.as = 'font';
        link.crossOrigin = 'anonymous';
        break;
      default:
        link.as = 'fetch';
    }

    link.onload = () => {
      prefetchCache.set(url, {
        url,
        type,
        status: 'loaded',
        loadedAt: Date.now()
      });
      globalStats.successfulPrefetches++;
      resolve();
    };

    link.onerror = () => {
      globalStats.failedPrefetches++;
      reject(new Error(`Failed to prefetch ${type}`));
    };

    document.head.appendChild(link);
  });
}

/**
 * Hook de préchargement au survol
 */
export function usePrefetchOnHover(
  href?: string,
  config?: Partial<PrefetchConfig>
): PrefetchOnHoverResult {
  const mergedConfig = useMemo(() => ({ ...DEFAULT_CONFIG, ...config }), [config]);

  const [state, setState] = useState<PrefetchState>({
    isPrefetching: false,
    isPrefetched: false,
    error: null,
    startTime: null,
    endTime: null,
    duration: null,
    retryCount: 0
  });

  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const abortRef = useRef(false);
  const retryCountRef = useRef(0);

  /** Annuler le préchargement */
  const cancel = useCallback(() => {
    abortRef.current = true;
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    setState(prev => ({
      ...prev,
      isPrefetching: false
    }));
  }, []);

  /** Réinitialiser l'état */
  const reset = useCallback(() => {
    cancel();
    abortRef.current = false;
    retryCountRef.current = 0;
    setState({
      isPrefetching: false,
      isPrefetched: false,
      error: null,
      startTime: null,
      endTime: null,
      duration: null,
      retryCount: 0
    });
  }, [cancel]);

  /** Précharger la ressource */
  const prefetch = useCallback(async () => {
    if (!href || !mergedConfig.enabled || state.isPrefetched || abortRef.current) {
      return;
    }

    // Vérifier le cache
    if (isInCache(href)) {
      setState(prev => ({
        ...prev,
        isPrefetched: true
      }));
      return;
    }

    const startTime = performance.now();
    globalStats.totalPrefetches++;

    setState(prev => ({
      ...prev,
      isPrefetching: true,
      startTime: Date.now(),
      error: null
    }));

    try {
      // Déterminer le type de ressource
      const isImage = /\.(jpg|jpeg|png|gif|webp|svg|avif)$/i.test(href);

      if (isImage && mergedConfig.prefetchImages) {
        await prefetchImage(href);
      } else {
        await prefetchPage(href);
      }

      if (!abortRef.current) {
        const endTime = performance.now();
        const duration = endTime - startTime;

        // Mettre à jour les stats moyennes
        const totalSuccess = globalStats.successfulPrefetches;
        globalStats.averageLoadTime =
          (globalStats.averageLoadTime * (totalSuccess - 1) + duration) / totalSuccess;

        setState({
          isPrefetching: false,
          isPrefetched: true,
          error: null,
          startTime: Date.now() - duration,
          endTime: Date.now(),
          duration,
          retryCount: retryCountRef.current
        });
      }
    } catch (error) {
      if (!abortRef.current) {
        // Retry logic
        if (retryCountRef.current < mergedConfig.retries) {
          retryCountRef.current++;
          setState(prev => ({
            ...prev,
            retryCount: retryCountRef.current
          }));

          // Attendre avant de réessayer
          await new Promise(resolve => setTimeout(resolve, 500 * retryCountRef.current));

          if (!abortRef.current) {
            return prefetch();
          }
        } else {
          setState(prev => ({
            ...prev,
            isPrefetching: false,
            error: error as Error
          }));
        }
      }
    }
  }, [href, mergedConfig, state.isPrefetched]);

  /** Démarrer le préchargement avec délai */
  const startPrefetch = useCallback(() => {
    if (!href || !mergedConfig.enabled || state.isPrefetched || state.isPrefetching) {
      return;
    }

    abortRef.current = false;

    timeoutRef.current = setTimeout(() => {
      prefetch();
    }, mergedConfig.delay);
  }, [href, mergedConfig, state.isPrefetched, state.isPrefetching, prefetch]);

  /** Arrêter le préchargement */
  const stopPrefetch = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
  }, []);

  // Handlers d'événements
  const onMouseEnter = useCallback(() => {
    startPrefetch();
  }, [startPrefetch]);

  const onMouseLeave = useCallback(() => {
    stopPrefetch();
  }, [stopPrefetch]);

  const onFocus = useCallback(() => {
    startPrefetch();
  }, [startPrefetch]);

  const onBlur = useCallback(() => {
    stopPrefetch();
  }, [stopPrefetch]);

  const onTouchStart = useCallback(() => {
    startPrefetch();
  }, [startPrefetch]);

  // Nettoyage
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      abortRef.current = true;
    };
  }, []);

  return {
    onMouseEnter,
    onMouseLeave,
    onFocus,
    onBlur,
    onTouchStart,
    state,
    isPrefetched: state.isPrefetched,
    isPrefetching: state.isPrefetching,
    prefetch,
    cancel,
    reset
  };
}

/** Hook simplifié retournant uniquement les handlers */
export function usePrefetchHandlers(href?: string): {
  onMouseEnter: () => void;
  onMouseLeave: () => void;
  onFocus: () => void;
} {
  const { onMouseEnter, onMouseLeave, onFocus } = usePrefetchOnHover(href);
  return React.useMemo(() => ({ onMouseEnter, onMouseLeave, onFocus }), [onMouseEnter, onMouseLeave, onFocus]);
}

/** Précharger plusieurs URLs */
export function usePrefetchMultiple(
  urls: string[],
  config?: Partial<PrefetchConfig>
): {
  prefetchAll: () => Promise<void[]>;
  prefetchedCount: number;
  isPrefetching: boolean;
} {
  const [prefetchedCount, setPrefetchedCount] = useState(0);
  const [isPrefetching, setIsPrefetching] = useState(false);

  const prefetchAll = useCallback(async () => {
    if (isPrefetching) return [];

    setIsPrefetching(true);
    setPrefetchedCount(0);

    const results = await Promise.allSettled(
      urls.map(async (url) => {
        await prefetchPage(url);
        setPrefetchedCount(prev => prev + 1);
      })
    );

    setIsPrefetching(false);
    return results.map((r) => r.status === 'fulfilled' ? undefined : undefined);
  }, [urls, isPrefetching]);

  return { prefetchAll, prefetchedCount, isPrefetching };
}

/** Obtenir les statistiques de préchargement */
export function getPrefetchStats(): PrefetchStats {
  return { ...globalStats };
}

/** Obtenir le cache de préchargement */
export function getPrefetchCache(): Map<string, PrefetchedResource> {
  return new Map(prefetchCache);
}

/** Vider le cache de préchargement */
export function clearPrefetchCache(): void {
  prefetchCache.clear();
}

/** Observer d'intersection pour préchargement automatique */
export function usePrefetchOnVisible(
  href: string,
  options?: IntersectionObserverInit
): React.RefObject<HTMLElement> {
  const elementRef = useRef<HTMLElement>(null);
  const { prefetch, isPrefetched } = usePrefetchOnHover(href);

  useEffect(() => {
    if (!elementRef.current || isPrefetched) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          prefetch();
          observer.disconnect();
        }
      },
      { rootMargin: '50px', ...options }
    );

    observer.observe(elementRef.current);

    return () => observer.disconnect();
  }, [href, prefetch, isPrefetched, options]);

  return elementRef;
}

export default usePrefetchOnHover;
