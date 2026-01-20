/**
 * Hook pour récupérer les données réelles du Perfect Dashboard
 * Remplace les données mock par des données Supabase
 */

import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { logger } from '@/lib/logger';

export interface PerfectDashboardMetrics {
  wellnessScore: number;
  todaysSessions: number;
  weekStreak: number;
  emotionalState: string;
  recentActivities: Array<{
    id: string;
    type: string;
    title: string;
    time: string;
    score: number;
  }>;
  achievements: Array<{
    id: string;
    title: string;
    description: string;
    progress: number;
    unlocked: boolean;
  }>;
}

const DEFAULT_METRICS: PerfectDashboardMetrics = {
  wellnessScore: 0,
  todaysSessions: 0,
  weekStreak: 0,
  emotionalState: 'neutre',
  recentActivities: [],
  achievements: [],
};

export const usePerfectDashboardData = () => {
  const { user } = useAuth();
  const [metrics, setMetrics] = useState<PerfectDashboardMetrics>(DEFAULT_METRICS);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchDashboardData = useCallback(async () => {
    if (!user?.id) {
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const todayISO = today.toISOString();

      // Fetch multiple data sources in parallel
      const [
        moodResult,
        sessionsResult,
        streakResult,
        activitiesResult,
        achievementsResult,
      ] = await Promise.all([
        // Latest mood entry for emotional state
        supabase
          .from('mood_entries')
          .select('mood, energy_level, notes')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false })
          .limit(1)
          .maybeSingle(),

        // Today's sessions count
        supabase
          .from('activity_sessions')
          .select('id', { count: 'exact' })
          .eq('user_id', user.id)
          .gte('started_at', todayISO),

        // Streak from activity_streaks table
        supabase
          .from('activity_streaks')
          .select('current_streak, longest_streak')
          .eq('user_id', user.id)
          .maybeSingle(),

        // Recent activities
        supabase
          .from('activity_sessions')
          .select(`
            id,
            started_at,
            completed_at,
            rating,
            activity:activities(title, category)
          `)
          .eq('user_id', user.id)
          .eq('completed', true)
          .order('started_at', { ascending: false })
          .limit(5),

        // User achievements
        supabase
          .from('user_achievements')
          .select(`
            id,
            progress,
            completed,
            achievement:achievements(name, description, conditions)
          `)
          .eq('user_id', user.id)
          .order('updated_at', { ascending: false })
          .limit(5),
      ]);

      // Calculate wellness score from various factors
      let wellnessScore = 70; // Base score
      
      // Factor in mood
      if (moodResult.data?.mood) {
        const moodScores: Record<string, number> = {
          'excellent': 95, 'great': 85, 'good': 75, 
          'okay': 60, 'bad': 40, 'terrible': 20,
          'serein': 85, 'énergique': 80, 'calme': 75,
          'stressé': 45, 'anxieux': 40, 'triste': 35,
        };
        wellnessScore = moodScores[moodResult.data.mood.toLowerCase()] || 70;
      }
      
      // Boost for energy level
      if (moodResult.data?.energy_level) {
        wellnessScore = Math.round((wellnessScore + moodResult.data.energy_level * 10) / 2);
      }

      // Determine emotional state from mood
      const emotionMap: Record<string, string> = {
        'excellent': 'épanoui',
        'great': 'énergique',
        'good': 'serein',
        'okay': 'neutre',
        'bad': 'fatigué',
        'terrible': 'difficile',
        'serein': 'serein',
        'calme': 'paisible',
        'stressé': 'tendu',
        'anxieux': 'préoccupé',
      };
      const emotionalState = moodResult.data?.mood 
        ? emotionMap[moodResult.data.mood.toLowerCase()] || 'neutre'
        : 'neutre';

      // Map recent activities
      const recentActivities = (activitiesResult.data || []).map((session: any) => {
        const startTime = new Date(session.started_at);
        return {
          id: session.id,
          type: session.activity?.category || 'activity',
          title: session.activity?.title || 'Session',
          time: startTime.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }),
          score: session.rating ? session.rating * 20 : 75,
        };
      });

      // Map achievements
      const achievements = (achievementsResult.data || []).map((ua: any) => {
        const conditions = ua.achievement?.conditions || {};
        const target = conditions.target || 100;
        const progress = Math.min(100, Math.round((ua.progress / target) * 100));
        
        return {
          id: ua.id,
          title: ua.achievement?.name || 'Achievement',
          description: ua.achievement?.description || '',
          progress,
          unlocked: ua.completed || false,
        };
      });

      // If no achievements from DB, provide defaults
      const finalAchievements = achievements.length > 0 ? achievements : [
        { id: '1', title: 'Premier pas', description: 'Complétez votre première session', progress: 100, unlocked: true },
        { id: '2', title: 'Régularité', description: '7 jours consécutifs', progress: Math.min(100, (streakResult.data?.current_streak || 0) * 14), unlocked: (streakResult.data?.current_streak || 0) >= 7 },
        { id: '3', title: 'Explorateur', description: 'Essayez 5 activités différentes', progress: Math.min(100, recentActivities.length * 20), unlocked: false },
      ];

      setMetrics({
        wellnessScore: Math.min(100, Math.max(0, wellnessScore)),
        todaysSessions: sessionsResult.count || 0,
        weekStreak: streakResult.data?.current_streak || 0,
        emotionalState,
        recentActivities,
        achievements: finalAchievements,
      });

    } catch (err) {
      logger.error('Failed to fetch dashboard data', err as Error, 'DASHBOARD');
      setError('Erreur de chargement des données');
      // Set reasonable defaults on error
      setMetrics({
        ...DEFAULT_METRICS,
        wellnessScore: 75,
        emotionalState: 'serein',
      });
    } finally {
      setIsLoading(false);
    }
  }, [user?.id]);

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  return {
    metrics,
    isLoading,
    error,
    refresh: fetchDashboardData,
  };
};
