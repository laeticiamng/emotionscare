
import { useCallback } from 'react';
import { useMusic } from '@/hooks/useMusic';
import { EmotionMusicParams, MusicContextType } from '@/types/music';
import { useToast } from '@/hooks/use-toast';

export const useMusicEmotionIntegration = () => {
  const { setEmotion, openDrawer, setOpenDrawer, loadPlaylistForEmotion } = useMusic();
  const { toast } = useToast();

  const getEmotionMusicDescription = useCallback((emotion: string): string => {
    const descriptions: Record<string, string> = {
      'happy': 'Des mélodies joyeuses pour amplifier votre bonne humeur',
      'calm': 'Des sonorités apaisantes pour retrouver la sérénité',
      'focus': 'Des compositions pour améliorer votre concentration',
      'energetic': 'Des rythmes dynamiques pour booster votre énergie',
      'sad': 'Des mélodies mélancoliques pour accompagner vos émotions',
      'anxiety': 'Des sons apaisants pour réduire votre anxiété',
      'confidence': 'Des compositions inspirantes pour renforcer votre confiance',
      'sleep': 'Des berceuses douces pour faciliter l\'endormissement'
    };
    
    return descriptions[emotion.toLowerCase()] || 'Musique adaptée à votre humeur';
  }, []);

  const activateMusicForEmotion = useCallback(async (params: EmotionMusicParams | string): Promise<void> => {
    try {
      // Normalize params to object form
      const emotionParams: EmotionMusicParams = typeof params === 'string' 
        ? { emotion: params } 
        : params;
      
      // Set the emotion in the music context if available
      if (setEmotion) {
        setEmotion(emotionParams.emotion);
      }
      
      // Load playlist for this emotion if function is available
      if (loadPlaylistForEmotion) {
        await loadPlaylistForEmotion(emotionParams);
      }
      
      // Open the music drawer if not already open
      if (setOpenDrawer && !openDrawer) {
        setOpenDrawer(true);
        
        // Show toast notification
        toast({
          title: 'Musique émotionnelle activée',
          description: getEmotionMusicDescription(emotionParams.emotion)
        });
      }
    } catch (error) {
      console.error('Error activating music for emotion:', error);
      
      toast({
        title: 'Erreur',
        description: 'Impossible de charger la musique. Veuillez réessayer.',
        variant: 'destructive',
      });
    }
  }, [openDrawer, setOpenDrawer, setEmotion, loadPlaylistForEmotion, toast, getEmotionMusicDescription]);

  return {
    activateMusicForEmotion,
    getEmotionMusicDescription
  };
};

export default useMusicEmotionIntegration;
