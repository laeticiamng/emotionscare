import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Sentry } from '@/lib/errors/sentry-compat';
import { logger } from '@/lib/logger';

export interface BreathSession {
  id: string;
  created_at: string;
  duration_seconds: number;
  pattern: string;
  cycles_completed?: number;
  average_pace?: number;
  mood_before?: number;
  mood_after?: number;
  notes?: string;
  vr_mode?: boolean;
}

export interface BreathStats {
  totalSessions: number;
  totalMinutes: number;
  weeklyMinutes: number;
  currentStreak: number;
  lastSessionDate?: string;
  averageSessionDuration: number;
}

export const useBreathSessions = () => {
  const [sessions, setSessions] = useState<BreathSession[]>([]);
  const [stats, setStats] = useState<BreathStats>({
    totalSessions: 0,
    totalMinutes: 0,
    weeklyMinutes: 0,
    currentStreak: 0,
    averageSessionDuration: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchSessions = async () => {
      try {
        setLoading(true);
        const { data: { session: authSession } } = await supabase.auth.getSession();

        if (!authSession?.user) {
          logger.warn('useBreathSessions: No authenticated session', {}, 'SESSION');
          setLoading(false);
          return;
        }

        const { data, error: queryError } = await supabase
          .from('breathing_vr_sessions')
          .select('*')
          .eq('user_id', authSession.user.id)
          .order('created_at', { ascending: false })
          .limit(100);

        if (queryError) {
          throw queryError;
        }

        setSessions(data || []);
        calculateStats(data || []);
      } catch (err) {
        const error = err instanceof Error ? err : new Error('Failed to fetch sessions');
        setError(error);
        Sentry.captureException(error);
        logger.error('useBreathSessions: fetch failed', error, 'SESSION');
      } finally {
        setLoading(false);
      }
    };

    fetchSessions();
  }, []);

  const calculateStats = (sessions: BreathSession[]) => {
    if (sessions.length === 0) {
      setStats({
        totalSessions: 0,
        totalMinutes: 0,
        weeklyMinutes: 0,
        currentStreak: 0,
        averageSessionDuration: 0,
      });
      return;
    }

    const totalMinutes = Math.round(sessions.reduce((acc, s) => acc + (s.duration_seconds || 0), 0) / 60);

    // Calculate weekly minutes (last 7 days)
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
    const weeklyMinutes = Math.round(
      sessions
        .filter(s => new Date(s.created_at) >= oneWeekAgo)
        .reduce((acc, s) => acc + (s.duration_seconds || 0), 0) / 60
    );

    // Calculate streak
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    let streak = 0;
    let currentDate = new Date(today);

    for (const session of sessions) {
      const sessionDate = new Date(session.created_at);
      sessionDate.setHours(0, 0, 0, 0);

      if (sessionDate.getTime() === currentDate.getTime()) {
        streak++;
        currentDate.setDate(currentDate.getDate() - 1);
      } else if (sessionDate.getTime() < currentDate.getTime()) {
        break;
      }
    }

    const averageSessionDuration = Math.round(sessions.reduce((acc, s) => acc + (s.duration_seconds || 0), 0) / sessions.length);

    setStats({
      totalSessions: sessions.length,
      totalMinutes,
      weeklyMinutes,
      currentStreak: streak,
      lastSessionDate: sessions[0]?.created_at,
      averageSessionDuration,
    });
  };

  return { sessions, stats, loading, error };
};
