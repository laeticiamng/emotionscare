/**
 * Service Ambition Arcade
 * Gestion des runs, quêtes et artefacts gamifiés
 */

import { supabase } from '@/integrations/supabase/client';
import { captureException } from '@/lib/ai-monitoring';
import { Sentry } from '@/lib/errors/sentry-compat';
import type {
  AmbitionRun,
  AmbitionQuest,
  AmbitionArtifact,
  CreateRun,
  CompleteQuest,
  AmbitionStats,
  GenerateGameStructure,
  GameStructure,
} from './types';

const EDGE_FUNCTION_URL = 'https://yaincoxihiqdksxgrsrk.supabase.co/functions/v1/ambition-arcade';

/**
 * Créer un nouveau run d'ambition
 */
export async function createRun(data: CreateRun): Promise<AmbitionRun> {
  try {
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) throw new Error('Non authentifié');

    const { data: run, error } = await supabase
      .from('ambition_runs')
      .insert({
        user_id: user.id,
        objective: data.objective,
        tags: data.tags,
        status: 'active',
      })
      .select()
      .single();

    if (error) throw error;
    return run;
  } catch (error) {
    Sentry.captureException(error, { tags: { module: 'ambition-arcade', action: 'createRun' } });
    throw error;
  }
}

/**
 * Créer une quête
 */
export async function createQuest(
  runId: string,
  title: string,
  flavor?: string,
  xpReward: number = 25,
  estMinutes: number = 15
): Promise<AmbitionQuest> {
  try {
    const { data: quest, error } = await supabase
      .from('ambition_quests')
      .insert({
        run_id: runId,
        title,
        flavor,
        xp_reward: xpReward,
        est_minutes: estMinutes,
        status: 'available',
      })
      .select()
      .single();

    if (error) throw error;
    return quest;
  } catch (error) {
    Sentry.captureException(error, { tags: { module: 'ambition-arcade', action: 'createQuest' } });
    throw error;
  }
}

/**
 * Compléter une quête
 */
export async function completeQuest(questId: string, data: CompleteQuest): Promise<void> {
  try {
    const { error } = await supabase
      .from('ambition_quests')
      .update({
        status: 'completed',
        result: data.result,
        notes: data.notes,
        completed_at: new Date().toISOString(),
      })
      .eq('id', questId);

    if (error) throw error;
  } catch (error) {
    Sentry.captureException(error, { tags: { module: 'ambition-arcade', action: 'completeQuest' } });
    throw error;
  }
}

/**
 * Récupérer les runs actifs
 */
export async function fetchActiveRuns(): Promise<AmbitionRun[]> {
  try {
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) throw new Error('Non authentifié');

    const { data, error } = await supabase
      .from('ambition_runs')
      .select('*')
      .eq('user_id', user.id)
      .eq('status', 'active')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  } catch (error) {
    Sentry.captureException(error, { tags: { module: 'ambition-arcade', action: 'fetchActiveRuns' } });
    throw error;
  }
}

/**
 * Récupérer les quêtes d'un run
 */
export async function fetchQuests(runId: string): Promise<AmbitionQuest[]> {
  try {
    const { data, error } = await supabase
      .from('ambition_quests')
      .select('*')
      .eq('run_id', runId)
      .order('created_at', { ascending: true });

    if (error) throw error;
    return data || [];
  } catch (error) {
    Sentry.captureException(error, { tags: { module: 'ambition-arcade', action: 'fetchQuests' } });
    throw error;
  }
}

/**
 * Récupérer les artefacts d'un run
 */
export async function fetchArtifacts(runId: string): Promise<AmbitionArtifact[]> {
  try {
    const { data, error } = await supabase
      .from('ambition_artifacts')
      .select('*')
      .eq('run_id', runId)
      .order('obtained_at', { ascending: false });

    if (error) throw error;
    return data || [];
  } catch (error) {
    Sentry.captureException(error, { tags: { module: 'ambition-arcade', action: 'fetchArtifacts' } });
    throw error;
  }
}

/**
 * Statistiques globales utilisateur
 */
export async function getStats(): Promise<AmbitionStats> {
  try {
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) throw new Error('Non authentifié');

    const [runsRes, questsRes, artifactsRes] = await Promise.all([
      supabase.from('ambition_runs').select('status').eq('user_id', user.id),
      supabase.from('ambition_quests').select('status, xp_reward, run_id').in('run_id', 
        (await supabase.from('ambition_runs').select('id').eq('user_id', user.id)).data?.map(r => r.id) || []
      ),
      supabase.from('ambition_artifacts').select('id, run_id').in('run_id',
        (await supabase.from('ambition_runs').select('id').eq('user_id', user.id)).data?.map(r => r.id) || []
      ),
    ]);

    const runs = runsRes.data || [];
    const quests = questsRes.data || [];
    const artifacts = artifactsRes.data || [];

    const completedQuests = quests.filter(q => q.status === 'completed');
    const totalXP = completedQuests.reduce((sum, q) => sum + (q.xp_reward || 0), 0);

    return {
      totalRuns: runs.length,
      activeRuns: runs.filter(r => r.status === 'active').length,
      completedRuns: runs.filter(r => r.status === 'completed').length,
      totalQuests: quests.length,
      completedQuests: completedQuests.length,
      totalXP,
      artifacts: artifacts.length,
      completionRate: quests.length > 0 ? (completedQuests.length / quests.length) * 100 : 0,
    };
  } catch (error) {
    Sentry.captureException(error, { tags: { module: 'ambition-arcade', action: 'getStats' } });
    throw error;
  }
}

/**
 * Générer une structure de jeu via IA
 */
export async function generateGameStructure(params: GenerateGameStructure): Promise<GameStructure> {
  try {
    const { data: { session }, error: authError } = await supabase.auth.getSession();
    if (authError || !session) throw new Error('Non authentifié');

    const response = await fetch(EDGE_FUNCTION_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${session.access_token}`,
      },
      body: JSON.stringify(params),
    });

    if (!response.ok) {
      throw new Error(`Edge function error: ${response.status}`);
    }

    const { gameStructure } = await response.json();
    return gameStructure;
  } catch (error) {
    Sentry.captureException(error, { tags: { module: 'ambition-arcade', action: 'generateGameStructure' } });
    throw error;
  }
}
