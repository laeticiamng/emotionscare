// @ts-nocheck
/**
 * Base Service - Service de base pour les opérations Supabase
 * Fournit des méthodes communes pour l'accès aux données
 */

import { supabase } from '@/integrations/supabase/client';

/** Configuration du service */
export interface ServiceConfig {
  tableName: string;
  cacheEnabled: boolean;
  cacheTTL: number;
  retryEnabled: boolean;
  retryAttempts: number;
  retryDelay: number;
  timeout: number;
  logEnabled: boolean;
}

/** Options de requête */
export interface QueryOptions {
  select?: string;
  filter?: Record<string, unknown>;
  orderBy?: { column: string; ascending?: boolean };
  limit?: number;
  offset?: number;
  single?: boolean;
}

/** Résultat paginé */
export interface PaginatedResult<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
  hasNext: boolean;
  hasPrevious: boolean;
}

/** Résultat de mutation */
export interface MutationResult<T> {
  data: T | null;
  error: ServiceError | null;
  success: boolean;
  affectedRows?: number;
}

/** Erreur de service */
export interface ServiceError {
  code: string;
  message: string;
  details?: unknown;
  timestamp: number;
  retryable: boolean;
}

/** Statistiques du service */
export interface ServiceStats {
  totalQueries: number;
  successfulQueries: number;
  failedQueries: number;
  cacheHits: number;
  cacheMisses: number;
  averageQueryTime: number;
  totalMutations: number;
}

/** Cache entry */
interface CacheEntry<T> {
  data: T;
  timestamp: number;
  ttl: number;
}

// Configuration par défaut
const DEFAULT_CONFIG: ServiceConfig = {
  tableName: '',
  cacheEnabled: true,
  cacheTTL: 60000, // 1 minute
  retryEnabled: true,
  retryAttempts: 3,
  retryDelay: 1000,
  timeout: 30000,
  logEnabled: false
};

// Cache global
const queryCache = new Map<string, CacheEntry<unknown>>();

// Statistiques globales
const stats: ServiceStats = {
  totalQueries: 0,
  successfulQueries: 0,
  failedQueries: 0,
  cacheHits: 0,
  cacheMisses: 0,
  averageQueryTime: 0,
  totalMutations: 0
};

/** Générer une clé de cache */
function generateCacheKey(table: string, options: QueryOptions): string {
  return `${table}:${JSON.stringify(options)}`;
}

/** Vérifier si le cache est valide */
function isCacheValid<T>(entry: CacheEntry<T>): boolean {
  return Date.now() - entry.timestamp < entry.ttl;
}

/** Logger conditionnel */
function log(message: string, data?: unknown, enabled = DEFAULT_CONFIG.logEnabled): void {
  if (enabled) {
    console.log(`[BaseService] ${message}`, data || '');
  }
}

/** Attendre avec timeout */
function withTimeout<T>(promise: Promise<T>, ms: number): Promise<T> {
  return Promise.race([
    promise,
    new Promise<T>((_, reject) =>
      setTimeout(() => reject(new Error('Query timeout')), ms)
    )
  ]);
}

