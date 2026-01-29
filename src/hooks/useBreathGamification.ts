/**
 * useBreathGamification - Gamification des séances de respiration
 * Intègre XP, badges et streaks aux exercices de respiration
 */

import { useState, useCallback, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { logger } from '@/lib/logger';
import { toast } from 'sonner';

export interface BreathAchievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  requirement: number;
  category: 'sessions' | 'duration' | 'streak' | 'pattern';
  unlocked: boolean;
  unlockedAt?: string;
  progress: number;
}

export interface BreathGamificationStats {
  totalSessions: number;
  totalMinutes: number;
  currentStreak: number;
  longestStreak: number;
  xpEarned: number;
  level: number;
  favoritePattern: string;
  achievements: BreathAchievement[];
}

const BREATH_ACHIEVEMENTS: Omit<BreathAchievement, 'unlocked' | 'unlockedAt' | 'progress'>[] = [
  { id: 'first_breath', name: 'Premier souffle', description: 'Complète ta première séance', icon: '🌬️', requirement: 1, category: 'sessions' },
  { id: 'breath_10', name: 'Respirateur régulier', description: 'Complète 10 séances', icon: '💨', requirement: 10, category: 'sessions' },
  { id: 'breath_50', name: 'Maître du souffle', description: 'Complète 50 séances', icon: '🌪️', requirement: 50, category: 'sessions' },
  { id: 'breath_100', name: 'Zen absolu', description: 'Complète 100 séances', icon: '🧘', requirement: 100, category: 'sessions' },
  { id: 'duration_30', name: 'Débutant calme', description: 'Cumule 30 minutes de respiration', icon: '⏱️', requirement: 30, category: 'duration' },
  { id: 'duration_300', name: 'Expert en calme', description: 'Cumule 5 heures de respiration', icon: '🕐', requirement: 300, category: 'duration' },
  { id: 'streak_7', name: 'Semaine zen', description: '7 jours consécutifs', icon: '🔥', requirement: 7, category: 'streak' },
  { id: 'streak_30', name: 'Mois de sérénité', description: '30 jours consécutifs', icon: '✨', requirement: 30, category: 'streak' },
  { id: 'all_patterns', name: 'Explorateur', description: 'Essaie tous les patterns', icon: '🗺️', requirement: 3, category: 'pattern' },
];

export const useBreathGamification = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState<BreathGamificationStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [newAchievement, setNewAchievement] = useState<BreathAchievement | null>(null);

  // Charger les stats
  const loadStats = useCallback(async () => {
    if (!user?.id) {
      setLoading(false);
      return;
    }

    try {
      // Charger les sessions de respiration
      const { data: sessions, error } = await supabase
        .from('breath_sessions')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;

      // Calculer les stats
      const totalSessions = sessions?.length || 0;
      const totalMinutes = sessions?.reduce((acc, s) => acc + (s.duration_seconds || 0), 0) / 60 || 0;
      
      // Calculer les streaks
      let currentStreak = 0;
      let longestStreak = 0;
      let tempStreak = 0;
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const sessionDates = new Set(
        sessions?.map(s => new Date(s.created_at).toDateString()) || []
      );

      // Streak actuel
      for (let i = 0; i < 365; i++) {
        const checkDate = new Date(today);
        checkDate.setDate(checkDate.getDate() - i);
        if (sessionDates.has(checkDate.toDateString())) {
          currentStreak++;
        } else if (i > 0) {
          break;
        }
      }

      // Longest streak (simplifié)
      longestStreak = Math.max(currentStreak, sessions?.length ? 1 : 0);

      // Patterns utilisés
      const patternsUsed = new Set(sessions?.map(s => s.pattern) || []);
      const favoritePattern = sessions?.[0]?.pattern || '4-7-8';

      // XP calculation (10 XP par session, 1 XP par minute)
      const xpEarned = totalSessions * 10 + Math.floor(totalMinutes);
      const level = Math.floor(xpEarned / 100) + 1;

      // Calculer les achievements
      const achievements: BreathAchievement[] = BREATH_ACHIEVEMENTS.map(a => {
        let progress = 0;
        let unlocked = false;

        switch (a.category) {
          case 'sessions':
            progress = Math.min(totalSessions / a.requirement, 1);
            unlocked = totalSessions >= a.requirement;
            break;
          case 'duration':
            progress = Math.min(totalMinutes / a.requirement, 1);
            unlocked = totalMinutes >= a.requirement;
            break;
          case 'streak':
            progress = Math.min(longestStreak / a.requirement, 1);
            unlocked = longestStreak >= a.requirement;
            break;
          case 'pattern':
            progress = Math.min(patternsUsed.size / a.requirement, 1);
            unlocked = patternsUsed.size >= a.requirement;
            break;
        }

        return {
          ...a,
          unlocked,
          progress,
        };
      });

      setStats({
        totalSessions,
        totalMinutes: Math.round(totalMinutes),
        currentStreak,
        longestStreak,
        xpEarned,
        level,
        favoritePattern,
        achievements,
      });
    } catch (error) {
      logger.error('Failed to load breath gamification stats', error as Error, 'GAMIFICATION');
    } finally {
      setLoading(false);
    }
  }, [user?.id]);

  // Enregistrer une session et vérifier les achievements
  const recordSession = useCallback(async (
    pattern: string,
    durationSeconds: number,
    completed: boolean
  ) => {
    if (!user?.id || !completed) return;

    try {
      // Sauvegarder la session
      const { error } = await supabase
        .from('breath_sessions')
        .insert({
          user_id: user.id,
          pattern,
          duration_seconds: durationSeconds,
          completed: true,
        });

      if (error) throw error;

      // Recharger les stats
      await loadStats();

      // Vérifier si un nouvel achievement a été débloqué
      if (stats) {
        const newAchievements = stats.achievements.filter(a => !a.unlocked);
        // Logique pour détecter nouveau achievement après reload
        toast.success(`+${10 + Math.floor(durationSeconds / 60)} XP gagnés ! 🎉`);
      }
    } catch (error) {
      logger.error('Failed to record breath session', error as Error, 'GAMIFICATION');
    }
  }, [user?.id, loadStats, stats]);

  // Effet initial
  useEffect(() => {
    loadStats();
  }, [loadStats]);

  // Clear new achievement notification
  const clearNewAchievement = useCallback(() => {
    setNewAchievement(null);
  }, []);

  return {
    stats,
    loading,
    recordSession,
    newAchievement,
    clearNewAchievement,
    refresh: loadStats,
  };
};
