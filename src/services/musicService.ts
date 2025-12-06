
import { supabase } from '@/integrations/supabase/client';

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
  static async generateMusic(emotion: string, mood?: string): Promise<MusicTrack> {
    try {
      const { data, error } = await supabase.functions.invoke('generate-music', {
        body: { emotion, mood }
      });

      if (error) throw error;

      return {
        id: data.id,
        title: data.title,
        artist: 'EmotionsCare AI',
        url: data.audioUrl,
        duration: data.duration || 120,
        emotion,
        mood
      };
    } catch (error) {
      console.error('Erreur génération musique:', error);
      throw new Error('Erreur lors de la génération musicale');
    }
  }

  static async getRecommendedTracks(emotion: string): Promise<MusicTrack[]> {
    try {
      const { data, error } = await supabase.functions.invoke('get-music-recommendations', {
        body: { emotion }
      });

      if (error) throw error;

      return data.tracks || [];
    } catch (error) {
      console.error('Erreur recommandations:', error);
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
      console.error('Erreur sauvegarde favori:', error);
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

      // En production, on récupérerait les détails des tracks
      return [];
    } catch (error) {
      console.error('Erreur récupération favoris:', error);
      return [];
    }
  }
}
