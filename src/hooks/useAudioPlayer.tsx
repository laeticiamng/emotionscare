// @ts-nocheck

import { useState, useEffect, useCallback } from 'react';
import { logger } from '@/lib/logger';

export function useAudioPlayer() {
  const [audioElement, setAudioElement] = useState<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(0.5);

  useEffect(() => {
    // Create audio element
    const audio = new Audio();
    audio.volume = volume;
    
    // Set up event listeners
    audio.addEventListener('timeupdate', () => {
      setCurrentTime(audio.currentTime);
    });
    
    audio.addEventListener('loadedmetadata', () => {
      setDuration(audio.duration);
    });
    
    audio.addEventListener('ended', () => {
      setIsPlaying(false);
    });
    
    setAudioElement(audio);
    
    // Clean up on unmount
    return () => {
      audio.pause();
      audio.src = '';
      audio.remove();
    };
  }, []);

  const play = useCallback((src: string) => {
    if (!audioElement) return;
    
    audioElement.src = src;
    audioElement.play()
      .then(() => setIsPlaying(true))
      .catch(err => logger.error('Error playing audio', err as Error, 'UI'));
  }, [audioElement]);

  const pause = useCallback(() => {
    if (!audioElement) return;
    
    audioElement.pause();
    setIsPlaying(false);
  }, [audioElement]);

  const toggle = useCallback(() => {
    if (!audioElement) return;
    
    if (isPlaying) {
      audioElement.pause();
      setIsPlaying(false);
    } else if (audioElement.src) {
      audioElement.play()
        .then(() => setIsPlaying(true))
        .catch(err => logger.error('Error playing audio', err as Error, 'UI'));
    }
  }, [audioElement, isPlaying]);

  const setAudioVolume = useCallback((value: number) => {
    if (!audioElement) return;
    
    const clampedVolume = Math.min(1, Math.max(0, value));
    audioElement.volume = clampedVolume;
    setVolume(clampedVolume);
  }, [audioElement]);

  const seek = useCallback((time: number) => {
    if (!audioElement) return;
    
    audioElement.currentTime = time;
    setCurrentTime(time);
  }, [audioElement]);

  return {
    isPlaying,
    currentTime,
    duration,
    volume,
    play,
    pause,
    toggle,
    setVolume: setAudioVolume,
    seek
  };
}

export default useAudioPlayer;
