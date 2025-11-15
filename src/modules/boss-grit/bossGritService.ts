/**
 * Service pour Boss Grit (Bounce Battles)
 */

import { supabase } from '@/integrations/supabase/client';
import type {
  BounceBattle,
  CopingResponse,
  BattleMode,
  BounceEventType,
  BounceEventData
} from './types';

export class BossGritService {
  /**
   * Créer une nouvelle bataille
   */
  static async createBattle(
    userId: string,
    mode: BattleMode = 'standard'
  ): Promise<BounceBattle> {
    const { data, error } = await supabase
      .from('bounce_battles')
      .insert({
        user_id: userId,
        mode,
        status: 'created'
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  /**
   * Démarrer une bataille
   */
  static async startBattle(battleId: string): Promise<void> {
    const { error } = await supabase
      .from('bounce_battles')
      .update({
        status: 'in_progress',
        started_at: new Date().toISOString()
      })
      .eq('id', battleId);

    if (error) throw error;
  }

  /**
   * Enregistrer une réponse de coping
   */
  static async saveCopingResponse(
    battleId: string,
    questionId: string,
    responseValue: number
  ): Promise<void> {
    const { error } = await supabase
      .from('bounce_coping_responses')
      .insert({
        battle_id: battleId,
        question_id: questionId,
        response_value: responseValue
      });

    if (error) throw error;
  }

  /**
   * Enregistrer un événement
   */
  static async logEvent(
    battleId: string,
    eventType: BounceEventType,
    eventData?: BounceEventData
  ): Promise<void> {
    const { error } = await supabase
      .from('bounce_events')
      .insert({
        battle_id: battleId,
        event_type: eventType,
        timestamp: Date.now(),
        event_data: eventData || {}
      });

    if (error) throw error;
  }

  /**
   * Compléter une bataille
   */
  static async completeBattle(
    battleId: string,
    durationSeconds: number
  ): Promise<void> {
    const { error } = await supabase
      .from('bounce_battles')
      .update({
        status: 'completed',
        duration_seconds: durationSeconds,
        ended_at: new Date().toISOString()
      })
      .eq('id', battleId);

    if (error) throw error;
  }

  /**
   * Récupérer l'historique
   */
  static async fetchHistory(userId: string, limit: number = 20): Promise<BounceBattle[]> {
    const { data, error } = await supabase
      .from('bounce_battles')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) throw error;
    return data || [];
  }

  /**
   * Récupérer les réponses d'une bataille
   */
  static async fetchResponses(battleId: string): Promise<CopingResponse[]> {
    const { data, error } = await supabase
      .from('bounce_coping_responses')
      .select('*')
      .eq('battle_id', battleId)
      .order('created_at', { ascending: true });

    if (error) throw error;
    return data || [];
  }
}
