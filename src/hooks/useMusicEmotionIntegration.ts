
import { useState, useCallback } from 'react';
import { MusicPlaylist, EmotionMusicParams } from '@/types/music';
import { useMusic } from '@/contexts/MusicContext';
import { demoTracks } from '@/services/music/demo-tracks';

export const useMusicEmotionIntegration = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { play, setPlaylist } = useMusic();

  const getMusicRecommendationForEmotion = useCallback((emotion: string) => {
    // Simuler une recommandation basée sur l'émotion
    const emotionTracks = demoTracks.filter(track => 
      track.emotion?.toLowerCase() === emotion.toLowerCase()
    );
    return emotionTracks.length > 0 ? emotionTracks : demoTracks;
  }, []);

  const playEmotion = useCallback(async (emotion: string) => {
    setIsLoading(true);
    try {
      const tracks = getMusicRecommendationForEmotion(emotion);
      setPlaylist(tracks);
      if (tracks.length > 0) {
        play(tracks[0]);
      }
      return { id: 'emotion-playlist', name: `Playlist ${emotion}`, tracks };
    } catch (error) {
      console.error('Error playing emotion music:', error);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [getMusicRecommendationForEmotion, setPlaylist, play]);

  const activateMusicForEmotion = useCallback(async (params: EmotionMusicParams) => {
    return await playEmotion(params.emotion);
  }, [playEmotion]);

  const getEmotionMusicDescription = useCallback((emotion: string) => {
    const descriptions: Record<string, string> = {
      calm: "Musique apaisante pour la détente",
      happy: "Mélodies joyeuses et énergisantes",
      sad: "Musique douce et mélancolique",
      energetic: "Rythmes dynamiques et motivants",
      focused: "Sons ambiants pour la concentration",
      relaxed: "Ambiances zen et relaxantes"
    };
    return descriptions[emotion] || "Musique adaptée à votre état émotionnel";
  }, []);

  return {
    getMusicRecommendationForEmotion,
    playEmotion,
    activateMusicForEmotion,
    getEmotionMusicDescription,
    isLoading
  };
};
