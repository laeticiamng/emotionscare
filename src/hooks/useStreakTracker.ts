/**
 * Hook pour tracker les streaks de l'utilisateur
 */

import { useState, useCallback, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { logger } from '@/lib/logger';
import { useToast } from '@/hooks/use-toast';

export interface StreakData {
  currentStreak: number;
  bestStreak: number;
  lastActivityDate: string | null;
  isActiveToday: boolean;
  daysThisWeek: number;
  streakFreezeAvailable: boolean;
}

export function useStreakTracker() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [streak, setStreak] = useState<StreakData>({
    currentStreak: 0,
    bestStreak: 0,
    lastActivityDate: null,
    isActiveToday: false,
    daysThisWeek: 0,
    streakFreezeAvailable: false
  });
  const [isLoading, setIsLoading] = useState(false);

  const fetchStreak = useCallback(async () => {
    if (!user) return;
    setIsLoading(true);

    try {
      const { data, error } = await supabase
        .from('user_stats_consolidated')
        .select('current_streak, best_streak, last_activity_date')
        .eq('user_id', user.id)
        .single();

      if (error && error.code !== 'PGRST116') throw error;

      const today = new Date().toISOString().split('T')[0];
      const lastActivity = data?.last_activity_date?.split('T')[0] || null;
      const isActiveToday = lastActivity === today;

      // Calculate days this week
      const weekStart = new Date();
      weekStart.setDate(weekStart.getDate() - weekStart.getDay() + 1);
      weekStart.setHours(0, 0, 0, 0);

      setStreak({
        currentStreak: data?.current_streak || 0,
        bestStreak: data?.best_streak || 0,
        lastActivityDate: lastActivity,
        isActiveToday,
        daysThisWeek: 0, // Will be calculated from sessions
        streakFreezeAvailable: (data?.current_streak || 0) >= 7
      });
    } catch (error) {
      logger.error('Failed to fetch streak', error as Error, 'STREAK');
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  const recordActivity = useCallback(async () => {
    if (!user) return;

    try {
      const today = new Date().toISOString().split('T')[0];
      const { data: existing } = await supabase
        .from('user_stats_consolidated')
        .select('current_streak, best_streak, last_activity_date')
        .eq('user_id', user.id)
        .single();

      const lastActivity = existing?.last_activity_date?.split('T')[0] || null;
      const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];

      let newStreak = existing?.current_streak || 0;
      
      if (lastActivity === today) {
        // Already active today, no streak update needed
        return;
      } else if (lastActivity === yesterday) {
        // Consecutive day
        newStreak++;
      } else {
        // Streak broken, start fresh
        newStreak = 1;
      }

      const newBestStreak = Math.max(newStreak, existing?.best_streak || 0);

      await supabase
        .from('user_stats_consolidated')
        .upsert({
          user_id: user.id,
          current_streak: newStreak,
          best_streak: newBestStreak,
          last_activity_date: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }, { onConflict: 'user_id' });

      // Show streak milestone toasts
      if (newStreak === 7) {
        toast({
          title: '🔥 Une semaine de streak !',
          description: 'Félicitations pour 7 jours consécutifs !',
        });
      } else if (newStreak === 30) {
        toast({
          title: '🏆 Un mois de streak !',
          description: 'Incroyable ! 30 jours consécutifs !',
        });
      } else if (newStreak > (existing?.best_streak || 0)) {
        toast({
          title: '⭐ Nouveau record !',
          description: `Ton meilleur streak : ${newStreak} jours !`,
        });
      }

      setStreak(prev => ({
        ...prev,
        currentStreak: newStreak,
        bestStreak: newBestStreak,
        lastActivityDate: today,
        isActiveToday: true
      }));
    } catch (error) {
      logger.error('Failed to record activity', error as Error, 'STREAK');
    }
  }, [user, toast]);

  useEffect(() => {
    fetchStreak();
  }, [fetchStreak]);

  return {
    streak,
    isLoading,
    recordActivity,
    refresh: fetchStreak
  };
}
