// @ts-nocheck
import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { logger } from '@/lib/logger';

export interface SunoMusicRequest {
  prompt: string;
  make_instrumental?: boolean;
  model?: string;
  wait_audio?: boolean;
  tags?: string;
  title?: string;
}

export interface SunoMusicResponse {
  success: boolean;
  data?: {
    id: string;
    title?: string;
    audio_url?: string;
    video_url?: string;
    image_url?: string;
    lyric?: string;
    tags?: string;
    prompt: string;
    duration?: number;
    status?: string;
    created_at?: string;
    model?: string;
  };
  metadata?: {
    model_used: string;
    is_instrumental: boolean;
    generated_at: string;
  };
  error?: string;
}

export interface SunoMusicState {
  isGenerating: boolean;
  error: string | null;
  lastGenerated: SunoMusicResponse | null;
}

export const useSunoMusic = () => {
  const [state, setState] = useState<SunoMusicState>({
    isGenerating: false,
    error: null,
    lastGenerated: null
  });

  const generateMusic = useCallback(async (request: SunoMusicRequest): Promise<SunoMusicResponse> => {
    setState(prev => ({ ...prev, isGenerating: true, error: null }));

    try {
      logger.info('🎵 Generating music with Suno', request, 'MUSIC');

      const { data, error } = await supabase.functions.invoke('suno-music-generation', {
        body: request
      });

      if (error) {
        throw new Error(error.message);
      }

      const response = data as SunoMusicResponse;
      
      setState(prev => ({ 
        ...prev, 
        isGenerating: false, 
        lastGenerated: response,
        error: null
      }));

      logger.info('✅ Music generation completed', response, 'MUSIC');
      return response;

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to generate music';
      logger.error('❌ Music generation failed', err as Error, 'MUSIC');
      
      setState(prev => ({ 
        ...prev, 
        isGenerating: false, 
        error: errorMessage 
      }));

      return {
        success: false,
        error: errorMessage
      };
    }
  }, []);

  const generateTherapeuticMusic = useCallback(async (
    emotion: string, 
    intensity: number, 
    duration?: number
  ): Promise<SunoMusicResponse> => {
    const therapeuticPrompts = {
      'anxious': 'Calming ambient music with soft piano and nature sounds to reduce anxiety',
      'sad': 'Gentle uplifting melody with warm strings to comfort sadness',
      'angry': 'Progressive calming music transitioning from intense to peaceful',
      'stressed': 'Meditative soundscape with breathing rhythm to relieve stress',
      'happy': 'Joyful and energetic music to enhance positive mood',
      'neutral': 'Balanced ambient music for general relaxation and focus'
    };

    const tags = {
      'anxious': 'therapeutic, anxiety relief, calming, ambient',
      'sad': 'therapeutic, uplifting, comfort, healing',
      'angry': 'therapeutic, anger management, progressive, calming',
      'stressed': 'therapeutic, stress relief, meditation, breathing',
      'happy': 'therapeutic, mood enhancement, joyful, energetic',
      'neutral': 'therapeutic, relaxation, focus, balanced'
    };

    const prompt = therapeuticPrompts[emotion as keyof typeof therapeuticPrompts] || therapeuticPrompts.neutral;
    const musicTags = tags[emotion as keyof typeof tags] || tags.neutral;

    const request: SunoMusicRequest = {
      prompt: `${prompt}. Intensity level: ${intensity}/10`,
      make_instrumental: true,
      tags: musicTags,
      title: `Therapeutic Music for ${emotion} (Intensity: ${intensity})`,
      model: 'chirp-v3-5'
    };

    return generateMusic(request);
  }, [generateMusic]);

  const generateCustomMusic = useCallback(async (
    description: string,
    options?: Partial<SunoMusicRequest>
  ): Promise<SunoMusicResponse> => {
    const request: SunoMusicRequest = {
      prompt: description,
      make_instrumental: options?.make_instrumental ?? false,
      tags: options?.tags ?? 'therapeutic, custom, healing',
      title: options?.title,
      model: options?.model ?? 'chirp-v3-5',
      wait_audio: options?.wait_audio ?? true
    };

    return generateMusic(request);
  }, [generateMusic]);

  const generateMusicFromEmotion = useCallback(async (emotionData: {
    primary_emotion: string;
    intensity: number;
    context?: string;
    target_mood?: string;
  }): Promise<SunoMusicResponse> => {
    let prompt = `Create therapeutic music to help transition from ${emotionData.primary_emotion} `;
    
    if (emotionData.target_mood) {
      prompt += `towards ${emotionData.target_mood}. `;
    } else {
      prompt += 'towards calmness and balance. ';
    }

    if (emotionData.context) {
      prompt += `Context: ${emotionData.context}. `;
    }

    prompt += `The music should be instrumental, healing, and appropriate for emotional regulation.`;

    const request: SunoMusicRequest = {
      prompt,
      make_instrumental: true,
      tags: `therapeutic, ${emotionData.primary_emotion}, emotional regulation, healing`,
      title: `Emotional Therapy - ${emotionData.primary_emotion} to Balance`,
      model: 'chirp-v3-5'
    };

    return generateMusic(request);
  }, [generateMusic]);

  const clearError = useCallback(() => {
    setState(prev => ({ ...prev, error: null }));
  }, []);

  const clearLastGenerated = useCallback(() => {
    setState(prev => ({ ...prev, lastGenerated: null }));
  }, []);

  return {
    ...state,
    generateMusic,
    generateTherapeuticMusic,
    generateCustomMusic,
    generateMusicFromEmotion,
    clearError,
    clearLastGenerated
  };
};