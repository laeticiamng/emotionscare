/**
 * Bounce Back Service - Business Logic & API
 * Gère les batailles de résilience et stratégies de coping
 */

import { z } from 'zod';
import { captureException } from '@/lib/ai-monitoring';
import { Sentry } from '@/lib/errors/sentry-compat';
import { supabase } from '@/integrations/supabase/client';
import {
  BounceBattle,
  BounceBattleSchema,
  BounceEvent,
  BounceEventSchema,
  BounceCopingResponse,
  BounceCopingResponseSchema,
  BouncePairTip,
  BouncePairTipSchema,
  CreateBounceBattle,
  CreateBounceBattleSchema,
  StartBounceBattle,
  StartBounceBattleSchema,
  CompleteBounceBattle,
  CompleteBounceBattleSchema,
  AddBounceEvent,
  AddBounceEventSchema,
  AddCopingResponse,
  AddCopingResponseSchema,
  SendPairTip,
  SendPairTipSchema,
  BounceStats,
  BounceStatsSchema,
} from './types';

// ─────────────────────────────────────────────────────────────
// Battle Management
// ─────────────────────────────────────────────────────────────

export async function createBattle(payload: CreateBounceBattle): Promise<BounceBattle> {
  try {
    const validated = CreateBounceBattleSchema.parse(payload);

    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) throw new Error('user_not_authenticated');

    const { data, error } = await supabase
      .from('bounce_battles')
      .insert({
        user_id: user.id,
        mode: validated.mode,
        status: 'created',
      })
      .select()
      .single();

    if (error) throw error;

    return BounceBattleSchema.parse(data);
  } catch (err) {
    Sentry.captureException(err, { tags: { scope: 'bounceBackService.createBattle' } });
    throw err instanceof Error ? err : new Error('create_battle_failed');
  }
}

export async function startBattle(payload: StartBounceBattle): Promise<BounceBattle> {
  try {
    const validated = StartBounceBattleSchema.parse(payload);

    const { data, error } = await supabase
      .from('bounce_battles')
      .update({
        status: 'active',
        started_at: new Date().toISOString(),
      })
      .eq('id', validated.battle_id)
      .select()
      .single();

    if (error) throw error;

    return BounceBattleSchema.parse(data);
  } catch (err) {
    Sentry.captureException(err, { tags: { scope: 'bounceBackService.startBattle' } });
    throw err instanceof Error ? err : new Error('start_battle_failed');
  }
}

export async function completeBattle(payload: CompleteBounceBattle): Promise<BounceBattle> {
  try {
    const validated = CompleteBounceBattleSchema.parse(payload);

    const { data, error } = await supabase
      .from('bounce_battles')
      .update({
        status: 'completed',
        ended_at: new Date().toISOString(),
        duration_seconds: validated.duration_seconds,
      })
      .eq('id', validated.battle_id)
      .select()
      .single();

    if (error) throw error;

    return BounceBattleSchema.parse(data);
  } catch (err) {
    Sentry.captureException(err, { tags: { scope: 'bounceBackService.completeBattle' } });
    throw err instanceof Error ? err : new Error('complete_battle_failed');
  }
}

export async function pauseBattle(battleId: string): Promise<BounceBattle> {
  try {
    const { data, error } = await supabase
      .from('bounce_battles')
      .update({ status: 'paused' })
      .eq('id', battleId)
      .select()
      .single();

    if (error) throw error;

    return BounceBattleSchema.parse(data);
  } catch (err) {
    Sentry.captureException(err, { tags: { scope: 'bounceBackService.pauseBattle' } });
    throw err instanceof Error ? err : new Error('pause_battle_failed');
  }
}

export async function abandonBattle(battleId: string): Promise<BounceBattle> {
  try {
    const { data, error } = await supabase
      .from('bounce_battles')
      .update({
        status: 'abandoned',
        ended_at: new Date().toISOString(),
      })
      .eq('id', battleId)
      .select()
      .single();

    if (error) throw error;

    return BounceBattleSchema.parse(data);
  } catch (err) {
    Sentry.captureException(err, { tags: { scope: 'bounceBackService.abandonBattle' } });
    throw err instanceof Error ? err : new Error('abandon_battle_failed');
  }
}

