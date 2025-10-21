/**
 * useBounceBackMachine - State Machine pour Bounce Back
 */

import { useState, useCallback, useEffect, useRef } from 'react';
import * as bounceBackService from './bounceBackService';
import type { BounceBattle, BattleMode, EventType, CopingQuestion } from './types';
import { logger } from '@/lib/logger';

type BattlePhase = 'idle' | 'starting' | 'active' | 'paused' | 'completing' | 'completed' | 'error';

interface BounceBackMachineState {
  phase: BattlePhase;
  currentBattle: BounceBattle | null;
  elapsedSeconds: number;
  eventCount: number;
  isLoading: boolean;
  error: string | null;
}

interface BounceBackMachineActions {
  createBattle: (mode?: BattleMode) => Promise<void>;
  startBattle: () => Promise<void>;
  pauseBattle: () => Promise<void>;
  resumeBattle: () => Promise<void>;
  completeBattle: () => Promise<void>;
  abandonBattle: () => Promise<void>;
  addEvent: (eventType: EventType, eventData?: Record<string, unknown>) => Promise<void>;
  addCopingResponse: (questionId: CopingQuestion, value: number) => Promise<void>;
  reset: () => void;
}

const TICK_INTERVAL = 1000;

export function useBounceBackMachine(): BounceBackMachineState & BounceBackMachineActions {
  const [state, setState] = useState<BounceBackMachineState>({
    phase: 'idle',
    currentBattle: null,
    elapsedSeconds: 0,
    eventCount: 0,
    isLoading: false,
    error: null,
  });

  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const isPausedRef = useRef(false);
  const startTimeRef = useRef<number | null>(null);

  // Cleanup timer on unmount
  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, []);

  const createBattle = useCallback(async (mode: BattleMode = 'standard') => {
    setState((prev) => ({ ...prev, isLoading: true, error: null }));

    try {
      const battle = await bounceBackService.createBattle({ mode });

      setState({
        phase: 'starting',
        currentBattle: battle,
        elapsedSeconds: 0,
        eventCount: 0,
        isLoading: false,
        error: null,
      });
    } catch (error) {
      setState((prev) => ({
        ...prev,
        phase: 'error',
        isLoading: false,
        error: error instanceof Error ? error.message : 'Failed to create battle',
      }));
    }
  }, []);

  const startBattle = useCallback(async () => {
    if (!state.currentBattle) return;

    setState((prev) => ({ ...prev, isLoading: true }));

    try {
      const updatedBattle = await bounceBackService.startBattle({
        battle_id: state.currentBattle.id,
      });

      setState((prev) => ({
        ...prev,
        phase: 'active',
        currentBattle: updatedBattle,
        isLoading: false,
      }));

      // Start timer
      isPausedRef.current = false;
      startTimeRef.current = Date.now();
      timerRef.current = setInterval(() => {
        if (!isPausedRef.current) {
          setState((prev) => ({ ...prev, elapsedSeconds: prev.elapsedSeconds + 1 }));
        }
      }, TICK_INTERVAL);
    } catch (error) {
      setState((prev) => ({
        ...prev,
        phase: 'error',
        isLoading: false,
        error: error instanceof Error ? error.message : 'Failed to start battle',
      }));
    }
  }, [state.currentBattle]);

  const pauseBattle = useCallback(async () => {
    if (!state.currentBattle) return;

    try {
      await bounceBackService.pauseBattle(state.currentBattle.id);
      isPausedRef.current = true;
      setState((prev) => ({ ...prev, phase: 'paused' }));
    } catch (error) {
      logger.error('Failed to pause battle', error as Error, 'SYSTEM');
    }
  }, [state.currentBattle]);

  const resumeBattle = useCallback(async () => {
    if (!state.currentBattle) return;

    try {
      await bounceBackService.startBattle({ battle_id: state.currentBattle.id });
      isPausedRef.current = false;
      setState((prev) => ({ ...prev, phase: 'active' }));
    } catch (error) {
      logger.error('Failed to resume battle', error as Error, 'SYSTEM');
    }
  }, [state.currentBattle]);

  const completeBattle = useCallback(async () => {
    if (!state.currentBattle) return;

    setState((prev) => ({ ...prev, isLoading: true, phase: 'completing' }));

    try {
      // Clear timer
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }

      const updatedBattle = await bounceBackService.completeBattle({
        battle_id: state.currentBattle.id,
        duration_seconds: state.elapsedSeconds,
      });

      setState((prev) => ({
        ...prev,
        phase: 'completed',
        currentBattle: updatedBattle,
        isLoading: false,
      }));
    } catch (error) {
      setState((prev) => ({
        ...prev,
        phase: 'error',
        isLoading: false,
        error: error instanceof Error ? error.message : 'Failed to complete battle',
      }));
    }
  }, [state.currentBattle, state.elapsedSeconds]);

  const abandonBattle = useCallback(async () => {
    if (!state.currentBattle) return;

    try {
      // Clear timer
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }

      await bounceBackService.abandonBattle(state.currentBattle.id);

      setState({
        phase: 'idle',
        currentBattle: null,
        elapsedSeconds: 0,
        eventCount: 0,
        isLoading: false,
        error: null,
      });
    } catch (error) {
      logger.error('Failed to abandon battle', error as Error, 'SYSTEM');
    }
  }, [state.currentBattle]);

  const addEvent = useCallback(
    async (eventType: EventType, eventData: Record<string, unknown> = {}) => {
      if (!state.currentBattle) return;

      try {
        await bounceBackService.addEvent({
          battle_id: state.currentBattle.id,
          event_type: eventType,
          timestamp: Date.now(),
          event_data: eventData,
        });

        setState((prev) => ({ ...prev, eventCount: prev.eventCount + 1 }));
      } catch (error) {
        logger.error('Failed to add event', error as Error, 'SYSTEM');
      }
    },
    [state.currentBattle],
  );

  const addCopingResponse = useCallback(
    async (questionId: CopingQuestion, value: number) => {
      if (!state.currentBattle) return;

      try {
        await bounceBackService.addCopingResponse({
          battle_id: state.currentBattle.id,
          question_id: questionId,
          response_value: value,
        });
      } catch (error) {
        logger.error('Failed to add coping response', error as Error, 'SYSTEM');
      }
    },
    [state.currentBattle],
  );

  const reset = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }

    isPausedRef.current = false;
    startTimeRef.current = null;

    setState({
      phase: 'idle',
      currentBattle: null,
      elapsedSeconds: 0,
      eventCount: 0,
      isLoading: false,
      error: null,
    });
  }, []);

  return {
    ...state,
    createBattle,
    startBattle,
    pauseBattle,
    resumeBattle,
    completeBattle,
    abandonBattle,
    addEvent,
    addCopingResponse,
    reset,
  };
}
