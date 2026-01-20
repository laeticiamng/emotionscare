/**
 * Service SEUIL
 * Régulation émotionnelle proactive - détection et accompagnement
 */

import { supabase } from '@/integrations/supabase/client';
import type { SeuilEvent, SeuilZone } from './types';

// ============================================================================
// TYPES ADDITIONNELS
// ============================================================================

export interface SeuilSession {
  id: string;
  user_id: string;
  event_id?: string;
  started_at: string;
  ended_at?: string;
  status: 'in_progress' | 'completed' | 'cancelled';
  strategies_used?: string[];
  effectiveness?: number;
  mood_after?: number;
  notes?: string;
}

export interface SeuilSettings {
  user_id: string;
  notifications_enabled: boolean;
  threshold_sensitivity: number;
  preferred_strategies: string[];
  quiet_hours_start?: string;
  quiet_hours_end?: string;
  updated_at: string;
}

export interface SeuilStats {
  totalEvents: number;
  totalSessions: number;
  averageThreshold: number;
  zoneDistribution: Record<string, number>;
  weeklyTrend: number;
  mostCommonActions: string[];
  effectiveStrategies: string[];
}

export interface SeuilPrediction {
  riskLevel: 'low' | 'medium' | 'high';
  confidence: number;
  suggestedActions: string[];
  reasoning: string;
}

// ============================================================================
// SERVICE
// ============================================================================

export class SeuilService {
  /**
   * Créer un événement SEUIL
   */
  static async createEvent(
    userId: string,
    data: {
      zone: SeuilZone;
      thresholdLevel: number;
      actionType?: string;
      notes?: string;
    }
  ): Promise<SeuilEvent> {
    const { data: event, error } = await supabase
      .from('seuil_events')
      .insert({
        user_id: userId,
        zone: data.zone,
        threshold_level: data.thresholdLevel,
        action_type: data.actionType,
        notes: data.notes,
        session_completed: false,
      })
      .select()
      .single();

    if (error) throw error;
    
    // Map to SeuilEvent interface
    return {
      id: event.id,
      userId: event.user_id,
      thresholdLevel: event.threshold_level,
      zone: event.zone,
      actionType: event.action_type,
      sessionCompleted: event.session_completed,
      notes: event.notes,
      createdAt: event.created_at,
      updatedAt: event.updated_at,
    };
  }

  /**
   * Récupérer les événements
   */
  static async fetchEvents(
    userId: string,
    options?: {
      limit?: number;
      startDate?: Date;
      endDate?: Date;
      zone?: SeuilZone;
    }
  ): Promise<SeuilEvent[]> {
    let query = supabase
      .from('seuil_events')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (options?.limit) {
      query = query.limit(options.limit);
    }

    if (options?.startDate) {
      query = query.gte('created_at', options.startDate.toISOString());
    }

    if (options?.endDate) {
      query = query.lte('created_at', options.endDate.toISOString());
    }

    if (options?.zone) {
      query = query.eq('zone', options.zone);
    }

    const { data, error } = await query;

    if (error) {
      if (error.code === '42P01') return []; // Table doesn't exist
      throw error;
    }
    
    // Map to SeuilEvent interface
    return (data || []).map(e => ({
      id: e.id,
      userId: e.user_id,
      thresholdLevel: e.threshold_level,
      zone: e.zone,
      actionType: e.action_type,
      actionTaken: e.action_taken,
      sessionCompleted: e.session_completed,
      notes: e.notes,
      createdAt: e.created_at,
      updatedAt: e.updated_at,
    }));
  }

  /**
   * Démarrer une session SEUIL
   */
  static async startSession(
    userId: string,
    eventId?: string
  ): Promise<SeuilSession> {
    const { data: session, error } = await supabase
      .from('seuil_sessions')
      .insert({
        user_id: userId,
        event_id: eventId,
        started_at: new Date().toISOString(),
        status: 'in_progress',
      })
      .select()
      .single();

    if (error) throw error;
    return session;
  }

  /**
   * Terminer une session SEUIL
   */
  static async completeSession(
    sessionId: string,
    data: {
      strategies_used: string[];
      effectiveness: number;
      mood_after: number;
      notes?: string;
    }
  ): Promise<SeuilSession> {
    const { data: session, error } = await supabase
      .from('seuil_sessions')
      .update({
        ended_at: new Date().toISOString(),
        status: 'completed',
        strategies_used: data.strategies_used,
        effectiveness: data.effectiveness,
        mood_after: data.mood_after,
        notes: data.notes,
      })
      .eq('id', sessionId)
      .select()
      .single();

    if (error) throw error;
    return session;
  }