// ─────────────────────────────────────────────────────────────
// Event Management
// ─────────────────────────────────────────────────────────────

export async function addEvent(payload: AddBounceEvent): Promise<BounceEvent> {
  try {
    const validated = AddBounceEventSchema.parse(payload);

    const { data, error } = await supabase
      .from('bounce_events')
      .insert({
        battle_id: validated.battle_id,
        event_type: validated.event_type,
        timestamp: validated.timestamp,
        event_data: validated.event_data,
      })
      .select()
      .single();

    if (error) throw error;

    return BounceEventSchema.parse(data);
  } catch (err) {
    Sentry.captureException(err, { tags: { scope: 'bounceBackService.addEvent' } });
    throw err instanceof Error ? err : new Error('add_event_failed');
  }
}

export async function getEvents(battleId: string): Promise<BounceEvent[]> {
  try {
    const { data, error } = await supabase
      .from('bounce_events')
      .select('*')
      .eq('battle_id', battleId)
      .order('timestamp', { ascending: true });

    if (error) throw error;

    return z.array(BounceEventSchema).parse(data);
  } catch (err) {
    Sentry.captureException(err, { tags: { scope: 'bounceBackService.getEvents' } });
    throw err instanceof Error ? err : new Error('get_events_failed');
  }
}

// ─────────────────────────────────────────────────────────────
// Coping Responses
// ─────────────────────────────────────────────────────────────

export async function addCopingResponse(
  payload: AddCopingResponse,
): Promise<BounceCopingResponse> {
  try {
    const validated = AddCopingResponseSchema.parse(payload);

    const { data, error } = await supabase
      .from('bounce_coping_responses')
      .insert({
        battle_id: validated.battle_id,
        question_id: validated.question_id,
        response_value: validated.response_value,
      })
      .select()
      .single();

    if (error) throw error;

    return BounceCopingResponseSchema.parse(data);
  } catch (err) {
    Sentry.captureException(err, { tags: { scope: 'bounceBackService.addCopingResponse' } });
    throw err instanceof Error ? err : new Error('add_coping_response_failed');
  }
}

export async function getCopingResponses(battleId: string): Promise<BounceCopingResponse[]> {
  try {
    const { data, error } = await supabase
      .from('bounce_coping_responses')
      .select('*')
      .eq('battle_id', battleId)
      .order('created_at', { ascending: true });

    if (error) throw error;

    return z.array(BounceCopingResponseSchema).parse(data);
  } catch (err) {
    Sentry.captureException(err, { tags: { scope: 'bounceBackService.getCopingResponses' } });
    throw err instanceof Error ? err : new Error('get_coping_responses_failed');
  }
}

// ─────────────────────────────────────────────────────────────
// Pair Tips (Social Feature)
// ─────────────────────────────────────────────────────────────

export async function sendPairTip(payload: SendPairTip): Promise<BouncePairTip> {
  try {
    const validated = SendPairTipSchema.parse(payload);

    const { data, error } = await supabase
      .from('bounce_pair_tips')
      .insert({
        battle_id: validated.battle_id,
        pair_token: validated.pair_token,
        tip_content: validated.tip_content,
      })
      .select()
      .single();

    if (error) throw error;

    return BouncePairTipSchema.parse(data);
  } catch (err) {
    Sentry.captureException(err, { tags: { scope: 'bounceBackService.sendPairTip' } });
    throw err instanceof Error ? err : new Error('send_pair_tip_failed');
  }
}

