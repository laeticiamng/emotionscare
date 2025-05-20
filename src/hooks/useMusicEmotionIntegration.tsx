
import { useCallback } from 'react';
import { useMusic } from './useMusic';
import { EmotionMusicParams } from '@/types/music';

export const useMusicEmotionIntegration = () => {
  const music = useMusic();
  
  // Map emotions to musical styles
  const emotionToMusicType = {
    calm: 'ambient',
    happy: 'upbeat',
    focused: 'concentration',
    energetic: 'energetic',
    sad: 'melancholic',
    stressed: 'relaxing',
    anxious: 'calming',
    neutral: 'balanced'
  };
  
  const getEmotionMusicDescription = useCallback((emotion: string) => {
    const descriptions = {
      calm: "Musique apaisante pour la relaxation",
      happy: "Sons joyeux pour maintenir votre humeur positive",
      focused: "Rythmes pour améliorer votre concentration",
      energetic: "Mélodies dynamiques qui vous boostent",
      sad: "Harmonies douces pour accompagner vos moments de mélancolie",
      stressed: "Sons relaxants pour réduire votre niveau de stress",
      anxious: "Compositions apaisantes pour calmer l'anxiété",
      neutral: "Musique équilibrée pour une ambiance de fond agréable"
    };
    
    return descriptions[emotion as keyof typeof descriptions] || "Musique adaptée à votre humeur";
  }, []);
  
  const activateMusicForEmotion = useCallback(async (params: EmotionMusicParams) => {
    try {
      if (!music || !music.loadPlaylistForEmotion) {
        console.error("Music service or loadPlaylistForEmotion not available");
        return false;
      }
      
      // Map the emotion to a music type if needed
      if (typeof params === 'string') {
        const musicType = emotionToMusicType[params as keyof typeof emotionToMusicType] || 'balanced';
        params = { emotion: musicType };
      } else if (typeof params.emotion === 'string' && emotionToMusicType[params.emotion as keyof typeof emotionToMusicType]) {
        params.emotion = emotionToMusicType[params.emotion as keyof typeof emotionToMusicType];
      }
      
      // Load the playlist
      const playlist = await music.loadPlaylistForEmotion(params);
      
      // If playlist loaded successfully and has tracks, play the first one
      if (playlist && playlist.tracks && playlist.tracks.length > 0 && music.playTrack) {
        await music.playTrack(playlist.tracks[0]);
        return true;
      }
      
      console.warn("No tracks available for the emotion:", params);
      return false;
    } catch (error) {
      console.error("Error activating music for emotion:", error);
      return false;
    }
  }, [music, emotionToMusicType]);
  
  return {
    activateMusicForEmotion,
    getEmotionMusicDescription,
    emotionToMusicType
  };
};
