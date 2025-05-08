
import { useCallback } from 'react';
import { useMusic } from '@/contexts/MusicContext';
import { useToast } from '@/hooks/use-toast';
import type { EmotionResult } from '@/types';

// Mapping des émotions vers les types de musique
const EMOTION_TO_MUSIC_MAP: Record<string, string> = {
  happy: 'happy',
  excited: 'energetic',
  joyful: 'happy',
  sad: 'calm',
  anxious: 'calm',
  stressed: 'calm',
  angry: 'calm',
  calm: 'calm',
  relaxed: 'calm',
  neutral: 'neutral',
  focused: 'focused',
  default: 'neutral'
};

export function useMusicEmotionIntegration() {
  const { loadPlaylistForEmotion, playTrack, currentPlaylist, currentTrack, isPlaying } = useMusic();
  const { toast } = useToast();
  
  const activateMusicForEmotion = useCallback((emotionResult: EmotionResult) => {
    if (!emotionResult.emotion) return;
    
    const emotionKey = emotionResult.emotion.toLowerCase();
    const musicType = EMOTION_TO_MUSIC_MAP[emotionKey] || EMOTION_TO_MUSIC_MAP.default;
    
    const playlist = loadPlaylistForEmotion(musicType);
    
    if (playlist && playlist.tracks.length > 0) {
      // Si aucune musique n'est en cours, commencer à jouer
      if (!currentTrack || !isPlaying) {
        playTrack(playlist.tracks[0]);
      }
      
      // Notifier l'utilisateur
      toast({
        title: "Musique adaptée à votre émotion",
        description: `Playlist '${musicType}' disponible dans le lecteur de musique`
      });
    }
  }, [loadPlaylistForEmotion, playTrack, currentTrack, isPlaying, toast]);
  
  return {
    activateMusicForEmotion,
    EMOTION_TO_MUSIC_MAP
  };
}
