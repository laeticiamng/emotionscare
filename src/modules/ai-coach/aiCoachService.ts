/**
 * AI Coach Service - Business Logic & API
 * Gère les sessions de coaching IA et interactions
 */

import { z } from 'zod';
import { captureException } from '@/lib/ai-monitoring';
import { Sentry } from '@/lib/errors/sentry-compat';
import { supabase } from '@/integrations/supabase/client';
import {
  CoachSession,
  CoachSessionSchema,
  CoachMessage,
  CoachMessageSchema,
  CreateCoachSession,
  CreateCoachSessionSchema,
  UpdateCoachSession,
  UpdateCoachSessionSchema,
  AddCoachMessage,
  AddCoachMessageSchema,
  SessionUpdateData,
  SendCoachMessage,
  SendCoachMessageSchema,
  CompleteCoachSession,
  CompleteCoachSessionSchema,
  CoachStats,
  CoachStatsSchema,
} from './types';

// ─────────────────────────────────────────────────────────────
// Session Management
// ─────────────────────────────────────────────────────────────

export async function createSession(payload: CreateCoachSession): Promise<CoachSession> {
  try {
    const validated = CreateCoachSessionSchema.parse(payload);

    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) throw new Error('user_not_authenticated');

    const { data, error } = await supabase
      .from('ai_coach_sessions')
      .insert({
        user_id: user.id,
        coach_personality: validated.coach_personality,
        session_duration: 0,
        messages_count: 0,
        emotions_detected: [],
        techniques_suggested: [],
        resources_provided: [],
      })
      .select()
      .single();

    if (error) throw error;

    return CoachSessionSchema.parse(data);
  } catch (err) {
    Sentry.captureException(err, { tags: { scope: 'aiCoachService.createSession' } });
    throw err instanceof Error ? err : new Error('create_session_failed');
  }
}

export async function updateSession(payload: UpdateCoachSession): Promise<CoachSession> {
  try {
    const validated = UpdateCoachSessionSchema.parse(payload);

    const updateData: SessionUpdateData = {
      updated_at: new Date().toISOString(),
    };

    if (validated.session_duration !== undefined) {
      updateData.session_duration = validated.session_duration;
    }
    if (validated.messages_count !== undefined) {
      updateData.messages_count = validated.messages_count;
    }
    if (validated.emotions_detected !== undefined) {
      updateData.emotions_detected = validated.emotions_detected;
    }
    if (validated.techniques_suggested !== undefined) {
      updateData.techniques_suggested = validated.techniques_suggested;
    }
    if (validated.resources_provided !== undefined) {
      updateData.resources_provided = validated.resources_provided;
    }
    if (validated.user_satisfaction !== undefined) {
      updateData.user_satisfaction = validated.user_satisfaction;
    }
    if (validated.session_notes !== undefined) {
      updateData.session_notes = validated.session_notes;
    }

    const { data, error } = await supabase
      .from('ai_coach_sessions')
      .update(updateData)
      .eq('id', validated.session_id)
      .select()
      .single();

    if (error) throw error;

    return CoachSessionSchema.parse(data);
  } catch (err) {
    Sentry.captureException(err, { tags: { scope: 'aiCoachService.updateSession' } });
    throw err instanceof Error ? err : new Error('update_session_failed');
  }
}

export async function completeSession(payload: CompleteCoachSession): Promise<CoachSession> {
  try {
    const validated = CompleteCoachSessionSchema.parse(payload);

    const { data, error } = await supabase
      .from('ai_coach_sessions')
      .update({
        user_satisfaction: validated.user_satisfaction,
        session_notes: validated.session_notes || null,
        updated_at: new Date().toISOString(),
      })
      .eq('id', validated.session_id)
      .select()
      .single();

    if (error) throw error;

    return CoachSessionSchema.parse(data);
  } catch (err) {
    Sentry.captureException(err, { tags: { scope: 'aiCoachService.completeSession' } });
    throw err instanceof Error ? err : new Error('complete_session_failed');
  }
}

