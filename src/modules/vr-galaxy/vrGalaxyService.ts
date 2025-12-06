/**
 * Service pour VR Galaxy (Nébuleuse VR)
 */

import { supabase } from '@/integrations/supabase/client';
import type { VRNebulaSession, BiometricMetrics } from './types';

export class VRGalaxyService {
  /**
   * Créer une session VR Nebula
   */
  static async createSession(userId: string, sessionId: string): Promise<VRNebulaSession> {
    const { data, error } = await supabase
      .from('vr_nebula_sessions')
      .insert({
        user_id: userId,
        session_id: sessionId,
        duration_seconds: 0
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  /**
   * Mettre à jour les métriques biométriques
   */
  static async updateBiometrics(
    sessionId: string,
    metrics: BiometricMetrics
  ): Promise<void> {
    const { error } = await supabase
      .from('vr_nebula_sessions')
      .update(metrics)
      .eq('session_id', sessionId);

    if (error) throw error;
  }

  /**
   * Compléter une session
   */
  static async completeSession(
    sessionId: string,
    durationSeconds: number
  ): Promise<void> {
    const { error } = await supabase
      .from('vr_nebula_sessions')
      .update({
        duration_seconds: durationSeconds,
        completed_at: new Date().toISOString()
      })
      .eq('session_id', sessionId);

    if (error) throw error;
  }

  /**
   * Récupérer l'historique
   */
  static async fetchHistory(userId: string, limit: number = 20): Promise<VRNebulaSession[]> {
    const { data, error } = await supabase
      .from('vr_nebula_sessions')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) throw error;
    return data || [];
  }
}
