/**
 * Service de musique thérapeutique EmotionsCare
 * Connexion Suno AI et recommandations personnalisées
 */

import { supabase } from '@/integrations/supabase/client';
import { MusicTrack } from '@/contexts/MusicContext';
import { logger } from '@/lib/logger';

export interface MusicGenerationRequest {
  emotion: string;
  mood?: string;
  intensity?: number;
  style?: string;
  lyrics?: string;
  duration?: number;
  therapeutic?: boolean;
}

export interface MusicRecommendation {
  track: MusicTrack;
  reason: string;
  therapeutic_benefit: string;
  suggested_duration: number;
}

class MusicService {
  /**
   * Génération de musique avec Suno AI
   */
  async generateMusic(request: MusicGenerationRequest): Promise<MusicTrack> {
    try {
      // Utiliser suno-music qui existe
      const { data, error } = await supabase.functions.invoke('suno-music', {
        body: {
          action: 'generate',
          emotion: request.emotion,
          mood: request.mood || request.emotion,
          intensity: request.intensity || 0.7,
          style: request.style || 'therapeutic ambient',
          prompt: request.lyrics,
          duration: request.duration || 120,
          therapeutic: request.therapeutic !== false,
          instrumental: true
        }
      });

      if (error) throw error;

      const trackData = data?.data || data;
      const track: MusicTrack = {
        id: trackData.id || trackData.taskId || `generated_${Date.now()}`,
        title: trackData.title || `Musique ${request.emotion}`,
        artist: trackData.artist || 'Suno AI',
        url: trackData.audio_url || trackData.audioUrl || trackData.url,
        audioUrl: trackData.audio_url || trackData.audioUrl || trackData.url,
        duration: trackData.duration || request.duration || 120,
        emotion: request.emotion,
        mood: request.mood,
        coverUrl: trackData.image_url || trackData.imageUrl || trackData.coverUrl,
        tags: trackData.tags || request.style,
        isGenerated: true,
        generatedAt: new Date().toISOString(),
        sunoTaskId: trackData.taskId || trackData.id
      };

      return track;
    } catch (error) {
      logger.error('Music generation error', error as Error, 'MUSIC');
      throw new Error('Échec de la génération musicale');
    }
  }

  /**
   * Recommandations musicales basées sur l'émotion
   */
  async getRecommendationsForEmotion(emotion: string, count: number = 5): Promise<MusicRecommendation[]> {
    try {
      // Utiliser emotion-music-ai avec action get-recommendations
      const { data, error } = await supabase.functions.invoke('emotion-music-ai', {
        body: {
          action: 'get-recommendations',
          emotion,
          count,
          therapeutic: true
        }
      });

      if (error) throw error;

      const recommendations = data?.recommendations || data?.tracks || [];
      return recommendations.map((rec: any) => ({
        track: {
          id: rec.id,
          title: rec.title || rec.prompt,
          artist: rec.artist || 'Suno AI',
          url: rec.audio_url || rec.audioUrl || rec.url,
          audioUrl: rec.audio_url || rec.audioUrl || rec.url,
          duration: rec.duration || 120,
          emotion: rec.emotion,
          mood: rec.mood,
          coverUrl: rec.image_url || rec.imageUrl || rec.coverUrl,
          tags: rec.tags
        } as MusicTrack,
        reason: rec.reason || `Recommandé pour ${emotion}`,
        therapeutic_benefit: rec.therapeutic_benefit || 'Bien-être émotionnel',
        suggested_duration: rec.suggested_duration || 15
      }));
    } catch (error) {
      logger.error('Music recommendations error', error as Error, 'MUSIC');
      return this.getFallbackRecommendations(emotion);
    }
  }

  /**
   * Playlist thérapeutique personnalisée
   */
  async createTherapeuticPlaylist(
    emotions: string[], 
    duration: number = 30, 
    userId?: string
  ): Promise<{
    playlist: MusicTrack[];
    title: string;
    description: string;
    total_duration: number;
  }> {
    try {
      // Utiliser adaptive-music pour créer une playlist thérapeutique
      const { data, error } = await supabase.functions.invoke('adaptive-music', {
        body: {
          action: 'create-playlist',
          emotions,
          duration,
          userId,
          playlist_type: 'therapeutic'
        }
      });

      if (error) throw error;

      const tracks = data?.tracks || data?.playlist || [];
      return {
        playlist: tracks.map((track: any) => ({
          id: track.id,
          title: track.title,
          artist: track.artist || 'Suno AI',
          url: track.audio_url || track.audioUrl || track.url,
          audioUrl: track.audio_url || track.audioUrl || track.url,
          duration: track.duration || 120,
          emotion: track.emotion,
          mood: track.mood,
          coverUrl: track.image_url || track.imageUrl || track.coverUrl
        } as MusicTrack)),
        title: data?.title || `Playlist ${emotions.join(', ')}`,
        description: data?.description || 'Playlist thérapeutique personnalisée',
        total_duration: data?.total_duration || duration * 60
      };
    } catch (error) {
      logger.error('Therapeutic playlist error', error as Error, 'MUSIC');
      throw new Error('Échec de la création de playlist thérapeutique');
    }
  }

