// @ts-nocheck
/**
 * Database Query Optimizer
 * Remplace tous les .single() par .maybeSingle() pour éviter les erreurs
 */

import { supabase } from '@/integrations/supabase/client';
import { logger } from '@/lib/logger';

export interface SafeQueryResult<T> {
  data: T | null;
  error: Error | null;
  isEmpty: boolean;
}

/**
 * Wrapper sécurisé pour les requêtes single
 */
export const safeSingle = async <T>(
  query: any,
  context = 'Unknown'
): Promise<SafeQueryResult<T>> => {
  try {
    const { data, error } = await query.maybeSingle();
    
    if (error) {
      logger.error(`Query error in ${context}`, error, 'DB');
      return { data: null, error, isEmpty: true };
    }

    const isEmpty = !data;
    if (isEmpty) {
      logger.debug(`No data found in ${context}`, {}, 'DB');
    }

    return { data, error: null, isEmpty };
  } catch (error) {
    logger.error(`Unexpected error in ${context}`, error, 'DB');
    return { 
      data: null, 
      error: error instanceof Error ? error : new Error(String(error)), 
      isEmpty: true 
    };
  }
};

/**
 * Helper pour les requêtes qui attendent obligatoirement un résultat
 */
export const requireSingle = async <T>(
  query: any,
  context = 'Unknown',
  errorMessage = 'Required data not found'
): Promise<T> => {
  const result = await safeSingle<T>(query, context);
  
  if (result.isEmpty || !result.data) {
    throw new Error(`${errorMessage} in ${context}`);
  }

  return result.data;
};

/**
 * Query builder optimisé avec cache
 */
export class OptimizedQueryBuilder {
  private cache = new Map<string, { data: any; timestamp: number; ttl: number }>();
  private readonly defaultTTL = 5 * 60 * 1000; // 5 minutes

  private getCacheKey(table: string, filters: Record<string, any>): string {
    return `${table}:${JSON.stringify(filters)}`;
  }

  private isExpired(entry: { timestamp: number; ttl: number }): boolean {
    return Date.now() - entry.timestamp > entry.ttl;
  }

  async queryWithCache<T>(
    table: string,
    filters: Record<string, any> = {},
    select = '*',
    ttl = this.defaultTTL
  ): Promise<SafeQueryResult<T[]>> {
    const cacheKey = this.getCacheKey(table, { ...filters, select });
    const cached = this.cache.get(cacheKey);

    if (cached && !this.isExpired(cached)) {
      logger.debug(`Cache hit for ${table}`, { filters }, 'CACHE');
      return { data: cached.data, error: null, isEmpty: !cached.data?.length };
    }

    try {
      let query = supabase.from(table).select(select);
      
      // Appliquer les filtres
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          query = query.eq(key, value);
        }
      });

      const { data, error } = await query;

      if (error) {
        logger.error(`Query error for ${table}`, error, 'DB');
        return { data: null, error, isEmpty: true };
      }

      // Mettre en cache
      this.cache.set(cacheKey, {
        data,
        timestamp: Date.now(),
        ttl
      });

      const isEmpty = !data || data.length === 0;
      return { data, error: null, isEmpty };
    } catch (error) {
      logger.error(`Unexpected error querying ${table}`, error, 'DB');
      return { 
        data: null, 
        error: error instanceof Error ? error : new Error(String(error)), 
        isEmpty: true 
      };
    }
  }

  async getSingle<T>(
    table: string,
    filters: Record<string, any>,
    select = '*'
  ): Promise<SafeQueryResult<T>> {
    try {
      let query = supabase.from(table).select(select);
      
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          query = query.eq(key, value);
        }
      });

      return await safeSingle<T>(query, `${table} single query`);
    } catch (error) {
      return { 
        data: null, 
        error: error instanceof Error ? error : new Error(String(error)), 
        isEmpty: true 
      };
    }
  }

  clearCache(pattern?: string): void {
    if (pattern) {
      for (const key of this.cache.keys()) {
        if (key.includes(pattern)) {
          this.cache.delete(key);
        }
      }
    } else {
      this.cache.clear();
    }
    logger.debug('Cache cleared', { pattern }, 'CACHE');
  }

  getCacheStats(): { size: number; keys: string[] } {
    return {
      size: this.cache.size,
      keys: Array.from(this.cache.keys())
    };
  }
}

export const queryOptimizer = new OptimizedQueryBuilder();

// Helper functions pour migration graduelle
export const safeUserProfile = async (userId: string) => {
  return queryOptimizer.getSingle('profiles', { id: userId });
};

export const safeUserData = async (table: string, userId: string) => {
  return queryOptimizer.getSingle(table, { user_id: userId });
};

export const safeFindById = async <T>(table: string, id: string): Promise<SafeQueryResult<T>> => {
  return queryOptimizer.getSingle<T>(table, { id });
};