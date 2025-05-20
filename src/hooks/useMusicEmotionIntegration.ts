
import { useState } from 'react';
import { MusicPlaylist, EmotionMusicParams } from '@/types/music';
import { EmotionResult } from '@/types/emotion';
import { useMusic } from '@/contexts/MusicContext';

export const useMusicEmotionIntegration = () => {
  const musicContext = useMusic();
  const [isLoading, setIsLoading] = useState(false);

  /**
   * Activate music based on an emotion
   */
  const activateMusicForEmotion = async (params: EmotionMusicParams): Promise<MusicPlaylist | null> => {
    setIsLoading(true);
    try {
      if (musicContext?.loadPlaylistForEmotion) {
        const playlist = await musicContext.loadPlaylistForEmotion(params);
        return playlist;
      }
      return null;
    } catch (error) {
      console.error('Error activating music for emotion:', error);
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Get a description for the recommended music for an emotion
   */
  const getEmotionMusicDescription = (emotion: string): string => {
    switch (emotion.toLowerCase()) {
      case 'happy':
        return 'Des mélodies enjouées pour accompagner votre bonne humeur';
      case 'calm':
      case 'peaceful':
        return 'Des sons apaisants pour maintenir votre état de sérénité';
      case 'sad':
        return 'Des compositions douces pour vous réconforter';
      case 'angry':
        return 'Des rythmes apaisants pour vous aider à retrouver le calme';
      case 'anxious':
        return 'Des mélodies relaxantes pour apaiser votre anxiété';
      case 'energetic':
        return 'Des rythmes dynamiques pour soutenir votre énergie';
      default:
        return 'Une playlist adaptée à votre état émotionnel actuel';
    }
  };

  /**
   * Get music recommendation based on emotion analysis
   */
  const getMusicRecommendationForEmotion = async (emotionResult: EmotionResult): Promise<MusicPlaylist | null> => {
    if (!emotionResult || !emotionResult.emotion) {
      return null;
    }
    
    return await activateMusicForEmotion({ 
      emotion: emotionResult.emotion,
      intensity: emotionResult.intensity || 0.5
    });
  };

  /**
   * Play music for a specific emotion
   */
  const playEmotion = async (emotion: string): Promise<MusicPlaylist | null> => {
    return await activateMusicForEmotion({ emotion });
  };

  return {
    activateMusicForEmotion,
    getEmotionMusicDescription,
    getMusicRecommendationForEmotion,
    playEmotion,
    isLoading
  };
};

export default useMusicEmotionIntegration;
