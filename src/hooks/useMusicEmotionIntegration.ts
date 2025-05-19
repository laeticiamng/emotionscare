
import { useEffect, useState, useCallback } from 'react';
import { useToast } from '@/hooks/use-toast';
import { useMusic } from '@/hooks/useMusic';
import { MusicPlaylist, EmotionMusicParams } from '@/types/music';
import { createMusicParams, convertToPlaylist } from '@/utils/musicCompatibility';

// Map of emotions to descriptions
const EMOTION_DESCRIPTIONS: Record<string, string> = {
  calm: 'Des sons apaisants pour favoriser la relaxation et la sérénité.',
  happy: 'Des mélodies joyeuses pour amplifier votre bonne humeur.',
  sad: 'Des compositions douces pour vous accompagner dans vos moments mélancoliques.',
  angry: 'Des rythmes pour canaliser et apaiser les sentiments de colère.',
  anxious: 'De la musique apaisante pour réduire l\'anxiété et le stress.',
  energetic: 'Des rythmes dynamiques pour renforcer votre énergie.',
  focused: 'Des sons ambiants pour améliorer votre concentration.',
  peaceful: 'Des mélodies douces pour cultiver un sentiment de paix intérieure.',
  excited: 'Des compositions entraînantes pour accompagner votre enthousiasme.',
  stressed: 'Des sons relaxants pour vous aider à gérer votre stress.',
  default: 'Une sélection musicale adaptée à votre état émotionnel.'
};

export const useMusicEmotionIntegration = () => {
  const music = useMusic();
  const { toast } = useToast();
  const [isActivating, setIsActivating] = useState(false);
  
  // Activate music for a specific emotion
  const activateMusicForEmotion = useCallback(async (params: EmotionMusicParams | string) => {
    setIsActivating(true);
    try {
      const musicParams = createMusicParams(params);
      let playlist: MusicPlaylist | null = null;
      
      // Try different methods to get emotion-based music
      if (music.loadPlaylistForEmotion) {
        playlist = await music.loadPlaylistForEmotion(musicParams);
      } else if (music.getRecommendationByEmotion) {
        playlist = await music.getRecommendationByEmotion(musicParams);
      } else if (music.playEmotion) {
        music.playEmotion(musicParams.emotion);
        return true;
      }
      
      if (playlist) {
        // Convert to standard format
        const formattedPlaylist = convertToPlaylist(playlist);
        
        // Play the playlist
        if (formattedPlaylist.tracks.length > 0) {
          if (music.setPlaylist && music.playTrack) {
            music.setPlaylist(formattedPlaylist);
            music.playTrack(formattedPlaylist.tracks[0]);
          } else if (music.playPlaylist) {
            music.playPlaylist(formattedPlaylist);
          } else if (music.play) {
            music.play(formattedPlaylist.tracks[0], formattedPlaylist);
          }
          
          // Open the music drawer if available
          if (music.setOpenDrawer) {
            music.setOpenDrawer(true);
          } else if (music.toggleDrawer) {
            music.toggleDrawer();
          }
          
          toast({
            title: 'Musique activée',
            description: `Playlist "${formattedPlaylist.title}" adaptée à votre humeur.`,
          });
          
          return true;
        }
      }
      
      toast({
        title: 'Aucune musique disponible',
        description: 'Impossible de trouver une playlist adaptée à cette émotion.',
        variant: 'destructive',
      });
      
      return false;
    } catch (error) {
      console.error('Error activating music for emotion:', error);
      toast({
        title: 'Erreur',
        description: 'Impossible d\'activer la musique pour cette émotion.',
        variant: 'destructive',
      });
      return false;
    } finally {
      setIsActivating(false);
    }
  }, [music, toast]);
  
  // Get description for an emotion
  const getEmotionMusicDescription = useCallback((emotion: string): string => {
    const normalizedEmotion = emotion.toLowerCase();
    return EMOTION_DESCRIPTIONS[normalizedEmotion] || EMOTION_DESCRIPTIONS.default;
  }, []);
  
  return {
    activateMusicForEmotion,
    getEmotionMusicDescription,
    isActivating
  };
};

export default useMusicEmotionIntegration;
