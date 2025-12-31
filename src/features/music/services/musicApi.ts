/**
 * Music API Client - Utilise Supabase edge functions
 * Client pour l'API musicale intégrée avec Supabase
 */

import { supabase } from '@/integrations/supabase/client';
import { logger } from '@/lib/logger';

// Types locaux (remplace les imports de @emotionscare/contracts)
export interface MusicGenerationSession {
  id: string;
  user_id: string;
  task_id: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  emotion_state: {
    valence?: number;
    arousal?: number;
    mood?: string;
    genre?: string;
    tempo?: string;
  };
  suno_config: {
    customMode?: boolean;
    instrumental?: boolean;
    title?: string;
    style?: string;
    prompt?: string;
    model?: string;
  };
  result?: {
    audio_url?: string;
    image_url?: string;
    duration?: number;
    title?: string;
  };
  created_at: string;
  completed_at?: string;
}

export interface CreateMusicGenerationInput {
  emotionState: {
    valence?: number;
    arousal?: number;
    mood?: string;
    genre?: string;
  };
  emotionBadge?: string;
  config: {
    customMode?: boolean;
    instrumental?: boolean;
    title?: string;
    style?: string;
    prompt?: string;
    model?: string;
  };
}

export interface ListMusicSessionsInput {
  limit?: number;
  offset?: number;
  status?: string;
}

class MusicApiClient {
  /**
   * Liste les sessions de génération musicale
   */
  async listSessions(filters?: ListMusicSessionsInput): Promise<MusicGenerationSession[]> {
    try {
      let query = supabase
        .from('music_generation_sessions')
        .select('*')
        .order('created_at', { ascending: false });

      if (filters?.limit) {
        query = query.limit(filters.limit);
      }
      if (filters?.status) {
        query = query.eq('status', filters.status);
      }

      const { data, error } = await query;

      if (error) {
        logger.error('Failed to list music sessions', error, 'MUSIC_API');
        throw new Error(error.message);
      }

      return (data || []).map(item => ({
        ...item,
        emotion_state: item.emotion_state as MusicGenerationSession['emotion_state'],
        suno_config: item.suno_config as MusicGenerationSession['suno_config'],
        result: item.result as MusicGenerationSession['result'],
      }));
    } catch (error) {
      logger.error('listSessions error', error as Error, 'MUSIC_API');
      return [];
    }
  }

  /**
   * Récupère une session par ID
   */
  async getSession(id: string): Promise<MusicGenerationSession | null> {
    try {
      const { data, error } = await supabase
        .from('music_generation_sessions')
        .select('*')
        .eq('id', id)
        .single();

      if (error) {
        if (error.code === 'PGRST116') return null; // Not found
        throw new Error(error.message);
      }

      return {
        ...data,
        emotion_state: data.emotion_state as MusicGenerationSession['emotion_state'],
        suno_config: data.suno_config as MusicGenerationSession['suno_config'],
        result: data.result as MusicGenerationSession['result'],
      };
    } catch (error) {
      logger.error('getSession error', error as Error, 'MUSIC_API');
      return null;
    }
  }

  /**
   * Crée une nouvelle génération musicale
   */
  async createGeneration(input: CreateMusicGenerationInput): Promise<MusicGenerationSession> {
    try {
      const { data: userData } = await supabase.auth.getUser();
      if (!userData.user) {
        throw new Error('User not authenticated');
      }

      const taskId = crypto.randomUUID();

      const { data, error } = await supabase
        .from('music_generation_sessions')
        .insert({
          user_id: userData.user.id,
          task_id: taskId,
          status: 'pending',
          emotion_state: input.emotionState,
          suno_config: input.config,
        })
        .select()
        .single();

      if (error) throw new Error(error.message);

      // Appeler l'edge function pour lancer la génération
      const { error: fnError } = await supabase.functions.invoke('generate-music', {
        body: {
          sessionId: data.id,
          taskId,
          emotionState: input.emotionState,
          config: input.config,
        },
      });

      if (fnError) {
        logger.warn('Edge function call failed, session created but generation may not start', 'MUSIC_API');
      }

      return {
        ...data,
        emotion_state: data.emotion_state as MusicGenerationSession['emotion_state'],
        suno_config: data.suno_config as MusicGenerationSession['suno_config'],
        result: data.result as MusicGenerationSession['result'],
      };
    } catch (error) {
      logger.error('createGeneration error', error as Error, 'MUSIC_API');
      throw error;
    }
  }

