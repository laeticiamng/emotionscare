
import { useState } from 'react';
import { MusicPlaylist, EmotionMusicParams, EmotionResult } from '@/types/music';
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
    const descriptions: Record<string, string> = {
      'happy': 'Des mélodies enjouées pour accompagner votre bonne humeur',
      'calm': 'Des sons apaisants pour maintenir votre état de sérénité',
      'peaceful': 'Des sons apaisants pour maintenir votre état de sérénité',
      'sad': 'Des compositions douces pour vous réconforter',
      'angry': 'Des rythmes apaisants pour vous aider à retrouver le calme',
      'anxious': 'Des mélodies relaxantes pour apaiser votre anxiété',
      'energetic': 'Des rythmes dynamiques pour soutenir votre énergie',
      'neutral': 'Une playlist adaptée à votre état émotionnel actuel',
      'fear': "Sons calmes pour apaiser et retrouver la sérénité",
      'surprise': 'Mélodies rafraîchissantes et légères pour accompagner ce moment',
      'disgust': "Musiques transformatives pour améliorer votre état d'esprit"
    };

    return descriptions[emotion.toLowerCase()] || 'Une playlist adaptée à votre état émotionnel actuel';
  };

  /**
   * Get music recommendation based on emotion analysis
   */
  const getMusicRecommendationForEmotion = async (emotionResult: EmotionResult): Promise<MusicPlaylist | null> => {
    if (!emotionResult || !emotionResult.dominantEmotion) {
      return null;
    }
    
    return await activateMusicForEmotion({ 
      emotion: emotionResult.dominantEmotion,
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
