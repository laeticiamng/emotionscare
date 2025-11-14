/**
 * Offline Services Integration - Phase 4
 * Wrapper pour supporter l'offline mode dans les services existants
 */

import { offlineQueue } from './offlineQueue';
import { logger } from './logger';

/**
 * Wrapper pour les mutations émotions
 * Sauvegarde en queue si offline
 */
export async function saveEmotionOffline(
  emotionData: any
): Promise<any> {
  try {
    // Si online, faire l'appel normal
    if (navigator.onLine) {
      // L'appel normal sera fait par le service
      return emotionData;
    }

    // Si offline, ajouter à la queue
    logger.info('Saving emotion to offline queue', {}, 'OFFLINE');

    const queueItem = await offlineQueue.addToQueue(
      'emotion',
      emotionData,
      '/api/emotions',
      'POST',
      'normal'
    );

    // Retourner les données avec un ID temporaire
    return {
      ...emotionData,
      id: queueItem.id,
      _offlineQueue: true,
      _queueId: queueItem.id,
    };
  } catch (error) {
    logger.error('Failed to save emotion offline', error as Error, 'OFFLINE');
    throw error;
  }
}

/**
 * Wrapper pour les mutations journal
 */
export async function saveJournalEntryOffline(
  entryData: any
): Promise<any> {
  try {
    if (navigator.onLine) {
      return entryData;
    }

    logger.info('Saving journal entry to offline queue', {}, 'OFFLINE');

    const queueItem = await offlineQueue.addToQueue(
      'journal',
      entryData,
      '/api/journal-entries',
      'POST',
      'normal'
    );

    return {
      ...entryData,
      id: queueItem.id,
      _offlineQueue: true,
      _queueId: queueItem.id,
    };
  } catch (error) {
    logger.error(
      'Failed to save journal entry offline',
      error as Error,
      'OFFLINE'
    );
    throw error;
  }
}

/**
 * Wrapper pour les mutations playlist musicale
 */
export async function savePlaylistOffline(
  playlistData: any
): Promise<any> {
  try {
    if (navigator.onLine) {
      return playlistData;
    }

    logger.info('Saving playlist to offline queue', {}, 'OFFLINE');

    const queueItem = await offlineQueue.addToQueue(
      'music-playlist',
      playlistData,
      '/api/music-playlists',
      'POST',
      'high' // Haute priorité pour la musique
    );

    return {
      ...playlistData,
      id: queueItem.id,
      _offlineQueue: true,
      _queueId: queueItem.id,
    };
  } catch (error) {
    logger.error('Failed to save playlist offline', error as Error, 'OFFLINE');
    throw error;
  }
}

/**
 * Wrapper pour mettre à jour une préférence utilisateur
 */
export async function updatePreferenceOffline(
  key: string,
  value: any
): Promise<void> {
  try {
    if (navigator.onLine) {
      return;
    }

    logger.info('Saving preference to offline queue', { key }, 'OFFLINE');

    await offlineQueue.addToQueue(
      'preference',
      { key, value },
      '/api/user-preferences',
      'PUT',
      'low'
    );
  } catch (error) {
    logger.error('Failed to save preference offline', error as Error, 'OFFLINE');
    throw error;
  }
}

/**
 * Wrapper pour récupérer les données avec fallback cache
 */
export async function fetchWithOfflineFallback(
  url: string,
  options?: RequestInit
): Promise<Response> {
  try {
    // Essayer de fetch
    if (navigator.onLine) {
      return await fetch(url, options);
    }

    // Si offline, vérifier le cache
    const cache = await caches.open('emotionscare-api-v1');
    const cachedResponse = await cache.match(url);

    if (cachedResponse) {
      logger.info('Using cached response', { url }, 'OFFLINE');
      return cachedResponse;
    }

    // Pas de cache, retourner une erreur 503
    return new Response(
      JSON.stringify({
        error: 'Offline and no cached data available',
      }),
      {
        status: 503,
        statusText: 'Service Unavailable',
        headers: { 'Content-Type': 'application/json' },
      }
    );
  } catch (error) {
    logger.error('Fetch with offline fallback failed', error as Error, 'OFFLINE');
    throw error;
  }
}

/**
 * Sync wrapper pour déclencher la synchronisation manuelle
 */
export async function triggerOfflineSync(): Promise<{
  synced: number;
  failed: number;
}> {
  try {
    if (!navigator.onLine) {
      throw new Error('Cannot sync while offline');
    }

    logger.info('Triggering offline sync', {}, 'OFFLINE');
    const result = await offlineQueue.sync();

    logger.info('Offline sync completed', result, 'OFFLINE');
    return result;
  } catch (error) {
    logger.error('Offline sync failed', error as Error, 'OFFLINE');
    throw error;
  }
}

/**
 * Récupérer le statut de la queue
 */
export async function getOfflineQueueStatus() {
  try {
    await offlineQueue.initialize();
    return await offlineQueue.getStats();
  } catch (error) {
    logger.error('Failed to get offline queue status', error as Error, 'OFFLINE');
    return {
      total: 0,
      pending: 0,
      syncing: 0,
      synced: 0,
      failed: 0,
      conflicts: 0,
    };
  }
}

/**
 * Récupérer toutes les émotions (y compris offline queue)
 */
export async function getEmotionsWithOfflineQueue(
  emotions: any[] = []
): Promise<any[]> {
  try {
    // Ajouter les émotions qui sont en queue
    const queueItems = await offlineQueue.getAll();
    const offlineEmotions = queueItems
      .filter((item) => item.type === 'emotion')
      .map((item) => ({
        ...item.data,
        id: item.id,
        _offlineQueue: true,
        _queueStatus: item.status,
      }));

    return [...emotions, ...offlineEmotions];
  } catch (error) {
    logger.error('Failed to get emotions with offline queue', error as Error, 'OFFLINE');
    return emotions;
  }
}
