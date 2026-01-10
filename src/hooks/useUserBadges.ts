/**
 * Hook pour gérer les badges utilisateur
 */

import { useState, useCallback, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/hooks/use-toast';
import { logger } from '@/lib/logger';

export interface UserBadge {
  id: string;
  badge_id: string;
  badge_name: string;
  badge_description?: string;
  badge_icon?: string;
  badge_rarity: 'common' | 'rare' | 'epic' | 'legendary';
  xp_earned: number;
  earned_at: string;
}

export interface BadgeDefinition {
  id: string;
  name: string;
  description: string;
  icon: string;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  xp_reward: number;
  condition: {
    type: 'sessions' | 'streak' | 'xp' | 'module' | 'achievement';
    value: number;
    module?: string;
  };
}

// Badges disponibles dans l'app
export const AVAILABLE_BADGES: BadgeDefinition[] = [
  {
    id: 'first_session',
    name: 'Premier Pas',
    description: 'Compléter sa première session',
    icon: '🎯',
    rarity: 'common',
    xp_reward: 50,
    condition: { type: 'sessions', value: 1 }
  },
  {
    id: 'streak_3',
    name: 'Régulier',
    description: '3 jours consécutifs d\'activité',
    icon: '🔥',
    rarity: 'common',
    xp_reward: 100,
    condition: { type: 'streak', value: 3 }
  },
  {
    id: 'streak_7',
    name: 'Habitué',
    description: '7 jours consécutifs d\'activité',
    icon: '⭐',
    rarity: 'rare',
    xp_reward: 250,
    condition: { type: 'streak', value: 7 }
  },
  {
    id: 'streak_30',
    name: 'Maître de la Constance',
    description: '30 jours consécutifs d\'activité',
    icon: '👑',
    rarity: 'legendary',
    xp_reward: 1000,
    condition: { type: 'streak', value: 30 }
  },
  {
    id: 'xp_500',
    name: 'Apprenti',
    description: 'Atteindre 500 XP',
    icon: '📚',
    rarity: 'common',
    xp_reward: 75,
    condition: { type: 'xp', value: 500 }
  },
  {
    id: 'xp_5000',
    name: 'Expert',
    description: 'Atteindre 5000 XP',
    icon: '🏆',
    rarity: 'epic',
    xp_reward: 500,
    condition: { type: 'xp', value: 5000 }
  },
  {
    id: 'breathwork_10',
    name: 'Souffle Maîtrisé',
    description: '10 sessions de respiration',
    icon: '🌬️',
    rarity: 'rare',
    xp_reward: 200,
    condition: { type: 'module', value: 10, module: 'breathwork' }
  },
  {
    id: 'meditation_10',
    name: 'Esprit Calme',
    description: '10 sessions de méditation',
    icon: '🧘',
    rarity: 'rare',
    xp_reward: 200,
    condition: { type: 'module', value: 10, module: 'meditation' }
  },
  {
    id: 'journal_10',
    name: 'Écrivain de l\'Âme',
    description: '10 entrées de journal',
    icon: '📝',
    rarity: 'rare',
    xp_reward: 200,
    condition: { type: 'module', value: 10, module: 'journal' }
  },
  {
    id: 'grit_master',
    name: 'Guerrier Résilient',
    description: 'Compléter 10 quêtes Boss Grit',
    icon: '⚔️',
    rarity: 'epic',
    xp_reward: 400,
    condition: { type: 'module', value: 10, module: 'boss_grit' }
  },
];

export function useUserBadges() {
  const { user } = useAuth();
  const [badges, setBadges] = useState<UserBadge[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchBadges = useCallback(async () => {
    if (!user) return;
    setIsLoading(true);

    try {
      const { data, error } = await supabase
        .from('user_badges')
        .select('*')
        .eq('user_id', user.id)
        .order('earned_at', { ascending: false });

      if (error) throw error;

      setBadges((data || []) as UserBadge[]);
    } catch (error) {
      logger.error('Failed to fetch user badges', error as Error, 'BADGES');
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  const awardBadge = useCallback(async (badgeId: string) => {
    if (!user) return null;

    // Vérifier si le badge est déjà obtenu
    if (badges.some(b => b.badge_id === badgeId)) {
      return null;
    }

    const badgeDef = AVAILABLE_BADGES.find(b => b.id === badgeId);
    if (!badgeDef) {
      logger.warn(`Badge ${badgeId} not found in definitions`, {}, 'BADGES');
      return null;
    }

    try {
      const { data, error } = await supabase
        .from('user_badges')
        .insert({
          user_id: user.id,
          badge_id: badgeId,
          badge_name: badgeDef.name,
          badge_description: badgeDef.description,
          badge_icon: badgeDef.icon,
          badge_rarity: badgeDef.rarity,
          xp_earned: badgeDef.xp_reward
        })
        .select()
        .single();

      if (error) {
        // Ignore duplicate key error
        if (error.code === '23505') return null;
        throw error;
      }

      const newBadge = data as UserBadge;
      setBadges(prev => [newBadge, ...prev]);

      // Notification toast
      toast({
        title: `🎉 Nouveau badge obtenu !`,
        description: `${badgeDef.icon} ${badgeDef.name} (+${badgeDef.xp_reward} XP)`,
      });

      return newBadge;
    } catch (error) {
      logger.error('Failed to award badge', error as Error, 'BADGES');
      return null;
    }
  }, [user, badges]);

  const checkAndAwardBadges = useCallback(async (context: {
    totalSessions?: number;
    currentStreak?: number;
    totalXP?: number;
    moduleCounts?: Record<string, number>;
  }) => {
    const earnedBadgeIds = badges.map(b => b.badge_id);
    
    for (const badge of AVAILABLE_BADGES) {
      if (earnedBadgeIds.includes(badge.id)) continue;

      let shouldAward = false;

      switch (badge.condition.type) {
        case 'sessions':
          shouldAward = (context.totalSessions || 0) >= badge.condition.value;
          break;
        case 'streak':
          shouldAward = (context.currentStreak || 0) >= badge.condition.value;
          break;
        case 'xp':
          shouldAward = (context.totalXP || 0) >= badge.condition.value;
          break;
        case 'module':
          const moduleCount = context.moduleCounts?.[badge.condition.module || ''] || 0;
          shouldAward = moduleCount >= badge.condition.value;
          break;
      }

      if (shouldAward) {
        await awardBadge(badge.id);
      }
    }
  }, [badges, awardBadge]);

  const getUnlockedCount = () => badges.length;
  const getTotalCount = () => AVAILABLE_BADGES.length;
  const getProgress = () => (badges.length / AVAILABLE_BADGES.length) * 100;

  useEffect(() => {
    fetchBadges();
  }, [fetchBadges]);

  return {
    badges,
    isLoading,
    availableBadges: AVAILABLE_BADGES,
    awardBadge,
    checkAndAwardBadges,
    fetchBadges,
    getUnlockedCount,
    getTotalCount,
    getProgress,
  };
}
