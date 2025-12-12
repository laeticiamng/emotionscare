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

// ========== MÉTHODES ENRICHIES ==========

/**
 * Obtenir l'historique par date
 */
export async function getHistoryByDate(date: Date): Promise<MusicHistoryEntry[]> {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return [];

    const startOfDay = new Date(date);
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date(date);
    endOfDay.setHours(23, 59, 59, 999);

    const { data, error } = await supabase
      .from('music_history')
      .select('*')
      .eq('user_id', user.id)
      .gte('played_at', startOfDay.toISOString())
      .lte('played_at', endOfDay.toISOString())
      .order('played_at', { ascending: false });

    if (error) throw error;
    return data || [];
  } catch (error) {
    logger.error('Failed to get history by date', error as Error, 'MUSIC');
    return [];
  }
}

/**
 * Obtenir l'historique de la semaine
 */
export async function getWeeklyHistory(): Promise<MusicHistoryEntry[]> {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return [];

    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);

    const { data, error } = await supabase
      .from('music_history')
      .select('*')
      .eq('user_id', user.id)
      .gte('played_at', weekAgo.toISOString())
      .order('played_at', { ascending: false });

    if (error) throw error;
    return data || [];
  } catch (error) {
    logger.error('Failed to get weekly history', error as Error, 'MUSIC');
    return [];
  }
}

/**
 * Obtenir les tracks récemment écoutés uniques
 */
export async function getRecentlyPlayed(limit: number = 20): Promise<MusicHistoryEntry[]> {
  try {
    const history = await getUserHistory(limit * 3);

    const seen = new Set<string>();
    const unique: MusicHistoryEntry[] = [];

    for (const entry of history) {
      if (!seen.has(entry.track_id)) {
        seen.add(entry.track_id);
        unique.push(entry);
        if (unique.length >= limit) break;
      }
    }

    return unique;
  } catch (error) {
    logger.error('Failed to get recently played', error as Error, 'MUSIC');
    return [];
  }
}

/**
 * Obtenir le temps d'écoute total
 */
export async function getTotalListeningTime(): Promise<number> {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return 0;

    const { data, error } = await supabase
      .from('music_history')
      .select('listen_duration')
      .eq('user_id', user.id);

    if (error) throw error;

    return (data || []).reduce((sum, entry) => sum + (entry.listen_duration || 0), 0);
  } catch (error) {
    logger.error('Failed to get total listening time', error as Error, 'MUSIC');
    return 0;
  }
}

/**
 * Obtenir l'historique par émotion
 */
export async function getHistoryByEmotion(emotion: string): Promise<MusicHistoryEntry[]> {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return [];

    const { data, error } = await supabase
      .from('music_history')
      .select('*')
      .eq('user_id', user.id)
      .eq('emotion', emotion)
      .order('played_at', { ascending: false })
      .limit(50);

    if (error) throw error;
    return data || [];
  } catch (error) {
    logger.error('Failed to get history by emotion', error as Error, 'MUSIC');
    return [];
  }
}

/**
 * Obtenir les émotions les plus fréquentes
 */
export async function getTopEmotions(limit: number = 5): Promise<Array<{ emotion: string; count: number }>> {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return [];

    const { data, error } = await supabase
      .from('music_history')
      .select('emotion')
      .eq('user_id', user.id)
      .not('emotion', 'is', null);

    if (error) throw error;

    const emotionCounts: Record<string, number> = {};
    (data || []).forEach(entry => {
      if (entry.emotion) {
        emotionCounts[entry.emotion] = (emotionCounts[entry.emotion] || 0) + 1;
      }
    });

    return Object.entries(emotionCounts)
      .map(([emotion, count]) => ({ emotion, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, limit);
  } catch (error) {
    logger.error('Failed to get top emotions', error as Error, 'MUSIC');
    return [];
  }
}

/**
 * Obtenir les statistiques d'écoute par jour
 */
export async function getDailyStats(days: number = 7): Promise<Array<{
  date: string;
  tracksCount: number;
  totalDuration: number;
  avgCompletion: number;
}>> {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return [];

    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    const { data, error } = await supabase
      .from('music_history')
      .select('played_at, listen_duration, completion_rate')
      .eq('user_id', user.id)
      .gte('played_at', startDate.toISOString());

    if (error) throw error;

    const byDay: Record<string, { tracks: number; duration: number; completions: number[] }> = {};

    (data || []).forEach(entry => {
      const date = entry.played_at.split('T')[0];
      if (!byDay[date]) {
        byDay[date] = { tracks: 0, duration: 0, completions: [] };
      }
      byDay[date].tracks++;
      byDay[date].duration += entry.listen_duration || 0;
      if (entry.completion_rate) byDay[date].completions.push(entry.completion_rate);
    });

    return Object.entries(byDay)
      .map(([date, stats]) => ({
        date,
        tracksCount: stats.tracks,
        totalDuration: stats.duration,
        avgCompletion: stats.completions.length > 0
          ? Math.round(stats.completions.reduce((a, b) => a + b, 0) / stats.completions.length)
          : 0
      }))
      .sort((a, b) => a.date.localeCompare(b.date));
  } catch (error) {
    logger.error('Failed to get daily stats', error as Error, 'MUSIC');
    return [];
  }
}

/**
 * Exporter l'historique en JSON
 */
export async function exportHistory(): Promise<string> {
  try {
    const history = await getUserHistory(1000);
    return JSON.stringify(history, null, 2);
  } catch (error) {
    logger.error('Failed to export history', error as Error, 'MUSIC');
    return '[]';
  }
}

/**
 * Rechercher dans l'historique
 */
export async function searchHistory(query: string, limit: number = 50): Promise<MusicHistoryEntry[]> {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return [];

    const { data, error } = await supabase
      .from('music_history')
      .select('*')
      .eq('user_id', user.id)
      .or(`track_title.ilike.%${query}%,track_artist.ilike.%${query}%`)
      .order('played_at', { ascending: false })
      .limit(limit);

    if (error) throw error;
    return data || [];
  } catch (error) {
    logger.error('Failed to search history', error as Error, 'MUSIC');
    return [];
  }
}

/**
 * Supprimer une entrée spécifique de l'historique
 */
export async function deleteHistoryEntry(entryId: string): Promise<{ success: boolean; error?: string }> {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { success: false, error: 'User not authenticated' };

    const { error } = await supabase
      .from('music_history')
      .delete()
      .eq('id', entryId)
      .eq('user_id', user.id);

    if (error) throw error;

    logger.info('History entry deleted', { entryId }, 'MUSIC');
    return { success: true };
  } catch (error) {
    logger.error('Failed to delete history entry', error as Error, 'MUSIC');
    return { success: false, error: (error as Error).message };
  }
}
