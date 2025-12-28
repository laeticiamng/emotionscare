// @ts-nocheck

import { supabase } from '@/integrations/supabase/client';
import { logger } from '@/lib/logger';

export interface MusicTrack {
  id: string;
  title: string;
  artist: string;
  url: string;
  duration: number;
  emotion?: string;
  genre?: string;
  mood?: string;
}

export class MusicService {
  /**
   * Génère de la musique via emotion-music-ai (Suno API)
   */
  static async generateMusic(emotion: string, mood?: string): Promise<MusicTrack> {
    try {
      const { data, error } = await supabase.functions.invoke('emotion-music-ai', {
        body: { action: 'generate-music', emotion, customPrompt: mood }
      });

      if (error) throw error;

      return {
        id: data.trackId || data.id || crypto.randomUUID(),
        title: data.title || `${emotion} - Therapeutic Music`,
        artist: 'EmotionsCare AI',
        url: data.audio_url || '',
        duration: data.duration || 120,
        emotion,
        mood
      };
    } catch (error) {
      logger.error('Erreur génération musique', error as Error, 'MUSIC');
      throw new Error('Erreur lors de la génération musicale');
    }
  }

  /**
   * Récupère des recommandations via adaptive-music
   */
  static async getRecommendedTracks(emotion: string): Promise<MusicTrack[]> {
    try {
      const { data, error } = await supabase.functions.invoke('adaptive-music', {
        body: { action: 'create-playlist', emotions: [emotion], duration: 30 }
      });

      if (error) throw error;

      // Transformer les tracks adaptive-music en MusicTrack
      return (data.tracks || []).map((track: any) => ({
        id: track.id,
        title: track.title,
        artist: track.artist || 'EmotionsCare',
        url: track.url,
        duration: track.duration,
        emotion: emotion,
        genre: track.emotion_tags?.[0]
      }));
    } catch (error) {
      logger.error('Erreur recommandations', error as Error, 'MUSIC');
      return [];
    }
  }

  static async saveFavorite(trackId: string): Promise<void> {
    try {
      const { error } = await supabase
        .from('music_favorites')
        .insert({
          track_id: trackId,
          user_id: (await supabase.auth.getUser()).data.user?.id
        });

      if (error) throw error;
    } catch (error) {
      logger.error('Erreur sauvegarde favori', error as Error, 'MUSIC');
      throw new Error('Erreur lors de la sauvegarde');
    }
  }

  static async getFavorites(): Promise<MusicTrack[]> {
    try {
      const { data, error } = await supabase
        .from('music_favorites')
        .select('track_id')
        .eq('user_id', (await supabase.auth.getUser()).data.user?.id);

      if (error) throw error;

      return [];
    } catch (error) {
      logger.error('Erreur récupération favoris', error as Error, 'MUSIC');
      return [];
    }
  }
}