export async function getPairTips(battleId: string): Promise<BouncePairTip[]> {
  try {
    const { data, error } = await supabase
      .from('bounce_pair_tips')
      .select('*')
      .eq('battle_id', battleId)
      .order('sent_at', { ascending: false });

    if (error) throw error;

    return z.array(BouncePairTipSchema).parse(data);
  } catch (err) {
    Sentry.captureException(err, { tags: { scope: 'bounceBackService.getPairTips' } });
    throw err instanceof Error ? err : new Error('get_pair_tips_failed');
  }
}

// ─────────────────────────────────────────────────────────────
// Statistics
// ─────────────────────────────────────────────────────────────

export async function getStats(): Promise<BounceStats> {
  try {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) throw new Error('user_not_authenticated');

    // Get all battles
    const { data: battles, error: battlesError } = await supabase
      .from('bounce_battles')
      .select('*')
      .eq('user_id', user.id);

    if (battlesError) throw battlesError;

    const totalBattles = battles?.length || 0;
    const completedBattles = battles?.filter((b) => b.status === 'completed').length || 0;
    const completionRate = totalBattles > 0 ? (completedBattles / totalBattles) * 100 : 0;

    const totalDuration = battles?.reduce((sum, b) => sum + (b.duration_seconds || 0), 0) || 0;
    const avgDuration = completedBattles > 0 ? totalDuration / completedBattles : 0;

    // Get all events
    const battleIds = battles?.map((b) => b.id) || [];
    const { data: events, error: eventsError } = await supabase
      .from('bounce_events')
      .select('*')
      .in('battle_id', battleIds);

    if (eventsError) throw eventsError;

    const totalEvents = events?.length || 0;
    const avgEventsPerBattle = totalBattles > 0 ? totalEvents / totalBattles : 0;

    // Get coping responses
    const { data: copingResponses, error: copingError } = await supabase
      .from('bounce_coping_responses')
      .select('*')
      .in('battle_id', battleIds);

    if (copingError) throw copingError;

    const copingStrategiesAvg: Record<string, number> = {};
    const copingCounts: Record<string, number[]> = {};

    copingResponses?.forEach((resp) => {
      if (!copingCounts[resp.question_id]) {
        copingCounts[resp.question_id] = [];
      }
      copingCounts[resp.question_id].push(resp.response_value);
    });

    Object.keys(copingCounts).forEach((key) => {
      const values = copingCounts[key];
      copingStrategiesAvg[key] = values.reduce((a, b) => a + b, 0) / values.length;
    });

    // Favorite mode
    const modeCounts: Record<string, number> = {};
    battles?.forEach((b) => {
      modeCounts[b.mode] = (modeCounts[b.mode] || 0) + 1;
    });
    const favoriteMode =
      Object.keys(modeCounts).length > 0
        ? (Object.keys(modeCounts).reduce((a, b) =>
            modeCounts[a] > modeCounts[b] ? a : b,
          ) as any)
        : null;

    const stats = {
      total_battles: totalBattles,
      completed_battles: completedBattles,
      completion_rate: Number(completionRate.toFixed(2)),
      total_duration_seconds: totalDuration,
      average_duration_seconds: Number(avgDuration.toFixed(2)),
      total_events: totalEvents,
      average_events_per_battle: Number(avgEventsPerBattle.toFixed(2)),
      coping_strategies_avg: copingStrategiesAvg,
      favorite_mode: favoriteMode,
    };

    return BounceStatsSchema.parse(stats);
  } catch (err) {
    Sentry.captureException(err, { tags: { scope: 'bounceBackService.getStats' } });
    throw err instanceof Error ? err : new Error('get_stats_failed');
  }
}

export async function getRecentBattles(limit = 10): Promise<BounceBattle[]> {
  try {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) throw new Error('user_not_authenticated');

    const { data, error } = await supabase
      .from('bounce_battles')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) throw error;

    return z.array(BounceBattleSchema).parse(data);
  } catch (err) {
    Sentry.captureException(err, { tags: { scope: 'bounceBackService.getRecentBattles' } });
    throw err instanceof Error ? err : new Error('get_recent_battles_failed');
  }
}
