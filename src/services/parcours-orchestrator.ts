// @ts-nocheck
/**
 * Orchestrateur pour les parcours musicothérapie longs (18–24 min)
 * Gère la génération multi-segments avec Suno Extend
 */

import { supabase } from '@/integrations/supabase/client';

export interface ParcoursPreset {
  preset_key: string;
  title: string;
  emotion_category: string;
  duration_target: number;
  music: {
    bpm: number;
    mode: string;
    progression: string;
    instruments: string;
    model: string;
  };
  segments: Array<{
    title: string;
    start_s: number;
    end_s: number;
    technique: string;
    voiceover: string;
  }>;
  lyrics?: {
    refrain: string;
    verses: string[];
  };
  tcm?: {
    points: string[];
    contraindications: string[];
    aromatherapy?: string;
  };
  immersion?: {
    tapping: boolean;
    light_color: string;
    breathwork_pattern: string;
    props?: string;
  };
  prompt_suno: string;
}

export interface ParcoursRun {
  id: string;
  user_id: string;
  preset_key: string;
  started_at: string;
  status: 'generating' | 'ready' | 'in_progress' | 'completed' | 'failed';
  segments: ParcoursSegment[];
}

export interface ParcoursSegment {
  id: string;
  run_id: string;
  segment_index: number;
  title: string;
  start_seconds: number;
  end_seconds: number;
  audio_url?: string;
  stream_url?: string;
  voiceover_script?: string;
  status: 'pending' | 'generating' | 'ready' | 'failed';
}

/**
 * Créer une nouvelle run de parcours
 */
export async function createParcoursRun(
  presetKey: string,
  userId: string,
  emotionState?: any
): Promise<{ runId: string; error?: string }> {
  try {
    console.log('🎭 Création parcours run:', presetKey);

    // Appeler l'Edge Function qui orchestre tout
    const { data, error } = await supabase.functions.invoke('parcours-xl-create', {
      body: {
        presetKey,
        emotionState: emotionState || {},
      }
    });

    if (error) {
      throw error;
    }

    if (!data?.runId) {
      throw new Error('No runId returned');
    }

    console.log('✅ Run créée:', data.runId);
    return { runId: data.runId };

  } catch (error) {
    console.error('❌ Erreur création parcours:', error);
    return {
      runId: '',
      error: error instanceof Error ? error.message : 'Erreur inconnue'
    };
  }
}

/**
 * Récupérer une run et ses segments
 */
export async function getParcoursRun(runId: string): Promise<ParcoursRun | null> {
  try {
    const { data: run, error: runError } = await supabase
      .from('parcours_runs')
      .select('*')
      .eq('id', runId)
      .single();

    if (runError) throw runError;

    const { data: segments, error: segmentsError } = await supabase
      .from('parcours_segments')
      .select('*')
      .eq('run_id', runId)
      .order('segment_index', { ascending: true });

    if (segmentsError) throw segmentsError;

    return {
      ...run,
      segments: segments || []
    };

  } catch (error) {
    console.error('❌ Erreur récupération run:', error);
    return null;
  }
}

/**
 * Mettre à jour le statut d'une run
 */
export async function updateRunStatus(
  runId: string,
  status: string,
  metadata?: any
): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('parcours_runs')
      .update({
        status,
        metadata,
        ...(status === 'completed' && { ended_at: new Date().toISOString() })
      })
      .eq('id', runId);

    return !error;
  } catch (error) {
    console.error('❌ Erreur update run:', error);
    return false;
  }
}

/**
 * Sauvegarder le journal de fin de parcours (chiffré)
 */
export async function saveParcoursJournal(
  runId: string,
  notes: string,
  sudsEnd?: number
): Promise<boolean> {
  try {
    // TODO: Chiffrer les notes avant stockage
    const notesEncrypted = btoa(notes); // Simple base64 pour MVP, à améliorer

    const { error } = await supabase
      .from('parcours_runs')
      .update({
        notes_encrypted: notesEncrypted,
        suds_end: sudsEnd,
        ended_at: new Date().toISOString(),
        status: 'completed'
      })
      .eq('id', runId);

    return !error;
  } catch (error) {
    console.error('❌ Erreur sauvegarde journal:', error);
    return false;
  }
}

/**
 * Liste des presets disponibles
 */
export const AVAILABLE_PRESETS = [
  { key: 'universel-reset', title: 'Reset Universel', emotion: 'Neutre', duration: '20 min', icon: '⚖️' },
  { key: 'panique-anxiete', title: 'Calme & Contrôle', emotion: 'Anxiété', duration: '20 min', icon: '🌊' },
  { key: 'stress-overwhelm', title: 'Décélération', emotion: 'Stress', duration: '18 min', icon: '🐌' },
  { key: 'rumination-culpabilite', title: 'Clarté', emotion: 'Rumination', duration: '19 min', icon: '🧘' },
  { key: 'tristesse-deuil', title: 'Lumière', emotion: 'Tristesse', duration: '22 min', icon: '🕯️' },
  { key: 'apathie-demotivation', title: 'Élan', emotion: 'Apathie', duration: '18 min', icon: '⚡' },
  { key: 'colere-irritabilite', title: 'Assertivité', emotion: 'Colère', duration: '20 min', icon: '🔥' },
  { key: 'peur-anticipatoire', title: 'Tolérance', emotion: 'Peur', duration: '20 min', icon: '🦋' },
  { key: 'honte-anxiete-sociale', title: 'Auto-compassion', emotion: 'Honte', duration: '18 min', icon: '💝' },
  { key: 'jalousie-envie', title: 'Recentrage', emotion: 'Jalousie', duration: '18 min', icon: '🎯' },
  { key: 'solitude-isolement', title: 'Connexion', emotion: 'Solitude', duration: '20 min', icon: '🤝' },
  { key: 'fatigue-burnout', title: 'Repos actif', emotion: 'Burnout', duration: '22 min', icon: '🛌' },
  { key: 'hypersensibilite', title: 'Filtration', emotion: 'Hypersensibilité', duration: '18 min', icon: '🛡️' },
  { key: 'douleur-physique', title: 'Apaisement', emotion: 'Douleur', duration: '20 min', icon: '🌿' },
  { key: 'manque-confiance', title: 'Assurance douce', emotion: 'Doute', duration: '20 min', icon: '💪' },
  { key: 'perfectionnisme', title: 'Souplesse', emotion: 'Perfectionnisme', duration: '18 min', icon: '🎋' },
  { key: 'nostalgie', title: 'Douceur présente', emotion: 'Nostalgie', duration: '20 min', icon: '📷' },
  { key: 'motivation', title: 'Mise en mouvement', emotion: 'Motivation', duration: '18 min', icon: '🚀' },
  { key: 'concentration', title: 'Focus stable', emotion: 'Concentration', duration: '18 min', icon: '🎯' },
  { key: 'amour-gratitude', title: 'Expansion', emotion: 'Gratitude', duration: '20 min', icon: '❤️' },
] as const;
