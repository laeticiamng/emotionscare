import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

interface UserStats {
  level: number;
  total_points: number;
  streak_days: number;
  completed_challenges: number;
  total_badges: number;
  rank: string;
}

interface Challenge {
  id: string;
  title: string;
  description: string;
  category: 'emotional' | 'physical' | 'mental' | 'social';
  difficulty: 'facile' | 'moyen' | 'difficile';
  points: number;
  progress: number;
  target_value: number;
  completed: boolean;
  expires_at: string;
  type: 'count' | 'duration' | 'completion';
  created_at: string;
  completed_at?: string;
}

interface Achievement {
  id: string;
  name: string;
  description: string;
  category: string;
  rarity: 'common' | 'rare' | 'epic' | 'legendary' | 'mythic';
  icon: string;
  conditions: any[];
  rewards: any;
  is_hidden: boolean;
  unlocked?: boolean;
  unlocked_at?: string;
  progress?: number;
}

interface PointsHistoryEntry {
  id: string;
  points: number;
  reason: string;
  created_at: string;
  challenge_id?: string;
}

export const useEnhancedGamification = () => {
  const [userStats, setUserStats] = useState<UserStats | null>(null);
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [pointsHistory, setPointsHistory] = useState<PointsHistoryEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadGamificationData();
  }, []);

  const loadGamificationData = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        setError('User not authenticated');
        return;
      }

      // Charger ou créer les statistiques utilisateur
      const { data: statsData, error: statsError } = await supabase
        .from('user_stats')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle();

      if (statsError && statsError.code !== 'PGRST116') {
        throw statsError;
      }

      if (!statsData) {
        // Créer les stats initiales
        const { data: newStats, error: createError } = await supabase
          .from('user_stats')
          .insert({
            user_id: user.id,
            level: 1,
            total_points: 0,
            streak_days: 0,
            completed_challenges: 0,
            total_badges: 0,
            rank: 'Novice'
          })
          .select()
          .single();

        if (createError) throw createError;
        setUserStats(newStats);
      } else {
        setUserStats(statsData);
      }

      // Charger les défis actifs
      const { data: challengesData, error: challengesError } = await supabase
        .from('challenges')
        .select('*')
        .eq('user_id', user.id)
        .gt('expires_at', new Date().toISOString())
        .order('created_at', { ascending: false });

      if (challengesError) throw challengesError;
      setChallenges(challengesData || []);

      // Charger tous les achievements disponibles
      const { data: allAchievements, error: achError } = await supabase
        .from('achievements')
        .select('*')
        .order('created_at');

      if (achError) throw achError;

      // Charger les achievements débloqués par l'utilisateur
      const { data: userAchievements, error: userAchError } = await supabase
        .from('user_achievements')
        .select('*')
        .eq('user_id', user.id);

      if (userAchError) throw userAchError;

      // Combiner les données
      const enhancedAchievements = (allAchievements || []).map(achievement => {
        const userAch = userAchievements?.find(ua => ua.achievement_id === achievement.id);
        return {
          ...achievement,
          unlocked: !!userAch,
          unlocked_at: userAch?.unlocked_at,
          progress: userAch?.progress || 0
        };
      });

      setAchievements(enhancedAchievements);

      // Charger l'historique des points
      const { data: historyData, error: historyError } = await supabase
        .from('points_history')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(50);

      if (historyError) throw historyError;
      setPointsHistory(historyData || []);

    } catch (err: any) {
      console.error('Error loading gamification data:', err);
      setError(err.message || 'Failed to load gamification data');
      toast({
        title: "Erreur",
        description: "Impossible de charger les données de gamification",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const generateDailyChallenges = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return false;

      const { data, error } = await supabase.functions.invoke('generate-daily-challenges', {
        body: {
          user_id: user.id,
          user_level: userStats?.level || 1,
          preferred_categories: ['emotional', 'mental', 'physical', 'social']
        }
      });

      if (error) throw error;

      if (data?.success) {
        // Recharger les défis
        const { data: newChallenges } = await supabase
          .from('challenges')
          .select('*')
          .eq('user_id', user.id)
          .gt('expires_at', new Date().toISOString())
          .order('created_at', { ascending: false });

        setChallenges(newChallenges || []);
        
        toast({
          title: "Nouveaux défis générés!",
          description: `${data.challenges?.length || 0} défis quotidiens vous attendent`,
        });
        
        return true;
      }
      
      return false;
    } catch (error: any) {
      console.error('Error generating challenges:', error);
      toast({
        title: "Erreur",
        description: "Impossible de générer de nouveaux défis",
        variant: "destructive"
      });
      return false;
    }
  };

  const updateChallengeProgress = async (challengeId: string, newProgress: number) => {
    try {
      const challenge = challenges.find(c => c.id === challengeId);
      if (!challenge) return false;

      const isCompleted = newProgress >= challenge.target_value;
      
      const { error } = await supabase
        .from('challenges')
        .update({ 
          progress: newProgress, 
          completed: isCompleted,
          completed_at: isCompleted ? new Date().toISOString() : null
        })
        .eq('id', challengeId);

      if (error) throw error;

      // Mettre à jour localement
      setChallenges(prev => 
        prev.map(c => 
          c.id === challengeId 
            ? { ...c, progress: newProgress, completed: isCompleted }
            : c
        )
      );

      if (isCompleted) {
        toast({
          title: "Défi complété!",
          description: `Vous avez gagné ${challenge.points} points`,
        });

        // Recharger les stats pour voir les points mis à jour
        setTimeout(() => {
          loadGamificationData();
        }, 1000);
      }

      return true;
    } catch (error: any) {
      console.error('Error updating challenge progress:', error);
      toast({
        title: "Erreur",
        description: "Impossible de mettre à jour le défi",
        variant: "destructive"
      });
      return false;
    }
  };

  const unlockAchievement = async (achievementId: string, progress: number = 100) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return false;

      const { error } = await supabase
        .from('user_achievements')
        .upsert({
          user_id: user.id,
          achievement_id: achievementId,
          progress,
          unlocked_at: new Date().toISOString()
        });

      if (error) throw error;

      // Mettre à jour localement
      setAchievements(prev => 
        prev.map(a => 
          a.id === achievementId 
            ? { ...a, unlocked: true, unlocked_at: new Date().toISOString(), progress }
            : a
        )
      );

      const achievement = achievements.find(a => a.id === achievementId);
      if (achievement) {
        toast({
          title: "Achievement débloqué!",
          description: achievement.name,
        });
      }

      return true;
    } catch (error: any) {
      console.error('Error unlocking achievement:', error);
      return false;
    }
  };

  const calculateLevelProgress = () => {
    if (!userStats) return { current: 0, needed: 100, percentage: 0 };
    
    const baseXP = 100;
    const currentLevelXP = baseXP * Math.pow(1.5, userStats.level - 1);
    const nextLevelXP = baseXP * Math.pow(1.5, userStats.level);
    const progressXP = userStats.total_points - currentLevelXP;
    const neededXP = nextLevelXP - currentLevelXP;
    
    return {
      current: Math.max(0, progressXP),
      needed: neededXP,
      percentage: Math.min(100, (progressXP / neededXP) * 100)
    };
  };

  const getActiveChallenges = () => challenges.filter(c => !c.completed);
  const getCompletedChallenges = () => challenges.filter(c => c.completed);
  const getUnlockedAchievements = () => achievements.filter(a => a.unlocked);
  const getLockedAchievements = () => achievements.filter(a => !a.unlocked);

  return {
    // State
    userStats,
    challenges,
    achievements,
    pointsHistory,
    loading,
    error,

    // Actions
    loadGamificationData,
    generateDailyChallenges,
    updateChallengeProgress,
    unlockAchievement,

    // Computed values
    levelProgress: calculateLevelProgress(),
    activeChallenges: getActiveChallenges(),
    completedChallenges: getCompletedChallenges(),
    unlockedAchievements: getUnlockedAchievements(),
    lockedAchievements: getLockedAchievements(),

    // Stats
    totalAchievements: achievements.length,
    unlockedAchievementsCount: getUnlockedAchievements().length,
    activeChallengesCount: getActiveChallenges().length,
    completedChallengesCount: getCompletedChallenges().length
  };
};