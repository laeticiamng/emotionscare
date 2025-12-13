// @ts-nocheck
/**
 * Score Sync - Synchronisation des scores avec le serveur
 * Gestion de la synchronisation, files d'attente et réconciliation
 */

import { getEvents, clearEvents, getExtendedEvents, ExtendedSessionEvent } from "./events";
import { hasConsent } from "@/ui/CookieConsent";
import { safeFetch } from "@/lib/net/safeFetch";
import { ff } from "@/lib/flags/ff";
import { logger } from '@/lib/logger';

/** Configuration de synchronisation */
export interface SyncConfig {
  enabled: boolean;
  batchSize: number;
  maxRetries: number;
  retryDelay: number;
  syncInterval: number;
  endpoint: string;
  requireConsent: boolean;
  requireFeatureFlag: boolean;
  timeout: number;
  compressPayload: boolean;
}

/** Résultat de synchronisation */
export interface SyncResult {
  success: boolean;
  sent: number;
  failed: number;
  errors?: SyncError[];
  timestamp: number;
  duration: number;
  serverResponse?: SyncServerResponse;
}

/** Erreur de synchronisation */
export interface SyncError {
  eventId?: string;
  code: string;
  message: string;
  retryable: boolean;
}

/** Réponse du serveur */
export interface SyncServerResponse {
  received: number;
  processed: number;
  duplicates?: number;
  errors?: Array<{
    eventId: string;
    error: string;
  }>;
  serverTimestamp: number;
}

/** État de synchronisation */
export interface SyncState {
  lastSync: number | null;
  lastSuccessfulSync: number | null;
  pendingEvents: number;
  failedAttempts: number;
  isOnline: boolean;
  isSyncing: boolean;
  consecutiveFailures: number;
}

/** Stats de synchronisation */
export interface SyncStats {
  totalSyncs: number;
  successfulSyncs: number;
  failedSyncs: number;
  totalEventsSent: number;
  totalEventsProcessed: number;
  averageSyncTime: number;
  lastError?: string;
}

// Configuration par défaut
const DEFAULT_CONFIG: SyncConfig = {
  enabled: true,
  batchSize: 100,
  maxRetries: 3,
  retryDelay: 1000,
  syncInterval: 60000, // 1 minute
  endpoint: '/api/scores/sync',
  requireConsent: true,
  requireFeatureFlag: true,
  timeout: 10000,
  compressPayload: false
};

// État global
let config: SyncConfig = { ...DEFAULT_CONFIG };
const state: SyncState = {
  lastSync: null,
  lastSuccessfulSync: null,
  pendingEvents: 0,
  failedAttempts: 0,
  isOnline: typeof navigator !== 'undefined' ? navigator.onLine : true,
  isSyncing: false,
  consecutiveFailures: 0
};

const stats: SyncStats = {
  totalSyncs: 0,
  successfulSyncs: 0,
  failedSyncs: 0,
  totalEventsSent: 0,
  totalEventsProcessed: 0,
  averageSyncTime: 0
};

// File d'attente des événements en échec
const failedQueue: ExtendedSessionEvent[] = [];

// Timer pour la synchronisation automatique
let syncTimer: NodeJS.Timeout | null = null;

// Listeners pour les événements de sync
const listeners: Array<(result: SyncResult) => void> = [];

/** Configurer la synchronisation */
export function configureSyncService(userConfig: Partial<SyncConfig>): void {
  config = { ...config, ...userConfig };

  // Redémarrer le timer si l'intervalle a changé
  if (userConfig.syncInterval !== undefined) {
    stopAutoSync();
    if (config.enabled) {
      startAutoSync();
    }
  }

  logger.info('Sync configured', { config }, 'SYNC');
}

/** Vérifier si la synchronisation est autorisée */
function canSync(): boolean {
  if (!config.enabled) {
    logger.debug('Sync disabled', {}, 'SYNC');
    return false;
  }

  if (config.requireFeatureFlag && !(ff?.("telemetry-opt-in") ?? false)) {
    logger.debug('Telemetry feature flag not enabled', {}, 'SYNC');
    return false;
  }

  if (config.requireConsent && !(hasConsent?.("analytics") ?? false)) {
    logger.debug('Analytics consent not given', {}, 'SYNC');
    return false;
  }

  if (!state.isOnline) {
    logger.debug('Device is offline', {}, 'SYNC');
    return false;
  }

  return true;
}

