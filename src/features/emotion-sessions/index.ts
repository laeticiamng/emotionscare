/**
 * Feature: Emotion Sessions
 * Gestion complète des sessions d'analyse émotionnelle
 * 
 * Fonctionnalités:
 * - Historique des scans
 * - Suivi des tendances
 * - Comparaison temporelle
 * - Export de données
 */

import { supabase } from '@/integrations/supabase/client';

// ============================================================================
// TYPES
// ============================================================================

export interface EmotionSession {
  id: string;
  user_id: string;
  session_type: EmotionSessionType;
  started_at: string;
  ended_at?: string;
  duration_seconds?: number;
  primary_emotion: string;
  emotion_scores: EmotionScores;
  triggers?: string[];
  context?: string;
  source: EmotionSource;
  metadata?: Record<string, unknown>;
}

export interface EmotionScores {
  joy: number;
  sadness: number;
  anger: number;
  fear: number;
  surprise: number;
  disgust: number;
  neutral: number;
  [key: string]: number;
}

export type EmotionSessionType = 
  | 'quick_scan'
  | 'deep_analysis'
  | 'voice_analysis'
  | 'journal_entry'
  | 'camera_scan';

export type EmotionSource = 
  | 'camera'
  | 'voice'
  | 'text'
  | 'manual'
  | 'wearable';

export interface EmotionTrend {
  date: string;
  dominant_emotion: string;
  average_scores: EmotionScores;
  session_count: number;
  mood_stability: number;
}

export interface EmotionComparison {
  period1: {
    start: string;
    end: string;
    averages: EmotionScores;
    dominant: string;
  };
  period2: {
    start: string;
    end: string;
    averages: EmotionScores;
    dominant: string;
  };
  changes: {
    emotion: string;
    change_percent: number;
    direction: 'up' | 'down' | 'stable';
  }[];
}

// ============================================================================
// HOOKS
// ============================================================================

import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';

