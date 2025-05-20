
import { useState, useCallback } from 'react';
import { useMusic } from '@/hooks/useMusic';
import { MusicTrack, EmotionMusicParams } from '@/types/music';
import { findTracksByMood } from '@/utils/musicCompatibility';

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
      const params: EmotionMusicParams = {
        emotion: musicType
      };
      
      if (music.loadPlaylistForEmotion) {
        const result = await music.loadPlaylistForEmotion(params);
        
        if (result && result.tracks && result.tracks.length > 0) {
          // Set recommended tracks from the playlist
          setRecommendedTracks(result.tracks);
        } else {
          // If no tracks found, create empty array
          setRecommendedTracks([]);
        }
      }
    } catch (error) {
      console.error('Error loading music recommendations:', error);
      setRecommendedTracks([]);
    } finally {
      setIsLoading(false);
    }
  }, [music]);
  
  const playRecommendedTrack = useCallback((track: MusicTrack) => {
    if (track && music.playTrack) {
      music.playTrack(track);
    }
  }, [music]);
  
  const playFirstRecommendation = useCallback(() => {
    if (recommendedTracks.length > 0) {
      playRecommendedTrack(recommendedTracks[0]);
      return true;
    }
    return false;
  }, [recommendedTracks, playRecommendedTrack]);
  
  const handlePlayMusic = useCallback(async (emotion: string) => {
    const musicType = EMOTION_TO_MUSIC[emotion.toLowerCase()] || 'focus';
    const params: EmotionMusicParams = {
      emotion: musicType
    };
    
    if (music.loadPlaylistForEmotion) {
      const playlist = await music.loadPlaylistForEmotion(params);
      
      if (playlist && playlist.tracks.length > 0 && music.playTrack) {
        music.playTrack(playlist.tracks[0]);
        return true;
      }
    }
    return false;
  }, [music]);
  
  // Find tracks by mood function
  const findTracksByMoodWrapper = useCallback((mood: string) => {
    if (music.currentPlaylist && music.currentPlaylist.tracks) {
      return findTracksByMood(music.currentPlaylist.tracks, mood);
    }
    return [] as MusicTrack[];
  }, [music.currentPlaylist]);
  
  // Helper function to ensure value is an array
  const ensureArray = <T,>(value: T | T[] | undefined | null): T[] => {
    if (Array.isArray(value)) return value;
    if (value === undefined || value === null) return [];
    return [value];
  };
  
  return {
    recommendedTracks,
    isLoading,
    playRecommendedTrack,
    playFirstRecommendation,
    handlePlayMusic,
    loadRecommendations,
    findTracksByMood: findTracksByMoodWrapper,
    ensureArray,
    EMOTION_TO_MUSIC
  };
}

export default useMusicRecommendation;
