
import { useCallback } from 'react';
import { useMusic } from '@/contexts/MusicContext';
import { useToast } from '@/hooks/use-toast';
import { mapEmotionToMusicType } from '@/services/music/emotion-music-mapping';

export interface EmotionResult {
  emotion: string;
  intensity?: number;
  confidence?: number;
}

export interface EmotionToMusicMap {
  [key: string]: string;
}

export function useMusicEmotionIntegration() {
  const { loadPlaylistForEmotion, playTrack, currentPlaylist, currentTrack, isPlaying, setOpenDrawer } = useMusic();
  const { toast } = useToast();
  
  // Activate music based on detected emotion
  const activateMusicForEmotion = useCallback((emotionResult: EmotionResult) => {
    if (!emotionResult.emotion) return;
    
    const emotionKey = emotionResult.emotion.toLowerCase();
    const musicType = mapEmotionToMusicType(emotionKey);
    
    const playlist = loadPlaylistForEmotion(musicType);
    
    if (playlist && playlist.tracks.length > 0) {
      // If no music is playing, start playing
      if (!currentTrack || !isPlaying) {
        const track = {
          ...playlist.tracks[0],
          duration: playlist.tracks[0].duration || 0,
          url: playlist.tracks[0].url || playlist.tracks[0].audioUrl || ''
        };
        playTrack(track);
      }
      
      // Open the drawer with the music player
      setOpenDrawer(true);
      
      // Notify the user about the music recommendation
      toast({
        title: "Musique adaptée à votre émotion",
        description: `Une playlist "${musicType}" correspondant à votre émotion "${emotionKey}" est disponible.`
      });
      
      return playlist;
    }
    
    return null;
  }, [loadPlaylistForEmotion, playTrack, currentTrack, isPlaying, setOpenDrawer, toast]);
  
  // Get a description of how music can help with a specific emotion
  const getEmotionMusicDescription = useCallback((emotion: string): string => {
    const descriptions: Record<string, string> = {
      happy: "Amplifiez votre joie avec des mélodies qui résonnent avec votre énergie positive.",
      sad: "Des compositions apaisantes pour accompagner vos émotions et transformer la tristesse en réflexion.",
      calm: "Maintenez votre sérénité avec des sons qui stabilisent votre paix intérieure.",
      anxious: "Des rythmes doux pour apaiser l'anxiété et ramener l'esprit au moment présent.",
      energetic: "Des tempos dynamiques pour canaliser votre énergie et maintenir votre enthousiasme.",
      focused: "Des compositions minimalistes pour augmenter votre concentration et productivité.",
      stressed: "Des mélodies réconfortantes pour réduire le stress et retrouver l'équilibre.",
      default: "Une musique adaptée à votre état émotionnel pour vous accompagner dans ce moment."
    };
    
    return descriptions[emotion.toLowerCase()] || descriptions.default;
  }, []);
  
  return {
    activateMusicForEmotion,
    getEmotionMusicDescription
  };
}

export default useMusicEmotionIntegration;
