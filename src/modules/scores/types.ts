/**
 * Module Scores - Types
 * Types pour le système de scores émotionnels et vibes
 */

import { z } from 'zod';

// ============================================================================
// USER SCORES
// ============================================================================

export const UserScore = z.object({
  user_id: z.string().uuid(),
  emotional_score: z.number().min(0).max(100),
  wellbeing_score: z.number().min(0).max(100),
  engagement_score: z.number().min(0).max(100),
  resilience_score: z.number().min(0).max(100).optional(),
  week_number: z.number().int().min(1).max(53),
  year: z.number().int().min(2024),
  created_at: z.string().datetime(),
  updated_at: z.string().datetime()
});
export type UserScore = z.infer<typeof UserScore>;

// ============================================================================
// SCORE COMPONENTS
// ============================================================================

export interface ScoreComponents {
  emotional: {
    score: number;
    trend: 'up' | 'down' | 'stable';
    factors: {
      mood_consistency: number;
      positive_emotions: number;
      negative_emotions: number;
      emotional_range: number;
    };
  };
  wellbeing: {
    score: number;
    trend: 'up' | 'down' | 'stable';
    factors: {
      activities_completed: number;
      sleep_quality: number;
      stress_level: number;
      self_care: number;
    };
  };
  engagement: {
    score: number;
    trend: 'up' | 'down' | 'stable';
    factors: {
      session_frequency: number;
      module_diversity: number;
      achievement_progress: number;
      community_participation: number;
    };
  };
}

// ============================================================================
// SCORE HISTORY
// ============================================================================

export const ScoreHistory = z.object({
  scores: z.array(UserScore),
  trend: z.enum(['up', 'down', 'stable']),
  average: z.number().min(0).max(100),
  change_percentage: z.number(),
  period_days: z.number().int().positive()
});
export type ScoreHistory = z.infer<typeof ScoreHistory>;

// ============================================================================
// VIBES
// ============================================================================

export const VibeType = z.enum([
  'energized',
  'calm',
  'creative',
  'focused',
  'social',
  'reflective',
  'playful',
  'determined',
  'peaceful',
  'anxious',
  'tired',
  'overwhelmed',
  'neutral',
  'joyful',
  'melancholic'
]);
export type VibeType = z.infer<typeof VibeType>;

export const VibeMetrics = z.object({
  current_vibe: VibeType,
  vibe_intensity: z.number().min(0).max(100),
  vibe_duration_hours: z.number().min(0),
  recent_activities: z.array(z.string()),
  contributing_factors: z.array(
    z.object({
      factor: z.string(),
      impact: z.number().min(-100).max(100)
    })
  ),
  recommended_modules: z.array(z.string()).optional()
});
export type VibeMetrics = z.infer<typeof VibeMetrics>;

export interface CurrentVibe {
  vibe: VibeType;
  intensity: number;
  emoji: string;
  color: string;
  description: string;
}

// ============================================================================
// WEEKLY METRICS
// ============================================================================

export interface WeeklyMetrics {
  week_number: number;
  year: number;
  emotional_score: number;
  wellbeing_score: number;
  engagement_score: number;
  total_sessions: number;
  total_minutes: number;
  modules_used: string[];
  achievements_unlocked: number;
  mood_range: {
    min: number;
    max: number;
    average: number;
  };
  dominant_emotions: Array<{
    emotion: string;
    percentage: number;
  }>;
  best_day: {
    date: string;
    score: number;
  };
  challenges_faced: number;
}

// ============================================================================
// SCORE CALCULATION
// ============================================================================

export interface ScoreCalculationInput {
  user_id: string;
  start_date: Date;
  end_date: Date;
  include_components?: boolean;
}

export interface ScoreCalculationResult {
  emotional_score: number;
  wellbeing_score: number;
  engagement_score: number;
  overall_score: number;
  components?: ScoreComponents;
  calculated_at: string;
}

// ============================================================================
// SCORE INSIGHTS
// ============================================================================

export interface ScoreInsight {
  type: 'positive' | 'negative' | 'neutral' | 'improvement' | 'concern';
  category: 'emotional' | 'wellbeing' | 'engagement' | 'overall';
  title: string;
  message: string;
  score_impact: number;
  recommendations: string[];
  priority: 'high' | 'medium' | 'low';
}

export interface ScoreInsights {
  insights: ScoreInsight[];
  overall_sentiment: 'positive' | 'negative' | 'neutral';
  key_strengths: string[];
  areas_for_improvement: string[];
  next_steps: string[];
}

// ============================================================================
// LEADERBOARD (Optionnel - Gamification)
// ============================================================================

export interface LeaderboardEntry {
  user_id: string;
  username: string;
  avatar_url?: string;
  total_score: number;
  rank: number;
  badge_count: number;
  achievement_count: number;
  streak_days: number;
}

export const LeaderboardPeriod = z.enum(['daily', 'weekly', 'monthly', 'all_time']);
export type LeaderboardPeriod = z.infer<typeof LeaderboardPeriod>;

// ============================================================================
// STATISTICS
// ============================================================================

export interface ScoreStatistics {
  user_id: string;
  total_score_entries: number;
  highest_emotional_score: number;
  highest_wellbeing_score: number;
  highest_engagement_score: number;
  average_emotional_score: number;
  average_wellbeing_score: number;
  average_engagement_score: number;
  best_week: {
    week_number: number;
    year: number;
    score: number;
  };
  improvement_rate: number; // Percentage per week
  consistency_rating: number; // 0-100
  last_updated: string;
}
