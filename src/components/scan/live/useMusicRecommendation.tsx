
import { useState, useCallback } from 'react';
import { useMusic } from '@/contexts/music';
import { MusicTrack, EmotionMusicParams } from '@/types/music';
import { EmotionResult } from '@/types/emotion';

// Mapping of emotions to music types
export const EMOTION_TO_MUSIC: Record<string, string> = {
  joy: 'upbeat',
  happy: 'upbeat',
  calm: 'ambient',
  relaxed: 'ambient',
  anxious: 'calming',
  stressed: 'calming',
  sad: 'gentle',
  melancholic: 'gentle',
  energetic: 'dance',
  excited: 'dance',
  neutral: 'focus',
};

export function useMusicRecommendation() {
  const [recommendedTracks, setRecommendedTracks] = useState<MusicTrack[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { loadPlaylistForEmotion, playTrack, playlists } = useMusic();
  
  const loadRecommendations = useCallback(async (emotion: string) => {
    setIsLoading(true);
    try {
      const musicType = EMOTION_TO_MUSIC[emotion.toLowerCase()] || 'focus';
      await loadPlaylistForEmotion({
        emotion: musicType
      });
      
      // Since we can't access the return value directly, let's check current playlists
      // or use a default playlist if available
      if (playlists && playlists.length > 0) {
        const matchingPlaylist = playlists.find(p => 
          p.emotion?.toLowerCase() === musicType.toLowerCase() ||
          p.mood?.toLowerCase() === musicType.toLowerCase()
        );
        
        if (matchingPlaylist?.tracks?.length) {
          setRecommendedTracks(matchingPlaylist.tracks);
        } else {
          setRecommendedTracks(playlists[0].tracks || []);
        }
      } else {
        setRecommendedTracks([]);
      }
    } catch (error) {
      console.error('Error loading music recommendations:', error);
      setRecommendedTracks([]);
    } finally {
      setIsLoading(false);
    }
  }, [loadPlaylistForEmotion, playlists]);
  
  const playRecommendedTrack = (track: MusicTrack) => {
    if (track) {
      playTrack(track);
    }
  };
  
  const playFirstRecommendation = () => {
    if (recommendedTracks.length > 0) {
      playRecommendedTrack(recommendedTracks[0]);
      return true;
    }
    return false;
  };
  
  const handlePlayMusic = (emotion: string) => {
    const musicType = EMOTION_TO_MUSIC[emotion.toLowerCase()] || 'focus';
    loadPlaylistForEmotion({
      emotion: musicType
    });
    return playFirstRecommendation();
  };
  
  return {
    recommendedTracks,
    isLoading,
    playRecommendedTrack,
    playFirstRecommendation,
    handlePlayMusic,
    loadRecommendations,
    EMOTION_TO_MUSIC
  };
}

export default useMusicRecommendation;
