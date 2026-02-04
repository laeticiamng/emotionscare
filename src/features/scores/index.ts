/**
 * Feature: Wellness Scores
 * Calcul et suivi des scores de bien-être multidimensionnels
 * 
 * Dimensions mesurées:
 * - Score émotionnel (stabilité, positivité)
 * - Score d'activité (engagement, régularité)
 * - Score social (connexions, partage)
 * - Score de progression (objectifs, croissance)
 */

import { supabase } from '@/integrations/supabase/client';
import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';

// ============================================================================
// TYPES
// ============================================================================

export interface WellnessScore {
  overall: number;
  emotional: number;
  activity: number;
  social: number;
  progress: number;
  timestamp: string;
}

export interface ScoreBreakdown {
  dimension: ScoreDimension;
  score: number;
  trend: 'up' | 'down' | 'stable';
  factors: ScoreFactor[];
}

export interface ScoreFactor {
  name: string;
  contribution: number;
  weight: number;
  description: string;
}

export type ScoreDimension = 'emotional' | 'activity' | 'social' | 'progress';

export interface ScoreHistory {
  date: string;
  scores: WellnessScore;
}

export interface ScoreGoal {
  id: string;
  dimension: ScoreDimension;
  target_score: number;
  current_score: number;
  deadline?: string;
  created_at: string;
}

// ============================================================================
// WEIGHTS AND FACTORS
// ============================================================================

export const SCORE_WEIGHTS: Record<ScoreDimension, number> = {
  emotional: 0.35,
  activity: 0.30,
  social: 0.15,
  progress: 0.20,
};

export const SCORE_FACTORS: Record<ScoreDimension, { name: string; weight: number; description: string }[]> = {
  emotional: [
    { name: 'Stabilité émotionnelle', weight: 0.3, description: 'Variance des émotions sur 7 jours' },
    { name: 'Positivité moyenne', weight: 0.25, description: 'Ratio joie vs émotions négatives' },
    { name: 'Résilience', weight: 0.25, description: 'Récupération après pics négatifs' },
    { name: 'Conscience émotionnelle', weight: 0.2, description: 'Fréquence des check-ins' },
  ],
  activity: [
    { name: 'Régularité', weight: 0.35, description: 'Activités quotidiennes' },
    { name: 'Diversité', weight: 0.25, description: 'Variété des modules utilisés' },
    { name: 'Durée', weight: 0.2, description: 'Temps total d\'engagement' },
    { name: 'Complétion', weight: 0.2, description: 'Sessions terminées vs commencées' },
  ],
  social: [
    { name: 'Interactions', weight: 0.4, description: 'Participation communauté' },
    { name: 'Soutien donné', weight: 0.3, description: 'Aide apportée aux autres' },
    { name: 'Connexions', weight: 0.3, description: 'Réseau de soutien' },
  ],
  progress: [
    { name: 'Objectifs atteints', weight: 0.35, description: 'Goals complétés' },
    { name: 'Streak', weight: 0.25, description: 'Jours consécutifs' },
    { name: 'Niveau', weight: 0.2, description: 'Progression XP' },
    { name: 'Badges', weight: 0.2, description: 'Accomplissements débloqués' },
  ],
};

// ============================================================================
// HOOKS
// ============================================================================

