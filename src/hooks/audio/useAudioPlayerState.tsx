
import { useState, useRef, useCallback } from 'react';
import { MusicTrack } from '@/types';
import { UseAudioPlayerStateReturn } from '@/types/audio-player';

/**
 * Hook to manage the state of the audio player
 */
export function useAudioPlayerState(): UseAudioPlayerStateReturn {
  const [currentTrack, setCurrentTrack] = useState<MusicTrack | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.7); // 0 to 1
  const [progress, setProgress] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [loadingTrack, setLoadingTrack] = useState(false);
  const [error, setErrorState] = useState<Error | null>(null);
  const [isMuted, setIsMuted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);
  
  // Wrapper for setError to handle Error objects
  const setError = useCallback((err: Error | null) => {
    setErrorState(err);
  }, []);

  return {
    currentTrack,
    isPlaying,
    volume,
    progress,
    currentTime,
    duration,
    loadingTrack,
    error,
    isMuted,
    isLoading,
    audioRef,
    setCurrentTrack,
    setIsPlaying,
    setVolume,
    setProgress,
    setCurrentTime,
    setDuration,
    setLoadingTrack,
    setError,
    setIsMuted,
    setIsLoading
  };
}

export default useAudioPlayerState;
