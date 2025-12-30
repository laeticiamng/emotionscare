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
  InsightGenerationContext,
  ActionItem
} from './types';

export class InsightsService {
  /**
   * Récupérer tous les insights d'un utilisateur
   */
  static async getUserInsights(
    userId: string,
    filters?: InsightFilters
  ): Promise<Insight[]> {
    try {
      let query = supabase
        .from('user_insights')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      // Apply status filter
      if (filters?.status?.length) {
        // Map our status to DB columns
        const statusConditions: string[] = [];
        if (filters.status.includes('applied')) {
          statusConditions.push('is_read.eq.true');
        }
        if (filters.status.includes('new')) {
          statusConditions.push('is_read.eq.false');
        }
      }

      // Apply type filter
      if (filters?.type?.length) {
        query = query.in('insight_type', filters.type);
      }

      // Apply priority filter
      if (filters?.priority?.length) {
        query = query.in('priority', filters.priority);
      }

      // Apply date filters
      if (filters?.dateFrom) {
        query = query.gte('created_at', filters.dateFrom);
      }
      if (filters?.dateTo) {
        query = query.lte('created_at', filters.dateTo);
      }

      const { data, error } = await query;

      if (error) {
        logger.error('[InsightsService] Get insights error:', error, 'MODULE');
        throw new Error(`Failed to get insights: ${error.message}`);
      }

      return (data || []).map(this.mapDbInsight);
    } catch (error) {
      logger.error('[InsightsService] Get insights failed:', error, 'MODULE');
      return [];
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
          action_items: insight.action_items || null,
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
      // Get the insight first
      const insight = await this.getInsightById(insightId);
      if (!insight || insight.user_id !== userId) {
        throw new Error('Insight not found or access denied');
      }

      // Update the insight in DB
      const { error } = await supabase
        .from('user_insights')
        .update({ 
          is_read: true,
          action_items: insight.action_items?.map(a => ({ ...a, completed: true })) || null
        })
        .eq('id', insightId);

      if (error) throw error;

      // Track the application
      await supabase.from('applied_recommendations').insert({
        user_id: userId,
        recommendation_id: insightId,
        title: insight.title,
        category: insight.insight_type,
        impact_level: insight.priority,
        metrics_before: {},
        applied_at: new Date().toISOString()
      }).then(() => {});

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
      const { error } = await supabase
        .from('user_insights')
        .update({ 
          is_read: true,
          expires_at: new Date().toISOString() // Mark as expired
        })
        .eq('id', insightId)
        .eq('user_id', userId);

      if (error) throw error;

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
   * Obtenir les statistiques des insights
   */
  static async getInsightStats(userId: string): Promise<InsightStats> {
    try {
      const insights = await this.getUserInsights(userId);

      const applied = insights.filter(i => 
        i.action_items?.some(a => a.completed) || i.is_read
      );
      const newInsights = insights.filter(i => !i.is_read);
      const dismissed = insights.filter(i => 
        i.expires_at && new Date(i.expires_at) < new Date() && i.is_read
      );

      // Count by type
      const byType: Record<InsightType, number> = {
        trend: 0,
        suggestion: 0,
        pattern: 0,
        goal: 0,
        warning: 0,
        achievement: 0,
        reminder: 0
      };
      insights.forEach(i => {
        if (byType[i.insight_type] !== undefined) {
          byType[i.insight_type]++;
        }
      });

      // Count by priority
      const byPriority: Record<InsightPriority, number> = {
        high: 0,
        medium: 0,
        low: 0
      };
      insights.forEach(i => {
        if (byPriority[i.priority] !== undefined) {
          byPriority[i.priority]++;
        }
      });

      // Calculate average impact
      const insightsWithImpact = insights.filter(i => i.impact_score);
      const averageImpact = insightsWithImpact.length > 0
        ? insightsWithImpact.reduce((sum, i) => sum + (i.impact_score || 0), 0) / insightsWithImpact.length
        : 0;

      return {
        total: insights.length,
        new: newInsights.length,
        applied: applied.length,
        dismissed: dismissed.length,
        applicationRate: insights.length > 0 ? Math.round((applied.length / insights.length) * 100) : 0,
        averageImpact: Math.round(averageImpact),
        byType,
        byPriority
      };
    } catch (error) {
      logger.error('[InsightsService] Get stats failed:', error, 'MODULE');
      return {
        total: 0,
        new: 0,
        applied: 0,
        dismissed: 0,
        applicationRate: 0,
        averageImpact: 0,
        byType: { trend: 0, suggestion: 0, pattern: 0, goal: 0, warning: 0, achievement: 0, reminder: 0 },
        byPriority: { high: 0, medium: 0, low: 0 }
      };
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
      
      if (avgScore > 7) {
        insights.push({
          user_id: context.userId,
          insight_type: 'trend',
          title: 'Tendance Positive Détectée',
          description: `Votre score émotionnel moyen de ${avgScore.toFixed(1)}/10 montre une belle progression. Continuez vos pratiques actuelles !`,
          priority: 'medium',
          category: 'emotional',
          impact_score: 75,
          action_items: [
            { id: '1', label: 'Voir les détails', type: 'navigate', target: '/app/trends', completed: false }
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
          action_items: [
            { id: '1', label: 'Respiration guidée', type: 'navigate', target: '/app/breathwork', completed: false },
            { id: '2', label: 'Parler au coach', type: 'navigate', target: '/app/coach', completed: false }
          ]
        });
      }
    }

    // Insight basé sur les sessions
    if (context.sessionData) {
      if (context.sessionData.breathingMinutes < 10) {
        insights.push({
          user_id: context.userId,
          insight_type: 'suggestion',
          title: 'Augmentez votre pratique respiratoire',
          description: 'Seulement quelques minutes de respiration cette semaine. 15 minutes par jour peuvent réduire le stress de 30%.',
          priority: 'medium',
          category: 'behavioral',
          impact_score: 65,
          action_items: [
            { id: '1', label: 'Commencer maintenant', type: 'navigate', target: '/app/breathwork', completed: false },
            { id: '2', label: 'Programmer un rappel', type: 'schedule', target: '09:00', completed: false }
          ]
        });
      }

      if (context.sessionData.breathingMinutes >= 60) {
        insights.push({
          user_id: context.userId,
          insight_type: 'achievement',
          title: 'Expert en Respiration',
          description: 'Plus d\'une heure de respiration cette semaine ! Votre régularité est impressionnante.',
          priority: 'low',
          category: 'progress',
          impact_score: 80
        });
      }
    }

    // Insight basé sur le streak
    if (context.streakDays && context.streakDays >= 7) {
      insights.push({
        user_id: context.userId,
        insight_type: 'achievement',
        title: `${context.streakDays} Jours Consécutifs !`,
        description: 'Votre régularité paie. Les habitudes quotidiennes sont le secret du bien-être durable.',
        priority: 'low',
        category: 'progress',
        impact_score: 70
      });
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
          action_items: [
            { id: '1', label: 'Écrire maintenant', type: 'navigate', target: '/app/journal/new', completed: false }
          ]
        });
      }
    }

    // Create insights in DB
    const createdInsights: Insight[] = [];
    for (const insightData of insights) {
      try {
        const created = await this.createInsight(insightData);
        createdInsights.push(created);
      } catch (err) {
        logger.warn('[InsightsService] Failed to create insight:', err, 'MODULE');
      }
    }

    return createdInsights;
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
      action_items: row.action_items as ActionItem[] | null,
      is_read: row.is_read ?? false,
      status: row.is_read ? 'read' : 'new',
      expires_at: row.expires_at,
      created_at: row.created_at
    };
  }
}
