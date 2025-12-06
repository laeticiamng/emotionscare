// @ts-nocheck
import { useState, useEffect, useCallback } from 'react';
import { MusicPlaylist, EmotionMusicParams } from '@/types/music';
import { useMusic } from '@/hooks/useMusic';
import { logger } from '@/lib/logger';

export interface UseEmotionMusicReturn {
  recommendation: MusicPlaylist | null;
  isLoading: boolean;
  error: Error | null;
  activateMusicForEmotion: (params: EmotionMusicParams) => Promise<boolean>;
  getEmotionMusicDescription: (emotion: string) => string;
}

// Helper function for descriptions
export const getEmotionMusicDescription = (emotion: string): string => {
  const descriptions: Record<string, string> = {
    'happy': 'Des mélodies joyeuses pour amplifier votre bonne humeur',
    'calm': 'Des sonorités apaisantes pour retrouver la sérénité',
    'focus': 'Des compositions pour améliorer votre concentration',
    'energetic': 'Des rythmes dynamiques pour booster votre énergie',
    'sad': 'Des mélodies mélancoliques pour accompagner vos émotions',
    'anxiety': 'Des sons apaisants pour réduire votre anxiété',
    'confidence': 'Des compositions inspirantes pour renforcer votre confiance',
    'sleep': 'Des berceuses douces pour faciliter l\'endormissement'
  };
  
  return descriptions[emotion.toLowerCase()] || 'Musique adaptée à votre humeur';
};

export const useEmotionMusic = (initialEmotion?: string): UseEmotionMusicReturn => {
  const [recommendation, setRecommendation] = useState<MusicPlaylist | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);
  const { setEmotion, setOpenDrawer, loadPlaylistForEmotion } = useMusic();

  // Function to activate music for a specific emotion
  const activateMusicForEmotion = async (params: EmotionMusicParams): Promise<boolean> => {
    try {
      setIsLoading(true);
      setError(null);
      
      // Set the emotion in the music context
      if (setEmotion) setEmotion(params.emotion);
      
      // Load playlist for this emotion
      const playlist = await loadPlaylistForEmotion(params);
      
      if (playlist) {
        setRecommendation(playlist);
      }
      
      // Open the music drawer
      if (setOpenDrawer) {
        setOpenDrawer(true);
      }
      
      return !!playlist;
    } catch (error) {
      logger.error('Error activating music for emotion', error as Error, 'MUSIC');
      setError(error instanceof Error ? error : new Error('Failed to activate emotion music'));
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  // Load recommendation on mount if initialEmotion is provided
  useEffect(() => {
    if (initialEmotion) {
      activateMusicForEmotion({ 
        emotion: initialEmotion,
        intensity: 50
      });
    }
  }, [initialEmotion]);

  return {
    recommendation,
    isLoading,
    error,
    activateMusicForEmotion,
    getEmotionMusicDescription
  };
};

export default useEmotionMusic;
