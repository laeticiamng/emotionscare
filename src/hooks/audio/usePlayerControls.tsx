// @ts-nocheck

import { useCallback, RefObject } from 'react';
import { UseAudioPlayerStateReturn } from '@/types/audio-player';

/**
 * Hook that provides playback control functions (seek, volume)
 */
export function usePlayerControls(audioRef: RefObject<HTMLAudioElement | null>) {
  /**
   * Seek to a specific time in the current track
   */
  const seekTo = useCallback((seconds: number) => {
    if (audioRef.current) {
      audioRef.current.currentTime = seconds;
    }
  }, [audioRef]);

  /**
   * Update the player volume
   */
  const setVolumeLevel = useCallback((value: number) => {
    const clampedValue = Math.max(0, Math.min(1, value));
    if (audioRef.current) {
      audioRef.current.volume = clampedValue;
    }
  }, [audioRef]);

  /**
   * Handle progress bar clicks
   */
  const handleProgressClick = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!audioRef.current) return;
    
    const rect = e.currentTarget.getBoundingClientRect();
    const offsetX = e.clientX - rect.left;
    const percentage = offsetX / rect.width;
    const newTime = percentage * audioRef.current.duration;
    
    seekTo(newTime);
  }, [seekTo, audioRef]);
  
  /**
   * Handle volume slider changes
   */
  const handleVolumeChange = useCallback((values: number[]) => {
    if (values.length > 0) {
      setVolumeLevel(values[0] / 100);
    }
  }, [setVolumeLevel]);

  return {
    seekTo,
    setVolume: setVolumeLevel,
    handleProgressClick,
    handleVolumeChange
  };
}

export default usePlayerControls;
