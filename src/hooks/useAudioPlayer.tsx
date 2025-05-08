
import { useCallback, useRef, useEffect } from 'react';
import { MusicTrack } from '@/types/music';
import { useAudioEvents } from './audio/useAudioEvents';
import { formatTime, handlePlayError, getTrackAudioUrl } from './audio/audioPlayerUtils';
import { useAudioPlayerState } from './audio/useAudioPlayerState';
import { UseAudioPlayerReturn } from '@/types/audio-player';

/**
 * Centralized hook for managing audio playback throughout the application
 */
export function useAudioPlayer(): UseAudioPlayerReturn {
  // Use the separate state management hook
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
    setCurrentTrack,
    setIsPlaying,
    setVolume: setStateVolume,
    setProgress,
    setDuration,
    setLoadingTrack,
    setError
  } = useAudioPlayerState();
  
  // Audio element ref
  const audioRef = useRef<HTMLAudioElement | null>(
    typeof window !== 'undefined' ? new Audio() : null
  );
  
  // Event handlers
  const handleTimeUpdate = useCallback((time: number) => {
    setProgress(time);
  }, [setProgress]);
  
  const handleDurationChange = useCallback((newDuration: number) => {
    setDuration(newDuration);
    setLoadingTrack(false);
  }, [setDuration, setLoadingTrack]);
  
  const handleEnded = useCallback(() => {
    setIsPlaying(false);
  }, [setIsPlaying]);
  
  const handleError = useCallback((error: Error) => {
    setError(error);
    setLoadingTrack(false);
    setIsPlaying(false);
  }, [setError, setLoadingTrack, setIsPlaying]);
  
  const handlePlay = useCallback(() => {
    setIsPlaying(true);
  }, [setIsPlaying]);
  
  const handlePause = useCallback(() => {
    setIsPlaying(false);
  }, [setIsPlaying]);
  
  const handleWaiting = useCallback(() => {
    setLoadingTrack(true);
  }, [setLoadingTrack]);
  
  const handleCanPlay = useCallback(() => {
    setLoadingTrack(false);
  }, [setLoadingTrack]);
  
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
  }, [currentTrack, isPlaying, handleError, setLoadingTrack, setError]);

  // Toggle play/pause when isPlaying changes
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio || !currentTrack) return;

    if (isPlaying) {
      audio.play().catch(error => handleError(error));
    } else {
      audio.pause();
    }
  }, [isPlaying, currentTrack, handleError]);

  // Public API functions
  const playTrack = useCallback((track: MusicTrack) => {
    setCurrentTrack(track);
    setLoadingTrack(true);
    setError(null);
    setIsPlaying(true);
  }, [setCurrentTrack, setLoadingTrack, setError, setIsPlaying]);

  const pauseTrack = useCallback(() => {
    setIsPlaying(false);
  }, [setIsPlaying]);

  const resumeTrack = useCallback(() => {
    if (currentTrack) {
      setIsPlaying(true);
    }
  }, [currentTrack, setIsPlaying]);

  const setVolume = useCallback((value: number) => {
    const clampedValue = Math.max(0, Math.min(1, value));
    setStateVolume(clampedValue);
    if (audioRef.current) {
      audioRef.current.volume = clampedValue;
    }
  }, [setStateVolume]);

  const seekTo = useCallback((seconds: number) => {
    if (audioRef.current) {
      audioRef.current.currentTime = seconds;
      setProgress(seconds);
    }
  }, [setProgress]);

  const nextTrack = useCallback(() => {
    console.log("Next track requested");
  }, []);

  const previousTrack = useCallback(() => {
    console.log("Previous track requested");
  }, []);
  
  const handleProgressClick = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!audioRef.current || !duration) return;
    
    const rect = e.currentTarget.getBoundingClientRect();
    const offsetX = e.clientX - rect.left;
    const percentage = offsetX / rect.width;
    const newTime = percentage * duration;
    
    seekTo(newTime);
  }, [duration, seekTo]);
  
  const handleVolumeChange = useCallback((values: number[]) => {
    if (values.length > 0) {
      setVolume(values[0] / 100);
    }
  }, [setVolume]);

  return {
    currentTrack,
    isPlaying,
    volume,
    repeat,
    shuffle,
    progress,
    duration,
    loading: loadingTrack,
    error,
    playTrack,
    pauseTrack,
    resumeTrack,
    setVolume,
    toggleRepeat: useAudioPlayerState().toggleRepeat,
    toggleShuffle: useAudioPlayerState().toggleShuffle,
    seekTo,
    nextTrack,
    previousTrack,
    setCurrentTrack,
    // Additional properties
    currentTime: progress,
    loadingTrack,
    formatTime,
    handleProgressClick,
    handleVolumeChange
  };
}

export default useAudioPlayer;
