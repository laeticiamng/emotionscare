
import { useState } from 'react';
import { useMusic } from '@/contexts';
import { useToast } from '@/hooks/use-toast';

export function useMusicRecommendation() {
  const { 
    loadPlaylistForEmotion, 
    playTrack,
    currentTrack, 
    playlist,
    setOpenDrawer 
  } = useMusic();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  const getRecommendationForEmotion = (emotion: string, intensity?: number) => {
    setLoading(true);
    try {
      // Vérifions si loadPlaylistForEmotion existe et l'utilisons
      if (typeof loadPlaylistForEmotion === 'function') {
        const result = loadPlaylistForEmotion({ emotion, intensity });
        setLoading(false);
        return result;
      } else {
        console.warn('loadPlaylistForEmotion n\'est pas disponible');
        setLoading(false);
        return null;
      }
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
      // Vérifions si loadPlaylistForEmotion existe et l'utilisons
      if (typeof loadPlaylistForEmotion === 'function') {
        const params = { emotion, intensity: intensity || 0.5 };
        const recommendedPlaylist = loadPlaylistForEmotion(params);
        
        if (recommendedPlaylist && recommendedPlaylist.tracks && recommendedPlaylist.tracks.length > 0) {
          // Si playTrack est disponible, jouons la première piste
          if (typeof playTrack === 'function') {
            playTrack(recommendedPlaylist.tracks[0]);
          }
          
          // Si setOpenDrawer est disponible, ouvrons le drawer
          if (typeof setOpenDrawer === 'function') {
            setOpenDrawer(true);
          }
          
          toast({
            title: 'Musique activée',
            description: `Lecture d'une playlist adaptée à votre émotion: ${emotion}`,
            variant: 'default',
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
      } else {
        console.warn('loadPlaylistForEmotion n\'est pas disponible');
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
