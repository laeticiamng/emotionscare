/**
 * Hook unifié pour l'historique des sessions de tous les modules
 * Utilise la table session_history créée récemment
 */

import { useState, useCallback, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { logger } from '@/lib/logger';
import { Json } from '@/integrations/supabase/types';

export type ModuleType = 
  | 'flash_glow' 
  | 'boss_grit' 
  | 'bubble_beat' 
  | 'mood_mixer' 
  | 'story_synth'
  | 'meditation'
  | 'journal'
  | 'coach'
  | 'emotion_scan';

export interface SessionHistoryEntry {
  id: string;
  user_id: string;
  module_type: ModuleType;
  session_data: Json;
  duration_seconds: number;
  score: number;
  xp_earned: number;
  completed: boolean;
  metadata: Json;
  started_at: string;
  completed_at: string | null;
  created_at: string;
}

export interface SessionHistoryStats {
  totalSessions: number;
  totalDuration: number;
  totalXP: number;
  totalScore: number;
  completedSessions: number;
  completionRate: number;
  averageDuration: number;
  sessionsByModule: Record<ModuleType, number>;
  recentSessions: SessionHistoryEntry[];
}

export interface CreateSessionParams {
  module_type: ModuleType;
  session_data?: Record<string, unknown>;
  duration_seconds?: number;
  score?: number;
  xp_earned?: number;
  completed?: boolean;
  metadata?: Record<string, unknown>;
}

export function useSessionHistory() {
  const { user } = useAuth();
  const [sessions, setSessions] = useState<SessionHistoryEntry[]>([]);
  const [stats, setStats] = useState<SessionHistoryStats>({
    totalSessions: 0,
    totalDuration: 0,
    totalXP: 0,
    totalScore: 0,
    completedSessions: 0,
    completionRate: 0,
    averageDuration: 0,
    sessionsByModule: {} as Record<ModuleType, number>,
    recentSessions: []
  });
  const [isLoading, setIsLoading] = useState(false);

  const calculateStats = useCallback((sessionList: SessionHistoryEntry[]): SessionHistoryStats => {
    if (sessionList.length === 0) {
      return {
        totalSessions: 0,
        totalDuration: 0,
        totalXP: 0,
        totalScore: 0,
        completedSessions: 0,
        completionRate: 0,
        averageDuration: 0,
        sessionsByModule: {} as Record<ModuleType, number>,
        recentSessions: []
      };
    }

    const totalDuration = sessionList.reduce((sum, s) => sum + (s.duration_seconds || 0), 0);
    const totalXP = sessionList.reduce((sum, s) => sum + (s.xp_earned || 0), 0);
    const totalScore = sessionList.reduce((sum, s) => sum + (s.score || 0), 0);
    const completedSessions = sessionList.filter(s => s.completed).length;

    // Count sessions by module
    const sessionsByModule = sessionList.reduce((acc, s) => {
      const moduleType = s.module_type as ModuleType;
      acc[moduleType] = (acc[moduleType] || 0) + 1;
      return acc;
    }, {} as Record<ModuleType, number>);

    return {
      totalSessions: sessionList.length,
      totalDuration,
      totalXP,
      totalScore,
      completedSessions,
      completionRate: Math.round((completedSessions / sessionList.length) * 100),
      averageDuration: Math.round(totalDuration / sessionList.length),
      sessionsByModule,
      recentSessions: sessionList.slice(0, 10)
    };
  }, []);

  const fetchSessions = useCallback(async (moduleFilter?: ModuleType) => {
    if (!user) return;
    setIsLoading(true);

    try {
      let query = supabase
        .from('session_history')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(100);

      if (moduleFilter) {
        query = query.eq('module_type', moduleFilter);
      }

      const { data, error } = await query;

      if (error) throw error;

      const typedSessions = (data || []) as SessionHistoryEntry[];
      setSessions(typedSessions);
      setStats(calculateStats(typedSessions));
    } catch (error) {
      logger.error('Failed to fetch session history', error as Error, 'SESSION_HISTORY');
    } finally {
      setIsLoading(false);
    }
  }, [user, calculateStats]);

  const createSession = useCallback(async (params: CreateSessionParams): Promise<SessionHistoryEntry | null> => {
    if (!user) return null;

    try {
      const { data, error } = await supabase
        .from('session_history')
        .insert({
          user_id: user.id,
          module_type: params.module_type,
          session_data: params.session_data || {},
          duration_seconds: params.duration_seconds || 0,
          score: params.score || 0,
          xp_earned: params.xp_earned || 0,
          completed: params.completed || false,
          metadata: params.metadata || {},
          started_at: new Date().toISOString()
        })
        .select()
        .single();

      if (error) throw error;

      const newSession = data as SessionHistoryEntry;
      setSessions(prev => [newSession, ...prev]);
      setStats(calculateStats([newSession, ...sessions]));

      logger.info('Session created', { 
        sessionId: newSession.id, 
        module: params.module_type 
      }, 'SESSION_HISTORY');

      return newSession;
    } catch (error) {
      logger.error('Failed to create session', error as Error, 'SESSION_HISTORY');
      return null;
    }
  }, [user, sessions, calculateStats]);

  const updateSession = useCallback(async (
    sessionId: string, 
    updates: Partial<Omit<SessionHistoryEntry, 'id' | 'user_id' | 'created_at'>>
  ): Promise<SessionHistoryEntry | null> => {
    if (!user) return null;

    try {
      const { data, error } = await supabase
        .from('session_history')
        .update({
          ...updates,
          completed_at: updates.completed ? new Date().toISOString() : undefined
        })
        .eq('id', sessionId)
        .eq('user_id', user.id)
        .select()
        .single();

      if (error) throw error;

      const updatedSession = data as SessionHistoryEntry;
      setSessions(prev => 
        prev.map(s => s.id === sessionId ? updatedSession : s)
      );
      setStats(calculateStats(sessions.map(s => s.id === sessionId ? updatedSession : s)));

      return updatedSession;
    } catch (error) {
      logger.error('Failed to update session', error as Error, 'SESSION_HISTORY');
      return null;
    }
  }, [user, sessions, calculateStats]);

  const completeSession = useCallback(async (
    sessionId: string,
    finalData: { 
      duration_seconds?: number; 
      score?: number; 
      xp_earned?: number;
      session_data?: Json;
    }
  ): Promise<SessionHistoryEntry | null> => {
    return updateSession(sessionId, {
      duration_seconds: finalData.duration_seconds,
      score: finalData.score,
      xp_earned: finalData.xp_earned,
      session_data: finalData.session_data,
      completed: true,
      completed_at: new Date().toISOString()
    });
  }, [updateSession]);

  const deleteSession = useCallback(async (sessionId: string): Promise<boolean> => {
    if (!user) return false;

    try {
      const { error } = await supabase
        .from('session_history')
        .delete()
        .eq('id', sessionId)
        .eq('user_id', user.id);

      if (error) throw error;

      setSessions(prev => prev.filter(s => s.id !== sessionId));
      setStats(calculateStats(sessions.filter(s => s.id !== sessionId)));

      return true;
    } catch (error) {
      logger.error('Failed to delete session', error as Error, 'SESSION_HISTORY');
      return false;
    }
  }, [user, sessions, calculateStats]);

  const getSessionsByModule = useCallback((moduleType: ModuleType): SessionHistoryEntry[] => {
    return sessions.filter(s => s.module_type === moduleType);
  }, [sessions]);

  const getTodaySessions = useCallback((): SessionHistoryEntry[] => {
    const today = new Date().toISOString().split('T')[0];
    return sessions.filter(s => s.created_at.startsWith(today));
  }, [sessions]);

  const getWeekSessions = useCallback((): SessionHistoryEntry[] => {
    const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    return sessions.filter(s => new Date(s.created_at) >= weekAgo);
  }, [sessions]);

  useEffect(() => {
    fetchSessions();
  }, [fetchSessions]);

  return {
    sessions,
    stats,
    isLoading,
    fetchSessions,
    createSession,
    updateSession,
    completeSession,
    deleteSession,
    getSessionsByModule,
    getTodaySessions,
    getWeekSessions
  };
}
