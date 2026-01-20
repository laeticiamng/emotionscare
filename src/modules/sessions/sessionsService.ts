/**
 * Service Sessions
 * Gestion centralisée des sessions utilisateur
 */

import { supabase } from '@/integrations/supabase/client';
import { logger } from '@/lib/logger';
import type {
  Session,
  CreateSession,
  CompleteSession,
  SessionStats,
  DailySessionSummary,
  SessionType,
  SessionReminder,
  CreateSessionReminder,
} from './types';

/**
 * Service de gestion des sessions
 */
export const SessionsService = {
  /**
   * Démarre une nouvelle session
   */
  async startSession(userId: string, data: CreateSession): Promise<Session> {
    const session = {
      user_id: userId,
      type: data.type,
      module_id: data.module_id,
      started_at: new Date().toISOString(),
      mood_before: data.mood_before,
      metadata: data.metadata || {},
      completed: false,
    };

    const { data: created, error } = await supabase
      .from('user_sessions')
      .insert(session)
      .select()
      .single();

    if (error) {
      // Si la table n'existe pas, on retourne un mock
      if (error.code === '42P01') {
        logger.warn('Table user_sessions not found, returning mock session');
        return {
          id: crypto.randomUUID(),
          ...session,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        } as Session;
      }
      throw new Error(`Failed to start session: ${error.message}`);
    }

    return created;
  },

  /**
   * Termine une session
   */
  async completeSession(sessionId: string, data: CompleteSession): Promise<Session> {
    const updates = {
      ended_at: data.ended_at || new Date().toISOString(),
      duration_seconds: data.duration_seconds,
      completed: data.completed ?? true,
      mood_after: data.mood_after,
      notes: data.notes,
      metadata: data.metadata,
      updated_at: new Date().toISOString(),
    };

    const { data: updated, error } = await supabase
      .from('user_sessions')
      .update(updates)
      .eq('id', sessionId)
      .select()
      .single();

    if (error) {
      throw new Error(`Failed to complete session: ${error.message}`);
    }

    return updated;
  },

  /**
   * Récupère une session par ID
   */
  async getSession(sessionId: string): Promise<Session | null> {
    const { data, error } = await supabase
      .from('user_sessions')
      .select('*')
      .eq('id', sessionId)
      .single();

    if (error) {
      if (error.code === 'PGRST116') return null;
      throw new Error(`Failed to get session: ${error.message}`);
    }

    return data;
  },

  /**
   * Récupère l'historique des sessions
   */
  async getSessionHistory(
    userId: string,
    options?: {
      type?: SessionType;
      limit?: number;
      offset?: number;
      startDate?: Date;
      endDate?: Date;
    }
  ): Promise<Session[]> {
    let query = supabase
      .from('user_sessions')
      .select('*')
      .eq('user_id', userId)
      .order('started_at', { ascending: false });

    if (options?.type) {
      query = query.eq('type', options.type);
    }

    if (options?.startDate) {
      query = query.gte('started_at', options.startDate.toISOString());
    }

    if (options?.endDate) {
      query = query.lte('started_at', options.endDate.toISOString());
    }

    if (options?.limit) {
      query = query.limit(options.limit);
    }

    if (options?.offset) {
      query = query.range(options.offset, options.offset + (options.limit || 10) - 1);
    }

    const { data, error } = await query;

    if (error) {
      // Si la table n'existe pas, retourner un tableau vide
      if (error.code === '42P01') {
        return [];
      }
      throw new Error(`Failed to get session history: ${error.message}`);
    }

    return data || [];
  },

  /**
   * Récupère les statistiques de sessions
   */
  async getStats(userId: string, days: number = 30): Promise<SessionStats> {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    const sessions = await this.getSessionHistory(userId, {
      startDate,
      limit: 1000,
    });

    if (sessions.length === 0) {
      return {
        totalSessions: 0,
        totalMinutes: 0,
        averageDuration: 0,
        completionRate: 0,
        streakDays: 0,
        longestStreak: 0,
        byType: {} as Record<SessionType, number>,
        moodImprovement: 0,
      };
    }

    // Calculs des stats
    const totalSessions = sessions.length;
    const completedSessions = sessions.filter(s => s.completed);
    const totalMinutes = sessions.reduce((sum, s) => sum + (s.duration_seconds || 0), 0) / 60;
    const averageDuration = totalMinutes / totalSessions;
    const completionRate = (completedSessions.length / totalSessions) * 100;

    // Stats par type
    const byType = sessions.reduce((acc, s) => {
      acc[s.type] = (acc[s.type] || 0) + 1;
      return acc;
    }, {} as Record<SessionType, number>);

    // Mood improvement
    const sessionsWithMood = sessions.filter(s => s.mood_before && s.mood_after);
    const moodImprovement = sessionsWithMood.length > 0
      ? sessionsWithMood.reduce((sum, s) => sum + ((s.mood_after || 0) - (s.mood_before || 0)), 0) / sessionsWithMood.length
      : 0;

    // Calcul des streaks
    const { currentStreak, longestStreak } = this.calculateStreaks(sessions);

    return {
      totalSessions,
      totalMinutes: Math.round(totalMinutes),
      averageDuration: Math.round(averageDuration),
      completionRate: Math.round(completionRate),
      streakDays: currentStreak,
      longestStreak,
      byType,
      moodImprovement: Math.round(moodImprovement * 10) / 10,
    };
  },

  /**
   * Calcule les streaks de sessions
   */
  calculateStreaks(sessions: Session[]): { currentStreak: number; longestStreak: number } {
    if (sessions.length === 0) {
      return { currentStreak: 0, longestStreak: 0 };
    }

    // Grouper par jour
    const sessionDays = new Set(
      sessions.map(s => new Date(s.started_at).toDateString())
    );

    // Calculer le streak actuel
    let currentStreak = 0;
    const today = new Date();

    for (let i = 0; i < 365; i++) {
      const checkDate = new Date(today);
      checkDate.setDate(checkDate.getDate() - i);
      
      if (sessionDays.has(checkDate.toDateString())) {
        currentStreak++;
      } else if (i > 0) {
        break;
      }
    }

    // Calculer le plus long streak
    const sortedDays = Array.from(sessionDays)
      .map(d => new Date(d))
      .sort((a, b) => a.getTime() - b.getTime());

    let longestStreak = 0;
    let tempStreak = 1;

    for (let i = 1; i < sortedDays.length; i++) {
      const diff = (sortedDays[i].getTime() - sortedDays[i - 1].getTime()) / (1000 * 60 * 60 * 24);
      
      if (diff === 1) {
        tempStreak++;
      } else {
        longestStreak = Math.max(longestStreak, tempStreak);
        tempStreak = 1;
      }
    }

    longestStreak = Math.max(longestStreak, tempStreak);

    return { currentStreak, longestStreak };
  },

  /**
   * Récupère le résumé quotidien
   */
  async getDailySummary(userId: string, date: Date): Promise<DailySessionSummary> {
    const startOfDay = new Date(date);
    startOfDay.setHours(0, 0, 0, 0);
    
    const endOfDay = new Date(date);
    endOfDay.setHours(23, 59, 59, 999);

    const sessions = await this.getSessionHistory(userId, {
      startDate: startOfDay,
      endDate: endOfDay,
    });

    const totalMinutes = sessions.reduce((sum, s) => sum + (s.duration_seconds || 0), 0) / 60;
    const types = [...new Set(sessions.map(s => s.type))] as SessionType[];
    const sessionsWithMood = sessions.filter(s => s.mood_after);
    const averageMood = sessionsWithMood.length > 0
      ? sessionsWithMood.reduce((sum, s) => sum + (s.mood_after || 0), 0) / sessionsWithMood.length
      : 0;

    return {
      date: date.toISOString().split('T')[0],
      sessionsCount: sessions.length,
      totalMinutes: Math.round(totalMinutes),
      types,
      averageMood: Math.round(averageMood * 10) / 10,
    };
  },

  /**
   * Session active (non terminée)
   */
  async getActiveSession(userId: string): Promise<Session | null> {
    const { data, error } = await supabase
      .from('user_sessions')
      .select('*')
      .eq('user_id', userId)
      .is('ended_at', null)
      .order('started_at', { ascending: false })
      .limit(1)
      .single();

    if (error) {
      if (error.code === 'PGRST116' || error.code === '42P01') return null;
      throw new Error(`Failed to get active session: ${error.message}`);
    }

    return data;
  },

  /**
   * Appel à l'edge function sessions-api pour les stats
   */
  async getStatsFromEdge(userId: string): Promise<SessionStats | null> {
    const { data, error } = await supabase.functions.invoke('sessions-api', {
      body: { action: 'stats' },
    });

    if (error) {
      logger.warn('sessions-api edge function not available, using local stats');
      return null;
    }

    return data?.stats || null;
  },
};

export const sessionsService = SessionsService;
export default SessionsService;