export async function getSession(sessionId: string): Promise<CoachSession> {
  try {
    const { data, error } = await supabase
      .from('ai_coach_sessions')
      .select('*')
      .eq('id', sessionId)
      .single();

    if (error) throw error;

    return CoachSessionSchema.parse(data);
  } catch (err) {
    Sentry.captureException(err, { tags: { scope: 'aiCoachService.getSession' } });
    throw err instanceof Error ? err : new Error('get_session_failed');
  }
}

// ─────────────────────────────────────────────────────────────
// Message Management
// ─────────────────────────────────────────────────────────────

export async function addMessage(payload: AddCoachMessage): Promise<CoachMessage> {
  try {
    const validated = AddCoachMessageSchema.parse(payload);

    // Note: Les messages sont stockés dans ai_chat_messages (table existante)
    // avec conversation_id = session_id
    const { data, error } = await supabase
      .from('ai_chat_messages')
      .insert({
        conversation_id: validated.session_id,
        role: validated.role,
        content: validated.content,
      })
      .select()
      .single();

    if (error) throw error;

    // Incrémenter le compteur de messages de la session
    await supabase.rpc('increment', {
      table_name: 'ai_coach_sessions',
      column_name: 'messages_count',
      row_id: validated.session_id,
    });

    return {
      id: data.id,
      session_id: validated.session_id,
      role: data.role as any,
      content: data.content,
      timestamp: data.created_at,
      metadata: validated.metadata || {},
    };
  } catch (err) {
    Sentry.captureException(err, { tags: { scope: 'aiCoachService.addMessage' } });
    throw err instanceof Error ? err : new Error('add_message_failed');
  }
}

export async function getMessages(sessionId: string): Promise<CoachMessage[]> {
  try {
    const { data, error } = await supabase
      .from('ai_chat_messages')
      .select('*')
      .eq('conversation_id', sessionId)
      .order('created_at', { ascending: true });

    if (error) throw error;

    return (data || []).map((msg) => ({
      id: msg.id,
      session_id: sessionId,
      role: msg.role as any,
      content: msg.content,
      timestamp: msg.created_at,
      metadata: {},
    }));
  } catch (err) {
    Sentry.captureException(err, { tags: { scope: 'aiCoachService.getMessages' } });
    throw err instanceof Error ? err : new Error('get_messages_failed');
  }
}

// ─────────────────────────────────────────────────────────────
// AI Interaction
// ─────────────────────────────────────────────────────────────

export async function sendMessage(payload: SendCoachMessage): Promise<CoachMessage> {
  try {
    const validated = SendCoachMessageSchema.parse(payload);

    // Ajouter le message utilisateur
    await addMessage({
      session_id: validated.session_id,
      role: 'user',
      content: validated.message,
    });

    // Appeler l'edge function pour obtenir la réponse du coach
    const { data: responseData, error: functionError } = await supabase.functions.invoke(
      'ai-coach',
      {
        body: {
          session_id: validated.session_id,
          message: validated.message,
        },
      },
    );

    if (functionError) throw functionError;

    // Ajouter la réponse de l'assistant
    const assistantMessage = await addMessage({
      session_id: validated.session_id,
      role: 'assistant',
      content: responseData.response,
      metadata: {
        emotions: responseData.emotions || [],
        techniques: responseData.techniques || [],
        resources: responseData.resources || [],
      },
    });

    // Mettre à jour la session avec les nouvelles données
    if (responseData.emotions || responseData.techniques || responseData.resources) {
      const session = await getSession(validated.session_id);
      await updateSession({
        session_id: validated.session_id,
        emotions_detected: [
          ...session.emotions_detected,
          ...(responseData.emotions || []),
        ],
        techniques_suggested: [
          ...session.techniques_suggested,
          ...(responseData.techniques || []),
        ],
        resources_provided: [
          ...session.resources_provided,
          ...(responseData.resources || []),
        ],
      });
    }

    return assistantMessage;
  } catch (err) {
    Sentry.captureException(err, { tags: { scope: 'aiCoachService.sendMessage' } });
    throw err instanceof Error ? err : new Error('send_message_failed');
  }
}