/** Attendre avant retry */
function delay(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Base service with common functionality
 */
export const baseService = {
  supabase,

  /** Configuration actuelle */
  config: { ...DEFAULT_CONFIG },

  /** Configurer le service */
  configure(config: Partial<ServiceConfig>): void {
    Object.assign(this.config, config);
    log('Service configured', this.config);
  },

  /** Requête avec retry et cache */
  async query<T>(
    table: string,
    options: QueryOptions = {}
  ): Promise<{ data: T[] | T | null; error: ServiceError | null }> {
    const startTime = performance.now();
    stats.totalQueries++;

    // Vérifier le cache
    if (this.config.cacheEnabled) {
      const cacheKey = generateCacheKey(table, options);
      const cached = queryCache.get(cacheKey) as CacheEntry<T[]> | undefined;

      if (cached && isCacheValid(cached)) {
        stats.cacheHits++;
        log('Cache hit', { table, options });
        return { data: cached.data, error: null };
      }
      stats.cacheMisses++;
    }

    let lastError: ServiceError | null = null;
    let attempts = 0;

    while (attempts < (this.config.retryEnabled ? this.config.retryAttempts : 1)) {
      attempts++;

      try {
        let query = supabase.from(table).select(options.select || '*');

        // Appliquer les filtres
        if (options.filter) {
          for (const [key, value] of Object.entries(options.filter)) {
            if (value !== undefined && value !== null) {
              query = query.eq(key, value);
            }
          }
        }

        // Tri
        if (options.orderBy) {
          query = query.order(options.orderBy.column, {
            ascending: options.orderBy.ascending ?? true
          });
        }

        // Pagination
        if (options.limit) {
          query = query.limit(options.limit);
        }
        if (options.offset) {
          query = query.range(options.offset, options.offset + (options.limit || 10) - 1);
        }

        // Single
        if (options.single) {
          query = query.single();
        }

        const result = await withTimeout(query, this.config.timeout);

        if (result.error) {
          throw result.error;
        }

        // Mettre en cache
        if (this.config.cacheEnabled) {
          const cacheKey = generateCacheKey(table, options);
          queryCache.set(cacheKey, {
            data: result.data,
            timestamp: Date.now(),
            ttl: this.config.cacheTTL
          });
        }

        // Statistiques
        const queryTime = performance.now() - startTime;
        stats.successfulQueries++;
        stats.averageQueryTime =
          (stats.averageQueryTime * (stats.successfulQueries - 1) + queryTime) /
          stats.successfulQueries;

        log('Query successful', { table, options, time: queryTime });

        return { data: result.data, error: null };

      } catch (error) {
        lastError = {
          code: (error as { code?: string }).code || 'QUERY_ERROR',
          message: (error as Error).message || 'Unknown error',
          details: error,
          timestamp: Date.now(),
          retryable: attempts < this.config.retryAttempts
        };

        log('Query failed', { table, options, error: lastError, attempt: attempts });

        if (attempts < this.config.retryAttempts && this.config.retryEnabled) {
          await delay(this.config.retryDelay * attempts);
        }
      }
    }

    stats.failedQueries++;
    return { data: null, error: lastError };
  },

  /** Insérer des données */
  async insert<T>(
    table: string,
    data: Partial<T> | Partial<T>[]
  ): Promise<MutationResult<T>> {
    stats.totalMutations++;

    try {
      const result = await supabase.from(table).insert(data).select();

      if (result.error) {
        throw result.error;
      }

      // Invalider le cache pour cette table
      this.invalidateCache(table);

      log('Insert successful', { table, count: Array.isArray(data) ? data.length : 1 });

      return {
        data: result.data?.[0] as T || null,
        error: null,
        success: true,
        affectedRows: result.data?.length || 0
      };
    } catch (error) {
      return {
        data: null,
        error: {
          code: (error as { code?: string }).code || 'INSERT_ERROR',
          message: (error as Error).message,
          details: error,
          timestamp: Date.now(),
          retryable: false
        },
        success: false
      };
    }
  },

  /** Mettre à jour des données */
  async update<T>(
    table: string,
    id: string | number,
    data: Partial<T>,
    idColumn = 'id'
  ): Promise<MutationResult<T>> {
    stats.totalMutations++;

    try {
      const result = await supabase
        .from(table)
        .update(data)
        .eq(idColumn, id)
        .select();

      if (result.error) {
        throw result.error;
      }

      this.invalidateCache(table);

      log('Update successful', { table, id });

      return {
        data: result.data?.[0] as T || null,
        error: null,
        success: true,
        affectedRows: result.data?.length || 0
      };
    } catch (error) {
      return {
        data: null,
        error: {
          code: (error as { code?: string }).code || 'UPDATE_ERROR',
          message: (error as Error).message,
          details: error,
          timestamp: Date.now(),
          retryable: false
        },
        success: false
      };
    }
  },

  /** Upsert des données */
  async upsert<T>(
    table: string,
    data: Partial<T> | Partial<T>[],
    onConflict?: string
  ): Promise<MutationResult<T>> {
    stats.totalMutations++;

    try {
      let query = supabase.from(table).upsert(data);

      if (onConflict) {
        query = query.onConflict(onConflict);
      }

      const result = await query.select();

      if (result.error) {
        throw result.error;
      }

      this.invalidateCache(table);

      return {
        data: result.data?.[0] as T || null,
        error: null,
        success: true,
        affectedRows: result.data?.length || 0
      };
    } catch (error) {
      return {
        data: null,
        error: {
          code: (error as { code?: string }).code || 'UPSERT_ERROR',
          message: (error as Error).message,
          details: error,
          timestamp: Date.now(),
          retryable: false
        },
        success: false
      };
    }
  },

  /** Supprimer des données */
  async delete(
    table: string,
    id: string | number,
    idColumn = 'id'
  ): Promise<MutationResult<null>> {
    stats.totalMutations++;

    try {
      const result = await supabase
        .from(table)
        .delete()
        .eq(idColumn, id);

      if (result.error) {
        throw result.error;
      }

      this.invalidateCache(table);

      log('Delete successful', { table, id });

      return {
        data: null,
        error: null,
        success: true,
        affectedRows: 1
      };
    } catch (error) {
      return {
        data: null,
        error: {
          code: (error as { code?: string }).code || 'DELETE_ERROR',
          message: (error as Error).message,
          details: error,
          timestamp: Date.now(),
          retryable: false
        },
        success: false
      };
    }
  },

  /** Requête paginée */
  async paginate<T>(
    table: string,
    page: number,
    pageSize: number,
    options: Omit<QueryOptions, 'limit' | 'offset'> = {}
  ): Promise<PaginatedResult<T>> {
    const offset = (page - 1) * pageSize;

    // Obtenir le total
    const countResult = await supabase
      .from(table)
      .select('*', { count: 'exact', head: true });

    const total = countResult.count || 0;

    // Obtenir les données
    const { data } = await this.query<T[]>(table, {
      ...options,
      limit: pageSize,
      offset
    });

    const totalPages = Math.ceil(total / pageSize);

    return {
      data: data || [],
      total,
      page,
      pageSize,
      totalPages,
      hasNext: page < totalPages,
      hasPrevious: page > 1
    };
  },

  /** Compter les entrées */
  async count(
    table: string,
    filter?: Record<string, unknown>
  ): Promise<number> {
    let query = supabase.from(table).select('*', { count: 'exact', head: true });

    if (filter) {
      for (const [key, value] of Object.entries(filter)) {
        if (value !== undefined && value !== null) {
          query = query.eq(key, value);
        }
      }
    }

    const result = await query;
    return result.count || 0;
  },

  /** Vérifier si une entrée existe */
  async exists(
    table: string,
    filter: Record<string, unknown>
  ): Promise<boolean> {
    const count = await this.count(table, filter);
    return count > 0;
  },

  /** Obtenir par ID */
  async getById<T>(
    table: string,
    id: string | number,
    idColumn = 'id'
  ): Promise<T | null> {
    const { data } = await this.query<T>(table, {
      filter: { [idColumn]: id },
      single: true
    });
    return data as T;
  },

  /** Invalider le cache pour une table */
  invalidateCache(table: string): void {
    const keysToDelete: string[] = [];

    queryCache.forEach((_, key) => {
      if (key.startsWith(`${table}:`)) {
        keysToDelete.push(key);
      }
    });

    keysToDelete.forEach(key => queryCache.delete(key));
    log('Cache invalidated', { table, keysRemoved: keysToDelete.length });
  },

  /** Vider tout le cache */
  clearCache(): void {
    queryCache.clear();
    log('Cache cleared');
  },

  /** Obtenir les statistiques */
  getStats(): ServiceStats {
    return { ...stats };
  },

  /** Réinitialiser les statistiques */
  resetStats(): void {
    stats.totalQueries = 0;
    stats.successfulQueries = 0;
    stats.failedQueries = 0;
    stats.cacheHits = 0;
    stats.cacheMisses = 0;
    stats.averageQueryTime = 0;
    stats.totalMutations = 0;
  },

  /** Transaction simulée (exécute les opérations en séquence) */
  async transaction<T>(
    operations: Array<() => Promise<MutationResult<unknown>>>
  ): Promise<{ success: boolean; results: MutationResult<unknown>[] }> {
    const results: MutationResult<unknown>[] = [];

    for (const operation of operations) {
      const result = await operation();
      results.push(result);

      if (!result.success) {
        return { success: false, results };
      }
    }

    return { success: true, results };
  }
};

export default baseService;
