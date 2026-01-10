/**
 * Hook pour les statistiques Flash Glow persistées
 */

import { useState, useCallback, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { logger } from '@/lib/logger';

export interface FlashGlowSession {
  id: string;
  duration_seconds: number;
  score: number;
  pattern: string;
  completed: boolean;
  session_date: string;
  created_at: string;
}

export interface FlashGlowStats {
  totalSessions: number;
  totalScore: number;
  totalMinutes: number;
  averageScore: number;
  currentStreak: number;
  bestStreak: number;
  level: number;
  levelProgress: number;
  recentSessions: FlashGlowSession[];
}

export function useFlashGlowStats() {
  const { user } = useAuth();
  const [stats, setStats] = useState<FlashGlowStats>({
    totalSessions: 0,
    totalScore: 0,
    totalMinutes: 0,
    averageScore: 0,
    currentStreak: 0,
    bestStreak: 0,
    level: 1,
    levelProgress: 0,
    recentSessions: []
  });
  const [isLoading, setIsLoading] = useState(false);

  const calculateLevel = (totalScore: number): { level: number; progress: number } => {
    const xpPerLevel = 500;
    const level = Math.floor(totalScore / xpPerLevel) + 1;
    const progress = ((totalScore % xpPerLevel) / xpPerLevel) * 100;
    return { level, progress };
  };

  const calculateStreak = (sessions: FlashGlowSession[]): { current: number; best: number } => {
    if (sessions.length === 0) return { current: 0, best: 0 };

    const sortedDates = [...new Set(sessions.map(s => s.session_date))].sort().reverse();
    const today = new Date().toISOString().split('T')[0];
    
    let currentStreak = 0;
    let bestStreak = 0;
    let tempStreak = 0;
    let lastDate: Date | null = null;

    for (const dateStr of sortedDates) {
      const date = new Date(dateStr);
      
      if (!lastDate) {
        const diffFromToday = Math.floor((new Date(today).getTime() - date.getTime()) / (1000 * 60 * 60 * 24));
        if (diffFromToday <= 1) {
          tempStreak = 1;
          lastDate = date;
        }
      } else {
        const diff = Math.floor((lastDate.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));
        if (diff === 1) {
          tempStreak++;
          lastDate = date;
        } else {
          if (currentStreak === 0) currentStreak = tempStreak;
          bestStreak = Math.max(bestStreak, tempStreak);
          tempStreak = 1;
          lastDate = date;
        }
      }
    }

    if (currentStreak === 0) currentStreak = tempStreak;
    bestStreak = Math.max(bestStreak, tempStreak);

    return { current: currentStreak, best: bestStreak };
  };

  const fetchStats = useCallback(async () => {
    if (!user) return;
    setIsLoading(true);

    try {
      const { data: sessions, error } = await supabase
        .from('flash_glow_sessions')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(100);

      if (error) throw error;

      const typedSessions = (sessions || []) as FlashGlowSession[];
      const totalScore = typedSessions.reduce((sum, s) => sum + s.score, 0);
      const totalMinutes = Math.round(typedSessions.reduce((sum, s) => sum + s.duration_seconds, 0) / 60);
      const { level, progress } = calculateLevel(totalScore);
      const { current, best } = calculateStreak(typedSessions);

      setStats({
        totalSessions: typedSessions.length,
        totalScore,
        totalMinutes,
        averageScore: typedSessions.length > 0 ? Math.round(totalScore / typedSessions.length) : 0,
        currentStreak: current,
        bestStreak: best,
        level,
        levelProgress: progress,
        recentSessions: typedSessions.slice(0, 10)
      });
    } catch (error) {
      logger.error('Failed to fetch flash glow stats', error as Error, 'FLASH_GLOW');
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  const saveSession = useCallback(async (session: Omit<FlashGlowSession, 'id' | 'created_at' | 'session_date'>) => {
    if (!user) return null;

    try {
      const { data, error } = await supabase
        .from('flash_glow_sessions')
        .insert({
          user_id: user.id,
          duration_seconds: session.duration_seconds,
          score: session.score,
          pattern: session.pattern,
          completed: session.completed
        })
        .select()
        .single();

      if (error) throw error;
      
      // Refresh stats
      await fetchStats();
      return data as FlashGlowSession;
    } catch (error) {
      logger.error('Failed to save flash glow session', error as Error, 'FLASH_GLOW');
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
