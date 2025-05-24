
import { useState, useEffect } from 'react';
import { useMusicEmotionIntegration } from './useMusicEmotionIntegration';
import { MusicPlaylist, EmotionMusicParams } from '@/types/music';

interface UseMusicRecommendationOptions {
  autoActivate?: boolean;
  defaultEmotion?: string;
  intensity?: number;
}

export const useMusicRecommendation = (options: UseMusicRecommendationOptions = {}) => {
  const { autoActivate = false, defaultEmotion, intensity = 0.5 } = options;
  const [currentEmotion, setCurrentEmotion] = useState<string | null>(defaultEmotion || null);
  const [playlist, setPlaylist] = useState<MusicPlaylist | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { activateMusicForEmotion } = useMusicEmotionIntegration();

  useEffect(() => {
    if (autoActivate && currentEmotion) {
      loadMusicForEmotion(currentEmotion);
    }
  }, [currentEmotion, autoActivate]);

  const loadMusicForEmotion = async (emotion: string) => {
    if (!emotion) return null;
    
    setIsLoading(true);
    try {
      const params: EmotionMusicParams = {
        emotion,
        intensity
      };
      
      const result = await activateMusicForEmotion(params);
      if (result !== null) {
        setPlaylist(result);
      }
      return result;
    } finally {
      setIsLoading(false);
    }
  };

  const updateEmotion = async (emotion: string, activate = false) => {
    setCurrentEmotion(emotion);
    if (activate) {
      return await loadMusicForEmotion(emotion);
    }
    return null;
  };

  return {
    currentEmotion,
    playlist,
    isLoading,
    updateEmotion,
    loadMusicForEmotion,
    tracks: playlist ? playlist.tracks : [],
  };
};

export default useMusicRecommendation;
