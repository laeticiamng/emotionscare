/**
 * Module Insights - Service
 * Service pour gérer les insights IA personnalisés
 */

import { supabase } from '@/integrations/supabase/client';
import { logger } from '@/lib/logger';
import type {
  Insight,
  CreateInsight,
  InsightStats,
  InsightFilters,
  InsightType,
  InsightPriority,
  InsightCategory,
  InsightGenerationContext,
  ActionItem,
  InsightFeedback
} from './types';

export class InsightsService {
  /**
   * Récupérer tous les insights d'un utilisateur avec pagination
   */
  static async getUserInsights(
    userId: string,
    filters?: InsightFilters,
    options?: { page?: number; limit?: number; sortBy?: string; sortOrder?: 'asc' | 'desc' }
  ): Promise<{ insights: Insight[]; total: number }> {
    try {
      const page = options?.page || 1;
      const limit = options?.limit || 20;
      const offset = (page - 1) * limit;
      const sortBy = options?.sortBy || 'created_at';
      const sortOrder = options?.sortOrder || 'desc';

      let query = supabase
        .from('user_insights')
        .select('*', { count: 'exact' })
        .eq('user_id', userId)
        .order(sortBy, { ascending: sortOrder === 'asc' })
        .range(offset, offset + limit - 1);

      // Apply type filter
      if (filters?.type?.length) {
        query = query.in('insight_type', filters.type);
      }

      // Apply priority filter
      if (filters?.priority?.length) {
        query = query.in('priority', filters.priority);
      }

      // Apply category filter
      if (filters?.category?.length) {
        query = query.in('category', filters.category);
      }

      // Apply status filter
      if (filters?.status?.length) {
        if (filters.status.includes('new') && !filters.status.includes('read')) {
          query = query.eq('is_read', false);
        } else if (filters.status.includes('read') && !filters.status.includes('new')) {
          query = query.eq('is_read', true);
        }
        if (filters.status.includes('applied')) {
          query = query.not('applied_at', 'is', null);
        }
        if (filters.status.includes('dismissed')) {
          query = query.not('dismissed_at', 'is', null);
        }
      }

      // Apply date filters
      if (filters?.dateFrom) {
        query = query.gte('created_at', filters.dateFrom);
      }
      if (filters?.dateTo) {
        query = query.lte('created_at', filters.dateTo);
      }

      const { data, error, count } = await query;

      if (error) {
        logger.error('[InsightsService] Get insights error:', error, 'MODULE');
        throw new Error(`Failed to get insights: ${error.message}`);
      }

      return {
        insights: (data || []).map(this.mapDbInsight),
        total: count || 0
      };
    } catch (error) {
      logger.error('[InsightsService] Get insights failed:', error, 'MODULE');
      return { insights: [], total: 0 };
    }
  }

  /**
   * Récupérer un insight par ID
   */
  static async getInsightById(insightId: string): Promise<Insight | null> {
    try {
      const { data, error } = await supabase
        .from('user_insights')
        .select('*')
        .eq('id', insightId)
        .single();

      if (error) {
        if (error.code === 'PGRST116') return null;
        throw error;
      }

      return this.mapDbInsight(data);
    } catch (error) {
      logger.error('[InsightsService] Get insight by ID failed:', error, 'MODULE');
      return null;
    }
  }

  /**
   * Créer un nouvel insight
   */
  static async createInsight(insight: CreateInsight): Promise<Insight> {
    try {
      const { data, error } = await supabase
        .from('user_insights')
        .insert({
          user_id: insight.user_id,
          insight_type: insight.insight_type,
          title: insight.title,
          description: insight.description,
          priority: insight.priority,
          category: insight.category || 'emotional',
          action_items: insight.action_items || null,
          impact_score: insight.impact_score || 50,
          confidence: insight.confidence || 0.75,
          source_data: insight.source_data || null,
          expires_at: insight.expires_at || null,
          is_read: false,
          created_at: new Date().toISOString()
        })
        .select()
        .single();

      if (error) {
        throw error;
      }

      logger.info('[InsightsService] Insight created', { insightId: data.id }, 'MODULE');
      return this.mapDbInsight(data);
    } catch (error) {
      logger.error('[InsightsService] Create insight failed:', error, 'MODULE');
      throw error;
    }
  }