export function useWellnessScore() {
  const { user } = useAuth();
  const [score, setScore] = useState<WellnessScore | null>(null);
  const [breakdown, setBreakdown] = useState<ScoreBreakdown[]>([]);
  const [loading, setLoading] = useState(true);

  const calculateScore = useCallback(async () => {
    if (!user?.id) return;
    
    setLoading(true);
    
    try {
      // Fetch data for calculations
      const [emotionData, activityData, socialData, progressData] = await Promise.all([
        supabase
          .from('mood_entries')
          .select('*')
          .eq('user_id', user.id)
          .gte('created_at', getDateDaysAgo(7)),
        supabase
          .from('activity_sessions')
          .select('*')
          .eq('user_id', user.id)
          .gte('started_at', getDateDaysAgo(7)),
        supabase
          .from('community_reactions')
          .select('*')
          .eq('user_id', user.id)
          .gte('created_at', getDateDaysAgo(7)),
        supabase
          .from('user_stats')
          .select('*')
          .eq('user_id', user.id)
          .single(),
      ]);

      // Calculate emotional score
      const emotionalScore = calculateEmotionalScore(emotionData.data || []);
      
      // Calculate activity score
      const activityScore = calculateActivityScore(activityData.data || []);
      
      // Calculate social score
      const socialScore = calculateSocialScore(socialData.data || []);
      
      // Calculate progress score
      const progressScore = calculateProgressScore(progressData.data);

      // Calculate overall weighted score
      const overall = Math.round(
        emotionalScore * SCORE_WEIGHTS.emotional +
        activityScore * SCORE_WEIGHTS.activity +
        socialScore * SCORE_WEIGHTS.social +
        progressScore * SCORE_WEIGHTS.progress
      );

      const newScore: WellnessScore = {
        overall,
        emotional: emotionalScore,
        activity: activityScore,
        social: socialScore,
        progress: progressScore,
        timestamp: new Date().toISOString(),
      };

      setScore(newScore);

      // Build breakdown
      const newBreakdown: ScoreBreakdown[] = [
        {
          dimension: 'emotional',
          score: emotionalScore,
          trend: 'stable',
          factors: SCORE_FACTORS.emotional.map(f => ({
            ...f,
            contribution: Math.round(emotionalScore * f.weight),
          })),
        },
        {
          dimension: 'activity',
          score: activityScore,
          trend: 'stable',
          factors: SCORE_FACTORS.activity.map(f => ({
            ...f,
            contribution: Math.round(activityScore * f.weight),
          })),
        },
        {
          dimension: 'social',
          score: socialScore,
          trend: 'stable',
          factors: SCORE_FACTORS.social.map(f => ({
            ...f,
            contribution: Math.round(socialScore * f.weight),
          })),
        },
        {
          dimension: 'progress',
          score: progressScore,
          trend: 'stable',
          factors: SCORE_FACTORS.progress.map(f => ({
            ...f,
            contribution: Math.round(progressScore * f.weight),
          })),
        },
      ];

      setBreakdown(newBreakdown);
    } catch (error) {
      console.error('Error calculating wellness score:', error);
    } finally {
      setLoading(false);
    }
  }, [user?.id]);

  useEffect(() => {
    calculateScore();
  }, [calculateScore]);

  return { score, breakdown, loading, refresh: calculateScore };
}

export function useScoreHistory(days: number = 30) {
  const { user } = useAuth();
  const [history, setHistory] = useState<ScoreHistory[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user?.id) return;

    const fetchHistory = async () => {
      setLoading(true);
      
      const { data } = await supabase
        .from('user_score_aggregates')
        .select('*')
        .eq('user_id', user.id)
        .gte('date', getDateDaysAgo(days))
        .order('date', { ascending: true });

      if (data) {
        setHistory(data.map(d => ({
          date: d.date,
          scores: {
            overall: d.overall_score || 0,
            emotional: d.emotional_score || 0,
            activity: d.activity_score || 0,
            social: d.social_score || 0,
            progress: d.progress_score || 0,
            timestamp: d.date,
          },
        })));
      }
      
      setLoading(false);
    };

    fetchHistory();
  }, [user?.id, days]);

  return { history, loading };
}

export function useScoreGoals() {
  const { user } = useAuth();
  const [goals, setGoals] = useState<ScoreGoal[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user?.id) return;

    const fetchGoals = async () => {
      setLoading(true);
      
      const { data } = await supabase
        .from('user_goals')
        .select('*')
        .eq('user_id', user.id)
        .eq('completed', false);

      if (data) {
        setGoals(data.map(g => ({
          id: g.id,
          dimension: g.goal_type as ScoreDimension,
          target_score: g.target_value || 100,
          current_score: g.current_value || 0,
          deadline: g.deadline,
          created_at: g.created_at,
        })));
      }
      
      setLoading(false);
    };

    fetchGoals();
  }, [user?.id]);

  const addGoal = async (dimension: ScoreDimension, targetScore: number, deadline?: string) => {
    if (!user?.id) return;

    const { data, error } = await supabase
      .from('user_goals')
      .insert({
        user_id: user.id,
        goal_type: dimension,
        target_value: targetScore,
        current_value: 0,
        deadline,
        title: `Atteindre ${targetScore}% en ${dimension}`,
      })
      .select()
      .single();

    if (!error && data) {
      setGoals(prev => [...prev, {
        id: data.id,
        dimension,
        target_score: targetScore,
        current_score: 0,
        deadline,
        created_at: data.created_at,
      }]);
    }
  };

  return { goals, loading, addGoal };
}

// ============================================================================
// CALCULATION HELPERS
// ============================================================================

function getDateDaysAgo(days: number): string {
  const date = new Date();
  date.setDate(date.getDate() - days);
  return date.toISOString();
}

