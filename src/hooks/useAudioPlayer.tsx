
import { useState, useCallback, useRef, useEffect } from 'react';
import { Track } from '@/types/music';
import { useAudioEvents } from './audio/useAudioEvents';
import { formatTime, handlePlayError, getTrackAudioUrl } from './audio/audioPlayerUtils';

export interface UseAudioPlayerReturn {
  currentTrack: Track | null;
  isPlaying: boolean;
  volume: number;
  repeat: boolean;
  shuffle: boolean;
  progress: number;      // seconds écoulés
  duration: number;      // durée totale en secondes
  loading: boolean;
  error: Error | null;
  playTrack: (track: Track) => void;
  pauseTrack: () => void;
  resumeTrack: () => void;
  setVolume: (v: number) => void;
  toggleRepeat: () => void;
  toggleShuffle: () => void;
  seekTo: (seconds: number) => void;
  nextTrack: () => void;
  previousTrack: () => void;
  setCurrentTrack: (track: Track | null) => void;
  
  // Additional properties needed for MusicContext
  currentTime: number;
  loadingTrack: boolean;
  formatTime: (time: number) => string;
  handleProgressClick: (e: React.MouseEvent<HTMLDivElement>) => void;
  handleVolumeChange: (values: number[]) => void;
}

/**
 * Centralized hook for managing audio playback throughout the application
 */
export function useAudioPlayer(): UseAudioPlayerReturn {
  // State management
  const [currentTrack, setCurrentTrack] = useState<Track | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolumeState] = useState(0.7); // 0 to 1
  const [repeat, setRepeat] = useState(false);
  const [shuffle, setShuffle] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [loadingTrack, setLoadingTrack] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  
  // Audio element ref
  const audioRef = useRef<HTMLAudioElement | null>(
    typeof window !== 'undefined' ? new Audio() : null
  );
  
  // Event handlers
  const handleTimeUpdate = useCallback((time: number) => {
    setProgress(time);
  }, []);
  
  const handleDurationChange = useCallback((newDuration: number) => {
    setDuration(newDuration);
    setLoadingTrack(false);
  }, []);
  
  const handleEnded = useCallback(() => {
    setIsPlaying(false);
  }, []);
  
  const handleError = useCallback((error: Error) => {
    setError(error);
    setLoadingTrack(false);
    setIsPlaying(false);
  }, []);
  
  const handlePlay = useCallback(() => {
    setIsPlaying(true);
  }, []);
  
  const handlePause = useCallback(() => {
    setIsPlaying(false);
  }, []);
  
  const handleWaiting = useCallback(() => {
    setLoadingTrack(true);
  }, []);
  
  const handleCanPlay = useCallback(() => {
    setLoadingTrack(false);
  }, []);
  
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

  // Public API functions
  const playTrack = useCallback((track: Track) => {
    setCurrentTrack(track);
    setLoadingTrack(true);
    setError(null);
    setIsPlaying(true);
  }, []);

  const pauseTrack = useCallback(() => {
    setIsPlaying(false);
  }, []);

  const resumeTrack = useCallback(() => {
    if (currentTrack) {
      setIsPlaying(true);
    }
  }, [currentTrack]);

  const setVolume = useCallback((value: number) => {
    const clampedValue = Math.max(0, Math.min(1, value));
    setVolumeState(clampedValue);
    if (audioRef.current) {
      audioRef.current.volume = clampedValue;
    }
  }, []);

  const toggleRepeat = useCallback(() => {
    setRepeat(prev => !prev);
  }, []);

  const toggleShuffle = useCallback(() => {
    setShuffle(prev => !prev);
  }, []);

  const seekTo = useCallback((seconds: number) => {
    if (audioRef.current) {
      audioRef.current.currentTime = seconds;
      setProgress(seconds);
    }
  }, []);

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
    toggleRepeat,
    toggleShuffle,
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
