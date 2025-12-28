/**
 * Hook pour déclencher des confettis lors d'achievements
 */
import { useCallback } from 'react';
import confetti from 'canvas-confetti';

interface ConfettiOptions {
  particleCount?: number;
  spread?: number;
  origin?: { x?: number; y?: number };
  colors?: string[];
  startVelocity?: number;
  decay?: number;
  scalar?: number;
}

export function useConfetti() {
  const fireConfetti = useCallback((options?: ConfettiOptions) => {
    confetti({
      particleCount: options?.particleCount || 100,
      spread: options?.spread || 70,
      origin: options?.origin || { y: 0.6 },
      colors: options?.colors || ['#FFD700', '#FFA500', '#FF6347', '#9400D3', '#00CED1'],
    });
  }, []);

  const fireAchievementConfetti = useCallback(() => {
    // Double burst for achievements
    const count = 200;
    const defaults = {
      origin: { y: 0.7 }
    };

    const fire = (particleRatio: number, opts: ConfettiOptions) => {
      confetti({
        ...defaults,
        ...opts,
        particleCount: Math.floor(count * particleRatio)
      });
    };

    fire(0.25, {
      spread: 26,
      startVelocity: 55,
    });
    fire(0.2, {
      spread: 60,
    });
    fire(0.35, {
      spread: 100,
      decay: 0.91,
      scalar: 0.8
    });
    fire(0.1, {
      spread: 120,
      startVelocity: 25,
      decay: 0.92,
      scalar: 1.2
    });
    fire(0.1, {
      spread: 120,
      startVelocity: 45,
    });
  }, []);

  const fireGoalCompleteConfetti = useCallback(() => {
    confetti({
      particleCount: 150,
      spread: 90,
      origin: { y: 0.5 },
      colors: ['#22c55e', '#16a34a', '#15803d', '#166534', '#4ade80'],
    });
  }, []);

  const fireQuestCompleteConfetti = useCallback(() => {
    confetti({
      particleCount: 50,
      spread: 60,
      origin: { y: 0.7 },
      colors: ['#3b82f6', '#60a5fa', '#93c5fd', '#6366f1'],
    });
  }, []);

  return { fireConfetti, fireAchievementConfetti, fireGoalCompleteConfetti, fireQuestCompleteConfetti };
}
