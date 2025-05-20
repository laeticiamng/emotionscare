
import { useState } from 'react';
import { useMusic } from '@/hooks/useMusic';
import { MusicTrack, MusicPlaylist, EmotionMusicParams } from '@/types/music';
import { createMusicParams, convertToPlaylist } from '@/utils/musicCompatibility';

export const useMusicEmotionIntegration = () => {
  const [isActivating, setIsActivating] = useState(false);
  const music = useMusic();

  // Get a description of music for an emotion
  const getEmotionMusicDescription = (emotion: string): string => {
    const descriptions: Record<string, string> = {
      'happy': 'Musique énergisante et joyeuse pour amplifier votre bonne humeur',
      'sad': 'Mélodies douces et apaisantes pour vous accompagner dans vos moments de tristesse',
      'calm': 'Sons relaxants pour vous aider à trouver la sérénité',
      'angry': 'Rythmes intenses pour canaliser votre énergie',
      'anxious': 'Compositions harmonieuses pour réduire l\'anxiété',
      'focused': 'Musique ambient pour améliorer votre concentration',
      'energetic': 'Tempos dynamiques pour stimuler votre énergie',
      'tired': 'Mélodies douces pour vous ressourcer',
      'stressed': 'Sons apaisants pour diminuer votre niveau de stress',
      'relaxed': 'Ambiances calmes pour maintenir votre état de relaxation'
    };
    
    return descriptions[emotion.toLowerCase()] || 
      'Musique adaptée à votre humeur actuelle';
  };

  // Activate music that matches an emotion
  const activateMusicForEmotion = async (
    params: string | EmotionMusicParams
  ): Promise<boolean> => {
    setIsActivating(true);
    try {
      const emotionParams = typeof params === 'string' ? { emotion: params } : params;
      
      if (music.loadPlaylistForEmotion) {
        const playlist = await music.loadPlaylistForEmotion(emotionParams);
        if (playlist && music.playPlaylist) {
          music.playPlaylist(playlist);
          return true;
        }
      } else if (music.getRecommendationByEmotion) {
        const playlist = await music.getRecommendationByEmotion(emotionParams.emotion);
        if (playlist && music.playPlaylist) {
          music.playPlaylist(playlist);
          return true;
        }
      } else {
        // Basic fallback if specific emotion methods aren't available
        if (music.playEmotion) {
          music.playEmotion(emotionParams.emotion);
          return true;
        }
      }
      
      return false;
    } catch (error) {
      console.error('Error activating music for emotion:', error);
      return false;
    } finally {
      setIsActivating(false);
    }
  };

  return {
    isActivating,
    activateMusicForEmotion,
    getEmotionMusicDescription
  };
};

export default useMusicEmotionIntegration;
