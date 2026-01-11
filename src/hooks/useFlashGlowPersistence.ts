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
  mode: 'calm' | 'focus' | 'energy' | 'sleep';
  duration_seconds: number;
  completion_rate: number;
  heart_rate_start?: number;
  heart_rate_end?: number;
  stress_level_before?: number;
  stress_level_after?: number;
  feedback_rating?: number;
  created_at: string;
}

export interface FlashGlowStats {
  totalSessions: number;
  totalMinutes: number;
  averageCompletion: number;
  averageStressReduction: number;
  favoriteMode: string;
  weeklyGoalProgress: number;
  streak: number;
  lastSessionDate?: string;
  modeBreakdown: { mode: string; count: number; avgDuration: number }[];
}

export function useFlashGlowPersistence() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [sessions, setSessions] = useState<FlashGlowSession[]>([]);
  const [stats, setStats] = useState<FlashGlowStats>({
    totalSessions: 0,
    totalMinutes: 0,
    averageCompletion: 0,
    averageStressReduction: 0,
    favoriteMode: 'calm',
    weeklyGoalProgress: 0,
    streak: 0,
    modeBreakdown: []
  });
  const [isLoading, setIsLoading] = useState(false);

  const calculateStats = (sessionList: FlashGlowSession[]): FlashGlowStats => {
    if (sessionList.length === 0) {
      return {
        totalSessions: 0,
        totalMinutes: 0,
        averageCompletion: 0,
        averageStressReduction: 0,
        favoriteMode: 'calm',
        weeklyGoalProgress: 0,
        streak: 0,
        modeBreakdown: []
      };
    }

    const totalMinutes = Math.round(sessionList.reduce((sum, s) => sum + s.duration_seconds, 0) / 60);
    const avgCompletion = Math.round(sessionList.reduce((sum, s) => sum + s.completion_rate, 0) / sessionList.length * 100);
    
    // Calculate stress reduction
    const sessionsWithStress = sessionList.filter(s => 
      s.stress_level_before !== undefined && s.stress_level_after !== undefined
    );
    const avgStressReduction = sessionsWithStress.length > 0
      ? Math.round(sessionsWithStress.reduce((sum, s) => 
          sum + ((s.stress_level_before! - s.stress_level_after!) / s.stress_level_before! * 100), 0
        ) / sessionsWithStress.length)
      : 0;

    // Find favorite mode
    const modeCounts: Record<string, { count: number; totalDuration: number }> = {};
    sessionList.forEach(s => {
      if (!modeCounts[s.mode]) {
        modeCounts[s.mode] = { count: 0, totalDuration: 0 };
      }
      modeCounts[s.mode].count++;
      modeCounts[s.mode].totalDuration += s.duration_seconds;
    });
    
    const favoriteMode = Object.entries(modeCounts)
      .sort((a, b) => b[1].count - a[1].count)[0]?.[0] || 'calm';

    const modeBreakdown = Object.entries(modeCounts).map(([mode, data]) => ({
      mode,
      count: data.count,
      avgDuration: Math.round(data.totalDuration / data.count / 60)
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
      averageCompletion: avgCompletion,
      averageStressReduction: avgStressReduction,
      favoriteMode,
      weeklyGoalProgress,
      streak,
      lastSessionDate: sessionList[0]?.created_at,
      modeBreakdown
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
          mode: session.mode,
          duration_seconds: session.duration_seconds,
          completion_rate: session.completion_rate,
          heart_rate_start: session.heart_rate_start,
          heart_rate_end: session.heart_rate_end,
          stress_level_before: session.stress_level_before,
          stress_level_after: session.stress_level_after,
          feedback_rating: session.feedback_rating
        })
        .select()
        .single();

      if (error) throw error;
      
      const newSession = data as FlashGlowSession;
      setSessions(prev => [newSession, ...prev]);
      setStats(calculateStats([newSession, ...sessions]));
      
      toast({
        title: '✨ Session sauvegardée',
        description: `${session.mode} - ${Math.round(session.duration_seconds / 60)} min`
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

  const getSessionsByMode = useCallback((mode: string) => {
    return sessions.filter(s => s.mode === mode);
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
    getSessionsByMode
  };
}
