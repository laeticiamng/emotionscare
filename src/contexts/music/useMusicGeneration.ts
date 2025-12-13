/**
 * Music Generation Hook - Génération Suno avec fallback Lovable AI
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
  focus: 'Musique ambiante pour la concentration',
  sleep: 'Sons doux pour l\'endormissement',
  meditation: 'Ambiances méditatives profondes',
};

// Bibliothèque de pistes de fallback intégrées
const FALLBACK_TRACKS: Record<string, MusicTrack[]> = {
  calm: [
    { id: 'calm-1', title: 'Océan Paisible', artist: 'EmotionsCare', emotion: 'calm', url: '/audio/calm-ocean.mp3', audioUrl: '/audio/calm-ocean.mp3', duration: 180, status: 'completed' },
    { id: 'calm-2', title: 'Forêt Tranquille', artist: 'EmotionsCare', emotion: 'calm', url: '/audio/calm-forest.mp3', audioUrl: '/audio/calm-forest.mp3', duration: 210, status: 'completed' },
  ],
  energetic: [
    { id: 'energy-1', title: 'Motivation Matinale', artist: 'EmotionsCare', emotion: 'energetic', url: '/audio/energy-morning.mp3', audioUrl: '/audio/energy-morning.mp3', duration: 150, status: 'completed' },
  ],
  sad: [
    { id: 'sad-1', title: 'Réconfort Doux', artist: 'EmotionsCare', emotion: 'sad', url: '/audio/comfort.mp3', audioUrl: '/audio/comfort.mp3', duration: 240, status: 'completed' },
  ],
  focus: [
    { id: 'focus-1', title: 'Concentration Alpha', artist: 'EmotionsCare', emotion: 'focus', url: '/audio/focus-alpha.mp3', audioUrl: '/audio/focus-alpha.mp3', duration: 300, status: 'completed' },
  ],
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

      // Essayer d'abord Suno API
      try {
        // Étape 1: Générer le prompt Suno via edge function
        const generatePromptRes = await supabase.functions.invoke('generate-suno-prompt', {
          body: {
            emotion,
            intensity: 75,
            userContext: prompt,
            mood: emotion,
          },
        });

        if (!generatePromptRes.error && generatePromptRes.data?.prompt) {
          const { prompt: sunoPrompt } = generatePromptRes.data;

          // Étape 2: Appeler Suno API pour générer la musique
          const musicRes = await supabase.functions.invoke('suno-music', {
            body: {
              action: 'start',
              prompt: sunoPrompt.style || sunoPrompt,
              mood: emotion,
              sessionId: Date.now().toString(),
            },
          });

          if (!musicRes.error && musicRes.data?.success) {
            const { data } = musicRes.data;

            const track: MusicTrack = {
              id: data?.id || `track-${Date.now()}`,
              title: `Musique ${emotion}`,
              artist: 'EmotionsCare AI',
              emotion,
              url: data?.audio_url || '',
              audioUrl: data?.audio_url || '',
              duration: data?.duration || 0,
              status: 'generating',
            };

            logger.info('Music generation started via Suno', { trackId: track.id, emotion }, 'MUSIC');
            return track;
          }
        }
      } catch (sunoError) {
        logger.warn('Suno API unavailable, using fallback', { error: sunoError }, 'MUSIC');
      }

      // Fallback: utiliser les pistes pré-enregistrées
      logger.info('Using fallback tracks for emotion', { emotion }, 'MUSIC');
      
      const fallbackList = FALLBACK_TRACKS[emotion] || FALLBACK_TRACKS.calm || [];
      if (fallbackList.length > 0) {
        const randomTrack = fallbackList[Math.floor(Math.random() * fallbackList.length)];
        const track: MusicTrack = {
          ...randomTrack,
          id: `fallback-${Date.now()}`,
          status: 'ready',
        };

        logger.info('Fallback track selected', { trackId: track.id, title: track.title }, 'MUSIC');
        return track;
      }

      // Dernier recours: track générique
      const genericTrack: MusicTrack = {
        id: `generic-${Date.now()}`,
        title: `Ambiance ${EMOTION_DESCRIPTIONS[emotion] || 'Relaxante'}`,
        artist: 'EmotionsCare',
        emotion,
        url: '/audio/default-ambient.mp3',
        audioUrl: '/audio/default-ambient.mp3',
        duration: 180,
        status: 'ready',
      };

      return genericTrack;
    } catch (error) {
      logger.error('Music generation failed', error as Error, 'MUSIC');
      dispatch({ type: 'SET_GENERATION_ERROR', payload: (error as Error).message });
      
      // Même en cas d'erreur, retourner une piste de fallback
      const fallback = FALLBACK_TRACKS.calm?.[0];
      if (fallback) {
        return { ...fallback, id: `error-fallback-${Date.now()}` };
      }
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
        audioUrl: data?.audio_url || '',
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
