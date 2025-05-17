import { useCallback } from 'react';
import { useMusic } from '@/contexts/MusicContext';
import { useToast } from '@/hooks/use-toast';
import { EmotionMusicParams } from '@/types/music';

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

  const activateMusicForEmotion = useCallback(async (params: EmotionMusicParams): Promise<boolean> => {
    try {
      // Set the emotion in the music context
      setEmotion(params.emotion);
      
      // Load playlist for this emotion
      const playlist = await loadPlaylistForEmotion(params);
      
      // Open the music drawer
      if (!openDrawer) {
        setOpenDrawer(true);
        
        // Show toast notification
        toast({
          title: 'Musique émotionnelle activée',
          description: getEmotionMusicDescription(params.emotion)
        });
      }
      
      return true;
    } catch (error) {
      console.error('Error activating music for emotion:', error);
      
      toast({
        title: 'Erreur',
        description: 'Impossible de charger la musique. Veuillez réessayer.',
        variant: 'destructive',
      });
      
      return false;
    }
  }, [openDrawer, setOpenDrawer, setEmotion, loadPlaylistForEmotion, toast, getEmotionMusicDescription]);

  return {
    activateMusicForEmotion,
    getEmotionMusicDescription
  };
};

export default useMusicEmotionIntegration;

// Fix the specific type error by ensuring we create a properly formatted EmotionMusicParams object
export const activateMusicForCommunityMood = async (emotion: string) => {
  try {
    // Create a properly formatted EmotionMusicParams object
    const params: EmotionMusicParams = {
      emotion: emotion,
      intensity: 0.5
    };
    
    // Now use the params object when calling loadPlaylistForEmotion
    const musicContext = useMusic();
    const playlist = await musicContext.loadPlaylistForEmotion(params);
    
    if (playlist) {
      musicContext.setOpenDrawer(true);
      return true;
    }
    
    return false;
  } catch (error) {
    console.error('Failed to activate music for community mood:', error);
    return false;
  }
};