function calculateEmotionalScore(entries: any[]): number {
  if (entries.length === 0) return 50;
  
  // Calculate average positivity
  const positiveEmotions = ['joy', 'happy', 'excited', 'calm', 'peaceful'];
  const negativeEmotions = ['sad', 'angry', 'anxious', 'stressed', 'fear'];
  
  let positiveCount = 0;
  let negativeCount = 0;
  
  entries.forEach(entry => {
    if (positiveEmotions.includes(entry.mood?.toLowerCase())) positiveCount++;
    if (negativeEmotions.includes(entry.mood?.toLowerCase())) negativeCount++;
  });
  
  const total = positiveCount + negativeCount || 1;
  const positivityRatio = positiveCount / total;
  
  // Calculate stability (inverse of variance)
  const scores = entries.map(e => e.intensity || 5);
  const mean = scores.reduce((a, b) => a + b, 0) / scores.length;
  const variance = scores.reduce((acc, s) => acc + Math.pow(s - mean, 2), 0) / scores.length;
  const stability = 1 - Math.min(variance / 10, 1);
  
  return Math.round((positivityRatio * 0.6 + stability * 0.4) * 100);
}

function calculateActivityScore(sessions: any[]): number {
  if (sessions.length === 0) return 30;
  
  // Regularity: sessions per day
  const uniqueDays = new Set(sessions.map(s => s.started_at?.split('T')[0]));
  const regularity = Math.min(uniqueDays.size / 7, 1);
  
  // Completion rate
  const completed = sessions.filter(s => s.completed).length;
  const completionRate = completed / sessions.length;
  
  // Total duration (normalized to 60 min target per week)
  const totalMinutes = sessions.reduce((acc, s) => acc + (s.duration_seconds || 0) / 60, 0);
  const durationScore = Math.min(totalMinutes / 60, 1);
  
  return Math.round((regularity * 0.4 + completionRate * 0.35 + durationScore * 0.25) * 100);
}

function calculateSocialScore(reactions: any[]): number {
  if (reactions.length === 0) return 40;
  
  // Interaction frequency
  const interactionScore = Math.min(reactions.length / 10, 1);
  
  return Math.round(interactionScore * 100);
}

function calculateProgressScore(stats: any): number {
  if (!stats) return 50;
  
  // Based on XP, streak, level
  const levelScore = Math.min((stats.level || 1) / 10, 1);
  const streakScore = Math.min((stats.streak_days || 0) / 30, 1);
  const xpProgress = Math.min((stats.total_points || 0) / 5000, 1);
  
  return Math.round((levelScore * 0.3 + streakScore * 0.35 + xpProgress * 0.35) * 100);
}

// ============================================================================
// SERVICE
// ============================================================================

export const scoresService = {
  async getLatestScore(userId: string): Promise<WellnessScore | null> {
    const { data } = await supabase
      .from('user_score_aggregates')
      .select('*')
      .eq('user_id', userId)
      .order('date', { ascending: false })
      .limit(1)
      .single();

    if (!data) return null;

    return {
      overall: data.overall_score || 0,
      emotional: data.emotional_score || 0,
      activity: data.activity_score || 0,
      social: data.social_score || 0,
      progress: data.progress_score || 0,
      timestamp: data.date,
    };
  },

  async saveScore(userId: string, score: WellnessScore): Promise<boolean> {
    const today = new Date().toISOString().split('T')[0];
    
    const { error } = await supabase
      .from('user_score_aggregates')
      .upsert({
        user_id: userId,
        date: today,
        overall_score: score.overall,
        emotional_score: score.emotional,
        activity_score: score.activity,
        social_score: score.social,
        progress_score: score.progress,
      }, { onConflict: 'user_id,date' });

    return !error;
  },

  getDimensionLabel(dimension: ScoreDimension): string {
    const labels: Record<ScoreDimension, string> = {
      emotional: 'Bien-être émotionnel',
      activity: 'Activité',
      social: 'Social',
      progress: 'Progression',
    };
    return labels[dimension];
  },

  getScoreLevel(score: number): { level: string; color: string } {
    if (score >= 80) return { level: 'Excellent', color: 'text-green-500' };
    if (score >= 60) return { level: 'Bon', color: 'text-emerald-500' };
    if (score >= 40) return { level: 'Moyen', color: 'text-yellow-500' };
    if (score >= 20) return { level: 'À améliorer', color: 'text-orange-500' };
    return { level: 'Critique', color: 'text-red-500' };
  },
};

// ============================================================================
// COMPONENTS
// ============================================================================

export { TrendIndicator, ScoreBreakdown } from './components';
export type { TrendDirection, ScoreComponent } from './components';
