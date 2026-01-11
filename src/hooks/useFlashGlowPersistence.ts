/**
 * Hook pour la persistance des sessions Flash Glow dans Supabase
 */

import { useState, useCallback, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { logger } from '@/lib/logger';
import { useToast } from '@/hooks/use-toast';

export interface FlashGlowSession {
  id: string;
  pattern: string; // calm, focus, energy, sleep
  duration_seconds: number;
  score: number;
  completed: boolean;
  session_date: string;
  created_at: string;
}

export interface FlashGlowStats {
  totalSessions: number;
  totalMinutes: number;
  averageScore: number;
  completionRate: number;
  favoritePattern: string;
  weeklyGoalProgress: number;
  streak: number;
  lastSessionDate?: string;
  patternBreakdown: { pattern: string; count: number; avgDuration: number; avgScore: number }[];
}

export function useFlashGlowPersistence() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [sessions, setSessions] = useState<FlashGlowSession[]>([]);
  const [stats, setStats] = useState<FlashGlowStats>({
    totalSessions: 0,
    totalMinutes: 0,
    averageScore: 0,
    completionRate: 0,
    favoritePattern: 'calm',
    weeklyGoalProgress: 0,
    streak: 0,
    patternBreakdown: []
  });
  const [isLoading, setIsLoading] = useState(false);

  const calculateStats = (sessionList: FlashGlowSession[]): FlashGlowStats => {
    if (sessionList.length === 0) {
      return {
        totalSessions: 0,
        totalMinutes: 0,
        averageScore: 0,
        completionRate: 0,
        favoritePattern: 'calm',
        weeklyGoalProgress: 0,
        streak: 0,
        patternBreakdown: []
      };
    }

    const totalMinutes = Math.round(sessionList.reduce((sum, s) => sum + s.duration_seconds, 0) / 60);
    const completedSessions = sessionList.filter(s => s.completed);
    const avgScore = completedSessions.length > 0
      ? Math.round(completedSessions.reduce((sum, s) => sum + s.score, 0) / completedSessions.length)
      : 0;
    const completionRate = Math.round((completedSessions.length / sessionList.length) * 100);

    // Find favorite pattern
    const patternCounts: Record<string, { count: number; totalDuration: number; totalScore: number }> = {};
    sessionList.forEach(s => {
      if (!patternCounts[s.pattern]) {
        patternCounts[s.pattern] = { count: 0, totalDuration: 0, totalScore: 0 };
      }
      patternCounts[s.pattern].count++;
      patternCounts[s.pattern].totalDuration += s.duration_seconds;
      patternCounts[s.pattern].totalScore += s.score;
    });
    
    const favoritePattern = Object.entries(patternCounts)
      .sort((a, b) => b[1].count - a[1].count)[0]?.[0] || 'calm';

    const patternBreakdown = Object.entries(patternCounts).map(([pattern, data]) => ({
      pattern,
      count: data.count,
      avgDuration: Math.round(data.totalDuration / data.count / 60),
      avgScore: Math.round(data.totalScore / data.count)
    }));

    // Calculate weekly progress (goal: 5 sessions per week)
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
    const weeklyCount = sessionList.filter(s => new Date(s.created_at) > oneWeekAgo).length;
    const weeklyGoalProgress = Math.min(100, Math.round(weeklyCount / 5 * 100));

    // Calculate streak
    let streak = 0;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const sortedDates = [...new Set(sessionList.map(s => {
      const date = new Date(s.created_at);
      date.setHours(0, 0, 0, 0);
      return date.getTime();
    }))].sort((a, b) => b - a);

    for (let i = 0; i < sortedDates.length; i++) {
      const expectedDate = new Date(today);
      expectedDate.setDate(expectedDate.getDate() - i);
      expectedDate.setHours(0, 0, 0, 0);
      
      if (sortedDates[i] === expectedDate.getTime()) {
        streak++;
      } else {
        break;
      }
    }

    return {
      totalSessions: sessionList.length,
      totalMinutes,
      averageScore: avgScore,
      completionRate,
      favoritePattern,
      weeklyGoalProgress,
      streak,
      lastSessionDate: sessionList[0]?.created_at,
      patternBreakdown
    };
  };

  const fetchSessions = useCallback(async () => {
    if (!user) return;
    setIsLoading(true);

    try {
      const { data, error } = await supabase
        .from('flash_glow_sessions')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(100);

      if (error) throw error;

      const typedSessions = (data || []) as FlashGlowSession[];
      setSessions(typedSessions);
      setStats(calculateStats(typedSessions));
    } catch (error) {
      logger.error('Failed to fetch flash glow sessions', error as Error, 'FLASH_GLOW');
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  const saveSession = useCallback(async (session: Omit<FlashGlowSession, 'id' | 'created_at'>) => {
    if (!user) {
      toast({
        title: 'Connexion requise',
        description: 'Connectez-vous pour sauvegarder vos sessions.',
        variant: 'destructive'
      });
      return null;
    }

    try {
      const { data, error } = await supabase
        .from('flash_glow_sessions')
        .insert({
          user_id: user.id,
          pattern: session.pattern,
          duration_seconds: session.duration_seconds,
          score: session.score,
          completed: session.completed,
          session_date: session.session_date
        })
        .select()
        .single();

      if (error) throw error;
      
      const newSession = data as FlashGlowSession;
      setSessions(prev => [newSession, ...prev]);
      setStats(calculateStats([newSession, ...sessions]));
      
      toast({
        title: '✨ Session sauvegardée',
        description: `${session.pattern} - ${Math.round(session.duration_seconds / 60)} min`
      });
      
      return newSession;
    } catch (error) {
      logger.error('Failed to save flash glow session', error as Error, 'FLASH_GLOW');
      toast({
        title: 'Erreur',
        description: 'Impossible de sauvegarder la session.',
        variant: 'destructive'
      });
      return null;
    }
  }, [user, sessions, toast]);

  const getRecentSession = useCallback(() => {
    return sessions[0] || null;
  }, [sessions]);

  const getSessionsByPattern = useCallback((pattern: string) => {
    return sessions.filter(s => s.pattern === pattern);
  }, [sessions]);

  useEffect(() => {
    fetchSessions();
  }, [fetchSessions]);

  return {
    sessions,
    stats,
    isLoading,
    fetchSessions,
    saveSession,
    getRecentSession,
    getSessionsByPattern
  };
}
