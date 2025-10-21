/**
 * Hook principal pour flash-lite
 */

import { useCallback, useRef } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useFlashLiteMachine } from './useFlashLiteMachine';
import { FlashLiteService } from './flashLiteService';
import type { FlashLiteMode, FlashCard } from './types';
import { logger } from '@/lib/logger';

export function useFlashLite() {
  const { user } = useAuth();
  const machine = useFlashLiteMachine();
  const sessionIdRef = useRef<string | null>(null);

  const startFlashLite = useCallback(async (
    mode: FlashLiteMode,
    category?: string,
    cardsCount: number = 10
  ) => {
    if (!user?.id) {
      machine.state.error = 'User not authenticated';
      return;
    }

    try {
      // Créer la session
      const session = await FlashLiteService.createSession(
        user.id,
        mode,
        category,
        cardsCount
      );
      sessionIdRef.current = session.id;

      // Générer des cartes de démonstration (à remplacer par vraies cartes)
      const demoCards: FlashCard[] = Array.from({ length: cardsCount }, (_, i) => ({
        id: `temp-${i}`,
        session_id: session.id,
        question: `Question ${i + 1}: Quelle est la réponse à cette question?`,
        answer: `Réponse ${i + 1}`,
        difficulty: i % 3 === 0 ? 'easy' : i % 3 === 1 ? 'medium' : 'hard',
        created_at: new Date().toISOString()
      }));

      // Démarrer la machine
      machine.startSession({ mode, category, cardsCount }, demoCards);
    } catch (error) {
      logger.error('Failed to start flash lite session', error as Error, 'SYSTEM');
      machine.state.error = 'Failed to start session';
    }
  }, [user?.id, machine]);

  const answerCard = useCallback(async (answer: string, isCorrect: boolean) => {
    if (!sessionIdRef.current) return;

    const responseTime = machine.getCardResponseTime();
    const currentCard = machine.state.cards[machine.state.currentCardIndex];

    try {
      // Enregistrer la réponse
      if (currentCard && currentCard.id.startsWith('temp-')) {
        // Pour les cartes temporaires, juste avancer
        machine.nextCard(isCorrect);
      } else if (currentCard) {
        await FlashLiteService.updateCardAnswer(
          currentCard.id,
          answer,
          isCorrect,
          responseTime
        );
        machine.nextCard(isCorrect);
      }
    } catch (error) {
      logger.error('Failed to record answer', error as Error, 'SYSTEM');
    }
  }, [machine]);

  const completeFlashLite = useCallback(async (notes?: string) => {
    if (!sessionIdRef.current) return;

    const elapsedTime = machine.getElapsedTime();
    const { score } = machine.state;

    try {
      await FlashLiteService.completeSession(sessionIdRef.current, {
        cards_completed: score.total,
        cards_correct: score.correct,
        duration_seconds: elapsedTime,
        average_response_time: score.total > 0 ? elapsedTime / score.total : 0,
        accuracy_percentage: score.total > 0 ? (score.correct / score.total) * 100 : 0,
        notes
      });

      machine.completeSession();
    } catch (error) {
      logger.error('Failed to complete flash lite session', error as Error, 'SYSTEM');
    }
  }, [machine]);

  return {
    status: machine.state.status,
    mode: machine.state.mode,
    currentCardIndex: machine.state.currentCardIndex,
    currentCard: machine.state.cards[machine.state.currentCardIndex],
    totalCards: machine.state.cards.length,
    score: machine.state.score,
    error: machine.state.error,
    elapsedTime: machine.getElapsedTime(),
    startFlashLite,
    answerCard,
    pauseFlashLite: machine.pauseSession,
    resumeFlashLite: machine.resumeSession,
    completeFlashLite,
    reset: machine.reset
  };
}
