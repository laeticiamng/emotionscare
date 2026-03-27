// @ts-nocheck
/**
 * Hook pour afficher des notifications toast automatiques lors des changements de stats
 * Détecte les nouveaux badges, niveaux, objectifs et affiche des notifications animées avec sons
 */

import { useEffect, useRef } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Trophy, Flame, Target, TrendingUp } from 'lucide-react';
import confetti from 'canvas-confetti';

export interface UserStats {
  weeklyGoals: number;
  completedSessions: number;
  totalPoints: number;
  currentStreak: number;
  level: number;
  rank: string;
}

// Sons pour les notifications
const playSound = (type: 'badge' | 'level' | 'goal' | 'streak') => {
  const context = new AudioContext();
  const oscillator = context.createOscillator();
  const gainNode = context.createGain();
  
  oscillator.connect(gainNode);
  gainNode.connect(context.destination);
  
  // Fréquences différentes selon le type
  const frequencies = {
    badge: [523.25, 659.25, 783.99], // C5, E5, G5
    level: [523.25, 659.25, 783.99, 1046.50], // C5, E5, G5, C6
    goal: [392, 523.25, 659.25], // G4, C5, E5
    streak: [659.25, 783.99] // E5, G5
  };
  
  const freqs = frequencies[type];
  
  freqs.forEach((freq, index) => {
    setTimeout(() => {
      oscillator.frequency.setValueAtTime(freq, context.currentTime);
      gainNode.gain.setValueAtTime(0.3, context.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, context.currentTime + 0.2);
      oscillator.start(context.currentTime);
      oscillator.stop(context.currentTime + 0.2);
    }, index * 100);
  });
};

// Confetti pour les grandes célébrations
const triggerConfetti = () => {
  const count = 200;
  const defaults = {
    origin: { y: 0.7 }
  };

  function fire(particleRatio: number, opts: any) {
    confetti({
      ...defaults,
      ...opts,
      particleCount: Math.floor(count * particleRatio)
    });
  }

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
};

export function useStatsNotifications(currentStats: UserStats | null, loading: boolean) {
  const { toast } = useToast();
  const previousStats = useRef<UserStats | null>(null);
  const isFirstRender = useRef(true);

  useEffect(() => {
    // Ne rien faire au premier render ou si loading
    if (isFirstRender.current || loading || !currentStats) {
      isFirstRender.current = false;
      previousStats.current = currentStats;
      return;
    }

    const prev = previousStats.current;
    if (!prev) {
      previousStats.current = currentStats;
      return;
    }

    // Détecter les changements et afficher les notifications

    // Nouveau niveau atteint
    if (currentStats.level > prev.level) {
      playSound('level');
      triggerConfetti();
      toast({
        title: "🎉 Nouveau niveau !",
        description: `Félicitations ! Vous avez atteint le niveau ${currentStats.level}`,
        duration: 5000,
      });
    }

    // Nouveau rang atteint
    if (currentStats.rank !== prev.rank) {
      playSound('badge');
      toast({
        title: "⭐ Nouveau rang débloqué !",
        description: `Vous êtes maintenant ${currentStats.rank}`,
        duration: 4000,
      });
    }

    // Objectifs hebdomadaires complétés
    if (currentStats.weeklyGoals > prev.weeklyGoals) {
      const newGoals = currentStats.weeklyGoals - prev.weeklyGoals;
      playSound('goal');
      toast({
        title: "🎯 Objectif complété !",
        description: `${newGoals} objectif${newGoals > 1 ? 's' : ''} hebdomadaire${newGoals > 1 ? 's' : ''} atteint${newGoals > 1 ? 's' : ''} !`,
        duration: 4000,
      });
    }

    // Série de jours consécutifs
    if (currentStats.currentStreak > prev.currentStreak) {
      playSound('streak');
      
      // Célébration spéciale pour certaines étapes
      if (currentStats.currentStreak % 7 === 0) {
        triggerConfetti();
        toast({
          title: "🔥 Série incroyable !",
          description: `${currentStats.currentStreak} jours consécutifs ! Vous êtes en feu !`,
          duration: 5000,
        });
      } else {
        toast({
          title: "🔥 Série maintenue !",
          description: `${currentStats.currentStreak} jours consécutifs`,
          duration: 3000,
        });
      }
    }

    // Paliers de points importants
    const pointMilestones = [100, 500, 1000, 2500, 5000, 10000];
    const prevMilestone = pointMilestones.filter(m => prev.totalPoints >= m).length;
    const currentMilestone = pointMilestones.filter(m => currentStats.totalPoints >= m).length;
    
    if (currentMilestone > prevMilestone) {
      const milestone = pointMilestones[currentMilestone - 1];
      playSound('badge');
      triggerConfetti();
      toast({
        title: "💎 Palier atteint !",
        description: `Vous avez dépassé ${milestone} points !`,
        duration: 5000,
      });
    }

    // Mettre à jour la référence
    previousStats.current = currentStats;
  }, [currentStats, loading, toast]);
}
