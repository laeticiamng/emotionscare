/**
 * Module Interconnect Service
 * Service central pour l'interconnexion de tous les modules via Supabase
 */

import { supabase } from '@/integrations/supabase/client';
import { logger } from '@/lib/logger';

// ============================================================================
// TYPES
// ============================================================================

export type SessionType = 
  | 'meditation' | 'breathing' | 'music_therapy' | 'journal' | 'coach'
  | 'emotion_scan' | 'vr_galaxy' | 'ar_filter' | 'mood_mixer' | 'nyvee'
  | 'bubble_beat' | 'flash_glow' | 'story_synth' | 'bounce_back' | 'community';

export type ConnectionType = 'triggers' | 'recommends' | 'shares_data' | 'unlocks' | 'enhances';

export interface UnifiedSession {
  id: string;
  user_id: string;
  session_type: SessionType;
  source_id?: string;
  started_at: string;
  ended_at?: string;
  duration_seconds: number;
  mood_before?: number;
  mood_after?: number;
  mood_delta?: number;
  xp_earned: number;
  achievements_unlocked: string[];
  metadata: Record<string, unknown>;
  created_at: string;
}

export interface SessionStats {
  session_type: SessionType;
  total_sessions: number;
  total_duration: number;
  avg_duration: number;
  avg_mood_impact: number;
  total_xp: number;
  last_session_at: string;
  sessions_last_7_days: number;
  sessions_last_30_days: number;
}

export interface ModuleConnection {
  id: string;
  source_module: string;
  target_module: string;
  connection_type: ConnectionType;
  weight: number;
  metadata: Record<string, unknown>;
}

export interface ModuleRecommendation {
  module: string;
  reason: string;
  priority: number;
  estimatedImpact: number;
}

export interface CrossModuleInsights {
  totalSessions: number;
  totalDuration: number;
  averageMoodImpact: number;
  mostUsedModules: Array<{ module: string; count: number }>;
  recommendedModules: ModuleRecommendation[];
  achievementsProgress: number;
  weeklyGoalProgress: number;
}

// ============================================================================
// SERVICE
// ============================================================================

class ModuleInterconnectService {
  /**
   * Créer une session unifiée
   */
  async createSession(session: Omit<UnifiedSession, 'id' | 'created_at'>): Promise<UnifiedSession> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Non authentifié');

    const { data, error } = await supabase
      .from('sessions')
      .insert({
        user_id: user.id,
        session_type: session.session_type,
        source_id: session.source_id,
        started_at: session.started_at,
        ended_at: session.ended_at,
        duration_seconds: session.duration_seconds,
        mood_before: session.mood_before,
        mood_after: session.mood_after,
        xp_earned: session.xp_earned,
        achievements_unlocked: session.achievements_unlocked,
        metadata: session.metadata
      })
      .select()
      .single();

    if (error) {
      logger.error('[ModuleInterconnect] Create session error:', error, 'MODULE');
      throw error;
    }

