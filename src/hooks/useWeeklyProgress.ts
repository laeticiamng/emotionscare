/**
 * Hook pour calculer la progression hebdomadaire de l'utilisateur
 */

import { useState, useCallback, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { logger } from '@/lib/logger';

export interface WeeklyProgress {
  sessions: number;
  minutes: number;
  xp: number;
  goal: {
    sessions: number;
    minutes: number;
    xp: number;
  };
  percentComplete: number;
  daysActive: number;
  dailyBreakdown: {
    date: string;
    sessions: number;
    minutes: number;
    xp: number;
  }[];
}

const WEEKLY_GOALS = {
  sessions: 7,
  minutes: 60,
  xp: 500
};

export function useWeeklyProgress() {
  const { user } = useAuth();
  const [progress, setProgress] = useState<WeeklyProgress>({
    sessions: 0,
    minutes: 0,
    xp: 0,
    goal: WEEKLY_GOALS,
    percentComplete: 0,
    daysActive: 0,
    dailyBreakdown: []
  });
  const [isLoading, setIsLoading] = useState(false);

  const getWeekStart = () => {
    const now = new Date();
    const dayOfWeek = now.getDay();
    const diff = now.getDate() - dayOfWeek + (dayOfWeek === 0 ? -6 : 1);
    const monday = new Date(now.setDate(diff));
    monday.setHours(0, 0, 0, 0);
    return monday.toISOString();
  };

  const fetchWeeklyProgress = useCallback(async () => {
    if (!user) return;
    setIsLoading(true);

    const weekStart = getWeekStart();

    try {
      // Fetch all sessions from this week in parallel
      const [flashGlow, bubbleBeat, moodMixer, storySynth, bossGrit] = await Promise.all([
        supabase
          .from('flash_glow_sessions')
          .select('created_at, duration_seconds, score')
          .eq('user_id', user.id)
          .gte('created_at', weekStart),
        supabase
          .from('bubble_beat_sessions')
          .select('created_at, duration_seconds, score')
          .eq('user_id', user.id)
          .gte('created_at', weekStart),
        supabase
          .from('mood_mixer_sessions')
          .select('created_at, duration_seconds')
          .eq('user_id', user.id)
          .gte('created_at', weekStart),
        supabase
          .from('story_synth_sessions')
          .select('created_at, duration_seconds')
          .eq('user_id', user.id)
          .gte('created_at', weekStart),
        supabase
          .from('boss_grit_sessions')
          .select('created_at, elapsed_seconds, xp_earned')
          .eq('user_id', user.id)
          .gte('created_at', weekStart)
      ]);

      // Combine all sessions
      type SessionRecord = { created_at: string; duration_seconds?: number; elapsed_seconds?: number; score?: number; xp_earned?: number };
      
      const allSessions: SessionRecord[] = [
        ...(flashGlow.data || []) as SessionRecord[],
        ...(bubbleBeat.data || []) as SessionRecord[],
        ...(moodMixer.data || []) as SessionRecord[],
        ...(storySynth.data || []) as SessionRecord[],
        ...(bossGrit.data || []) as SessionRecord[]
      ];

      const totalSessions = allSessions.length;
      const totalMinutes = Math.round(
        allSessions.reduce((sum, s) => sum + ((s.duration_seconds || s.elapsed_seconds || 0) / 60), 0)
      );
      const totalXp = allSessions.reduce((sum, s) => sum + (s.score || s.xp_earned || 0), 0);

      // Calculate daily breakdown
      const dailyMap: Record<string, { sessions: number; minutes: number; xp: number }> = {};
      allSessions.forEach(s => {
        const date = s.created_at.split('T')[0];
        if (!dailyMap[date]) {
          dailyMap[date] = { sessions: 0, minutes: 0, xp: 0 };
        }
        dailyMap[date].sessions++;
        dailyMap[date].minutes += Math.round((s.duration_seconds || s.elapsed_seconds || 0) / 60);
        dailyMap[date].xp += s.score || s.xp_earned || 0;
      });

      const dailyBreakdown = Object.entries(dailyMap)
        .map(([date, data]) => ({ date, ...data }))
        .sort((a, b) => a.date.localeCompare(b.date));

      const daysActive = Object.keys(dailyMap).length;

      // Calculate percent complete (average of all goals)
      const sessionPercent = Math.min(100, (totalSessions / WEEKLY_GOALS.sessions) * 100);
      const minutesPercent = Math.min(100, (totalMinutes / WEEKLY_GOALS.minutes) * 100);
      const xpPercent = Math.min(100, (totalXp / WEEKLY_GOALS.xp) * 100);
      const percentComplete = Math.round((sessionPercent + minutesPercent + xpPercent) / 3);

      setProgress({
        sessions: totalSessions,
        minutes: totalMinutes,
        xp: totalXp,
        goal: WEEKLY_GOALS,
        percentComplete,
        daysActive,
        dailyBreakdown
      });
    } catch (error) {
      logger.error('Failed to fetch weekly progress', error as Error, 'WEEKLY');
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchWeeklyProgress();
  }, [fetchWeeklyProgress]);

  return {
    progress,
    isLoading,
    refresh: fetchWeeklyProgress
  };
}
