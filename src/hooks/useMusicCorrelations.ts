/**
 * useMusicCorrelations - Analyse des corrélations musique ↔ humeur
 * Détecte les patterns entre écoute musicale et états émotionnels
 */

import { useState, useCallback, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { logger } from '@/lib/logger';

export interface MusicMoodCorrelation {
  genre: string;
  avgMoodBefore: number;
  avgMoodAfter: number;
  moodChange: number;
  listenCount: number;
  effectiveness: 'positive' | 'neutral' | 'negative';
}

export interface TempoMoodCorrelation {
  tempoRange: string;
  avgMoodChange: number;
  bestForMood: 'low' | 'medium' | 'high';
}

export interface TimeOfDayPattern {
  hour: number;
  preferredGenres: string[];
  avgListenDuration: number;
  moodTrend: 'improving' | 'stable' | 'declining';
}

export interface MusicInsight {
  type: 'discovery' | 'pattern' | 'recommendation';
  title: string;
  description: string;
  confidence: number;
  data?: Record<string, unknown>;
}

interface CorrelationsState {
  genreCorrelations: MusicMoodCorrelation[];
  tempoCorrelations: TempoMoodCorrelation[];
  timePatterns: TimeOfDayPattern[];
  insights: MusicInsight[];
  isLoading: boolean;
  lastAnalysis: string | null;
}

const DEFAULT_STATE: CorrelationsState = {
  genreCorrelations: [],
  tempoCorrelations: [],
  timePatterns: [],
  insights: [],
  isLoading: false,
  lastAnalysis: null,
};

export function useMusicCorrelations() {
  const { user } = useAuth();
  const [state, setState] = useState<CorrelationsState>(DEFAULT_STATE);

  // Analyser les corrélations genre ↔ humeur
  const analyzeGenreCorrelations = useCallback(async (): Promise<MusicMoodCorrelation[]> => {
    if (!user) return [];

    try {
      // Récupérer historique d'écoute
      const { data: listens } = await supabase
        .from('music_listen_events')
        .select('track_id, genre, played_at, duration_ms')
        .eq('user_id', user.id)
        .gte('played_at', new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString())
        .order('played_at', { ascending: false });

      // Récupérer moods autour des écoutes
      const { data: moods } = await supabase
        .from('mood_entries')
        .select('score, created_at')
        .eq('user_id', user.id)
        .gte('created_at', new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString());

      if (!listens?.length || !moods?.length) return [];

      // Grouper par genre
      const genreStats: Record<string, {
        moodsBefore: number[];
        moodsAfter: number[];
        count: number;
      }> = {};

      for (const listen of listens) {
        const genre = listen.genre || 'Unknown';
        const listenTime = new Date(listen.played_at).getTime();

        // Trouver mood avant (dans les 30 min précédentes)
        const moodBefore = moods.find(m => {
          const moodTime = new Date(m.created_at).getTime();
          return moodTime < listenTime && listenTime - moodTime < 30 * 60 * 1000;
        });

        // Trouver mood après (dans les 60 min suivantes)
        const moodAfter = moods.find(m => {
          const moodTime = new Date(m.created_at).getTime();
          return moodTime > listenTime && moodTime - listenTime < 60 * 60 * 1000;
        });

        if (!genreStats[genre]) {
          genreStats[genre] = { moodsBefore: [], moodsAfter: [], count: 0 };
        }

        genreStats[genre].count++;
        if (moodBefore) genreStats[genre].moodsBefore.push(moodBefore.score);
        if (moodAfter) genreStats[genre].moodsAfter.push(moodAfter.score);
      }

      // Calculer moyennes et corrélations
      return Object.entries(genreStats)
        .filter(([_, stats]) => stats.count >= 3 && stats.moodsBefore.length > 0)
        .map(([genre, stats]) => {
          const avgBefore = stats.moodsBefore.reduce((a, b) => a + b, 0) / stats.moodsBefore.length;
          const avgAfter = stats.moodsAfter.length > 0
            ? stats.moodsAfter.reduce((a, b) => a + b, 0) / stats.moodsAfter.length
            : avgBefore;
          const change = avgAfter - avgBefore;

          return {
            genre,
            avgMoodBefore: Math.round(avgBefore * 10) / 10,
            avgMoodAfter: Math.round(avgAfter * 10) / 10,
            moodChange: Math.round(change * 10) / 10,
            listenCount: stats.count,
            effectiveness: (change > 5 ? 'positive' : change < -5 ? 'negative' : 'neutral') as MusicMoodCorrelation['effectiveness'],
          };
        })
        .sort((a, b) => b.moodChange - a.moodChange);
    } catch (error) {
      logger.error('[MusicCorrelations] Genre analysis error', error as Error, 'MUSIC');
      return [];
    }
  }, [user]);

  // Générer des insights
  const generateInsights = useCallback((correlations: MusicMoodCorrelation[]): MusicInsight[] => {
    const insights: MusicInsight[] = [];

    // Meilleur genre pour améliorer l'humeur
    const bestGenre = correlations.find(c => c.effectiveness === 'positive');
    if (bestGenre) {
      insights.push({
        type: 'discovery',
        title: 'Votre meilleur allié musical',
        description: `La musique ${bestGenre.genre} améliore votre humeur de ${bestGenre.moodChange} points en moyenne.`,
        confidence: Math.min(0.9, bestGenre.listenCount / 20),
        data: { genre: bestGenre.genre, change: bestGenre.moodChange },
      });
    }

    // Genre à éviter
    const worstGenre = correlations.find(c => c.effectiveness === 'negative');
    if (worstGenre) {
      insights.push({
        type: 'pattern',
        title: 'À consommer avec modération',
        description: `La musique ${worstGenre.genre} semble affecter négativement votre humeur (${worstGenre.moodChange} points).`,
        confidence: Math.min(0.8, worstGenre.listenCount / 15),
        data: { genre: worstGenre.genre, change: worstGenre.moodChange },
      });
    }

    // Recommandation basée sur humeur basse
    if (bestGenre && bestGenre.moodChange > 5) {
      insights.push({
        type: 'recommendation',
        title: 'Suggestion pour les moments difficiles',
        description: `Quand votre moral est bas, essayez d'écouter du ${bestGenre.genre}. C'est votre genre le plus efficace.`,
        confidence: 0.75,
      });
    }

    // Diversité musicale
    if (correlations.length > 5) {
      const positiveGenres = correlations.filter(c => c.effectiveness === 'positive').length;
      if (positiveGenres >= 3) {
        insights.push({
          type: 'discovery',
          title: 'Palette émotionnelle riche',
          description: `Vous avez ${positiveGenres} genres musicaux qui améliorent votre humeur. Belle diversité !`,
          confidence: 0.85,
        });
      }
    }

    return insights;
  }, []);

  // Analyse complète
  const runAnalysis = useCallback(async () => {
    if (!user) return;

    setState(s => ({ ...s, isLoading: true }));

    try {
      const genreCorrelations = await analyzeGenreCorrelations();
      const insights = generateInsights(genreCorrelations);

      setState({
        genreCorrelations,
        tempoCorrelations: [], // TODO: implémenter
        timePatterns: [], // TODO: implémenter
        insights,
        isLoading: false,
        lastAnalysis: new Date().toISOString(),
      });

      logger.info('[MusicCorrelations] Analysis complete', { 
        genres: genreCorrelations.length, 
        insights: insights.length 
      }, 'MUSIC');
    } catch (error) {
      logger.error('[MusicCorrelations] Analysis error', error as Error, 'MUSIC');
      setState(s => ({ ...s, isLoading: false }));
    }
  }, [user, analyzeGenreCorrelations, generateInsights]);

  // Obtenir recommandation pour humeur actuelle
  const getRecommendationForMood = useCallback((currentMood: number): string | null => {
    if (currentMood < 40) {
      // Humeur basse → genre qui améliore le plus
      const best = state.genreCorrelations.find(c => c.effectiveness === 'positive');
      return best?.genre || null;
    }
    if (currentMood > 70) {
      // Bonne humeur → genre neutre ou positif pour maintenir
      const neutral = state.genreCorrelations.find(c => c.effectiveness === 'neutral');
      return neutral?.genre || state.genreCorrelations[0]?.genre || null;
    }
    return null;
  }, [state.genreCorrelations]);

  // Charger au montage
  useEffect(() => {
    if (user) {
      runAnalysis();
    }
  }, [user]);

  return {
    ...state,
    runAnalysis,
    getRecommendationForMood,
  };
}

export default useMusicCorrelations;
