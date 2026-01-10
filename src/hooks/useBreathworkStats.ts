/**
 * Hook pour les statistiques Breathwork persistées
 */

import { useState, useCallback, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { logger } from '@/lib/logger';

export interface BreathworkSession {
  id: string;
  pattern_name: string;
  duration_seconds: number;
  cycles_completed: number;
  completion_rate: number;
  session_date: string;
  created_at: string;
}

export interface BreathworkStats {
  totalSessions: number;
  totalMinutes: number;
  totalCycles: number;
  averageCompletionRate: number;
  currentStreak: number;
  favoritePattern: string;
  masteredPatterns: number;
  recentSessions: BreathworkSession[];
}

export function useBreathworkStats() {
  const { user } = useAuth();
  const [stats, setStats] = useState<BreathworkStats>({
    totalSessions: 0,
    totalMinutes: 0,
    totalCycles: 0,
    averageCompletionRate: 0,
    currentStreak: 0,
    favoritePattern: '',
    masteredPatterns: 0,
    recentSessions: []
  });
  const [isLoading, setIsLoading] = useState(false);

  const calculateStreak = (sessions: BreathworkSession[]): number => {
    if (sessions.length === 0) return 0;

    const sortedDates = [...new Set(sessions.map(s => s.session_date))].sort().reverse();
    const today = new Date().toISOString().split('T')[0];
    
    let streak = 0;
    let lastDate: Date | null = null;

    for (const dateStr of sortedDates) {
      const date = new Date(dateStr);
      
      if (!lastDate) {
        const diffFromToday = Math.floor((new Date(today).getTime() - date.getTime()) / (1000 * 60 * 60 * 24));
        if (diffFromToday <= 1) {
          streak = 1;
          lastDate = date;
        } else {
          break;
        }
      } else {
        const diff = Math.floor((lastDate.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));
        if (diff === 1) {
          streak++;
          lastDate = date;
        } else {
          break;
        }
      }
    }

    return streak;
  };

  const fetchStats = useCallback(async () => {
    if (!user) return;
    setIsLoading(true);

    try {
      const { data: sessions, error } = await supabase
        .from('breathwork_sessions')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(100);

      if (error) throw error;

      const typedSessions = (sessions || []) as BreathworkSession[];
      
      // Calculate pattern frequencies
      const patternCounts: Record<string, number> = {};
      typedSessions.forEach(s => {
        patternCounts[s.pattern_name] = (patternCounts[s.pattern_name] || 0) + 1;
      });
      
      const favoritePattern = Object.entries(patternCounts)
        .sort((a, b) => b[1] - a[1])[0]?.[0] || '';

      // Count mastered patterns (10+ sessions with 80%+ completion)
      const patternStats: Record<string, { count: number; avgCompletion: number }> = {};
      typedSessions.forEach(s => {
        if (!patternStats[s.pattern_name]) {
          patternStats[s.pattern_name] = { count: 0, avgCompletion: 0 };
        }
        patternStats[s.pattern_name].count++;
        patternStats[s.pattern_name].avgCompletion += s.completion_rate;
      });

      const masteredPatterns = Object.values(patternStats).filter(p => 
        p.count >= 10 && (p.avgCompletion / p.count) >= 80
      ).length;

      const totalMinutes = Math.round(typedSessions.reduce((sum, s) => sum + s.duration_seconds, 0) / 60);
      const totalCycles = typedSessions.reduce((sum, s) => sum + s.cycles_completed, 0);
      const avgCompletion = typedSessions.length > 0 
        ? Math.round(typedSessions.reduce((sum, s) => sum + s.completion_rate, 0) / typedSessions.length)
        : 0;

      setStats({
        totalSessions: typedSessions.length,
        totalMinutes,
        totalCycles,
        averageCompletionRate: avgCompletion,
        currentStreak: calculateStreak(typedSessions),
        favoritePattern,
        masteredPatterns,
        recentSessions: typedSessions.slice(0, 10)
      });
    } catch (error) {
      logger.error('Failed to fetch breathwork stats', error as Error, 'BREATHWORK');
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  const saveSession = useCallback(async (session: Omit<BreathworkSession, 'id' | 'created_at' | 'session_date'>) => {
    if (!user) return null;

    try {
      const { data, error } = await supabase
        .from('breathwork_sessions')
        .insert({
          user_id: user.id,
          pattern_name: session.pattern_name,
          duration_seconds: session.duration_seconds,
          cycles_completed: session.cycles_completed,
          completion_rate: session.completion_rate
        })
        .select()
        .single();

      if (error) throw error;
      
      await fetchStats();
      return data as BreathworkSession;
    } catch (error) {
      logger.error('Failed to save breathwork session', error as Error, 'BREATHWORK');
      return null;
    }
  }, [user, fetchStats]);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  return {
    stats,
    isLoading,
    fetchStats,
    saveSession
  };
}
