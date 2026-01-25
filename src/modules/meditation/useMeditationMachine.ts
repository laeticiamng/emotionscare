/**
 * useMeditationMachine - State machine pour sessions de méditation
 */

import { useCallback, useEffect, useState } from 'react';
import { meditationService } from './meditationService';
import type { 
  MeditationConfig, 
  MeditationSession,
  CreateMeditationSession,
} from './types';
import { useSessionClock } from '@/modules/sessions/hooks/useSessionClock';
import { useToast } from '@/hooks/use-toast';

export type MeditationState = 'idle' | 'loading' | 'active' | 'paused' | 'ending' | 'success' | 'error';

export interface MeditationMachineConfig {
  onComplete?: (session: MeditationSession) => void;
  onError?: (error: Error) => void;
}

export interface MeditationMachineReturn {
  state: MeditationState;
  session: MeditationSession | null;
  config: MeditationConfig | null;
  error: Error | null;
  elapsedSeconds: number;
  progress: number;
  
  // Actions
  setConfig: (config: MeditationConfig) => void;
  startSession: (moodBefore?: number) => Promise<void>;
  pauseSession: () => void;
  resumeSession: () => void;
  completeSession: (moodAfter?: number) => Promise<void>;
  cancelSession: () => void;
  reset: () => void;
}

export function useMeditationMachine(
  machineConfig?: MeditationMachineConfig
): MeditationMachineReturn {
  const [config, setConfig] = useState<MeditationConfig | null>(null);
  const [session, setSession] = useState<MeditationSession | null>(null);
  const [machineState, setMachineState] = useState<MeditationState>('idle');
  const [error, setError] = useState<Error | null>(null);
  
  const { toast } = useToast();

  // Session clock pour gérer le timer
  const clock = useSessionClock({
    durationMs: config ? config.duration * 60 * 1000 : 0,
    tickMs: 1000,
  });

  const elapsedSeconds = Math.floor(clock.elapsedMs / 1000);
  const progress = clock.progress ?? 0;

  /**
   * Démarrer une nouvelle session
   */
  const startSession = useCallback(async (moodBefore?: number) => {
    if (!config) {
      throw new Error('Configuration required');
    }

    setMachineState('loading');
    setError(null);

    try {
      const sessionData: CreateMeditationSession = {
        ...config,
        moodBefore,
      };

      const newSession = await meditationService.createSession(sessionData);
      setSession(newSession);
      setMachineState('active');
      clock.start();

      toast({
        title: 'Session démarrée',
        description: `Méditation ${config.technique} - ${config.duration}min`,
      });
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to start session');
      setError(error);
      setMachineState('error');
      machineConfig?.onError?.(error);

      toast({
        title: 'Erreur',
        description: 'Impossible de démarrer la session',
        variant: 'destructive',
      });
    }
  }, [config, clock, toast, machineConfig]);

  /**
   * Mettre en pause
   */
  const pauseSession = useCallback(() => {
    if (machineState === 'active') {
      clock.pause();
      setMachineState('paused');
    }
  }, [machineState, clock]);

  /**
   * Reprendre
   */
  const resumeSession = useCallback(() => {
    if (machineState === 'paused') {
      clock.resume();
      setMachineState('active');
    }
  }, [machineState, clock]);

  /**
   * Compléter la session
   */
  const completeSession = useCallback(async (moodAfter?: number) => {
    if (!session) {
      throw new Error('No active session');
    }

    setMachineState('ending');
    clock.complete();

    try {
      const completedSession = await meditationService.completeSession({
        sessionId: session.id,
        completedDuration: elapsedSeconds,
        moodAfter,
      });

      setSession(completedSession);
      setMachineState('success');
      machineConfig?.onComplete?.(completedSession);

      const moodImprovement = completedSession.moodDelta && completedSession.moodDelta > 0
        ? ` (+${completedSession.moodDelta} humeur)`
        : '';

      toast({
        title: 'Session terminée',
        description: `${Math.floor(elapsedSeconds / 60)}min complétées${moodImprovement}`,
      });
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to complete session');
      setError(error);
      setMachineState('error');
      machineConfig?.onError?.(error);

      toast({
        title: 'Erreur',
        description: 'Impossible de terminer la session',
        variant: 'destructive',
      });
    }
  }, [session, elapsedSeconds, clock, toast, machineConfig]);

  /**
   * Annuler la session
   */
  const cancelSession = useCallback(() => {
    clock.reset();
    setMachineState('idle');
    setSession(null);
    setError(null);

    toast({
      title: 'Session annulée',
      variant: 'default',
    });
  }, [clock, toast]);

  /**
   * Reset complet
   */
  const reset = useCallback(() => {
    clock.reset();
    setMachineState('idle');
    setSession(null);
    setError(null);
    setConfig(null);
  }, [clock]);

  /**
   * Auto-complétion quand le timer atteint la fin
   */
  useEffect(() => {
    if (clock.state === 'completed' && machineState === 'active') {
      completeSession();
    }
  }, [clock.state, machineState, completeSession]);

  return {
    state: machineState,
    session,
    config,
    error,
    elapsedSeconds,
    progress,
    
    setConfig,
    startSession,
    pauseSession,
    resumeSession,
    completeSession,
    cancelSession,
    reset,
  };
}