// ─────────────────────────────────────────────────────────────
// Statistics
// ─────────────────────────────────────────────────────────────

export async function getStats(): Promise<CoachStats> {
  try {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) throw new Error('user_not_authenticated');

    const { data: sessions, error } = await supabase
      .from('ai_coach_sessions')
      .select('*')
      .eq('user_id', user.id);

    if (error) throw error;

    const totalSessions = sessions?.length || 0;
    const completedSessions =
      sessions?.filter((s) => s.user_satisfaction !== null).length || 0;

    const totalDuration = sessions?.reduce((sum, s) => sum + (s.session_duration || 0), 0) || 0;
    const avgDuration = totalSessions > 0 ? totalDuration / totalSessions : 0;

    const totalMessages = sessions?.reduce((sum, s) => sum + (s.messages_count || 0), 0) || 0;
    const avgMessages = totalSessions > 0 ? totalMessages / totalSessions : 0;

    const satisfactions = sessions
      ?.filter((s) => s.user_satisfaction !== null)
      .map((s) => s.user_satisfaction as number) || [];
    const avgSatisfaction =
      satisfactions.length > 0
        ? satisfactions.reduce((a, b) => a + b, 0) / satisfactions.length
        : null;

    // Favorite personality
    const personalityCounts: Record<string, number> = {};
    sessions?.forEach((s) => {
      personalityCounts[s.coach_personality] = (personalityCounts[s.coach_personality] || 0) + 1;
    });
    const favoritePersonality =
      Object.keys(personalityCounts).length > 0
        ? (Object.keys(personalityCounts).reduce((a, b) =>
            personalityCounts[a] > personalityCounts[b] ? a : b,
          ) as any)
        : null;

    // Most detected emotions
    const emotionCounts: Record<string, number> = {};
    sessions?.forEach((s) => {
      (s.emotions_detected as any[])?.forEach((e: any) => {
        emotionCounts[e.emotion] = (emotionCounts[e.emotion] || 0) + 1;
      });
    });
    const mostDetectedEmotions = Object.keys(emotionCounts)
      .sort((a, b) => emotionCounts[b] - emotionCounts[a])
      .slice(0, 5);

    // Most suggested techniques
    const techniqueCounts: Record<string, number> = {};
    sessions?.forEach((s) => {
      (s.techniques_suggested as string[])?.forEach((t: string) => {
        techniqueCounts[t] = (techniqueCounts[t] || 0) + 1;
      });
    });
    const mostSuggestedTechniques = Object.keys(techniqueCounts)
      .sort((a, b) => techniqueCounts[b] - techniqueCounts[a])
      .slice(0, 5) as any[];

    const stats = {
      total_sessions: totalSessions,
      completed_sessions: completedSessions,
      total_duration_seconds: totalDuration,
      average_duration_seconds: Number(avgDuration.toFixed(2)),
      total_messages: totalMessages,
      average_messages_per_session: Number(avgMessages.toFixed(2)),
      average_satisfaction: avgSatisfaction !== null ? Number(avgSatisfaction.toFixed(2)) : null,
      favorite_personality: favoritePersonality,
      most_detected_emotions: mostDetectedEmotions,
      most_suggested_techniques: mostSuggestedTechniques,
    };

    return CoachStatsSchema.parse(stats);
  } catch (err) {
    Sentry.captureException(err, { tags: { scope: 'aiCoachService.getStats' } });
    throw err instanceof Error ? err : new Error('get_stats_failed');
  }
}

export async function getRecentSessions(limit = 10): Promise<CoachSession[]> {
  try {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) throw new Error('user_not_authenticated');

    const { data, error } = await supabase
      .from('ai_coach_sessions')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) throw error;

    return z.array(CoachSessionSchema).parse(data);
  } catch (err) {
    Sentry.captureException(err, { tags: { scope: 'aiCoachService.getRecentSessions' } });
    throw err instanceof Error ? err : new Error('get_recent_sessions_failed');
  }
}