  /**
   * Annule une génération en cours
   */
  async cancelGeneration(id: string): Promise<void> {
    try {
      const { error } = await supabase
        .from('music_generation_sessions')
        .update({ status: 'failed' })
        .eq('id', id);

      if (error) throw new Error(error.message);
    } catch (error) {
      logger.error('cancelGeneration error', error as Error, 'MUSIC_API');
      throw error;
    }
  }

  /**
   * Supprime une session
   */
  async deleteSession(id: string): Promise<void> {
    try {
      const { error } = await supabase
        .from('music_generation_sessions')
        .delete()
        .eq('id', id);

      if (error) throw new Error(error.message);
    } catch (error) {
      logger.error('deleteSession error', error as Error, 'MUSIC_API');
      throw error;
    }
  }

  /**
   * Récupère les statistiques d'écoute
   */
  async getListeningStats(): Promise<{
    totalListens: number;
    totalDuration: number;
    topEmotion: string;
  }> {
    try {
      const { data: userData } = await supabase.auth.getUser();
      if (!userData.user) {
        return { totalListens: 0, totalDuration: 0, topEmotion: 'calm' };
      }

      const { data, error } = await supabase
        .rpc('get_user_listening_stats', { p_user_id: userData.user.id });

      if (error || !data?.[0]) {
        return { totalListens: 0, totalDuration: 0, topEmotion: 'calm' };
      }

      return {
        totalListens: Number(data[0].total_listens) || 0,
        totalDuration: Number(data[0].total_duration_seconds) || 0,
        topEmotion: data[0].top_emotion || 'calm',
      };
    } catch (error) {
      logger.error('getListeningStats error', error as Error, 'MUSIC_API');
      return { totalListens: 0, totalDuration: 0, topEmotion: 'calm' };
    }
  }

  /**
   * Récupère l'historique d'écoute
   */
  async getHistory(limit = 50): Promise<any[]> {
    try {
      const { data, error } = await supabase
        .from('music_history')
        .select('*')
        .order('played_at', { ascending: false })
        .limit(limit);

      if (error) throw new Error(error.message);
      return data || [];
    } catch (error) {
      logger.error('getHistory error', error as Error, 'MUSIC_API');
      return [];
    }
  }

  /**
   * Ajoute une entrée à l'historique
   */
  async addToHistory(trackData: {
    trackId: string;
    trackTitle: string;
    trackArtist?: string;
    emotion?: string;
    duration?: number;
  }): Promise<void> {
    try {
      const { data: userData } = await supabase.auth.getUser();
      if (!userData.user) return;

      await supabase
        .from('music_history')
        .insert({
          user_id: userData.user.id,
          track_id: trackData.trackId,
          track_title: trackData.trackTitle,
          track_artist: trackData.trackArtist || 'Unknown',
          emotion: trackData.emotion,
          listen_duration: trackData.duration,
        });
    } catch (error) {
      logger.error('addToHistory error', error as Error, 'MUSIC_API');
    }
  }

  /**
   * Récupère les favoris
   */
  async getFavorites(): Promise<string[]> {
    try {
      const { data, error } = await supabase
        .from('music_favorites')
        .select('track_id');

      if (error) throw new Error(error.message);
      return (data || []).map(f => f.track_id);
    } catch (error) {
      logger.error('getFavorites error', error as Error, 'MUSIC_API');
      return [];
    }
  }

  /**
   * Toggle un favori
   */
  async toggleFavorite(trackId: string): Promise<boolean> {
    try {
      const { data: userData } = await supabase.auth.getUser();
      if (!userData.user) return false;

      // Vérifier si déjà favori
      const { data: existing } = await supabase
        .from('music_favorites')
        .select('id')
        .eq('user_id', userData.user.id)
        .eq('track_id', trackId)
        .maybeSingle();

      if (existing) {
        await supabase.from('music_favorites').delete().eq('id', existing.id);
        return false;
      } else {
        await supabase.from('music_favorites').insert({
          user_id: userData.user.id,
          track_id: trackId,
        });
        return true;
      }
    } catch (error) {
      logger.error('toggleFavorite error', error as Error, 'MUSIC_API');
      return false;
    }
  }
}

export const musicApi = new MusicApiClient();
