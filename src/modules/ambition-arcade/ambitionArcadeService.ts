/**
 * Service pour Ambition Arcade
 */

import { supabase } from '@/integrations/supabase/client';

export interface AmbitionRun {
  id: string;
  user_id: string;
  objective?: string;
  status: 'active' | 'completed' | 'abandoned';
  metadata?: any;
  tags?: string[];
  created_at: string;
  completed_at?: string;
}

export interface AmbitionQuest {
  id: string;
  run_id: string;
  title: string;
  flavor?: string;
  status: 'available' | 'in_progress' | 'completed';
  xp_reward: number;
  est_minutes: number;
  result?: string;
  notes?: string;
  created_at: string;
  completed_at?: string;
}

export class AmbitionArcadeService {
  /**
   * Créer un nouveau run d'ambition
   */
  static async createRun(userId: string, objective?: string, tags?: string[]): Promise<AmbitionRun> {
    const { data, error } = await supabase
      .from('ambition_runs')
      .insert({
        user_id: userId,
        objective,
        tags,
        status: 'active'
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  /**
   * Créer une quête
   */
  static async createQuest(
    runId: string,
    title: string,
    flavor?: string,
    xpReward: number = 25,
    estMinutes: number = 15
  ): Promise<AmbitionQuest> {
    const { data, error } = await supabase
      .from('ambition_quests')
      .insert({
        run_id: runId,
        title,
        flavor,
        xp_reward: xpReward,
        est_minutes: estMinutes,
        status: 'available'
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  /**
   * Compléter une quête
   */
  static async completeQuest(
    questId: string,
    result?: string,
    notes?: string
  ): Promise<void> {
    const { error } = await supabase
      .from('ambition_quests')
      .update({
        status: 'completed',
        result,
        notes,
        completed_at: new Date().toISOString()
      })
      .eq('id', questId);

    if (error) throw error;
  }

  /**
   * Récupérer les runs actifs
   */
  static async fetchActiveRuns(userId: string): Promise<AmbitionRun[]> {
    const { data, error } = await supabase
      .from('ambition_runs')
      .select('*')
      .eq('user_id', userId)
      .eq('status', 'active')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  }

  /**
   * Récupérer les quêtes d'un run
   */
  static async fetchQuests(runId: string): Promise<AmbitionQuest[]> {
    const { data, error } = await supabase
      .from('ambition_quests')
      .select('*')
      .eq('run_id', runId)
      .order('created_at', { ascending: true });

    if (error) throw error;
    return data || [];
  }

  /**
   * Récupérer les artefacts
   */
  static async fetchArtifacts(runId: string): Promise<any[]> {
    const { data, error } = await supabase
      .from('ambition_artifacts')
      .select('*')
      .eq('run_id', runId)
      .order('obtained_at', { ascending: false });

    if (error) throw error;
    return data || [];
  }
}
