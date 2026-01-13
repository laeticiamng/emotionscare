/**
 * Hook pour la persistance des sessions Bubble Beat
 */

import { useState, useCallback, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { logger } from '@/lib/logger';
import { Json } from '@/integrations/supabase/types';

export interface BubbleBeatSession {
  id: string;
  game_mode: string;
  score: number;
  bubbles_popped: number;
  rhythm_accuracy: number;
  duration_seconds: number;
  difficulty: number;
  average_heart_rate?: number;
  target_heart_rate?: number;
  biometrics?: Json;
  created_at: string;
  completed_at?: string;
}

export interface BubbleBeatStats {
  totalSessions: number;
  totalScore: number;
  averageScore: number;
  bestScore: number;
  totalBubblesPopped: number;
  totalPlayTime: number;
  favoriteMode: string;
  averageAccuracy: number;
  recentSessions: BubbleBeatSession[];
}

export function useBubbleBeatPersistence() {
  const { user } = useAuth();
  const [sessions, setSessions] = useState<BubbleBeatSession[]>([]);
  const [stats, setStats] = useState<BubbleBeatStats>({
    totalSessions: 0,
    totalScore: 0,
    averageScore: 0,
    bestScore: 0,
    totalBubblesPopped: 0,
    totalPlayTime: 0,
    favoriteMode: 'relax',
    averageAccuracy: 0,
    recentSessions: []
  });
  const [isLoading, setIsLoading] = useState(false);

  const calculateStats = (sessionList: BubbleBeatSession[]): BubbleBeatStats => {
    if (sessionList.length === 0) {
      return {
        totalSessions: 0,
        totalScore: 0,
        averageScore: 0,
        bestScore: 0,
        totalBubblesPopped: 0,
        totalPlayTime: 0,
        favoriteMode: 'relax',
        averageAccuracy: 0,
        recentSessions: []
      };
    }

    const totalScore = sessionList.reduce((sum, s) => sum + s.score, 0);
    const bestScore = Math.max(...sessionList.map(s => s.score));
    const totalBubblesPopped = sessionList.reduce((sum, s) => sum + (s.bubbles_popped || 0), 0);
    const totalPlayTime = sessionList.reduce((sum, s) => sum + s.duration_seconds, 0);
    
    // Find favorite mode
    const modeCounts: Record<string, number> = {};
    sessionList.forEach(s => {
      modeCounts[s.game_mode] = (modeCounts[s.game_mode] || 0) + 1;
    });
    const favoriteMode = Object.entries(modeCounts)
      .sort((a, b) => b[1] - a[1])[0]?.[0] || 'relax';

    // Average accuracy
    const avgAccuracy = Math.round(
      sessionList.reduce((sum, s) => sum + (s.rhythm_accuracy || 0), 0) / sessionList.length
    );

    return {
      totalSessions: sessionList.length,
      totalScore,
      averageScore: Math.round(totalScore / sessionList.length),
      bestScore,
      totalBubblesPopped,
      totalPlayTime,
      favoriteMode,
      averageAccuracy: avgAccuracy,
      recentSessions: sessionList.slice(0, 10)
    };
  };

  const fetchSessions = useCallback(async () => {
    if (!user) return;
    setIsLoading(true);

    try {
      const { data, error } = await supabase
        .from('bubble_beat_sessions')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(100);

      if (error) throw error;

      const typedSessions = (data || []) as BubbleBeatSession[];
      setSessions(typedSessions);
      setStats(calculateStats(typedSessions));
    } catch (error) {
      logger.error('Failed to fetch bubble beat sessions', error as Error, 'BUBBLE_BEAT');
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  const saveSession = useCallback(async (session: Omit<BubbleBeatSession, 'id' | 'created_at'>) => {
    if (!user) return null;

    try {
      const { data, error } = await supabase
        .from('bubble_beat_sessions')
        .insert({
          user_id: user.id,
          game_mode: session.game_mode,
          score: session.score,
          bubbles_popped: session.bubbles_popped,
          rhythm_accuracy: session.rhythm_accuracy,
          duration_seconds: session.duration_seconds,
          difficulty: session.difficulty,
          average_heart_rate: session.average_heart_rate,
          target_heart_rate: session.target_heart_rate,
          biometrics: session.biometrics,
          completed_at: session.completed_at
        })
        .select()
        .single();

      if (error) throw error;
      
      const newSession = data as BubbleBeatSession;
      setSessions(prev => [newSession, ...prev]);
      setStats(calculateStats([newSession, ...sessions]));
      
      return newSession;
    } catch (error) {
      logger.error('Failed to save bubble beat session', error as Error, 'BUBBLE_BEAT');
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
    isLoadingHistory: isLoading,
    fetchSessions,
    fetchHistory: fetchSessions,
    saveSession
  };
}
