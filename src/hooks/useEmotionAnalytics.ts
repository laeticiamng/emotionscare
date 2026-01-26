// @ts-nocheck
import { useState, useEffect, useCallback } from 'react';
import { useQuery } from '@tanstack/react-query';
import { EmotionTrend, EmotionPattern, EmotionInsight } from '@/types/emotion';
import { supabase } from '@/integrations/supabase/client';
import { useLogger } from '@/lib/logger';

interface WeeklyEmotionStats {
  totalScans: number;
  averageMood: number;
  emotionDiversity: number;
  mostFrequentEmotion: string;
  improvementTrend: number;
  wellbeingScore: number;
}

interface UseEmotionAnalyticsReturn {
  emotionTrends: EmotionTrend[];
  weeklyStats: WeeklyEmotionStats | null;
  emotionPatterns: EmotionPattern[];
  insights: EmotionInsight[];
  isLoading: boolean;
  error: Error | null;
  refreshAnalytics: () => void;
  getEmotionInsights: (period: 'day' | 'week' | 'month') => Promise<EmotionInsight[]>;
}

export const useEmotionAnalytics = (): UseEmotionAnalyticsReturn => {
  const logger = useLogger();
  
  const [emotionTrends, setEmotionTrends] = useState<EmotionTrend[]>([]);
  const [weeklyStats, setWeeklyStats] = useState<WeeklyEmotionStats | null>(null);
  const [emotionPatterns, setEmotionPatterns] = useState<EmotionPattern[]>([]);
  const [insights, setInsights] = useState<EmotionInsight[]>([]);

  // Récupérer les données d'analyse d'émotions
  const { data: emotionData, isLoading, error, refetch } = useQuery({
    queryKey: ['emotion-analytics'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      // Récupérer les résultats des 30 derniers jours
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

      const { data, error } = await supabase
        .from('emotion_analyses')
        .select('*')
        .eq('user_id', user.id)
        .gte('created_at', thirtyDaysAgo.toISOString())
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    cacheTime: 15 * 60 * 1000 // 15 minutes
  });

  // Calculer les tendances émotionnelles
  const calculateEmotionTrends = useCallback((data: any[]): EmotionTrend[] => {
    if (!data || data.length === 0) return [];

    try {
      const groupedByDate = data.reduce((acc, item) => {
        const date = new Date(item.created_at).toDateString();
        if (!acc[date]) {
          acc[date] = [];
        }
        acc[date].push(item);
        return acc;
      }, {} as Record<string, any[]>);

      const trends: EmotionTrend[] = Object.entries(groupedByDate).map(([date, items]) => {
        const emotions = items.map(item => item.emotion || 'neutral');
        const confidences = items.map(item => parseFloat(item.confidence) || 0);
        
        // Distribution des émotions
        const emotionDistribution = emotions.reduce((acc, emotion) => {
          acc[emotion] = (acc[emotion] || 0) + 1;
          return acc;
        }, {} as Record<string, number>);

        // Émotion dominante
        const peakEmotion = Object.entries(emotionDistribution)
          .sort(([,a], [,b]) => b - a)[0]?.[0] || 'neutral';

        // Émotion la moins fréquente
        const lowestEmotion = Object.entries(emotionDistribution)
          .sort(([,a], [,b]) => a - b)[0]?.[0] || 'neutral';

        // Score de stabilité (basé sur la variance des émotions)
        const emotionValues = emotions.map(e => getEmotionValue(e));
        const avgValue = emotionValues.reduce((sum, val) => sum + val, 0) / emotionValues.length;
        const variance = emotionValues.reduce((sum, val) => sum + Math.pow(val - avgValue, 2), 0) / emotionValues.length;
        const stabilityIndex = Math.max(0, 100 - Math.sqrt(variance) * 20);

        return {
          date,
          averageMood: avgValue,
          emotionDistribution,
          peakEmotion,
          lowestEmotion,
          stabilityIndex,
          sessionCount: items.length,
          totalScanTime: items.reduce((sum, item) => sum + (item.duration || 0), 0)
        };
      }).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

      return trends;
    } catch (error) {
      logger.error('Error calculating emotion trends', { error });
      return [];
    }
  }, [logger]);

  // Détecter les patterns émotionnels
  const detectEmotionPatterns = useCallback((data: any[]): EmotionPattern[] => {
    if (!data || data.length < 5) return [];

    try {
      const patterns: EmotionPattern[] = [];

      // Pattern quotidien basé sur l'heure
      const hourlyEmotions = data.reduce((acc, item) => {
        const hour = new Date(item.created_at).getHours();
        if (!acc[hour]) acc[hour] = [];
        acc[hour].push(item.emotion || 'neutral');
        return acc;
      }, {} as Record<number, string[]>);

      // Détecter les heures avec des patterns émotionnels cohérents
      Object.entries(hourlyEmotions).forEach(([hour, emotions]) => {
        if (emotions.length >= 3) {
          const mostCommon = getMostFrequent(emotions);
          const frequency = emotions.filter(e => e === mostCommon).length / emotions.length;
          
          if (frequency > 0.6) {
            patterns.push({
              id: `daily_${hour}`,
              name: `Pattern ${hour}h`,
              description: `Émotion ${mostCommon} récurrente vers ${hour}h`,
              type: 'daily',
              confidence: frequency * 100,
              timePattern: {
                hours: [parseInt(hour)],
                daysOfWeek: [0,1,2,3,4,5,6],
                frequency
              }
            });
          }
        }
      });

      // Pattern de transitions émotionnelles
      const transitions = [];
      for (let i = 1; i < data.length; i++) {
        const prev = data[i-1].emotion || 'neutral';
        const curr = data[i].emotion || 'neutral';
        if (prev !== curr) {
          transitions.push({ from: prev, to: curr });
        }
      }

      const transitionCounts = transitions.reduce((acc, t) => {
        const key = `${t.from}->${t.to}`;
        acc[key] = (acc[key] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);

      // Trouver les transitions les plus fréquentes
      const frequentTransitions = Object.entries(transitionCounts)
        .filter(([, count]) => count >= 3)
        .map(([transition, count]) => {
          const [from, to] = transition.split('->');
          return { from, to, probability: count / transitions.length };
        });

      if (frequentTransitions.length > 0) {
        patterns.push({
          id: 'transitions',
          name: 'Transitions Émotionnelles',
          description: 'Patterns de changements d\'émotions identifiés',
          type: 'trigger-based',
          confidence: 80,
          emotionSequence: {
            emotions: [...new Set(frequentTransitions.flatMap(t => [t.from, t.to]))],
            transitions: frequentTransitions
          }
        });
      }

      return patterns;
    } catch (error) {
      logger.error('Error detecting emotion patterns', { error });
      return [];
    }
  }, [logger]);

  // Calculer les statistiques hebdomadaires
  const calculateWeeklyStats = useCallback((data: any[]): WeeklyStats | null => {
    if (!data || data.length === 0) return null;

    try {
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);
      
      const weekData = data.filter(item => 
        new Date(item.created_at) >= weekAgo
      );

      if (weekData.length === 0) return null;

      // Calculer les métriques
      const emotions = weekData.map(item => item.emotion || 'neutral');
      const emotionValues = emotions.map(e => getEmotionValue(e));
      
      const averageMood = emotionValues.reduce((sum, val) => sum + val, 0) / emotionValues.length;
      const uniqueEmotions = new Set(emotions);
      const emotionDiversity = (uniqueEmotions.size / 8) * 100; // 8 émotions principales
      
      const emotionCounts = emotions.reduce((acc, emotion) => {
        acc[emotion] = (acc[emotion] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);
      
      const mostFrequentEmotion = Object.entries(emotionCounts)
        .sort(([,a], [,b]) => b - a)[0]?.[0] || 'neutral';

      // Calculer la tendance d'amélioration (comparaison première/seconde moitié)
      const midPoint = Math.floor(weekData.length / 2);
      const firstHalf = emotionValues.slice(0, midPoint);
      const secondHalf = emotionValues.slice(midPoint);
      
      const firstAvg = firstHalf.reduce((sum, val) => sum + val, 0) / firstHalf.length;
      const secondAvg = secondHalf.reduce((sum, val) => sum + val, 0) / secondHalf.length;
      const improvementTrend = ((secondAvg - firstAvg) / firstAvg) * 100;

      // Score de bien-être global (0-100)
      const wellbeingScore = Math.max(0, Math.min(100, 
        (averageMood * 0.4) + 
        (emotionDiversity * 0.3) + 
        (Math.max(0, improvementTrend + 50) * 0.3)
      ));

      return {
        totalScans: weekData.length,
        averageMood,
        emotionDiversity,
        mostFrequentEmotion,
        improvementTrend,
        wellbeingScore
      };
    } catch (error) {
      logger.error('Error calculating weekly stats', { error });
      return null;
    }
  }, [logger]);

  // Générer des insights IA
  const getEmotionInsights = useCallback(async (period: 'day' | 'week' | 'month'): Promise<EmotionInsight[]> => {
    try {
      const insights: EmotionInsight[] = [];
      
      if (!emotionData || emotionData.length === 0) return insights;

      // Insight sur la tendance générale
      const trends = calculateEmotionTrends(emotionData);
      if (trends.length > 1) {
        const latest = trends[trends.length - 1];
        const previous = trends[trends.length - 2];
        const moodChange = latest.averageMood - previous.averageMood;

        if (Math.abs(moodChange) > 10) {
          insights.push({
            id: `trend_${Date.now()}`,
            type: 'pattern',
            title: moodChange > 0 ? 'Amélioration détectée' : 'Attention nécessaire',
            description: `Votre humeur ${moodChange > 0 ? 'augmente' : 'diminue'} de ${Math.abs(moodChange).toFixed(1)}% par rapport à hier`,
            confidence: 85,
            priority: Math.abs(moodChange) > 20 ? 'high' : 'medium',
            createdAt: new Date()
          });
        }
      }

      // Insight sur la stabilité émotionnelle
      const stabilityScores = trends.map(t => t.stabilityIndex);
      const avgStability = stabilityScores.reduce((sum, score) => sum + score, 0) / stabilityScores.length;
      
      if (avgStability > 80) {
        insights.push({
          id: `stability_${Date.now()}`,
          type: 'milestone',
          title: 'Excellente stabilité émotionnelle',
          description: `Votre stabilité émotionnelle est de ${avgStability.toFixed(1)}%. Continuez sur cette voie !`,
          confidence: 90,
          priority: 'low',
          createdAt: new Date()
        });
      } else if (avgStability < 50) {
        insights.push({
          id: `instability_${Date.now()}`,
          type: 'recommendation',
          title: 'Variabilité émotionnelle élevée',
          description: `Votre stabilité émotionnelle pourrait être améliorée. Essayez des techniques de régulation.`,
          confidence: 75,
          priority: 'medium',
          createdAt: new Date()
        });
      }

      // Insights sur les patterns temporels
      const patterns = detectEmotionPatterns(emotionData);
      patterns.forEach(pattern => {
        if (pattern.confidence > 70) {
          insights.push({
            id: `pattern_${pattern.id}`,
            type: 'pattern',
            title: `Pattern détecté: ${pattern.name}`,
            description: pattern.description,
            confidence: pattern.confidence,
            priority: 'medium',
            createdAt: new Date()
          });
        }
      });

      return insights;
    } catch (error) {
      logger.error('Error generating insights', { error });
      return [];
    }
  }, [emotionData, calculateEmotionTrends, detectEmotionPatterns, logger]);

  // Mettre à jour les données quand emotionData change
  useEffect(() => {
    if (emotionData) {
      const trends = calculateEmotionTrends(emotionData);
      const stats = calculateWeeklyStats(emotionData);
      const patterns = detectEmotionPatterns(emotionData);

      setEmotionTrends(trends);
      setWeeklyStats(stats);
      setEmotionPatterns(patterns);

      // Générer les insights automatiquement
      getEmotionInsights('week').then(setInsights);
    }
  }, [emotionData, calculateEmotionTrends, calculateWeeklyStats, detectEmotionPatterns, getEmotionInsights]);

  const refreshAnalytics = useCallback(() => {
    refetch();
  }, [refetch]);

  return {
    emotionTrends,
    weeklyStats,
    emotionPatterns,
    insights,
    isLoading,
    error: error as Error | null,
    refreshAnalytics,
    getEmotionInsights
  };
};

// Fonctions utilitaires
function getEmotionValue(emotion: string): number {
  const values: Record<string, number> = {
    happy: 85,
    excited: 90,
    calm: 70,
    focused: 75,
    neutral: 50,
    sad: 25,
    angry: 15,
    anxious: 30,
    fear: 20
  };
  return values[emotion.toLowerCase()] || 50;
}

function getMostFrequent<T>(arr: T[]): T {
  const counts = arr.reduce((acc, item) => {
    acc[item as string] = (acc[item as string] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
  
  return Object.entries(counts)
    .sort(([,a], [,b]) => b - a)[0]?.[0] as T || arr[0];
}