export function useEmotionSessions(options?: {
  limit?: number;
  type?: EmotionSessionType;
  dateRange?: { start: string; end: string };
}) {
  const { user } = useAuth();
  const [sessions, setSessions] = useState<EmotionSession[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchSessions = useCallback(async () => {
    if (!user?.id) return;
    
    setLoading(true);
    try {
      let query = supabase
        .from('emotion_sessions')
        .select('*')
        .eq('user_id', user.id)
        .order('started_at', { ascending: false });
      
      if (options?.limit) {
        query = query.limit(options.limit);
      }
      
      if (options?.type) {
        query = query.eq('session_type', options.type);
      }
      
      if (options?.dateRange) {
        query = query
          .gte('started_at', options.dateRange.start)
          .lte('started_at', options.dateRange.end);
      }

      const { data, error: fetchError } = await query;
      
      if (fetchError) throw fetchError;
      
      setSessions((data || []).map(s => ({
        id: s.id,
        user_id: s.user_id,
        session_type: s.session_type as EmotionSessionType,
        started_at: s.started_at,
        ended_at: s.ended_at,
        duration_seconds: s.duration_seconds,
        primary_emotion: s.primary_emotion,
        emotion_scores: s.emotion_scores as EmotionScores,
        triggers: s.triggers,
        context: s.context,
        source: s.source as EmotionSource,
        metadata: s.metadata as Record<string, unknown>,
      })));
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Erreur de chargement');
    } finally {
      setLoading(false);
    }
  }, [user?.id, options?.limit, options?.type, options?.dateRange?.start, options?.dateRange?.end]);

  useEffect(() => {
    fetchSessions();
  }, [fetchSessions]);

  return { sessions, loading, error, refetch: fetchSessions };
}

export function useEmotionTrends(days: number = 7) {
  const { user } = useAuth();
  const [trends, setTrends] = useState<EmotionTrend[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user?.id) return;

    const fetchTrends = async () => {
      setLoading(true);
      
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - days);
      
      const { data } = await supabase
        .from('emotion_sessions')
        .select('*')
        .eq('user_id', user.id)
        .gte('started_at', startDate.toISOString())
        .order('started_at', { ascending: true });
      
      if (!data) {
        setLoading(false);
        return;
      }

      // Group by day and calculate averages
      const grouped = data.reduce((acc: Record<string, typeof data>, session) => {
        const date = session.started_at.split('T')[0];
        if (!acc[date]) {
          acc[date] = [];
        }
        acc[date].push(session);
        return acc;
      }, {} as Record<string, typeof data>);

      const calculatedTrends = Object.entries(grouped).map(([date, daySessions]) => {
        const sessions = daySessions as typeof data;
        const scores = sessions.reduce((acc: Record<string, number[]>, s) => {
          const emotionScores = s.emotion_scores as EmotionScores;
          Object.entries(emotionScores).forEach(([emotion, score]) => {
            if (!acc[emotion]) acc[emotion] = [];
            acc[emotion].push(score as number);
          });
          return acc;
        }, {} as Record<string, number[]>);

        const averages = Object.entries(scores).reduce((acc: EmotionScores, [emotion, values]) => {
          const vals = values as number[];
          acc[emotion] = vals.reduce((a: number, b: number) => a + b, 0) / vals.length;
          return acc;
        }, {} as EmotionScores);

        const dominant = Object.entries(averages).sort(([,a], [,b]) => b - a)[0]?.[0] || 'neutral';

        // Calculate stability (inverse of variance)
        const allScores = Object.values(averages);
        const mean = allScores.reduce((a, b) => a + b, 0) / allScores.length;
        const variance = allScores.reduce((acc, s) => acc + Math.pow(s - mean, 2), 0) / allScores.length;
        const stability = 1 - Math.min(variance / 100, 1);

        return {
          date,
          dominant_emotion: dominant,
          average_scores: averages,
          session_count: sessions.length,
          mood_stability: Math.round(stability * 100),
        };
      });

      setTrends(calculatedTrends);
      setLoading(false);
    };

    fetchTrends();
  }, [user?.id, days]);

  return { trends, loading };
}

export function useEmotionStats() {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    totalSessions: 0,
    averageMood: 0,
    dominantEmotion: 'neutral',
    streakDays: 0,
    improvementPercent: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user?.id) return;

    const fetchStats = async () => {
      setLoading(true);
      
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

      const { data, count } = await supabase
        .from('emotion_sessions')
        .select('*', { count: 'exact' })
        .eq('user_id', user.id)
        .gte('started_at', thirtyDaysAgo.toISOString());

      if (data && data.length > 0) {
        // Calculate dominant emotion
        const emotionCounts: Record<string, number> = {};
        data.forEach(s => {
          const emotion = s.primary_emotion;
          emotionCounts[emotion] = (emotionCounts[emotion] || 0) + 1;
        });
        const dominant = Object.entries(emotionCounts).sort(([,a], [,b]) => b - a)[0]?.[0] || 'neutral';

        // Calculate streak
        const sortedDates = [...new Set(data.map(s => s.started_at.split('T')[0]))].sort().reverse();
        let streak = 0;
        const today = new Date().toISOString().split('T')[0];
        
        for (let i = 0; i < sortedDates.length; i++) {
          const expectedDate = new Date();
          expectedDate.setDate(expectedDate.getDate() - i);
          const expected = expectedDate.toISOString().split('T')[0];
          
          if (sortedDates[i] === expected || (i === 0 && sortedDates[0] === today)) {
            streak++;
          } else {
            break;
          }
        }

        // Calculate improvement (compare first week vs last week)
        const firstWeek = data.slice(-7);
        const lastWeek = data.slice(0, 7);
        
        const avgFirst = firstWeek.reduce((acc, s) => {
          const scores = s.emotion_scores as EmotionScores;
          return acc + (scores.joy || 0) - (scores.sadness || 0) - (scores.anger || 0);
        }, 0) / (firstWeek.length || 1);
        
        const avgLast = lastWeek.reduce((acc, s) => {
          const scores = s.emotion_scores as EmotionScores;
          return acc + (scores.joy || 0) - (scores.sadness || 0) - (scores.anger || 0);
        }, 0) / (lastWeek.length || 1);

        const improvement = avgFirst !== 0 
          ? ((avgLast - avgFirst) / Math.abs(avgFirst)) * 100 
          : 0;

        setStats({
          totalSessions: count || 0,
          averageMood: Math.round(avgLast * 10) / 10,
          dominantEmotion: dominant,
          streakDays: streak,
          improvementPercent: Math.round(improvement),
        });
      }
      
      setLoading(false);
    };

    fetchStats();
  }, [user?.id]);

  return { stats, loading };
}

