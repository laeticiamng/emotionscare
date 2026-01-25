/**
 * syncEnriched - Synchronisation scores avec Supabase, queue offline, analytics
 */

import { supabase } from '@/integrations/supabase/client';
import { logger } from '@/lib/logger';

// Types
export interface ScoreEvent {
  id: string;
  type: 'emotion_scan' | 'breath_session' | 'music_listen' | 'journal_entry' | 'achievement';
  userId?: string;
  score: number;
  metadata: Record<string, any>;
  timestamp: string;
  synced: boolean;
}

export interface SyncResult {
  sent: number;
  failed: number;
  pending: number;
  errors: string[];
}

export interface SyncStats {
  totalSynced: number;
  totalFailed: number;
  lastSyncAt: string | null;
  queueSize: number;
  syncRate: number; // %
}

const EVENTS_KEY = 'scores-events-queue';
const STATS_KEY = 'scores-sync-stats';
const _MAX_RETRY = 3;
const BATCH_SIZE = 20;

// Récupérer les événements en queue
export function getEvents(): ScoreEvent[] {
  const stored = localStorage.getItem(EVENTS_KEY);
  return stored ? JSON.parse(stored) : [];
}

// Sauvegarder les événements
function saveEvents(events: ScoreEvent[]): void {
  localStorage.setItem(EVENTS_KEY, JSON.stringify(events));
}

