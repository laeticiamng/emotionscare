
import { useCallback, RefObject } from 'react';
import { useAudioPlayerState } from './useAudioPlayerState';

/**
 * Hook that provides playback control functions (seek, volume)
 */
export function usePlayerControls(audioRef: RefObject<HTMLAudioElement | null>) {
  const {
    duration,
    setProgress,
    setStateVolume,
  } = useAudioPlayerState();

  /**
   * Seek to a specific time in the current track
   */
  const seekTo = useCallback((seconds: number) => {
    if (audioRef.current) {
      audioRef.current.currentTime = seconds;
      setProgress(seconds);
    }
  }, [audioRef, setProgress]);

  /**
   * Update the player volume
   */
  const setVolume = useCallback((value: number) => {
    const clampedValue = Math.max(0, Math.min(1, value));
    setStateVolume(clampedValue);
    if (audioRef.current) {
      audioRef.current.volume = clampedValue;
    }
  }, [setStateVolume, audioRef]);

  /**
   * Handle progress bar clicks
   */
  const handleProgressClick = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!audioRef.current || !duration) return;
    
    const rect = e.currentTarget.getBoundingClientRect();
    const offsetX = e.clientX - rect.left;
    const percentage = offsetX / rect.width;
    const newTime = percentage * duration;
    
    seekTo(newTime);
  }, [duration, seekTo, audioRef]);
  
  /**
   * Handle volume slider changes
   */
  const handleVolumeChange = useCallback((values: number[]) => {
    if (values.length > 0) {
      setVolume(values[0] / 100);
    }
  }, [setVolume]);

  return {
    seekTo,
    setVolume,
    handleProgressClick,
    handleVolumeChange
  };
}

export default usePlayerControls;
