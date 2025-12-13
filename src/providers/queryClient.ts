// @ts-nocheck
/**
 * Query Client Provider - Configuration du client React Query
 * Gestion centralisée des requêtes avec cache, retry et optimisations
 */

import {
  QueryClient,
  QueryCache,
  MutationCache,
  QueryClientConfig
} from '@tanstack/react-query';
import { logger } from '@/lib/logger';

/** Niveau de cache */
export type CacheLevel = 'aggressive' | 'normal' | 'minimal' | 'none';

/** Stratégie de retry */
export type RetryStrategy = 'none' | 'once' | 'standard' | 'aggressive';

/** Configuration de requête personnalisée */
export interface CustomQueryConfig {
  cacheLevel: CacheLevel;
  retryStrategy: RetryStrategy;
  enableLogging: boolean;
  enableDevtools: boolean;
  defaultStaleTime: number;
  defaultCacheTime: number;
  refetchOnMount: boolean | 'always';
  refetchOnWindowFocus: boolean | 'always';
  refetchOnReconnect: boolean | 'always';
}

/** Configuration de mutation personnalisée */
export interface CustomMutationConfig {
  retryStrategy: RetryStrategy;
  enableLogging: boolean;
  onErrorCallback?: (error: Error) => void;
  onSuccessCallback?: () => void;
}

/** Options de cache avancées */
export interface CacheOptions {
  maxSize: number;
  gcTime: number;
  persistence: 'memory' | 'localStorage' | 'indexedDB';
  compressionEnabled: boolean;
}

/** Statistiques du client */
export interface QueryClientStats {
  totalQueries: number;
  activeQueries: number;
  totalMutations: number;
  activeMutations: number;
  cacheSize: number;
  cacheHits: number;
  cacheMisses: number;
  errors: number;
  lastError: Error | null;
}

/** Preset de configuration */
export interface QueryClientPreset {
  name: string;
  description: string;
  config: Partial<CustomQueryConfig>;
}

// Configuration par défaut
const DEFAULT_QUERY_CONFIG: CustomQueryConfig = {
  cacheLevel: 'normal',
  retryStrategy: 'once',
  enableLogging: true,
  enableDevtools: process.env.NODE_ENV === 'development',
  defaultStaleTime: 60_000, // 1 minute
  defaultCacheTime: 300_000, // 5 minutes
  refetchOnMount: true,
  refetchOnWindowFocus: false,
  refetchOnReconnect: true
};

const DEFAULT_MUTATION_CONFIG: CustomMutationConfig = {
  retryStrategy: 'none',
  enableLogging: true
};

// Presets de configuration
const CONFIG_PRESETS: QueryClientPreset[] = [
  {
    name: 'aggressive-cache',
    description: 'Cache agressif pour réduire les requêtes réseau',
    config: {
      cacheLevel: 'aggressive',
      defaultStaleTime: 300_000, // 5 minutes
      defaultCacheTime: 900_000, // 15 minutes
      refetchOnWindowFocus: false,
      refetchOnMount: false
    }
  },
  {
    name: 'real-time',
    description: 'Données toujours fraîches, idéal pour le temps réel',
    config: {
      cacheLevel: 'minimal',
      defaultStaleTime: 0,
      defaultCacheTime: 60_000,
      refetchOnWindowFocus: 'always',
      refetchOnMount: 'always'
    }
  },
  {
    name: 'offline-first',
    description: 'Priorise le cache pour fonctionnement hors ligne',
    config: {
      cacheLevel: 'aggressive',
      defaultStaleTime: 600_000, // 10 minutes
      defaultCacheTime: 1800_000, // 30 minutes
      refetchOnWindowFocus: false,
      refetchOnReconnect: true
    }
  },
  {
    name: 'balanced',
    description: 'Configuration équilibrée par défaut',
    config: DEFAULT_QUERY_CONFIG
  }
];

// État global
let currentConfig: CustomQueryConfig = { ...DEFAULT_QUERY_CONFIG };
let mutationConfig: CustomMutationConfig = { ...DEFAULT_MUTATION_CONFIG };
const stats: QueryClientStats = {
  totalQueries: 0,
  activeQueries: 0,
  totalMutations: 0,
  activeMutations: 0,
  cacheSize: 0,
  cacheHits: 0,
  cacheMisses: 0,
  errors: 0,
  lastError: null
};

/** Convertir la stratégie de retry en nombre */
function getRetryCount(strategy: RetryStrategy): number | boolean {
  switch (strategy) {
    case 'none': return false;
    case 'once': return 1;
    case 'standard': return 3;
    case 'aggressive': return 5;
    default: return 1;
  }
}

