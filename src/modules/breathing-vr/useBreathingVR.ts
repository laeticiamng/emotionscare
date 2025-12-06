/**
 * Hook principal pour breathing-vr
 */

import { useCallback, useRef } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useBreathingVRMachine } from './useBreathingVRMachine';
import { BreathingVRService } from './breathingVRService';
import type { BreathingPattern } from './types';
import { BREATHING_PATTERNS } from './types';
import { logger } from '@/lib/logger';

export function useBreathingVR() {
  const { user } = useAuth();
  const machine = useBreathingVRMachine();
  const sessionIdRef = useRef<string | null>(null);

  const startBreathing = useCallback(async (
    pattern: BreathingPattern,
    vrMode: boolean = false,
    moodBefore?: number
  ) => {
    if (!user?.id) {
      machine.state.error = 'User not authenticated';
      return;
    }

    try {
      const session = await BreathingVRService.createSession(
        user.id,
        pattern,
        vrMode,
        moodBefore
      );
      sessionIdRef.current = session.id;

      const config = BREATHING_PATTERNS[pattern];
      machine.startSession(config, vrMode);
    } catch (error) {
      logger.error('Failed to start breathing session', error as Error, 'VR');
    }
  }, [user?.id, machine]);

  const completeBreathing = useCallback(async (moodAfter?: number, notes?: string) => {
    if (!sessionIdRef.current) return;

    try {
      await BreathingVRService.completeSession(sessionIdRef.current, {
        cycles_completed: machine.state.cyclesCompleted,
        duration_seconds: machine.state.elapsedTime,
        average_pace: machine.state.cyclesCompleted > 0
          ? machine.state.elapsedTime / machine.state.cyclesCompleted
          : 0,
        mood_after: moodAfter,
        notes
      });

      machine.completeSession();
    } catch (error) {
      logger.error('Failed to complete breathing session', error as Error, 'VR');
    }
  }, [machine]);

  return {
    status: machine.state.status,
    currentPhase: machine.state.currentPhase,
    phaseProgress: machine.state.phaseProgress,
    cyclesCompleted: machine.state.cyclesCompleted,
    elapsedTime: machine.state.elapsedTime,
    vrMode: machine.state.vrMode,
    error: machine.state.error,
    startBreathing,
    pauseBreathing: machine.pauseSession,
    resumeBreathing: machine.resumeSession,
    completeBreathing,
    reset: machine.reset
  };
}
