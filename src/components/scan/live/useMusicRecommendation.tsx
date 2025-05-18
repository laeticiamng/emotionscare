
import { useState, useCallback } from 'react';
import { useMusic } from '@/contexts/MusicContext';
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
  const music = useMusic();
  
  const loadRecommendations = useCallback(async (emotion: string) => {
    setIsLoading(true);
    try {
      const musicType = EMOTION_TO_MUSIC[emotion.toLowerCase()] || 'focus';
      const result = await music.loadPlaylistForEmotion({
        emotion: musicType
      });
      
      if (result && result.tracks && result.tracks.length > 0) {
        // Set recommended tracks from the playlist
        setRecommendedTracks(result.tracks);
      } else {
        // Try to get tracks by mood directly if available
        const moodTracks = music.findTracksByMood ? music.findTracksByMood(musicType) : [];
        setRecommendedTracks(moodTracks);
      }
    } catch (error) {
      console.error('Error loading music recommendations:', error);
      setRecommendedTracks([]);
    } finally {
      setIsLoading(false);
    }
  }, [music]);
  
  const playRecommendedTrack = (track: MusicTrack) => {
    if (track) {
      music.playTrack(track);
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
    music.loadPlaylistForEmotion({
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