/** Tenter la synchronisation des scores */
export async function trySyncScores(): Promise<SyncResult> {
  if (!canSync()) {
    return {
      success: false,
      sent: 0,
      failed: 0,
      timestamp: Date.now(),
      duration: 0,
      errors: [{ code: 'SYNC_DISABLED', message: 'Synchronization not allowed', retryable: false }]
    };
  }

  if (state.isSyncing) {
    return {
      success: false,
      sent: 0,
      failed: 0,
      timestamp: Date.now(),
      duration: 0,
      errors: [{ code: 'SYNC_IN_PROGRESS', message: 'Sync already in progress', retryable: true }]
    };
  }

  const startTime = performance.now();
  state.isSyncing = true;
  state.lastSync = Date.now();
  stats.totalSyncs++;

  try {
    // Récupérer les événements à synchroniser
    const events = getExtendedEvents();
    const pendingFromQueue = [...failedQueue];
    const allEvents = [...pendingFromQueue, ...events];

    if (allEvents.length === 0) {
      state.isSyncing = false;
      return {
        success: true,
        sent: 0,
        failed: 0,
        timestamp: Date.now(),
        duration: performance.now() - startTime
      };
    }

    // Diviser en lots
    const batches = chunkArray(allEvents, config.batchSize);
    const results: SyncResult[] = [];

    for (const batch of batches) {
      const batchResult = await syncBatch(batch);
      results.push(batchResult);

      // Arrêter si trop d'erreurs consécutives
      if (!batchResult.success && state.consecutiveFailures >= config.maxRetries) {
        break;
      }
    }

    // Agréger les résultats
    const aggregated = aggregateResults(results, startTime);

    // Nettoyer les événements synchronisés
    if (aggregated.sent > 0) {
      clearEvents();
      // Retirer les événements réussis de la file d'échec
      failedQueue.splice(0, Math.min(pendingFromQueue.length, aggregated.sent));
    }

    // Mettre à jour les stats
    if (aggregated.success) {
      state.consecutiveFailures = 0;
      state.lastSuccessfulSync = Date.now();
      stats.successfulSyncs++;
    } else {
      state.consecutiveFailures++;
      stats.failedSyncs++;
      stats.lastError = aggregated.errors?.[0]?.message;
    }

    stats.totalEventsSent += aggregated.sent;
    stats.totalEventsProcessed += aggregated.serverResponse?.processed || 0;
    updateAverageSyncTime(aggregated.duration);

    // Notifier les listeners
    notifyListeners(aggregated);

    logger.info('Sync completed', {
      success: aggregated.success,
      sent: aggregated.sent,
      failed: aggregated.failed,
      duration: aggregated.duration
    }, 'SYNC');

    return aggregated;

  } catch (error) {
    state.consecutiveFailures++;
    stats.failedSyncs++;

    const errorResult: SyncResult = {
      success: false,
      sent: 0,
      failed: getEvents().length,
      timestamp: Date.now(),
      duration: performance.now() - startTime,
      errors: [{
        code: 'SYNC_ERROR',
        message: error instanceof Error ? error.message : 'Unknown error',
        retryable: true
      }]
    };

    logger.error('Sync failed', error as Error, 'SYNC');
    notifyListeners(errorResult);

    return errorResult;

  } finally {
    state.isSyncing = false;
  }
}

/** Synchroniser un lot d'événements */
async function syncBatch(events: ExtendedSessionEvent[]): Promise<SyncResult> {
  const startTime = performance.now();

  try {
    const payload = config.compressPayload
      ? await compressPayload(events)
      : JSON.stringify({ events });

    const res = await safeFetch(config.endpoint, {
      method: "POST",
      headers: {
        "Content-Type": config.compressPayload ? "application/gzip" : "application/json"
      },
      body: payload,
      timeoutMs: config.timeout,
      retries: config.maxRetries
    });

    if (res.ok) {
      const serverResponse: SyncServerResponse = await res.json();

      return {
        success: true,
        sent: events.length,
        failed: serverResponse.errors?.length || 0,
        timestamp: Date.now(),
        duration: performance.now() - startTime,
        serverResponse
      };
    } else {
      // Ajouter les événements à la file d'échec
      failedQueue.push(...events);

      return {
        success: false,
        sent: 0,
        failed: events.length,
        timestamp: Date.now(),
        duration: performance.now() - startTime,
        errors: [{
          code: `HTTP_${res.status}`,
          message: `Server returned ${res.status}`,
          retryable: res.status >= 500
        }]
      };
    }

  } catch (error) {
    // Ajouter les événements à la file d'échec
    failedQueue.push(...events);

    return {
      success: false,
      sent: 0,
      failed: events.length,
      timestamp: Date.now(),
      duration: performance.now() - startTime,
      errors: [{
        code: 'NETWORK_ERROR',
        message: error instanceof Error ? error.message : 'Network error',
        retryable: true
      }]
    };
  }
}

/** Compresser le payload (si supporté) */
async function compressPayload(events: ExtendedSessionEvent[]): Promise<ArrayBuffer | string> {
  const json = JSON.stringify({ events });

  if (typeof CompressionStream === 'undefined') {
    return json;
  }

  try {
    const stream = new Blob([json]).stream();
    const compressedStream = stream.pipeThrough(new CompressionStream('gzip'));
    const compressedBlob = await new Response(compressedStream).blob();
    return await compressedBlob.arrayBuffer();
  } catch {
    return json;
  }
}

