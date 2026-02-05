/**
 * useBreathingSession - Hook pour gérer une session de respiration
 */

import { useState, useEffect, useCallback, useRef } from 'react';
import { BreathingProtocol, BreathingPhase, getCycleDuration } from '@/components/breathing/BreathingProtocols';

export interface BreathingSessionState {
  isActive: boolean;
  isPaused: boolean;
  currentPhaseIndex: number;
  currentPhase: BreathingPhase | null;
  phaseTimer: number;
  totalElapsed: number;
  cyclesCompleted: number;
  isCompleted: boolean;
}

export const useBreathingSession = (protocol: BreathingProtocol | null) => {
  const [state, setState] = useState<BreathingSessionState>({
    isActive: false,
    isPaused: false,
    currentPhaseIndex: 0,
    currentPhase: null,
    phaseTimer: 0,
    totalElapsed: 0,
    cyclesCompleted: 0,
    isCompleted: false,
  });

  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const cycleDuration = protocol ? getCycleDuration(protocol) : 0;

  // Nettoyer l'intervalle
  const clearTimer = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  // Démarrer la session
  const start = useCallback(() => {
    if (!protocol) return;

    setState({
      isActive: true,
      isPaused: false,
      currentPhaseIndex: 0,
      currentPhase: protocol.phases[0],
      phaseTimer: protocol.phases[0].duration,
      totalElapsed: 0,
      cyclesCompleted: 0,
      isCompleted: false,
    });
  }, [protocol]);

  // Mettre en pause
  const pause = useCallback(() => {
    setState(prev => ({ ...prev, isPaused: true }));
  }, []);

  // Reprendre
  const resume = useCallback(() => {
    setState(prev => ({ ...prev, isPaused: false }));
  }, []);

  // Arrêter
  const stop = useCallback(() => {
    clearTimer();
    setState({
      isActive: false,
      isPaused: false,
      currentPhaseIndex: 0,
      currentPhase: null,
      phaseTimer: 0,
      totalElapsed: 0,
      cyclesCompleted: 0,
      isCompleted: false,
    });
  }, [clearTimer]);

  // Logique du timer
  useEffect(() => {
    if (!state.isActive || state.isPaused || state.isCompleted || !protocol) {
      clearTimer();
      return;
    }

    intervalRef.current = setInterval(() => {
      setState(prev => {
        if (prev.phaseTimer <= 1) {
          // Passer à la phase suivante
          const nextPhaseIndex = (prev.currentPhaseIndex + 1) % protocol.phases.length;
          const isNewCycle = nextPhaseIndex === 0;
          const newCycles = isNewCycle ? prev.cyclesCompleted + 1 : prev.cyclesCompleted;
          const newTotalElapsed = prev.totalElapsed + 1;

          // Vérifier si terminé
          if (newTotalElapsed >= protocol.totalDuration) {
            clearTimer();
            return {
              ...prev,
              phaseTimer: 0,
              totalElapsed: newTotalElapsed,
              cyclesCompleted: newCycles,
              isCompleted: true,
              isActive: false,
            };
          }

          return {
            ...prev,
            currentPhaseIndex: nextPhaseIndex,
            currentPhase: protocol.phases[nextPhaseIndex],
            phaseTimer: protocol.phases[nextPhaseIndex].duration,
            totalElapsed: newTotalElapsed,
            cyclesCompleted: newCycles,
          };
        }

        return {
          ...prev,
          phaseTimer: prev.phaseTimer - 1,
          totalElapsed: prev.totalElapsed + 1,
        };
      });
    }, 1000);

    return clearTimer;
  }, [state.isActive, state.isPaused, state.isCompleted, protocol, clearTimer]);

  // Cleanup
  useEffect(() => {
    return () => {
      clearTimer();
      if (audioRef.current) {
        audioRef.current.pause();
      }
    };
  }, [clearTimer]);

  return {
    ...state,
    start,
    pause,
    resume,
    stop,
    protocol,
    cycleDuration,
    remainingTime: protocol ? protocol.totalDuration - state.totalElapsed : 0,
    progress: protocol ? (state.totalElapsed / protocol.totalDuration) * 100 : 0,
  };
};

export default useBreathingSession;
