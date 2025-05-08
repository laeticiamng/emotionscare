
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
      // If no music is playing, start playing
      if (!currentTrack || !isPlaying) {
        playTrack(playlist.tracks[0]);
      }
      
      // Notify the user
      toast({
        title: "Music adapted to your emotion",
        description: `Playlist '${musicType}' available in the music player`
      });
    }
  }, [loadPlaylistForEmotion, playTrack, currentTrack, isPlaying, toast]);
  
  return {
    activateMusicForEmotion
  };
}