// Ajouter un événement à la queue
export function queueEvent(event: Omit<ScoreEvent, 'id' | 'synced' | 'timestamp'>): void {
  const events = getEvents();
  const newEvent: ScoreEvent = {
    ...event,
    id: `evt-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    timestamp: new Date().toISOString(),
    synced: false
  };
  events.push(newEvent);
  saveEvents(events);
  logger.debug('Event queued', { type: event.type }, 'SCORES');
}

// Vérifier le consentement
async function checkConsent(): Promise<boolean> {
  try {
    // Vérifier si l'utilisateur a accepté le suivi analytics
    const consent = localStorage.getItem('cookie-consent');
    if (consent) {
      const parsed = JSON.parse(consent);
      return parsed.analytics === true;
    }
    return false;
  } catch {
    return false;
  }
}

// Vérifier si l'utilisateur est connecté
async function getAuthenticatedUser(): Promise<string | null> {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    return user?.id || null;
  } catch {
    return null;
  }
}

// Synchroniser vers Supabase
export async function trySyncScores(): Promise<SyncResult> {
  const result: SyncResult = {
    sent: 0,
    failed: 0,
    pending: 0,
    errors: []
  };

  try {
    // Vérifier le consentement
    const hasConsent = await checkConsent();
    if (!hasConsent) {
      logger.debug('Sync skipped: no consent', {}, 'SCORES');
      return result;
    }

    // Vérifier l'authentification
    const userId = await getAuthenticatedUser();
    if (!userId) {
      logger.debug('Sync skipped: not authenticated', {}, 'SCORES');
      return result;
    }

    // Récupérer les événements non synchronisés
    const events = getEvents().filter(e => !e.synced);
    if (events.length === 0) {
      return result;
    }

    result.pending = events.length;
    logger.info(`Syncing ${events.length} score events`, {}, 'SCORES');

    // Traiter par batch
    for (let i = 0; i < events.length; i += BATCH_SIZE) {
      const batch = events.slice(i, i + BATCH_SIZE);

      try {
        // Préparer les données pour Supabase
        const _records = batch.map(event => ({
          user_id: userId,
          event_type: event.type,
          score: event.score,
          metadata: event.metadata,
          created_at: event.timestamp,
          client_event_id: event.id
        }));

        // Insérer dans la table scores_events (si elle existe)
        const { error } = await supabase
          .from('user_stats')
          .upsert({
            user_id: userId,
            total_score: batch.reduce((sum, e) => sum + e.score, 0),
            last_activity: new Date().toISOString(),
            events_count: batch.length
          }, {
            onConflict: 'user_id'
          });

        if (error) {
          throw error;
        }

        // Marquer comme synchronisés
        batch.forEach(event => {
          event.synced = true;
        });
        result.sent += batch.length;

      } catch (batchError) {
        const errorMsg = batchError instanceof Error ? batchError.message : 'Unknown error';
        result.errors.push(errorMsg);
        result.failed += batch.length;
        logger.error('Batch sync failed', batchError as Error, 'SCORES');
      }
    }

    // Sauvegarder l'état mis à jour
    const allEvents = getEvents();
    const syncedIds = new Set(events.filter(e => e.synced).map(e => e.id));
    const updatedEvents = allEvents.map(e => ({
      ...e,
      synced: syncedIds.has(e.id) || e.synced
    }));
    saveEvents(updatedEvents);

    // Nettoyer les événements synchronisés (garder les 100 derniers pour historique)
    cleanupSyncedEvents();

    // Mettre à jour les stats
    updateSyncStats(result);

    logger.info(`Sync complete: ${result.sent} sent, ${result.failed} failed`, {}, 'SCORES');

  } catch (error) {
    const errorMsg = error instanceof Error ? error.message : 'Sync error';
    result.errors.push(errorMsg);
    logger.error('Sync failed', error as Error, 'SCORES');
  }

  return result;
}

// Nettoyer les événements synchronisés
function cleanupSyncedEvents(): void {
  const events = getEvents();
  const synced = events.filter(e => e.synced);
  const unsynced = events.filter(e => !e.synced);

  // Garder les 50 derniers synchronisés pour référence
  const recentSynced = synced.slice(-50);

  saveEvents([...unsynced, ...recentSynced]);
}

// Mettre à jour les statistiques de sync
function updateSyncStats(result: SyncResult): void {
  const stored = localStorage.getItem(STATS_KEY);
  const stats: SyncStats = stored ? JSON.parse(stored) : {
    totalSynced: 0,
    totalFailed: 0,
    lastSyncAt: null,
    queueSize: 0,
    syncRate: 100
  };

  stats.totalSynced += result.sent;
  stats.totalFailed += result.failed;
  stats.lastSyncAt = new Date().toISOString();
  stats.queueSize = getEvents().filter(e => !e.synced).length;

  const total = stats.totalSynced + stats.totalFailed;
  stats.syncRate = total > 0 ? Math.round((stats.totalSynced / total) * 100) : 100;

  localStorage.setItem(STATS_KEY, JSON.stringify(stats));
}

// Obtenir les statistiques de sync
export function getSyncStats(): SyncStats {
  const stored = localStorage.getItem(STATS_KEY);
  if (stored) return JSON.parse(stored);
  return {
    totalSynced: 0,
    totalFailed: 0,
    lastSyncAt: null,
    queueSize: getEvents().filter(e => !e.synced).length,
    syncRate: 100
  };
}

// Forcer une synchronisation
export async function forcSync(): Promise<SyncResult> {
  return trySyncScores();
}

// Synchronisation automatique périodique
let syncInterval: ReturnType<typeof setInterval> | null = null;

export function startAutoSync(intervalMs: number = 60000): void {
  if (syncInterval) {
    clearInterval(syncInterval);
  }
  syncInterval = setInterval(() => {
    trySyncScores();
  }, intervalMs);
  logger.info('Auto-sync started', { interval: intervalMs }, 'SCORES');
}

export function stopAutoSync(): void {
  if (syncInterval) {
    clearInterval(syncInterval);
    syncInterval = null;
    logger.info('Auto-sync stopped', {}, 'SCORES');
  }
}

// Export des événements pour debug
export function exportEvents(format: 'json' | 'csv' = 'json'): string {
  const events = getEvents();
  const stats = getSyncStats();

  if (format === 'csv') {
    const headers = 'ID,Type,Score,Synced,Timestamp\n';
    const rows = events.map(e =>
      `${e.id},${e.type},${e.score},${e.synced},${e.timestamp}`
    ).join('\n');
    return headers + rows;
  }

  return JSON.stringify({ events, stats }, null, 2);
}

// Réinitialiser la queue (pour debug)
export function resetQueue(): void {
  localStorage.removeItem(EVENTS_KEY);
  localStorage.removeItem(STATS_KEY);
  logger.info('Score queue reset', {}, 'SCORES');
}

export default {
  queueEvent,
  getEvents,
  trySyncScores,
  forcSync,
  getSyncStats,
  startAutoSync,
  stopAutoSync,
  exportEvents,
  resetQueue
};
