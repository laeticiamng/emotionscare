/**
 * Optimisateur de performances intelligent
 * Cache adaptatif, lazy loading et préchargement
 */

import { logger } from './observability';

// ============= Types et interfaces =============

export interface CacheEntry<T = any> {
  data: T;
  timestamp: number;
  accessCount: number;
  lastAccess: number;
  ttl: number;
  size: number;
}

export interface CacheStats {
  hits: number;
  misses: number;
  size: number;
  maxSize: number;
  hitRate: number;
}

export interface PerformanceSettings {
  enableCache: boolean;
  enablePreloading: boolean;
  enableImageOptimization: boolean;
  maxCacheSize: number;
  defaultTTL: number;
  networkQuality: 'slow' | 'fast' | 'auto';
}

// ============= Cache intelligent avec LRU =============

class IntelligentCache {
  private cache = new Map<string, CacheEntry>();
  private stats = { hits: 0, misses: 0 };
  private maxSize: number;
  private maxMemoryUsage: number;

  constructor(maxSize = 100, maxMemoryMB = 50) {
    this.maxSize = maxSize;
    this.maxMemoryUsage = maxMemoryMB * 1024 * 1024; // Convert to bytes
  }

  private calculateSize(data: any): number {
    return new TextEncoder().encode(JSON.stringify(data)).length;
  }

  private evictLeastUsed() {
    if (this.cache.size === 0) return;

    let lruKey = '';
    let lruScore = Infinity;

    // LRU avec score basé sur fréquence et récence
    for (const [key, entry] of this.cache.entries()) {
      const timeSinceAccess = Date.now() - entry.lastAccess;
      const score = timeSinceAccess / (entry.accessCount + 1);
      
      if (score < lruScore) {
        lruScore = score;
        lruKey = key;
      }
    }

    if (lruKey) {
      this.cache.delete(lruKey);
      logger.debug('cache', `Evicted cache entry: ${lruKey}`);
    }
  }

  private enforceMemoryLimit() {
    let totalSize = 0;
    for (const entry of this.cache.values()) {
      totalSize += entry.size;
    }

    while (totalSize > this.maxMemoryUsage && this.cache.size > 0) {
      this.evictLeastUsed();
      
      // Recalculate
      totalSize = 0;
      for (const entry of this.cache.values()) {
        totalSize += entry.size;
      }
    }
  }

  set<T>(key: string, data: T, ttl = 5 * 60 * 1000): void {
    const now = Date.now();
    const size = this.calculateSize(data);
    
    // Enforce size limits
    while (this.cache.size >= this.maxSize) {
      this.evictLeastUsed();
    }

    const entry: CacheEntry<T> = {
      data,
      timestamp: now,
      accessCount: 0,
      lastAccess: now,
      ttl,
      size,
    };

    this.cache.set(key, entry);
    this.enforceMemoryLimit();
    
    logger.debug('cache', `Cached item: ${key}`, { size, ttl });
  }

  get<T>(key: string): T | null {
    const entry = this.cache.get(key);
    
    if (!entry) {
      this.stats.misses++;
      return null;
    }

    // Check TTL
    if (Date.now() - entry.timestamp > entry.ttl) {
      this.cache.delete(key);
      this.stats.misses++;
      logger.debug('cache', `Cache entry expired: ${key}`);
      return null;
    }

    // Update access stats
    entry.accessCount++;
    entry.lastAccess = Date.now();
    this.stats.hits++;

    return entry.data as T;
  }

  has(key: string): boolean {
    return this.get(key) !== null;
  }

  delete(key: string): boolean {
    const deleted = this.cache.delete(key);
    if (deleted) {
      logger.debug('cache', `Deleted cache entry: ${key}`);
    }
    return deleted;
  }

  clear(): void {
    const size = this.cache.size;
    this.cache.clear();
    this.stats = { hits: 0, misses: 0 };
    logger.info('cache', `Cleared cache (${size} entries)`);
  }

  getStats(): CacheStats {
    const totalRequests = this.stats.hits + this.stats.misses;
    return {
      ...this.stats,
      size: this.cache.size,
      maxSize: this.maxSize,
      hitRate: totalRequests > 0 ? this.stats.hits / totalRequests : 0,
    };
  }
}