  /**
   * Marquer un insight comme lu
   */
  static async markAsRead(insightId: string): Promise<void> {
    try {
      const { error } = await supabase
        .from('user_insights')
        .update({ is_read: true })
        .eq('id', insightId);

      if (error) throw error;
    } catch (error) {
      logger.error('[InsightsService] Mark as read failed:', error, 'MODULE');
      throw error;
    }
  }

  /**
   * Appliquer un insight
   */
  static async applyInsight(insightId: string, userId: string): Promise<void> {
    try {
      const insight = await this.getInsightById(insightId);
      if (!insight || insight.user_id !== userId) {
        throw new Error('Insight not found or access denied');
      }

      const now = new Date().toISOString();
      
      const { error } = await supabase
        .from('user_insights')
        .update({ 
          is_read: true,
          applied_at: now,
          action_items: insight.action_items?.map(a => ({ ...a, completed: true })) || null
        })
        .eq('id', insightId);

      if (error) throw error;

      // Track the application
      await supabase.from('applied_recommendations').insert({
        user_id: userId,
        recommendation_id: insightId,
        title: insight.title,
        category: insight.category || insight.insight_type,
        impact_level: insight.priority,
        metrics_before: {},
        applied_at: now
      });

      // Invalidate stats cache
      await this.invalidateStatsCache(userId);

      logger.info('[InsightsService] Insight applied', { insightId }, 'MODULE');
    } catch (error) {
      logger.error('[InsightsService] Apply insight failed:', error, 'MODULE');
      throw error;
    }
  }

  /**
   * Ignorer un insight
   */
  static async dismissInsight(insightId: string, userId: string): Promise<void> {
    try {
      const now = new Date().toISOString();
      
      const { error } = await supabase
        .from('user_insights')
        .update({ 
          is_read: true,
          dismissed_at: now,
          expires_at: now
        })
        .eq('id', insightId)
        .eq('user_id', userId);

      if (error) throw error;

      await this.invalidateStatsCache(userId);
      logger.info('[InsightsService] Insight dismissed', { insightId }, 'MODULE');
    } catch (error) {
      logger.error('[InsightsService] Dismiss insight failed:', error, 'MODULE');
      throw error;
    }
  }

  /**
   * Programmer un rappel pour un insight
   */
  static async scheduleReminder(insightId: string, userId: string, remindAt: Date): Promise<void> {
    try {
      // Update insight with reminder date
      await supabase
        .from('user_insights')
        .update({ reminded_at: remindAt.toISOString() })
        .eq('id', insightId)
        .eq('user_id', userId);

      // Create a notification for later
      await supabase.from('notifications').insert({
        user_id: userId,
        category: 'reminder',
        priority: 'medium',
        title: 'Rappel: Insight à revoir',
        message: 'Vous aviez demandé un rappel pour un insight IA.',
        action_url: `/app/insights?highlight=${insightId}`,
        created_at: new Date().toISOString()
      });

      logger.info('[InsightsService] Reminder scheduled', { insightId, remindAt }, 'MODULE');
    } catch (error) {
      logger.error('[InsightsService] Schedule reminder failed:', error, 'MODULE');
      throw error;
    }
  }

  /**
   * Soumettre un feedback pour un insight
   */
  static async submitFeedback(feedback: InsightFeedback): Promise<void> {
    try {
      // Insert into feedback table
      const { error: feedbackError } = await supabase
        .from('insight_feedback')
        .insert({
          user_id: feedback.user_id,
          insight_id: feedback.insight_id,
          rating: feedback.rating,
          feedback_text: feedback.feedback_text,
          was_helpful: feedback.was_helpful,
          action_taken: feedback.action_taken,
          created_at: new Date().toISOString()
        });

      if (feedbackError) throw feedbackError;

      // Update the insight with feedback
      await supabase
        .from('user_insights')
        .update({
          feedback_rating: feedback.rating,
          feedback_text: feedback.feedback_text
        })
        .eq('id', feedback.insight_id);

      logger.info('[InsightsService] Feedback submitted', { insightId: feedback.insight_id }, 'MODULE');
    } catch (error) {
      logger.error('[InsightsService] Submit feedback failed:', error, 'MODULE');
      throw error;
    }
  }

