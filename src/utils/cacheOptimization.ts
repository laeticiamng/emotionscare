// @ts-nocheck

/**
 * Optimisations de cache spécialisées
 */

import { apiCache, userCache, staticCache } from './cacheStrategies';
import { logger } from '@/lib/logger';

/**
 * Gestionnaire de cache intelligent
 */
export class CacheManager {
  private static instance: CacheManager;
  
  static getInstance(): CacheManager {
    if (!CacheManager.instance) {
      CacheManager.instance = new CacheManager();
    }
    return CacheManager.instance;
  }

  /**
   * Cache pour requêtes utilisateur fréquentes
   */
  cacheUserData<T>(userId: string, key: string, data: T, ttl: number = 10 * 60 * 1000): void {
    const cacheKey = `user:${userId}:${key}`;
    userCache.set(cacheKey, data, ttl);
  }

  getUserData<T>(userId: string, key: string): T | null {
    const cacheKey = `user:${userId}:${key}`;
    return userCache.get(cacheKey);
  }

  /**
   * Cache pour données statiques (longue durée)
   */
  cacheStaticData<T>(key: string, data: T): void {
    staticCache.set(key, data, 24 * 60 * 60 * 1000); // 24h
  }

  getStaticData<T>(key: string): T | null {
    return staticCache.get(key);
  }

  /**
   * Préchargement intelligent
   */
  async preloadCriticalData(userId: string): Promise<void> {
    try {
      // Précharger les données dashboard
      if (!this.getUserData(userId, 'dashboard-summary')) {
        // Simulation - en production, appel API réel
        const dashboardData = { stats: 'mock-data' };
        this.cacheUserData(userId, 'dashboard-summary', dashboardData);
      }

      // Précharger les préférences
      if (!this.getUserData(userId, 'preferences')) {
        const preferences = { theme: 'light', lang: 'fr' };
        this.cacheUserData(userId, 'preferences', preferences);
      }
    } catch (error) {
      logger.warn('Preload failed', error as Error, 'SYSTEM');
    }
  }

  /**
   * Nettoyage périodique du cache
   */
  cleanupExpiredEntries(): void {
    // Les caches LRU se nettoient automatiquement
    logger.info('Cache cleanup completed', undefined, 'SYSTEM');
  }

  /**
   * Statistiques du cache
   */
  getStats(): { api: number; user: number; static: number } {
    return {
      api: apiCache.size(),
      user: userCache.size(),
      static: staticCache.size()
    };
  }
}

// Export de l'instance singleton
export const cacheManager = CacheManager.getInstance();

// Nettoyage périodique (toutes les 30 minutes)
if (typeof window !== 'undefined') {
  setInterval(() => {
    cacheManager.cleanupExpiredEntries();
  }, 30 * 60 * 1000);
}
