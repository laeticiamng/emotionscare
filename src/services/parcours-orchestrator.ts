// @ts-nocheck

import { supabase } from '@/integrations/supabase/client';
import type { ParcoursPreset, ParcoursRun, ParcoursSegment } from '@/types/music/parcours';

export const AVAILABLE_PRESETS: Array<{ key: string; title: string; emotion: string; description: string }> = [
  { key: '00-universel-reset', title: 'Universel Reset → Équilibre', emotion: 'neutral', description: 'Retour au centre avec cohérence cardiaque' },
  { key: '01-panique-anxiete', title: 'Panique/Anxiété → Calme', emotion: 'anxiety', description: 'Respiration 4/6 + grounding 5-4-3-2-1' },
  { key: '02-stress-overwhelm', title: 'Stress/Overwhelm → Décélération', emotion: 'stress', description: 'Tri des tâches + recadrage' },
  { key: '03-rumination-culpabilite', title: 'Rumination → Clarté', emotion: 'rumination', description: 'Défusion cognitive + créneau souci' },
  { key: '04-tristesse-deuil', title: 'Tristesse/Deuil → Lumière', emotion: 'sadness', description: 'Validation + activation comportementale' },
  { key: '05-apathie-demotivation', title: 'Apathie → Élan', emotion: 'apathy', description: 'Activation + intentions Si/Alors' },
  { key: '06-colere-irritabilite', title: 'Colère → Assertivité', emotion: 'anger', description: 'STOP + DESC + relaxation progressive' },
  { key: '07-peur-anticipatoire', title: 'Peur/Phobie → Tolérance', emotion: 'fear', description: 'Exposition graduée + safe place' },
  { key: '08-honte-anxiete-sociale', title: 'Honte → Auto-compassion', emotion: 'shame', description: 'Double standard + script social' },
  { key: '09-jalousie-envie', title: 'Jalousie → Recentrage', emotion: 'jealousy', description: 'Restructuration + valeurs + gratitude' },
  { key: '10-solitude-isolement', title: 'Solitude → Connexion', emotion: 'loneliness', description: 'Lettre à un ami + plan micro-contact' },
  { key: '11-fatigue-mentale', title: 'Burnout → Repos actif', emotion: 'burnout', description: 'Permission repos + scan profond' },
  { key: '12-hypersensibilite', title: 'Hypersensibilité → Filtration', emotion: 'overstimulation', description: 'ACCEPT + cocon protecteur' },
  { key: '13-douleur-physique', title: 'Douleur → Apaisement', emotion: 'pain', description: 'Recadrage + déplacement perceptif' },
  { key: '14-manque-confiance', title: 'Manque confiance → Assurance', emotion: 'insecurity', description: 'Croyances + preuves contraires' },
  { key: '15-perfectionnisme', title: 'Perfectionnisme → Souplesse', emotion: 'perfectionism', description: 'Expérimentation imparfaite + bambou' },
  { key: '16-nostalgie-melancolie', title: 'Nostalgie → Douceur présente', emotion: 'nostalgia', description: 'Gratitude présent + pont temporel' },
  { key: '17-motivation-energie', title: 'Motivation → Mouvement', emotion: 'motivation', description: 'Si/Alors + plan 10 minutes' },
  { key: '18-concentration-flow', title: 'Concentration → Focus', emotion: 'focus', description: 'Pomodoro 10/2 + tunnel attentionnel' },
  { key: '19-amour-gratitude', title: 'Gratitude → Expansion', emotion: 'gratitude', description: 'Journal gratitude + cœur rayonnant' },
];

export async function createParcoursRun(
  presetKey: string,
  emotionState?: any
): Promise<{ runId: string; error?: string }> {
  try {
    console.log('🎭 Création parcours run:', presetKey);

    const { data, error } = await supabase.functions.invoke('parcours-xl-create', {
      body: {
        presetKey,
        emotionState: emotionState || {},
      }
    });

    if (error) throw error;
    if (!data?.runId) throw new Error('No runId returned');

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
    } as ParcoursRun;

  } catch (error) {
    console.error('❌ Erreur récupération run:', error);
    return null;
  }
}

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

export async function saveParcoursJournal(
  runId: string,
  notes: string,
  sudsEnd?: number
): Promise<boolean> {
  try {
    const notesEncrypted = btoa(notes);

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
