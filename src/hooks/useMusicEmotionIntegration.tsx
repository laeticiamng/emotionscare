
import { useCallback, useState } from 'react';
import { useMusic } from '@/hooks';
import { useToast } from '@/hooks/use-toast';
import { MusicTrack, MusicPlaylist, EmotionMusicParams } from '@/types/music';

export interface MusicEmotionIntegrationOptions {
  enableAutoplay?: boolean;
  showNotifications?: boolean;
}

/**
 * Hook for integrating emotion detection with music recommendations
 */
export function useMusicEmotionIntegration(options: MusicEmotionIntegrationOptions = {}) {
  const { enableAutoplay = true, showNotifications = true } = options;
  
  const { 
    loadPlaylistForEmotion, 
    playTrack,
    currentTrack, 
    playlist,
    setOpenDrawer 
  } = useMusic();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  /**
   * Activate music based on detected emotion
   */
  const activateMusicForEmotion = useCallback(async (
    params: EmotionMusicParams | string,
    intensity?: number
  ) => {
    setLoading(true);
    
    try {
      // Normalize parameters
      const normalizedParams: EmotionMusicParams = typeof params === 'string'
        ? { emotion: params, intensity: intensity || 0.5 }
        : params;
      
      if (!loadPlaylistForEmotion) {
        console.warn('loadPlaylistForEmotion is not available');
        setLoading(false);
        return null;
      }
      
      // Load playlist for the emotion
      const recommendedPlaylist = await loadPlaylistForEmotion(normalizedParams);
      
      // If playlist loaded successfully and has tracks
      if (recommendedPlaylist && Array.isArray(recommendedPlaylist.tracks) && recommendedPlaylist.tracks.length > 0) {
        // Play the first track if autoplay is enabled
        if (enableAutoplay && playTrack) {
          playTrack(recommendedPlaylist.tracks[0]);
          
          // Open the music drawer if available
          if (setOpenDrawer) {
            setOpenDrawer(true);
          }
          
          // Show notification toast
          if (showNotifications) {
            toast({
              title: 'Musique activée',
              description: `Lecture d'une playlist adaptée à l'émotion: ${normalizedParams.emotion}`,
              variant: 'default',
            });
          }
        }
        
        setLoading(false);
        return recommendedPlaylist;
      } else {
        if (showNotifications) {
          toast({
            title: 'Aucune musique disponible',
            description: `Aucune piste disponible pour l'émotion: ${normalizedParams.emotion}`,
            variant: 'warning',
          });
        }
        
        setLoading(false);
        return null;
      }
    } catch (error) {
      console.error('Error playing emotion music:', error);
      if (showNotifications) {
        toast({
          title: 'Erreur',
          description: 'Impossible de jouer la musique',
          variant: 'destructive',
        });
      }
      
      setLoading(false);
      return null;
    }
  }, [loadPlaylistForEmotion, playTrack, setOpenDrawer, toast, enableAutoplay, showNotifications]);

  /**
   * Get description of emotion music
   */
  const getEmotionMusicDescription = useCallback((emotion: string): string => {
    const descriptions: Record<string, string> = {
      joy: "Musique enjouée et rythmée pour amplifier votre bonheur",
      happy: "Mélodies positives pour vous maintenir dans cet état de joie",
      calm: "Sons apaisants pour maintenir votre tranquillité",
      relaxed: "Ambiances douces pour prolonger votre relaxation",
      sad: "Compositions émotionnelles pour vous aider à exprimer vos émotions",
      angry: "Musique apaisante pour transformer votre colère en sérénité",
      anxious: "Sons relaxants pour diminuer votre anxiété",
      focused: "Rythmes soutenus pour maintenir votre concentration",
      energetic: "Mélodies dynamisantes pour entretenir votre énergie"
    };
    
    return descriptions[emotion.toLowerCase()] || 
      `Musique adaptée à votre état émotionnel: ${emotion}`;
  }, []);

  return {
    activateMusicForEmotion,
    getEmotionMusicDescription,
    currentPlaylist: playlist,
    currentTrack,
    isLoading: loading
  };
}

export default useMusicEmotionIntegration;
