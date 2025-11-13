/**
 * Screen Silk Service - Business Logic & API
 * Gère les micro-pauses écran et le repos visuel
 */

import { captureException } from '@/lib/ai-monitoring';
import { Sentry } from '@/lib/errors/sentry-compat';
import { supabase } from '@/integrations/supabase/client';
import {
  ScreenSilkSession,
  ScreenSilkSessionSchema,
  CreateScreenSilkSession,
  CreateScreenSilkSessionSchema,
  CompleteScreenSilkSession,
  CompleteScreenSilkSessionSchema,
  InterruptScreenSilkSession,
  InterruptScreenSilkSessionSchema,
  ScreenSilkStats,
  ScreenSilkStatsSchema,
} from './types';

// ─────────────────────────────────────────────────────────────
// Session Management
// ─────────────────────────────────────────────────────────────

export async function createSession(
  payload: CreateScreenSilkSession,
): Promise<ScreenSilkSession> {
  try {
    const validated = CreateScreenSilkSessionSchema.parse(payload);

    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) throw new Error('user_not_authenticated');

    const { data, error } = await supabase
      .from('screen_silk_sessions')
      .insert({
        user_id: user.id,
        duration_seconds: validated.duration_seconds,
        blink_count: 0,
        interrupted: false,
        started_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (error) throw error;

    return ScreenSilkSessionSchema.parse(data);
  } catch (err) {
    Sentry.captureException(err, { tags: { scope: 'screenSilkService.createSession' } });
    throw err instanceof Error ? err : new Error('create_session_failed');
  }
}

export async function completeSession(
  payload: CompleteScreenSilkSession,
): Promise<ScreenSilkSession> {
  try {
    const validated = CompleteScreenSilkSessionSchema.parse(payload);

    const { data, error } = await supabase
      .from('screen_silk_sessions')
      .update({
        blink_count: validated.blink_count,
        completion_label: validated.completion_label,
        interrupted: false,
        completed_at: new Date().toISOString(),
      })
      .eq('id', validated.session_id)
      .select()
      .single();

    if (error) throw error;

    return ScreenSilkSessionSchema.parse(data);
  } catch (err) {
    Sentry.captureException(err, { tags: { scope: 'screenSilkService.completeSession' } });
    throw err instanceof Error ? err : new Error('complete_session_failed');
  }
}

export async function interruptSession(
  payload: InterruptScreenSilkSession,
): Promise<ScreenSilkSession> {
  try {
    const validated = InterruptScreenSilkSessionSchema.parse(payload);

    const { data, error } = await supabase
      .from('screen_silk_sessions')
      .update({
        blink_count: validated.blink_count,
        completion_label: 'incertain',
        interrupted: true,
        completed_at: new Date().toISOString(),
      })
      .eq('id', validated.session_id)
      .select()
      .single();

    if (error) throw error;

    return ScreenSilkSessionSchema.parse(data);
  } catch (err) {
    Sentry.captureException(err, { tags: { scope: 'screenSilkService.interruptSession' } });
    throw err instanceof Error ? err : new Error('interrupt_session_failed');
  }
}

// ─────────────────────────────────────────────────────────────
// Statistics
// ─────────────────────────────────────────────────────────────

export async function getStats(): Promise<ScreenSilkStats> {
  try {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) throw new Error('user_not_authenticated');

    const { data, error } = await supabase
      .from('screen_silk_sessions')
      .select('duration_seconds, interrupted, completed_at')
      .eq('user_id', user.id);

    if (error) throw error;

    const sessions = data || [];
    const total_sessions = sessions.length;
    const completedSessions = sessions.filter(s => s.completed_at);
    const total_completed = completedSessions.filter(s => !s.interrupted).length;
    const total_interrupted = completedSessions.filter(s => s.interrupted).length;
    
    const total_break_time_minutes =
      completedSessions.reduce((sum, s) => sum + (s.duration_seconds || 0), 0) / 60;
    
    const average_duration_minutes = completedSessions.length > 0
      ? total_break_time_minutes / completedSessions.length
      : 0;

    const completion_rate = total_sessions > 0
      ? (total_completed / total_sessions) * 100
      : 0;

    return ScreenSilkStatsSchema.parse({
      total_sessions,
      total_completed,
      total_interrupted,
      total_break_time_minutes,
      average_duration_minutes,
      completion_rate,
    });
  } catch (err) {
    Sentry.captureException(err, { tags: { scope: 'screenSilkService.getStats' } });
    throw err instanceof Error ? err : new Error('get_stats_failed');
  }
}

export async function getRecentSessions(limit = 10): Promise<ScreenSilkSession[]> {
  try {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) throw new Error('user_not_authenticated');

    const { data, error } = await supabase
      .from('screen_silk_sessions')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) throw error;

    return (data || []).map(row => ScreenSilkSessionSchema.parse(row));
  } catch (err) {
    Sentry.captureException(err, { tags: { scope: 'screenSilkService.getRecentSessions' } });
    throw err instanceof Error ? err : new Error('get_recent_sessions_failed');
  }
}
