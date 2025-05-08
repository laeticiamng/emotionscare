
import { useCallback } from 'react';
import { useMusic } from '@/contexts/MusicContext';
import { useToast } from '@/hooks/use-toast';
import type { EmotionResult } from '@/types';
import { mapEmotionToMusicType } from '@/services/music/emotion-music-mapping';

export function useMusicEmotionIntegration() {
  const { loadPlaylistForEmotion, playTrack, currentPlaylist, currentTrack, isPlaying } = useMusic();
  const { toast } = useToast();
  
  const activateMusicForEmotion = useCallback((emotionResult: EmotionResult) => {
    if (!emotionResult.emotion) return;
    
    const emotionKey = emotionResult.emotion.toLowerCase();
    const musicType = mapEmotionToMusicType(emotionKey);
    
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
    activateMusicForEmotion
  };
}
