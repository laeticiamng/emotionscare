/**
 * Provider pour optimiser les requêtes par batch
 * Évite les requêtes multiples simultanées
 */

import React from 'react';
import { logger } from '@/lib/logger';
import { queryOptimizer } from '@/lib/database/queryOptimizer';

interface BatchedQuery {
  id: string;
  table: string;
  filters: Record<string, any>;
  select: string;
  resolve: (data: any) => void;
  reject: (error: Error) => void;
}

interface BatchedQueryContextType {
  batchQuery: <T>(
    table: string,
    filters: Record<string, any>,
    select?: string
  ) => Promise<T>;
  clearBatch: () => void;
  getBatchStats: () => { pending: number; processed: number };
}

const BatchedQueryContext = React.createContext<BatchedQueryContextType | null>(null);

export const useBatchedQuery = () => {
  const context = React.useContext(BatchedQueryContext);
  if (!context) {
    throw new Error('useBatchedQuery must be used within BatchedQueryProvider');
  }
  return context;
};

export const BatchedQueryProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [pendingQueries, setPendingQueries] = React.useState<BatchedQuery[]>([]);
  const [processedCount, setProcessedCount] = React.useState(0);
  const timeoutRef = React.useRef<NodeJS.Timeout>();

  const processBatch = React.useCallback(async () => {
    if (pendingQueries.length === 0) return;

    const currentBatch = [...pendingQueries];
    setPendingQueries([]);

    logger.debug(`Processing batch of ${currentBatch.length} queries`, {}, 'BATCH');

    // Grouper par table pour optimiser
    const groupedByTable = currentBatch.reduce((acc, query) => {
      if (!acc[query.table]) {
        acc[query.table] = [];
      }
      acc[query.table].push(query);
      return acc;
    }, {} as Record<string, BatchedQuery[]>);

    // Traiter chaque groupe de table
    for (const [table, queries] of Object.entries(groupedByTable)) {
      try {
        // Si plusieurs requêtes identiques, les dédupliquer
        const uniqueQueries = queries.reduce((acc, query) => {
          const key = `${JSON.stringify(query.filters)}-${query.select}`;
          if (!acc[key]) {
            acc[key] = { query, resolvers: [] };
          }
          acc[key].resolvers.push({ resolve: query.resolve, reject: query.reject });
          return acc;
        }, {} as Record<string, { query: BatchedQuery; resolvers: Array<{ resolve: any; reject: any }> }>);

        // Exécuter les requêtes uniques
        for (const { query, resolvers } of Object.values(uniqueQueries)) {
          try {
            const result = await queryOptimizer.queryWithCache(
              query.table,
              query.filters,
              query.select
            );

            // Résoudre toutes les promesses avec le même résultat
            resolvers.forEach(({ resolve }) => resolve(result.data));
          } catch (error) {
            // Rejeter toutes les promesses avec la même erreur
            resolvers.forEach(({ reject }) => reject(error instanceof Error ? error : new Error(String(error))));
          }
        }
      } catch (error) {
        logger.error(`Batch processing error for table ${table}`, error, 'BATCH');
        queries.forEach(query => {
          query.reject(error instanceof Error ? error : new Error(String(error)));
        });
      }
    }

    setProcessedCount(prev => prev + currentBatch.length);
  }, [pendingQueries]);

  const batchQuery = React.useCallback(<T,>(
    table: string,
    filters: Record<string, any> = {},
    select = '*'
  ): Promise<T> => {
    return new Promise((resolve, reject) => {
      const queryId = `${table}-${Date.now()}-${Math.random()}`;
      
      const batchedQuery: BatchedQuery = {
        id: queryId,
        table,
        filters,
        select,
        resolve,
        reject
      };

      setPendingQueries(prev => [...prev, batchedQuery]);

      // Programmer le traitement du batch
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      timeoutRef.current = setTimeout(() => {
        processBatch();
      }, 10); // 10ms de délai pour batching
    });
  }, [processBatch]);

  const clearBatch = React.useCallback(() => {
    setPendingQueries([]);
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
  }, []);

  const getBatchStats = React.useCallback(() => ({
    pending: pendingQueries.length,
    processed: processedCount
  }), [pendingQueries.length, processedCount]);

  React.useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  const contextValue: BatchedQueryContextType = {
    batchQuery,
    clearBatch,
    getBatchStats
  };

  return (
    <BatchedQueryContext.Provider value={contextValue}>
      {children}
    </BatchedQueryContext.Provider>
  );
};

/**
 * Hook optimisé pour les requêtes fréquentes
 */
export const useOptimizedQuery = <T,>(
  table: string,
  filters: Record<string, any> = {},
  options: {
    select?: string;
    enabled?: boolean;
    refetchInterval?: number;
  } = {}
) => {
  const { batchQuery } = useBatchedQuery();
  const [data, setData] = React.useState<T | null>(null);
  const [isLoading, setIsLoading] = React.useState(false);
  const [error, setError] = React.useState<Error | null>(null);

  const { select = '*', enabled = true, refetchInterval } = options;

  const fetchData = React.useCallback(async () => {
    if (!enabled) return;

    setIsLoading(true);
    setError(null);

    try {
      const result = await batchQuery<T>(table, filters, select);
      setData(result);
    } catch (err) {
      setError(err instanceof Error ? err : new Error(String(err)));
    } finally {
      setIsLoading(false);
    }
  }, [batchQuery, table, filters, select, enabled]);

  React.useEffect(() => {
    fetchData();
  }, [fetchData]);

  React.useEffect(() => {
    if (refetchInterval && enabled) {
      const interval = setInterval(fetchData, refetchInterval);
      return () => clearInterval(interval);
    }
  }, [fetchData, refetchInterval, enabled]);

  return {
    data,
    isLoading,
    error,
    refetch: fetchData
  };
};

/**
 * Hook pour les mutations optimisées
 */
export const useOptimizedMutation = <T, V>(
  table: string,
  mutationFn: (variables: V) => Promise<T>
) => {
  const [isLoading, setIsLoading] = React.useState(false);
  const [error, setError] = React.useState<Error | null>(null);

  const mutate = React.useCallback(async (variables: V): Promise<T> => {
    setIsLoading(true);
    setError(null);

    try {
      const result = await mutationFn(variables);
      
      // Invalidate cache pour cette table
      queryOptimizer.clearCache(table);
      
      return result;
    } catch (err) {
      const error = err instanceof Error ? err : new Error(String(err));
      setError(error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [mutationFn, table]);

  return {
    mutate,
    isLoading,
    error
  };
};