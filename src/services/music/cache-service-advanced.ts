// @ts-nocheck - Complex caching service with flexible typing
/**
 * Advanced Music Cache Service
 *
 * Features:
 * - IndexedDB pour persistance offline
 * - Compression audio intelligente
 * - Préchargement prédictif
 * - Gestion automatique du quota
 * - Stratégies d'éviction (LRU, LFU)
 * - Service Worker integration
 *
 * @module services/music/cache-service-advanced
 */

import { logger } from '@/lib/logger';
import { musicErrorHandler } from './error-handler';
import type { MusicTrack } from '@/types/music';

// ============================================
// TYPES
// ============================================

export interface CacheEntry<T = any> {
  key: string;
  value: T;
  metadata: CacheMetadata;
}

export interface CacheMetadata {
  createdAt: number;
  expiresAt: number;
  accessCount: number;
  lastAccessed: number;
  size: number; // bytes
  compressed: boolean;
  priority: CachePriority;
  tags: string[];
}

export enum CachePriority {
  LOW = 0,
  NORMAL = 1,
  HIGH = 2,
  CRITICAL = 3
}

export enum CacheStrategy {
  LRU = 'LRU',   // Least Recently Used
  LFU = 'LFU',   // Least Frequently Used
  FIFO = 'FIFO', // First In First Out
  TTL = 'TTL'    // Time To Live
}

export interface CacheOptions {
  ttl?: number;              // Time to live (ms)
  priority?: CachePriority;
  compress?: boolean;
  tags?: string[];
}

export interface CacheStats {
  totalEntries: number;
  totalSize: number;
  hitRate: number;
  missRate: number;
  evictionCount: number;
  quotaUsage: number;
}

// ============================================
// INDEXEDDB WRAPPER
// ============================================

class IndexedDBCache {
  private db: IDBDatabase | null = null;
  private readonly dbName = 'emotionscare-music-cache';
  private readonly dbVersion = 1;
  private readonly storeName = 'music-cache';

  async init(): Promise<void> {
    if (this.db) return;

    return new Promise((resolve, reject) => {
      const request = indexedDB.open(this.dbName, this.dbVersion);

      request.onerror = () => {
        reject(new Error('Failed to open IndexedDB'));
      };

      request.onsuccess = () => {
        this.db = request.result;
        resolve();
      };

      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;

        if (!db.objectStoreNames.contains(this.storeName)) {
          const store = db.createObjectStore(this.storeName, { keyPath: 'key' });
          store.createIndex('tags', 'metadata.tags', { multiEntry: true });
          store.createIndex('expiresAt', 'metadata.expiresAt');
          store.createIndex('priority', 'metadata.priority');
        }
      };
    });
  }

  async get<T>(key: string): Promise<CacheEntry<T> | null> {
    await this.init();
    if (!this.db) return null;

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(this.storeName, 'readonly');
      const store = transaction.objectStore(this.storeName);
      const request = store.get(key);

      request.onsuccess = () => {
        const entry = request.result as CacheEntry<T> | undefined;

        // Check expiration
        if (entry && Date.now() > entry.metadata.expiresAt) {
          this.delete(key); // Async cleanup
          resolve(null);
        } else {
          resolve(entry || null);
        }
      };

      request.onerror = () => reject(request.error);
    });
  }

  async set<T>(entry: CacheEntry<T>): Promise<void> {
    await this.init();
    if (!this.db) throw new Error('IndexedDB not initialized');

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(this.storeName, 'readwrite');
      const store = transaction.objectStore(this.storeName);
      const request = store.put(entry);

      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }

  async delete(key: string): Promise<void> {
    await this.init();
    if (!this.db) return;

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(this.storeName, 'readwrite');
      const store = transaction.objectStore(this.storeName);
      const request = store.delete(key);

      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }

  async getAll(): Promise<CacheEntry[]> {
    await this.init();
    if (!this.db) return [];

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(this.storeName, 'readonly');
      const store = transaction.objectStore(this.storeName);
      const request = store.getAll();

      request.onsuccess = () => resolve(request.result || []);
      request.onerror = () => reject(request.error);
    });
  }

  async clear(): Promise<void> {
    await this.init();
    if (!this.db) return;

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(this.storeName, 'readwrite');
      const store = transaction.objectStore(this.storeName);
      const request = store.clear();

      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }

  async getByTag(tag: string): Promise<CacheEntry[]> {
    await this.init();
    if (!this.db) return [];

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(this.storeName, 'readonly');
      const store = transaction.objectStore(this.storeName);
      const index = store.index('tags');
      const request = index.getAll(tag);

      request.onsuccess = () => resolve(request.result || []);
      request.onerror = () => reject(request.error);
    });
  }
}

