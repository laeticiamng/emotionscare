/**
 * Offline Services Integration - Phase 4
 * Wrapper pour supporter l'offline mode avec Supabase et localStorage
 */

import { offlineQueue } from './offlineQueue';
import { logger } from './logger';
import { supabase } from '@/integrations/supabase/client';

/**
 * Wrapper pour les mutations émotions
 * Sauvegarde en queue si offline, sinon envoie à Supabase
 */
export async function saveEmotionOffline(
  emotionData: any
): Promise<any> {
  try {
    if (navigator.onLine) {
      // Online: envoyer directement à Supabase
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data, error } = await supabase
          .from('mood_entries')
          .insert({
            user_id: user.id,
            mood_score: emotionData.score,
            emotions: emotionData.emotions,
            notes: emotionData.notes,
            created_at: new Date().toISOString(),
          })
          .select()
          .single();

        if (error) throw error;
        return data;
      }
      return emotionData;
    }

    // Offline: ajouter à la queue locale
    logger.info('Saving emotion to offline queue', {}, 'OFFLINE');
    const queueItem = await offlineQueue.addToQueue(
      'emotion',
      emotionData,
      'mood_entries',
      'POST',
      'normal'
    );

    return {
      ...emotionData,
      id: queueItem.id,
      _offlineQueue: true,
      _queueId: queueItem.id,
    };
  } catch (error) {
    logger.error('Failed to save emotion', error as Error, 'OFFLINE');
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
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data, error } = await supabase
          .from('journal_entries')
          .insert({
            user_id: user.id,
            content: entryData.content,
            title: entryData.title,
            mood: entryData.mood,
            tags: entryData.tags,
            created_at: new Date().toISOString(),
          })
          .select()
          .single();

        if (error) throw error;
        return data;
      }
      return entryData;
    }

    logger.info('Saving journal entry to offline queue', {}, 'OFFLINE');
    const queueItem = await offlineQueue.addToQueue(
      'journal',
      entryData,
      'journal_entries',
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
    logger.error('Failed to save journal entry', error as Error, 'OFFLINE');
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
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data, error } = await supabase
          .from('user_playlists')
          .insert({
            user_id: user.id,
            name: playlistData.name,
            description: playlistData.description,
            tracks: playlistData.tracks,
            created_at: new Date().toISOString(),
          })
          .select()
          .single();

        if (error) throw error;
        return data;
      }
      return playlistData;
    }

    logger.info('Saving playlist to offline queue', {}, 'OFFLINE');
    const queueItem = await offlineQueue.addToQueue(
      'music-playlist',
      playlistData,
      'user_playlists',
      'POST',
      'high'
    );

    return {
      ...playlistData,
      id: queueItem.id,
      _offlineQueue: true,
      _queueId: queueItem.id,
    };
  } catch (error) {
    logger.error('Failed to save playlist', error as Error, 'OFFLINE');
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
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        await supabase
          .from('user_preferences')
          .upsert({
            user_id: user.id,
            preference_key: key,
            preference_value: value,
            updated_at: new Date().toISOString(),
          });
      }
      return;
    }

    logger.info('Saving preference to offline queue', { key }, 'OFFLINE');
    await offlineQueue.addToQueue(
      'preference',
      { key, value },
      'user_preferences',
      'PUT',
      'low'
    );
  } catch (error) {
    logger.error('Failed to save preference', error as Error, 'OFFLINE');
    throw error;
  }
}

/**
 * Wrapper pour récupérer les données avec fallback cache
 */
export async function fetchWithOfflineFallback<T>(
  tableName: string,
  query: any
): Promise<T[]> {
  try {
    if (navigator.onLine) {
      const { data, error } = await supabase
        .from(tableName)
        .select(query.select || '*')
        .order(query.orderBy || 'created_at', { ascending: false })
        .limit(query.limit || 50);

      if (error) throw error;
      
      // Cache les données
      localStorage.setItem(`cache_${tableName}`, JSON.stringify(data));
      return data as T[];
    }

    // Offline: utiliser le cache
    const cached = localStorage.getItem(`cache_${tableName}`);
    if (cached) {
      logger.info('Using cached data', { tableName }, 'OFFLINE');
      return JSON.parse(cached);
    }

    return [];
  } catch (error) {
    logger.error('Fetch with offline fallback failed', error as Error, 'OFFLINE');
    
    // Essayer le cache en cas d'erreur
    const cached = localStorage.getItem(`cache_${tableName}`);
    if (cached) {
      return JSON.parse(cached);
    }
    
    return [];
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
