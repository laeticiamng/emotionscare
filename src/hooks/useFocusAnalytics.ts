// @ts-nocheck
/**
 * useFocusAnalytics - Analytics avancées Focus Flow
 */

import { useState, useCallback, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { logger } from '@/lib/logger';

interface FocusSession {
  id: string;
  mode: 'work' | 'study' | 'meditation';
  duration_minutes: number;
  performance_score: number;
  avg_tempo: number;
  started_at: string;
  hour_of_day: number;
  day_of_week: number;
  completed: boolean;
}

interface AnalyticsSummary {
  totalSessions: number;
  avgPerformance: number;
  avgDuration: number;
  completedSessions: number;
  bestHour: number;
  bestDay: number;
  tempoCorrelation: number;
}

export const useFocusAnalytics = () => {
  const { user } = useAuth();
  const [sessions, setSessions] = useState<FocusSession[]>([]);
  const [summary, setSummary] = useState<AnalyticsSummary | null>(null);
  const [loading, setLoading] = useState(false);

  /**
   * Charger les sessions de l'utilisateur
   */
  const loadSessions = useCallback(async (startDate?: Date, endDate?: Date) => {
    if (!user) return;

    setLoading(true);
    try {
      let query = supabase
        .from('focus_sessions')
        .select('*')
        .eq('user_id', user.id)
        .order('started_at', { ascending: false });

      if (startDate) {
        query = query.gte('started_at', startDate.toISOString());
      }
      if (endDate) {
        query = query.lte('started_at', endDate.toISOString());
      }

      const { data, error } = await query.limit(100);

      if (error) throw error;

      setSessions(data || []);
      logger.info('📊 Sessions loaded', { count: data?.length }, 'ANALYTICS');
    } catch (error) {
      logger.error('❌ Failed to load sessions', error as Error, 'ANALYTICS');
    } finally {
      setLoading(false);
    }
  }, [user]);

  /**
   * Calculer le résumé analytique
   */
  const calculateSummary = useCallback(() => {
    if (!sessions.length) {
      setSummary(null);
      return;
    }

    const completed = sessions.filter(s => s.completed);
    const totalSessions = sessions.length;
    const avgPerformance = completed.reduce((sum, s) => sum + (s.performance_score || 0), 0) / completed.length;
    const avgDuration = sessions.reduce((sum, s) => sum + s.duration_minutes, 0) / totalSessions;

    // Trouver la meilleure heure
    const hourScores: Record<number, { total: number; count: number }> = {};
    completed.forEach(s => {
      if (!hourScores[s.hour_of_day]) {
        hourScores[s.hour_of_day] = { total: 0, count: 0 };
      }
      hourScores[s.hour_of_day].total += s.performance_score || 0;
      hourScores[s.hour_of_day].count += 1;
    });
    
    const bestHour = Object.entries(hourScores).reduce((best, [hour, scores]) => {
      const avg = scores.total / scores.count;
      return avg > best.avg ? { hour: parseInt(hour), avg } : best;
    }, { hour: 9, avg: 0 }).hour;

    // Trouver le meilleur jour
    const dayScores: Record<number, { total: number; count: number }> = {};
    completed.forEach(s => {
      if (!dayScores[s.day_of_week]) {
        dayScores[s.day_of_week] = { total: 0, count: 0 };
      }
      dayScores[s.day_of_week].total += s.performance_score || 0;
      dayScores[s.day_of_week].count += 1;
    });
    
    const bestDay = Object.entries(dayScores).reduce((best, [day, scores]) => {
      const avg = scores.total / scores.count;
      return avg > best.avg ? { day: parseInt(day), avg } : best;
    }, { day: 1, avg: 0 }).day;

    // Corrélation tempo/performance (coefficient de Pearson simplifié)
    const validSessions = completed.filter(s => s.avg_tempo && s.performance_score);
    if (validSessions.length > 2) {
      const tempos = validSessions.map(s => s.avg_tempo);
      const perfs = validSessions.map(s => s.performance_score);
      const tempoCorrelation = calculateCorrelation(tempos, perfs);
      
      setSummary({
        totalSessions,
        avgPerformance: Math.round(avgPerformance),
        avgDuration: Math.round(avgDuration),
        completedSessions: completed.length,
        bestHour,
        bestDay,
        tempoCorrelation,
      });
    } else {
      setSummary({
        totalSessions,
        avgPerformance: Math.round(avgPerformance),
        avgDuration: Math.round(avgDuration),
        completedSessions: completed.length,
        bestHour,
        bestDay,
        tempoCorrelation: 0,
      });
    }
  }, [sessions]);

  /**
   * Enregistrer une nouvelle session
   */
  const recordSession = useCallback(async (
    mode: 'work' | 'study' | 'meditation',
    durationMinutes: number,
    performanceScore: number,
    avgTempo?: number,
    interruptions: number = 0,
    completed: boolean = true
  ) => {
    if (!user) return;

    try {
      const now = new Date();
      const { error } = await supabase.from('focus_sessions').insert({
        user_id: user.id,
        mode,
        duration_minutes: durationMinutes,
        performance_score: performanceScore,
        avg_tempo: avgTempo,
        interruptions_count: interruptions,
        completed,
        started_at: now.toISOString(),
        completed_at: completed ? now.toISOString() : null,
        hour_of_day: now.getHours(),
        day_of_week: now.getDay(),
      });

      if (error) throw error;

      logger.info('✅ Session recorded', { mode, duration: durationMinutes }, 'ANALYTICS');
      await loadSessions();
    } catch (error) {
      logger.error('❌ Failed to record session', error as Error, 'ANALYTICS');
    }
  }, [user, loadSessions]);

  /**
   * Exporter rapport PDF
   */
  const exportPDF = useCallback(async () => {
    if (!sessions.length || !summary) return;

    try {
      const { data, error } = await supabase.functions.invoke('export-focus-report', {
        body: {
          sessions,
          summary,
        },
      });

      if (error) throw error;

      // Télécharger le PDF
      const blob = new Blob([data], { type: 'application/pdf' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `focus-report-${new Date().toISOString().split('T')[0]}.pdf`;
      link.click();
      window.URL.revokeObjectURL(url);

      logger.info('✅ PDF exported', {}, 'ANALYTICS');
    } catch (error) {
      logger.error('❌ Failed to export PDF', error as Error, 'ANALYTICS');
    }
  }, [sessions, summary]);

  useEffect(() => {
    calculateSummary();
  }, [sessions, calculateSummary]);

  useEffect(() => {
    if (user) {
      loadSessions();
    }
  }, [user, loadSessions]);

  return {
    sessions,
    summary,
    loading,
    loadSessions,
    recordSession,
    exportPDF,
  };
};

/**
 * Calcul coefficient de corrélation de Pearson
 */
function calculateCorrelation(x: number[], y: number[]): number {
  const n = x.length;
  if (n === 0) return 0;

  const sumX = x.reduce((a, b) => a + b, 0);
  const sumY = y.reduce((a, b) => a + b, 0);
  const sumXY = x.reduce((sum, xi, i) => sum + xi * y[i], 0);
  const sumX2 = x.reduce((sum, xi) => sum + xi * xi, 0);
  const sumY2 = y.reduce((sum, yi) => sum + yi * yi, 0);

  const numerator = n * sumXY - sumX * sumY;
  const denominator = Math.sqrt((n * sumX2 - sumX * sumX) * (n * sumY2 - sumY * sumY));

  if (denominator === 0) return 0;
  
  return numerator / denominator;
}
