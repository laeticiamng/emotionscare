/**
 * Hook pour calculer le score de bien-être basé sur les données réelles
 * Utilise clinical_signals comme source principale
 */
import { useQuery } from '@tanstack/react-query';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';

interface WellbeingScoreData {
  score: number;
  factors: {
    streakBonus: number;
    activityScore: number;
    moodScore: number;
    consistencyScore: number;
  };
  trend: 'up' | 'down' | 'stable';
  lastUpdated: string;
}

// Helper pour extraire le score depuis metadata
function extractScoreFromMetadata(metadata: unknown): number {
  if (!metadata || typeof metadata !== 'object') return 50;
  const m = metadata as Record<string, unknown>;
  
  // Essayer différentes clés connues
  if (typeof m.normalized_balance === 'number') return m.normalized_balance;
  if (typeof m.valence === 'number') return m.valence * 100;
  if (typeof m.score === 'number') return m.score;
  if (typeof m.level === 'number') return m.level * 20;
  if (typeof m.emotional_balance === 'number') return m.emotional_balance;
  
  return 50; // Valeur par défaut neutre
}

async function calculateWellbeingScore(userId: string): Promise<WellbeingScoreData> {
  const now = new Date();
  const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
  const fourteenDaysAgo = new Date(now.getTime() - 14 * 24 * 60 * 60 * 1000);

  // Récupérer toutes les données en parallèle
  const [
    userStatsResult,
    recentSignalsResult,
    previousSignalsResult,
    sessionsResult
  ] = await Promise.all([
    supabase
      .from('user_stats')
      .select('streak_days, total_points')
      .eq('user_id', userId)
      .maybeSingle(),
    
    supabase
      .from('clinical_signals')
      .select('metadata, created_at, source_instrument')
      .eq('user_id', userId)
      .gte('created_at', sevenDaysAgo.toISOString())
      .order('created_at', { ascending: false }),
    
    supabase
      .from('clinical_signals')
      .select('metadata')
      .eq('user_id', userId)
      .gte('created_at', fourteenDaysAgo.toISOString())
      .lt('created_at', sevenDaysAgo.toISOString()),
    
    supabase
      .from('activity_sessions')
      .select('mood_after, completed')
      .eq('user_id', userId)
      .eq('completed', true)
      .gte('started_at', sevenDaysAgo.toISOString())
  ]);

  // Calcul des facteurs
  const streak = userStatsResult.data?.streak_days || 0;
  const streakBonus = Math.min(20, streak * 2); // Max 20 points pour 10+ jours

  // Score d'activité basé sur les sessions complétées
  const completedSessions = sessionsResult.data?.length || 0;
  const activityScore = Math.min(25, completedSessions * 5); // Max 25 points pour 5+ sessions

  // Score d'humeur basé sur les signaux cliniques récents
  const recentSignals = recentSignalsResult.data || [];
  const avgMood = recentSignals.length > 0
    ? recentSignals.reduce((sum, s) => sum + extractScoreFromMetadata(s.metadata), 0) / recentSignals.length
    : 50;
  const moodScore = Math.min(30, (avgMood / 100) * 30); // Max 30 points

  // Score de consistance (régularité des activités)
  const uniqueDays = new Set(
    recentSignals.map(s => s.created_at.split('T')[0])
  ).size;
  const consistencyScore = Math.min(25, (uniqueDays / 7) * 25); // Max 25 points pour 7 jours actifs

  // Score total (base 0-100)
  const score = Math.round(streakBonus + activityScore + moodScore + consistencyScore);

  // Calcul de la tendance
  const previousSignals = previousSignalsResult.data || [];
  const previousAvg = previousSignals.length > 0
    ? previousSignals.reduce((sum, s) => sum + extractScoreFromMetadata(s.metadata), 0) / previousSignals.length
    : 50;
  
  let trend: 'up' | 'down' | 'stable' = 'stable';
  if (avgMood > previousAvg + 5) trend = 'up';
  else if (avgMood < previousAvg - 5) trend = 'down';

  // Bonus des signaux cliniques WHO5
  let who5Bonus = 0;
  const who5Signals = recentSignals.filter(s => s.source_instrument === 'WHO5');
  if (who5Signals.length > 0) {
    const latestWho5 = who5Signals[0];
    const metadata = latestWho5.metadata as Record<string, unknown> | null;
    if (metadata?.level !== undefined) {
      const level = typeof metadata.level === 'number' ? metadata.level : 0;
      who5Bonus = level * 2; // Bonus basé sur le niveau WHO5
    }
  }

  return {
    score: Math.min(100, score + who5Bonus),
    factors: {
      streakBonus,
      activityScore,
      moodScore,
      consistencyScore
    },
    trend,
    lastUpdated: now.toISOString()
  };
}

export function useWellbeingScore() {
  const { user } = useAuth();

  const query = useQuery({
    queryKey: ['wellbeing-score', user?.id],
    queryFn: () => calculateWellbeingScore(user!.id),
    enabled: !!user?.id,
    staleTime: 5 * 60 * 1000,
    gcTime: 15 * 60 * 1000,
  });

  return {
    score: query.data?.score ?? 50,
    factors: query.data?.factors ?? {
      streakBonus: 0,
      activityScore: 0,
      moodScore: 0,
      consistencyScore: 0
    },
    trend: query.data?.trend ?? 'stable',
    loading: query.isLoading,
    refetch: query.refetch
  };
}
