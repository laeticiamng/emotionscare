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
  const generateMusicForEmotion = useCallback(async (
    emotion: string, 
    prompt?: string
  ): Promise<MusicTrack | null> => {
    try {
      dispatch({ type: 'SET_GENERATING', payload: true });
      dispatch({ type: 'SET_GENERATION_ERROR', payload: null });

      // TODO: Appeler Suno API via edge function
      logger.info('Music generation requested', { emotion, prompt }, 'MUSIC');

      return null;
    } catch (error) {
      logger.error('Music generation failed', error as Error, 'MUSIC');
      dispatch({ type: 'SET_GENERATION_ERROR', payload: (error as Error).message });
      return null;
    } finally {
      dispatch({ type: 'SET_GENERATING', payload: false });
    }
  }, [dispatch]);

  const checkGenerationStatus = useCallback(async (taskId: string): Promise<MusicTrack | null> => {
    try {
      // TODO: Poll Suno API status
      return null;
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
