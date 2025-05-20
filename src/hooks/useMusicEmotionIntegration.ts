
import { useCallback } from 'react';
import { useMusic } from '@/hooks/useMusic';
import { EmotionMusicParams } from '@/types/music';
import { useToast } from '@/hooks/use-toast';
import { createMusicParams } from '@/utils/musicCompatibility';

export interface MusicEmotionIntegration {
  activateMusicForEmotion: (params: EmotionMusicParams | string) => Promise<boolean>;
  getEmotionMusicDescription: (emotion: string) => string;
}

export const getEmotionMusicDescription = (emotion: string): string => {
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
};

export function useMusicEmotionIntegration(): MusicEmotionIntegration {
  const music = useMusic();
  const { toast } = useToast();
  
  const activateMusicForEmotion = useCallback(async (params: EmotionMusicParams | string): Promise<boolean> => {
    try {
      if (!music.loadPlaylistForEmotion) {
        console.error("Music context doesn't have loadPlaylistForEmotion method");
        return false;
      }

      let musicParams: EmotionMusicParams;
      
      // Handle string or object params
      if (typeof params === 'string') {
        musicParams = {
          emotion: params,
          intensity: 0.5
        };
      } else {
        musicParams = params;
      }

      // Set emotion in context if available
      if (music.setEmotion) {
        music.setEmotion(musicParams.emotion);
      }
      
      // Load the playlist for this emotion
      const playlist = await music.loadPlaylistForEmotion(musicParams);
      
      if (playlist && playlist.tracks && playlist.tracks.length > 0) {
        // Open drawer if available
        if (music.setOpenDrawer) {
          music.setOpenDrawer(true);
        }
        return true;
      } else {
        toast({
          title: "Pas de musique disponible",
          description: "Aucune musique n'a pu être trouvée pour cette émotion"
        });
        return false;
      }
    } catch (error) {
      console.error('Error activating music for emotion:', error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de charger la musique pour cette émotion"
      });
      return false;
    }
  }, [music, toast]);

  return {
    activateMusicForEmotion,
    getEmotionMusicDescription
  };
}

export default useMusicEmotionIntegration;
