/**
 * Service enrichi pour VR Galaxy - Exploration spatiale thérapeutique
 */

import { supabase } from '@/integrations/supabase/client';

export interface VRGalaxySession {
  id: string;
  user_id: string;
  session_id: string;
  galaxy_explored?: string;
  planets_visited?: string[];
  discoveries?: Discovery[];
  hrv_pre?: number;
  hrv_post?: number;
  rmssd_delta?: number;
  resp_rate_avg?: number;
  coherence_score?: number;
  duration_seconds: number;
  created_at: string;
  completed_at?: string;
  achievements_unlocked?: string[];
  exploration_depth?: number;
}

export interface Discovery {
  type: 'planet' | 'nebula' | 'constellation' | 'phenomenon';
  name: string;
  coordinates: { x: number; y: number; z: number };
  description: string;
  therapeutic_value: number;
  timestamp: number;
}

export interface GalaxyEnvironment {
  name: string;
  theme: string;
  stars_density: number;
  color_palette: string[];
  ambient_sounds: string[];
  therapeutic_elements: string[];
  difficulty_level: number;
}

export interface BiometricInsight {
  metric: string;
  value: number;
  trend: 'improving' | 'stable' | 'needs_attention';
  recommendation: string;
  confidence: number;
}

export class VRGalaxyServiceEnriched {
  /**
   * Créer une session d'exploration avec personnalisation
   */
  static async createExplorationSession(
    userId: string,
    preferences: {
      galaxyType?: string;
      difficultyLevel?: number;
      therapeuticGoal?: string;
    }
  ): Promise<VRGalaxySession> {
    const galaxy = await this.selectOptimalGalaxy(userId, preferences);
    
    const { data, error } = await supabase
      .from('vr_nebula_sessions')
      .insert({
        user_id: userId,
        session_id: `vr_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        galaxy_explored: galaxy.name,
        planets_visited: [],
        discoveries: [],
        duration_seconds: 0,
        exploration_depth: 0
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  /**
   * Sélectionner la galaxie optimale pour l'utilisateur
   */
  static async selectOptimalGalaxy(
    userId: string,
    preferences: any
  ): Promise<GalaxyEnvironment> {
    const history = await this.fetchHistory(userId, 10);
    const biometricData = await this.getLatestBiometrics(userId);

    const { data, error } = await supabase.functions.invoke('select-galaxy', {
      body: {
        userId,
        preferences,
        history,
        biometrics: biometricData
      }
    });

    if (error) {
      // Galaxie par défaut
      return {
        name: 'Peaceful Nebula',
        theme: 'calming',
        stars_density: 0.6,
        color_palette: ['#1a1a2e', '#16213e', '#0f3460'],
        ambient_sounds: ['cosmic-whispers', 'gentle-waves'],
        therapeutic_elements: ['breathing-stars', 'calming-voids'],
        difficulty_level: 3
      };
    }

    return data.galaxy;
  }

  /**
   * Enregistrer une découverte pendant l'exploration
   */
  static async recordDiscovery(
    sessionId: string,
    discovery: Discovery
  ): Promise<{ achievements: string[]; xpGained: number }> {
    const { data: session } = await supabase
      .from('vr_nebula_sessions')
      .select('discoveries, exploration_depth')
      .eq('session_id', sessionId)
      .single();

    if (session) {
      const discoveries = [...(session.discoveries || []), discovery];
      const explorationDepth = (session.exploration_depth || 0) + discovery.therapeutic_value;
      
      const { error } = await supabase
        .from('vr_nebula_sessions')
        .update({ 
          discoveries,
          exploration_depth: explorationDepth
        })
        .eq('session_id', sessionId);

      if (error) throw error;

      // Vérifier les achievements
      const achievements = await this.checkAchievements(discoveries, explorationDepth);
      
      return {
        achievements,
        xpGained: Math.round(discovery.therapeutic_value * 100)
      };
    }

    return { achievements: [], xpGained: 0 };
  }

  /**
   * Mettre à jour les biométriques avec analyse en temps réel
   */
  static async updateBiometricsWithAnalysis(
    sessionId: string,
    metrics: {
      hrv_pre?: number;
      hrv_post?: number;
      resp_rate_avg?: number;
      current_stress_level?: number;
    }
  ): Promise<BiometricInsight[]> {
    const { error } = await supabase
      .from('vr_nebula_sessions')
      .update(metrics)
      .eq('session_id', sessionId);

    if (error) throw error;

    // Analyser les biométriques en temps réel
    const { data } = await supabase.functions.invoke('analyze-biometrics', {
      body: { sessionId, metrics }
    });

    return data?.insights || [];
  }

  /**
   * Générer des recommandations adaptatives pendant la session
   */
  static async getAdaptiveRecommendations(
    sessionId: string,
    currentState: {
      timeElapsed: number;
      hrvCurrent: number;
      stressLevel: number;
      explorationsCount: number;
    }
  ): Promise<{
    action: string;
    reason: string;
    urgency: number;
  }[]> {
    const { data, error } = await supabase.functions.invoke('vr-adaptive-coach', {
      body: { sessionId, currentState }
    });

    if (error) return [];
    return data.recommendations || [];
  }

  /**
   * Compléter une session avec rapport détaillé
   */
  static async completeSessionWithReport(
    sessionId: string,
    completion: {
      durationSeconds: number;
      finalBiometrics?: any;
      userFeedback?: string;
    }
  ): Promise<{
    report: any;
    achievements: string[];
    nextSteps: string[];
  }> {
    const { error } = await supabase
      .from('vr_nebula_sessions')
      .update({
        duration_seconds: completion.durationSeconds,
        completed_at: new Date().toISOString()
      })
      .eq('session_id', sessionId);

    if (error) throw error;

    // Générer le rapport de session
    const { data } = await supabase.functions.invoke('generate-vr-report', {
      body: { sessionId, feedback: completion.userFeedback }
    });

    return {
      report: data?.report || {},
      achievements: data?.achievements || [],
      nextSteps: data?.recommendations || []
    };
  }

  /**
   * Vérifier et débloquer les achievements
   */
  private static async checkAchievements(
    discoveries: Discovery[],
    explorationDepth: number
  ): Promise<string[]> {
    const achievements: string[] = [];

    if (discoveries.length >= 5) achievements.push('EXPLORER_NOVICE');
    if (discoveries.length >= 20) achievements.push('EXPLORER_EXPERT');
    if (explorationDepth >= 100) achievements.push('DEEP_SPACE_TRAVELER');
    
    const uniqueTypes = new Set(discoveries.map(d => d.type));
    if (uniqueTypes.size >= 4) achievements.push('COSMIC_COLLECTOR');

    return achievements;
  }

  /**
   * Obtenir les dernières données biométriques
   */
  private static async getLatestBiometrics(userId: string): Promise<any> {
    const { data } = await supabase
      .from('vr_nebula_sessions')
      .select('hrv_post, resp_rate_avg, coherence_score')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(1)
      .single();

    return data || {};
  }

  /**
   * Récupérer l'historique enrichi
   */
  static async fetchHistory(userId: string, limit: number = 20): Promise<VRGalaxySession[]> {
    const { data, error } = await supabase
      .from('vr_nebula_sessions')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) throw error;
    return data || [];
  }

  /**
   * Obtenir les statistiques de progression cosmique
   */
  static async getCosmicProgressionStats(userId: string): Promise<{
    totalExplorations: number;
    galaxiesVisited: Set<string>;
    totalDiscoveries: number;
    averageCoherenceScore: number;
    hrvImprovement: number;
    unlockedAchievements: string[];
  }> {
    const history = await this.fetchHistory(userId, 100);
    
    const galaxiesVisited = new Set(history.map(s => s.galaxy_explored).filter((g): g is string => Boolean(g)));
    const totalDiscoveries = history.reduce((sum, s) => sum + (s.discoveries?.length || 0), 0);
    
    const sessionsWithScores = history.filter(s => s.coherence_score);
    const avgCoherence = sessionsWithScores.length > 0
      ? sessionsWithScores.reduce((sum, s) => sum + (s.coherence_score || 0), 0) / sessionsWithScores.length
      : 0;

    const hrvImprovement = this.calculateHRVImprovement(history);
    const achievements = history.flatMap(s => s.achievements_unlocked || []);

    return {
      totalExplorations: history.length,
      galaxiesVisited,
      totalDiscoveries,
      averageCoherenceScore: avgCoherence,
      hrvImprovement,
      unlockedAchievements: [...new Set(achievements)]
    };
  }

  private static calculateHRVImprovement(sessions: VRGalaxySession[]): number {
    const sessionsWithHRV = sessions.filter(s => s.hrv_pre && s.hrv_post);
    if (sessionsWithHRV.length === 0) return 0;

    const improvements = sessionsWithHRV.map(s => 
      ((s.hrv_post! - s.hrv_pre!) / s.hrv_pre!) * 100
    );

    return improvements.reduce((sum, i) => sum + i, 0) / improvements.length;
  }
}
