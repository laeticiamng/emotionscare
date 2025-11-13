/**
 * Music Queue Service - Gestion de la file d'attente
 */

import { supabase } from '@/integrations/supabase/client';
import { logger } from '@/lib/logger';

export interface QueueItem {
  id: string;
  user_id: string;
  emotion: string;
  intensity: number;
  user_context?: string;
  mood?: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  track_id?: string;
  error_message?: string;
  retry_count: number;
  max_retries: number;
  created_at: string;
  started_at?: string;
  completed_at?: string;
}

export interface SunoApiStatus {
  id: string;
  is_available: boolean;
  last_check: string;
  response_time_ms?: number;
  error_message?: string;
  consecutive_failures: number;
}

/**
 * Récupère le statut de l'API Suno
 */
export async function getSunoApiStatus(): Promise<SunoApiStatus | null> {
  try {
    const { data, error } = await supabase
      .from('suno_api_status')
      .select('*')
      .order('last_check', { ascending: false })
      .limit(1)
      .single();

    if (error) {
      logger.error('Failed to fetch Suno API status', error, 'MUSIC_QUEUE');
      return null;
    }

    return data as SunoApiStatus;
  } catch (error) {
    logger.error('Error fetching Suno API status', error as Error, 'MUSIC_QUEUE');
    return null;
  }
}

/**
 * Récupère les éléments de la queue de l'utilisateur
 */
export async function getUserQueueItems(): Promise<QueueItem[]> {
  try {
    const { data, error } = await supabase
      .from('music_generation_queue')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(10);

    if (error) {
      logger.error('Failed to fetch queue items', error, 'MUSIC_QUEUE');
      return [];
    }

    return data as QueueItem[];
  } catch (error) {
    logger.error('Error fetching queue items', error as Error, 'MUSIC_QUEUE');
    return [];
  }
}

/**
 * Récupère la position dans la queue
 */
export async function getQueuePosition(queueId: string): Promise<number> {
  try {
    const { data: item, error: itemError } = await supabase
      .from('music_generation_queue')
      .select('created_at, status')
      .eq('id', queueId)
      .single();

    if (itemError || !item) {
      return -1;
    }

    if (item.status !== 'pending') {
      return 0;
    }

    const { count, error: countError } = await supabase
      .from('music_generation_queue')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'pending')
      .lt('created_at', item.created_at);

    if (countError) {
      return -1;
    }

    return (count || 0) + 1;
  } catch (error) {
    logger.error('Error getting queue position', error as Error, 'MUSIC_QUEUE');
    return -1;
  }
}

/**
 * Déclenche manuellement le worker de la queue
 */
export async function triggerQueueWorker(): Promise<boolean> {
  try {
    const { error } = await supabase.functions.invoke('music-queue-worker', {
      body: {}
    });

    if (error) {
      logger.error('Failed to trigger queue worker', error, 'MUSIC_QUEUE');
      return false;
    }

    return true;
  } catch (error) {
    logger.error('Error triggering queue worker', error as Error, 'MUSIC_QUEUE');
    return false;
  }
}

/**
 * Vérifie le statut de l'API Suno
 */
export async function checkSunoApiStatus(): Promise<SunoApiStatus | null> {
  try {
    const { data, error } = await supabase.functions.invoke('suno-status-check', {
      body: {}
    });

    if (error) {
      logger.error('Failed to check Suno API status', error, 'MUSIC_QUEUE');
      return null;
    }

    return data?.status as SunoApiStatus;
  } catch (error) {
    logger.error('Error checking Suno API status', error as Error, 'MUSIC_QUEUE');
    return null;
  }
}

/**
 * FONCTIONS ADMINISTRATIVES
 */

export interface QueueStatistics {
  pending: number;
  processing: number;
  completed_24h: number;
  failed_24h: number;
  success_rate: number;
  avg_processing_time: number;
}

/**
 * Récupère toutes les demandes de la queue (admin)
 */
export async function getAllQueueItems(): Promise<QueueItem[]> {
  try {
    const { data, error } = await supabase
      .from('music_generation_queue')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(100);

    if (error) {
      logger.error('Failed to fetch all queue items', error, 'MUSIC_QUEUE');
      return [];
    }

    return data as QueueItem[];
  } catch (error) {
    logger.error('Error fetching all queue items', error as Error, 'MUSIC_QUEUE');
    return [];
  }
}

/**
 * Récupère les statistiques de la queue
 */
export async function getQueueStatistics(): Promise<QueueStatistics | null> {
  try {
    const now = new Date();
    const yesterday = new Date(now.getTime() - 24 * 60 * 60 * 1000);

    // Compter par statut
    const { count: pending } = await supabase
      .from('music_generation_queue')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'pending');

    const { count: processing } = await supabase
      .from('music_generation_queue')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'processing');

    const { count: completed_24h } = await supabase
      .from('music_generation_queue')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'completed')
      .gte('completed_at', yesterday.toISOString());

    const { count: failed_24h } = await supabase
      .from('music_generation_queue')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'failed')
      .gte('created_at', yesterday.toISOString());

    // Calculer le taux de réussite
    const total = (completed_24h || 0) + (failed_24h || 0);
    const success_rate = total > 0 ? ((completed_24h || 0) / total) * 100 : 0;

    // Calculer le temps moyen de traitement
    const { data: completedItems } = await supabase
      .from('music_generation_queue')
      .select('started_at, completed_at')
      .eq('status', 'completed')
      .not('started_at', 'is', null)
      .not('completed_at', 'is', null)
      .gte('completed_at', yesterday.toISOString())
      .limit(50);

    let avg_processing_time = 0;
    if (completedItems && completedItems.length > 0) {
      const times = completedItems.map(item => {
        const start = new Date(item.started_at!).getTime();
        const end = new Date(item.completed_at!).getTime();
        return (end - start) / 1000; // en secondes
      });
      avg_processing_time = times.reduce((a, b) => a + b, 0) / times.length;
    }

    return {
      pending: pending || 0,
      processing: processing || 0,
      completed_24h: completed_24h || 0,
      failed_24h: failed_24h || 0,
      success_rate,
      avg_processing_time,
    };
  } catch (error) {
    logger.error('Error fetching queue statistics', error as Error, 'MUSIC_QUEUE');
    return null;
  }
}

/**
 * Relance manuellement un élément de la queue
 */
export async function retryQueueItem(queueId: string): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('music_generation_queue')
      .update({
        status: 'pending',
        error_message: null,
        started_at: null,
        completed_at: null,
      })
      .eq('id', queueId);

    if (error) {
      logger.error('Failed to retry queue item', error, 'MUSIC_QUEUE');
      return false;
    }

    return true;
  } catch (error) {
    logger.error('Error retrying queue item', error as Error, 'MUSIC_QUEUE');
    return false;
  }
}

/**
 * Annule un élément de la queue
 */
export async function cancelQueueItem(queueId: string): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('music_generation_queue')
      .update({
        status: 'failed',
        error_message: 'Annulé manuellement par un administrateur',
        completed_at: new Date().toISOString(),
      })
      .eq('id', queueId);

    if (error) {
      logger.error('Failed to cancel queue item', error, 'MUSIC_QUEUE');
      return false;
    }

    return true;
  } catch (error) {
    logger.error('Error canceling queue item', error as Error, 'MUSIC_QUEUE');
    return false;
  }
}
