/**
 * Hook de gamification avec persistence Supabase
 * Synchonise les points, challenges et achievements
 */

import { useState, useEffect, useCallback, type ReactNode } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { logger } from '@/lib/logger';

interface UserStats {
  totalPoints: number;
  level: number;
  rank: string;
  streak: number;
  completedChallenges: number;
  achievements: number;
}

interface Challenge {
  id: string;
  title: string;
  description: string;
  points: number;
  progress: number;
  maxProgress: number;
  category: 'daily' | 'weekly' | 'special';
  difficulty: 'facile' | 'moyen' | 'difficile';
  completed: boolean;
  deadline?: string;
}

interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: ReactNode;
  points: number;
  unlocked: boolean;
  unlockedAt?: string;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
}

interface GamificationData {
  userStats: UserStats;
  challenges: Challenge[];
  achievements: Achievement[];
}

const DEFAULT_STATS: UserStats = {
  totalPoints: 0,
  level: 1,
  rank: 'Débutant',
  streak: 0,
  completedChallenges: 0,
  achievements: 0
};

const DEFAULT_CHALLENGES: Challenge[] = [
  {
    id: '1',
    title: 'Scanner quotidien',
    description: 'Effectuez un scan émotionnel aujourd\'hui',
    points: 50,
    progress: 0,
    maxProgress: 1,
    category: 'daily',
    difficulty: 'facile',
    completed: false
  },
  {
    id: '2',
    title: 'Méditation guidée',
    description: 'Complétez 3 sessions de méditation cette semaine',
    points: 150,
    progress: 0,
    maxProgress: 3,
    category: 'weekly',
    difficulty: 'moyen',
    completed: false
  },
  {
    id: '3',
    title: 'Écoute musicale',
    description: 'Écoutez 5 morceaux thérapeutiques',
    points: 100,
    progress: 0,
    maxProgress: 5,
    category: 'daily',
    difficulty: 'facile',
    completed: false
  },
  {
    id: '4',
    title: 'Streak de 7 jours',
    description: 'Connectez-vous 7 jours consécutifs',
    points: 500,
    progress: 0,
    maxProgress: 7,
    category: 'special',
    difficulty: 'difficile',
    completed: false
  }
];

const DEFAULT_ACHIEVEMENTS: Achievement[] = [
  {
    id: '1',
    title: 'Premier Pas',
    description: 'Première connexion à l\'application',
    icon: null,
    points: 50,
    unlocked: false,
    rarity: 'common'
  },
  {
    id: '2',
    title: 'Mélomane',
    description: 'Écoutez 10 morceaux',
    icon: null,
    points: 100,
    unlocked: false,
    rarity: 'common'
  },
  {
    id: '3',
    title: 'Explorateur',
    description: 'Essayez toutes les catégories musicales',
    icon: null,
    points: 200,
    unlocked: false,
    rarity: 'rare'
  },
  {
    id: '4',
    title: 'Maître Zen',
    description: 'Complétez 10 parcours de transformation',
    icon: null,
    points: 500,
    unlocked: false,
    rarity: 'epic'
  }
];

const RANKS = [
  { level: 1, name: 'Débutant', minPoints: 0 },
  { level: 5, name: 'Explorateur Émotionnel', minPoints: 500 },
  { level: 10, name: 'Artiste Sonore', minPoints: 1500 },
  { level: 15, name: 'Maître des Émotions', minPoints: 3000 },
  { level: 20, name: 'Légende Musicale', minPoints: 5000 },
];

