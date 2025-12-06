// @ts-nocheck

import { useState, useEffect } from 'react';
import { useMusicEmotionIntegration } from '@/hooks/useMusicEmotionIntegration';
import { MusicPlaylist, EmotionMusicParams } from '@/types/music';
import { ensureArray } from '@/utils/musicCompatibility';

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

  // Auto-activate music if emotion is set and autoActivate is true
  useEffect(() => {
    if (autoActivate && currentEmotion) {
      loadMusicForEmotion(currentEmotion);
    }
  }, [currentEmotion, autoActivate]);

  // Load music for emotion
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

  // Update emotion and optionally activate music
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
    tracks: playlist ? ensureArray(playlist.tracks) : [],
  };
};

export default useMusicRecommendation;