/** Convertir le niveau de cache en staleTime */
function getStaleTimeForLevel(level: CacheLevel, base: number): number {
  switch (level) {
    case 'aggressive': return base * 5;
    case 'normal': return base;
    case 'minimal': return base / 3;
    case 'none': return 0;
    default: return base;
  }
}

/** Créer le QueryCache avec handlers */
function createQueryCache(): QueryCache {
  return new QueryCache({
    onError: (error, query) => {
      stats.errors++;
      stats.lastError = error as Error;

      if (currentConfig.enableLogging) {
        logger.error('Query error', {
          queryKey: query.queryKey,
          error: (error as Error).message
        }, 'QUERY_CLIENT');
      }
    },
    onSuccess: (data, query) => {
      if (currentConfig.enableLogging) {
        logger.debug('Query success', {
          queryKey: query.queryKey,
          dataSize: JSON.stringify(data).length
        }, 'QUERY_CLIENT');
      }
    },
    onSettled: (data, error, query) => {
      stats.totalQueries++;
      if (currentConfig.enableLogging) {
        logger.debug('Query settled', {
          queryKey: query.queryKey,
          success: !error
        }, 'QUERY_CLIENT');
      }
    }
  });
}

/** Créer le MutationCache avec handlers */
function createMutationCache(): MutationCache {
  return new MutationCache({
    onError: (error, variables, context, mutation) => {
      stats.errors++;
      stats.lastError = error as Error;

      if (mutationConfig.enableLogging) {
        logger.error('Mutation error', {
          mutationKey: mutation.options.mutationKey,
          error: (error as Error).message
        }, 'QUERY_CLIENT');
      }

      if (mutationConfig.onErrorCallback) {
        mutationConfig.onErrorCallback(error as Error);
      }
    },
    onSuccess: (data, variables, context, mutation) => {
      if (mutationConfig.enableLogging) {
        logger.info('Mutation success', {
          mutationKey: mutation.options.mutationKey
        }, 'QUERY_CLIENT');
      }

      if (mutationConfig.onSuccessCallback) {
        mutationConfig.onSuccessCallback();
      }
    },
    onSettled: () => {
      stats.totalMutations++;
    }
  });
}

/** Créer la configuration du client */
function createClientConfig(): QueryClientConfig {
  const staleTime = getStaleTimeForLevel(
    currentConfig.cacheLevel,
    currentConfig.defaultStaleTime
  );

  return {
    queryCache: createQueryCache(),
    mutationCache: createMutationCache(),
    defaultOptions: {
      queries: {
        retry: getRetryCount(currentConfig.retryStrategy),
        staleTime,
        gcTime: currentConfig.defaultCacheTime,
        refetchOnMount: currentConfig.refetchOnMount,
        refetchOnWindowFocus: currentConfig.refetchOnWindowFocus,
        refetchOnReconnect: currentConfig.refetchOnReconnect,
        networkMode: 'online'
      },
      mutations: {
        retry: getRetryCount(mutationConfig.retryStrategy),
        networkMode: 'online'
      }
    }
  };
}

/** Client principal */
export const queryClient = new QueryClient(createClientConfig());

/** Configurer les requêtes */
export function configureQueries(config: Partial<CustomQueryConfig>): void {
  currentConfig = { ...currentConfig, ...config };

  // Mettre à jour les options par défaut
  queryClient.setDefaultOptions({
    queries: {
      retry: getRetryCount(currentConfig.retryStrategy),
      staleTime: getStaleTimeForLevel(
        currentConfig.cacheLevel,
        currentConfig.defaultStaleTime
      ),
      gcTime: currentConfig.defaultCacheTime,
      refetchOnMount: currentConfig.refetchOnMount,
      refetchOnWindowFocus: currentConfig.refetchOnWindowFocus,
      refetchOnReconnect: currentConfig.refetchOnReconnect
    }
  });

  logger.info('Query config updated', { config: currentConfig }, 'QUERY_CLIENT');
}

/** Configurer les mutations */
export function configureMutations(config: Partial<CustomMutationConfig>): void {
  mutationConfig = { ...mutationConfig, ...config };

  queryClient.setDefaultOptions({
    mutations: {
      retry: getRetryCount(mutationConfig.retryStrategy)
    }
  });
}