  /**
   * Obtenir les statistiques des insights (avec cache)
   */
  static async getInsightStats(userId: string, forceRefresh = false): Promise<InsightStats> {
    try {
      // Check cache first
      if (!forceRefresh) {
        const { data: cache } = await supabase
          .from('insight_stats_cache')
          .select('stats_data, last_updated')
          .eq('user_id', userId)
          .single();

        if (cache) {
          const cacheAge = Date.now() - new Date(cache.last_updated).getTime();
          const CACHE_TTL = 5 * 60 * 1000; // 5 minutes
          
          if (cacheAge < CACHE_TTL) {
            return cache.stats_data as InsightStats;
          }
        }
      }

      // Calculate fresh stats
      const { insights } = await this.getUserInsights(userId, undefined, { limit: 1000 });

      const applied = insights.filter(i => i.applied_at);
      const newInsights = insights.filter(i => !i.is_read);
      const dismissed = insights.filter(i => i.dismissed_at);
      const withFeedback = insights.filter(i => i.feedback_rating);

      // Count by type
      const byType: Record<InsightType, number> = {
        trend: 0, suggestion: 0, pattern: 0, goal: 0,
        warning: 0, achievement: 0, reminder: 0
      };
      insights.forEach(i => {
        if (byType[i.insight_type] !== undefined) {
          byType[i.insight_type]++;
        }
      });

      // Count by priority
      const byPriority: Record<InsightPriority, number> = {
        high: 0, medium: 0, low: 0
      };
      insights.forEach(i => {
        if (byPriority[i.priority] !== undefined) {
          byPriority[i.priority]++;
        }
      });

      // Count by category
      const byCategory: Record<InsightCategory, number> = {
        emotional: 0, behavioral: 0, therapeutic: 0,
        social: 0, progress: 0, health: 0
      };
      insights.forEach(i => {
        const cat = i.category || 'emotional';
        if (byCategory[cat as InsightCategory] !== undefined) {
          byCategory[cat as InsightCategory]++;
        }
      });

      // Calculate averages
      const insightsWithImpact = insights.filter(i => i.impact_score);
      const averageImpact = insightsWithImpact.length > 0
        ? insightsWithImpact.reduce((sum, i) => sum + (i.impact_score || 0), 0) / insightsWithImpact.length
        : 0;

      const averageFeedback = withFeedback.length > 0
        ? withFeedback.reduce((sum, i) => sum + (i.feedback_rating || 0), 0) / withFeedback.length
        : 0;

      const stats: InsightStats = {
        total: insights.length,
        new: newInsights.length,
        applied: applied.length,
        dismissed: dismissed.length,
        applicationRate: insights.length > 0 ? Math.round((applied.length / insights.length) * 100) : 0,
        averageImpact: Math.round(averageImpact),
        averageFeedback: Math.round(averageFeedback * 10) / 10,
        byType,
        byPriority,
        byCategory
      };

      // Update cache
      await supabase
        .from('insight_stats_cache')
        .upsert({
          user_id: userId,
          stats_data: stats,
          last_updated: new Date().toISOString()
        }, { onConflict: 'user_id' });

      return stats;
    } catch (error) {
      logger.error('[InsightsService] Get stats failed:', error, 'MODULE');
      return this.getEmptyStats();
    }
  }

  /**
   * Invalider le cache des stats
   */
  private static async invalidateStatsCache(userId: string): Promise<void> {
    try {
      await supabase
        .from('insight_stats_cache')
        .delete()
        .eq('user_id', userId);
    } catch (error) {
      logger.warn('[InsightsService] Cache invalidation failed:', error, 'MODULE');
    }
  }

