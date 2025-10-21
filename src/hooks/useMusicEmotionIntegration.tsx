// @ts-nocheck

import { useState, useCallback } from 'react';
import { MusicPlaylist } from '@/types/music';
import { useMusic } from '@/contexts/MusicContext';
import { demoTracks } from '@/services/music/demo-tracks';
import { logger } from '@/lib/logger';

export const useMusicEmotionIntegration = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { setPlaylist, play } = useMusic();

  const getMusicRecommendationForEmotion = useCallback((emotion: string) => {
    // Simuler une recommandation basée sur l'émotion
    return demoTracks;
  }, []);

  const playEmotion = useCallback(async (emotion: string): Promise<MusicPlaylist | null> => {
    setIsLoading(true);
    try {
      const tracks = getMusicRecommendationForEmotion(emotion);
      const playlist: MusicPlaylist = {
        id: `emotion-${emotion}`,
        name: `Playlist ${emotion}`,
        tracks,
        description: `Musique adaptée à l'émotion: ${emotion}`,
        tags: [emotion],
        creator: 'AI'
      };
      
      setPlaylist(tracks);
      if (tracks.length > 0) {
        play(tracks[0]);
      }
      
      return playlist;
    } catch (error) {
      logger.error('Error playing emotion music', error as Error, 'MUSIC');
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [getMusicRecommendationForEmotion, setPlaylist, play]);

  const activateMusicForEmotion = useCallback(async (emotionData: { emotion: string; intensity: number }) => {
    return playEmotion(emotionData.emotion);
  }, [playEmotion]);

  const getEmotionMusicDescription = useCallback((emotion: string): string => {
    const descriptions: Record<string, string> = {
      calm: 'Musique douce et apaisante pour favoriser la détente',
      happy: 'Mélodies joyeuses et énergisantes',
      sad: 'Compositions mélancoliques et réconfortantes',
      angry: 'Sons apaisants pour calmer la colère',
      neutral: 'Ambiance neutre et équilibrée',
    };
    
    return descriptions[emotion.toLowerCase()] || 'Musique personnalisée pour votre état émotionnel';
  }, []);

  return {
    getMusicRecommendationForEmotion,
    playEmotion,
    activateMusicForEmotion,
    getEmotionMusicDescription,
    isLoading,
  };
};