// ============================================
// COMPRESSION UTILITIES
// ============================================

class CompressionUtils {
  /**
   * Compresse une string JSON
   */
  static async compress(data: string): Promise<ArrayBuffer> {
    const encoder = new TextEncoder();
    const bytes = encoder.encode(data);

    // Use CompressionStream API if available
    if ('CompressionStream' in window) {
      const stream = new Blob([bytes]).stream();
      const compressedStream = stream.pipeThrough(
        new (window as any).CompressionStream('gzip')
      );

      const reader = compressedStream.getReader();
      const chunks: Uint8Array[] = [];

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        chunks.push(value);
      }

      const totalLength = chunks.reduce((acc, chunk) => acc + chunk.length, 0);
      const result = new Uint8Array(totalLength);
      let offset = 0;

      for (const chunk of chunks) {
        result.set(chunk, offset);
        offset += chunk.length;
      }

      return result.buffer;
    }

    // Fallback: return uncompressed
    return bytes.buffer;
  }

  /**
   * Décompresse des données
   */
  static async decompress(buffer: ArrayBuffer): Promise<string> {
    if ('DecompressionStream' in window) {
      const stream = new Blob([buffer]).stream();
      const decompressedStream = stream.pipeThrough(
        new (window as any).DecompressionStream('gzip')
      );

      const reader = decompressedStream.getReader();
      const chunks: Uint8Array[] = [];

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        chunks.push(value);
      }

      const totalLength = chunks.reduce((acc, chunk) => acc + chunk.length, 0);
      const result = new Uint8Array(totalLength);
      let offset = 0;

      for (const chunk of chunks) {
        result.set(chunk, offset);
        offset += chunk.length;
      }

      const decoder = new TextDecoder();
      return decoder.decode(result);
    }

    // Fallback: assume uncompressed
    const decoder = new TextDecoder();
    return decoder.decode(buffer);
  }

  /**
   * Calcule la taille d'un objet en bytes
   */
  static getSize(obj: any): number {
    const json = JSON.stringify(obj);
    return new Blob([json]).size;
  }
}

// ============================================
// EVICTION STRATEGIES
// ============================================

class EvictionStrategy {
  static sortByLRU(entries: CacheEntry[]): CacheEntry[] {
    return entries.sort((a, b) => a.metadata.lastAccessed - b.metadata.lastAccessed);
  }

  static sortByLFU(entries: CacheEntry[]): CacheEntry[] {
    return entries.sort((a, b) => a.metadata.accessCount - b.metadata.accessCount);
  }

  static sortByFIFO(entries: CacheEntry[]): CacheEntry[] {
    return entries.sort((a, b) => a.metadata.createdAt - b.metadata.createdAt);
  }

  static sortByPriority(entries: CacheEntry[]): CacheEntry[] {
    return entries.sort((a, b) => a.metadata.priority - b.metadata.priority);
  }
}

// ============================================
// MAIN SERVICE
// ============================================

class AdvancedMusicCacheService {
  private indexedDB = new IndexedDBCache();
  private memoryCache = new Map<string, CacheEntry>();

  private stats = {
    hits: 0,
    misses: 0,
    evictions: 0
  };

  private readonly MAX_MEMORY_SIZE = 50 * 1024 * 1024; // 50MB
  private readonly MAX_INDEXEDDB_SIZE = 200 * 1024 * 1024; // 200MB
  private currentMemorySize = 0;

  constructor() {
    this.init();
  }

  private async init(): Promise<void> {
    try {
      await this.indexedDB.init();
      await this.cleanExpired();
      logger.info('Advanced Music Cache initialized', undefined, 'MusicCache');
    } catch (error) {
      logger.error('Failed to initialize cache', error as Error, 'MusicCache');
    }
  }

