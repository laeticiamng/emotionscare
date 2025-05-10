
import { useCallback } from 'react';
import { useMusic } from '@/contexts/MusicContext';
import { useToast } from '@/hooks/use-toast';

// Define a mapping function since the import might not be available
const mapEmotionToMusicType = (emotion: string): string => {
  const mapping: Record<string, string> = {
    'happy': 'upbeat',
    'joy': 'upbeat',
    'sad': 'calming',
    'calm': 'ambient',
    'anxious': 'ambient',
    'angry': 'calming',
    'stressed': 'ambient',
    'energetic': 'dance',
    'bored': 'dance',
    'focused': 'focus',
    'tired': 'ambient',
    'fearful': 'calming',
    'neutral': 'gentle'
  };
  return mapping[emotion.toLowerCase()] || 'gentle';
};

// Define the constant
export const EMOTION_TO_MUSIC_MAP: Record<string, string> = {
  'happy': 'upbeat',
  'joy': 'upbeat',
  'sad': 'calming',
  'calm': 'ambient',
  'anxious': 'ambient',
  'angry': 'calming',
  'stressed': 'ambient',
  'energetic': 'dance',
  'bored': 'dance',
  'focused': 'focus',
  'tired': 'ambient',
  'fearful': 'calming',
  'neutral': 'gentle'
};

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
  const activateMusicForEmotion = useCallback(async (emotionResult: EmotionResult) => {
    if (!emotionResult.emotion) return;
    
    const emotionKey = emotionResult.emotion.toLowerCase();
    const musicType = mapEmotionToMusicType(emotionKey);
    
    try {
      const playlist = await loadPlaylistForEmotion(musicType);
      
      if (playlist && playlist.tracks && playlist.tracks.length > 0) {
        // If no music is playing, start playing
        if (!currentTrack || !isPlaying) {
          const track = {
            ...playlist.tracks[0],
            duration: playlist.tracks[0].duration || 0,
            url: playlist.tracks[0].url || ''
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
    } catch (error) {
      console.error('Error activating music for emotion:', error);
      toast({
        title: "Erreur",
        description: "Impossible de charger la musique correspondante à votre émotion.",
        variant: "destructive"
      });
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
    getEmotionMusicDescription,
    EMOTION_TO_MUSIC_MAP
  };
}

export default useMusicEmotionIntegration;
