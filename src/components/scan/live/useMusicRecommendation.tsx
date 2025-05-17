
import { useState, useCallback } from 'react';
import { useMusic } from '@/contexts';
import { MusicTrack } from '@/types';
import { EmotionResult } from '@/types';

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
  const { loadPlaylistForEmotion, playTrack } = useMusic();
  
  const loadRecommendations = useCallback(async (emotion: string) => {
    setIsLoading(true);
    try {
      const musicType = EMOTION_TO_MUSIC[emotion.toLowerCase()] || 'focus';
      const playlist = await loadPlaylistForEmotion({
        emotion: musicType
      });
      
      if (playlist && playlist.tracks) {
        // Make sure all tracks have required properties
        setRecommendedTracks(playlist.tracks);
      } else {
        setRecommendedTracks([]);
      }
    } catch (error) {
      console.error('Error loading music recommendations:', error);
      setRecommendedTracks([]);
    } finally {
      setIsLoading(false);
    }
  }, [loadPlaylistForEmotion]);
  
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
