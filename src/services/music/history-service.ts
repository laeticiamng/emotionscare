/**
 * Music History Service
 * Gestion de l'historique d'écoute avec Supabase
 */

import { supabase } from '@/integrations/supabase/client';
import { logger } from '@/lib/logger';
import type { MusicTrack } from '@/types/music';

export interface MusicHistoryEntry {
  id: string;
  user_id: string;
  track_id: string;
  track_title: string | null;
  track_artist: string | null;
  track_url: string | null;
  track_duration: number | null;
  listen_duration: number | null;
  completion_rate: number | null;
  emotion: string | null;
  mood: string | null;
  played_at: string;
  device: string | null;
  source: string | null;
  metadata: Record<string, any> | null;
}

export interface SaveHistoryParams {
  track: MusicTrack;
  listenDuration?: number;
  completionRate?: number;
  device?: string;
  source?: string;
  metadata?: Record<string, any>;
}

export interface ListeningStats {
  total_listens: number;
  total_duration_seconds: number;
  avg_completion_rate: number;
  top_emotion: string | null;
  last_played_at: string | null;
}

/**
 * Sauvegarder une entrée d'historique
 */
export async function saveHistoryEntry(params: SaveHistoryParams): Promise<{ success: boolean; error?: string }> {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      return { success: false, error: 'User not authenticated' };
    }

    const { track, listenDuration, completionRate, device, source, metadata } = params;

    // Détecter le device si non fourni
    const detectedDevice = device || detectDevice();

    const { error } = await supabase
      .from('music_history')
      .insert({
        user_id: user.id,
        track_id: track.id,
        track_title: track.title,
        track_artist: track.artist,
        track_url: track.audioUrl || track.url,
        track_duration: track.duration,
        listen_duration: listenDuration || null,
        completion_rate: completionRate || null,
        emotion: track.emotion || null,
        mood: track.mood || null,
        device: detectedDevice,
        source: source || 'player',
        metadata: metadata || null,
      });

    if (error) throw error;

    logger.info('History entry saved', { 
      trackId: track.id, 
      duration: listenDuration,
      completion: completionRate 
    }, 'MUSIC');
    
    return { success: true };
  } catch (error) {
    logger.error('Failed to save history entry', error as Error, 'MUSIC');
    return { success: false, error: (error as Error).message };
  }
}

/**
 * Récupérer l'historique d'écoute de l'utilisateur
 */
export async function getUserHistory(limit: number = 50): Promise<MusicHistoryEntry[]> {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      logger.warn('Cannot fetch history: user not authenticated', undefined, 'MUSIC');
      return [];
    }

    const { data, error } = await supabase
      .from('music_history')
      .select('*')
      .eq('user_id', user.id)
      .order('played_at', { ascending: false })
      .limit(limit);

    if (error) throw error;

    return data || [];
  } catch (error) {
    logger.error('Failed to fetch history', error as Error, 'MUSIC');
    return [];
  }
}

/**
 * Obtenir les statistiques d'écoute
 */
export async function getUserListeningStats(): Promise<ListeningStats | null> {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) return null;

    const { data, error } = await supabase
      .rpc('get_user_listening_stats', { p_user_id: user.id })
      .single();

    if (error) throw error;

    return data as ListeningStats;
  } catch (error) {
    logger.error('Failed to get listening stats', error as Error, 'MUSIC');
    return null;
  }
}

/**
 * Récupérer les tracks les plus écoutés
 */
export async function getTopTracks(limit: number = 10): Promise<Array<{
  track_id: string;
  track_title: string;
  track_artist: string;
  play_count: number;
  total_duration: number;
}>> {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) return [];

    const { data, error } = await supabase
      .from('music_history')
      .select('track_id, track_title, track_artist, listen_duration')
      .eq('user_id', user.id);

    if (error) throw error;

    // Agréger localement (en attendant une view SQL optimisée)
    const grouped = (data || []).reduce((acc, entry) => {
      const key = entry.track_id;
      if (!acc[key]) {
        acc[key] = {
          track_id: entry.track_id,
          track_title: entry.track_title || 'Unknown',
          track_artist: entry.track_artist || 'Unknown',
          play_count: 0,
          total_duration: 0,
        };
      }
      acc[key].play_count++;
      acc[key].total_duration += entry.listen_duration || 0;
      return acc;
    }, {} as Record<string, any>);

    return Object.values(grouped)
      .sort((a: any, b: any) => b.play_count - a.play_count)
      .slice(0, limit);
  } catch (error) {
    logger.error('Failed to get top tracks', error as Error, 'MUSIC');
    return [];
  }
}

/**
 * Supprimer l'historique d'écoute
 */
export async function clearHistory(): Promise<{ success: boolean; error?: string }> {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      return { success: false, error: 'User not authenticated' };
    }

    const { error } = await supabase
      .from('music_history')
      .delete()
      .eq('user_id', user.id);

    if (error) throw error;

    logger.info('History cleared', undefined, 'MUSIC');
    return { success: true };
  } catch (error) {
    logger.error('Failed to clear history', error as Error, 'MUSIC');
    return { success: false, error: (error as Error).message };
  }
}

/**
 * Mettre à jour une entrée d'historique (ex: durée finale après écoute)
 */
export async function updateHistoryEntry(
  entryId: string, 
  updates: Partial<Pick<MusicHistoryEntry, 'listen_duration' | 'completion_rate' | 'metadata'>>
): Promise<{ success: boolean; error?: string }> {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      return { success: false, error: 'User not authenticated' };
    }

    const { error } = await supabase
      .from('music_history')
      .update(updates)
      .eq('id', entryId)
      .eq('user_id', user.id);

    if (error) throw error;

    return { success: true };
  } catch (error) {
    logger.error('Failed to update history entry', error as Error, 'MUSIC');
    return { success: false, error: (error as Error).message };
  }
}

// Helpers

/**
 * Détecter le type de device
 */
function detectDevice(): string {
  if (typeof window === 'undefined') return 'server';
  
  const ua = navigator.userAgent.toLowerCase();
  
  if (/mobile|android|iphone|ipad|ipod/.test(ua)) {
    return 'mobile';
  }
  
  if (/tablet|ipad/.test(ua)) {
    return 'tablet';
  }
  
  return 'desktop';
}

/**
 * Calculer le taux de complétion
 */
export function calculateCompletionRate(listenDuration: number, trackDuration: number): number {
  if (trackDuration === 0) return 0;
  return Math.min(100, Math.round((listenDuration / trackDuration) * 100));
}
