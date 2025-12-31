/**
 * useParkStreak - Hook pour la gestion des séries (streaks) du parc
 * Persistance via Supabase avec calcul automatique
 */

import { useState, useEffect, useCallback, useMemo } from 'react';
import { useUserPreference } from '@/hooks/useSupabaseStorage';
import { logger } from '@/lib/logger';

interface StreakData {
  currentStreak: number;
  longestStreak: number;
  lastActivityDate: string | null;
  weeklyActivity: boolean[];
  totalDaysActive: number;
}

const DEFAULT_STREAK_DATA: StreakData = {
  currentStreak: 0,
  longestStreak: 0,
  lastActivityDate: null,
  weeklyActivity: [false, false, false, false, false, false, false],
  totalDaysActive: 0
};

export function useParkStreak() {
  const [streakData, setStreakData] = useUserPreference<StreakData>('park-streak', DEFAULT_STREAK_DATA);
  const [isLoading, setIsLoading] = useState(true);

  // Vérifier et mettre à jour le streak au chargement
  useEffect(() => {
    const checkAndUpdateStreak = () => {
      if (!streakData.lastActivityDate) {
        setIsLoading(false);
        return;
      }

      const lastActivity = new Date(streakData.lastActivityDate);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      lastActivity.setHours(0, 0, 0, 0);
      
      const daysDiff = Math.floor((today.getTime() - lastActivity.getTime()) / (1000 * 60 * 60 * 24));

      if (daysDiff > 1 && streakData.currentStreak > 0) {
        // Streak cassé - plus d'un jour sans activité
        logger.info('Streak broken', { daysDiff, lastActivity: streakData.lastActivityDate }, 'PARK');
        setStreakData({
          ...streakData,
          currentStreak: 0,
          weeklyActivity: updateWeeklyActivity(streakData.weeklyActivity, false)
        });
      }

      setIsLoading(false);
    };

    checkAndUpdateStreak();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [streakData.lastActivityDate, streakData.currentStreak]);

  // Mettre à jour l'activité hebdomadaire
  const updateWeeklyActivity = useCallback((current: boolean[], activeToday: boolean): boolean[] => {
    const today = new Date().getDay();
    const dayIndex = today === 0 ? 6 : today - 1; // Lundi = 0
    const newWeekly = [...current];
    newWeekly[dayIndex] = activeToday;
    return newWeekly;
  }, []);

  // Enregistrer une activité
  const recordActivity = useCallback(() => {
    const today = new Date();
    const todayStr = today.toISOString().split('T')[0];
    
    // Vérifier si déjà actif aujourd'hui
    if (streakData.lastActivityDate) {
      const lastDate = new Date(streakData.lastActivityDate).toISOString().split('T')[0];
      if (lastDate === todayStr) {
        // Déjà actif aujourd'hui
        return streakData.currentStreak;
      }
    }

    // Calculer le nouveau streak
    let newStreak = 1;
    if (streakData.lastActivityDate) {
      const lastActivity = new Date(streakData.lastActivityDate);
      lastActivity.setHours(0, 0, 0, 0);
      const todayMidnight = new Date(today);
      todayMidnight.setHours(0, 0, 0, 0);
      
      const daysDiff = Math.floor((todayMidnight.getTime() - lastActivity.getTime()) / (1000 * 60 * 60 * 24));
      
      if (daysDiff === 1) {
        // Jour consécutif
        newStreak = streakData.currentStreak + 1;
      } else if (daysDiff === 0) {
        // Même jour
        newStreak = streakData.currentStreak;
      }
      // Sinon streak recommence à 1
    }

    const newLongest = Math.max(streakData.longestStreak, newStreak);

    const newData: StreakData = {
      currentStreak: newStreak,
      longestStreak: newLongest,
      lastActivityDate: today.toISOString(),
      weeklyActivity: updateWeeklyActivity(streakData.weeklyActivity, true),
      totalDaysActive: streakData.totalDaysActive + 1
    };

    setStreakData(newData);
    logger.info('Activity recorded', { newStreak, newLongest }, 'PARK');

    return newStreak;
  }, [streakData, setStreakData, updateWeeklyActivity]);

  // Réinitialiser l'activité hebdomadaire (appelé chaque lundi)
  useEffect(() => {
    const today = new Date();
    if (today.getDay() === 1) { // Lundi
      // Vérifier si on a déjà reset cette semaine
      const lastMonday = new Date(today);
      lastMonday.setDate(today.getDate() - 7);
      
      if (streakData.lastActivityDate) {
        const lastActivity = new Date(streakData.lastActivityDate);
        if (lastActivity < lastMonday) {
          setStreakData({
            ...streakData,
            weeklyActivity: [false, false, false, false, false, false, false]
          });
        }
      }
    }
    // Only run once on mount, not on every streakData change
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Calculer le jour actuel de la semaine (0 = Lundi)
  const todayIndex = useMemo(() => {
    const day = new Date().getDay();
    return day === 0 ? 6 : day - 1;
  }, []);

  // Vérifier si actif aujourd'hui
  const isActiveToday = useMemo(() => {
    if (!streakData.lastActivityDate) return false;
    const lastDate = new Date(streakData.lastActivityDate).toISOString().split('T')[0];
    const todayDate = new Date().toISOString().split('T')[0];
    return lastDate === todayDate;
  }, [streakData.lastActivityDate]);

  // Vérifier si nouveau record
  const isNewRecord = useMemo(() => {
    return streakData.currentStreak >= streakData.longestStreak && streakData.currentStreak > 0;
  }, [streakData.currentStreak, streakData.longestStreak]);

  return {
    currentStreak: streakData.currentStreak,
    longestStreak: streakData.longestStreak,
    lastActivityDate: streakData.lastActivityDate,
    weeklyActivity: streakData.weeklyActivity,
    totalDaysActive: streakData.totalDaysActive,
    todayIndex,
    isActiveToday,
    isNewRecord,
    isLoading,
    recordActivity
  };
}

export default useParkStreak;
