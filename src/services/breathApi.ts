/**
 * Breath API - Service d'analyse de respiration
 * Utilise Supabase pour la persistance et l'analyse
 */

import { supabase } from '@/integrations/supabase/client';
import { logger } from '@/lib/logger';

export interface BreathRow {
  week: string;
  hrv_stress_idx: number;
  coherence_avg: number;
  mvpa_minutes: number;
  relax_pct: number;
  mindfulness_pct: number;
  mood_avg: number;
}

export interface BreathOrgRow extends BreathRow {
  member_count: number;
}

export interface BreathSession {
  id: string;
  user_id: string;
  pattern_type: string;
  duration_seconds: number;
  coherence_score?: number;
  completed_at: string;
}

/**
 * Récupère les données hebdomadaires de respiration de l'utilisateur
 */
export const fetchUserWeekly = async (since?: string): Promise<BreathRow[]> => {
  try {
    const { data: userData } = await supabase.auth.getUser();
    if (!userData.user) {
      throw new Error('User not authenticated');
    }

    let query = supabase
      .from('breath_sessions')
      .select('*')
      .eq('user_id', userData.user.id)
      .order('completed_at', { ascending: false });

    if (since) {
      query = query.gte('completed_at', since);
    }

    const { data, error } = await query;

    if (error) {
      logger.error('Error fetching user breath data', error, 'BREATH');
      throw error;
    }

    // Agréger par semaine
    const weeklyData = aggregateByWeek(data || []);
    return weeklyData;
  } catch (error) {
    logger.error('fetchUserWeekly error', error as Error, 'BREATH');
    return [];
  }
};

/**
 * Récupère les données hebdomadaires de l'organisation
 */
export const fetchOrgWeekly = async (
  orgId: string,
  since?: string
): Promise<BreathOrgRow[]> => {
  try {
    const { data, error } = await supabase.functions.invoke('b2b-aggregate', {
      body: {
        org_id: orgId,
        metric_type: 'breath',
        since
      }
    });

    if (error) {
      logger.error('Error fetching org breath data', error, 'BREATH');
      throw error;
    }

    return (data?.weekly || []) as BreathOrgRow[];
  } catch (error) {
    logger.error('fetchOrgWeekly error', error as Error, 'BREATH');
    return [];
  }
};

/**
 * Enregistre une session de respiration
 */
export const saveBreathSession = async (session: Omit<BreathSession, 'id'>): Promise<string | null> => {
  try {
    const { data, error } = await supabase
      .from('breath_sessions')
      .insert({
        user_id: session.user_id,
        pattern_type: session.pattern_type,
        duration_seconds: session.duration_seconds,
        coherence_score: session.coherence_score,
        completed_at: session.completed_at || new Date().toISOString()
      })
      .select('id')
      .single();

    if (error) {
      logger.error('Error saving breath session', error, 'BREATH');
      throw error;
    }

    return data?.id || null;
  } catch (error) {
    logger.error('saveBreathSession error', error as Error, 'BREATH');
    return null;
  }
};

/**
 * Récupère les statistiques de respiration de l'utilisateur
 */
export const getBreathStats = async (): Promise<{
  totalSessions: number;
  totalMinutes: number;
  avgCoherence: number;
  currentStreak: number;
  longestStreak: number;
}> => {
  try {
    const { data: userData } = await supabase.auth.getUser();
    if (!userData.user) {
      return { totalSessions: 0, totalMinutes: 0, avgCoherence: 0, currentStreak: 0, longestStreak: 0 };
    }

    const { data, error } = await supabase
      .from('breath_sessions')
      .select('duration_seconds, coherence_score, completed_at')
      .eq('user_id', userData.user.id)
      .order('completed_at', { ascending: false });

    if (error) {
      throw error;
    }

    const sessions = data || [];
    const totalSessions = sessions.length;
    const totalMinutes = Math.round(sessions.reduce((acc, s) => acc + (s.duration_seconds || 0), 0) / 60);
    
    const coherenceScores = sessions.filter(s => s.coherence_score != null).map(s => s.coherence_score!);
    const avgCoherence = coherenceScores.length > 0 
      ? Math.round(coherenceScores.reduce((a, b) => a + b, 0) / coherenceScores.length * 100) / 100
      : 0;

    // Calculer les streaks
    const { currentStreak, longestStreak } = calculateStreaks(sessions);

    return { totalSessions, totalMinutes, avgCoherence, currentStreak, longestStreak };
  } catch (error) {
    logger.error('getBreathStats error', error as Error, 'BREATH');
    return { totalSessions: 0, totalMinutes: 0, avgCoherence: 0, currentStreak: 0, longestStreak: 0 };
  }
};

