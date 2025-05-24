
import { useState, useCallback } from 'react';
import { useMusic } from '@/contexts/MusicContext';
import { MusicPlaylist, EmotionMusicParams } from '@/types/music';
import { useToast } from '@/hooks/use-toast';

export const useMusicEmotionIntegration = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { loadPlaylistForEmotion, setPlaylist, play } = useMusic();
  const { toast } = useToast();

  const activateMusicForEmotion = useCallback(async (params: EmotionMusicParams): Promise<MusicPlaylist | null> => {
    if (!loadPlaylistForEmotion) {
      console.error('loadPlaylistForEmotion not available');
      return null;
    }

    setIsLoading(true);
    try {
      const playlist = await loadPlaylistForEmotion(params);
      if (playlist && playlist.tracks.length > 0) {
        // Jouer automatiquement le premier morceau
        play(playlist.tracks[0]);
        toast({
          title: "Musique activée",
          description: `Playlist "${playlist.name}" chargée pour ${params.emotion}`,
        });
      }
      return playlist;
    } catch (error) {
      console.error('Error activating music for emotion:', error);
      toast({
        title: "Erreur",
        description: "Impossible de charger la musique pour cette émotion",
        variant: "destructive",
      });
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [loadPlaylistForEmotion, play, toast]);

  const getMusicRecommendationForEmotion = useCallback(async (emotion: string): Promise<MusicPlaylist | null> => {
    return await activateMusicForEmotion({ emotion });
  }, [activateMusicForEmotion]);

  const playEmotion = useCallback(async (emotion: string): Promise<MusicPlaylist | null> => {
    return await activateMusicForEmotion({ emotion });
  }, [activateMusicForEmotion]);

  const getEmotionMusicDescription = useCallback((emotion: string): string => {
    const descriptions: Record<string, string> = {
      calm: "Musique apaisante pour la relaxation",
      happy: "Mélodies joyeuses pour booster l'humeur",
      focused: "Sons ambiants pour la concentration",
      energetic: "Musique dynamique pour l'énergie",
      sad: "Musique douce pour accompagner la mélancolie",
      stressed: "Sons relaxants pour réduire le stress",
      angry: "Musique apaisante pour calmer la colère",
      neutral: "Musique d'ambiance générale",
    };

    return descriptions[emotion.toLowerCase()] || "Musique adaptée à votre humeur";
  }, []);

  return {
    activateMusicForEmotion,
    getMusicRecommendationForEmotion,
    playEmotion,
    getEmotionMusicDescription,
    isLoading,
  };
};

export default useMusicEmotionIntegration;
