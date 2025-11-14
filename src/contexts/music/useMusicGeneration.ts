/**
 * Music Generation Hook - Génération Suno
 */

import { useCallback, Dispatch } from 'react';
import { MusicAction, MusicTrack } from './types';
import { logger } from '@/lib/logger';

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
  const checkGenerationStatus = useCallback(async (taskId: string): Promise<MusicTrack | null> => {
    try {
      const { supabase } = await import('@/integrations/supabase/client');
      const { data, error } = await supabase.functions.invoke('suno-music-generation', {
        body: {
          action: 'status',
          taskId
        }
      });

      if (error) throw error;

      if (data.status === 'completed' && data.audioUrl) {
        const track: MusicTrack = {
          id: taskId,
          title: data.title || 'Musique générée',
          artist: 'Suno AI',
          url: data.audioUrl,
          audioUrl: data.audioUrl,
          duration: data.duration || 120,
          coverUrl: data.imageUrl,
          isGenerated: true,
          generatedAt: new Date().toISOString(),
          sunoTaskId: taskId,
          emotion: data.emotion,
          mood: data.mood,
          tags: data.tags
        };

        return track;
      }

      return null;
    } catch (error) {
      logger.error('Generation status check failed', error as Error, 'MUSIC');
      return null;
    }
  }, []);

  const generateMusicForEmotion = useCallback(async (
    emotion: string,
    prompt?: string
  ): Promise<MusicTrack | null> => {
    try {
      dispatch({ type: 'SET_GENERATING', payload: true });
      dispatch({ type: 'SET_GENERATION_ERROR', payload: null });
      dispatch({ type: 'SET_GENERATION_PROGRESS', payload: 0 });

      const { supabase } = await import('@/integrations/supabase/client');
      const { toast } = await import('sonner');

      const { data, error } = await supabase.functions.invoke('suno-music-generation', {
        body: {
          emotion,
          prompt: prompt || `Musique thérapeutique apaisante pour émotion ${emotion}`,
          style: 'therapeutic ambient',
          instrumental: true,
          model: 'V4_5'
        }
      });

      if (error) throw error;

      dispatch({ type: 'SET_GENERATION_PROGRESS', payload: 50 });
      logger.info('Music generation started', { emotion, prompt, taskId: data.taskId }, 'MUSIC');

      // Poll pour le statut de génération
      let attempts = 0;
      const maxAttempts = 30; // 5 minutes max

      while (attempts < maxAttempts) {
        const statusData = await checkGenerationStatus(data.taskId);

        if (statusData) {
          dispatch({ type: 'SET_GENERATION_PROGRESS', payload: 100 });
          toast.success('Musique thérapeutique générée avec succès !');
          return statusData;
        }

        dispatch({
          type: 'SET_GENERATION_PROGRESS',
          payload: 50 + (attempts / maxAttempts) * 45
        });

        await new Promise(resolve => setTimeout(resolve, 10000)); // Attendre 10s
        attempts++;
      }

      throw new Error('Timeout - Génération trop longue');
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erreur génération musique';
      logger.error('Music generation failed', error as Error, 'MUSIC');
      dispatch({ type: 'SET_GENERATION_ERROR', payload: errorMessage });

      const { toast } = await import('sonner');
      toast.error(`Erreur: ${errorMessage}`);
      return null;
    } finally {
      dispatch({ type: 'SET_GENERATING', payload: false });
      dispatch({ type: 'SET_GENERATION_PROGRESS', payload: 0 });
    }
  }, [dispatch, checkGenerationStatus]);

  const getEmotionMusicDescription = useCallback((emotion: string): string => {
    return EMOTION_DESCRIPTIONS[emotion] || EMOTION_DESCRIPTIONS.calm;
  }, []);

  return {
    generateMusicForEmotion,
    checkGenerationStatus,
    getEmotionMusicDescription,
  };
};
