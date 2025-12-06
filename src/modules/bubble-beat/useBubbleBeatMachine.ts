/**
 * Bubble Beat State Machine
 * Gère l'état du jeu, le score et les interactions
 */

import { useState, useCallback, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import * as service from './bubbleBeatService';
import type {
  BubbleBeatState,
  BubbleDifficulty,
  BubbleMood,
  CreateBubbleBeatSession,
} from './types';

const INITIAL_STATE: BubbleBeatState = {
  phase: 'idle',
  session: null,
  score: 0,
  bubblesPopped: 0,
  startTime: null,
  error: null,
};

export function useBubbleBeatMachine() {
  const [state, setState] = useState<BubbleBeatState>(INITIAL_STATE);
  const { toast } = useToast();

  // ─────────────────────────────────────────────────────────────
  // Actions
  // ─────────────────────────────────────────────────────────────

  const startGame = useCallback(
    async (difficulty: BubbleDifficulty, mood: BubbleMood) => {
      try {
        setState(prev => ({ ...prev, phase: 'playing', error: null }));

        const payload: CreateBubbleBeatSession = { difficulty, mood };
        const session = await service.createSession(payload);

        setState(prev => ({
          ...prev,
          session,
          score: 0,
          bubblesPopped: 0,
          startTime: Date.now(),
        }));

        toast({
          title: 'Jeu démarré',
          description: 'Éclatez les bulles pour libérer le stress !',
        });
      } catch (err) {
        setState(prev => ({
          ...prev,
          phase: 'idle',
          error: err instanceof Error ? err.message : 'start_game_failed',
        }));
        toast({
          variant: 'destructive',
          title: 'Erreur',
          description: 'Impossible de démarrer le jeu.',
        });
      }
    },
    [toast],
  );

  const pauseGame = useCallback(() => {
    setState(prev => ({ ...prev, phase: 'paused' }));
    toast({
      title: 'Pause',
      description: 'Le jeu est en pause.',
    });
  }, [toast]);

  const resumeGame = useCallback(() => {
    setState(prev => ({ ...prev, phase: 'playing' }));
  }, []);

  const popBubble = useCallback((points: number) => {
    setState(prev => ({
      ...prev,
      score: prev.score + points,
      bubblesPopped: prev.bubblesPopped + 1,
    }));
  }, []);

  const endGame = useCallback(async () => {
    if (!state.session || !state.startTime) {
      setState(prev => ({ ...prev, phase: 'idle' }));
      return;
    }

    try {
      setState(prev => ({ ...prev, phase: 'completed' }));

      const duration = Math.floor((Date.now() - state.startTime) / 1000);

      await service.completeSession({
        session_id: state.session.id,
        score: state.score,
        bubbles_popped: state.bubblesPopped,
        duration_seconds: duration,
      });

      toast({
        title: 'Partie terminée',
        description: `Score final : ${state.score} points. Bravo !`,
      });

      // Reset after a delay
      setTimeout(() => {
        setState(INITIAL_STATE);
      }, 3000);
    } catch (err) {
      setState(prev => ({
        ...prev,
        phase: 'idle',
        error: err instanceof Error ? err.message : 'end_game_failed',
      }));
      toast({
        variant: 'destructive',
        title: 'Erreur',
        description: 'Impossible de sauvegarder la partie.',
      });
    }
  }, [state.session, state.startTime, state.score, state.bubblesPopped, toast]);

  // ─────────────────────────────────────────────────────────────
  // Auto-complete after 5 minutes
  // ─────────────────────────────────────────────────────────────

  useEffect(() => {
    if (state.phase === 'playing' && state.startTime) {
      const timeout = setTimeout(() => {
        endGame();
      }, 5 * 60 * 1000); // 5 minutes

      return () => clearTimeout(timeout);
    }
  }, [state.phase, state.startTime, endGame]);

  return {
    state,
    startGame,
    pauseGame,
    resumeGame,
    popBubble,
    endGame,
  };
}
