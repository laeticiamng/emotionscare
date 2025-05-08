
import { useEffect, RefObject } from 'react';
import { UseAudioEventsProps } from '@/types/audio-player';

/**
 * Hook to handle audio element events separately from state management
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
  volume,
  repeat
}: UseAudioEventsProps): void {
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    
    // Configure the volume
    audio.volume = volume;

    // Define event handlers
    const handleTimeUpdate = () => onTimeUpdate(audio.currentTime);
    const handleLoadedMetadata = () => onDurationChange(audio.duration || 0);
    const handlePlay = () => onPlay();
    const handlePause = () => onPause();
    const handleEnded = () => {
      if (repeat) {
        audio.currentTime = 0;
        audio.play().catch((error) => onError(error));
      } else {
        onEnded();
      }
    };
    const handleError = () => onError(new Error("Erreur de lecture audio"));
    const handleWaiting = () => onWaiting();
    const handleCanPlay = () => onCanPlay();

    // Add all event listeners
    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('loadedmetadata', handleLoadedMetadata);
    audio.addEventListener('play', handlePlay);
    audio.addEventListener('pause', handlePause);
    audio.addEventListener('ended', handleEnded);
    audio.addEventListener('error', handleError);
    audio.addEventListener('waiting', handleWaiting);
    audio.addEventListener('canplay', handleCanPlay);

    // Cleanup on unmount
    return () => {
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
      audio.removeEventListener('play', handlePlay);
      audio.removeEventListener('pause', handlePause);
      audio.removeEventListener('ended', handleEnded);
      audio.removeEventListener('error', handleError);
      audio.removeEventListener('waiting', handleWaiting);
      audio.removeEventListener('canplay', handleCanPlay);
    };
  }, [audioRef, onTimeUpdate, onDurationChange, onEnded, onError, onPlay, onPause, onWaiting, onCanPlay, volume, repeat]);
}
