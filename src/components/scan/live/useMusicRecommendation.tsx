
import { useState, useEffect } from 'react';
import { useMusic } from '@/contexts/music';
import { EmotionResult, MusicTrack } from '@/types';

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

export function useMusicRecommendation(emotionResult?: EmotionResult) {
  const [recommendedTracks, setRecommendedTracks] = useState<MusicTrack[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { loadPlaylistForEmotion, playTrack } = useMusic();
  
  useEffect(() => {
    if (emotionResult?.emotion) {
      loadRecommendations(emotionResult.emotion);
    }
  }, [emotionResult]);
  
  const loadRecommendations = async (emotion: string) => {
    setIsLoading(true);
    try {
      const musicType = EMOTION_TO_MUSIC[emotion.toLowerCase()] || 'focus';
      const playlist = await loadPlaylistForEmotion?.(musicType);
      if (playlist?.tracks) {
        // Make sure all tracks have required properties
        const tracksWithRequiredProps = playlist.tracks.map(track => ({
          ...track,
          url: track.url || '',
          duration: track.duration || 0
        }));
        setRecommendedTracks(tracksWithRequiredProps);
      } else {
        setRecommendedTracks([]);
      }
    } catch (error) {
      console.error('Error loading music recommendations:', error);
      setRecommendedTracks([]);
    } finally {
      setIsLoading(false);
    }
  };
  
  const playRecommendedTrack = (track: MusicTrack) => {
    if (track) {
      playTrack({
        ...track,
        url: track.url || '',
        duration: track.duration || 0
      });
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
    return playFirstRecommendation();
  };
  
  return {
    recommendedTracks,
    isLoading,
    playRecommendedTrack,
    playFirstRecommendation,
    handlePlayMusic,
    EMOTION_TO_MUSIC
  };
}
