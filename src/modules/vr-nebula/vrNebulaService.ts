/**
 * VR Nebula Service - Business Logic & API
 * Gère les sessions VR de respiration et cohérence cardiaque
 */

import { captureException } from '@/lib/ai-monitoring';
import { supabase } from '@/integrations/supabase/client';
import {
  VRNebulaSession,
  VRNebulaSessionSchema,
  CreateVRNebulaSession,
  CreateVRNebulaSessionSchema,
  CompleteVRNebulaSession,
  CompleteVRNebulaSessionSchema,
  VRNebulaStats,
  VRNebulaStatsSchema,
  calculateCoherenceScore,
} from './types';

// ─────────────────────────────────────────────────────────────
// Session Management
// ─────────────────────────────────────────────────────────────

export async function createSession(
  payload: CreateVRNebulaSession,
): Promise<VRNebulaSession> {
  try {
    const validated = CreateVRNebulaSessionSchema.parse(payload);

    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) throw new Error('user_not_authenticated');

    const { data, error } = await supabase
      .from('vr_nebula_sessions')
      .insert({
        user_id: user.id,
        scene: validated.scene,
        breathing_pattern: validated.breathing_pattern,
        vr_mode: validated.vr_mode,
        duration_s: 0,
        cycles_completed: 0,
      })
      .select()
      .single();

    if (error) throw error;

    return VRNebulaSessionSchema.parse(data);
  } catch (err) {
    Sentry.captureException(err, { tags: { scope: 'vrNebulaService.createSession' } });
    throw err instanceof Error ? err : new Error('create_session_failed');
  }
}

export async function completeSession(
  payload: CompleteVRNebulaSession,
): Promise<VRNebulaSession> {
  try {
    const validated = CompleteVRNebulaSessionSchema.parse(payload);

    // Calculate derived metrics
    let coherence_score: number | undefined;
    let rmssd_delta: number | undefined;

    if (validated.resp_rate_avg && validated.hrv_pre && validated.hrv_post) {
      rmssd_delta = validated.hrv_post - validated.hrv_pre;
      coherence_score = calculateCoherenceScore(validated.resp_rate_avg, rmssd_delta);
    }

    const { data, error } = await supabase
      .from('vr_nebula_sessions')
      .update({
        duration_s: validated.duration_s,
        resp_rate_avg: validated.resp_rate_avg,
        hrv_pre: validated.hrv_pre,
        hrv_post: validated.hrv_post,
        rmssd_delta,
        coherence_score,
        cycles_completed: validated.cycles_completed,
      })
      .eq('id', validated.session_id)
      .select()
      .single();

    if (error) throw error;

    return VRNebulaSessionSchema.parse(data);
  } catch (err) {
    Sentry.captureException(err, { tags: { scope: 'vrNebulaService.completeSession' } });
    throw err instanceof Error ? err : new Error('complete_session_failed');
  }
}

export async function getSession(sessionId: string): Promise<VRNebulaSession> {
  try {
    const { data, error } = await supabase
      .from('vr_nebula_sessions')
      .select('*')
      .eq('id', sessionId)
      .single();

    if (error) throw error;

    return VRNebulaSessionSchema.parse(data);
  } catch (err) {
    Sentry.captureException(err, { tags: { scope: 'vrNebulaService.getSession' } });
    throw err instanceof Error ? err : new Error('get_session_failed');
  }
}

// ─────────────────────────────────────────────────────────────
// Statistics
// ─────────────────────────────────────────────────────────────

export async function getStats(): Promise<VRNebulaStats> {
  try {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) throw new Error('user_not_authenticated');

    const { data, error } = await supabase
      .from('vr_nebula_sessions')
      .select('*')
      .eq('user_id', user.id);

    if (error) throw error;

    const sessions = data || [];

    const total_sessions = sessions.length;
    const total_minutes = sessions.reduce((sum, s) => sum + (s.duration_s || 0), 0) / 60;
    const total_breaths = sessions.reduce((sum, s) => sum + (s.cycles_completed || 0), 0);

    const sessionsWithCoherence = sessions.filter(s => s.coherence_score !== null);
    const average_coherence = sessionsWithCoherence.length > 0
      ? sessionsWithCoherence.reduce((sum, s) => sum + (s.coherence_score || 0), 0) / sessionsWithCoherence.length
      : 0;

    const sessionsWithHRV = sessions.filter(s => s.rmssd_delta !== null);
    const average_hrv_gain = sessionsWithHRV.length > 0
      ? sessionsWithHRV.reduce((sum, s) => sum + (s.rmssd_delta || 0), 0) / sessionsWithHRV.length
      : 0;

    // Find favorite scene
    const sceneCounts: Record<string, number> = {};
    sessions.forEach(s => {
      sceneCounts[s.scene] = (sceneCounts[s.scene] || 0) + 1;
    });
    const favorite_scene = Object.keys(sceneCounts).length > 0
      ? (Object.entries(sceneCounts).sort((a, b) => b[1] - a[1])[0]?.[0] as any)
      : null;

    // Find favorite pattern
    const patternCounts: Record<string, number> = {};
    sessions.forEach(s => {
      patternCounts[s.breathing_pattern] = (patternCounts[s.breathing_pattern] || 0) + 1;
    });
    const favorite_pattern = Object.keys(patternCounts).length > 0
      ? (Object.entries(patternCounts).sort((a, b) => b[1] - a[1])[0]?.[0] as any)
      : null;

    // Time-based counts
    const now = new Date();
    const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

    const sessions_this_week = sessions.filter(
      s => new Date(s.created_at) >= weekAgo,
    ).length;
    const sessions_this_month = sessions.filter(
      s => new Date(s.created_at) >= monthAgo,
    ).length;

    const longest_session_minutes = sessions.length > 0
      ? Math.max(...sessions.map(s => (s.duration_s || 0) / 60))
      : 0;

    // Calculate streak
    const dates = sessions
      .map(s => new Date(s.created_at).toDateString())
      .sort((a, b) => new Date(b).getTime() - new Date(a).getTime());
    const uniqueDates = Array.from(new Set(dates));
    
    let current_streak_days = 0;
    for (let i = 0; i < uniqueDates.length; i++) {
      const current = new Date(uniqueDates[i]);
      const today = new Date().toDateString();
      
      if (i === 0 && uniqueDates[0] !== today) break;
      
      const prev = i > 0 ? new Date(uniqueDates[i - 1]) : null;
      if (prev) {
        const diffDays = Math.floor((prev.getTime() - current.getTime()) / (1000 * 60 * 60 * 24));
        if (diffDays !== 1) break;
      }
      current_streak_days++;
    }

    return VRNebulaStatsSchema.parse({
      total_sessions,
      total_minutes,
      total_breaths,
      average_coherence,
      average_hrv_gain,
      favorite_scene,
      favorite_pattern,
      sessions_this_week,
      sessions_this_month,
      longest_session_minutes,
      current_streak_days,
    });
  } catch (err) {
    Sentry.captureException(err, { tags: { scope: 'vrNebulaService.getStats' } });
    throw err instanceof Error ? err : new Error('get_stats_failed');
  }
}

export async function getRecentSessions(limit = 10): Promise<VRNebulaSession[]> {
  try {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) throw new Error('user_not_authenticated');

    const { data, error } = await supabase
      .from('vr_nebula_sessions')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) throw error;

    return (data || []).map(row => VRNebulaSessionSchema.parse(row));
  } catch (err) {
    Sentry.captureException(err, { tags: { scope: 'vrNebulaService.getRecentSessions' } });
    throw err instanceof Error ? err : new Error('get_recent_sessions_failed');
  }
}
