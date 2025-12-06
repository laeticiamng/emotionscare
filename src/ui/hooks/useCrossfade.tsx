// @ts-nocheck
import { useCallback, useRef } from 'react';
import { logger } from '@/lib/logger';

interface CrossfadeControls {
  crossfade: (fromSrc: string, toSrc: string, duration?: number) => Promise<void>;
  stop: () => void;
}

/**
 * Hook pour effectuer un crossfade entre deux pistes audio
 * @returns Contrôles de crossfade
 */
export function useCrossfade(): CrossfadeControls {
  const fromAudioRef = useRef<HTMLAudioElement | null>(null);
  const toAudioRef = useRef<HTMLAudioElement | null>(null);
  const isTransitioningRef = useRef(false);

  const crossfade = useCallback(async (fromSrc: string, toSrc: string, duration = 3000) => {
    if (isTransitioningRef.current) return;
    isTransitioningRef.current = true;

    try {
      // Créer les éléments audio
      const fromAudio = new Audio(fromSrc);
      const toAudio = new Audio(toSrc);
      
      fromAudioRef.current = fromAudio;
      toAudioRef.current = toAudio;

      // Démarrer la première piste
      fromAudio.volume = 1;
      toAudio.volume = 0;
      
      await fromAudio.play();
      await toAudio.play();

      // Effectuer le crossfade
      const steps = 60; // 60 FPS
      const stepDuration = duration / steps;
      const volumeStep = 1 / steps;

      for (let i = 0; i < steps; i++) {
        await new Promise(resolve => setTimeout(resolve, stepDuration));
        
        const progress = i / steps;
        fromAudio.volume = Math.max(0, 1 - progress);
        toAudio.volume = Math.min(1, progress);
      }

      // Arrêter la première piste
      fromAudio.pause();
      fromAudio.volume = 0;
      toAudio.volume = 1;

    } catch (error) {
      logger.warn('Crossfade failed', error, 'UI');
    } finally {
      isTransitioningRef.current = false;
    }
  }, []);

  const stop = useCallback(() => {
    if (fromAudioRef.current) {
      fromAudioRef.current.pause();
      fromAudioRef.current = null;
    }
    if (toAudioRef.current) {
      toAudioRef.current.pause();
      toAudioRef.current = null;
    }
    isTransitioningRef.current = false;
  }, []);

  return {
    crossfade,
    stop
  };
}