/**
 * useScreenSilkMachine - State machine pour Screen Silk
 */

import { useCallback } from 'react';
import { useAsyncMachine } from '@/hooks/useAsyncMachine';
import { screenSilkService, ScreenSilkSession } from './screen-silkService';

export type ScreenSilkState = 'idle' | 'loading' | 'active' | 'ending' | 'success' | 'error';

export interface ScreenSilkData {
  session: ScreenSilkSession | null;
  timeRemaining: number;
  phase: 'preparation' | 'active' | 'ending';
  blinkGuideActive: boolean;
}

export interface ScreenSilkConfig {
  duration: number; // en secondes (60-180)
  enableBlur: boolean;
  blinkInterval: number; // en secondes
  onComplete?: (label: 'gain' | 'léger' | 'incertain') => void;
  onInterrupt?: () => void;
}

export const useScreenSilkMachine = (config: ScreenSilkConfig) => {
  const runSession = useCallback(async (signal: AbortSignal): Promise<ScreenSilkData> => {
    const session = await screenSilkService.startSession(config.duration);
    
    return new Promise<ScreenSilkData>((resolve, reject) => {
      let timeRemaining = config.duration;
      let phase: 'preparation' | 'active' | 'ending' = 'preparation';
      let blinkGuideActive = false;

      const interval = setInterval(() => {
        if (signal.aborted) {
          clearInterval(interval);
          screenSilkService.interruptSession();
          reject(new Error('Session interrompue'));
          return;
        }

        timeRemaining--;

        // Phases de la session
        if (timeRemaining <= 0) {
          clearInterval(interval);
          phase = 'ending';
          resolve({
            session,
            timeRemaining: 0,
            phase,
            blinkGuideActive: false
          });
          return;
        }

        // Phase de préparation (3 premiers secondes)
        if (timeRemaining > config.duration - 3) {
          phase = 'preparation';
        } else {
          phase = 'active';
        }

        // Guide de clignement
        blinkGuideActive = timeRemaining % config.blinkInterval === 0;
        if (blinkGuideActive) {
          screenSilkService.incrementBlink();
        }

        // Mise à jour continue (non résolvue pour permettre les updates)
        // Cette promesse se résoudra seulement à la fin
      }, 1000);

      // Gestion de l'interruption
      signal.addEventListener('abort', () => {
        clearInterval(interval);
        screenSilkService.interruptSession();
        reject(new Error('Session interrompue'));
      });
    });
  }, [config]);

  const {
    state,
    data,
    error,
    run: startSession,
    reset
  } = useAsyncMachine<ScreenSilkData>({
    run: runSession,
    onSuccess: (data) => {
      if (data.timeRemaining <= 0) {
        screenSilkService.endSession('gain');
        config.onComplete?.('gain');
      }
    },
    onError: (error) => {
      console.error('Erreur Screen Silk:', error);
      config.onInterrupt?.();
    }
  });

  const interrupt = useCallback(() => {
    reset();
    screenSilkService.interruptSession();
    config.onInterrupt?.();
  }, [reset, config]);

  const completeWithLabel = useCallback((label: 'gain' | 'léger' | 'incertain') => {
    screenSilkService.endSession(label);
    config.onComplete?.(label);
    reset();
  }, [config, reset]);

  return {
    state: state as ScreenSilkState,
    data: data || {
      session: null,
      timeRemaining: config.duration,
      phase: 'preparation' as const,
      blinkGuideActive: false
    },
    error,
    startSession,
    interrupt,
    completeWithLabel,
    reset,
    isActive: state === 'active',
    isLoading: state === 'loading'
  };
};