/** Appliquer un preset */
export function applyPreset(presetName: string): boolean {
  const preset = CONFIG_PRESETS.find(p => p.name === presetName);
  if (!preset) {
    logger.warn(`Preset not found: ${presetName}`, {}, 'QUERY_CLIENT');
    return false;
  }

  configureQueries(preset.config);
  logger.info(`Applied preset: ${presetName}`, {}, 'QUERY_CLIENT');
  return true;
}

/** Obtenir la configuration actuelle */
export function getQueryConfig(): CustomQueryConfig {
  return { ...currentConfig };
}

/** Obtenir la configuration des mutations */
export function getMutationConfig(): CustomMutationConfig {
  return { ...mutationConfig };
}

/** Obtenir les statistiques */
export function getQueryClientStats(): QueryClientStats {
  const queryCache = queryClient.getQueryCache();
  const mutationCache = queryClient.getMutationCache();

  return {
    ...stats,
    activeQueries: queryCache.getAll().filter(q => q.state.status === 'pending').length,
    activeMutations: mutationCache.getAll().filter(m => m.state.status === 'pending').length,
    cacheSize: queryCache.getAll().length
  };
}

/** Réinitialiser les statistiques */
export function resetQueryClientStats(): void {
  stats.totalQueries = 0;
  stats.totalMutations = 0;
  stats.cacheHits = 0;
  stats.cacheMisses = 0;
  stats.errors = 0;
  stats.lastError = null;
}

/** Invalider toutes les requêtes */
export async function invalidateAllQueries(): Promise<void> {
  await queryClient.invalidateQueries();
  logger.info('All queries invalidated', {}, 'QUERY_CLIENT');
}

/** Invalider par préfixe de clé */
export async function invalidateQueriesByPrefix(prefix: string): Promise<void> {
  await queryClient.invalidateQueries({
    predicate: (query) =>
      Array.isArray(query.queryKey) &&
      query.queryKey.length > 0 &&
      String(query.queryKey[0]).startsWith(prefix)
  });
}

/** Précharger des données */
export async function prefetchQuery<T>(
  queryKey: unknown[],
  queryFn: () => Promise<T>,
  staleTime?: number
): Promise<void> {
  await queryClient.prefetchQuery({
    queryKey,
    queryFn,
    staleTime: staleTime ?? currentConfig.defaultStaleTime
  });
}

/** Définir des données dans le cache */
export function setQueryData<T>(queryKey: unknown[], data: T): void {
  queryClient.setQueryData(queryKey, data);
}

/** Obtenir des données du cache */
export function getQueryData<T>(queryKey: unknown[]): T | undefined {
  return queryClient.getQueryData<T>(queryKey);
}

/** Supprimer des données du cache */
export function removeQueryData(queryKey: unknown[]): void {
  queryClient.removeQueries({ queryKey });
}

/** Vider le cache */
export function clearCache(): void {
  queryClient.clear();
  logger.info('Query cache cleared', {}, 'QUERY_CLIENT');
}

/** Obtenir les presets disponibles */
export function getAvailablePresets(): QueryClientPreset[] {
  return [...CONFIG_PRESETS];
}

/** Créer un client personnalisé */
export function createCustomQueryClient(config: Partial<CustomQueryConfig>): QueryClient {
  const mergedConfig = { ...DEFAULT_QUERY_CONFIG, ...config };
  const staleTime = getStaleTimeForLevel(mergedConfig.cacheLevel, mergedConfig.defaultStaleTime);

  return new QueryClient({
    defaultOptions: {
      queries: {
        retry: getRetryCount(mergedConfig.retryStrategy),
        staleTime,
        gcTime: mergedConfig.defaultCacheTime,
        refetchOnMount: mergedConfig.refetchOnMount,
        refetchOnWindowFocus: mergedConfig.refetchOnWindowFocus,
        refetchOnReconnect: mergedConfig.refetchOnReconnect
      },
      mutations: {
        retry: 0
      }
    }
  });
}

/** Helpers pour les clés de requête */
export const queryKeys = {
  all: ['all'] as const,
  user: (userId: string) => ['user', userId] as const,
  users: () => ['users'] as const,
  session: (sessionId: string) => ['session', sessionId] as const,
  sessions: (userId: string) => ['sessions', userId] as const,
  coach: (coachId: string) => ['coach', coachId] as const,
  activities: (userId: string) => ['activities', userId] as const,
  activity: (activityId: string) => ['activity', activityId] as const,
  preferences: (userId: string) => ['preferences', userId] as const,
  analytics: (userId: string, period: string) => ['analytics', userId, period] as const,
  conversations: (userId: string) => ['conversations', userId] as const,
  messages: (conversationId: string) => ['messages', conversationId] as const
};

/** Export par défaut */
export default queryClient;