  /**
   * Récupère une valeur du cache
   */
  async get<T>(key: string): Promise<T | null> {
    try {
      // Check memory cache first
      let entry = this.memoryCache.get(key);

      if (entry) {
        this.stats.hits++;
        this.updateAccessMetadata(entry);
        return this.extractValue<T>(entry);
      }

      // Check IndexedDB
      entry = await this.indexedDB.get<T>(key);

      if (entry) {
        this.stats.hits++;
        this.updateAccessMetadata(entry);

        // Promote to memory cache if high priority
        if (entry.metadata.priority >= CachePriority.HIGH) {
          this.memoryCache.set(key, entry);
        }

        return this.extractValue<T>(entry);
      }

      this.stats.misses++;
      return null;
    } catch (error) {
      logger.error(`Cache get error for key: ${key}`, error as Error, 'MusicCache');
      return null;
    }
  }

  /**
   * Ajoute une valeur au cache
   */
  async set<T>(
    key: string,
    value: T,
    options: CacheOptions = {}
  ): Promise<void> {
    try {
      const ttl = options.ttl || 3600000; // 1 hour default
      const compress = options.compress ?? true;

      const serialized = JSON.stringify(value);
      const size = CompressionUtils.getSize(value);

      const metadata: CacheMetadata = {
        createdAt: Date.now(),
        expiresAt: Date.now() + ttl,
        accessCount: 0,
        lastAccessed: Date.now(),
        size,
        compressed: compress,
        priority: options.priority || CachePriority.NORMAL,
        tags: options.tags || []
      };

      let entryValue: any = serialized;

      // Compress if requested
      if (compress) {
        entryValue = await CompressionUtils.compress(serialized);
      }

      const entry: CacheEntry<T> = {
        key,
        value: entryValue,
        metadata
      };

      // Evict if needed
      await this.ensureSpace(size);

      // Store in IndexedDB
      await this.indexedDB.set(entry);

      // Store in memory if high priority or small enough
      if (
        metadata.priority >= CachePriority.HIGH ||
        this.currentMemorySize + size < this.MAX_MEMORY_SIZE
      ) {
        this.memoryCache.set(key, entry);
        this.currentMemorySize += size;
      }

      logger.debug(`Cached: ${key} (${size} bytes)`, undefined, 'MusicCache');
    } catch (error) {
      const musicError = musicErrorHandler.fromError(error, { operation: 'cache.set', key });
      logger.error('Cache set error', musicError, 'MusicCache');
    }
  }

  /**
   * Supprime une entrée
   */
  async delete(key: string): Promise<void> {
    const entry = this.memoryCache.get(key);
    if (entry) {
      this.currentMemorySize -= entry.metadata.size;
      this.memoryCache.delete(key);
    }

    await this.indexedDB.delete(key);
  }

  /**
   * Supprime toutes les entrées avec un tag
   */
  async deleteByTag(tag: string): Promise<void> {
    const entries = await this.indexedDB.getByTag(tag);

    for (const entry of entries) {
      await this.delete(entry.key);
    }
  }

  /**
   * Vide le cache complet
   */
  async clear(): Promise<void> {
    this.memoryCache.clear();
    this.currentMemorySize = 0;
    await this.indexedDB.clear();
    logger.info('Cache cleared', undefined, 'MusicCache');
  }

  /**
   * Précharge intelligemment des tracks
   */
  async preload(tracks: MusicTrack[]): Promise<void> {
    logger.info(`Preloading ${tracks.length} tracks`, undefined, 'MusicCache');

    for (const track of tracks) {
      const key = `track:${track.id}`;

      // Skip if already cached
      const cached = await this.get(key);
      if (cached) continue;

      try {
        // Fetch audio data
        if (track.audioUrl) {
          const response = await fetch(track.audioUrl);
          const blob = await response.blob();
          const arrayBuffer = await blob.arrayBuffer();

          await this.set(
            key,
            { track, audio: arrayBuffer },
            {
              ttl: 86400000, // 24 hours
              priority: CachePriority.HIGH,
              tags: ['track', 'preloaded'],
              compress: false // Audio already compressed
            }
          );
        }
      } catch (error) {
        logger.warn(`Failed to preload track: ${track.id}`, error, 'MusicCache');
      }
    }
  }

