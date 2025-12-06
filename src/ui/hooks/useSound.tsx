// @ts-nocheck
import { useRef, useCallback } from 'react';
import { logger } from '@/lib/logger';

interface UseSoundOptions {
  volume?: number;
  loop?: boolean;
  preload?: boolean;
}

interface SoundControls {
  play?: () => Promise<void>;
  pause?: () => void;
  stop?: () => void;
  setVolume?: (volume: number) => void;
  isPlaying: boolean;
}

/**
 * Hook pour gérer la lecture audio
 * @param src - URL du fichier audio
 * @param options - Options de configuration
 * @returns Contrôles audio
 */
export function useSound(src: string, options: UseSoundOptions = {}): SoundControls {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const { volume = 0.8, loop = false, preload = true } = options;

  const initAudio = useCallback(() => {
    if (!audioRef.current) {
      audioRef.current = new Audio(src);
      audioRef.current.volume = volume;
      audioRef.current.loop = loop;
      if (preload) {
        audioRef.current.preload = 'auto';
      }
    }
    return audioRef.current;
  }, [src, volume, loop, preload]);

  const play = useCallback(async () => {
    const audio = initAudio();
    try {
      await audio.play();
    } catch (error) {
      logger.warn('Failed to play audio', error, 'UI');
    }
  }, [initAudio]);

  const pause = useCallback(() => {
    const audio = audioRef.current;
    if (audio) {
      audio.pause();
    }
  }, []);

  const stop = useCallback(() => {
    const audio = audioRef.current;
    if (audio) {
      audio.pause();
      audio.currentTime = 0;
    }
  }, []);

  const setVolume = useCallback((newVolume: number) => {
    const audio = audioRef.current;
    if (audio) {
      audio.volume = Math.max(0, Math.min(1, newVolume));
    }
  }, []);

  const isPlaying = audioRef.current ? !audioRef.current.paused : false;

  return {
    play,
    pause,
    stop,
    setVolume,
    isPlaying
  };
}