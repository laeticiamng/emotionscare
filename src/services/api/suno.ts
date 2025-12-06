// @ts-nocheck
/**
 * Service Suno optimisé - Architecture minimale EmotionsCare
 * Remplace MusicGen pour génération musicale thérapeutique
 */

import { supabase } from '@/integrations/supabase/client';

export interface SunoTrack {
  id: string;
  title: string;
  audio_url: string;
  image_url?: string;
  duration?: number;
  tags?: string[];
  mood_tag: string;
}

export interface SunoSessionRequest {
  mood: string;
  intensity: 'low' | 'medium' | 'high';
  duration_minutes?: number;
  style?: string;
  prompt?: string;
}

export interface SunoSessionResponse {
  session_id: string;
  tracks: SunoTrack[];
  status: 'generating' | 'ready' | 'failed';
}

export interface SunoWeeklyStats {
  period: string;
  total_sessions: number;
  favorite_moods: string[];
  total_listening_time: number;
}

class SunoService {
  /**
   * Démarrer session musicale - pour Musicothérapie, Mood Mixer
   */
  async startSession(request: SunoSessionRequest): Promise<SunoSessionResponse> {
    const { data, error } = await supabase.functions.invoke('suno-session-start', {
      body: {
        mood: request.mood,
        intensity: request.intensity,
        duration_minutes: request.duration_minutes || 5,
        style: request.style || 'ambient',
        prompt: request.prompt
      }
    });

    if (error) {
      throw new Error(error.message || 'Erreur lors du démarrage de la session');
    }

    return data;
  }

  /**
   * Continuer/étendre session
   */
  async continueSession(sessionId: string, additionalMinutes: number = 3): Promise<SunoSessionResponse> {
    const { data, error } = await supabase.functions.invoke('suno-session-continue', {
      body: {
        session_id: sessionId,
        additional_minutes: additionalMinutes
      }
    });

    if (error) {
      throw new Error(error.message || 'Erreur lors de la continuation');
    }

    return data;
  }

  /**
   * Sauvegarder session favorite
   */
  async saveSession(sessionId: string, tracks: SunoTrack[]): Promise<{ saved: boolean }> {
    const { data, error } = await supabase.functions.invoke('suno-session-save', {
      body: {
        session_id: sessionId,
        tracks: tracks
      }
    });

    if (error) {
      throw new Error(error.message || 'Erreur lors de la sauvegarde');
    }

    return data;
  }

  /**
   * Obtenir pistes pré-générées pour fallback
   */
  async getFallbackTracks(mood: string): Promise<SunoTrack[]> {
    const { data, error } = await supabase.functions.invoke('suno-fallback-tracks', {
      body: { mood }
    });

    if (error) {
      // Fallback vers pistes locales si service indisponible
      return this.getLocalFallbackTracks(mood);
    }

    return data.tracks || [];
  }

  /**
   * Stats hebdomadaires utilisateur
   */
  async getWeeklyStats(userId: string): Promise<SunoWeeklyStats> {
    const { data, error } = await supabase.functions.invoke('suno-weekly-stats', {
      body: { user_id: userId }
    });

    if (error) {
      throw new Error(error.message || 'Erreur lors de la récupération des stats');
    }

    return data;
  }

  /**
   * Pistes locales de secours (stockées dans Supabase Storage)
   */
  private getLocalFallbackTracks(mood: string): SunoTrack[] {
    const fallbackTracks: Record<string, SunoTrack[]> = {
      calm: [
        {
          id: 'fallback-calm-1',
          title: 'Océan Apaisant',
          audio_url: '/audio/fallback/calm-ocean.mp3',
          mood_tag: 'calm',
          duration: 180
        },
        {
          id: 'fallback-calm-2',
          title: 'Forêt Tranquille',
          audio_url: '/audio/fallback/calm-forest.mp3',
          mood_tag: 'calm',
          duration: 240
        }
      ],
      energizing: [
        {
          id: 'fallback-energy-1',
          title: 'Rythme Dynamique',
          audio_url: '/audio/fallback/energy-beat.mp3',
          mood_tag: 'energizing',
          duration: 200
        }
      ],
      focused: [
        {
          id: 'fallback-focus-1',
          title: 'Concentration Douce',
          audio_url: '/audio/fallback/focus-ambient.mp3',
          mood_tag: 'focused',
          duration: 300
        }
      ]
    };

    return fallbackTracks[mood] || fallbackTracks.calm;
  }

  /**
   * Moods disponibles pour UI
   */
  getAvailableMoods(): Array<{ id: string; label: string; icon: string }> {
    return [
      { id: 'calm', label: 'Calme', icon: '🌊' },
      { id: 'energizing', label: 'Énergisant', icon: '⚡' },
      { id: 'focused', label: 'Concentration', icon: '🎯' },
      { id: 'relaxing', label: 'Détente', icon: '🌸' },
      { id: 'uplifting', label: 'Positif', icon: '☀️' },
      { id: 'meditative', label: 'Méditation', icon: '🧘‍♀️' }
    ];
  }
}

export const sunoService = new SunoService();