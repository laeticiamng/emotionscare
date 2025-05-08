
import { useCallback } from 'react';
import { MusicTrack } from '@/types/music';
import { handlePlayError, getTrackAudioUrl } from './audioPlayerUtils';
import { useAudioPlayerState } from './useAudioPlayerState';

/**
 * Hook that provides track operation functions (play, pause, next, previous)
 */
export function useTrackOperations() {
  const {
    currentTrack,
    setCurrentTrack,
    setIsPlaying,
    setLoadingTrack,
    setError
  } = useAudioPlayerState();

  /**
   * Start playing a new track
   */
  const playTrack = useCallback((track: MusicTrack) => {
    setCurrentTrack(track);
    setLoadingTrack(true);
    setError(null);
    setIsPlaying(true);
  }, [setCurrentTrack, setLoadingTrack, setError, setIsPlaying]);

  /**
   * Pause the currently playing track
   */
  const pauseTrack = useCallback(() => {
    setIsPlaying(false);
  }, [setIsPlaying]);

  /**
   * Resume playback of the current track if available
   */
  const resumeTrack = useCallback(() => {
    if (currentTrack) {
      setIsPlaying(true);
    }
  }, [currentTrack, setIsPlaying]);

  /**
   * Skip to the next track (placeholder implementation)
   */
  const nextTrack = useCallback(() => {
    console.log("Next track requested");
  }, []);

  /**
   * Go back to the previous track (placeholder implementation)
   */
  const previousTrack = useCallback(() => {
    console.log("Previous track requested");
  }, []);

  return {
    currentTrack,
    playTrack,
    pauseTrack,
    resumeTrack,
    nextTrack,
    previousTrack
  };
}

export default useTrackOperations;
