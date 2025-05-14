
import { useState, useCallback } from 'react';
import { useMusic } from '@/contexts/MusicContext';
import { useToast } from '@/hooks/use-toast';

interface EmotionMusicRequest {
  emotion: string;
  intensity: number;
}

export const useMusicEmotionIntegration = () => {
  const { loadPlaylistForEmotion, setOpenDrawer } = useMusic();
  const { toast } = useToast();
  const [isProcessing, setIsProcessing] = useState(false);

  const activateMusicForEmotion = useCallback(async (params: EmotionMusicRequest) => {
    setIsProcessing(true);
    try {
      await loadPlaylistForEmotion(params.emotion);
      setOpenDrawer(true);
      
      toast({
        title: "Musique activée",
        description: `Playlist adaptée à votre humeur "${params.emotion}" chargée.`,
      });
      
      return true;
    } catch (error) {
      console.error("Error activating music for emotion:", error);
      
      toast({
        title: "Erreur d'activation",
        description: "Impossible d'activer la musique pour cette émotion",
        variant: "destructive",
      });
      
      return false;
    } finally {
      setIsProcessing(false);
    }
  }, [loadPlaylistForEmotion, setOpenDrawer, toast]);

  const getEmotionMusicDescription = useCallback((emotion: string): string => {
    const descriptions: Record<string, string> = {
      happy: "Des mélodies entraînantes pour accompagner et amplifier votre bonne humeur.",
      joy: "Des mélodies entraînantes pour accompagner et amplifier votre bonne humeur.",
      sad: "Des compositions apaisantes qui vous aideront à traverser ce moment de tristesse.",
      angry: "Des morceaux relaxants pour vous aider à retrouver votre calme.",
      stressed: "Des ambiances sonores qui réduisent l'anxiété et favorisent la détente.",
      anxious: "De la musique douce qui apaise l'esprit et calme les pensées agitées.",
      calm: "Des mélodies qui maintiennent votre état de tranquillité intérieure.",
      focused: "Des compositions minimalistes pour maintenir votre concentration.",
      tired: "Des rythmes dynamiques pour vous redonner de l'énergie.",
      bored: "Des morceaux stimulants pour réveiller votre curiosité.",
      neutral: "Une sélection équilibrée adaptée à votre humeur actuelle."
    };

    return descriptions[emotion.toLowerCase()] || 
      "Une sélection musicale adaptée à votre état émotionnel actuel.";
  }, []);

  return {
    activateMusicForEmotion,
    getEmotionMusicDescription,
    isProcessing
  };
};

export default useMusicEmotionIntegration;
