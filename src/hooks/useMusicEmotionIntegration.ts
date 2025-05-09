
import { useCallback } from 'react';
import { useMusic } from '@/contexts/MusicContext';
import { useToast } from '@/hooks/use-toast';
import type { EmotionResult } from '@/types';
import { mapEmotionToMusicType } from '@/services/music/emotion-music-mapping';
import { EmotionToMusicMap } from '@/types/audio-player';

export function useMusicEmotionIntegration() {
  const { loadPlaylistForEmotion, playTrack, currentPlaylist, currentTrack, isPlaying } = useMusic();
  const { toast } = useToast();
  
  // Define emotion to music mapping
  const EMOTION_TO_MUSIC_MAP: EmotionToMusicMap = {
    'happy': 'happy',
    'sad': 'calm',
    'angry': 'calm',
    'anxious': 'calm',
    'neutral': 'neutral',
    'calm': 'calm',
    'stressed': 'calm',
    'energetic': 'energetic',
    'focused': 'focused',
    'default': 'neutral'
  };
  
  const activateMusicForEmotion = useCallback((emotionResult: EmotionResult) => {
    if (!emotionResult.emotion) return;
    
    const emotionKey = emotionResult.emotion.toLowerCase();
    const musicType = mapEmotionToMusicType(emotionKey);
    
    const playlist = loadPlaylistForEmotion(musicType);
    
    if (playlist && playlist.tracks.length > 0) {
      // If no music is playing, start playing, ensuring required properties are provided
      if (!currentTrack || !isPlaying) {
        const track = {
          ...playlist.tracks[0],
          duration: playlist.tracks[0].duration || 0,
          url: playlist.tracks[0].url || playlist.tracks[0].audioUrl || ''
        };
        playTrack(track);
      }
      
      // Notify the user
      toast({
        title: "Music adapted to your emotion",
        description: `Playlist '${musicType}' available in the music player`
      });
    }
  }, [loadPlaylistForEmotion, playTrack, currentTrack, isPlaying, toast]);
  
  return {
    activateMusicForEmotion,
    EMOTION_TO_MUSIC_MAP
  };
}
