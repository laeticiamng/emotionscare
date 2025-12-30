/**
 * Hook useScores - Gestion des scores et vibes
 */
import { useState, useEffect, useCallback, useMemo } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { logger } from '@/lib/logger';
import type { UserScore, VibeMetrics, WeeklyMetrics, ScoreHistory, ScoreInsights, ScoreStatistics, VibeType } from './types';

// ============================================================================
// TYPES
// ============================================================================

interface HeatmapData {
  date: string;
  hour: number;
  mood_score: number;
  activity_count: number;
  dominant_emotion?: string;
}

interface MoodTrend {
  date: string;
  emotional: number;
  wellbeing: number;
  engagement: number;
  overall: number;
}

interface UseScoresOptions {
  weeks?: number;
  autoRefresh?: boolean;
  refreshInterval?: number;
}

interface UseScoresReturn {
  // Data
  scores: UserScore[];
  currentVibe: VibeMetrics | null;
  heatmapData: HeatmapData[];
  moodTrends: MoodTrend[];
  statistics: ScoreStatistics | null;
  weeklyMetrics: WeeklyMetrics | null;
  insights: ScoreInsights | null;
  
  // State
  isLoading: boolean;
  isError: boolean;
  error: Error | null;
  
  // Actions
  refreshScores: () => Promise<void>;
  calculateCurrentWeekScore: () => Promise<void>;
  updateVibe: (vibe: VibeType, intensity: number) => Promise<void>;
  exportData: (format: 'json' | 'csv') => Promise<string>;
  
  // Computed
  latestScore: UserScore | null;
  scoreChange: number;
  trend: 'up' | 'down' | 'stable';
  streakDays: number;
}

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

function getISOWeek(date: Date): number {
  const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
  const dayNum = d.getUTCDay() || 7;
  d.setUTCDate(d.getUTCDate() + 4 - dayNum);
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
  return Math.ceil((((d.getTime() - yearStart.getTime()) / 86400000) + 1) / 7);
}

function calculateTrend(scores: UserScore[]): 'up' | 'down' | 'stable' {
  if (scores.length < 2) return 'stable';
  
  const recent = scores.slice(0, Math.min(3, scores.length));
  const older = scores.slice(-Math.min(3, scores.length));
  
  const recentAvg = recent.reduce((sum, s) => 
    sum + (s.emotional_score + s.wellbeing_score + s.engagement_score) / 3, 0
  ) / recent.length;
  
  const olderAvg = older.reduce((sum, s) => 
    sum + (s.emotional_score + s.wellbeing_score + s.engagement_score) / 3, 0
  ) / older.length;
  
  const diff = recentAvg - olderAvg;
  if (diff > 5) return 'up';
  if (diff < -5) return 'down';
  return 'stable';
}

// ============================================================================
// HOOK
// ============================================================================

