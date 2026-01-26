/**
 * Bubble Beat Service - Business Logic & API
 * Gère les sessions, scores et statistiques du jeu Bubble Beat
 */

import { Sentry } from '@/lib/errors/sentry-compat';
import { supabase } from '@/integrations/supabase/client';
import {
  BubbleBeatSession,
  BubbleBeatSessionSchema,
  CreateBubbleBeatSession,
  CreateBubbleBeatSessionSchema,
  CompleteBubbleBeatSession,
  CompleteBubbleBeatSessionSchema,
  BubbleBeatStats,
  BubbleBeatStatsSchema,
} from './types';

// ─────────────────────────────────────────────────────────────
// Session Management
// ─────────────────────────────────────────────────────────────

export async function createSession(
  payload: CreateBubbleBeatSession,
): Promise<BubbleBeatSession> {
  try {
    const validated = CreateBubbleBeatSessionSchema.parse(payload);

    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) throw new Error('user_not_authenticated');

    const { data, error } = await supabase
      .from('bubble_beat_sessions')
      .insert({
        user_id: user.id,
        difficulty: validated.difficulty,
        mood: validated.mood,
        score: 0,
        bubbles_popped: 0,
        duration_seconds: 0,
      })
      .select()
      .single();

    if (error) throw error;

    return BubbleBeatSessionSchema.parse(data);
  } catch (err) {
    Sentry.captureException(err, { tags: { scope: 'bubbleBeatService.createSession' } });
    throw err instanceof Error ? err : new Error('create_session_failed');
  }
}

export async function completeSession(
  payload: CompleteBubbleBeatSession,
): Promise<BubbleBeatSession> {
  try {
    const validated = CompleteBubbleBeatSessionSchema.parse(payload);

    const { data, error } = await supabase
      .from('bubble_beat_sessions')
      .update({
        score: validated.score,
        bubbles_popped: validated.bubbles_popped,
        duration_seconds: validated.duration_seconds,
        completed_at: new Date().toISOString(),
      })
      .eq('id', validated.session_id)
      .select()
      .single();

    if (error) throw error;

    return BubbleBeatSessionSchema.parse(data);
  } catch (err) {
    Sentry.captureException(err, { tags: { scope: 'bubbleBeatService.completeSession' } });
    throw err instanceof Error ? err : new Error('complete_session_failed');
  }
}

// ─────────────────────────────────────────────────────────────
// Statistics
// ─────────────────────────────────────────────────────────────

export async function getStats(): Promise<BubbleBeatStats> {
  try {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) throw new Error('user_not_authenticated');

    const { data, error } = await supabase
      .from('bubble_beat_sessions')
      .select('score, bubbles_popped, duration_seconds')
      .eq('user_id', user.id)
      .not('completed_at', 'is', null);

    if (error) throw error;

    const sessions = data || [];
    const total_sessions = sessions.length;
    const total_score = sessions.reduce((sum, s) => sum + (s.score || 0), 0);
    const total_bubbles_popped = sessions.reduce((sum, s) => sum + (s.bubbles_popped || 0), 0);
    const average_score = total_sessions > 0 ? total_score / total_sessions : 0;
    const best_score = sessions.length > 0 ? Math.max(...sessions.map(s => s.score || 0)) : 0;
    const total_playtime_minutes =
      sessions.reduce((sum, s) => sum + (s.duration_seconds || 0), 0) / 60;

    return BubbleBeatStatsSchema.parse({
      total_sessions,
      total_score,
      total_bubbles_popped,
      average_score,
      best_score,
      total_playtime_minutes,
    });
  } catch (err) {
    Sentry.captureException(err, { tags: { scope: 'bubbleBeatService.getStats' } });
    throw err instanceof Error ? err : new Error('get_stats_failed');
  }
}

export async function getRecentSessions(limit = 10): Promise<BubbleBeatSession[]> {
  try {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) throw new Error('user_not_authenticated');

    const { data, error } = await supabase
      .from('bubble_beat_sessions')
      .select('*')
      .eq('user_id', user.id)
      .not('completed_at', 'is', null)
      .order('completed_at', { ascending: false })
      .limit(limit);

    if (error) throw error;

    return (data || []).map(row => BubbleBeatSessionSchema.parse(row));
  } catch (err) {
    Sentry.captureException(err, { tags: { scope: 'bubbleBeatService.getRecentSessions' } });
    throw err instanceof Error ? err : new Error('get_recent_sessions_failed');
  }
}
