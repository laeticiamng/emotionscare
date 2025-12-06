/**
 * Service Ambition
 * Gestion unifiée des objectifs gamifiés (Standard + Arcade)
 *
 * Fonctionnalités :
 * - Créer et gérer des runs d'ambition
 * - Quêtes et sous-objectifs
 * - Artefacts et récompenses
 * - Génération IA de structure de jeu (mode Arcade)
 * - Statistiques et progression
 */

import { supabase } from '@/integrations/supabase/client';
import { Sentry } from '@/lib/errors/sentry-compat';
import type {
  AmbitionRun,
  AmbitionQuest,
  AmbitionArtifact,
  AmbitionRunComplete,
  CreateAmbitionRun,
  UpdateAmbitionRun,
  CreateQuest,
  UpdateQuest,
  CreateArtifact,
  RunStats,
  AmbitionStats,
  UserAmbitionHistory,
  GenerateGameStructure,
  GameStructure,
  RunFilters,
  SortOption,
} from './types';

const EDGE_FUNCTION_URL = import.meta.env.VITE_SUPABASE_URL
  ? `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/ambition-arcade`
  : 'https://yaincoxihiqdksxgrsrk.supabase.co/functions/v1/ambition-arcade';

// ============================================================================
// RUNS MANAGEMENT
// ============================================================================

/**
 * Créer un nouveau run d'ambition
 */
export async function createRun(data: CreateAmbitionRun): Promise<AmbitionRun> {
  try {
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      throw new Error('Utilisateur non authentifié');
    }

    const { data: run, error } = await supabase
      .from('ambition_runs')
      .insert({
        user_id: user.id,
        objective: data.objective,
        tags: data.tags || [],
        metadata: data.metadata || {},
        status: 'active',
      })
      .select()
      .single();

    if (error) throw error;

    return run as AmbitionRun;
  } catch (error) {
    Sentry.captureException(error, {
      tags: { module: 'ambition', action: 'createRun' },
      extra: { objective: data.objective }
    });
    throw error;
  }
}

/**
 * Mettre à jour un run existant
 */
export async function updateRun(
  runId: string,
  data: UpdateAmbitionRun
): Promise<AmbitionRun> {
  try {
    const updates: Record<string, unknown> = {};

    if (data.objective !== undefined) updates.objective = data.objective;
    if (data.status !== undefined) {
      updates.status = data.status;
      if (data.status === 'completed') {
        updates.completed_at = new Date().toISOString();
      }
    }
    if (data.tags !== undefined) updates.tags = data.tags;
    if (data.metadata !== undefined) updates.metadata = data.metadata;

    const { data: run, error } = await supabase
      .from('ambition_runs')
      .update(updates)
      .eq('id', runId)
      .select()
      .single();

    if (error) throw error;

    return run as AmbitionRun;
  } catch (error) {
    Sentry.captureException(error, {
      tags: { module: 'ambition', action: 'updateRun' },
      extra: { runId, updates: data }
    });
    throw error;
  }
}

/**
 * Récupérer un run complet avec quêtes et artefacts
 */
export async function getRunComplete(runId: string): Promise<AmbitionRunComplete> {
  try {
    const [runRes, questsRes, artifactsRes] = await Promise.all([
      supabase.from('ambition_runs').select('*').eq('id', runId).single(),
      supabase.from('ambition_quests').select('*').eq('run_id', runId),
      supabase.from('ambition_artifacts').select('*').eq('run_id', runId),
    ]);

    if (runRes.error) throw runRes.error;

    const quests = questsRes.data || [];
    const artifacts = artifactsRes.data || [];
    const stats = calculateRunStats(quests);

    return {
      ...runRes.data,
      quests: quests as AmbitionQuest[],
      artifacts: artifacts as AmbitionArtifact[],
      stats,
    } as AmbitionRunComplete;
  } catch (error) {
    Sentry.captureException(error, {
      tags: { module: 'ambition', action: 'getRunComplete' },
      extra: { runId }
    });
    throw error;
  }
}