/** Diviser un tableau en chunks */
function chunkArray<T>(array: T[], size: number): T[][] {
  const chunks: T[][] = [];
  for (let i = 0; i < array.length; i += size) {
    chunks.push(array.slice(i, i + size));
  }
  return chunks;
}

/** Agréger les résultats de synchronisation */
function aggregateResults(results: SyncResult[], startTime: number): SyncResult {
  const sent = results.reduce((sum, r) => sum + r.sent, 0);
  const failed = results.reduce((sum, r) => sum + r.failed, 0);
  const errors = results.flatMap(r => r.errors || []);
  const success = results.every(r => r.success);

  return {
    success,
    sent,
    failed,
    timestamp: Date.now(),
    duration: performance.now() - startTime,
    errors: errors.length > 0 ? errors : undefined,
    serverResponse: results.find(r => r.serverResponse)?.serverResponse
  };
}

/** Mettre à jour le temps moyen de synchronisation */
function updateAverageSyncTime(duration: number): void {
  const totalSyncs = stats.successfulSyncs + stats.failedSyncs;
  stats.averageSyncTime = (stats.averageSyncTime * (totalSyncs - 1) + duration) / totalSyncs;
}

/** Notifier les listeners */
function notifyListeners(result: SyncResult): void {
  listeners.forEach(listener => listener(result));
}

/** Démarrer la synchronisation automatique */
export function startAutoSync(): void {
  if (syncTimer) return;

  syncTimer = setInterval(() => {
    if (canSync() && !state.isSyncing) {
      trySyncScores();
    }
  }, config.syncInterval);

  logger.info('Auto sync started', { interval: config.syncInterval }, 'SYNC');
}

/** Arrêter la synchronisation automatique */
export function stopAutoSync(): void {
  if (syncTimer) {
    clearInterval(syncTimer);
    syncTimer = null;
    logger.info('Auto sync stopped', {}, 'SYNC');
  }
}

/** Forcer une synchronisation immédiate */
export async function forceSyncNow(): Promise<SyncResult> {
  // Ignorer les vérifications de consentement pour un sync forcé
  const originalRequireConsent = config.requireConsent;
  const originalRequireFlag = config.requireFeatureFlag;

  config.requireConsent = false;
  config.requireFeatureFlag = false;

  try {
    return await trySyncScores();
  } finally {
    config.requireConsent = originalRequireConsent;
    config.requireFeatureFlag = originalRequireFlag;
  }
}

/** S'abonner aux événements de synchronisation */
export function onSync(callback: (result: SyncResult) => void): () => void {
  listeners.push(callback);
  return () => {
    const index = listeners.indexOf(callback);
    if (index > -1) listeners.splice(index, 1);
  };
}

/** Obtenir l'état de synchronisation */
export function getSyncState(): SyncState {
  return {
    ...state,
    pendingEvents: getEvents().length + failedQueue.length
  };
}

/** Obtenir les stats de synchronisation */
export function getSyncStats(): SyncStats {
  return { ...stats };
}

/** Obtenir la configuration actuelle */
export function getSyncConfig(): SyncConfig {
  return { ...config };
}

/** Vider la file d'événements en échec */
export function clearFailedQueue(): number {
  const count = failedQueue.length;
  failedQueue.length = 0;
  return count;
}

/** Réinitialiser l'état de synchronisation */
export function resetSyncState(): void {
  state.lastSync = null;
  state.lastSuccessfulSync = null;
  state.failedAttempts = 0;
  state.consecutiveFailures = 0;
  failedQueue.length = 0;
  logger.info('Sync state reset', {}, 'SYNC');
}

// Gestion de la connectivité
if (typeof window !== 'undefined') {
  window.addEventListener('online', () => {
    state.isOnline = true;
    logger.info('Device online', {}, 'SYNC');
    // Tenter une synchronisation quand on revient en ligne
    if (config.enabled && failedQueue.length > 0) {
      trySyncScores();
    }
  });

  window.addEventListener('offline', () => {
    state.isOnline = false;
    logger.info('Device offline', {}, 'SYNC');
  });

  // Synchroniser avant de quitter la page
  window.addEventListener('beforeunload', () => {
    if (canSync() && getEvents().length > 0) {
      // Utiliser sendBeacon pour un envoi fiable
      const events = getEvents();
      navigator.sendBeacon?.(config.endpoint, JSON.stringify({ events }));
    }
  });
}

export default {
  trySyncScores,
  configureSyncService,
  startAutoSync,
  stopAutoSync,
  forceSyncNow,
  onSync,
  getSyncState,
  getSyncStats,
  getSyncConfig,
  clearFailedQueue,
  resetSyncState
};
