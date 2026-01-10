/**
 * Hook pour la persistance des sessions Mood Mixer
 */

import { useState, useCallback, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { logger } from '@/lib/logger';

export interface MoodMixerSession {
  id: string;
  preset_id?: string;
  preset_name?: string;
  components: Record<string, number>;
  duration_seconds: number;
  satisfaction_score?: number;
  created_at: string;
}

export interface MoodMixerStats {
  totalSessions: number;
  totalMinutes: number;
  averageDuration: number;
  averageSatisfaction: number;
  favoriteComponents: { name: string; avgValue: number }[];
  recentSessions: MoodMixerSession[];
}

export function useMoodMixerPersistence() {
  const { user } = useAuth();
  const [sessions, setSessions] = useState<MoodMixerSession[]>([]);
  const [stats, setStats] = useState<MoodMixerStats>({
    totalSessions: 0,
    totalMinutes: 0,
    averageDuration: 0,
    averageSatisfaction: 0,
    favoriteComponents: [],
    recentSessions: []
  });
  const [isLoading, setIsLoading] = useState(false);

  const calculateStats = (sessionList: MoodMixerSession[]): MoodMixerStats => {
    if (sessionList.length === 0) {
      return {
        totalSessions: 0,
        totalMinutes: 0,
        averageDuration: 0,
        averageSatisfaction: 0,
        favoriteComponents: [],
        recentSessions: []
      };
    }

    const totalMinutes = Math.round(sessionList.reduce((sum, s) => sum + s.duration_seconds, 0) / 60);
    const avgDuration = Math.round(totalMinutes / sessionList.length);
    
    const sessionsWithSatisfaction = sessionList.filter(s => s.satisfaction_score !== undefined);
    const avgSatisfaction = sessionsWithSatisfaction.length > 0
      ? Math.round(sessionsWithSatisfaction.reduce((sum, s) => sum + (s.satisfaction_score || 0), 0) / sessionsWithSatisfaction.length)
      : 0;

    // Calculate average component values
    const componentTotals: Record<string, { sum: number; count: number }> = {};
    sessionList.forEach(s => {
      Object.entries(s.components).forEach(([name, value]) => {
        if (!componentTotals[name]) {
          componentTotals[name] = { sum: 0, count: 0 };
        }
        componentTotals[name].sum += value;
        componentTotals[name].count++;
      });
    });

    const favoriteComponents = Object.entries(componentTotals)
      .map(([name, data]) => ({
        name,
        avgValue: Math.round(data.sum / data.count)
      }))
      .sort((a, b) => b.avgValue - a.avgValue)
      .slice(0, 5);

    return {
      totalSessions: sessionList.length,
      totalMinutes,
      averageDuration: avgDuration,
      averageSatisfaction: avgSatisfaction,
      favoriteComponents,
      recentSessions: sessionList.slice(0, 10)
    };
  };

  const fetchSessions = useCallback(async () => {
    if (!user) return;
    setIsLoading(true);

    try {
      const { data, error } = await supabase
        .from('mood_mixer_sessions')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(100);

      if (error) throw error;

      const typedSessions = (data || []) as MoodMixerSession[];
      setSessions(typedSessions);
      setStats(calculateStats(typedSessions));
    } catch (error) {
      logger.error('Failed to fetch mood mixer sessions', error as Error, 'MOOD_MIXER');
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  const saveSession = useCallback(async (session: Omit<MoodMixerSession, 'id' | 'created_at'>) => {
    if (!user) return null;

    try {
      const { data, error } = await supabase
        .from('mood_mixer_sessions')
        .insert({
          user_id: user.id,
          preset_id: session.preset_id,
          preset_name: session.preset_name,
          components: session.components,
          duration_seconds: session.duration_seconds,
          satisfaction_score: session.satisfaction_score
        })
        .select()
        .single();

      if (error) throw error;
      
      const newSession = data as MoodMixerSession;
      setSessions(prev => [newSession, ...prev]);
      setStats(calculateStats([newSession, ...sessions]));
      
      return newSession;
    } catch (error) {
      logger.error('Failed to save mood mixer session', error as Error, 'MOOD_MIXER');
      return null;
    }
  }, [user, sessions]);

  useEffect(() => {
    fetchSessions();
  }, [fetchSessions]);

  return {
    sessions,
    stats,
    isLoading,
    fetchSessions,
    saveSession
  };
}
