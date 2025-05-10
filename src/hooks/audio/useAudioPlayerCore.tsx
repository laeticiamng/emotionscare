
import { useRef, useEffect } from 'react';
import { useAudioEvents } from './useAudioEvents';
import { useAudioPlayerState } from './useAudioPlayerState';
import { useTrackOperations } from './useTrackOperations';
import { usePlayerControls } from './usePlayerControls';
import { formatTime, getTrackAudioUrl } from './audioPlayerUtils';

/**
 * Core implementation of the audio player functionality
 */
export function useAudioPlayerCore() {
  // Get state from the state hook
  const {
    currentTrack,
    isPlaying,
    volume,
    repeat,
    shuffle,
    progress,
    duration,
    loadingTrack,
    error,
    setError,
    setLoadingTrack,
    setProgress,
    setDuration,
    setIsPlaying,
    toggleRepeat,
    toggleShuffle,
    setCurrentTrack
  } = useAudioPlayerState();
  
  // Create audio element
  const audioRef = useRef<HTMLAudioElement | null>(
    typeof window !== 'undefined' ? new Audio() : null
  );
  
  // Get track operation functions
  const {
    playTrack,
    pauseTrack,
    resumeTrack,
    nextTrack,
    previousTrack
  } = useTrackOperations();
  
  // Get player control functions
  const {
    seekTo,
    setVolume,
    handleProgressClick,
    handleVolumeChange
  } = usePlayerControls(audioRef);
  
  // Event handlers
  const handleTimeUpdate = (time: number) => {
    setProgress(time);
  };
  
  const handleDurationChange = (newDuration: number) => {
    setDuration(newDuration);
    setLoadingTrack(false);
  };
  
  const handleEnded = () => {
    setIsPlaying(false);
  };
  
  const handleError = (error: Error) => {
    setError(error.message);
    setLoadingTrack(false);
    setIsPlaying(false);
  };
  
  const handlePlay = () => {
    setIsPlaying(true);
  };
  
  const handlePause = () => {
    setIsPlaying(false);
  };
  
  const handleWaiting = () => {
    setLoadingTrack(true);
  };
  
  const handleCanPlay = () => {
    setLoadingTrack(false);
  };
  
  // Register audio events
  useAudioEvents({
    audioRef,
    onTimeUpdate: handleTimeUpdate,
    onDurationChange: handleDurationChange,
    onEnded: handleEnded,
    onError: handleError,
    onPlay: handlePlay,
    onPause: handlePause,
    onWaiting: handleWaiting,
    onCanPlay: handleCanPlay,
    volume,
    repeat
  });
  
  // Update audio source when current track changes
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio || !currentTrack) return;
    
    const sourceUrl = getTrackAudioUrl(currentTrack);
    if (!sourceUrl) {
      handleError(new Error("URL audio manquante pour la piste"));
      return;
    }

    setLoadingTrack(true);
    setError(null);
    audio.src = sourceUrl;
    
    if (isPlaying) {
      audio.play().catch(error => handleError(error));
    }
  }, [currentTrack, isPlaying]);

  // Toggle play/pause when isPlaying changes
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio || !currentTrack) return;

    if (isPlaying) {
      audio.play().catch(error => handleError(error));
    } else {
      audio.pause();
    }
  }, [isPlaying, currentTrack]);

  // Combine and return all functions and state
  return {
    // State
    currentTrack,
    isPlaying,
    volume,
    repeat,
    shuffle,
    progress,
    duration,
    loading: loadingTrack,
    error,
    currentTime: progress,
    loadingTrack,
    
    // Track operations
    playTrack,
    pauseTrack,
    resumeTrack,
    nextTrack,
    previousTrack,
    
    // Player controls
    seekTo,
    setVolume,
    handleProgressClick,
    handleVolumeChange,
    
    // Utilities
    formatTime,
    toggleRepeat,
    toggleShuffle,
    setCurrentTrack
  };
}

export default useAudioPlayerCore;
