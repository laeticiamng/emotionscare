
import { useCallback } from 'react';
import { useMusic } from '@/contexts/MusicContext';
import { useToast } from '@/hooks/use-toast';
import { EmotionMusicParams } from '@/types/music';

/**
 * Hook that integrates emotion recognition with music playback
 */
export const useMusicEmotionIntegration = () => {
  const music = useMusic();
  const { toast } = useToast();
  
  const getEmotionMusicDescription = (emotion: string): string => {
    const descriptions: Record<string, string> = {
      'happy': 'Des mélodies joyeuses pour amplifier votre bonne humeur',
      'calm': 'Des sonorités apaisantes pour retrouver la sérénité',
      'focus': 'Des compositions pour améliorer votre concentration',
      'focused': 'Des compositions pour améliorer votre concentration',
      'energetic': 'Des rythmes dynamiques pour booster votre énergie',
      'sad': 'Des mélodies mélancoliques pour accompagner vos émotions',
      'anxiety': 'Des sons apaisants pour réduire votre anxiété',
      'confidence': 'Des compositions inspirantes pour renforcer votre confiance',
      'sleep': 'Des berceuses douces pour faciliter l\'endormissement',
      'relaxed': 'Des ambiances douces pour vous aider à vous détendre'
    };
    
    return descriptions[emotion.toLowerCase()] || 'Musique adaptée à votre humeur';
  };
  
  const activateMusicForEmotion = useCallback(async (params: EmotionMusicParams) => {
    try {
      const playlist = await music.loadPlaylistForEmotion(params);
      
      if (playlist) {
        music.setOpenDrawer(true);
        
        toast({
          title: "Musique activée",
          description: `Une playlist adaptée à votre humeur ${params.emotion} est maintenant disponible.`,
        });
        
        return true;
      } else {
        toast({
          title: "Musique non disponible",
          description: `Aucune playlist n'est disponible pour l'émotion ${params.emotion} pour le moment.`,
          variant: "destructive",
        });
        
        return false;
      }
    } catch (error) {
      console.error("Erreur lors de l'activation de la musique:", error);
      
      toast({
        title: "Erreur",
        description: "Impossible d'activer la musique pour votre émotion.",
        variant: "destructive",
      });
      
      return false;
    }
  }, [music, toast]);
  
  return {
    activateMusicForEmotion,
    getEmotionMusicDescription,
  };
};

export default useMusicEmotionIntegration;