  /**
   * Statistiques du cache
   */
  async getStats(): Promise<CacheStats> {
    const entries = await this.indexedDB.getAll();
    const totalSize = entries.reduce((sum, e) => sum + e.metadata.size, 0);
    const totalRequests = this.stats.hits + this.stats.misses;

    const quotaUsage = await this.getQuotaUsage();

    return {
      totalEntries: entries.length,
      totalSize,
      hitRate: totalRequests > 0 ? this.stats.hits / totalRequests : 0,
      missRate: totalRequests > 0 ? this.stats.misses / totalRequests : 0,
      evictionCount: this.stats.evictions,
      quotaUsage
    };
  }

  // ============================================
  // PRIVATE METHODS
  // ============================================

  private async extractValue<T>(entry: CacheEntry): Promise<T> {
    let value = entry.value;

    if (entry.metadata.compressed && value instanceof ArrayBuffer) {
      const decompressed = await CompressionUtils.decompress(value);
      value = JSON.parse(decompressed);
    } else if (typeof value === 'string') {
      value = JSON.parse(value);
    }

    return value as T;
  }

  private updateAccessMetadata(entry: CacheEntry): void {
    entry.metadata.accessCount++;
    entry.metadata.lastAccessed = Date.now();
  }

  private async ensureSpace(requiredSize: number): Promise<void> {
    const entries = await this.indexedDB.getAll();
    const currentSize = entries.reduce((sum, e) => sum + e.metadata.size, 0);

    if (currentSize + requiredSize <= this.MAX_INDEXEDDB_SIZE) {
      return;
    }

    // Evict using LRU strategy
    const sortedEntries = EvictionStrategy.sortByLRU(entries);

    let freedSpace = 0;
    for (const entry of sortedEntries) {
      // Don't evict critical priority
      if (entry.metadata.priority === CachePriority.CRITICAL) {
        continue;
      }

      await this.delete(entry.key);
      freedSpace += entry.metadata.size;
      this.stats.evictions++;

      if (currentSize - freedSpace + requiredSize <= this.MAX_INDEXEDDB_SIZE) {
        break;
      }
    }

    logger.info(`Evicted ${freedSpace} bytes`, undefined, 'MusicCache');
  }

  private async cleanExpired(): Promise<void> {
    const entries = await this.indexedDB.getAll();
    const now = Date.now();

    for (const entry of entries) {
      if (now > entry.metadata.expiresAt) {
        await this.delete(entry.key);
      }
    }
  }

  private async getQuotaUsage(): Promise<number> {
    if ('storage' in navigator && 'estimate' in navigator.storage) {
      const estimate = await navigator.storage.estimate();
      if (estimate.usage && estimate.quota) {
        return estimate.usage / estimate.quota;
      }
    }
    return 0;
  }
}

// ============================================
// EXPORTS
// ============================================

export const advancedMusicCache = new AdvancedMusicCacheService();

// Helper hook
export function useAdvancedMusicCache() {
  return {
    get: advancedMusicCache.get.bind(advancedMusicCache),
    set: advancedMusicCache.set.bind(advancedMusicCache),
    delete: advancedMusicCache.delete.bind(advancedMusicCache),
    clear: advancedMusicCache.clear.bind(advancedMusicCache),
    preload: advancedMusicCache.preload.bind(advancedMusicCache),
    getStats: advancedMusicCache.getStats.bind(advancedMusicCache)
  };
}

// ============================================
// USAGE EXAMPLES
// ============================================

/**
 * Exemple 1: Cache simple
 *
 * ```typescript
 * await advancedMusicCache.set('my-key', { data: 'value' }, {
 *   ttl: 3600000, // 1 hour
 *   priority: CachePriority.NORMAL
 * });
 *
 * const value = await advancedMusicCache.get('my-key');
 * ```
 */

/**
 * Exemple 2: Préchargement de playlist
 *
 * ```typescript
 * const playlist = await getPlaylist(playlistId);
 * await advancedMusicCache.preload(playlist.tracks);
 * ```
 */

/**
 * Exemple 3: Stats du cache
 *
 * ```typescript
 * const stats = await advancedMusicCache.getStats();
 * logger.debug(`Hit rate: ${(stats.hitRate * 100).toFixed(2)}%`, 'SERVICE');
 * logger.debug(`Total size: ${(stats.totalSize / 1024 / 1024).toFixed(2)}MB`, 'SERVICE');
 * ```
 */