/**
 * Récupérer les runs selon filtres et tri
 */
export async function fetchRuns(
  filters?: RunFilters,
  sort: SortOption = 'recent'
): Promise<AmbitionRun[]> {
  try {
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      throw new Error('Utilisateur non authentifié');
    }

    let query = supabase
      .from('ambition_runs')
      .select('*')
      .eq('user_id', user.id);

    // Filtres
    if (filters?.status && filters.status.length > 0) {
      query = query.in('status', filters.status);
    }

    if (filters?.tags && filters.tags.length > 0) {
      query = query.contains('tags', filters.tags);
    }

    if (filters?.dateFrom) {
      query = query.gte('created_at', filters.dateFrom.toISOString());
    }

    if (filters?.dateTo) {
      query = query.lte('created_at', filters.dateTo.toISOString());
    }

    // Tri
    switch (sort) {
      case 'recent':
        query = query.order('created_at', { ascending: false });
        break;
      case 'oldest':
        query = query.order('created_at', { ascending: true });
        break;
      case 'completion':
        query = query.order('completed_at', { ascending: false, nullsFirst: false });
        break;
      default:
        query = query.order('created_at', { ascending: false });
    }

    const { data, error } = await query;

    if (error) throw error;

    return data as AmbitionRun[];
  } catch (error) {
    Sentry.captureException(error, {
      tags: { module: 'ambition', action: 'fetchRuns' }
    });
    throw error;
  }
}

/**
 * Récupérer les runs actifs
 */
export async function fetchActiveRuns(): Promise<AmbitionRun[]> {
  return fetchRuns({ status: ['active'] }, 'recent');
}

/**
 * Supprimer un run (et cascade quêtes/artefacts)
 */
export async function deleteRun(runId: string): Promise<void> {
  try {
    const { error } = await supabase
      .from('ambition_runs')
      .delete()
      .eq('id', runId);

    if (error) throw error;
  } catch (error) {
    Sentry.captureException(error, {
      tags: { module: 'ambition', action: 'deleteRun' },
      extra: { runId }
    });
    throw error;
  }
}

// ============================================================================
// QUESTS MANAGEMENT
// ============================================================================

/**
 * Créer une nouvelle quête
 */
export async function createQuest(data: CreateQuest): Promise<AmbitionQuest> {
  try {
    const { data: quest, error } = await supabase
      .from('ambition_quests')
      .insert({
        run_id: data.run_id,
        title: data.title,
        flavor: data.flavor,
        est_minutes: data.est_minutes || 15,
        xp_reward: data.xp_reward || 25,
        status: 'available',
      })
      .select()
      .single();

    if (error) throw error;

    return quest as AmbitionQuest;
  } catch (error) {
    Sentry.captureException(error, {
      tags: { module: 'ambition', action: 'createQuest' },
      extra: { title: data.title }
    });
    throw error;
  }
}

/**
 * Mettre à jour une quête
 */
export async function updateQuest(
  questId: string,
  data: UpdateQuest
): Promise<AmbitionQuest> {
  try {
    const updates: Record<string, unknown> = {};

    if (data.status !== undefined) {
      updates.status = data.status;
      if (data.status === 'completed') {
        updates.completed_at = new Date().toISOString();
      }
    }
    if (data.result !== undefined) updates.result = data.result;
    if (data.notes !== undefined) updates.notes = data.notes;

    const { data: quest, error } = await supabase
      .from('ambition_quests')
      .update(updates)
      .eq('id', questId)
      .select()
      .single();

    if (error) throw error;

    return quest as AmbitionQuest;
  } catch (error) {
    Sentry.captureException(error, {
      tags: { module: 'ambition', action: 'updateQuest' },
      extra: { questId }
    });
    throw error;
  }
}

/**
 * Compléter une quête (helper)
 */
