
import { useState, useCallback } from 'react';
import { useToast } from '@/hooks/use-toast';
import { useMusic } from '@/contexts/MusicContext';

// Interface pour les paramètres envoyés vers le service de musique
export interface EmotionMusicParams {
  emotion: string;
  intensity?: number;
}

// Descriptions des musiques par émotion
const musicDescriptions: Record<string, string> = {
  happy: "Des mélodies joyeuses et dynamiques pour amplifier votre bonne humeur.",
  sad: "Des compositions apaisantes qui vous aideront à traverser ce moment difficile.",
  angry: "De la musique équilibrante pour canaliser votre énergie et retrouver le calme.",
  anxious: "Des sonorités douces et relaxantes pour apaiser votre anxiété.",
  calm: "Des ambiances paisibles pour maintenir votre état de sérénité.",
  excited: "Des rythmes entraînants pour accompagner votre enthousiasme.",
  neutral: "Une sélection équilibrée adaptée à votre humeur neutre.",
};

export const useMusicEmotionIntegration = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [lastPlayedEmotion, setLastPlayedEmotion] = useState<string | null>(null);
  const { toast } = useToast();
  const { loadPlaylistForEmotion, playTrack, setOpenDrawer } = useMusic();

  // Fonction pour activer la musique correspondante à l'émotion
  const activateMusicForEmotion = async (params: EmotionMusicParams): Promise<boolean> => {
    setIsLoading(true);
    
    try {
      console.log(`Activating music for emotion: ${params.emotion} with intensity: ${params.intensity}`);
      
      // Utiliser le contexte musical pour charger et jouer la playlist
      const playlist = await loadPlaylistForEmotion(params.emotion.toLowerCase());
      
      if (playlist && playlist.tracks && playlist.tracks.length > 0) {
        // Assurer que les pistes ont les propriétés requises
        const track = {
          ...playlist.tracks[0],
          duration: playlist.tracks[0].duration || 0,
          url: playlist.tracks[0].url || playlist.tracks[0].audioUrl || playlist.tracks[0].coverUrl || ''
        };
        
        // Jouer la première piste
        playTrack(track);
        setOpenDrawer(true);
        
        toast({
          title: "Musique activée",
          description: `Lecture basée sur l'émotion: ${params.emotion}`,
        });
        
        setLastPlayedEmotion(params.emotion);
        return true;
      } else {
        console.log("No tracks found for emotion:", params.emotion);
        toast({
          title: "Aucune musique disponible",
          description: `Pas de playlist trouvée pour l'émotion ${params.emotion}`,
          variant: "destructive"
        });
        return false;
      }
    } catch (error) {
      console.error("Error activating music for emotion:", error);
      toast({
        title: "Erreur",
        description: "Impossible d'activer la musique pour cette émotion",
        variant: "destructive"
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  // Obtenir la description de la musique pour une émotion
  const getEmotionMusicDescription = (emotion: string): string => {
    return musicDescriptions[emotion.toLowerCase()] || 
      "Une musique spécialement sélectionnée pour s'accorder à votre état émotionnel actuel.";
  };

  return {
    activateMusicForEmotion,
    getEmotionMusicDescription,
    isLoading,
    lastPlayedEmotion
  };
};