    return data as UnifiedSession;
  }

  /**
   * Récupérer toutes les sessions de l'utilisateur
   */
  async getUserSessions(options?: {
    types?: SessionType[];
    limit?: number;
    offset?: number;
    fromDate?: string;
  }): Promise<UnifiedSession[]> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return [];

    let query = supabase
      .from('sessions')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (options?.types?.length) {
      query = query.in('session_type', options.types);
    }
    if (options?.fromDate) {
      query = query.gte('created_at', options.fromDate);
    }
    if (options?.limit) {
      query = query.limit(options.limit);
    }
    if (options?.offset) {
      query = query.range(options.offset, options.offset + (options.limit || 50) - 1);
    }

    const { data, error } = await query;

    if (error) {
      logger.error('[ModuleInterconnect] Get sessions error:', error, 'MODULE');
      return [];
    }

    return (data || []) as UnifiedSession[];
  }

  /**
   * Récupérer les statistiques par module
   */
  async getSessionStats(): Promise<SessionStats[]> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return [];

    const { data, error } = await supabase
      .from('user_session_stats')
      .select('*')
      .eq('user_id', user.id);

    if (error) {
      logger.error('[ModuleInterconnect] Get stats error:', error, 'MODULE');
      return [];
    }

    return (data || []) as SessionStats[];
  }

  /**
   * Récupérer les connexions entre modules
   */
  async getModuleConnections(sourceModule?: string): Promise<ModuleConnection[]> {
    let query = supabase.from('module_connections').select('*');

    if (sourceModule) {
      query = query.eq('source_module', sourceModule);
    }

    const { data, error } = await query.order('weight', { ascending: false });

    if (error) {
      logger.error('[ModuleInterconnect] Get connections error:', error, 'MODULE');
      return [];
    }

    return (data || []) as ModuleConnection[];
  }

  /**
   * Obtenir des recommandations de modules basées sur l'activité
   */
  async getModuleRecommendations(): Promise<ModuleRecommendation[]> {
    const stats = await this.getSessionStats();
    const connections = await this.getModuleConnections();
    
    // Analyser les modules les plus utilisés
    const moduleUsage = stats.reduce((acc, s) => {
      acc[s.session_type] = (acc[s.session_type] || 0) + s.total_sessions;
      return acc;
    }, {} as Record<string, number>);

    const recommendations: ModuleRecommendation[] = [];

    // Pour chaque module utilisé, trouver les modules recommandés
    for (const [module, count] of Object.entries(moduleUsage)) {
      const relatedConnections = connections.filter(
        c => c.source_module === module && c.connection_type === 'recommends'
      );

      for (const conn of relatedConnections) {
        // Ne pas recommander les modules déjà très utilisés
        const targetUsage = moduleUsage[conn.target_module] || 0;
        if (targetUsage < count * 0.5) {
          recommendations.push({
            module: conn.target_module,
            reason: `Basé sur votre utilisation de ${module}`,
            priority: conn.weight * count,
            estimatedImpact: conn.weight * 10
          });
        }
      }
    }

    // Trier par priorité et dédupliquer
    return recommendations
      .sort((a, b) => b.priority - a.priority)
      .filter((rec, idx, arr) => 
        arr.findIndex(r => r.module === rec.module) === idx
      )
      .slice(0, 5);
  }

  /**
   * Obtenir des insights cross-module
   */
  async getCrossModuleInsights(): Promise<CrossModuleInsights> {
    const stats = await this.getSessionStats();
    const recommendations = await this.getModuleRecommendations();

    const totalSessions = stats.reduce((sum, s) => sum + s.total_sessions, 0);
    const totalDuration = stats.reduce((sum, s) => sum + s.total_duration, 0);
    
    const moodImpacts = stats.filter(s => s.avg_mood_impact !== null);
    const averageMoodImpact = moodImpacts.length > 0
      ? moodImpacts.reduce((sum, s) => sum + s.avg_mood_impact, 0) / moodImpacts.length
      : 0;

    const mostUsedModules = stats
      .sort((a, b) => b.total_sessions - a.total_sessions)
      .slice(0, 5)
      .map(s => ({ module: s.session_type, count: s.total_sessions }));

    // Calculer la progression des achievements
    const { data: achievements } = await supabase
      .from('user_achievement_progress')
      .select('progress')
      .eq('unlocked', false);
    
    const avgProgress = achievements?.length 
      ? achievements.reduce((sum, a) => sum + (a.progress || 0), 0) / achievements.length
      : 0;

    // Calculer la progression hebdomadaire (sessions dans les 7 derniers jours vs objectif de 7)
    const weeklyGoalProgress = Math.min(100, 
      (stats.reduce((sum, s) => sum + s.sessions_last_7_days, 0) / 7) * 100
    );

    return {
      totalSessions,
      totalDuration,
      averageMoodImpact: Math.round(averageMoodImpact),
      mostUsedModules,
      recommendedModules: recommendations,
      achievementsProgress: Math.round(avgProgress),
      weeklyGoalProgress: Math.round(weeklyGoalProgress)
    };
  }

  /**
   * Notifier les modules connectés d'un événement
   */
  async notifyConnectedModules(
    sourceModule: string, 
    eventType: ConnectionType,
    eventData: Record<string, unknown>
  ): Promise<void> {
    const connections = await this.getModuleConnections(sourceModule);
    const relevantConnections = connections.filter(c => c.connection_type === eventType);

    for (const conn of relevantConnections) {
      logger.info(
        `[ModuleInterconnect] Notifying ${conn.target_module} from ${sourceModule}`,
        { eventType, weight: conn.weight },
        'MODULE'
      );

      // Émettre un événement custom pour les modules qui écoutent
      window.dispatchEvent(new CustomEvent('module-event', {
        detail: {
          source: sourceModule,
          target: conn.target_module,
          type: eventType,
          weight: conn.weight,
          data: eventData
        }
      }));
    }
  }

  /**
   * Synchroniser une session depuis un module spécifique
   */
  async syncFromModule(
    moduleType: SessionType,
    sourceId: string,
    data: {
      duration_seconds?: number;
      mood_before?: number;
      mood_after?: number;
      xp_earned?: number;
      metadata?: Record<string, unknown>;
    }
  ): Promise<UnifiedSession | null> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return null;

    // Vérifier si la session existe déjà
    const { data: existing } = await supabase
      .from('sessions')
      .select('id')
      .eq('source_id', sourceId)
      .eq('session_type', moduleType)
      .single();

    if (existing) {
      // Mettre à jour
      const { data: updated, error } = await supabase
        .from('sessions')
        .update({
          duration_seconds: data.duration_seconds,
          mood_before: data.mood_before,
          mood_after: data.mood_after,
          xp_earned: data.xp_earned,
          metadata: data.metadata,
          ended_at: new Date().toISOString()
        })
        .eq('id', existing.id)
        .select()
        .single();

      if (error) {
        logger.error('[ModuleInterconnect] Sync update error:', error, 'MODULE');
        return null;
      }

      return updated as UnifiedSession;
    } else {
      // Créer
      return this.createSession({
        user_id: user.id,
        session_type: moduleType,
        source_id: sourceId,
        started_at: new Date().toISOString(),
        duration_seconds: data.duration_seconds || 0,
        mood_before: data.mood_before,
        mood_after: data.mood_after,
        xp_earned: data.xp_earned || 0,
        achievements_unlocked: [],
        metadata: data.metadata || {}
      });
    }
  }
}

export const moduleInterconnectService = new ModuleInterconnectService();
export default moduleInterconnectService;
