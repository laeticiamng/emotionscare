/**
 * Music Generation Hook - Génération Suno
 */

import { useCallback, Dispatch } from 'react';
import { MusicAction, MusicTrack } from './types';
import { logger } from '@/lib/logger';
import { supabase } from '@/lib/supabase';

const EMOTION_DESCRIPTIONS: Record<string, string> = {
  calm: 'Musique douce et apaisante avec des mélodies fluides',
  joy: 'Rythmes enjoués et harmonies positives',
  sad: 'Mélodies mélancoliques et réconfortantes',
  energetic: 'Beats dynamiques et motivants',
  anxious: 'Sons apaisants pour réduire l\'anxiété',
  creative: 'Ambiances inspirantes et stimulantes',
  healing: 'Fréquences thérapeutiques harmonisantes',
};

export const useMusicGeneration = (dispatch: Dispatch<MusicAction>) => {
  const generateMusicForEmotion = useCallback(async (
    emotion: string,
    prompt?: string
  ): Promise<MusicTrack | null> => {
    try {
      dispatch({ type: 'SET_GENERATING', payload: true });
      dispatch({ type: 'SET_GENERATION_ERROR', payload: null });

      logger.info('Music generation requested', { emotion, prompt }, 'MUSIC');

      // Étape 1: Générer le prompt Suno via edge function
      const generatePromptRes = await supabase.functions.invoke('generate-suno-prompt', {
        body: {
          emotion,
          intensity: 75,
          userContext: prompt,
          mood: emotion,
        },
      });

      if (generatePromptRes.error) {
        throw new Error(`Failed to generate prompt: ${generatePromptRes.error}`);
      }

      const { prompt: sunoPrompt } = generatePromptRes.data;

      // Étape 2: Appeler Suno API pour générer la musique
      const musicRes = await supabase.functions.invoke('suno-music', {
        body: {
          action: 'start',
          prompt: sunoPrompt.style,
          mood: emotion,
          sessionId: Date.now().toString(),
        },
      });

      if (musicRes.error) {
        throw new Error(`Failed to start music generation: ${musicRes.error}`);
      }

      const { data } = musicRes.data;

      // Retourner le track générée
      const track: MusicTrack = {
        id: data?.id || `track-${Date.now()}`,
        title: `Musique ${emotion}`,
        artist: 'EmotionsCare AI',
        emotion,
        url: data?.audio_url || '',
        duration: data?.duration || 0,
        status: 'generating',
      };

      logger.info('Music generation started', { trackId: track.id, emotion }, 'MUSIC');

      return track;
    } catch (error) {
      logger.error('Music generation failed', error as Error, 'MUSIC');
      dispatch({ type: 'SET_GENERATION_ERROR', payload: (error as Error).message });
      return null;
    } finally {
      dispatch({ type: 'SET_GENERATING', payload: false });
    }
  }, [dispatch]);

  const checkGenerationStatus = useCallback(async (trackId: string): Promise<MusicTrack | null> => {
    try {
      // Vérifier le statut via Suno API
      const statusRes = await supabase.functions.invoke('suno-music', {
        body: {
          action: 'status',
          trackIds: [trackId],
        },
      });

      if (statusRes.error) {
        throw new Error(`Failed to check status: ${statusRes.error}`);
      }

      const { data } = statusRes.data;

      // Retourner le track avec son statut mis à jour
      const track: MusicTrack = {
        id: data?.id || trackId,
        title: data?.title || 'Generated Track',
        artist: 'EmotionsCare AI',
        emotion: 'neutral',
        url: data?.audio_url || '',
        duration: data?.duration || 0,
        status: data?.status || 'pending',
      };

      logger.info('Music generation status checked', { trackId, status: track.status }, 'MUSIC');

      return track;
    } catch (error) {
      logger.error('Generation status check failed', error as Error, 'MUSIC');
      return null;
    }
  }, []);

  const getEmotionMusicDescription = useCallback((emotion: string): string => {
    return EMOTION_DESCRIPTIONS[emotion] || EMOTION_DESCRIPTIONS.calm;
  }, []);

  return {
    generateMusicForEmotion,
    checkGenerationStatus,
    getEmotionMusicDescription,
  };
};
