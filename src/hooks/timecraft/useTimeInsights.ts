/**
 * Hook pour générer des insights temporels non-prescriptifs (B2C)
 */
import { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useTimeBlocks, TimeBlockStats } from './useTimeBlocks';
import { useMood } from '@/hooks/useMood';

export interface TimeInsight {
  id: string;
  type: 'observation' | 'pattern' | 'correlation';
  severity: 'info' | 'attention' | 'neutral';
  title: string;
  description: string;
  relatedBlocks?: string[];
  emotionalContext?: {
    avgValence: number;
    avgArousal: number;
  };
}

// Génère des insights basés sur les données sans jugement ni prescription
function generateInsights(stats: TimeBlockStats, moodData: { valence: number; arousal: number }): TimeInsight[] {
  const insights: TimeInsight[] = [];

  // Observation sur l'équilibre récupération/contrainte
  if (stats.constraint > 0 && stats.recovery > 0) {
    const ratio = stats.recovery / stats.constraint;
    if (ratio < 0.5) {
      insights.push({
        id: 'recovery-ratio',
        type: 'observation',
        severity: 'attention',
        title: 'Temps de récupération',
        description: `Ton temps de récupération (${stats.recovery}h) est inférieur à la moitié de ton temps de contrainte (${stats.constraint}h).`,
      });
    } else if (ratio >= 1) {
      insights.push({
        id: 'recovery-balance',
        type: 'observation',
        severity: 'info',
        title: 'Équilibre observé',
        description: `Ton temps de récupération équilibre ou dépasse ton temps de contrainte.`,
      });
    }
  }

  // Observation sur le temps créatif
  if (stats.creation > 0) {
    insights.push({
      id: 'creation-time',
      type: 'observation',
      severity: 'info',
      title: 'Temps créatif identifié',
      description: `${stats.creation}h de temps créatif dans ta semaine.`,
    });
  }

  // Pattern temps choisi vs subi
  if (stats.chosen > 0 || stats.imposed > 0) {
    const chosenRatio = stats.total > 0 ? (stats.chosen / stats.total) * 100 : 0;
    insights.push({
      id: 'autonomy-ratio',
      type: 'pattern',
      severity: 'neutral',
      title: 'Temps choisi',
      description: `${Math.round(chosenRatio)}% de ton temps est du temps choisi.`,
    });
  }

  // Corrélation avec l'état émotionnel actuel
  if (moodData.valence < -30 && stats.constraint > stats.recovery * 2) {
    insights.push({
      id: 'emotion-constraint-correlation',
      type: 'correlation',
      severity: 'attention',
      title: 'Corrélation observée',
      description: 'Les moments de charge émotionnelle semblent concentrés sur les périodes de contrainte.',
      emotionalContext: {
        avgValence: moodData.valence,
        avgArousal: moodData.arousal,
      },
    });
  }

  // Charge émotionnelle
  if (stats.emotional > 0) {
    insights.push({
      id: 'emotional-load',
      type: 'observation',
      severity: 'neutral',
      title: 'Charge émotionnelle',
      description: `${stats.emotional}h identifiées comme moments de charge émotionnelle intense.`,
    });
  }

  // Si pas assez de données
  if (stats.total === 0) {
    insights.push({
      id: 'no-data',
      type: 'observation',
      severity: 'neutral',
      title: 'Cartographie en attente',
      description: 'Ajoute des blocs temporels pour générer des observations personnalisées.',
    });
  }

  return insights;
}

export function useTimeInsights(versionId?: string) {
  const { stats, blocks, isLoading: blocksLoading } = useTimeBlocks(versionId);
  const moodStore = useMood();

  // Fetch saved insights from DB
  const { data: savedInsights = [], isLoading: insightsLoading } = useQuery({
    queryKey: ['time-insights', versionId],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return [];

      const { data, error } = await supabase
        .from('time_insights')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(20);

      if (error) throw error;
      return data;
    },
  });

  // Generate real-time insights
  const generatedInsights = useMemo(() => {
    return generateInsights(stats, {
      valence: moodStore.valence,
      arousal: moodStore.arousal,
    });
  }, [stats, moodStore.valence, moodStore.arousal]);

  // Calculate balance score (non-judgmental)
  const balanceIndicators = useMemo(() => {
    if (stats.total === 0) return null;

    return {
      recoveryRatio: stats.recovery / Math.max(stats.constraint, 1),
      autonomyRatio: stats.chosen / Math.max(stats.imposed + stats.chosen, 1),
      creativeRatio: stats.creation / stats.total,
      constraintRatio: stats.constraint / stats.total,
    };
  }, [stats]);

  return {
    insights: generatedInsights,
    savedInsights,
    balanceIndicators,
    stats,
    isLoading: blocksLoading || insightsLoading,
  };
}
