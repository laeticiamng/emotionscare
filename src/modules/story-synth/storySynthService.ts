/**
 * Story Synth Service - Business Logic & API
 * Gère les sessions de narration thérapeutique et la génération de stories
 */

import { captureException } from '@/lib/ai-monitoring';
import { Sentry } from '@/lib/errors/sentry-compat';
import { supabase } from '@/integrations/supabase/client';
import {
  StorySynthSession,
  StorySynthSessionSchema,
  CreateStorySynthSession,
  CreateStorySynthSessionSchema,
  CompleteStorySynthSession,
  CompleteStorySynthSessionSchema,
  StorySynthStats,
  StorySynthStatsSchema,
  StoryContent,
  StoryContentSchema,
} from './types';

// ─────────────────────────────────────────────────────────────
// Session Management
// ─────────────────────────────────────────────────────────────

export async function createSession(
  payload: CreateStorySynthSession,
): Promise<StorySynthSession> {
  try {
    const validated = CreateStorySynthSessionSchema.parse(payload);

    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) throw new Error('user_not_authenticated');

    const { data, error } = await supabase
      .from('story_synth_sessions')
      .insert({
        user_id: user.id,
        theme: validated.theme,
        tone: validated.tone,
        user_context: validated.user_context,
        reading_duration_seconds: 0,
      })
      .select()
      .single();

    if (error) throw error;

    return StorySynthSessionSchema.parse(data);
  } catch (err) {
    Sentry.captureException(err, { tags: { scope: 'storySynthService.createSession' } });
    throw err instanceof Error ? err : new Error('create_session_failed');
  }
}

export async function completeSession(
  payload: CompleteStorySynthSession,
): Promise<StorySynthSession> {
  try {
    const validated = CompleteStorySynthSessionSchema.parse(payload);

    const { data, error } = await supabase
      .from('story_synth_sessions')
      .update({
        reading_duration_seconds: validated.reading_duration_seconds,
        completed_at: new Date().toISOString(),
      })
      .eq('id', validated.session_id)
      .select()
      .single();

    if (error) throw error;

    return StorySynthSessionSchema.parse(data);
  } catch (err) {
    Sentry.captureException(err, { tags: { scope: 'storySynthService.completeSession' } });
    throw err instanceof Error ? err : new Error('complete_session_failed');
  }
}

// ─────────────────────────────────────────────────────────────
// Story Generation
// ─────────────────────────────────────────────────────────────

export async function generateStory(
  sessionId: string,
): Promise<StoryContent> {
  try {
    const { data, error } = await supabase.functions.invoke('story-generator', {
      body: { session_id: sessionId },
    });

    if (error) throw error;

    const story = StoryContentSchema.parse(data.story);

    // Update session with generated story
    await supabase
      .from('story_synth_sessions')
      .update({ story_content: story })
      .eq('id', sessionId);

    return story;
  } catch (err) {
    Sentry.captureException(err, { tags: { scope: 'storySynthService.generateStory' } });
    throw err instanceof Error ? err : new Error('generate_story_failed');
  }
}

// ─────────────────────────────────────────────────────────────
// Statistics
// ─────────────────────────────────────────────────────────────

export async function getStats(): Promise<StorySynthStats> {
  try {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) throw new Error('user_not_authenticated');

    const { data, error } = await supabase
      .from('story_synth_sessions')
      .select('theme, tone, reading_duration_seconds, completed_at')
      .eq('user_id', user.id);

    if (error) throw error;

    const sessions = data || [];
    const completedSessions = sessions.filter(s => s.completed_at);

    const total_stories_read = completedSessions.length;
    const total_reading_time_minutes =
      completedSessions.reduce((sum, s) => sum + (s.reading_duration_seconds || 0), 0) / 60;

    // Find favorite theme
    const themeCounts = completedSessions.reduce((acc, s) => {
      acc[s.theme] = (acc[s.theme] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    const favorite_theme = Object.keys(themeCounts).length > 0
      ? (Object.entries(themeCounts).sort((a, b) => b[1] - a[1])[0]?.[0] as any)
      : null;

    // Find favorite tone
    const toneCounts = completedSessions.reduce((acc, s) => {
      acc[s.tone] = (acc[s.tone] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    const favorite_tone = Object.keys(toneCounts).length > 0
      ? (Object.entries(toneCounts).sort((a, b) => b[1] - a[1])[0]?.[0] as any)
      : null;

    const completion_rate = sessions.length > 0
      ? (completedSessions.length / sessions.length) * 100
      : 0;

    return StorySynthStatsSchema.parse({
      total_stories_read,
      total_reading_time_minutes,
      favorite_theme,
      favorite_tone,
      completion_rate,
    });
  } catch (err) {
    Sentry.captureException(err, { tags: { scope: 'storySynthService.getStats' } });
    throw err instanceof Error ? err : new Error('get_stats_failed');
  }
}

export async function getRecentSessions(limit = 10): Promise<StorySynthSession[]> {
  try {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) throw new Error('user_not_authenticated');

    const { data, error } = await supabase
      .from('story_synth_sessions')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) throw error;

    return (data || []).map(row => StorySynthSessionSchema.parse(row));
  } catch (err) {
    Sentry.captureException(err, { tags: { scope: 'storySynthService.getRecentSessions' } });
    throw err instanceof Error ? err : new Error('get_recent_sessions_failed');
  }
}