export const useGamification = () => {
  const { user } = useAuth();
  const [userStats, setUserStats] = useState<UserStats | null>(null);
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [loading, setLoading] = useState(true);

  // Calculer le niveau et rang basé sur les points
  const calculateLevelAndRank = useCallback((points: number): { level: number; rank: string } => {
    const level = Math.floor(points / 100) + 1;
    const rank = RANKS.reduce((acc, r) => (points >= r.minPoints ? r.name : acc), RANKS[0].name);
    return { level, rank };
  }, []);

  // Charger les données depuis Supabase
  const loadGamificationData = useCallback(async () => {
    setLoading(true);
    try {
      if (!user) {
        // Données par défaut pour utilisateurs non connectés
        setUserStats(DEFAULT_STATS);
        setChallenges(DEFAULT_CHALLENGES);
        setAchievements(DEFAULT_ACHIEVEMENTS);
        setLoading(false);
        return;
      }

      // Charger depuis Supabase
      const { data, error } = await supabase
        .from('user_settings')
        .select('value')
        .eq('user_id', user.id)
        .eq('key', 'gamification_data')
        .maybeSingle();

      if (error) throw error;

      if (data?.value) {
        const parsed = typeof data.value === 'string' ? JSON.parse(data.value) : data.value;
        const gamificationData = parsed as GamificationData;
        
        // Recalculer le niveau et rang
        const { level, rank } = calculateLevelAndRank(gamificationData.userStats.totalPoints);
        
        setUserStats({
          ...gamificationData.userStats,
          level,
          rank
        });
        setChallenges(gamificationData.challenges || DEFAULT_CHALLENGES);
        setAchievements(gamificationData.achievements || DEFAULT_ACHIEVEMENTS);
      } else {
        // Premier chargement: initialiser avec défauts
        const initialData: GamificationData = {
          userStats: { ...DEFAULT_STATS },
          challenges: DEFAULT_CHALLENGES,
          achievements: DEFAULT_ACHIEVEMENTS.map((a, i) => 
            i === 0 ? { ...a, unlocked: true, unlockedAt: new Date().toISOString() } : a
          )
        };
        
        // Premier pas achievement
        initialData.userStats.totalPoints = 50;
        initialData.userStats.achievements = 1;
        const { level, rank } = calculateLevelAndRank(50);
        initialData.userStats.level = level;
        initialData.userStats.rank = rank;
        
        setUserStats(initialData.userStats);
        setChallenges(initialData.challenges);
        setAchievements(initialData.achievements);
        
        // Sauvegarder immédiatement
        await saveToSupabase(initialData);
      }
    } catch (error) {
      logger.error('Error loading gamification data', error as Error, 'GAMIFICATION');
      // Fallback
      setUserStats(DEFAULT_STATS);
      setChallenges(DEFAULT_CHALLENGES);
      setAchievements(DEFAULT_ACHIEVEMENTS);
    } finally {
      setLoading(false);
    }
  }, [user, calculateLevelAndRank]);

  // Sauvegarder vers Supabase
  const saveToSupabase = useCallback(async (data: GamificationData) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('user_settings')
        .upsert({
          user_id: user.id,
          key: 'gamification_data',
          value: JSON.stringify(data),
          updated_at: new Date().toISOString()
        }, { onConflict: 'user_id,key' });

      if (error) throw error;
      logger.debug('Gamification data saved', {}, 'GAMIFICATION');
    } catch (error) {
      logger.error('Error saving gamification data', error as Error, 'GAMIFICATION');
    }
  }, [user]);

  // Effect pour sauvegarder automatiquement
  useEffect(() => {
    if (!user || !userStats || loading) return;

    const data: GamificationData = {
      userStats,
      challenges,
      achievements
    };

    const debounce = setTimeout(() => saveToSupabase(data), 500);
    return () => clearTimeout(debounce);
  }, [userStats, challenges, achievements, user, loading, saveToSupabase]);

  // Charger au montage
  useEffect(() => {
    loadGamificationData();
  }, [loadGamificationData]);

  // Mettre à jour le progrès d'un challenge
  const updateChallengeProgress = useCallback(async (challengeId: string, progressIncrement: number) => {
    setChallenges(prev => {
      const updated = prev.map(challenge => {
        if (challenge.id === challengeId && !challenge.completed) {
          const newProgress = Math.min(challenge.progress + progressIncrement, challenge.maxProgress);
          return { ...challenge, progress: newProgress };
        }
        return challenge;
      });
      return updated;
    });
  }, []);

  // Réclamer une récompense
  const claimReward = useCallback(async (challengeId: string) => {
    const challenge = challenges.find(c => c.id === challengeId);
    if (!challenge || challenge.completed || challenge.progress < challenge.maxProgress) return;

    setChallenges(prev => 
      prev.map(c => 
        c.id === challengeId 
          ? { ...c, completed: true }
          : c
      )
    );

    // Mettre à jour les stats
    setUserStats(prev => {
      if (!prev) return prev;
      const newPoints = prev.totalPoints + challenge.points;
      const { level, rank } = calculateLevelAndRank(newPoints);
      return {
        ...prev,
        totalPoints: newPoints,
        level,
        rank,
        completedChallenges: prev.completedChallenges + 1
      };
    });
  }, [challenges, calculateLevelAndRank]);

  // Débloquer un achievement
  const unlockAchievement = useCallback(async (achievementId: string) => {
    const achievement = achievements.find(a => a.id === achievementId);
    if (!achievement || achievement.unlocked) return;

    setAchievements(prev => 
      prev.map(a => 
        a.id === achievementId 
          ? { ...a, unlocked: true, unlockedAt: new Date().toISOString() }
          : a
      )
    );

    // Mettre à jour les stats
    setUserStats(prev => {
      if (!prev) return prev;
      const newPoints = prev.totalPoints + achievement.points;
      const { level, rank } = calculateLevelAndRank(newPoints);
      return {
        ...prev,
        totalPoints: newPoints,
        level,
        rank,
        achievements: prev.achievements + 1
      };
    });
  }, [achievements, calculateLevelAndRank]);

  // Ajouter des points directement
  const addPoints = useCallback((points: number) => {
    setUserStats(prev => {
      if (!prev) return prev;
      const newPoints = prev.totalPoints + points;
      const { level, rank } = calculateLevelAndRank(newPoints);
      return {
        ...prev,
        totalPoints: newPoints,
        level,
        rank
      };
    });
  }, [calculateLevelAndRank]);

  // Mettre à jour le streak
  const updateStreak = useCallback((newStreak: number) => {
    setUserStats(prev => {
      if (!prev) return prev;
      return { ...prev, streak: newStreak };
    });
  }, []);

  return {
    userStats,
    challenges,
    achievements,
    loading,
    updateChallengeProgress,
    claimReward,
    unlockAchievement,
    addPoints,
    updateStreak,
    refreshData: loadGamificationData
  };
};
