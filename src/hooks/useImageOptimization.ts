// @ts-nocheck

import { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { logger } from '@/lib/logger';

/** Format d'image supporté */
export type ImageFormat = 'webp' | 'avif' | 'jpg' | 'png' | 'gif' | 'auto';

/** Mode de redimensionnement */
export type ResizeMode = 'cover' | 'contain' | 'fill' | 'scale-down' | 'none';

/** Priorité de chargement */
export type LoadPriority = 'high' | 'low' | 'auto';

/** Qualité de connexion */
export type ConnectionQuality = 'slow-2g' | '2g' | '3g' | '4g' | 'fast' | 'unknown';

/** Options d'optimisation d'image */
export interface ImageOptimizationOptions {
  quality?: number;
  format?: ImageFormat;
  lazy?: boolean;
  preload?: boolean;
  width?: number;
  height?: number;
  resizeMode?: ResizeMode;
  blur?: number;
  grayscale?: boolean;
  priority?: LoadPriority;
  placeholder?: 'blur' | 'color' | 'none';
  placeholderColor?: string;
}

/** Configuration du cache d'images */
export interface ImageCacheConfig {
  maxSize: number;
  ttl: number;
  persistToStorage?: boolean;
}

/** Entrée du cache */
interface CacheEntry {
  url: string;
  optimizedUrl: string;
  timestamp: number;
  size?: number;
  loaded: boolean;
}

/** Stats de performance */
export interface ImagePerformanceStats {
  totalLoaded: number;
  totalCached: number;
  totalFailed: number;
  averageLoadTime: number;
  bandwidthSaved: number;
  formatUsage: Record<ImageFormat, number>;
}

/** Dimensions calculées */
export interface ImageDimensions {
  width: number;
  height: number;
  aspectRatio: number;
}

/** Configuration du hook */
export interface UseImageOptimizationConfig {
  cacheConfig?: Partial<ImageCacheConfig>;
  defaultQuality?: number;
  defaultFormat?: ImageFormat;
  enableAdaptiveQuality?: boolean;
  enableBlurPlaceholder?: boolean;
  cdnBaseUrl?: string;
  onLoadStart?: (src: string) => void;
  onLoadComplete?: (src: string, loadTime: number) => void;
  onError?: (src: string, error: Error) => void;
}

const DEFAULT_CACHE_CONFIG: ImageCacheConfig = {
  maxSize: 100,
  ttl: 3600000, // 1 heure
  persistToStorage: false
};

const DEFAULT_CONFIG: UseImageOptimizationConfig = {
  defaultQuality: 85,
  defaultFormat: 'auto',
  enableAdaptiveQuality: true,
  enableBlurPlaceholder: true
};

/** AVIF test data */
const AVIF_TEST = 'data:image/avif;base64,AAAAIGZ0eXBhdmlmAAAAAGF2aWZtaWYxbWlhZk1BMUIAAADybWV0YQAAAAAAAAAoaGRscgAAAAAAAAAAcGljdAAAAAAAAAAAAAAAAGxpYmF2aWYAAAAADnBpdG0AAAAAAAEAAAAeaWxvYwAAAABEAAABAAEAAAABAAABGgAAAB0AAAAoaWluZgAAAAAAAQAAABppbmZlAgAAAAABAABhdjAxQ29sb3IAAAAAamlwcnAAAABLaXBjbwAAABRpc3BlAAAAAAAAAAIAAAACAAAAEHBpeGkAAAAAAwgICAAAAAxhdjFDgQ0MAAAAABNjb2xybmNseAACAAIAAYAAAAAXaXBtYQAAAAAAAAABAAEEAQKDBAAAACVtZGF0EgAKCBgABogQEAwgMg8f8D///8WfhwB8+ErK42A=';

/** WebP test data */
const WEBP_TEST = 'data:image/webp;base64,UklGRjoAAABXRUJQVlA4IC4AAACyAgCdASoCAAIALmk0mk0iIiIiIgBoSygABc6WWgAA/veff/0PP8bA//LwYAAA';

export const useImageOptimization = (config?: UseImageOptimizationConfig) => {
  const mergedConfig = { ...DEFAULT_CONFIG, ...config };
  const cacheConfig = { ...DEFAULT_CACHE_CONFIG, ...config?.cacheConfig };

  const [supportsWebP, setSupportsWebP] = useState(false);
  const [supportsAVIF, setSupportsAVIF] = useState(false);
  const [connectionQuality, setConnectionQuality] = useState<ConnectionQuality>('unknown');
  const [isInitialized, setIsInitialized] = useState(false);

  const cacheRef = useRef<Map<string, CacheEntry>>(new Map());
  const loadTimesRef = useRef<number[]>([]);
  const statsRef = useRef<ImagePerformanceStats>({
    totalLoaded: 0,
    totalCached: 0,
    totalFailed: 0,
    averageLoadTime: 0,
    bandwidthSaved: 0,
    formatUsage: { webp: 0, avif: 0, jpg: 0, png: 0, gif: 0, auto: 0 }
  });

  // Détection des formats supportés
  useEffect(() => {
    let mounted = true;

    const detectSupport = async () => {
      // Test WebP
      const webpPromise = new Promise<boolean>((resolve) => {
        const img = new Image();
        img.onload = () => resolve(img.height === 2);
        img.onerror = () => resolve(false);
        img.src = WEBP_TEST;
      });

      // Test AVIF
      const avifPromise = new Promise<boolean>((resolve) => {
        const img = new Image();
        img.onload = () => resolve(img.height === 2);
        img.onerror = () => resolve(false);
        img.src = AVIF_TEST;
      });

      const [webp, avif] = await Promise.all([webpPromise, avifPromise]);

      if (mounted) {
        setSupportsWebP(webp);
        setSupportsAVIF(avif);
        logger.info('Image format support detected', { webp, avif }, 'MEDIA');
      }
    };

    // Détection de la qualité de connexion
    const detectConnection = () => {
      if ('connection' in navigator) {
        const connection = (navigator as any).connection;
        const type = connection?.effectiveType || 'unknown';
        setConnectionQuality(type as ConnectionQuality);

        connection?.addEventListener('change', () => {
          if (mounted) {
            setConnectionQuality(connection.effectiveType as ConnectionQuality);
          }
        });
      }
    };

    // Charger le cache depuis le storage
    const loadCache = () => {
      if (cacheConfig.persistToStorage) {
        try {
          const stored = localStorage.getItem('image-optimization-cache');
          if (stored) {
            const entries = JSON.parse(stored) as CacheEntry[];
            const now = Date.now();
            entries
              .filter(e => now - e.timestamp < cacheConfig.ttl)
              .forEach(e => cacheRef.current.set(e.url, e));
          }
        } catch (err) {
          logger.warn('Failed to load image cache', err as Error, 'MEDIA');
        }
      }
    };

    detectSupport();
    detectConnection();
    loadCache();
    setIsInitialized(true);

    return () => {
      mounted = false;
    };
  }, [cacheConfig.persistToStorage, cacheConfig.ttl]);

  // Persister le cache
  const persistCache = useCallback(() => {
    if (cacheConfig.persistToStorage) {
      try {
        const entries = Array.from(cacheRef.current.values());
        localStorage.setItem('image-optimization-cache', JSON.stringify(entries));
      } catch (err) {
        logger.warn('Failed to persist image cache', err as Error, 'MEDIA');
      }
    }
  }, [cacheConfig.persistToStorage]);

  // Calculer la qualité adaptative
  const getAdaptiveQuality = useCallback((): number => {
    if (!mergedConfig.enableAdaptiveQuality) {
      return mergedConfig.defaultQuality!;
    }

    switch (connectionQuality) {
      case 'slow-2g':
        return 40;
      case '2g':
        return 50;
      case '3g':
        return 65;
      case '4g':
      case 'fast':
        return mergedConfig.defaultQuality!;
      default:
        return 75;
    }
  }, [connectionQuality, mergedConfig.enableAdaptiveQuality, mergedConfig.defaultQuality]);

  // Déterminer le meilleur format
  const getBestFormat = useCallback((preferredFormat: ImageFormat): ImageFormat => {
    if (preferredFormat !== 'auto') {
      if (preferredFormat === 'avif' && !supportsAVIF) return supportsWebP ? 'webp' : 'jpg';
      if (preferredFormat === 'webp' && !supportsWebP) return 'jpg';
      return preferredFormat;
    }

    if (supportsAVIF) return 'avif';
    if (supportsWebP) return 'webp';
    return 'jpg';
  }, [supportsWebP, supportsAVIF]);

  // Générer une clé de cache
  const getCacheKey = useCallback((src: string, options: ImageOptimizationOptions): string => {
    return `${src}-${JSON.stringify(options)}`;
  }, []);

  // Nettoyer le cache
  const cleanCache = useCallback(() => {
    const now = Date.now();
    const entries = Array.from(cacheRef.current.entries());

    // Supprimer les entrées expirées
    entries.forEach(([key, entry]) => {
      if (now - entry.timestamp > cacheConfig.ttl) {
        cacheRef.current.delete(key);
      }
    });

    // Limiter la taille
    if (cacheRef.current.size > cacheConfig.maxSize) {
      const sorted = entries.sort((a, b) => a[1].timestamp - b[1].timestamp);
      const toRemove = sorted.slice(0, sorted.length - cacheConfig.maxSize);
      toRemove.forEach(([key]) => cacheRef.current.delete(key));
    }

    persistCache();
  }, [cacheConfig.ttl, cacheConfig.maxSize, persistCache]);

  // Optimiser l'URL d'une image
  const optimizeImageUrl = useCallback((
    src: string,
    options: ImageOptimizationOptions = {}
  ): string => {
    const {
      quality = getAdaptiveQuality(),
      format = mergedConfig.defaultFormat!,
      width,
      height,
      resizeMode = 'cover',
      blur,
      grayscale
    } = options;

    // Vérifier le cache
    const cacheKey = getCacheKey(src, options);
    const cached = cacheRef.current.get(cacheKey);
    if (cached) {
      statsRef.current.totalCached++;
      return cached.optimizedUrl;
    }

    // Data URL ou blob - retourner tel quel
    if (src.startsWith('data:') || src.startsWith('blob:')) {
      return src;
    }

    // Déterminer le meilleur format
    const bestFormat = getBestFormat(format);
    statsRef.current.formatUsage[bestFormat]++;

    // URL externe avec CDN
    if (src.startsWith('http') && mergedConfig.cdnBaseUrl) {
      const params = new URLSearchParams();
      params.set('url', encodeURIComponent(src));
      params.set('format', bestFormat);
      params.set('quality', String(quality));
      if (width) params.set('w', String(width));
      if (height) params.set('h', String(height));
      if (resizeMode !== 'none') params.set('fit', resizeMode);
      if (blur) params.set('blur', String(blur));
      if (grayscale) params.set('grayscale', '1');

      const optimizedUrl = `${mergedConfig.cdnBaseUrl}?${params.toString()}`;

      cacheRef.current.set(cacheKey, {
        url: src,
        optimizedUrl,
        timestamp: Date.now(),
        loaded: false
      });

      return optimizedUrl;
    }

    // URL locale - ajouter des paramètres
    const separator = src.includes('?') ? '&' : '?';
    const params: string[] = [];

    params.push(`format=${bestFormat}`);
    params.push(`quality=${quality}`);
    if (width) params.push(`w=${width}`);
    if (height) params.push(`h=${height}`);
    if (resizeMode !== 'none') params.push(`fit=${resizeMode}`);
    if (blur) params.push(`blur=${blur}`);
    if (grayscale) params.push(`grayscale=1`);

    const optimizedUrl = `${src}${separator}${params.join('&')}`;

    cacheRef.current.set(cacheKey, {
      url: src,
      optimizedUrl,
      timestamp: Date.now(),
      loaded: false
    });

    cleanCache();

    return optimizedUrl;
  }, [getAdaptiveQuality, mergedConfig.defaultFormat, mergedConfig.cdnBaseUrl, getCacheKey, getBestFormat, cleanCache]);

  // Précharger une image
  const preloadImage = useCallback(async (
    src: string,
    options: ImageOptimizationOptions = {}
  ): Promise<HTMLImageElement> => {
    const startTime = performance.now();
    mergedConfig.onLoadStart?.(src);

    return new Promise((resolve, reject) => {
      const img = new Image();
      const optimizedSrc = optimizeImageUrl(src, options);

      img.onload = () => {
        const loadTime = performance.now() - startTime;
        loadTimesRef.current.push(loadTime);

        // Mettre à jour les stats
        statsRef.current.totalLoaded++;
        statsRef.current.averageLoadTime =
          loadTimesRef.current.reduce((a, b) => a + b, 0) / loadTimesRef.current.length;

        // Marquer comme chargé dans le cache
        const cacheKey = getCacheKey(src, options);
        const cached = cacheRef.current.get(cacheKey);
        if (cached) {
          cached.loaded = true;
          cached.size = img.naturalWidth * img.naturalHeight * 4; // Estimation
        }

        mergedConfig.onLoadComplete?.(src, loadTime);
        resolve(img);
      };

      img.onerror = () => {
        statsRef.current.totalFailed++;
        const error = new Error(`Failed to preload image: ${optimizedSrc}`);
        mergedConfig.onError?.(src, error);
        reject(error);
      };

      if (options.priority === 'high') {
        img.fetchPriority = 'high';
      } else if (options.priority === 'low') {
        img.fetchPriority = 'low';
      }

      img.src = optimizedSrc;
    });
  }, [optimizeImageUrl, getCacheKey, mergedConfig]);

  // Précharger plusieurs images
  const preloadImages = useCallback(async (
    sources: Array<{ src: string; options?: ImageOptimizationOptions }>
  ): Promise<PromiseSettledResult<HTMLImageElement>[]> => {
    return Promise.allSettled(
      sources.map(({ src, options }) => preloadImage(src, options))
    );
  }, [preloadImage]);

  // Générer un placeholder blur
  const generateBlurPlaceholder = useCallback((
    src: string,
    width: number = 20,
    quality: number = 10
  ): string => {
    return optimizeImageUrl(src, {
      width,
      quality,
      blur: 20,
      format: 'webp'
    });
  }, [optimizeImageUrl]);

  // Calculer les dimensions responsives
  const getResponsiveDimensions = useCallback((
    originalWidth: number,
    originalHeight: number,
    maxWidth?: number,
    maxHeight?: number
  ): ImageDimensions => {
    const aspectRatio = originalWidth / originalHeight;

    let width = originalWidth;
    let height = originalHeight;

    if (maxWidth && width > maxWidth) {
      width = maxWidth;
      height = width / aspectRatio;
    }

    if (maxHeight && height > maxHeight) {
      height = maxHeight;
      width = height * aspectRatio;
    }

    return {
      width: Math.round(width),
      height: Math.round(height),
      aspectRatio
    };
  }, []);

  // Générer srcSet pour images responsives
  const generateSrcSet = useCallback((
    src: string,
    widths: number[] = [320, 640, 768, 1024, 1280, 1536],
    options: Omit<ImageOptimizationOptions, 'width'> = {}
  ): string => {
    return widths
      .map(w => `${optimizeImageUrl(src, { ...options, width: w })} ${w}w`)
      .join(', ');
  }, [optimizeImageUrl]);

  // Obtenir l'URL optimale pour un breakpoint
  const getOptimalUrl = useCallback((
    src: string,
    containerWidth: number,
    devicePixelRatio: number = window.devicePixelRatio || 1,
    options: ImageOptimizationOptions = {}
  ): string => {
    const targetWidth = Math.round(containerWidth * devicePixelRatio);
    return optimizeImageUrl(src, { ...options, width: targetWidth });
  }, [optimizeImageUrl]);

  // Vider le cache
  const clearCache = useCallback(() => {
    cacheRef.current.clear();
    if (cacheConfig.persistToStorage) {
      localStorage.removeItem('image-optimization-cache');
    }
    logger.info('Image cache cleared', {}, 'MEDIA');
  }, [cacheConfig.persistToStorage]);

  // Stats
  const stats = useMemo((): ImagePerformanceStats => ({
    ...statsRef.current,
    totalCached: cacheRef.current.size
  }), []);

  // Vitesse de connexion (compatibilité)
  const connectionSpeed = useMemo((): 'slow' | 'fast' => {
    return ['slow-2g', '2g', '3g'].includes(connectionQuality) ? 'slow' : 'fast';
  }, [connectionQuality]);

  // État de préparation
  const isReady = useMemo(() => {
    return isInitialized && (supportsWebP || supportsAVIF || true);
  }, [isInitialized, supportsWebP, supportsAVIF]);

  return {
    // Fonctions principales
    optimizeImageUrl,
    preloadImage,
    preloadImages,

    // Support de formats
    supportsWebP,
    supportsAVIF,
    isReady,

    // Connexion
    connectionSpeed,
    connectionQuality,

    // Utilitaires
    generateBlurPlaceholder,
    getResponsiveDimensions,
    generateSrcSet,
    getOptimalUrl,
    getBestFormat,
    getAdaptiveQuality,

    // Cache
    clearCache,
    cacheSize: cacheRef.current.size,

    // Stats
    stats
  };
};

/** Hook simplifié pour une seule image */
export function useOptimizedImage(
  src: string | null | undefined,
  options?: ImageOptimizationOptions
) {
  const { optimizeImageUrl, preloadImage, generateBlurPlaceholder, isReady } = useImageOptimization();
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const optimizedSrc = useMemo(() => {
    if (!src || !isReady) return null;
    return optimizeImageUrl(src, options);
  }, [src, options, optimizeImageUrl, isReady]);

  const placeholderSrc = useMemo(() => {
    if (!src || !isReady) return null;
    return generateBlurPlaceholder(src);
  }, [src, generateBlurPlaceholder, isReady]);

  useEffect(() => {
    if (!src) return;

    setIsLoaded(false);
    setError(null);

    preloadImage(src, options)
      .then(() => setIsLoaded(true))
      .catch(setError);
  }, [src, options, preloadImage]);

  return {
    src: optimizedSrc,
    placeholderSrc,
    isLoaded,
    isLoading: !isLoaded && !error,
    error
  };
}

export default useImageOptimization;
