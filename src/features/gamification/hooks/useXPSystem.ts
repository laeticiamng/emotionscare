// @ts-nocheck
/**
 * useXPSystem - Hook central pour la gestion de l'XP
 */

import { useState, useCallback, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import type { XPEvent, XPAction, UserLevel, LevelConfig } from '../types';
import { toast } from 'sonner';
import { logger } from '@/lib/logger';

// Configuration des niveaux
const LEVEL_CONFIG: LevelConfig[] = [
  { level: 1, xp_required: 0, title: 'Débutant', perks: [] },
  { level: 2, xp_required: 100, title: 'Apprenti', perks: ['Accès aux défis quotidiens'] },
  { level: 3, xp_required: 300, title: 'Initié', perks: ['Personnalisation profil'] },
  { level: 4, xp_required: 600, title: 'Pratiquant', perks: ['Badges spéciaux'] },
  { level: 5, xp_required: 1000, title: 'Confirmé', perks: ['Créer des défis'] },
  { level: 10, xp_required: 3000, title: 'Expert', perks: ['Accès VIP', 'Badge Expert'] },
  { level: 15, xp_required: 6000, title: 'Maître', perks: ['Créer des guildes'] },
  { level: 20, xp_required: 10000, title: 'Grand Maître', perks: ['Badge Légendaire', 'Mentor'] },
  { level: 25, xp_required: 15000, title: 'Sage', perks: ['Accès anticipé'] },
  { level: 30, xp_required: 25000, title: 'Légende', perks: ['Badge Mythique', 'Titre personnalisé'] },
  { level: 50, xp_required: 50000, title: 'Transcendant', perks: ['Tout débloqué'] },
];

// XP par action
const XP_REWARDS: Record<XPAction, number> = {
  journal_entry: 25,
  scan_complete: 30,
  breath_session: 20,
  meditation_complete: 35,
  challenge_complete: 50,
  daily_login: 10,
  streak_bonus: 15,
  guild_contribution: 20,
  tournament_win: 100,
  badge_unlock: 25,
  achievement_complete: 50,
  referral_bonus: 100,
  community_post: 15,
  community_reaction: 5,
};

export function useXPSystem() {
  const { user } = useAuth();
  const [userLevel, setUserLevel] = useState<UserLevel | null>(null);
  const [recentXP, setRecentXP] = useState<XPEvent[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Calcul du niveau à partir de l'XP total
  const calculateLevel = useCallback((totalXP: number): UserLevel => {
    let currentLevel = LEVEL_CONFIG[0];
    let nextLevel = LEVEL_CONFIG[1];

    for (let i = 0; i < LEVEL_CONFIG.length - 1; i++) {
      if (totalXP >= LEVEL_CONFIG[i].xp_required) {
        currentLevel = LEVEL_CONFIG[i];
        nextLevel = LEVEL_CONFIG[i + 1] || LEVEL_CONFIG[i];
      } else {
        break;
      }
    }

    const xpInCurrentLevel = totalXP - currentLevel.xp_required;
    const xpForNextLevel = nextLevel.xp_required - currentLevel.xp_required;
    const progressPercent = xpForNextLevel > 0 
      ? Math.min(100, (xpInCurrentLevel / xpForNextLevel) * 100)
      : 100;

    return {
      user_id: user?.id || '',
      level: currentLevel.level,
      current_xp: xpInCurrentLevel,
      xp_to_next: xpForNextLevel - xpInCurrentLevel,
      total_xp: totalXP,
      title: currentLevel.title,
      progress_percent: progressPercent,
    };
  }, [user?.id]);

  // Charger le niveau utilisateur
  const loadUserLevel = useCallback(async () => {
    if (!user?.id) return;

    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('user_progress')
        .select('total_xp, level')
        .eq('user_id', user.id)
        .single();

      if (error && error.code !== 'PGRST116') throw error;

      const totalXP = data?.total_xp || 0;
      setUserLevel(calculateLevel(totalXP));
    } catch (error) {
      logger.error('Failed to load user level:', error as Error, 'GAMIFICATION');
    } finally {
      setIsLoading(false);
    }
  }, [user?.id, calculateLevel]);

  // Ajouter de l'XP
  const addXP = useCallback(async (
    action: XPAction,
    multiplier: number = 1,
    source: string = 'system',
    metadata?: Record<string, unknown>
  ): Promise<number> => {
    if (!user?.id) return 0;

    const baseAmount = XP_REWARDS[action] || 0;
    const amount = Math.floor(baseAmount * multiplier);

    try {
      // Appel à l'Edge Function gamification
      const { data, error } = await supabase.functions.invoke('gamification', {
        body: {
          action: 'add_xp',
          xp_action: action,
          amount,
          source,
          metadata,
        },
      });

      if (error) throw error;

      // Mettre à jour le niveau local
      if (data?.new_total_xp) {
        const newLevel = calculateLevel(data.new_total_xp);
        const previousLevel = userLevel?.level || 1;
        
        // Vérifier level up
        if (newLevel.level > previousLevel) {
          toast.success(`🎉 Niveau ${newLevel.level} atteint!`, {
            description: `Vous êtes maintenant ${newLevel.title}`,
          });
        }
        
        setUserLevel(newLevel);
      }

      // Ajouter à l'historique récent
      const event: XPEvent = {
        id: crypto.randomUUID(),
        user_id: user.id,
        action,
        amount,
        multiplier,
        source,
        metadata,
        created_at: new Date().toISOString(),
      };
      setRecentXP(prev => [event, ...prev.slice(0, 9)]);

      return amount;
    } catch (error) {
      logger.error('Failed to add XP:', error as Error, 'GAMIFICATION');
      return 0;
    }
  }, [user?.id, userLevel, calculateLevel]);

  // Charger l'historique XP récent
  const loadRecentXP = useCallback(async (limit: number = 10) => {
    if (!user?.id) return;

    try {
      const { data, error } = await supabase
        .from('xp_events')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(limit);

      if (error) throw error;
      setRecentXP((data as XPEvent[]) || []);
    } catch (error) {
      logger.error('Failed to load recent XP:', error as Error, 'GAMIFICATION');
    }
  }, [user?.id]);

  // Effet initial
  useEffect(() => {
    loadUserLevel();
  }, [loadUserLevel]);

  return {
    userLevel,
    recentXP,
    isLoading,
    addXP,
    loadUserLevel,
    loadRecentXP,
    getLevelConfig: () => LEVEL_CONFIG,
    getXPForAction: (action: XPAction) => XP_REWARDS[action] || 0,
  };
}
