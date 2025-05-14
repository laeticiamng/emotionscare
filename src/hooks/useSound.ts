
import { useState, useEffect, useRef } from 'react';

interface UseSoundOptions {
  src: string;
  volume?: number;
  loop?: boolean;
  autoPlay?: boolean;
}

interface UseSoundReturn {
  play: () => Promise<void>;
  pause: () => void;
  stop: () => void;
  isPlaying: boolean;
  setVolume: (volume: number) => void;
  duration: number | null;
  currentTime: number;
}

const useSound = ({ src, volume = 0.5, loop = false, autoPlay = false }: UseSoundOptions): UseSoundReturn => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [duration, setDuration] = useState<number | null>(null);
  const [currentTime, setCurrentTime] = useState(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    // Create audio element
    const audio = new Audio(src);
    audioRef.current = audio;
    
    // Configure audio
    audio.volume = volume;
    audio.loop = loop;
    
    // Set up event listeners
    audio.addEventListener('loadedmetadata', () => {
      setDuration(audio.duration);
    });
    
    audio.addEventListener('timeupdate', () => {
      setCurrentTime(audio.currentTime);
    });
    
    audio.addEventListener('ended', () => {
      if (!loop) {
        setIsPlaying(false);
      }
    });
    
    // Autoplay if enabled
    if (autoPlay) {
      audio.play().catch(e => {
        console.warn('Autoplay prevented:', e);
      });
      setIsPlaying(true);
    }
    
    // Cleanup
    return () => {
      audio.pause();
      audio.src = '';
      audioRef.current = null;
    };
  }, [src, volume, loop, autoPlay]);

  const play = async (): Promise<void> => {
    if (!audioRef.current) return;
    
    try {
      await audioRef.current.play();
      setIsPlaying(true);
    } catch (error) {
      console.error('Error playing audio:', error);
    }
  };
  
  const pause = (): void => {
    if (!audioRef.current) return;
    
    audioRef.current.pause();
    setIsPlaying(false);
  };
  
  const stop = (): void => {
    if (!audioRef.current) return;
    
    audioRef.current.pause();
    audioRef.current.currentTime = 0;
    setIsPlaying(false);
  };
  
  const setVolume = (newVolume: number): void => {
    if (!audioRef.current) return;
    
    audioRef.current.volume = Math.max(0, Math.min(1, newVolume));
  };

  return {
    play,
    pause,
    stop,
    isPlaying,
    setVolume,
    duration,
    currentTime
  };
};

export default useSound;
