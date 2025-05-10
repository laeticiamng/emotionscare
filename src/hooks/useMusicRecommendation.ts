
import { useState, useEffect, useCallback } from 'react';
import { MusicPlaylist, MusicTrack } from '@/types/music';
import { useMusic } from '@/contexts/MusicContext';

interface UseMusicRecommendationProps {
  emotion?: string;
}

const useMusicRecommendation = ({ emotion }: UseMusicRecommendationProps = {}) => {
  const { 
    currentPlaylist,
    currentTrack,
    isPlaying,
    loadPlaylistForEmotion,
    playTrack,
    pauseTrack,
    setOpenDrawer
  } = useMusic();
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchPlaylist = useCallback(async (musicType: string) => {
    setLoading(true);
    setError(null);
    
    try {
      // Use the existing context function to load playlist
      const playlist = loadPlaylistForEmotion(musicType);
      
      if (!playlist) {
        setError(`No playlist found for emotion: ${musicType}`);
      }
    } catch (err) {
      setError(`Failed to fetch playlist for emotion: ${musicType}`);
    } finally {
      setLoading(false);
    }
  }, [loadPlaylistForEmotion]);

  const togglePlay = () => {
    if (isPlaying) {
      pauseTrack();
    } else if (currentTrack) {
      playTrack(currentTrack);
    }
  };

  const goToNextTrack = () => {
    if (!currentPlaylist || !currentTrack) return;

    const currentIndex = currentPlaylist.tracks.findIndex(track => track.id === currentTrack.id);
    const nextIndex = (currentIndex + 1) % currentPlaylist.tracks.length;
    const nextTrack = {
      ...currentPlaylist.tracks[nextIndex],
      duration: currentPlaylist.tracks[nextIndex].duration || 0,
      url: currentPlaylist.tracks[nextIndex].url || ''
    };
    playTrack(nextTrack);
  };

  const goToPreviousTrack = () => {
    if (!currentPlaylist || !currentTrack) return;

    const currentIndex = currentPlaylist.tracks.findIndex(track => track.id === currentTrack.id);
    const previousIndex = (currentIndex - 1 + currentPlaylist.tracks.length) % currentPlaylist.tracks.length;
    const prevTrack = {
      ...currentPlaylist.tracks[previousIndex],
      duration: currentPlaylist.tracks[previousIndex].duration || 0,
      url: currentPlaylist.tracks[previousIndex].url || ''
    };
    playTrack(prevTrack);
  };

  useEffect(() => {
    if (emotion) {
      fetchPlaylist(emotion);
    }
  }, [emotion, fetchPlaylist]);

  return {
    currentPlaylist,
    currentTrack,
    isPlaying,
    loading,
    error,
    fetchPlaylist,
    playTrack,
    togglePlay,
    goToNextTrack,
    goToPreviousTrack,
  };
};

export default useMusicRecommendation;