// ============= Optimisateur principal =============

class PerformanceOptimizer {
  private cache = new IntelligentCache();
  private settings: PerformanceSettings;
  private preloadQueue = new Set<string>();
  private networkQuality: 'slow' | 'fast' = 'fast';
  private visibilityChangeHandler: (() => void) | null = null;

  constructor() {
    this.settings = {
      enableCache: true,
      enablePreloading: true,
      enableImageOptimization: true,
      maxCacheSize: 100,
      defaultTTL: 5 * 60 * 1000, // 5 minutes
      networkQuality: 'auto',
    };

    this.detectNetworkQuality();
    this.setupPerformanceMonitoring();
  }

  private detectNetworkQuality() {
    // @ts-ignore - experimental API
    if ('connection' in navigator) {
      // @ts-ignore
      const connection = navigator.connection as any;

      if (connection?.effectiveType === '4g' && connection?.downlink > 10) {
        this.networkQuality = 'fast';
      } else {
        this.networkQuality = 'slow';
      }

      logger.info('performance', 'Network quality detected', {
        effectiveType: connection?.effectiveType,
        downlink: connection?.downlink,
        quality: this.networkQuality,
      });
    }
  }

  private setupPerformanceMonitoring() {
    // Monitor page visibility for cache optimization
    this.visibilityChangeHandler = () => {
      if (document.hidden) {
        logger.debug('performance', 'Page hidden - pausing preloading');
        this.preloadQueue.clear();
      } else {
        logger.debug('performance', 'Page visible - resuming optimization');
      }
    };

    document.addEventListener('visibilitychange', this.visibilityChangeHandler);
  }

  /**
   * Cleanup method to remove event listeners and prevent memory leaks
   * Should be called when the optimizer is no longer needed
   */
  cleanup() {
    if (this.visibilityChangeHandler) {
      document.removeEventListener('visibilitychange', this.visibilityChangeHandler);
      this.visibilityChangeHandler = null;
    }
    this.clearCache();
    this.preloadQueue.clear();
    logger.info('performance', 'Performance optimizer cleaned up');
  }

  // ============= Cache public API =============

  cacheData<T>(key: string, data: T, ttl?: number): void {
    if (!this.settings.enableCache) return;
    
    this.cache.set(key, data, ttl || this.settings.defaultTTL);
  }

  getCachedData<T>(key: string): T | null {
    if (!this.settings.enableCache) return null;
    
    return this.cache.get<T>(key);
  }

  async fetchWithCache<T>(
    key: string,
    fetcher: () => Promise<T>,
    ttl?: number
  ): Promise<T> {
    // Try cache first
    const cached = this.getCachedData<T>(key);
    if (cached !== null) {
      return cached;
    }

    // Fetch and cache
    try {
      const data = await fetcher();
      this.cacheData(key, data, ttl);
      return data;
    } catch (error) {
      logger.error('performance', 'Fetch with cache failed', error as Error, undefined, { key });
      throw error;
    }
  }

  // ============= Preloading intelligent =============

  preloadResource(url: string, type: 'script' | 'style' | 'image' | 'fetch' = 'fetch'): Promise<void> {
    if (!this.settings.enablePreloading || this.preloadQueue.has(url)) {
      return Promise.resolve();
    }

    this.preloadQueue.add(url);

    return new Promise((resolve, reject) => {
      const cleanup = () => {
        this.preloadQueue.delete(url);
      };

      switch (type) {
        case 'image':
          const img = new Image();
          img.onload = () => {
            cleanup();
            logger.debug('performance', `Preloaded image: ${url}`);
            resolve();
          };
          img.onerror = () => {
            cleanup();
            reject(new Error(`Failed to preload image: ${url}`));
          };
          img.src = url;
          break;

        case 'script':
          const script = document.createElement('link');
          script.rel = 'preload';
          script.as = 'script';
          script.href = url;
          script.onload = () => {
            cleanup();
            resolve();
          };
          script.onerror = () => {
            cleanup();
            reject(new Error(`Failed to preload script: ${url}`));
          };
          document.head.appendChild(script);
          break;

        case 'style':
          const style = document.createElement('link');
          style.rel = 'preload';
          style.as = 'style';
          style.href = url;
          style.onload = () => {
            cleanup();
            resolve();
          };
          style.onerror = () => {
            cleanup();
            reject(new Error(`Failed to preload style: ${url}`));
          };
          document.head.appendChild(style);
          break;

        case 'fetch':
        default:
          fetch(url, { mode: 'no-cors' })
            .then(() => {
              cleanup();
              logger.debug('performance', `Preloaded resource: ${url}`);
              resolve();
            })
            .catch((error) => {
              cleanup();
              reject(error);
            });
          break;
      }
    });
  }

