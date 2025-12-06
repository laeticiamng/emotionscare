// @ts-nocheck
import { supabase } from '@/integrations/supabase/client';
import type { ApiResponse, MusicRecommendation, EmotionData } from './types';
import { logger } from '@/lib/logger';

class SunoService {
  private async callEdgeFunction(functionName: string, payload: any): Promise<ApiResponse> {
    try {
      const { data, error } = await supabase.functions.invoke(functionName, {
        body: payload
      });

      if (error) {
        logger.error(`Suno ${functionName} error`, error as Error, 'MUSIC');
        return {
          success: false,
          error: error.message,
          timestamp: new Date()
        };
      }

      return {
        success: true,
        data,
        timestamp: new Date()
      };
    } catch (error: any) {
      logger.error(`Suno ${functionName} error`, error as Error, 'MUSIC');
      return {
        success: false,
        error: error.message,
        timestamp: new Date()
      };
    }
  }

  async generateMusic(
    options: {
      emotion?: string;
      mood?: string;
      genre?: string;
      duration?: number;
      lyrics?: string;
      instrumental?: boolean;
      energy?: number; // 0-1
      valence?: number; // 0-1 (positivity)
      tempo?: 'slow' | 'medium' | 'fast';
      customPrompt?: string;
    }
  ): Promise<ApiResponse<{
    id: string;
    title: string;
    audioUrl: string;
    duration: number;
    genre: string;
    mood: string;
    energy: number;
    valence: number;
    status: 'generating' | 'completed' | 'failed';
  }>> {
    return this.callEdgeFunction('generate-music', options);
  }

  async generateTherapeuticMusic(
    emotionalProfile: {
      currentEmotions: EmotionData[];
      targetMood: string;
      preferences?: {
        genres?: string[];
        instruments?: string[];
        avoidGenres?: string[];
      };
      sessionType?: 'relaxation' | 'motivation' | 'focus' | 'sleep';
    }
  ): Promise<ApiResponse<MusicRecommendation>> {
    // Analyser les émotions pour déterminer les paramètres optimaux
    const dominantEmotion = this.getDominantEmotion(emotionalProfile.currentEmotions);
    const musicParams = this.emotionToMusicMapping(dominantEmotion, emotionalProfile.targetMood);

    // Appliquer les préférences utilisateur
    if (emotionalProfile.preferences?.genres) {
      musicParams.genre = this.selectPreferredGenre(
        musicParams.genre, 
        emotionalProfile.preferences.genres,
        emotionalProfile.preferences.avoidGenres
      );
    }

    return this.callEdgeFunction('emotionscare-music-generator', {
      emotion: dominantEmotion,
      targetMood: emotionalProfile.targetMood,
      sessionType: emotionalProfile.sessionType,
      musicParams,
      preferences: emotionalProfile.preferences
    });
  }

  async getMoodBasedPlaylist(
    mood: string,
    options: {
      duration?: number; // minutes
      count?: number;
      includeGenerated?: boolean;
      includeExisting?: boolean;
      personalizeFor?: string; // user ID
    } = {}
  ): Promise<ApiResponse<{
    playlist: MusicRecommendation[];
    totalDuration: number;
    moodAlignment: number;
  }>> {
    return this.callEdgeFunction('mood-mixer', {
      mood,
      ...options
    });
  }

  async generateAdaptiveMusic(
    realTimeEmotions: EmotionData[],
    sessionGoals: {
      targetMood: string;
      duration: number;
      progressionType: 'gradual' | 'immediate' | 'wave';
    }
  ): Promise<ApiResponse<{
    currentTrack: MusicRecommendation;
    nextTracks: MusicRecommendation[];
    adaptationStrategy: string;
  }>> {
    return this.callEdgeFunction('music-adaptation-engine', {
      emotions: realTimeEmotions,
      goals: sessionGoals,
      timestamp: new Date().toISOString()
    });
  }

  async getGenerationStatus(generationId: string): Promise<ApiResponse<{
    status: 'generating' | 'completed' | 'failed';
    progress: number;
    audioUrl?: string;
    error?: string;
  }>> {
    return this.callEdgeFunction('music-generation-status', {
      generationId
    });
  }

  async enhanceExistingTrack(
    audioFile: File,
    enhancements: {
      targetMood: string;
      addLayers?: string[];
      adjustTempo?: number;
      addEffects?: string[];
    }
  ): Promise<ApiResponse<{
    enhancedTrackUrl: string;
    modifications: string[];
  }>> {
    const formData = new FormData();
    formData.append('audio', audioFile);
    formData.append('enhancements', JSON.stringify(enhancements));

    try {
      const { data, error } = await supabase.functions.invoke('enhance-music-track', {
        body: formData
      });

      if (error) {
        return {
          success: false,
          error: error.message,
          timestamp: new Date()
        };
      }

      return {
        success: true,
        data,
        timestamp: new Date()
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message,
        timestamp: new Date()
      };
    }
  }

  private getDominantEmotion(emotions: EmotionData[]): string {
    if (!emotions.length) return 'neutral';
    
    const emotionCounts = emotions.reduce((acc, emotion) => {
      acc[emotion.emotion] = (acc[emotion.emotion] || 0) + emotion.confidence;
      return acc;
    }, {} as Record<string, number>);

    return Object.entries(emotionCounts).reduce((a, b) => 
      emotionCounts[a[0]] > emotionCounts[b[0]] ? a : b
    )[0];
  }

  private emotionToMusicMapping(emotion: string, targetMood: string): any {
    const mappings: Record<string, any> = {
      happy: { genre: 'upbeat-pop', energy: 0.8, valence: 0.9, tempo: 'medium' },
      sad: { genre: 'ambient', energy: 0.3, valence: 0.2, tempo: 'slow' },
      anxious: { genre: 'calm-instrumental', energy: 0.4, valence: 0.6, tempo: 'slow' },
      angry: { genre: 'rock', energy: 0.9, valence: 0.3, tempo: 'fast' },
      excited: { genre: 'electronic', energy: 0.9, valence: 0.8, tempo: 'fast' },
      calm: { genre: 'ambient', energy: 0.3, valence: 0.7, tempo: 'slow' },
      focused: { genre: 'lo-fi', energy: 0.5, valence: 0.6, tempo: 'medium' },
      neutral: { genre: 'indie', energy: 0.5, valence: 0.5, tempo: 'medium' }
    };

    const baseMapping = mappings[emotion] || mappings.neutral;
    
    // Ajuster selon l'humeur cible
    if (targetMood === 'relaxed') {
      return { ...baseMapping, energy: Math.min(0.4, baseMapping.energy), tempo: 'slow' };
    } else if (targetMood === 'energized') {
      return { ...baseMapping, energy: Math.max(0.7, baseMapping.energy), tempo: 'fast' };
    }

    return baseMapping;
  }

  private selectPreferredGenre(
    suggested: string, 
    preferred: string[], 
    avoided: string[] = []
  ): string {
    if (avoided.includes(suggested)) {
      return preferred[0] || 'ambient';
    }
    
    if (preferred.includes(suggested)) {
      return suggested;
    }

    return preferred[0] || suggested;
  }
}

export default new SunoService();