export function useScores(options: UseScoresOptions = {}): UseScoresReturn {
  const { weeks = 12, autoRefresh = true, refreshInterval = 60000 } = options;
  const { user } = useAuth();
  const queryClient = useQueryClient();

  // ============================================================================
  // FETCH SCORES
  // ============================================================================
  
  const {
    data: scores = [],
    isLoading: scoresLoading,
    error: scoresError,
    refetch: refetchScores
  } = useQuery({
    queryKey: ['user-scores', user?.id, weeks],
    queryFn: async () => {
      if (!user?.id) return [];
      
      const { data, error } = await supabase
        .from('user_scores')
        .select('*')
        .eq('user_id', user.id)
        .order('year', { ascending: false })
        .order('week_number', { ascending: false })
        .limit(weeks);
      
      if (error) throw error;
      return (data || []) as UserScore[];
    },
    enabled: !!user?.id,
    refetchInterval: autoRefresh ? refreshInterval : false,
    staleTime: 30000
  });

  // ============================================================================
  // FETCH CURRENT VIBE
  // ============================================================================
  
  const { data: currentVibe } = useQuery({
    queryKey: ['current-vibe', user?.id],
    queryFn: async () => {
      if (!user?.id) return null;
      
      const { data, error } = await supabase
        .from('user_vibes')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle();
      
      if (error) throw error;
      if (!data) return null;
      
      return {
        current_vibe: data.vibe_type as VibeType,
        vibe_intensity: data.intensity,
        vibe_duration_hours: Number(data.duration_hours) || 0,
        recent_activities: data.recent_activities || [],
        contributing_factors: (data.contributing_factors as Array<{ factor: string; impact: number }>) || [],
        recommended_modules: data.recommended_modules || []
      } as VibeMetrics;
    },
    enabled: !!user?.id,
    staleTime: 30000
  });

  // ============================================================================
  // FETCH HEATMAP DATA
  // ============================================================================
  
  const { data: heatmapData = [] } = useQuery({
    queryKey: ['mood-heatmap', user?.id],
    queryFn: async () => {
      if (!user?.id) return [];
      
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      
      const { data, error } = await supabase
        .from('daily_mood_heatmap')
        .select('*')
        .eq('user_id', user.id)
        .gte('date', thirtyDaysAgo.toISOString().split('T')[0])
        .order('date', { ascending: false });
      
      if (error) throw error;
      return (data || []) as HeatmapData[];
    },
    enabled: !!user?.id,
    staleTime: 60000
  });

  // ============================================================================
  // COMPUTE MOOD TRENDS FROM SCORES
  // ============================================================================
  
  const moodTrends = useMemo((): MoodTrend[] => {
    return scores.map(s => ({
      date: `${s.year}-W${String(s.week_number).padStart(2, '0')}`,
      emotional: s.emotional_score,
      wellbeing: s.wellbeing_score,
      engagement: s.engagement_score,
      overall: Math.round((s.emotional_score + s.wellbeing_score + s.engagement_score) / 3)
    })).reverse();
  }, [scores]);

  // ============================================================================
  // COMPUTE STATISTICS
  // ============================================================================
  
  const statistics = useMemo((): ScoreStatistics | null => {
    if (scores.length === 0) return null;
    
    const emotional = scores.map(s => s.emotional_score);
    const wellbeing = scores.map(s => s.wellbeing_score);
    const engagement = scores.map(s => s.engagement_score);
    
    const bestWeekScore = scores.reduce((best, current) => {
      const currentAvg = (current.emotional_score + current.wellbeing_score + current.engagement_score) / 3;
      const bestAvg = (best.emotional_score + best.wellbeing_score + best.engagement_score) / 3;
      return currentAvg > bestAvg ? current : best;
    });
    
    // Calculate improvement rate
    const firstScore = scores.length > 0 
      ? (scores[scores.length - 1].emotional_score + scores[scores.length - 1].wellbeing_score) / 2 
      : 0;
    const lastScore = scores.length > 0 
      ? (scores[0].emotional_score + scores[0].wellbeing_score) / 2 
      : 0;
    const improvementRate = firstScore > 0 ? ((lastScore - firstScore) / scores.length) * 10 : 0;
    
    // Calculate consistency
    const avgScores = scores.map(s => (s.emotional_score + s.wellbeing_score + s.engagement_score) / 3);
    const mean = avgScores.reduce((a, b) => a + b, 0) / avgScores.length;
    const variance = avgScores.reduce((sum, score) => sum + Math.pow(score - mean, 2), 0) / avgScores.length;
    const stdDev = Math.sqrt(variance);
    const consistency = Math.max(0, 100 - stdDev);
    
    return {
      user_id: user?.id || '',
      total_score_entries: scores.length,
      highest_emotional_score: Math.max(...emotional),
      highest_wellbeing_score: Math.max(...wellbeing),
      highest_engagement_score: Math.max(...engagement),
      average_emotional_score: emotional.reduce((a, b) => a + b, 0) / emotional.length,
      average_wellbeing_score: wellbeing.reduce((a, b) => a + b, 0) / wellbeing.length,
      average_engagement_score: engagement.reduce((a, b) => a + b, 0) / engagement.length,
      best_week: {
        week_number: bestWeekScore.week_number,
        year: bestWeekScore.year,
        score: Math.round((bestWeekScore.emotional_score + bestWeekScore.wellbeing_score + bestWeekScore.engagement_score) / 3)
      },
      improvement_rate: improvementRate,
      consistency_rating: Math.round(consistency),
      last_updated: new Date().toISOString()
    };
  }, [scores, user?.id]);

  // ============================================================================
  // COMPUTE INSIGHTS
  // ============================================================================
  
  const insights = useMemo((): ScoreInsights | null => {
    if (scores.length === 0) return null;
    
    const latestScore = scores[0];
    const insightsList: ScoreInsights['insights'] = [];
    const keyStrengths: string[] = [];
    const areasForImprovement: string[] = [];
    
    // Emotional analysis
    if (latestScore.emotional_score >= 75) {
      insightsList.push({
        type: 'positive',
        category: 'emotional',
        title: 'Excellent équilibre émotionnel',
        message: 'Votre score émotionnel est excellent. Continuez vos pratiques actuelles.',
        score_impact: 10,
        recommendations: ['Maintenez vos routines de bien-être'],
        priority: 'low'
      });
      keyStrengths.push('Stabilité émotionnelle');
    } else if (latestScore.emotional_score < 50) {
      insightsList.push({
        type: 'concern',
        category: 'emotional',
        title: 'Score émotionnel à améliorer',
        message: 'Votre score émotionnel pourrait bénéficier de plus d\'attention.',
        score_impact: -15,
        recommendations: ['Essayez le module de respiration', 'Tenez un journal quotidien'],
        priority: 'high'
      });
      areasForImprovement.push('Régulation émotionnelle');
    }
    
    // Wellbeing analysis
    if (latestScore.wellbeing_score >= 70) {
      keyStrengths.push('Bien-être général');
    } else if (latestScore.wellbeing_score < 45) {
      areasForImprovement.push('Activités de bien-être');
    }
    
    // Engagement analysis
    if (latestScore.engagement_score >= 80) {
      insightsList.push({
        type: 'positive',
        category: 'engagement',
        title: 'Engagement exceptionnel',
        message: 'Vous êtes très actif sur la plateforme !',
        score_impact: 5,
        recommendations: ['Explorez de nouveaux modules'],
        priority: 'low'
      });
      keyStrengths.push('Engagement régulier');
    } else if (latestScore.engagement_score < 40) {
      areasForImprovement.push('Utilisation régulière');
    }
    
    // Trend analysis
    const trend = calculateTrend(scores);
    if (trend === 'up') {
      insightsList.push({
        type: 'improvement',
        category: 'overall',
        title: 'Tendance positive',
        message: 'Vos scores sont en progression !',
        score_impact: 5,
        recommendations: ['Continuez sur cette lancée!'],
        priority: 'medium'
      });
    }
    
    const positiveCount = insightsList.filter(i => i.type === 'positive' || i.type === 'improvement').length;
    const negativeCount = insightsList.filter(i => i.type === 'concern' || i.type === 'negative').length;
    
    return {
      insights: insightsList,
      overall_sentiment: positiveCount > negativeCount ? 'positive' : negativeCount > 0 ? 'negative' : 'neutral',
      key_strengths: keyStrengths,
      areas_for_improvement: areasForImprovement,
      next_steps: insightsList
        .filter(i => i.priority === 'high')
        .flatMap(i => i.recommendations)
        .slice(0, 3)
    };
  }, [scores]);

  // ============================================================================
  // MUTATIONS
  // ============================================================================
  
  const calculateCurrentWeekMutation = useMutation({
    mutationFn: async () => {
      if (!user?.id) throw new Error('Non authentifié');
      
      const now = new Date();
      const weekNumber = getISOWeek(now);
      const year = now.getFullYear();
      const weekStart = new Date(now);
      weekStart.setDate(now.getDate() - now.getDay() + 1);
      
      // Fetch data for scoring
      const [emotionScans, sessions, activities] = await Promise.all([
        supabase
          .from('emotion_scans')
          .select('mood_score')
          .eq('user_id', user.id)
          .gte('created_at', weekStart.toISOString()),
        supabase
          .from('sessions')
          .select('*')
          .eq('user_id', user.id)
          .gte('created_at', weekStart.toISOString()),
        supabase
          .from('user_activities')
          .select('*')
          .eq('user_id', user.id)
          .gte('created_at', weekStart.toISOString())
      ]);
      
      // Calculate scores
      const moodScores = (emotionScans.data || []).map(e => e.mood_score).filter(Boolean);
      const emotionalScore = moodScores.length > 0 
        ? Math.round(moodScores.reduce((a, b) => a + b, 0) / moodScores.length)
        : 50;
      
      const activityCount = (activities.data || []).length;
      const sessionCount = (sessions.data || []).length;
      
      const wellbeingScore = Math.min(100, Math.round(50 + activityCount * 5));
      const engagementScore = Math.min(100, Math.round(sessionCount * 10 + activityCount * 5));
      
      // Upsert score
      const { error } = await supabase
        .from('user_scores')
        .upsert({
          user_id: user.id,
          week_number: weekNumber,
          year,
          emotional_score: emotionalScore,
          wellbeing_score: wellbeingScore,
          engagement_score: engagementScore,
          updated_at: new Date().toISOString()
        }, {
          onConflict: 'user_id,week_number,year'
        });
      
      if (error) throw error;
      
      logger.info('[useScores] Calculated weekly score', { weekNumber, year }, 'SCORES');
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user-scores'] });
    }
  });

  const updateVibeMutation = useMutation({
    mutationFn: async ({ vibe, intensity }: { vibe: VibeType; intensity: number }) => {
      if (!user?.id) throw new Error('Non authentifié');
      
      const { error } = await supabase
        .from('user_vibes')
        .insert({
          user_id: user.id,
          vibe_type: vibe,
          intensity
        });
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['current-vibe'] });
    }
  });

  // ============================================================================
  // ACTIONS
  // ============================================================================
  
  const refreshScores = useCallback(async () => {
    await refetchScores();
  }, [refetchScores]);

  const calculateCurrentWeekScore = useCallback(async () => {
    await calculateCurrentWeekMutation.mutateAsync();
  }, [calculateCurrentWeekMutation]);

  const updateVibe = useCallback(async (vibe: VibeType, intensity: number) => {
    await updateVibeMutation.mutateAsync({ vibe, intensity });
  }, [updateVibeMutation]);

  const exportData = useCallback(async (format: 'json' | 'csv'): Promise<string> => {
    if (format === 'json') {
      return JSON.stringify({ scores, heatmapData, statistics }, null, 2);
    }
    
    // CSV export
    const headers = ['Week', 'Year', 'Emotional', 'Wellbeing', 'Engagement', 'Overall'];
    const rows = scores.map(s => [
      s.week_number,
      s.year,
      s.emotional_score,
      s.wellbeing_score,
      s.engagement_score,
      Math.round((s.emotional_score + s.wellbeing_score + s.engagement_score) / 3)
    ]);
    
    return [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
  }, [scores, heatmapData, statistics]);

  // ============================================================================
  // COMPUTED VALUES
  // ============================================================================
  
  const latestScore = scores.length > 0 ? scores[0] : null;
  
  const scoreChange = useMemo(() => {
    if (scores.length < 2) return 0;
    const current = (scores[0].emotional_score + scores[0].wellbeing_score + scores[0].engagement_score) / 3;
    const previous = (scores[1].emotional_score + scores[1].wellbeing_score + scores[1].engagement_score) / 3;
    return Math.round(current - previous);
  }, [scores]);

  const trend = useMemo(() => calculateTrend(scores), [scores]);

  const streakDays = useMemo(() => {
    // Calculate from heatmap data
    if (heatmapData.length === 0) return 0;
    
    let streak = 0;
    const today = new Date().toISOString().split('T')[0];
    const sortedDates = [...new Set(heatmapData.map(h => h.date))].sort().reverse();
    
    for (const date of sortedDates) {
      const expectedDate = new Date(today);
      expectedDate.setDate(expectedDate.getDate() - streak);
      if (date === expectedDate.toISOString().split('T')[0]) {
        streak++;
      } else {
        break;
      }
    }
    
    return streak;
  }, [heatmapData]);

  // ============================================================================
  // WEEKLY METRICS (computed from latest score)
  // ============================================================================
  
  const weeklyMetrics = useMemo((): WeeklyMetrics | null => {
    if (!latestScore) return null;
    
    return {
      week_number: latestScore.week_number,
      year: latestScore.year,
      emotional_score: latestScore.emotional_score,
      wellbeing_score: latestScore.wellbeing_score,
      engagement_score: latestScore.engagement_score,
      total_sessions: 0,
      total_minutes: 0,
      modules_used: [],
      achievements_unlocked: 0,
      mood_range: { min: 0, max: 100, average: latestScore.emotional_score },
      dominant_emotions: [],
      best_day: { date: '', score: 0 },
      challenges_faced: 0
    };
  }, [latestScore]);

  // ============================================================================
  // RETURN
  // ============================================================================
  
  return {
    scores,
    currentVibe: currentVibe ?? null,
    heatmapData,
    moodTrends,
    statistics,
    weeklyMetrics,
    insights,
    isLoading: scoresLoading,
    isError: !!scoresError,
    error: scoresError as Error | null,
    refreshScores,
    calculateCurrentWeekScore,
    updateVibe,
    exportData,
    latestScore,
    scoreChange,
    trend,
    streakDays
  };
}

export default useScores;
