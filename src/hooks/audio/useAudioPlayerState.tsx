
import { useState, useCallback } from 'react';
import { Track } from '@/types/music';

export interface AudioPlayerState {
  currentTrack: Track | null;
  isPlaying: boolean;
  volume: number;
  repeat: boolean;
  shuffle: boolean;
  progress: number;
  duration: number;
  loadingTrack: boolean;
  error: Error | null;
}

export interface UseAudioPlayerStateReturn extends AudioPlayerState {
  setCurrentTrack: (track: Track | null) => void;
  setIsPlaying: (isPlaying: boolean) => void;
  setVolume: (volume: number) => void;
  setRepeat: (repeat: boolean) => void;
  setShuffle: (shuffle: boolean) => void;
  setProgress: (progress: number) => void;
  setDuration: (duration: number) => void;
  setLoadingTrack: (loading: boolean) => void;
  setError: (error: Error | null) => void;
}

/**
 * Hook to manage the state of the audio player
 */
export function useAudioPlayerState(): UseAudioPlayerStateReturn {
  const [currentTrack, setCurrentTrack] = useState<Track | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolumeState] = useState(0.7); // 0 to 1
  const [repeat, setRepeat] = useState(false);
  const [shuffle, setShuffle] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [loadingTrack, setLoadingTrack] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  
  // Wrapper for setVolume to ensure volume is within bounds
  const setVolume = useCallback((value: number) => {
    const clampedValue = Math.max(0, Math.min(1, value));
    setVolumeState(clampedValue);
  }, []);

  return {
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
    setVolume,
    setRepeat,
    setShuffle,
    setProgress,
    setDuration,
    setLoadingTrack,
    setError
  };
}

export default useAudioPlayerState;
