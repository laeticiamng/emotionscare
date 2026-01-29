/**
 * useMeditationPersistence - Hook pour persister les sessions de méditation
 * Corrige: meditation_sessions: 0 persistées
 */

import { useCallback, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { logger } from '@/lib/logger';

export interface MeditationSession {
  id?: string;
  user_id?: string;
  meditation_id?: string;
  title: string;
  duration_seconds: number;
  completed: boolean;
  mood_before?: number;
  mood_after?: number;
  notes?: string;
  started_at: string;
  completed_at?: string;
}

export function useMeditationPersistence() {
  const { user, isAuthenticated } = useAuth();
  const { toast } = useToast();
  const activeSessionRef = useRef<string | null>(null);

  // Start a meditation session
  const startSession = useCallback(async (
    meditationId: string,
    title: string,
    moodBefore?: number
  ): Promise<string | null> => {
    if (!isAuthenticated || !user?.id) {
      logger.warn('Cannot start meditation: user not authenticated', 'MEDITATION');
      return null;
    }

    try {
      const { data, error } = await supabase
        .from('activity_sessions')
        .insert({
          user_id: user.id,
          activity_id: meditationId,
          started_at: new Date().toISOString(),
          completed: false,
          mood_before: moodBefore,
          metadata: { type: 'meditation', title },
        })
        .select('id')
        .single();

      if (error) throw error;

      activeSessionRef.current = data.id;
      logger.info(`Started meditation session: ${data.id}`, 'MEDITATION');
      return data.id;
    } catch (err) {
      logger.error(`Failed to start meditation: ${err}`, 'MEDITATION');
      return null;
    }
  }, [isAuthenticated, user?.id]);

  // Complete a meditation session
  const completeSession = useCallback(async (
    sessionId: string,
    durationSeconds: number,
    moodAfter?: number,
    notes?: string
  ): Promise<boolean> => {
    if (!isAuthenticated || !user?.id) return false;

    try {
      const { error } = await supabase
        .from('activity_sessions')
        .update({
          completed: true,
          completed_at: new Date().toISOString(),
          duration_seconds: durationSeconds,
          mood_after: moodAfter,
          notes,
        })
        .eq('id', sessionId)
        .eq('user_id', user.id);

      if (error) throw error;

      // Update streak
      await supabase
        .from('activity_streaks')
        .upsert({
          user_id: user.id,
          last_activity_date: new Date().toISOString().split('T')[0],
          total_activities: 1,
          total_minutes: Math.floor(durationSeconds / 60),
          updated_at: new Date().toISOString(),
        }, { onConflict: 'user_id' });

      activeSessionRef.current = null;

      toast({
        title: '🧘 Session terminée',
        description: `${Math.floor(durationSeconds / 60)} minutes de méditation`,
      });

      logger.info(`Completed meditation session: ${sessionId}`, 'MEDITATION');
      return true;
    } catch (err) {
      logger.error(`Failed to complete meditation: ${err}`, 'MEDITATION');
      return false;
    }
  }, [isAuthenticated, user?.id, toast]);

  // Record a quick meditation (start + complete in one call)
  const recordQuickSession = useCallback(async (
    title: string,
    durationSeconds: number,
    moodBefore?: number,
    moodAfter?: number
  ): Promise<string | null> => {
    if (!isAuthenticated || !user?.id) return null;

    try {
      const { data, error } = await supabase
        .from('activity_sessions')
        .insert({
          user_id: user.id,
          started_at: new Date(Date.now() - durationSeconds * 1000).toISOString(),
          completed_at: new Date().toISOString(),
          completed: true,
          duration_seconds: durationSeconds,
          mood_before: moodBefore,
          mood_after: moodAfter,
          metadata: { type: 'meditation', title },
        })
        .select('id')
        .single();

      if (error) throw error;

      toast({
        title: '🧘 Session enregistrée',
        description: `${Math.floor(durationSeconds / 60)} minutes`,
      });

      return data.id;
    } catch (err) {
      logger.error(`Failed to record meditation: ${err}`, 'MEDITATION');
      return null;
    }
  }, [isAuthenticated, user?.id, toast]);

  // Get meditation history
  const getHistory = useCallback(async (limit = 20): Promise<MeditationSession[]> => {
    if (!isAuthenticated || !user?.id) return [];

    try {
      const { data } = await supabase
        .from('activity_sessions')
        .select('*')
        .eq('user_id', user.id)
        .contains('metadata', { type: 'meditation' })
        .order('started_at', { ascending: false })
        .limit(limit);

      return (data || []).map(s => ({
        id: s.id,
        user_id: s.user_id,
        meditation_id: s.activity_id,
        title: (s.metadata as any)?.title || 'Méditation',
        duration_seconds: s.duration_seconds || 0,
        completed: s.completed || false,
        mood_before: s.mood_before,
        mood_after: s.mood_after,
        notes: s.notes,
        started_at: s.started_at,
        completed_at: s.completed_at,
      }));
    } catch (err) {
      logger.error(`Failed to fetch meditation history: ${err}`, 'MEDITATION');
      return [];
    }
  }, [isAuthenticated, user?.id]);

  // Get stats
  const getStats = useCallback(async () => {
    if (!isAuthenticated || !user?.id) return null;

    try {
      const { data } = await supabase
        .from('activity_sessions')
        .select('duration_seconds, completed')
        .eq('user_id', user.id)
        .contains('metadata', { type: 'meditation' })
        .eq('completed', true);

      const sessions = data || [];
      const totalMinutes = sessions.reduce((sum, s) => sum + (s.duration_seconds || 0), 0) / 60;

      return {
        totalSessions: sessions.length,
        totalMinutes: Math.round(totalMinutes),
        averageMinutes: sessions.length > 0 ? Math.round(totalMinutes / sessions.length) : 0,
      };
    } catch (err) {
      logger.error(`Failed to fetch meditation stats: ${err}`, 'MEDITATION');
      return null;
    }
  }, [isAuthenticated, user?.id]);

  return {
    activeSessionId: activeSessionRef.current,
    startSession,
    completeSession,
    recordQuickSession,
    getHistory,
    getStats,
  };
}

export default useMeditationPersistence;
