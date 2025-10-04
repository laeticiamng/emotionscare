/**
 * Service pour la musicothérapie
 */

import { supabase } from '@/integrations/supabase/client';

export interface MusicSession {
  id: string;
  user_id: string;
  playlist_id?: string;
  mood_before?: number;
  mood_after?: number;
  duration_seconds: number;
  tracks_played: string[];
  created_at: string;
  completed_at?: string;
}

export class MusicTherapyService {
  /**
   * Générer une playlist basée sur l'humeur
   */
  static async generatePlaylist(
    userId: string,
    mood: string,
    preferences?: any
  ): Promise<any> {
    const { data, error } = await supabase.functions.invoke('coach-ai', {
      body: {
        action: 'generate_music',
        userId,
        mood,
        preferences
      }
    });

    if (error) throw error;
    return data;
  }

  /**
   * Créer une session d'écoute
   */
  static async createSession(
    userId: string,
    playlistId?: string,
    moodBefore?: number
  ): Promise<MusicSession> {
    const { data, error } = await supabase
      .from('music_sessions')
      .insert({
        user_id: userId,
        playlist_id: playlistId,
        mood_before: moodBefore,
        duration_seconds: 0,
        tracks_played: []
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  /**
   * Compléter une session
   */
  static async completeSession(
    sessionId: string,
    durationSeconds: number,
    tracksPlayed: string[],
    moodAfter?: number
  ): Promise<void> {
    const { error } = await supabase
      .from('music_sessions')
      .update({
        duration_seconds: durationSeconds,
        tracks_played: tracksPlayed,
        mood_after: moodAfter,
        completed_at: new Date().toISOString()
      })
      .eq('id', sessionId);

    if (error) throw error;
  }

  /**
   * Récupérer l'historique
   */
  static async fetchHistory(userId: string, limit: number = 20): Promise<MusicSession[]> {
    const { data, error } = await supabase
      .from('music_sessions')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) throw error;
    return data || [];
  }
}