  /**
   * Analyse des préférences musicales
   */
  async analyzeUserMusicPreferences(userId: string): Promise<{
    preferred_emotions: string[];
    preferred_styles: string[];
    listening_patterns: {
      best_times: string[];
      average_session: number;
      total_listening_time: number;
    };
    recommendations: {
      next_emotion: string;
      suggested_style: string;
      optimal_duration: number;
    };
  }> {
    try {
      const { data, error } = await supabase.functions.invoke('music-weekly-user', {
        body: {
          userId,
          analysis_type: 'preferences'
        }
      });

      if (error) throw error;

      return data;
    } catch (error) {
      logger.error('Music preferences analysis error', error as Error, 'MUSIC');
      return {
        preferred_emotions: ['calm', 'happy'],
        preferred_styles: ['ambient', 'therapeutic'],
        listening_patterns: {
          best_times: ['morning', 'evening'],
          average_session: 15,
          total_listening_time: 0
        },
        recommendations: {
          next_emotion: 'calm',
          suggested_style: 'ambient',
          optimal_duration: 15
        }
      };
    }
  }

  /**
   * Sauvegarde de l'écoute musicale
   */
  async logListeningSession(
    userId: string, 
    trackId: string, 
    duration: number, 
    emotion?: string,
    therapeutic?: boolean
  ): Promise<void> {
    try {
      const { error } = await supabase
        .from('music_listening_history')
        .insert({
          user_id: userId,
          track_id: trackId,
          listened_duration: duration,
          emotion_context: emotion,
          is_therapeutic: therapeutic || false,
          timestamp: new Date().toISOString()
        });

      if (error) throw error;
    } catch (error) {
      logger.error('Error logging listening session', error as Error, 'MUSIC');
    }
  }

  /**
   * Musique adaptative basée sur le contexte émotionnel
   */
  async getAdaptiveMusic(
    currentEmotion: string, 
    targetEmotion: string, 
    intensity: number
  ): Promise<{
    transition_tracks: MusicTrack[];
    duration: number;
    steps: string[];
  }> {
    try {
      // Utiliser adaptive-music edge function
      const { data, error } = await supabase.functions.invoke('adaptive-music', {
        body: {
          action: 'transition',
          current_emotion: currentEmotion,
          target_emotion: targetEmotion,
          intensity,
          adaptive: true
        }
      });

      if (error) throw error;

      const tracks = data?.tracks || data?.transition_tracks || [];
      return {
        transition_tracks: tracks.map((track: any) => ({
          id: track.id,
          title: track.title,
          artist: track.artist || 'Suno AI',
          url: track.audio_url || track.audioUrl || track.url,
          audioUrl: track.audio_url || track.audioUrl || track.url,
          duration: track.duration || 120,
          emotion: track.emotion,
          mood: track.mood
        } as MusicTrack)),
        duration: data?.total_duration || 300,
        steps: data?.transition_steps || [`De ${currentEmotion} vers ${targetEmotion}`]
      };
    } catch (error) {
      logger.error('Adaptive music error', error as Error, 'MUSIC');
      throw new Error('Échec de la génération adaptative');
    }
  }

  /**
   * Recommandations de fallback (offline)
   */
  private getFallbackRecommendations(emotion: string): MusicRecommendation[] {
    const fallbackTracks: Record<string, MusicRecommendation[]> = {
      calm: [
        {
          track: {
            id: 'calm_1',
            title: 'Sérénité Matinale',
            artist: 'EmotionsCare',
            url: '/audio/calm-morning.mp3',
            audioUrl: '/audio/calm-morning.mp3',
            duration: 180,
            emotion: 'calm'
          },
          reason: 'Favorise la relaxation et la paix intérieure',
          therapeutic_benefit: 'Réduit le stress et l\'anxiété',
          suggested_duration: 10
        }
      ],
      happy: [
        {
          track: {
            id: 'happy_1',
            title: 'Joie Lumineuse',
            artist: 'EmotionsCare',
            url: '/audio/bright-joy.mp3',
            audioUrl: '/audio/bright-joy.mp3',
            duration: 200,
            emotion: 'happy'
          },
          reason: 'Amplifie les émotions positives',
          therapeutic_benefit: 'Boost la motivation et l\'énergie',
          suggested_duration: 15
        }
      ],
      sad: [
        {
          track: {
            id: 'healing_1',
            title: 'Guérison Douce',
            artist: 'EmotionsCare',
            url: '/audio/gentle-healing.mp3',
            audioUrl: '/audio/gentle-healing.mp3',
            duration: 240,
            emotion: 'healing'
          },
          reason: 'Accompagne le processus de guérison émotionnelle',
          therapeutic_benefit: 'Aide à traverser les moments difficiles',
          suggested_duration: 20
        }
      ]
    };

    return fallbackTracks[emotion] || fallbackTracks.calm;
  }
}

export const musicService = new MusicService();
export default musicService;