
import { useState, useCallback } from 'react';
import { MusicTrack } from '@/types/music';
import { UseAudioPlayerStateReturn } from '@/types/audio-player';

/**
 * Hook to manage the state of the audio player
 */
export function useAudioPlayerState(): UseAudioPlayerStateReturn {
  const [currentTrack, setCurrentTrack] = useState<MusicTrack | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolumeState] = useState(0.7); // 0 to 1
  const [repeat, setRepeat] = useState(false);
  const [shuffle, setShuffle] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [loadingTrack, setLoadingTrack] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  
  // Wrapper for setVolume to ensure volume is within bounds
  const setVolume = useCallback((value: number) => {
    const clampedValue = Math.max(0, Math.min(1, value));
    setVolumeState(clampedValue);
  }, []);
  
  // Toggle repeat mode
  const toggleRepeat = useCallback(() => {
    setRepeat(prevRepeat => !prevRepeat);
  }, []);
  
  // Toggle shuffle mode
  const toggleShuffle = useCallback(() => {
    setShuffle(prevShuffle => !prevShuffle);
  }, []);

  return {
    currentTrack,
    isPlaying,
    volume,
    repeat,
    shuffle,
    progress,
    currentTime,
    duration,
    loadingTrack,
    error,
    setCurrentTrack,
    setIsPlaying,
    setVolume,
    setRepeat,
    setShuffle,
    setProgress,
    setCurrentTime,
    setDuration,
    setLoadingTrack,
    setError,
    toggleRepeat,
    toggleShuffle
  };
}

export default useAudioPlayerState;
