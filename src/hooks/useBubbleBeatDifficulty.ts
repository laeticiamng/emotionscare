/**
 * Hook pour les niveaux de difficulté Bubble Beat
 * TOP 5 #2 Modules - Système de difficultés progressives
 */

import { useState, useCallback, useMemo } from 'react';
import { useToast } from '@/hooks/use-toast';

export type DifficultyLevel = 'beginner' | 'easy' | 'medium' | 'hard' | 'expert' | 'master';

export interface DifficultyConfig {
  id: DifficultyLevel;
  name: string;
  description: string;
  bubbleSpeed: number; // 0.5 to 3
  spawnRate: number; // bubbles per second
  minBubbleSize: number;
  maxBubbleSize: number;
  scoreMultiplier: number;
  comboDecay: number; // seconds before combo resets
  specialBubbleChance: number; // 0 to 1
  distractorCount: number;
  timeLimit: number; // seconds, 0 = unlimited
  unlockRequirement: {
    minLevel?: number;
    minScore?: number;
    minSessions?: number;
  };
  rewards: {
    xpBonus: number;
    badgeId?: string;
  };
}

const DIFFICULTY_CONFIGS: Record<DifficultyLevel, DifficultyConfig> = {
  beginner: {
    id: 'beginner',
    name: 'Débutant',
    description: 'Parfait pour apprendre les bases',
    bubbleSpeed: 0.5,
    spawnRate: 0.8,
    minBubbleSize: 60,
    maxBubbleSize: 100,
    scoreMultiplier: 0.5,
    comboDecay: 5,
    specialBubbleChance: 0.1,
    distractorCount: 0,
    timeLimit: 0,
    unlockRequirement: {},
    rewards: { xpBonus: 10 }
  },
  easy: {
    id: 'easy',
    name: 'Facile',
    description: 'Un défi accessible pour tous',
    bubbleSpeed: 0.8,
    spawnRate: 1.2,
    minBubbleSize: 50,
    maxBubbleSize: 90,
    scoreMultiplier: 0.75,
    comboDecay: 4,
    specialBubbleChance: 0.15,
    distractorCount: 1,
    timeLimit: 0,
    unlockRequirement: { minSessions: 3 },
    rewards: { xpBonus: 25 }
  },
  medium: {
    id: 'medium',
    name: 'Moyen',
    description: 'Le mode standard équilibré',
    bubbleSpeed: 1.2,
    spawnRate: 1.5,
    minBubbleSize: 40,
    maxBubbleSize: 80,
    scoreMultiplier: 1,
    comboDecay: 3,
    specialBubbleChance: 0.2,
    distractorCount: 2,
    timeLimit: 180,
    unlockRequirement: { minLevel: 3 },
    rewards: { xpBonus: 50 }
  },
  hard: {
    id: 'hard',
    name: 'Difficile',
    description: 'Pour les joueurs expérimentés',
    bubbleSpeed: 1.8,
    spawnRate: 2,
    minBubbleSize: 35,
    maxBubbleSize: 70,
    scoreMultiplier: 1.5,
    comboDecay: 2,
    specialBubbleChance: 0.25,
    distractorCount: 3,
    timeLimit: 120,
    unlockRequirement: { minLevel: 5, minScore: 5000 },
    rewards: { xpBonus: 100, badgeId: 'bubble-warrior' }
  },
  expert: {
    id: 'expert',
    name: 'Expert',
    description: 'Réservé aux maîtres du jeu',
    bubbleSpeed: 2.5,
    spawnRate: 2.5,
    minBubbleSize: 30,
    maxBubbleSize: 60,
    scoreMultiplier: 2,
    comboDecay: 1.5,
    specialBubbleChance: 0.3,
    distractorCount: 4,
    timeLimit: 90,
    unlockRequirement: { minLevel: 10, minScore: 15000 },
    rewards: { xpBonus: 200, badgeId: 'bubble-expert' }
  },
  master: {
    id: 'master',
    name: 'Maître',
    description: 'Le défi ultime',
    bubbleSpeed: 3,
    spawnRate: 3,
    minBubbleSize: 25,
    maxBubbleSize: 50,
    scoreMultiplier: 3,
    comboDecay: 1,
    specialBubbleChance: 0.4,
    distractorCount: 5,
    timeLimit: 60,
    unlockRequirement: { minLevel: 20, minScore: 50000 },
    rewards: { xpBonus: 500, badgeId: 'bubble-master' }
  }
};