  /**
   * Récupérer les statistiques
   */
  static async getStats(userId: string, days: number = 30): Promise<SeuilStats> {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    const events = await this.fetchEvents(userId, { startDate, limit: 1000 });

    if (events.length === 0) {
      return {
        totalEvents: 0,
        totalSessions: 0,
        averageThreshold: 0,
        zoneDistribution: { low: 0, intermediate: 0, critical: 0, closure: 0 },
        weeklyTrend: 0,
        mostCommonActions: [],
        effectiveStrategies: [],
      };
    }

    // Calculate zone distribution
    const zoneDistribution = events.reduce((acc, e) => {
      acc[e.zone] = (acc[e.zone] || 0) + 1;
      return acc;
    }, { low: 0, intermediate: 0, critical: 0, closure: 0 } as Record<string, number>);

    // Calculate average threshold
    const averageThreshold = events.reduce((sum, e) => sum + e.thresholdLevel, 0) / events.length;

    // Find most common actions
    const actionCounts: Record<string, number> = {};
    events.forEach(e => {
      if (e.actionType) {
        actionCounts[e.actionType] = (actionCounts[e.actionType] || 0) + 1;
      }
    });
    const mostCommonActions = Object.entries(actionCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([action]) => action);

    // Get session count
    const { count: totalSessions } = await supabase
      .from('seuil_sessions')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', userId)
      .gte('started_at', startDate.toISOString());

    // Calculate weekly trend (comparing this week to last week)
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
    const twoWeeksAgo = new Date();
    twoWeeksAgo.setDate(twoWeeksAgo.getDate() - 14);

    const thisWeekEvents = events.filter(e => new Date(e.createdAt) >= oneWeekAgo);
    const lastWeekEvents = events.filter(e => 
      new Date(e.createdAt) >= twoWeeksAgo && new Date(e.createdAt) < oneWeekAgo
    );

    const weeklyTrend = lastWeekEvents.length > 0
      ? ((thisWeekEvents.length - lastWeekEvents.length) / lastWeekEvents.length) * 100
      : 0;

    return {
      totalEvents: events.length,
      totalSessions: totalSessions || 0,
      averageThreshold: Math.round(averageThreshold * 10) / 10,
      zoneDistribution,
      weeklyTrend: Math.round(weeklyTrend),
      mostCommonActions,
      effectiveStrategies: [], // Would need session data analysis
    };
  }

  /**
   * Vérifier une valeur contre les seuils (via edge function)
   */
  static async checkThreshold(
    value: number,
    type: 'mood' | 'energy' | 'stress' | 'anxiety' | 'sleep' | 'custom'
  ): Promise<{ status: 'ok' | 'warning' | 'critical'; message: string }> {
    const { data, error } = await supabase.functions.invoke('seuil-api', {
      body: { action: 'check', value, type },
    });

    if (error) {
      return { status: 'ok', message: 'Vérification non disponible' };
    }

    return data;
  }

  /**
   * Récupérer les seuils configurés (via edge function)
   */
  static async getThresholds(): Promise<unknown[]> {
    const { data, error } = await supabase.functions.invoke('seuil-api', {
      body: { action: 'list' },
    });

    if (error) return [];
    return data?.thresholds || [];
  }

  /**
   * Prédire le risque de décrochage (via edge function)
   */
  static async predictRisk(userId: string): Promise<SeuilPrediction> {
    const { data, error } = await supabase.functions.invoke('seuil-predict', {
      body: { userId },
    });

    if (error) {
      // Return default low risk if function doesn't exist
      return {
        riskLevel: 'low',
        confidence: 0.5,
        suggestedActions: ['Continuer les pratiques habituelles'],
        reasoning: 'Prédiction non disponible',
      };
    }

    return data;
  }

  /**
   * Récupérer les paramètres SEUIL
   */
  static async getSettings(userId: string): Promise<SeuilSettings | null> {
    const { data, error } = await supabase
      .from('seuil_settings')
      .select('*')
      .eq('user_id', userId)
      .single();

    if (error) {
      if (error.code === 'PGRST116' || error.code === '42P01') return null;
      throw error;
    }
    return data;
  }

  /**
   * Sauvegarder les paramètres SEUIL
   */
  static async saveSettings(
    userId: string,
    settings: Partial<SeuilSettings>
  ): Promise<SeuilSettings> {
    const { data, error } = await supabase
      .from('seuil_settings')
      .upsert({
        user_id: userId,
        ...settings,
        updated_at: new Date().toISOString(),
      }, { onConflict: 'user_id' })
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  /**
   * Exporter les données SEUIL
   */
  static async exportData(
    userId: string,
    format: 'json' | 'csv' = 'json'
  ): Promise<string> {
    const events = await this.fetchEvents(userId, { limit: 10000 });
    const stats = await this.getStats(userId, 365);

    const exportData = {
      exportedAt: new Date().toISOString(),
      stats,
      events,
    };

    if (format === 'json') {
      return JSON.stringify(exportData, null, 2);
    }

    // CSV format
    const headers = ['date', 'zone', 'thresholdLevel', 'actionType', 'notes'];
    const rows = events.map(e => [
      e.createdAt,
      e.zone,
      e.thresholdLevel,
      e.actionType || '',
      e.notes || '',
    ]);

    return [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
  }
}

export const seuilService = new SeuilService();
export default SeuilService;
