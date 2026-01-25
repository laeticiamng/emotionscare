/**
 * useAICoachMachine - State Machine pour AI Coach
 */

import { useState, useCallback, useEffect, useRef } from 'react';
import * as aiCoachService from './aiCoachService';
import type {
  CoachSession,
  CoachMessage,
  CoachPersonality,
} from './types';

type CoachPhase =
  | 'idle'
  | 'initializing'
  | 'ready'
  | 'sending'
  | 'receiving'
  | 'active'
  | 'completing'
  | 'completed'
  | 'error';

interface AICoachMachineState {
  phase: CoachPhase;
  currentSession: CoachSession | null;
  messages: CoachMessage[];
  isLoading: boolean;
  error: string | null;
  elapsedSeconds: number;
}

interface AICoachMachineActions {
  startSession: (personality?: CoachPersonality) => Promise<void>;
  sendMessage: (message: string) => Promise<void>;
  completeSession: (satisfaction: number, notes?: string) => Promise<void>;
  loadSession: (sessionId: string) => Promise<void>;
  reset: () => void;
}

const TICK_INTERVAL = 1000;

export function useAICoachMachine(): AICoachMachineState & AICoachMachineActions {
  const [state, setState] = useState<AICoachMachineState>({
    phase: 'idle',
    currentSession: null,
    messages: [],
    isLoading: false,
    error: null,
    elapsedSeconds: 0,
  });

  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const startTimeRef = useRef<number | null>(null);

  // Cleanup timer on unmount
  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, []);

  // Start timer when session is ready
  useEffect(() => {
    if (state.phase === 'ready' || state.phase === 'active') {
      if (!timerRef.current) {
        startTimeRef.current = Date.now();
        timerRef.current = setInterval(() => {
          setState((prev) => ({ ...prev, elapsedSeconds: prev.elapsedSeconds + 1 }));
        }, TICK_INTERVAL);
      }
    } else {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    }
  }, [state.phase]);

  const startSession = useCallback(async (personality: CoachPersonality = 'empathetic') => {
    setState((prev) => ({ ...prev, phase: 'initializing', isLoading: true, error: null }));

    try {
      const session = await aiCoachService.createSession({
        coach_personality: personality,
      });

      setState({
        phase: 'ready',
        currentSession: session,
        messages: [],
        isLoading: false,
        error: null,
        elapsedSeconds: 0,
      });
    } catch (error) {
      setState((prev) => ({
        ...prev,
        phase: 'error',
        isLoading: false,
        error: error instanceof Error ? error.message : 'Failed to start session',
      }));
    }
  }, []);

  const sendMessage = useCallback(
    async (message: string) => {
      if (!state.currentSession) return;

      setState((prev) => ({ ...prev, phase: 'sending', isLoading: true }));

      try {
        const _response = await aiCoachService.sendMessage({
          session_id: state.currentSession.id,
          message,
        });

        // Recharger tous les messages
        const allMessages = await aiCoachService.getMessages(state.currentSession.id);

        setState((prev) => ({
          ...prev,
          phase: 'active',
          messages: allMessages,
          isLoading: false,
        }));

        // Mettre à jour la durée de la session
        if (state.currentSession) {
          await aiCoachService.updateSession({
            session_id: state.currentSession.id,
            session_duration: state.elapsedSeconds,
          });
        }
      } catch (error) {
        setState((prev) => ({
          ...prev,
          phase: 'error',
          isLoading: false,
          error: error instanceof Error ? error.message : 'Failed to send message',
        }));
      }
    },
    [state.currentSession, state.elapsedSeconds],
  );

  const completeSession = useCallback(
    async (satisfaction: number, notes?: string) => {
      if (!state.currentSession) return;

      setState((prev) => ({ ...prev, phase: 'completing', isLoading: true }));

      try {
        // Clear timer
        if (timerRef.current) {
          clearInterval(timerRef.current);
          timerRef.current = null;
        }

        // Update session with final duration
        await aiCoachService.updateSession({
          session_id: state.currentSession.id,
          session_duration: state.elapsedSeconds,
        });

        // Complete session
        const completedSession = await aiCoachService.completeSession({
          session_id: state.currentSession.id,
          user_satisfaction: satisfaction,
          session_notes: notes,
        });

        setState((prev) => ({
          ...prev,
          phase: 'completed',
          currentSession: completedSession,
          isLoading: false,
        }));
      } catch (error) {
        setState((prev) => ({
          ...prev,
          phase: 'error',
          isLoading: false,
          error: error instanceof Error ? error.message : 'Failed to complete session',
        }));
      }
    },
    [state.currentSession, state.elapsedSeconds],
  );

  const loadSession = useCallback(async (sessionId: string) => {
    setState((prev) => ({ ...prev, isLoading: true, error: null }));

    try {
      const session = await aiCoachService.getSession(sessionId);
      const messages = await aiCoachService.getMessages(sessionId);

      setState({
        phase: 'active',
        currentSession: session,
        messages,
        isLoading: false,
        error: null,
        elapsedSeconds: session.session_duration,
      });
    } catch (error) {
      setState((prev) => ({
        ...prev,
        isLoading: false,
        error: error instanceof Error ? error.message : 'Failed to load session',
      }));
    }
  }, []);

  const reset = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }

    startTimeRef.current = null;

    setState({
      phase: 'idle',
      currentSession: null,
      messages: [],
      isLoading: false,
      error: null,
      elapsedSeconds: 0,
    });
  }, []);

  return {
    ...state,
    startSession,
    sendMessage,
    completeSession,
    loadSession,
    reset,
  };
}
