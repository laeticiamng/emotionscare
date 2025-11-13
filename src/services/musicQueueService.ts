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
