
import { useState } from 'react';
import { useMusic } from '@/contexts/music/MusicContextProvider';
import { useToast } from './use-toast';

export function useMusicRecommendation() {
  const { 
    recommendByEmotion, 
    playPlaylist, 
    playlist,
    setOpenDrawer
  } = useMusic();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  const getRecommendationForEmotion = (emotion: string, intensity?: number) => {
    setLoading(true);
    try {
      const playlist = recommendByEmotion(emotion, intensity);
      setLoading(false);
      return playlist;
    } catch (error) {
      console.error('Error getting music recommendation:', error);
      toast({
        title: 'Erreur',
        description: 'Impossible de récupérer les recommandations musicales',
        variant: 'destructive',
      });
      setLoading(false);
      return null;
    }
  };

  const playEmotionMusic = (emotion: string, intensity?: number) => {
    setLoading(true);
    try {
      const recommendedPlaylist = recommendByEmotion(emotion, intensity);
      if (recommendedPlaylist && recommendedPlaylist.tracks.length > 0) {
        playPlaylist(recommendedPlaylist);
        setOpenDrawer(true);
        toast({
          title: 'Musique activée',
          description: `Lecture d'une playlist adaptée à votre émotion: ${emotion}`,
          variant: 'success',
        });
        setLoading(false);
        return true;
      } else {
        toast({
          title: 'Aucune musique disponible',
          description: `Aucune piste disponible pour l'émotion: ${emotion}`,
          variant: 'warning',
        });
        setLoading(false);
        return false;
      }
    } catch (error) {
      console.error('Error playing emotion music:', error);
      toast({
        title: 'Erreur',
        description: 'Impossible de jouer la musique',
        variant: 'destructive',
      });
      setLoading(false);
      return false;
    }
  };

  return {
    getRecommendationForEmotion,
    playEmotionMusic,
    currentPlaylist: playlist,
    isLoading: loading
  };
}

export default useMusicRecommendation;
