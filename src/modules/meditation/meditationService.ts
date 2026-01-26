/**
 * Meditation Service - API calls et business logic
 */

import { supabase } from '@/integrations/supabase/client';
import { Sentry } from '@/lib/errors/sentry-compat';
import type {
  CreateMeditationSession,
  CompleteMeditationSession,
  MeditationSession,
  MeditationStats,
  MeditationTechnique,
  SessionCompletionData,
} from './types';

export const meditationService = {
  /**
   * Créer une nouvelle session de méditation
   */
  async createSession(data: CreateMeditationSession): Promise<MeditationSession> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      const sessionData = {
        user_id: user.id,
        technique: data.technique,
        duration: data.duration * 60, // convert minutes to seconds
        mood_before: data.moodBefore ?? null,
        with_guidance: data.withGuidance,
        with_music: data.withMusic,
        completed: false,
      };

      const { data: session, error } = await supabase
        .from('meditation_sessions')
        .insert(sessionData)
        .select()
        .single();

      if (error) throw error;

      Sentry.addBreadcrumb({
        category: 'meditation',
        message: 'Session created',
        data: { technique: data.technique, duration: data.duration },
      });

      return {
        id: session.id,
        userId: session.user_id,
        technique: session.technique as MeditationTechnique,
        duration: session.duration,
        completedDuration: session.completed_duration || 0,
        moodBefore: session.mood_before,
        moodAfter: session.mood_after,
        moodDelta: session.mood_delta,
        withGuidance: session.with_guidance,
        withMusic: session.with_music,
        completed: session.completed,
        createdAt: session.created_at,
        completedAt: session.completed_at,
      };
    } catch (error) {
      Sentry.captureException(error);
      throw error;
    }
  },

  /**
   * Compléter une session de méditation
   */
  async completeSession(data: CompleteMeditationSession): Promise<MeditationSession> {
    try {
      const updateData: SessionCompletionData = {
        completed: true,
        completed_duration: data.completedDuration,
        completed_at: new Date().toISOString(),
      };

      if (data.moodAfter !== undefined) {
        updateData.mood_after = data.moodAfter;
      }

      const { data: session, error } = await supabase
        .from('meditation_sessions')
        .update(updateData)
        .eq('id', data.sessionId)
        .select()
        .single();

      if (error) throw error;

      // Calculer le mood delta si on a before et after
      if (session.mood_before !== null && session.mood_after !== null) {
        const moodDelta = session.mood_after - session.mood_before;
        await supabase
          .from('meditation_sessions')
          .update({ mood_delta: moodDelta })
          .eq('id', data.sessionId);
      }

      Sentry.addBreadcrumb({
        category: 'meditation',
        message: 'Session completed',
        data: { 
          sessionId: data.sessionId, 
          duration: data.completedDuration,
          moodDelta: session.mood_delta 
        },
      });

      return {
        id: session.id,
        userId: session.user_id,
        technique: session.technique as MeditationTechnique,
        duration: session.duration,
        completedDuration: session.completed_duration,
        moodBefore: session.mood_before,
        moodAfter: session.mood_after,
        moodDelta: session.mood_delta,
        withGuidance: session.with_guidance,
        withMusic: session.with_music,
        completed: session.completed,
        createdAt: session.created_at,
        completedAt: session.completed_at,
      };
    } catch (error) {
      Sentry.captureException(error);
      throw error;
    }
  },

  /**
   * Obtenir les statistiques utilisateur
   */
  async getStats(): Promise<MeditationStats> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      const { data: sessions, error } = await supabase
        .from('meditation_sessions')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;

      const completedSessions = sessions?.filter(s => s.completed) || [];
      const totalSessions = completedSessions.length;
      
      if (totalSessions === 0) {
        return {
          totalSessions: 0,
          totalDuration: 0,
          averageDuration: 0,
          favoriteTechnique: null,
          completionRate: 0,
          currentStreak: 0,
          longestStreak: 0,
          avgMoodDelta: null,
        };
      }

      const totalDuration = completedSessions.reduce((sum, s) => sum + (s.completed_duration || 0), 0);
      const averageDuration = totalDuration / totalSessions;

      // Technique favorite
      const techniqueCounts = completedSessions.reduce((acc, s) => {
        acc[s.technique] = (acc[s.technique] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);
      const entries = Object.entries(techniqueCounts) as Array<[string, number]>;
      const topTechnique = entries.sort((a, b) => b[1] - a[1])[0];
      const favoriteTechnique = topTechnique ? topTechnique[0] as MeditationTechnique : null;

      // Taux de complétion
      const allSessions = sessions?.length || 0;
      const completionRate = allSessions > 0 ? (totalSessions / allSessions) * 100 : 0;

      // Moyenne mood delta
      const moodDeltas = completedSessions
        .filter(s => s.mood_delta !== null)
        .map(s => s.mood_delta);
      const avgMoodDelta = moodDeltas.length > 0
        ? moodDeltas.reduce((sum, d) => sum + d, 0) / moodDeltas.length
        : null;

      // Streaks (simplifié - jours consécutifs)
      const { currentStreak, longestStreak } = calculateStreaks(completedSessions);

      return {
        totalSessions,
        totalDuration,
        averageDuration,
        favoriteTechnique: favoriteTechnique || null,
        completionRate,
        currentStreak,
        longestStreak,
        avgMoodDelta,
      };
    } catch (error) {
      Sentry.captureException(error);
      throw error;
    }
  },

  /**
   * Récupérer les sessions récentes
   */
  async getRecentSessions(limit: number = 10): Promise<MeditationSession[]> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      const { data: sessions, error } = await supabase
        .from('meditation_sessions')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(limit);

      if (error) throw error;

      return (sessions || []).map(s => ({
        id: s.id,
        userId: s.user_id,
        technique: s.technique as MeditationTechnique,
        duration: s.duration,
        completedDuration: s.completed_duration || 0,
        moodBefore: s.mood_before,
        moodAfter: s.mood_after,
        moodDelta: s.mood_delta,
        withGuidance: s.with_guidance,
        withMusic: s.with_music,
        completed: s.completed,
        createdAt: s.created_at,
        completedAt: s.completed_at,
      }));
    } catch (error) {
      Sentry.captureException(error);
      throw error;
    }
  },
};

/**
 * Calculer les streaks de pratique
 */
function calculateStreaks(sessions: any[]): { currentStreak: number; longestStreak: number } {
  if (sessions.length === 0) return { currentStreak: 0, longestStreak: 0 };

  // Grouper par date
  const sessionsByDate = sessions.reduce((acc, s) => {
    const date = new Date(s.completed_at || s.created_at).toDateString();
    acc[date] = true;
    return acc;
  }, {} as Record<string, boolean>);

  const dates = Object.keys(sessionsByDate).sort((a, b) => 
    new Date(b).getTime() - new Date(a).getTime()
  );

  let currentStreak = 0;
  let longestStreak = 0;
  let tempStreak = 0;
  let lastDate = new Date(dates[0]);

  for (const dateStr of dates) {
    const date = new Date(dateStr);
    const daysDiff = Math.floor((lastDate.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));

    if (daysDiff <= 1) {
      tempStreak++;
      if (currentStreak === 0) currentStreak = tempStreak;
    } else {
      if (tempStreak > longestStreak) longestStreak = tempStreak;
      tempStreak = 1;
    }

    lastDate = date;
  }

  if (tempStreak > longestStreak) longestStreak = tempStreak;

  return { currentStreak, longestStreak };
}