export async function completeQuest(
  questId: string,
  result: 'success' | 'partial' | 'failure' | 'skipped' = 'success',
  notes?: string
): Promise<AmbitionQuest> {
  return updateQuest(questId, {
    status: 'completed',
    result,
    notes,
  });
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

    return data as AmbitionQuest[];
  } catch (error) {
    Sentry.captureException(error, {
      tags: { module: 'ambition', action: 'fetchQuests' },
      extra: { runId }
    });
    throw error;
  }
}

/**
 * Supprimer une quête
 */
export async function deleteQuest(questId: string): Promise<void> {
  try {
    const { error } = await supabase
      .from('ambition_quests')
      .delete()
      .eq('id', questId);

    if (error) throw error;
  } catch (error) {
    Sentry.captureException(error, {
      tags: { module: 'ambition', action: 'deleteQuest' },
      extra: { questId }
    });
    throw error;
  }
}

// ============================================================================
// ARTIFACTS MANAGEMENT
// ============================================================================

/**
 * Créer un artefact
 */
export async function createArtifact(data: CreateArtifact): Promise<AmbitionArtifact> {
  try {
    const { data: artifact, error } = await supabase
      .from('ambition_artifacts')
      .insert({
        run_id: data.run_id,
        name: data.name,
        description: data.description,
        rarity: data.rarity || 'common',
        icon: data.icon,
        obtained_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (error) throw error;

    return artifact as AmbitionArtifact;
  } catch (error) {
    Sentry.captureException(error, {
      tags: { module: 'ambition', action: 'createArtifact' },
      extra: { name: data.name }
    });
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

    return data as AmbitionArtifact[];
  } catch (error) {
    Sentry.captureException(error, {
      tags: { module: 'ambition', action: 'fetchArtifacts' },
      extra: { runId }
    });
    throw error;
  }
}

// ============================================================================
// STATISTICS & ANALYTICS
// ============================================================================

/**
 * Calculer les statistiques d'un run à partir des quêtes
 */
function calculateRunStats(quests: AmbitionQuest[]): RunStats {
  const completedQuests = quests.filter(q => q.status === 'completed');
  const failedQuests = quests.filter(q => q.status === 'failed');

  const totalXP = completedQuests.reduce((sum, q) => sum + (q.xp_reward || 0), 0);
  const totalTime = completedQuests.reduce((sum, q) => sum + (q.est_minutes || 0), 0);

  const completionRate = quests.length > 0
    ? (completedQuests.length / quests.length) * 100
    : 0;

  // Calculer jours actifs (basé sur dates de complétion)
  const completionDates = completedQuests
    .filter(q => q.completed_at)
    .map(q => new Date(q.completed_at!).toDateString());
  const uniqueDays = new Set(completionDates).size;

  return {
    total_quests: quests.length,
    completed_quests: completedQuests.length,
    failed_quests: failedQuests.length,
    completion_rate: Math.round(completionRate * 100) / 100,
    total_xp: totalXP,
    total_time_minutes: totalTime,
    artifacts_count: 0, // Sera mis à jour séparément
    days_active: uniqueDays,
  };
}

/**
 * Statistiques globales utilisateur
 */
export async function getStats(): Promise<AmbitionStats> {
  try {
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      throw new Error('Utilisateur non authentifié');
    }

    // Récupérer tous les runs
    const { data: runs, error: runsError } = await supabase
      .from('ambition_runs')
      .select('id, status')
      .eq('user_id', user.id);

    if (runsError) throw runsError;

    const runIds = runs?.map(r => r.id) || [];

    if (runIds.length === 0) {
      return {
        totalRuns: 0,
        activeRuns: 0,
        completedRuns: 0,
        totalQuests: 0,
        completedQuests: 0,
        totalXP: 0,
        artifacts: 0,
        completionRate: 0,
      };
    }

    // Récupérer quêtes et artefacts
    const [questsRes, artifactsRes] = await Promise.all([
      supabase.from('ambition_quests').select('status, xp_reward').in('run_id', runIds),
      supabase.from('ambition_artifacts').select('id').in('run_id', runIds),
    ]);

    const quests = questsRes.data || [];
    const artifacts = artifactsRes.data || [];

    const completedQuests = quests.filter(q => q.status === 'completed');
    const totalXP = completedQuests.reduce((sum, q) => sum + (q.xp_reward || 0), 0);

    return {
      totalRuns: runs?.length || 0,
      activeRuns: runs?.filter(r => r.status === 'active').length || 0,
      completedRuns: runs?.filter(r => r.status === 'completed').length || 0,
      totalQuests: quests.length,
      completedQuests: completedQuests.length,
      totalXP,
      artifacts: artifacts.length,
      completionRate: quests.length > 0
        ? Math.round((completedQuests.length / quests.length) * 100 * 100) / 100
        : 0,
    };
  } catch (error) {
    Sentry.captureException(error, {
      tags: { module: 'ambition', action: 'getStats' }
    });
    throw error;
  }
}

/**
 * Historique complet utilisateur
 */
export async function getUserHistory(): Promise<UserAmbitionHistory> {
  try {
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      throw new Error('Utilisateur non authentifié');
    }

    const { data: runs, error: runsError } = await supabase
      .from('ambition_runs')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (runsError) throw runsError;

    const allRuns = runs || [];
    const runIds = allRuns.map(r => r.id);

    if (runIds.length === 0) {
      return {
        total_runs: 0,
        active_runs: 0,
        completed_runs: 0,
        total_quests_completed: 0,
        total_xp_earned: 0,
        total_artifacts: 0,
        recent_runs: [],
      };
    }

    const [questsRes, artifactsRes] = await Promise.all([
      supabase.from('ambition_quests').select('status, xp_reward').in('run_id', runIds),
      supabase.from('ambition_artifacts').select('id').in('run_id', runIds),
    ]);

    const quests = questsRes.data || [];
    const artifacts = artifactsRes.data || [];

    const completedQuests = quests.filter(q => q.status === 'completed');
    const totalXP = completedQuests.reduce((sum, q) => sum + (q.xp_reward || 0), 0);

    return {
      total_runs: allRuns.length,
      active_runs: allRuns.filter(r => r.status === 'active').length,
      completed_runs: allRuns.filter(r => r.status === 'completed').length,
      total_quests_completed: completedQuests.length,
      total_xp_earned: totalXP,
      total_artifacts: artifacts.length,
      recent_runs: allRuns.slice(0, 10) as AmbitionRun[],
    };
  } catch (error) {
    Sentry.captureException(error, {
      tags: { module: 'ambition', action: 'getUserHistory' }
    });
    throw error;
  }
}