interface UserProgress {
  level: number;
  totalScore: number;
  totalSessions: number;
}

export function useBubbleBeatDifficulty(userProgress: UserProgress) {
  const { toast } = useToast();
  const [currentDifficulty, setCurrentDifficulty] = useState<DifficultyLevel>('beginner');

  const availableDifficulties = useMemo(() => {
    return Object.values(DIFFICULTY_CONFIGS).filter(config => {
      const req = config.unlockRequirement;
      if (req.minLevel && userProgress.level < req.minLevel) return false;
      if (req.minScore && userProgress.totalScore < req.minScore) return false;
      if (req.minSessions && userProgress.totalSessions < req.minSessions) return false;
      return true;
    });
  }, [userProgress]);

  const lockedDifficulties = useMemo(() => {
    return Object.values(DIFFICULTY_CONFIGS).filter(config => {
      const req = config.unlockRequirement;
      if (req.minLevel && userProgress.level < req.minLevel) return true;
      if (req.minScore && userProgress.totalScore < req.minScore) return true;
      if (req.minSessions && userProgress.totalSessions < req.minSessions) return true;
      return false;
    });
  }, [userProgress]);

  const currentConfig = useMemo(() => {
    return DIFFICULTY_CONFIGS[currentDifficulty];
  }, [currentDifficulty]);

  const selectDifficulty = useCallback((difficulty: DifficultyLevel) => {
    const config = DIFFICULTY_CONFIGS[difficulty];
    const req = config.unlockRequirement;

    // Vérifier les prérequis
    if (req.minLevel && userProgress.level < req.minLevel) {
      toast({
        title: '🔒 Difficulté verrouillée',
        description: `Niveau ${req.minLevel} requis (vous êtes niveau ${userProgress.level})`,
        variant: 'destructive'
      });
      return false;
    }

    if (req.minScore && userProgress.totalScore < req.minScore) {
      toast({
        title: '🔒 Difficulté verrouillée',
        description: `Score total de ${req.minScore.toLocaleString()} requis`,
        variant: 'destructive'
      });
      return false;
    }

    if (req.minSessions && userProgress.totalSessions < req.minSessions) {
      toast({
        title: '🔒 Difficulté verrouillée',
        description: `${req.minSessions} sessions requises`,
        variant: 'destructive'
      });
      return false;
    }

    setCurrentDifficulty(difficulty);
    toast({
      title: `🎮 Difficulté: ${config.name}`,
      description: config.description
    });
    return true;
  }, [userProgress, toast]);

  const getProgressToUnlock = useCallback((difficulty: DifficultyLevel) => {
    const config = DIFFICULTY_CONFIGS[difficulty];
    const req = config.unlockRequirement;
    
    const progress: { type: string; current: number; required: number; percent: number }[] = [];

    if (req.minLevel) {
      progress.push({
        type: 'level',
        current: userProgress.level,
        required: req.minLevel,
        percent: Math.min(100, (userProgress.level / req.minLevel) * 100)
      });
    }

    if (req.minScore) {
      progress.push({
        type: 'score',
        current: userProgress.totalScore,
        required: req.minScore,
        percent: Math.min(100, (userProgress.totalScore / req.minScore) * 100)
      });
    }

    if (req.minSessions) {
      progress.push({
        type: 'sessions',
        current: userProgress.totalSessions,
        required: req.minSessions,
        percent: Math.min(100, (userProgress.totalSessions / req.minSessions) * 100)
      });
    }

    return progress;
  }, [userProgress]);

  const recommendedDifficulty = useMemo((): DifficultyLevel => {
    // Recommander la difficulté la plus élevée accessible basée sur le niveau
    if (userProgress.level >= 20) return 'master';
    if (userProgress.level >= 10) return 'expert';
    if (userProgress.level >= 5) return 'hard';
    if (userProgress.level >= 3) return 'medium';
    if (userProgress.totalSessions >= 3) return 'easy';
    return 'beginner';
  }, [userProgress]);

  return {
    currentDifficulty,
    currentConfig,
    availableDifficulties,
    lockedDifficulties,
    selectDifficulty,
    getProgressToUnlock,
    recommendedDifficulty,
    allConfigs: DIFFICULTY_CONFIGS
  };
}

export { DIFFICULTY_CONFIGS };