/**
 * Récupère l'historique des sessions de respiration
 */
export const getBreathHistory = async (limit: number = 30): Promise<BreathSession[]> => {
  try {
    const { data: userData } = await supabase.auth.getUser();
    if (!userData.user) {
      return [];
    }

    const { data, error } = await supabase
      .from('breath_sessions')
      .select('*')
      .eq('user_id', userData.user.id)
      .order('completed_at', { ascending: false })
      .limit(limit);

    if (error) {
      throw error;
    }

    return data || [];
  } catch (error) {
    logger.error('getBreathHistory error', error as Error, 'BREATH');
    return [];
  }
};

// Helpers

function aggregateByWeek(sessions: any[]): BreathRow[] {
  const weekMap: Record<string, { 
    coherenceSum: number; 
    count: number; 
    moodSum: number;
    totalDuration: number;
  }> = {};

  sessions.forEach(session => {
    const date = new Date(session.completed_at);
    const weekStart = getWeekStart(date);
    const weekKey = weekStart.toISOString().split('T')[0];

    if (!weekMap[weekKey]) {
      weekMap[weekKey] = { coherenceSum: 0, count: 0, moodSum: 0, totalDuration: 0 };
    }

    weekMap[weekKey].coherenceSum += session.coherence_score || 0;
    weekMap[weekKey].count++;
    weekMap[weekKey].moodSum += session.mood_after || 5;
    weekMap[weekKey].totalDuration += session.duration_seconds || 0;
  });

  return Object.entries(weekMap).map(([week, data]) => ({
    week,
    hrv_stress_idx: Math.random() * 0.3 + 0.2, // Placeholder - needs HRV data
    coherence_avg: data.count > 0 ? data.coherenceSum / data.count : 0,
    mvpa_minutes: Math.round(data.totalDuration / 60),
    relax_pct: Math.min(100, data.count * 10),
    mindfulness_pct: Math.min(100, data.count * 15),
    mood_avg: data.count > 0 ? data.moodSum / data.count : 5
  }));
}

function getWeekStart(date: Date): Date {
  const d = new Date(date);
  const day = d.getDay();
  const diff = d.getDate() - day + (day === 0 ? -6 : 1);
  d.setDate(diff);
  d.setHours(0, 0, 0, 0);
  return d;
}

function calculateStreaks(sessions: any[]): { currentStreak: number; longestStreak: number } {
  if (sessions.length === 0) {
    return { currentStreak: 0, longestStreak: 0 };
  }

  const dates = sessions.map(s => new Date(s.completed_at).toDateString());
  const uniqueDates = [...new Set(dates)];
  
  let currentStreak = 0;
  let longestStreak = 0;
  let streak = 1;
  
  const today = new Date().toDateString();
  const yesterday = new Date(Date.now() - 86400000).toDateString();
  
  // Check current streak
  if (uniqueDates[0] === today || uniqueDates[0] === yesterday) {
    currentStreak = 1;
    for (let i = 1; i < uniqueDates.length; i++) {
      const current = new Date(uniqueDates[i - 1]);
      const previous = new Date(uniqueDates[i]);
      const diffDays = Math.round((current.getTime() - previous.getTime()) / 86400000);
      
      if (diffDays === 1) {
        currentStreak++;
      } else {
        break;
      }
    }
  }

  // Calculate longest streak
  for (let i = 1; i < uniqueDates.length; i++) {
    const current = new Date(uniqueDates[i - 1]);
    const previous = new Date(uniqueDates[i]);
    const diffDays = Math.round((current.getTime() - previous.getTime()) / 86400000);
    
    if (diffDays === 1) {
      streak++;
    } else {
      longestStreak = Math.max(longestStreak, streak);
      streak = 1;
    }
  }
  longestStreak = Math.max(longestStreak, streak);

  return { currentStreak, longestStreak };
}

export default {
  fetchUserWeekly,
  fetchOrgWeekly,
  saveBreathSession,
  getBreathStats,
  getBreathHistory
};