// ============================================================================
// AI GENERATION (ARCADE MODE)
// ============================================================================

/**
 * Générer une structure de jeu gamifié via IA
 * Utilisé pour le mode Arcade
 */
export async function generateGameStructure(
  params: GenerateGameStructure
): Promise<GameStructure> {
  try {
    const { data: { session }, error: authError } = await supabase.auth.getSession();
    if (authError || !session) {
      throw new Error('Utilisateur non authentifié');
    }

    const response = await fetch(EDGE_FUNCTION_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${session.access_token}`,
      },
      body: JSON.stringify(params),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Edge function error (${response.status}): ${errorText}`);
    }

    const { gameStructure } = await response.json();
    return gameStructure as GameStructure;
  } catch (error) {
    Sentry.captureException(error, {
      tags: { module: 'ambition', action: 'generateGameStructure' },
      extra: { goal: params.goal }
    });
    throw error;
  }
}

// ============================================================================
// EXPORTS PAR DÉFAUT
// ============================================================================

export const ambitionService = {
  // Runs
  createRun,
  updateRun,
  getRunComplete,
  fetchRuns,
  fetchActiveRuns,
  deleteRun,

  // Quests
  createQuest,
  updateQuest,
  completeQuest,
  fetchQuests,
  deleteQuest,

  // Artifacts
  createArtifact,
  fetchArtifacts,

  // Stats
  getStats,
  getUserHistory,

  // AI
  generateGameStructure,
};

export default ambitionService;
