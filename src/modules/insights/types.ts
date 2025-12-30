/**
 * Module Insights - Types
 * Types pour les insights IA personnalisés
 */

import { z } from 'zod';

export const InsightType = z.enum([
  'trend',
  'suggestion',
  'pattern',
  'goal',
  'warning',
  'achievement',
  'reminder'
]);
export type InsightType = z.infer<typeof InsightType>;

export const InsightPriority = z.enum(['high', 'medium', 'low']);
export type InsightPriority = z.infer<typeof InsightPriority>;

export const InsightStatus = z.enum(['new', 'read', 'applied', 'dismissed', 'reminded', 'expired']);
export type InsightStatus = z.infer<typeof InsightStatus>;

export const InsightCategory = z.enum([
  'emotional',
  'behavioral',
  'therapeutic',
  'social',
  'progress',
  'health'
]);
export type InsightCategory = z.infer<typeof InsightCategory>;

export const ActionItem = z.object({
  id: z.string(),
  label: z.string(),
  type: z.enum(['navigate', 'schedule', 'goal', 'custom']),
  target: z.string().optional(),
  completed: z.boolean().default(false)
});
export type ActionItem = z.infer<typeof ActionItem>;

export const Insight = z.object({
  id: z.string().uuid(),
  user_id: z.string().uuid(),
  insight_type: InsightType,
  title: z.string(),
  description: z.string(),
  priority: InsightPriority,
  category: InsightCategory.optional(),
  action_items: z.array(ActionItem).nullable().optional(),
  is_read: z.boolean().default(false),
  status: InsightStatus.default('new'),
  impact_score: z.number().min(0).max(100).optional(),
  confidence: z.number().min(0).max(1).optional(),
  source_data: z.record(z.unknown()).nullable().optional(),
  expires_at: z.string().datetime().nullable().optional(),
  applied_at: z.string().datetime().nullable().optional(),
  dismissed_at: z.string().datetime().nullable().optional(),
  reminded_at: z.string().datetime().nullable().optional(),
  feedback_rating: z.number().min(1).max(5).nullable().optional(),
  feedback_text: z.string().nullable().optional(),
  created_at: z.string().datetime()
});
export type Insight = z.infer<typeof Insight>;

export interface CreateInsight {
  user_id: string;
  insight_type: InsightType;
  title: string;
  description: string;
  priority: InsightPriority;
  category?: InsightCategory;
  action_items?: ActionItem[];
  impact_score?: number;
  confidence?: number;
  source_data?: Record<string, unknown>;
  expires_at?: string;
}

export interface InsightStats {
  total: number;
  new: number;
  applied: number;
  dismissed: number;
  applicationRate: number;
  averageImpact: number;
  averageFeedback?: number;
  byType: Record<InsightType, number>;
  byPriority: Record<InsightPriority, number>;
  byCategory?: Record<InsightCategory, number>;
}

export interface InsightFilters {
  status?: InsightStatus[];
  type?: InsightType[];
  priority?: InsightPriority[];
  category?: InsightCategory[];
  dateFrom?: string;
  dateTo?: string;
}

export interface InsightPaginationOptions {
  page?: number;
  limit?: number;
  sortBy?: 'created_at' | 'priority' | 'impact_score';
  sortOrder?: 'asc' | 'desc';
}

export interface InsightGenerationContext {
  userId: string;
  recentEmotions?: Array<{ emotion: string; score: number; date: string }>;
  journalSummary?: { count: number; avgMood: number; themes: string[] };
  sessionData?: { breathingMinutes: number; meditationMinutes: number; musicSessions: number };
  streakDays?: number;
  goals?: Array<{ id: string; title: string; progress: number }>;
}

export interface InsightFeedback {
  user_id: string;
  insight_id: string;
  rating: number;
  feedback_text?: string;
  was_helpful?: boolean;
  action_taken?: string;
}

export interface InsightExportOptions {
  format: 'json' | 'csv';
  filters?: InsightFilters;
  includeArchived?: boolean;
}
