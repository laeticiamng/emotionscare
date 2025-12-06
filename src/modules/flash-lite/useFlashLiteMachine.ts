/**
 * Machine d'état pour flash-lite
 */

import { useState, useCallback, useRef, useEffect } from 'react';
import type { FlashLiteState, FlashLiteConfig, FlashCard } from './types';

const initialState: FlashLiteState = {
  status: 'idle',
  mode: null,
  currentCardIndex: 0,
  cards: [],
  startTime: null,
  cardStartTime: null,
  score: {
    correct: 0,
    incorrect: 0,
    total: 0
  },
  error: null
};

export function useFlashLiteMachine() {
  const [state, setState] = useState<FlashLiteState>(initialState);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const startSession = useCallback((config: FlashLiteConfig, cards: FlashCard[]) => {
    setState({
      ...initialState,
      status: 'active',
      mode: config.mode,
      cards,
      startTime: Date.now(),
      cardStartTime: Date.now()
    });
  }, []);

  const nextCard = useCallback((isCorrect: boolean) => {
    setState(prev => {
      const newScore = {
        ...prev.score,
        total: prev.score.total + 1,
        correct: isCorrect ? prev.score.correct + 1 : prev.score.correct,
        incorrect: !isCorrect ? prev.score.incorrect + 1 : prev.score.incorrect
      };

      const nextIndex = prev.currentCardIndex + 1;
      const isLastCard = nextIndex >= prev.cards.length;

      return {
        ...prev,
        currentCardIndex: nextIndex,
        cardStartTime: Date.now(),
        score: newScore,
        status: isLastCard ? 'completed' : 'active'
      };
    });
  }, []);

  const pauseSession = useCallback(() => {
    setState(prev => ({
      ...prev,
      status: 'paused'
    }));
  }, []);

  const resumeSession = useCallback(() => {
    setState(prev => ({
      ...prev,
      status: 'active',
      cardStartTime: Date.now()
    }));
  }, []);

  const completeSession = useCallback(() => {
    setState(prev => ({
      ...prev,
      status: 'completed'
    }));
  }, []);

  const reset = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    setState(initialState);
  }, []);

  const getElapsedTime = useCallback((): number => {
    if (!state.startTime) return 0;
    return Math.floor((Date.now() - state.startTime) / 1000);
  }, [state.startTime]);

  const getCardResponseTime = useCallback((): number => {
    if (!state.cardStartTime) return 0;
    return Date.now() - state.cardStartTime;
  }, [state.cardStartTime]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, []);

  return {
    state,
    startSession,
    nextCard,
    pauseSession,
    resumeSession,
    completeSession,
    reset,
    getElapsedTime,
    getCardResponseTime
  };
}