// ============================================================================
// SERVICE
// ============================================================================

export const emotionSessionsService = {
  async createSession(session: Omit<EmotionSession, 'id'>): Promise<EmotionSession | null> {
    const { data, error } = await supabase
      .from('emotion_sessions')
      .insert(session)
      .select()
      .single();
    
    if (error) {
      console.error('Error creating emotion session:', error);
      return null;
    }
    
    return data as EmotionSession;
  },

  async updateSession(id: string, updates: Partial<EmotionSession>): Promise<boolean> {
    const { error } = await supabase
      .from('emotion_sessions')
      .update(updates)
      .eq('id', id);
    
    return !error;
  },

  async deleteSession(id: string): Promise<boolean> {
    const { error } = await supabase
      .from('emotion_sessions')
      .delete()
      .eq('id', id);
    
    return !error;
  },

  async getComparison(
    userId: string, 
    period1: { start: string; end: string },
    period2: { start: string; end: string }
  ): Promise<EmotionComparison | null> {
    const [result1, result2] = await Promise.all([
      supabase
        .from('emotion_sessions')
        .select('*')
        .eq('user_id', userId)
        .gte('started_at', period1.start)
        .lte('started_at', period1.end),
      supabase
        .from('emotion_sessions')
        .select('*')
        .eq('user_id', userId)
        .gte('started_at', period2.start)
        .lte('started_at', period2.end),
    ]);

    if (!result1.data || !result2.data) return null;

    const calculateAverages = (sessions: typeof result1.data) => {
      const totals: Record<string, number[]> = {};
      
      sessions.forEach(s => {
        const scores = s.emotion_scores as EmotionScores;
        Object.entries(scores).forEach(([emotion, score]) => {
          if (!totals[emotion]) totals[emotion] = [];
          totals[emotion].push(score);
        });
      });

      return Object.entries(totals).reduce((acc, [emotion, values]) => {
        acc[emotion] = values.reduce((a, b) => a + b, 0) / values.length;
        return acc;
      }, {} as EmotionScores);
    };

    const avg1 = calculateAverages(result1.data);
    const avg2 = calculateAverages(result2.data);

    const getDominant = (scores: EmotionScores) => 
      Object.entries(scores).sort(([,a], [,b]) => b - a)[0]?.[0] || 'neutral';

    const changes = Object.keys({ ...avg1, ...avg2 }).map(emotion => {
      const v1 = avg1[emotion] || 0;
      const v2 = avg2[emotion] || 0;
      const change = v1 !== 0 ? ((v2 - v1) / v1) * 100 : 0;
      
      return {
        emotion,
        change_percent: Math.round(change),
        direction: change > 5 ? 'up' as const : change < -5 ? 'down' as const : 'stable' as const,
      };
    });

    return {
      period1: {
        start: period1.start,
        end: period1.end,
        averages: avg1,
        dominant: getDominant(avg1),
      },
      period2: {
        start: period2.start,
        end: period2.end,
        averages: avg2,
        dominant: getDominant(avg2),
      },
      changes,
    };
  },
};
