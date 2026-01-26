/**
 * State machine pour breathing-vr
 */

import { useState, useCallback, useRef, useEffect } from 'react';
import type { BreathingVRState, BreathingConfig, BreathingPhase } from './types';

const PHASE_ORDER: BreathingPhase[] = ['inhale', 'hold', 'exhale', 'rest'];

export function useBreathingVRMachine() {
  const [state, setState] = useState<BreathingVRState>({
    status: 'idle',
    config: null,
    currentPhase: 'inhale',
    phaseProgress: 0,
    cyclesCompleted: 0,
    totalDuration: 0,
    elapsedTime: 0,
    vrMode: false,
    error: null
  });

  const intervalRef = useRef<NodeJS.Timeout>();
  const phaseStartTimeRef = useRef<number>(0);
  const sessionStartTimeRef = useRef<number>(0);

  const moveToNextPhase = useCallback(() => {
    setState(prev => {
      if (!prev.config) return prev;

      const currentIndex = PHASE_ORDER.indexOf(prev.currentPhase);
      let nextIndex = currentIndex + 1;

      // Skip phases with 0 duration
      while (nextIndex < PHASE_ORDER.length) {
        const nextPhase = PHASE_ORDER[nextIndex];
        if (prev.config[nextPhase]) break;
        nextIndex++;
      }

      if (nextIndex >= PHASE_ORDER.length) {
        // Cycle completed, restart from inhale
        return {
          ...prev,
          currentPhase: 'inhale',
          phaseProgress: 0,
          cyclesCompleted: prev.cyclesCompleted + 1
        };
      }

      return {
        ...prev,
        currentPhase: PHASE_ORDER[nextIndex],
        phaseProgress: 0
      };
    });

    phaseStartTimeRef.current = Date.now();
  }, []);

  const startSession = useCallback((config: BreathingConfig, vrMode: boolean = false) => {
    setState({
      status: 'active',
      config,
      currentPhase: 'inhale',
      phaseProgress: 0,
      cyclesCompleted: 0,
      totalDuration: 0,
      elapsedTime: 0,
      vrMode,
      error: null
    });

    phaseStartTimeRef.current = Date.now();
    sessionStartTimeRef.current = Date.now();

    intervalRef.current = setInterval(() => {
      setState(prev => {
        if (prev.status !== 'active') return prev;

        const now = Date.now();
        const phaseElapsed = now - phaseStartTimeRef.current;
        const phaseDuration = (prev.config?.[prev.currentPhase] || 0) * 1000;
        const progress = Math.min((phaseElapsed / phaseDuration) * 100, 100);
        const elapsedTime = Math.floor((now - sessionStartTimeRef.current) / 1000);

        return {
          ...prev,
          phaseProgress: progress,
          elapsedTime
        };
      });
    }, 50);
  }, []);

  const pauseSession = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    setState(prev => ({ ...prev, status: 'paused' }));
  }, []);

  const resumeSession = useCallback(() => {
    phaseStartTimeRef.current = Date.now();
    sessionStartTimeRef.current = Date.now() - (state.elapsedTime * 1000);
    
    intervalRef.current = setInterval(() => {
      setState(prev => {
        if (prev.status !== 'active') return prev;

        const now = Date.now();
        const phaseElapsed = now - phaseStartTimeRef.current;
        const phaseDuration = (prev.config?.[prev.currentPhase] || 0) * 1000;
        const progress = Math.min((phaseElapsed / phaseDuration) * 100, 100);
        const elapsedTime = Math.floor((now - sessionStartTimeRef.current) / 1000);

        return {
          ...prev,
          phaseProgress: progress,
          elapsedTime
        };
      });
    }, 50);

    setState(prev => ({ ...prev, status: 'active' }));
  }, [state.elapsedTime]);

  const completeSession = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    setState(prev => ({ ...prev, status: 'completed' }));
  }, []);

  const reset = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    setState({
      status: 'idle',
      config: null,
      currentPhase: 'inhale',
      phaseProgress: 0,
      cyclesCompleted: 0,
      totalDuration: 0,
      elapsedTime: 0,
      vrMode: false,
      error: null
    });
  }, []);

  // Check if phase is complete and move to next
  useEffect(() => {
    if (state.status === 'active' && state.phaseProgress >= 100) {
      moveToNextPhase();
    }
  }, [state.status, state.phaseProgress, moveToNextPhase]);

  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  return {
    state,
    startSession,
    pauseSession,
    resumeSession,
    completeSession,
    reset
  };
}