  /**
   * Exporter les insights
   */
  static async exportInsights(userId: string, format: 'json' | 'csv'): Promise<string> {
    try {
      const { insights } = await this.getUserInsights(userId, undefined, { limit: 1000 });

      if (format === 'csv') {
        const headers = ['ID', 'Type', 'Titre', 'Description', 'Priorité', 'Catégorie', 'Impact', 'Créé le', 'Statut'];
        const rows = insights.map(i => [
          i.id,
          i.insight_type,
          `"${i.title.replace(/"/g, '""')}"`,
          `"${i.description.replace(/"/g, '""')}"`,
          i.priority,
          i.category || '',
          i.impact_score || '',
          new Date(i.created_at).toLocaleDateString('fr-FR'),
          i.applied_at ? 'Appliqué' : i.dismissed_at ? 'Ignoré' : i.is_read ? 'Lu' : 'Nouveau'
        ]);
        return [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
      }

      return JSON.stringify(insights, null, 2);
    } catch (error) {
      logger.error('[InsightsService] Export failed:', error, 'MODULE');
      throw error;
    }
  }

  /**
   * Générer des insights basés sur le contexte utilisateur
   */
  static async generateInsights(context: InsightGenerationContext): Promise<Insight[]> {
    const insights: CreateInsight[] = [];

    // Insight basé sur les émotions récentes
    if (context.recentEmotions?.length) {
      const avgScore = context.recentEmotions.reduce((sum, e) => sum + e.score, 0) / context.recentEmotions.length;
      const dominantEmotion = this.getDominantEmotion(context.recentEmotions);
      
      if (avgScore > 7) {
        insights.push({
          user_id: context.userId,
          insight_type: 'trend',
          title: 'Tendance Positive Détectée',
          description: `Votre score émotionnel moyen de ${avgScore.toFixed(1)}/10 montre une belle progression. Continuez vos pratiques actuelles !`,
          priority: 'medium',
          category: 'emotional',
          impact_score: 75,
          confidence: 0.85,
          source_data: { avgScore, dominantEmotion, sampleSize: context.recentEmotions.length },
          action_items: [
            { id: '1', label: 'Voir les tendances', type: 'navigate', target: '/app/trends', completed: false }
          ]
        });
      } else if (avgScore < 5) {
        insights.push({
          user_id: context.userId,
          insight_type: 'suggestion',
          title: 'Besoin de Soutien Détecté',
          description: 'Nous avons remarqué une baisse récente. Essayez une session de respiration ou parlez au coach IA.',
          priority: 'high',
          category: 'therapeutic',
          impact_score: 90,
          confidence: 0.9,
          source_data: { avgScore, dominantEmotion, trend: 'declining' },
          action_items: [
            { id: '1', label: 'Respiration guidée', type: 'navigate', target: '/app/breathwork', completed: false },
            { id: '2', label: 'Parler au coach', type: 'navigate', target: '/app/coach', completed: false }
          ]
        });
      }

      // Pattern detection
      if (dominantEmotion && context.recentEmotions.length >= 5) {
        const emotionFrequency = context.recentEmotions.filter(e => e.emotion === dominantEmotion).length;
        if (emotionFrequency >= 3) {
          insights.push({
            user_id: context.userId,
            insight_type: 'pattern',
            title: `Pattern émotionnel: ${dominantEmotion}`,
            description: `L'émotion "${dominantEmotion}" est récurrente dans vos scans récents. Explorez ce que cela peut signifier.`,
            priority: 'low',
            category: 'emotional',
            impact_score: 55,
            confidence: 0.7,
            source_data: { emotion: dominantEmotion, frequency: emotionFrequency },
            action_items: [
              { id: '1', label: 'Écrire dans le journal', type: 'navigate', target: '/app/journal/new', completed: false }
            ]
          });
        }
      }
    }

    // Insight basé sur les sessions
    if (context.sessionData) {
      const { breathingMinutes, meditationMinutes, musicSessions } = context.sessionData;
      const totalMinutes = breathingMinutes + meditationMinutes;

      if (breathingMinutes < 10 && meditationMinutes < 10) {
        insights.push({
          user_id: context.userId,
          insight_type: 'suggestion',
          title: 'Augmentez votre pratique quotidienne',
          description: `Seulement ${totalMinutes} minutes de pratique cette semaine. 15 minutes par jour peuvent réduire le stress de 30%.`,
          priority: 'medium',
          category: 'behavioral',
          impact_score: 65,
          confidence: 0.8,
          source_data: { breathingMinutes, meditationMinutes, totalMinutes },
          action_items: [
            { id: '1', label: 'Respiration 5 min', type: 'navigate', target: '/app/breathwork', completed: false },
            { id: '2', label: 'Programmer rappel', type: 'schedule', target: '09:00', completed: false }
          ]
        });
      }

      if (breathingMinutes >= 60) {
        insights.push({
          user_id: context.userId,
          insight_type: 'achievement',
          title: 'Expert en Respiration',
          description: `Plus de ${breathingMinutes} minutes de respiration cette semaine ! Votre régularité est impressionnante.`,
          priority: 'low',
          category: 'progress',
          impact_score: 80,
          confidence: 1
        });
      }

      if (musicSessions >= 5) {
        insights.push({
          user_id: context.userId,
          insight_type: 'achievement',
          title: 'Mélomane de la Semaine',
          description: `${musicSessions} sessions musicales cette semaine. La musique améliore votre bien-être.`,
          priority: 'low',
          category: 'progress',
          impact_score: 70,
          confidence: 1
        });
      }
    }

    // Insight basé sur le streak
    if (context.streakDays) {
      if (context.streakDays >= 30) {
        insights.push({
          user_id: context.userId,
          insight_type: 'achievement',
          title: '30 Jours de Régularité !',
          description: 'Un mois complet de pratique quotidienne. Vous avez créé une habitude durable.',
          priority: 'medium',
          category: 'progress',
          impact_score: 95,
          confidence: 1
        });
      } else if (context.streakDays >= 7) {
        insights.push({
          user_id: context.userId,
          insight_type: 'achievement',
          title: `${context.streakDays} Jours Consécutifs !`,
          description: 'Votre régularité paie. Les habitudes quotidiennes sont le secret du bien-être durable.',
          priority: 'low',
          category: 'progress',
          impact_score: 70,
          confidence: 1
        });
      }
    }

    // Insight basé sur le journal
    if (context.journalSummary) {
      if (context.journalSummary.count === 0) {
        insights.push({
          user_id: context.userId,
          insight_type: 'reminder',
          title: 'Votre Journal vous Attend',
          description: 'L\'écriture aide à clarifier les pensées. Prenez 5 minutes pour noter vos réflexions.',
          priority: 'low',
          category: 'behavioral',
          impact_score: 50,
          confidence: 0.6,
          action_items: [
            { id: '1', label: 'Écrire maintenant', type: 'navigate', target: '/app/journal/new', completed: false }
          ]
        });
      } else if (context.journalSummary.count >= 7) {
        insights.push({
          user_id: context.userId,
          insight_type: 'achievement',
          title: 'Écrivain Régulier',
          description: `${context.journalSummary.count} entrées de journal cette semaine. L'introspection régulière améliore la conscience de soi.`,
          priority: 'low',
          category: 'progress',
          impact_score: 75,
          confidence: 1
        });
      }
    }

    // Goals progress insights
    if (context.goals?.length) {
      const almostComplete = context.goals.filter(g => g.progress >= 80 && g.progress < 100);
      const stalled = context.goals.filter(g => g.progress < 20);

      almostComplete.forEach(goal => {
        insights.push({
          user_id: context.userId,
          insight_type: 'goal',
          title: `Objectif presque atteint: ${goal.title}`,
          description: `Plus que ${100 - goal.progress}% ! Un dernier effort pour atteindre votre objectif.`,
          priority: 'high',
          category: 'progress',
          impact_score: 85,
          confidence: 0.95,
          source_data: { goalId: goal.id, progress: goal.progress },
          action_items: [
            { id: '1', label: 'Voir l\'objectif', type: 'navigate', target: `/app/goals/${goal.id}`, completed: false }
          ]
        });
      });

      if (stalled.length > 0) {
        insights.push({
          user_id: context.userId,
          insight_type: 'warning',
          title: 'Objectifs en attente',
          description: `${stalled.length} objectif(s) n'ont pas progressé récemment. Besoin de les réviser ?`,
          priority: 'medium',
          category: 'behavioral',
          impact_score: 60,
          confidence: 0.75,
          source_data: { stalledGoals: stalled.map(g => g.id) },
          action_items: [
            { id: '1', label: 'Réviser mes objectifs', type: 'navigate', target: '/app/goals', completed: false }
          ]
        });
      }
    }

    // Avoid duplicates - check existing insights
    const { insights: existingInsights } = await this.getUserInsights(context.userId, undefined, { limit: 50 });
    const recentTitles = new Set(
      existingInsights
        .filter(i => {
          const created = new Date(i.created_at);
          const dayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
          return created > dayAgo;
        })
        .map(i => i.title)
    );

    const uniqueInsights = insights.filter(i => !recentTitles.has(i.title));

    // Create insights in DB
    const createdInsights: Insight[] = [];
    for (const insightData of uniqueInsights) {
      try {
        const created = await this.createInsight(insightData);
        createdInsights.push(created);
      } catch (err) {
        logger.warn('[InsightsService] Failed to create insight:', err, 'MODULE');
      }
    }

    // Invalidate stats cache
    if (createdInsights.length > 0) {
      await this.invalidateStatsCache(context.userId);
    }

    return createdInsights;
  }

  /**
   * Get dominant emotion from recent scans
   */
  private static getDominantEmotion(emotions: Array<{ emotion: string; score: number }>): string | null {
    if (!emotions.length) return null;
    
    const counts: Record<string, number> = {};
    emotions.forEach(e => {
      counts[e.emotion] = (counts[e.emotion] || 0) + 1;
    });

    let maxCount = 0;
    let dominant: string | null = null;
    Object.entries(counts).forEach(([emotion, count]) => {
      if (count > maxCount) {
        maxCount = count;
        dominant = emotion;
      }
    });

    return dominant;
  }

  /**
   * Get empty stats object
   */
  private static getEmptyStats(): InsightStats {
    return {
      total: 0,
      new: 0,
      applied: 0,
      dismissed: 0,
      applicationRate: 0,
      averageImpact: 0,
      averageFeedback: 0,
      byType: { trend: 0, suggestion: 0, pattern: 0, goal: 0, warning: 0, achievement: 0, reminder: 0 },
      byPriority: { high: 0, medium: 0, low: 0 },
      byCategory: { emotional: 0, behavioral: 0, therapeutic: 0, social: 0, progress: 0, health: 0 }
    };
  }

  /**
   * Map database row to Insight type
   */
  private static mapDbInsight(row: any): Insight {
    return {
      id: row.id,
      user_id: row.user_id,
      insight_type: row.insight_type as InsightType,
      title: row.title,
      description: row.description,
      priority: row.priority as InsightPriority,
      category: row.category as InsightCategory || 'emotional',
      action_items: row.action_items as ActionItem[] | null,
      is_read: row.is_read ?? false,
      status: row.applied_at ? 'applied' : row.dismissed_at ? 'dismissed' : row.reminded_at ? 'reminded' : row.is_read ? 'read' : 'new',
      impact_score: row.impact_score ?? 50,
      confidence: row.confidence ?? 0.75,
      source_data: row.source_data,
      expires_at: row.expires_at,
      applied_at: row.applied_at,
      dismissed_at: row.dismissed_at,
      reminded_at: row.reminded_at,
      feedback_rating: row.feedback_rating,
      feedback_text: row.feedback_text,
      created_at: row.created_at
    };
  }
}