  // ============= Lazy loading avec intersection observer =============

  lazy<T>(
    loader: () => Promise<T>,
    placeholder?: T,
    options: IntersectionObserverInit = {}
  ): {
    load: () => Promise<T>;
    observe: (element: Element) => void;
    unobserve: (element: Element) => void;
  } {
    let loaded = false;
    let loading = false;
    let result: T | undefined = placeholder;
    let loadPromise: Promise<T> | null = null;

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting && !loaded && !loading) {
          load();
        }
      });
    }, { rootMargin: '50px', ...options });

    const load = async (): Promise<T> => {
      if (loaded && result) {
        return result;
      }

      if (loading && loadPromise) {
        return loadPromise;
      }

      loading = true;
      loadPromise = loader();

      try {
        result = await loadPromise;
        loaded = true;
        loading = false;
        logger.debug('performance', 'Lazy resource loaded');
        return result;
      } catch (error) {
        loading = false;
        loadPromise = null;
        throw error;
      }
    };

    return {
      load,
      observe: (element: Element) => observer.observe(element),
      unobserve: (element: Element) => observer.unobserve(element),
    };
  }

  // ============= Image optimization =============

  optimizeImageUrl(url: string, options: {
    width?: number;
    height?: number;
    quality?: number;
    format?: 'webp' | 'avif' | 'auto';
  } = {}): string {
    if (!this.settings.enableImageOptimization) {
      return url;
    }

    const { width, height, quality = 85, format = 'auto' } = options;
    
    // Si c'est déjà une URL optimisée ou une data URL, retourner tel quel
    if (url.includes('data:') || url.includes('w_') || url.includes('q_')) {
      return url;
    }

    // Format basique d'optimisation (à adapter selon votre CDN)
    const params = new URLSearchParams();
    if (width) params.append('w', width.toString());
    if (height) params.append('h', height.toString());
    if (quality !== 85) params.append('q', quality.toString());
    if (format !== 'auto') params.append('f', format);

    const separator = url.includes('?') ? '&' : '?';
    return `${url}${separator}${params.toString()}`;
  }

  // ============= Statistiques et monitoring =============

  getStats() {
    return {
      cache: this.cache.getStats(),
      preloadQueue: this.preloadQueue.size,
      networkQuality: this.networkQuality,
      settings: this.settings,
    };
  }

  updateSettings(newSettings: Partial<PerformanceSettings>) {
    this.settings = { ...this.settings, ...newSettings };
    logger.info('performance', 'Settings updated', this.settings);
  }

  clearCache() {
    this.cache.clear();
  }
}

// ============= Instance singleton =============

export const performanceOptimizer = new PerformanceOptimizer();

// ============= Hook React =============

import { useEffect, useRef, useState } from 'react';

export const usePerformanceOptimization = () => {
  const [stats, setStats] = useState(performanceOptimizer.getStats());

  useEffect(() => {
    const interval = setInterval(() => {
      setStats(performanceOptimizer.getStats());
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  return {
    cache: performanceOptimizer.cacheData.bind(performanceOptimizer),
    getCached: performanceOptimizer.getCachedData.bind(performanceOptimizer),
    fetchWithCache: performanceOptimizer.fetchWithCache.bind(performanceOptimizer),
    preload: performanceOptimizer.preloadResource.bind(performanceOptimizer),
    optimizeImage: performanceOptimizer.optimizeImageUrl.bind(performanceOptimizer),
    lazy: performanceOptimizer.lazy.bind(performanceOptimizer),
    stats,
    clearCache: performanceOptimizer.clearCache.bind(performanceOptimizer),
  };
};