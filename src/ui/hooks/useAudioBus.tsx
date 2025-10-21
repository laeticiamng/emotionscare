// @ts-nocheck
import { useCallback, useRef } from 'react';
import { logger } from '@/lib/logger';

interface AudioBusControls {
  playSound: (soundId: string, src: string) => Promise<void>;
  stopSound: (soundId: string) => void;
  stopAll: () => void;
  setGlobalVolume: (volume: number) => void;
}

/**
 * Hook pour gérer un bus audio global
 * Permet de jouer plusieurs sons simultanément
 * @returns Contrôles du bus audio
 */
export function useAudioBus(): AudioBusControls {
  const soundsRef = useRef<Map<string, HTMLAudioElement>>(new Map());
  const globalVolumeRef = useRef(0.7);

  const playSound = useCallback(async (soundId: string, src: string) => {
    try {
      let audio = soundsRef.current.get(soundId);
      
      if (!audio) {
        audio = new Audio(src);
        audio.volume = globalVolumeRef.current;
        soundsRef.current.set(soundId, audio);
      } else if (audio.src !== src) {
        audio.src = src;
      }

      audio.currentTime = 0;
      await audio.play();
    } catch (error) {
      logger.warn(`Failed to play sound ${soundId}`, error, 'UI');
    }
  }, []);

  const stopSound = useCallback((soundId: string) => {
    const audio = soundsRef.current.get(soundId);
    if (audio) {
      audio.pause();
      audio.currentTime = 0;
    }
  }, []);

  const stopAll = useCallback(() => {
    soundsRef.current.forEach((audio) => {
      audio.pause();
      audio.currentTime = 0;
    });
  }, []);

  const setGlobalVolume = useCallback((volume: number) => {
    const clampedVolume = Math.max(0, Math.min(1, volume));
    globalVolumeRef.current = clampedVolume;
    
    soundsRef.current.forEach((audio) => {
      audio.volume = clampedVolume;
    });
  }, []);

  return {
    playSound,
    stopSound,
    stopAll,
    setGlobalVolume
  };
}