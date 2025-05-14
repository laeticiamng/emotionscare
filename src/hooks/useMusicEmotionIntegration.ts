
import { useState } from 'react';
import { useMusic } from '@/contexts/MusicContext';
import { useToast } from '@/hooks/use-toast';

export interface EmotionMusicParams {
  emotion: string;
  intensity: number;
}

export function useMusicEmotionIntegration() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [recommendation, setRecommendation] = useState<any>(null);
  const { loadPlaylistForEmotion, setOpenDrawer } = useMusic();
  const { toast } = useToast();

  const emotionDescriptions: Record<string, string> = {
    happy: "Des mélodies joyeuses et énergisantes pour accompagner votre bonne humeur.",
    sad: "Des morceaux apaisants pour vous accompagner et vous réconforter.",
    angry: "De la musique pour canaliser votre énergie et retrouver votre calme.",
    anxious: "Des sons relaxants qui vous aideront à apaiser votre anxiété.",
    neutral: "Une ambiance sonore équilibrée pour maintenir votre concentration.",
    calm: "Des mélodies douces pour préserver votre tranquillité d'esprit.",
    stressed: "Des morceaux décompressants pour diminuer votre niveau de stress.",
    excited: "Des rythmes dynamiques qui s'accordent avec votre enthousiasme.",
    tired: "Des sons apaisants pour vous aider à vous ressourcer.",
    focused: "De la musique qui favorise votre concentration et productivité."
  };

  const getEmotionMusicDescription = (emotion: string): string => {
    const normalizedEmotion = emotion.toLowerCase();
    return emotionDescriptions[normalizedEmotion] || 
      "Une sélection musicale adaptée à votre état émotionnel actuel.";
  };

  const activateMusicForEmotion = async (params: EmotionMusicParams): Promise<boolean> => {
    setIsLoading(true);
    setError(null);
    
    try {
      await loadPlaylistForEmotion(params.emotion);
      setOpenDrawer(true);
      
      toast({
        title: "Musique activée",
        description: `Playlist adaptée à votre humeur "${params.emotion}" chargée.`
      });
      
      return true;
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Erreur inconnue'));
      
      toast({
        title: "Erreur",
        description: "Impossible de charger la playlist",
        variant: "destructive"
      });
      
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    recommendation,
    isLoading,
    error,
    activateMusicForEmotion,
    getEmotionMusicDescription
  };
}
