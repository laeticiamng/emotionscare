
import { useMusic } from '@/contexts/MusicContext';
import { useToast } from '@/hooks/use-toast';
import { useCallback } from 'react';
import { EmotionMusicParams } from '@/types/music';

interface EmotionMusicOptions {
  emotion: string;
  intensity?: number;
}

export function useMusicEmotionIntegration() {
  const { loadPlaylistForEmotion, setOpenDrawer } = useMusic();
  const { toast } = useToast();

  const activateMusicForEmotion = useCallback(async (options: EmotionMusicOptions) => {
    const { emotion, intensity = 0.5 } = options;
    
    try {
      const params: EmotionMusicParams = { emotion, intensity };
      const playlist = await loadPlaylistForEmotion(params);
      
      if (playlist && setOpenDrawer) {
        setOpenDrawer(true);
        
        toast({
          title: "Musique adaptée",
          description: `Une playlist basée sur votre humeur "${emotion}" est maintenant active.`
        });
        
        return true;
      } else {
        console.log(`No playlist found for emotion: ${emotion}`);
        return false;
      }
    } catch (error) {
      console.error("Error activating music for emotion:", error);
      return false;
    }
  }, [loadPlaylistForEmotion, setOpenDrawer, toast]);
  
  const getEmotionMusicDescription = useCallback((emotion: string): string => {
    const descriptions: Record<string, string> = {
      happy: "De la musique joyeuse et entraînante pour améliorer votre bonne humeur.",
      sad: "Des mélodies apaisantes et réconfortantes pour vous accompagner dans ce moment.",
      calm: "Des sons doux et apaisants pour maintenir votre tranquillité.",
      focus: "Des rythmes qui favorisent la concentration et la productivité.",
      energetic: "Des tempos dynamiques pour stimuler votre énergie.",
      angry: "De la musique apaisante pour aider à gérer les émotions fortes.",
      anxious: "Des mélodies relaxantes pour réduire l'anxiété et favoriser la détente.",
      neutral: "Une sélection musicale équilibrée adaptée à votre journée."
    };
    
    return descriptions[emotion.toLowerCase()] || descriptions.neutral;
  }, []);
  
  return {
    activateMusicForEmotion,
    getEmotionMusicDescription
  };
}

export default useMusicEmotionIntegration;
