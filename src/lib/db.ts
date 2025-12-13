/**
 * Database module - Supabase abstraction layer
 * Provides a unified interface for database operations
 */

import { supabase } from '@/integrations/supabase/client';
import { logger } from '@/lib/logger';

export interface QueryResult<T = unknown> {
  rows: T[];
  rowCount: number;
  error: Error | null;
}

export interface TransactionContext {
  query: <T>(table: string, operation: 'select' | 'insert' | 'update' | 'delete', options: QueryOptions) => Promise<QueryResult<T>>;
}

export interface QueryOptions {
  select?: string;
  where?: Record<string, unknown>;
  data?: Record<string, unknown> | Record<string, unknown>[];
  orderBy?: { column: string; ascending?: boolean };
  limit?: number;
  offset?: number;
}

class DatabaseService {
  private isConnected = false;

  /**
   * Test database connection
   */
  async ping(): Promise<boolean> {
    try {
      const { error } = await supabase.from('profiles').select('id').limit(1);
      this.isConnected = !error;
      return this.isConnected;
    } catch (error) {
      logger.error('Database ping failed', error as Error, 'SYSTEM');
      this.isConnected = false;
      return false;
    }
  }

  /**
   * Execute a query on a table
   */
  async query<T>(
    table: string,
    operation: 'select' | 'insert' | 'update' | 'delete',
    options: QueryOptions = {}
  ): Promise<QueryResult<T>> {
    try {
      logger.debug('DB query', { table, operation, options }, 'SYSTEM');

      let query;

      switch (operation) {
        case 'select':
          query = supabase.from(table).select(options.select || '*');
          break;
        case 'insert':
          if (!options.data) throw new Error('Data required for insert');
          query = supabase.from(table).insert(options.data).select();
          break;
        case 'update':
          if (!options.data) throw new Error('Data required for update');
          query = supabase.from(table).update(options.data);
          break;
        case 'delete':
          query = supabase.from(table).delete();
          break;
      }

      // Apply where conditions
      if (options.where) {
        for (const [key, value] of Object.entries(options.where)) {
          if (value !== undefined) {
            query = query.eq(key, value);
          }
        }
      }

      // Apply ordering
      if (options.orderBy) {
        query = query.order(options.orderBy.column, {
          ascending: options.orderBy.ascending ?? true,
        });
      }

      // Apply pagination
      if (options.limit) {
        query = query.limit(options.limit);
      }
      if (options.offset) {
        query = query.range(options.offset, options.offset + (options.limit || 10) - 1);
      }

      const { data, error } = await query;

      if (error) {
        logger.error('DB query error', error, 'SYSTEM');
        return { rows: [], rowCount: 0, error };
      }

      return {
        rows: (data as T[]) || [],
        rowCount: data?.length || 0,
        error: null,
      };
    } catch (error) {
      logger.error('DB query exception', error as Error, 'SYSTEM');
      return { rows: [], rowCount: 0, error: error as Error };
    }
  }

  /**
   * Execute a transaction with multiple operations
   * Note: Supabase doesn't support true transactions from the client,
   * so this provides a consistent interface for batch operations
   */
  async transaction<T>(
    callback: (ctx: TransactionContext) => Promise<T>
  ): Promise<T> {
    const ctx: TransactionContext = {
      query: async <R>(table: string, operation: 'select' | 'insert' | 'update' | 'delete', options: QueryOptions) => {
        return this.query<R>(table, operation, options);
      },
    };

    try {
      const result = await callback(ctx);
      return result;
    } catch (error) {
      logger.error('Transaction failed', error as Error, 'SYSTEM');
      throw error;
    }
  }

  /**
   * Get connection status
   */
  get connected(): boolean {
    return this.isConnected;
  }

  /**
   * Health check
   */
  async healthCheck(): Promise<{ ok: boolean; latency: number }> {
    const start = Date.now();
    try {
      const ok = await this.ping();
      return { ok, latency: Date.now() - start };
    } catch {
      return { ok: false, latency: Date.now() - start };
    }
  }
}

export const db = new DatabaseService();
