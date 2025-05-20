
import { useState, useEffect } from 'react';
import { useMusicContext } from '@/contexts/MusicContext';
import { MusicPlaylist, EmotionMusicParams } from '@/types/music';
import { findTracksByMood } from '@/utils/musicCompatibility';

/**
 * Hook to get music recommendations based on emotions
 */
export const useMusicRecommendation = (defaultEmotion?: string) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [recommendation, setRecommendation] = useState<MusicPlaylist | null>(null);
  const musicContext = useMusicContext();

  /**
   * Get a recommendation based on an emotion
   */
  const getRecommendation = async (emotion: string | EmotionMusicParams): Promise<MusicPlaylist | null> => {
    setIsLoading(true);
    setError(null);
    
    try {
      let params: EmotionMusicParams;
      
      // Handle string or emotion params object
      if (typeof emotion === 'string') {
        params = { emotion };
      } else {
        params = emotion;
      }
      
      let playlist: MusicPlaylist | null = null;
      
      // Try to use music context if available
      if (musicContext.loadPlaylistForEmotion) {
        playlist = await musicContext.loadPlaylistForEmotion(params);
      } else {
        // Fallback to local logic
        if (!musicContext.playlists || musicContext.playlists.length === 0) {
          throw new Error("No playlists available");
        }
        
        // Try to find a playlist directly matching the emotion
        playlist = musicContext.playlists.find(p => 
          p.emotion?.toLowerCase() === params.emotion.toLowerCase() || 
          p.mood?.toLowerCase() === params.emotion.toLowerCase()
        ) || null;
        
        // If no direct match, try to generate a playlist from matching tracks
        if (!playlist) {
          const allTracks = musicContext.playlists.flatMap(p => p.tracks);
          const matchingTracks = findTracksByMood(allTracks, params.emotion);
          
          if (matchingTracks.length > 0) {
            playlist = {
              id: `generated-${params.emotion}`,
              name: `${params.emotion.charAt(0).toUpperCase() + params.emotion.slice(1)} Mix`,
              title: `${params.emotion.charAt(0).toUpperCase() + params.emotion.slice(1)} Mix`,
              tracks: matchingTracks,
              emotion: params.emotion,
              mood: params.emotion
            };
          }
        }
      }
      
      setRecommendation(playlist);
      return playlist;
      
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to get music recommendation";
      setError(errorMessage);
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  // Load default recommendation if provided
  useEffect(() => {
    if (defaultEmotion) {
      getRecommendation(defaultEmotion);
    }
  }, [defaultEmotion]);

  return {
    recommendation,
    isLoading,
    error,
    getRecommendation,
    playRecommendation: () => {
      if (recommendation && musicContext.playPlaylist) {
        musicContext.playPlaylist(recommendation);
      }
    }
  };
};

export default useMusicRecommendation;
