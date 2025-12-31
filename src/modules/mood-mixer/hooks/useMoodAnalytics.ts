// @ts-nocheck
import { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface MoodAnalytics {
  totalSessions: number;
  totalDuration: number;
  avgSessionDuration: number;
  avgSatisfaction: number;
  sessionsThisWeek: number;
  sessionsLastWeek: number;
  weeklyGrowth: number;
  streakDays: number;
  longestStreak: number;
  favoritePresets: { name: string; count: number }[];
  peakHours: { hour: number; count: number }[];
  moodEvolution: {
    dimension: string;
    startValue: number;
    currentValue: number;
    trend: 'up' | 'down' | 'stable';
  }[];
  achievements: {
    id: string;
    name: string;
    description: string;
    unlockedAt?: string;
    progress: number;
    target: number;
  }[];
}

export interface UseMoodAnalyticsReturn {
  analytics: MoodAnalytics | null;
  isLoading: boolean;
  refetch: () => void;
}

export function useMoodAnalytics(userId?: string): UseMoodAnalyticsReturn {
  const { data, isLoading, refetch } = useQuery({
    queryKey: ['mood-mixer-analytics', userId],
    queryFn: async (): Promise<MoodAnalytics> => {
      if (!userId) throw new Error('User ID required');

      const { data: sessions, error } = await supabase
        .from('mood_mixer_sessions')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) throw error;

      const now = new Date();
      const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      const twoWeeksAgo = new Date(now.getTime() - 14 * 24 * 60 * 60 * 1000);

      const thisWeekSessions = (sessions || []).filter(s => new Date(s.created_at) >= weekAgo);
      const lastWeekSessions = (sessions || []).filter(s => {
        const d = new Date(s.created_at);
        return d >= twoWeeksAgo && d < weekAgo;
      });

      // Calcul des streaks
      const sessionDates = [...new Set(
        (sessions || []).map(s => s.created_at.split('T')[0])
      )].sort().reverse();

      let streakDays = 0;
      const today = new Date().toISOString().split('T')[0];
      let checkDate = today;
      
      for (const date of sessionDates) {
        if (date === checkDate) {
          streakDays++;
          const prevDate = new Date(checkDate);
          prevDate.setDate(prevDate.getDate() - 1);
          checkDate = prevDate.toISOString().split('T')[0];
        } else if (date < checkDate) {
          break;
        }
      }

      // Presets favoris
      const presetCounts: Record<string, number> = {};
      (sessions || []).forEach(s => {
        if (s.preset_used) {
          presetCounts[s.preset_used] = (presetCounts[s.preset_used] || 0) + 1;
        }
      });
      const favoritePresets = Object.entries(presetCounts)
        .map(([name, count]) => ({ name, count }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 5);

      // Heures de pointe
      const hourCounts: Record<number, number> = {};
      (sessions || []).forEach(s => {
        const hour = new Date(s.created_at).getHours();
        hourCounts[hour] = (hourCounts[hour] || 0) + 1;
      });
      const peakHours = Object.entries(hourCounts)
        .map(([hour, count]) => ({ hour: parseInt(hour), count }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 5);

      // Évolution de l'humeur
      const recentSessions = (sessions || []).slice(0, 10);
      const olderSessions = (sessions || []).slice(-10);

      const calculateAvg = (arr: any[], key: string) => {
        const values = arr.filter(s => s.components_snapshot?.[key] !== undefined)
          .map(s => s.components_snapshot[key]);
        return values.length > 0 ? values.reduce((a, b) => a + b, 0) / values.length : 50;
      };

      const dimensions = ['energy', 'calm', 'joy', 'focus', 'comfort', 'serenity'];
      const moodEvolution = dimensions.map(dim => {
        const startValue = calculateAvg(olderSessions, dim);
        const currentValue = calculateAvg(recentSessions, dim);
        const diff = currentValue - startValue;
        
        return {
          dimension: dim,
          startValue: Math.round(startValue),
          currentValue: Math.round(currentValue),
          trend: diff > 5 ? 'up' : diff < -5 ? 'down' : 'stable',
        };
      });

      // Achievements
      const totalDuration = (sessions || []).reduce((sum, s) => sum + (s.duration || 0), 0);
      const achievements = [
        {
          id: 'first-session',
          name: 'Première session',
          description: 'Complétez votre première session Mood Mixer',
          unlockedAt: (sessions || []).length > 0 ? sessions![sessions!.length - 1].created_at : undefined,
          progress: Math.min((sessions || []).length, 1),
          target: 1,
        },
        {
          id: 'streak-7',
          name: 'Semaine parfaite',
          description: '7 jours consécutifs de sessions',
          unlockedAt: streakDays >= 7 ? new Date().toISOString() : undefined,
          progress: Math.min(streakDays, 7),
          target: 7,
        },
        {
          id: 'sessions-10',
          name: 'Habitué',
          description: 'Complétez 10 sessions',
          unlockedAt: (sessions || []).length >= 10 ? sessions![9].created_at : undefined,
          progress: Math.min((sessions || []).length, 10),
          target: 10,
        },
        {
          id: 'sessions-50',
          name: 'Expert du Mix',
          description: 'Complétez 50 sessions',
          unlockedAt: (sessions || []).length >= 50 ? sessions![49].created_at : undefined,
          progress: Math.min((sessions || []).length, 50),
          target: 50,
        },
        {
          id: 'duration-60',
          name: 'Marathonien',
          description: 'Passez 60 minutes au total en session',
          unlockedAt: totalDuration >= 3600 ? new Date().toISOString() : undefined,
          progress: Math.min(Math.floor(totalDuration / 60), 60),
          target: 60,
        },
      ];

      const satisfactionSessions = (sessions || []).filter(s => s.satisfaction !== undefined);
      const avgSatisfaction = satisfactionSessions.length > 0
        ? satisfactionSessions.reduce((sum, s) => sum + (s.satisfaction || 0), 0) / satisfactionSessions.length
        : 0;

      const weeklyGrowth = lastWeekSessions.length > 0
        ? ((thisWeekSessions.length - lastWeekSessions.length) / lastWeekSessions.length) * 100
        : thisWeekSessions.length > 0 ? 100 : 0;

      return {
        totalSessions: (sessions || []).length,
        totalDuration,
        avgSessionDuration: (sessions || []).length > 0 
          ? Math.round(totalDuration / (sessions || []).length)
          : 0,
        avgSatisfaction: Math.round(avgSatisfaction * 10) / 10,
        sessionsThisWeek: thisWeekSessions.length,
        sessionsLastWeek: lastWeekSessions.length,
        weeklyGrowth: Math.round(weeklyGrowth),
        streakDays,
        longestStreak: streakDays, // Simplified
        favoritePresets,
        peakHours,
        moodEvolution,
        achievements,
      };
    },
    enabled: !!userId,
    staleTime: 60000,
  });

  return {
    analytics: data ?? null,
    isLoading,
    refetch,
  };
}
