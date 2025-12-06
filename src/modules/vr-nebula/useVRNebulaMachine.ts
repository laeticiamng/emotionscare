/**
 * VR Nebula State Machine
 * Gère l'état des sessions VR de respiration
 */

import { useState, useCallback, useEffect, useRef } from 'react';
import { useToast } from '@/hooks/use-toast';
import * as service from './vrNebulaService';
import type {
  VRNebulaState,
  NebulaScene,
  BreathingPattern,
  BreathPhase,
  CreateVRNebulaSession,
  BreathTiming,
} from './types';
import { getBreathTiming, calculateCycleDuration } from './types';

const INITIAL_STATE: VRNebulaState = {
  phase: 'idle',
  session: null,
  currentBreathPhase: null,
  breathCount: 0,
  elapsedSeconds: 0,
  coherenceLevel: 0,
  error: null,
};

export function useVRNebulaMachine() {
  const [state, setState] = useState<VRNebulaState>(INITIAL_STATE);
  const { toast } = useToast();
  
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const breathTimerRef = useRef<NodeJS.Timeout | null>(null);
  const startTimeRef = useRef<number | null>(null);

  // Cleanup timers on unmount
  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      if (breathTimerRef.current) clearTimeout(breathTimerRef.current);
    };
  }, []);

  // ─────────────────────────────────────────────────────────────
  // Breath Cycle Management
  // ─────────────────────────────────────────────────────────────

  const startBreathCycle = useCallback((timing: BreathTiming) => {
    const phases: BreathPhase[] = ['inhale', 'hold_in', 'exhale', 'hold_out'];
    const durations = [timing.inhale, timing.hold_in, timing.exhale, timing.hold_out];
    
    let currentPhaseIndex = 0;

    const nextPhase = () => {
      // Skip phases with 0 duration
      while (durations[currentPhaseIndex] === 0 && currentPhaseIndex < phases.length) {
        currentPhaseIndex++;
      }

      if (currentPhaseIndex >= phases.length) {
        // Cycle complete
        setState(prev => ({
          ...prev,
          breathCount: prev.breathCount + 1,
        }));
        currentPhaseIndex = 0;
      }

      const phase = phases[currentPhaseIndex];
      const duration = durations[currentPhaseIndex] * 1000;

      setState(prev => ({
        ...prev,
        currentBreathPhase: phase,
      }));

      currentPhaseIndex++;
      breathTimerRef.current = setTimeout(nextPhase, duration);
    };

    nextPhase();
  }, []);

  // ─────────────────────────────────────────────────────────────
  // Actions
  // ─────────────────────────────────────────────────────────────

  const startSession = useCallback(
    async (scene: NebulaScene, pattern: BreathingPattern, vrMode = true) => {
      try {
        setState(prev => ({ ...prev, phase: 'loading', error: null }));

        const payload: CreateVRNebulaSession = {
          scene,
          breathing_pattern: pattern,
          vr_mode: vrMode,
        };

        const session = await service.createSession(payload);

        setState(prev => ({ ...prev, phase: 'calibrating', session }));

        // Simulate calibration
        setTimeout(() => {
          setState(prev => ({ ...prev, phase: 'active' }));
          
          startTimeRef.current = Date.now();
          
          // Start elapsed time counter
          timerRef.current = setInterval(() => {
            setState(prev => ({
              ...prev,
              elapsedSeconds: prev.elapsedSeconds + 1,
            }));
          }, 1000);

          // Start breath cycle
          const timing = getBreathTiming(pattern);
          startBreathCycle(timing);

          toast({
            title: 'Session démarrée',
            description: 'Suivez le rythme de respiration.',
          });
        }, 2000);
      } catch (err) {
        setState(prev => ({
          ...prev,
          phase: 'error',
          error: err instanceof Error ? err.message : 'start_session_failed',
        }));
        toast({
          variant: 'destructive',
          title: 'Erreur',
          description: 'Impossible de démarrer la session.',
        });
      }
    },
    [toast, startBreathCycle],
  );

  const pauseSession = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    if (breathTimerRef.current) clearTimeout(breathTimerRef.current);
    
    setState(prev => ({ ...prev, phase: 'paused' }));
    
    toast({
      title: 'Session en pause',
    });
  }, [toast]);

  const resumeSession = useCallback(() => {
    if (!state.session) return;

    setState(prev => ({ ...prev, phase: 'active' }));

    // Resume timers
    timerRef.current = setInterval(() => {
      setState(prev => ({
        ...prev,
        elapsedSeconds: prev.elapsedSeconds + 1,
      }));
    }, 1000);

    const timing = getBreathTiming(state.session.breathing_pattern);
    startBreathCycle(timing);

    toast({
      title: 'Session reprise',
    });
  }, [state.session, toast, startBreathCycle]);

  const completeSession = useCallback(
    async (hrvPre?: number, hrvPost?: number) => {
      if (!state.session) {
        setState(prev => ({ ...prev, phase: 'idle' }));
        return;
      }

      try {
        setState(prev => ({ ...prev, phase: 'completing' }));

        // Stop timers
        if (timerRef.current) clearInterval(timerRef.current);
        if (breathTimerRef.current) clearTimeout(breathTimerRef.current);

        const cycleDuration = calculateCycleDuration(
          getBreathTiming(state.session.breathing_pattern),
        );
        const respRate = state.breathCount > 0 
          ? (state.breathCount * 60) / state.elapsedSeconds 
          : undefined;

        await service.completeSession({
          session_id: state.session.id,
          duration_s: state.elapsedSeconds,
          resp_rate_avg: respRate,
          hrv_pre: hrvPre,
          hrv_post: hrvPost,
          cycles_completed: state.breathCount,
        });

        setState(prev => ({ ...prev, phase: 'completed' }));

        toast({
          title: 'Session terminée',
          description: `${state.breathCount} cycles complétés en ${Math.floor(state.elapsedSeconds / 60)} minutes.`,
        });

        // Reset after delay
        setTimeout(() => {
          setState(INITIAL_STATE);
          startTimeRef.current = null;
        }, 3000);
      } catch (err) {
        setState(prev => ({
          ...prev,
          phase: 'error',
          error: err instanceof Error ? err.message : 'complete_session_failed',
        }));
        toast({
          variant: 'destructive',
          title: 'Erreur',
          description: 'Impossible de sauvegarder la session.',
        });
      }
    },
    [state.session, state.breathCount, state.elapsedSeconds, toast],
  );

  const updateHRV = useCallback((hrv: number) => {
    setState(prev => ({ ...prev, currentHRV: hrv }));
  }, []);

  const reset = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    if (breathTimerRef.current) clearTimeout(breathTimerRef.current);
    setState(INITIAL_STATE);
    startTimeRef.current = null;
  }, []);

  return {
    state,
    startSession,
    pauseSession,
    resumeSession,
    completeSession,
    updateHRV,
    reset,
  };
}
