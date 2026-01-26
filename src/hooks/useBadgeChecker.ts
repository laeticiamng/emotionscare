/**
 * Hook pour vérifier et attribuer automatiquement les badges
 */

import { useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { logger } from '@/lib/logger';
import { toast } from '@/hooks/use-toast';

interface BadgeCondition {
  badge_id: string;
  badge_name: string;
  badge_icon: string;
  condition_type: 'quests_completed' | 'total_xp' | 'streak' | 'sessions' | 'level';
  condition_value: number;
}

// Badges prédéfinis
const BADGES: BadgeCondition[] = [
  { badge_id: 'first_quest', badge_name: 'Première Quête', badge_icon: '🎯', condition_type: 'quests_completed', condition_value: 1 },
  { badge_id: 'quest_warrior', badge_name: 'Guerrier des Quêtes', badge_icon: '⚔️', condition_type: 'quests_completed', condition_value: 10 },
  { badge_id: 'quest_master', badge_name: 'Maître des Quêtes', badge_icon: '👑', condition_type: 'quests_completed', condition_value: 50 },
  { badge_id: 'xp_collector', badge_name: 'Collecteur XP', badge_icon: '⭐', condition_type: 'total_xp', condition_value: 500 },
  { badge_id: 'xp_master', badge_name: 'Maître XP', badge_icon: '🌟', condition_type: 'total_xp', condition_value: 2000 },
  { badge_id: 'xp_legend', badge_name: 'Légende XP', badge_icon: '💫', condition_type: 'total_xp', condition_value: 10000 },
  { badge_id: 'streak_3', badge_name: 'Série de 3', badge_icon: '🔥', condition_type: 'streak', condition_value: 3 },
  { badge_id: 'streak_7', badge_name: 'Semaine Parfaite', badge_icon: '🔥', condition_type: 'streak', condition_value: 7 },
  { badge_id: 'streak_30', badge_name: 'Mois Parfait', badge_icon: '🔥', condition_type: 'streak', condition_value: 30 },
  { badge_id: 'level_5', badge_name: 'Niveau 5', badge_icon: '🏅', condition_type: 'level', condition_value: 5 },
  { badge_id: 'level_10', badge_name: 'Niveau 10', badge_icon: '🥇', condition_type: 'level', condition_value: 10 },
  { badge_id: 'level_25', badge_name: 'Niveau 25', badge_icon: '🏆', condition_type: 'level', condition_value: 25 },
];

interface UserStats {
  questsCompleted: number;
  totalXP: number;
  currentStreak: number;
  level: number;
  sessionsCompleted: number;
}

export function useBadgeChecker() {
  const { user } = useAuth();

  const checkAndAwardBadges = useCallback(async (stats: UserStats) => {
    if (!user) return;

    try {
      // Récupérer les badges déjà obtenus
      const { data: existingBadges, error: fetchError } = await supabase
        .from('user_badges')
        .select('badge_id')
        .eq('user_id', user.id);

      if (fetchError) throw fetchError;

      const earnedBadgeIds = new Set((existingBadges || []).map(b => b.badge_id));

      // Vérifier chaque badge
      const newBadges: BadgeCondition[] = [];

      for (const badge of BADGES) {
        if (earnedBadgeIds.has(badge.badge_id)) continue;

        let earned = false;
        switch (badge.condition_type) {
          case 'quests_completed':
            earned = stats.questsCompleted >= badge.condition_value;
            break;
          case 'total_xp':
            earned = stats.totalXP >= badge.condition_value;
            break;
          case 'streak':
            earned = stats.currentStreak >= badge.condition_value;
            break;
          case 'level':
            earned = stats.level >= badge.condition_value;
            break;
          case 'sessions':
            earned = stats.sessionsCompleted >= badge.condition_value;
            break;
        }

        if (earned) {
          newBadges.push(badge);
        }
      }

      // Attribuer les nouveaux badges
      if (newBadges.length > 0) {
        const inserts = newBadges.map(badge => ({
          user_id: user.id,
          badge_id: badge.badge_id,
          badge_name: badge.badge_name,
          badge_icon: badge.badge_icon,
          earned_at: new Date().toISOString()
        }));

        const { error: insertError } = await supabase
          .from('user_badges')
          .insert(inserts);

        if (insertError) throw insertError;

        // Afficher les toasts pour chaque nouveau badge
        for (const badge of newBadges) {
          toast({
            title: `${badge.badge_icon} Nouveau badge débloqué !`,
            description: badge.badge_name
          });
        }

        logger.info(`Awarded ${newBadges.length} new badges`, { badges: newBadges.map(b => b.badge_id) }, 'BADGES');
      }

      return newBadges;
    } catch (error) {
      logger.error('Failed to check badges', error as Error, 'BADGES');
      return [];
    }
  }, [user]);

  const fetchUserStats = useCallback(async (): Promise<UserStats | null> => {
    if (!user) return null;

    try {
      // Fetch boss grit quests
      const { data: quests } = await supabase
        .from('boss_grit_quests')
        .select('xp_earned, success')
        .eq('user_id', user.id);

      const completedQuests = (quests || []).filter(q => q.success);
      const totalXP = completedQuests.reduce((sum, q) => sum + (q.xp_earned || 0), 0);

      // Fetch bubble beat sessions
      const { data: bubbleSessions } = await supabase
        .from('bubble_beat_sessions')
        .select('id')
        .eq('user_id', user.id);

      // Calculate level
      const level = Math.floor(totalXP / 500) + 1;

      return {
        questsCompleted: completedQuests.length,
        totalXP,
        currentStreak: 0, // Would need more complex calculation
        level,
        sessionsCompleted: (bubbleSessions || []).length
      };
    } catch (error) {
      logger.error('Failed to fetch user stats for badges', error as Error, 'BADGES');
      return null;
    }
  }, [user]);

  const runBadgeCheck = useCallback(async () => {
    const stats = await fetchUserStats();
    if (stats) {
      return await checkAndAwardBadges(stats);
    }
    return [];
  }, [fetchUserStats, checkAndAwardBadges]);

  return {
    checkAndAwardBadges,
    runBadgeCheck,
    fetchUserStats
  };
}
