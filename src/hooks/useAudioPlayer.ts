
import { useState, useRef, useCallback } from 'react';

export const useAudioPlayer = () => {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.5);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  // Initialize audio element if it doesn't exist
  const initAudio = useCallback(() => {
    if (!audioRef.current) {
      audioRef.current = new Audio();
      
      // Set up event listeners
      audioRef.current.addEventListener('loadstart', () => setIsLoading(true));
      audioRef.current.addEventListener('canplay', () => setIsLoading(false));
      audioRef.current.addEventListener('timeupdate', () => {
        if (audioRef.current) {
          setCurrentTime(audioRef.current.currentTime);
        }
      });
      audioRef.current.addEventListener('durationchange', () => {
        if (audioRef.current) {
          setDuration(audioRef.current.duration);
        }
      });
      audioRef.current.addEventListener('ended', () => {
        setIsPlaying(false);
      });
      
      // Set initial volume
      audioRef.current.volume = volume;
    }
  }, [volume]);

  // Play audio
  const play = useCallback((src?: string) => {
    initAudio();
    if (audioRef.current) {
      if (src && audioRef.current.src !== src) {
        audioRef.current.src = src;
      }
      
      const playPromise = audioRef.current.play();
      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            setIsPlaying(true);
          })
          .catch((error) => {
            console.error('Error playing audio:', error);
            setIsPlaying(false);
          });
      }
    }
  }, [initAudio]);

  // Pause audio
  const pause = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      setIsPlaying(false);
    }
  }, []);

  // Toggle play/pause
  const toggle = useCallback((src?: string) => {
    if (isPlaying) {
      pause();
    } else {
      play(src);
    }
  }, [isPlaying, pause, play]);

  // Set volume (0-1)
  const adjustVolume = useCallback((value: number) => {
    const newVolume = Math.max(0, Math.min(1, value));
    setVolume(newVolume);
    if (audioRef.current) {
      audioRef.current.volume = newVolume;
    }
  }, []);

  // Seek to a specific time
  const seek = useCallback((time: number) => {
    if (audioRef.current) {
      audioRef.current.currentTime = time;
      setCurrentTime(time);
    }
  }, []);

  return {
    isPlaying,
    volume,
    duration,
    currentTime,
    isLoading,
    play,
    pause,
    toggle,
    adjustVolume,
    seek
  };
};
