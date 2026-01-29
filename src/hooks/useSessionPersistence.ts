/**
 * useSessionPersistence - Hook unifié pour persister les sessions
 * Corrige le problème de 0 enregistrements dans breath_sessions, meditation_sessions, etc.
 */

import { useCallback, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { logger } from '@/lib/logger';

export type SessionType = 'breath' | 'meditation' | 'scan' | 'vr' | 'ar_filter' | 'music';

interface SessionData {
  type: SessionType;
  duration_seconds: number;
  metadata?: Record<string, unknown>;
  mood_before?: number;
  mood_after?: number;
  completed?: boolean;
}

interface SessionResult {
  id: string;
  xp_earned: number;
  streak_updated: boolean;
}

export function useSessionPersistence() {
  const { user, isAuthenticated } = useAuth();
  const pendingSessionRef = useRef<string | null>(null);

  /**
   * Démarre une nouvelle session et retourne son ID
   */
  const startSession = useCallback(async (
    type: SessionType,
    metadata?: Record<string, unknown>
  ): Promise<string | null> => {
    if (!isAuthenticated || !user?.id) {
      logger.warn('Cannot start session: user not authenticated', 'SESSION');
      return null;
    }

    try {
      const tableName = getTableName(type);
      
      const { data, error } = await supabase
        .from(tableName)
        .insert({
          user_id: user.id,
          started_at: new Date().toISOString(),
          completed: false,
          metadata: metadata || {},
        })
        .select('id')
        .single();

      if (error) {
        logger.error(`Failed to start ${type} session: ${error.message}`, 'SESSION');
        return null;
      }

      pendingSessionRef.current = data.id;
      logger.info(`Started ${type} session: ${data.id}`, 'SESSION');
      return data.id;
    } catch (err) {
      logger.error(`Session start error: ${err}`, 'SESSION');
      return null;
    }
  }, [isAuthenticated, user?.id]);

  /**
   * Complète une session existante
   */
  const completeSession = useCallback(async (
    sessionId: string,
    data: Partial<SessionData>
  ): Promise<SessionResult | null> => {
    if (!isAuthenticated || !user?.id) {
      logger.warn('Cannot complete session: user not authenticated', 'SESSION');
      return null;
    }

    try {
      const tableName = getTableName(data.type || 'breath');
      
      const { error } = await supabase
        .from(tableName)
        .update({
          completed_at: new Date().toISOString(),
          completed: true,
          duration_seconds: data.duration_seconds,
          mood_before: data.mood_before,
          mood_after: data.mood_after,
          metadata: data.metadata,
        })
        .eq('id', sessionId)
        .eq('user_id', user.id);

      if (error) {
        logger.error(`Failed to complete session: ${error.message}`, 'SESSION');
        return null;
      }

      // Award XP for completing session
      const xpEarned = calculateXP(data.type || 'breath', data.duration_seconds || 0);
      await awardXP(user.id, xpEarned, `${data.type}_session`);

      // Update streak
      const streakUpdated = await updateStreak(user.id, data.type || 'breath');

      pendingSessionRef.current = null;
      logger.info(`Completed session ${sessionId}, XP: ${xpEarned}`, 'SESSION');
      
      return {
        id: sessionId,
        xp_earned: xpEarned,
        streak_updated: streakUpdated,
      };
    } catch (err) {
      logger.error(`Session complete error: ${err}`, 'SESSION');
      return null;
    }
  }, [isAuthenticated, user?.id]);

  /**
   * Enregistre une session complète en une seule opération
   */
  const recordSession = useCallback(async (
    data: SessionData
  ): Promise<SessionResult | null> => {
    if (!isAuthenticated || !user?.id) {
      logger.warn('Cannot record session: user not authenticated', 'SESSION');
      return null;
    }

    try {
      const tableName = getTableName(data.type);
      
      const { data: inserted, error } = await supabase
        .from(tableName)
        .insert({
          user_id: user.id,
          started_at: new Date(Date.now() - (data.duration_seconds * 1000)).toISOString(),
          completed_at: new Date().toISOString(),
          completed: data.completed ?? true,
          duration_seconds: data.duration_seconds,
          mood_before: data.mood_before,
          mood_after: data.mood_after,
          metadata: data.metadata || {},
        })
        .select('id')
        .single();

      if (error) {
        logger.error(`Failed to record ${data.type} session: ${error.message}`, 'SESSION');
        return null;
      }

      // Award XP
      const xpEarned = calculateXP(data.type, data.duration_seconds);
      await awardXP(user.id, xpEarned, `${data.type}_session`);

      // Update streak
      const streakUpdated = await updateStreak(user.id, data.type);

      logger.info(`Recorded ${data.type} session: ${inserted.id}, XP: ${xpEarned}`, 'SESSION');
      
      return {
        id: inserted.id,
        xp_earned: xpEarned,
        streak_updated: streakUpdated,
      };
    } catch (err) {
      logger.error(`Session record error: ${err}`, 'SESSION');
      return null;
    }
  }, [isAuthenticated, user?.id]);

  return {
    startSession,
    completeSession,
    recordSession,
    pendingSessionId: pendingSessionRef.current,
  };
}

// Helper functions
function getTableName(type: SessionType): string {
  const tables: Record<SessionType, string> = {
    breath: 'activity_sessions',
    meditation: 'activity_sessions',
    scan: 'emotion_sessions',
    vr: 'vr_dome_sessions',
    ar_filter: 'ar_filter_sessions',
    music: 'music_listening_sessions',
  };
  return tables[type] || 'activity_sessions';
}

function calculateXP(type: SessionType, durationSeconds: number): number {
  const baseXP: Record<SessionType, number> = {
    breath: 15,
    meditation: 20,
    scan: 10,
    vr: 30,
    ar_filter: 5,
    music: 10,
  };
  
  const base = baseXP[type] || 10;
  const durationBonus = Math.floor(durationSeconds / 60) * 2;
  return base + durationBonus;
}

async function awardXP(userId: string, amount: number, source: string): Promise<void> {
  try {
    // Upsert user_stats to add XP
    const { error } = await supabase.rpc('increment_user_xp', {
      p_user_id: userId,
      p_amount: amount,
      p_source: source,
    });
    
    if (error) {
      // Fallback: direct update
      await supabase
        .from('user_stats')
        .upsert({
          user_id: userId,
          total_xp: amount,
          updated_at: new Date().toISOString(),
        }, { onConflict: 'user_id' });
    }
  } catch (err) {
    logger.error(`Failed to award XP: ${err}`, 'GAMIFICATION');
  }
}

async function updateStreak(userId: string, type: SessionType): Promise<boolean> {
  try {
    const { data: stats } = await supabase
      .from('activity_streaks')
      .select('current_streak, last_activity_date')
      .eq('user_id', userId)
      .single();

    const today = new Date().toISOString().split('T')[0];
    const lastDate = stats?.last_activity_date;
    
    let newStreak = 1;
    if (lastDate) {
      const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];
      if (lastDate === today) {
        return false; // Already updated today
      } else if (lastDate === yesterday) {
        newStreak = (stats?.current_streak || 0) + 1;
      }
    }

    await supabase
      .from('activity_streaks')
      .upsert({
        user_id: userId,
        current_streak: newStreak,
        last_activity_date: today,
        longest_streak: Math.max(newStreak, stats?.current_streak || 0),
        updated_at: new Date().toISOString(),
      }, { onConflict: 'user_id' });

    return true;
  } catch (err) {
    logger.error(`Failed to update streak: ${err}`, 'GAMIFICATION');
    return false;
  }
}

export default useSessionPersistence;
