
import { RefObject, useEffect } from 'react';

interface UseAudioEventsProps {
  audioRef: RefObject<HTMLAudioElement | null>;
  onTimeUpdate?: (time: number) => void;
  onDurationChange?: (duration: number) => void;
  onEnded?: () => void;
  onError?: (error: Error) => void;
  onPlay?: () => void;
  onPause?: () => void;
  onWaiting?: () => void;
  onCanPlay?: () => void;
  volume?: number;
  repeat?: boolean;
}

/**
 * Hook to handle all audio element events
 */
export function useAudioEvents({
  audioRef,
  onTimeUpdate,
  onDurationChange,
  onEnded,
  onError,
  onPlay,
  onPause,
  onWaiting,
  onCanPlay,
  volume = 0.7,
  repeat = false
}: UseAudioEventsProps) {
  // Register all event listeners for audio element
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    
    // Set initial properties
    audio.volume = volume;
    audio.loop = repeat;
    
    // Time update handler
    const handleTimeUpdate = () => {
      onTimeUpdate?.(audio.currentTime);
    };
    
    // Duration change handler
    const handleDurationChange = () => {
      if (audio.duration && !isNaN(audio.duration)) {
        onDurationChange?.(audio.duration);
      }
    };
    
    // Ended handler
    const handleEnded = () => {
      onEnded?.();
    };
    
    // Error handler
    const handleError = () => {
      onError?.(new Error('Erreur de lecture audio'));
    };
    
    // Play handler
    const handlePlay = () => {
      onPlay?.();
    };
    
    // Pause handler
    const handlePause = () => {
      onPause?.();
    };
    
    // Waiting handler
    const handleWaiting = () => {
      onWaiting?.();
    };
    
    // Can play handler
    const handleCanPlay = () => {
      onCanPlay?.();
    };
    
    // Add all event listeners
    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('durationchange', handleDurationChange);
    audio.addEventListener('ended', handleEnded);
    audio.addEventListener('error', handleError);
    audio.addEventListener('play', handlePlay);
    audio.addEventListener('pause', handlePause);
    audio.addEventListener('waiting', handleWaiting);
    audio.addEventListener('canplay', handleCanPlay);
    
    // Clean up event listeners
    return () => {
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('durationchange', handleDurationChange);
      audio.removeEventListener('ended', handleEnded);
      audio.removeEventListener('error', handleError);
      audio.removeEventListener('play', handlePlay);
      audio.removeEventListener('pause', handlePause);
      audio.removeEventListener('waiting', handleWaiting);
      audio.removeEventListener('canplay', handleCanPlay);
    };
  }, [
    audioRef,
    onTimeUpdate,
    onDurationChange,
    onEnded,
    onError,
    onPlay,
    onPause,
    onWaiting,
    onCanPlay,
    volume,
    repeat
  ]);
  
  // Update volume when it changes
  useEffect(() => {
    const audio = audioRef.current;
    if (audio) {
      audio.volume = volume;
    }
  }, [audioRef, volume]);
  
  // Update repeat when it changes
  useEffect(() => {
    const audio = audioRef.current;
    if (audio) {
      audio.loop = repeat;
    }
  }, [audioRef, repeat]);
}

export default useAudioEvents;
