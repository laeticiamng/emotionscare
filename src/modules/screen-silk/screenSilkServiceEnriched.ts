/**
 * Service enrichi pour Screen Silk - Thérapie visuelle adaptative
 */

import { supabase } from '@/integrations/supabase/client';

export interface ScreenSilkSession {
  id: string;
  user_id: string;
  silk_pattern: string;
  color_therapy_mode: string;
  visual_adaptations: VisualAdaptation[];
  gaze_tracking_data?: GazePoint[];
  therapeutic_effectiveness?: number;
  duration_seconds: number;
  created_at: string;
  completed_at?: string;
}

export interface VisualAdaptation {
  timestamp: number;
  pattern_complexity: number;
  color_palette: string[];
  movement_speed: number;
  therapeutic_intensity: number;
  user_response?: number;
}

export interface GazePoint {
  x: number;
  y: number;
  timestamp: number;
  fixation_duration: number;
  emotional_zone?: string;
}

export interface SilkPattern {
  name: string;
  type: 'flowing' | 'geometric' | 'organic' | 'fractal';
  complexity: number;
  therapeutic_properties: {
    stress_reduction: number;
    focus_enhancement: number;
    emotional_balance: number;
  };
  color_schemes: ColorScheme[];
}

export interface ColorScheme {
  name: string;
  primary: string;
  secondary: string;
  accent: string;
  therapeutic_effect: string;
}

export class ScreenSilkServiceEnriched {
  /**
   * Générer un pattern de silk personnalisé
   */
  static async generatePersonalizedSilk(
    userId: string,
    preferences: {
      therapeuticGoal?: string;
      complexity?: number;
      colorPreference?: string;
      sensitivity?: number;
    }
  ): Promise<SilkPattern> {
    const history = await this.fetchHistory(userId, 10);
    const profile = await this.getUserVisualProfile(userId);

    const { data, error } = await supabase.functions.invoke('generate-silk-pattern', {
      body: {
        userId,
        preferences,
        profile,
        history: history.slice(0, 3)
      }
    });

    if (error) {
      return this.generateDefaultPattern(preferences);
    }

    return data.pattern;
  }

  /**
   * Générer un pattern par défaut
   */
  private static generateDefaultPattern(preferences: any): SilkPattern {
    return {
      name: 'Peaceful Flow',
      type: 'flowing',
      complexity: preferences.complexity || 5,
      therapeutic_properties: {
        stress_reduction: 0.8,
        focus_enhancement: 0.6,
        emotional_balance: 0.7
      },
      color_schemes: [
        {
          name: 'Serene Blue',
          primary: '#4A90E2',
          secondary: '#7FB3D5',
          accent: '#A2D9CE',
          therapeutic_effect: 'calming'
        }
      ]
    };
  }

  /**
   * Créer une session avec suivi visuel
   */
  static async createVisualSession(
    userId: string,
    pattern: SilkPattern,
    colorScheme: ColorScheme
  ): Promise<ScreenSilkSession> {
    const { data, error } = await supabase
      .from('screen_silk_sessions')
      .insert({
        user_id: userId,
        silk_pattern: pattern.name,
        color_therapy_mode: colorScheme.therapeutic_effect,
        visual_adaptations: [],
        gaze_tracking_data: [],
        duration_seconds: 0
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  /**
   * Enregistrer une adaptation visuelle
   */
  static async recordVisualAdaptation(
    sessionId: string,
    adaptation: VisualAdaptation
  ): Promise<{
    shouldAdapt: boolean;
    newSettings?: Partial<VisualAdaptation>;
    reason?: string;
  }> {
    const { data: session } = await supabase
      .from('screen_silk_sessions')
      .select('visual_adaptations')
      .eq('id', sessionId)
      .single();

    if (session) {
      const adaptations = [...(session.visual_adaptations || []), adaptation];
      
      await supabase
        .from('screen_silk_sessions')
        .update({ visual_adaptations: adaptations })
        .eq('id', sessionId);

      // Analyser si adaptation nécessaire
      const analysis = this.analyzeVisualStimulation(adaptations);
      
      if (analysis.needsAdjustment) {
        const newSettings = await this.generateAdaptiveSettings(
          sessionId,
          adaptations,
          analysis
        );

        return {
          shouldAdapt: true,
          newSettings,
          reason: analysis.reason
        };
      }
    }

    return { shouldAdapt: false };
  }

  /**
   * Analyser la stimulation visuelle
   */
  private static analyzeVisualStimulation(
    adaptations: VisualAdaptation[]
  ): { needsAdjustment: boolean; reason?: string; urgency?: number } {
    if (adaptations.length < 3) return { needsAdjustment: false };

    const recent = adaptations.slice(-5);
    
    // Vérifier l'intensité thérapeutique
    const avgIntensity = recent.reduce((sum, a) => sum + a.therapeutic_intensity, 0) / recent.length;
    
    if (avgIntensity > 0.9) {
      return {
        needsAdjustment: true,
        reason: 'excessive_stimulation',
        urgency: 0.9
      };
    }

    // Vérifier les réponses utilisateur
    const responses = recent.filter(a => a.user_response !== undefined);
    if (responses.length >= 3) {
      const avgResponse = responses.reduce((sum, a) => sum + a.user_response!, 0) / responses.length;
      
      if (avgResponse < 3) {
        return {
          needsAdjustment: true,
          reason: 'poor_user_response',
          urgency: 0.7
        };
      }
    }

    // Vérifier la monotonie
    const complexityVariance = this.calculateVariance(
      recent.map(a => a.pattern_complexity)
    );
    
    if (complexityVariance < 0.1 && adaptations.length > 10) {
      return {
        needsAdjustment: true,
        reason: 'visual_monotony',
        urgency: 0.6
      };
    }

    return { needsAdjustment: false };
  }

  /**
   * Générer des paramètres adaptatifs
   */
  private static async generateAdaptiveSettings(
    sessionId: string,
    adaptations: VisualAdaptation[],
    analysis: any
  ): Promise<Partial<VisualAdaptation>> {
    const { data } = await supabase.functions.invoke('adapt-silk-visuals', {
      body: { sessionId, adaptations, analysis }
    });

    if (data?.settings) {
      return data.settings;
    }

    // Paramètres adaptatifs par défaut
    const current = adaptations[adaptations.length - 1];
    
    if (analysis.reason === 'excessive_stimulation') {
      return {
        pattern_complexity: Math.max(1, current.pattern_complexity - 2),
        movement_speed: current.movement_speed * 0.7,
        therapeutic_intensity: current.therapeutic_intensity * 0.8
      };
    } else if (analysis.reason === 'visual_monotony') {
      return {
        pattern_complexity: Math.min(10, current.pattern_complexity + 2),
        color_palette: this.generateNewColorPalette(),
        movement_speed: current.movement_speed * 1.2
      };
    }

    // Fallback : paramètres par défaut équilibrés
    // Raison inconnue : on ajuste légèrement vers des valeurs moyennes
    console.warn(`[Screen Silk] Unknown adaptation reason: ${analysis.reason}. Using balanced defaults.`);

    return {
      pattern_complexity: Math.max(3, Math.min(7, current.pattern_complexity)),
      movement_speed: Math.max(0.7, Math.min(1.3, current.movement_speed)),
      therapeutic_intensity: Math.max(0.5, Math.min(0.8, current.therapeutic_intensity)),
      color_palette: this.generateNewColorPalette()
    };
  }

  /**
   * Générer une nouvelle palette de couleurs
   */
  private static generateNewColorPalette(): string[] {
    const palettes = [
      ['#FF6B6B', '#4ECDC4', '#45B7D1'],
      ['#A8E6CF', '#FFD3B6', '#FFAAA5'],
      ['#98D8C8', '#F7DC6F', '#BB8FCE'],
      ['#85C1E2', '#F8B88B', '#A8DADC']
    ];

    return palettes[Math.floor(Math.random() * palettes.length)];
  }

  /**
   * Enregistrer les données de suivi du regard
   */
  static async recordGazeTracking(
    sessionId: string,
    gazePoints: GazePoint[]
  ): Promise<{ insights: string[]; heatmap: any }> {
    const { data: session } = await supabase
      .from('screen_silk_sessions')
      .select('gaze_tracking_data')
      .eq('id', sessionId)
      .single();

    if (session) {
      const allGazeData = [...(session.gaze_tracking_data || []), ...gazePoints];
      
      await supabase
        .from('screen_silk_sessions')
        .update({ gaze_tracking_data: allGazeData })
        .eq('id', sessionId);

      // Analyser les patterns de regard
      const insights = this.analyzeGazePatterns(allGazeData);
      const heatmap = this.generateGazeHeatmap(allGazeData);

      return { insights, heatmap };
    }

    return { insights: [], heatmap: null };
  }

  /**
   * Analyser les patterns de regard
   */
  private static analyzeGazePatterns(gazeData: GazePoint[]): string[] {
    const insights: string[] = [];

    if (gazeData.length === 0) return insights;

    // Calculer les zones de fixation
    const fixationZones: Record<string, number> = {};
    gazeData.forEach(point => {
      if (point.emotional_zone) {
        fixationZones[point.emotional_zone] = (fixationZones[point.emotional_zone] || 0) + 1;
      }
    });

    const dominantZone = Object.entries(fixationZones)
      .sort(([, a], [, b]) => b - a)[0];

    if (dominantZone) {
      insights.push(`Zone de fixation principale: ${dominantZone[0]}`);
    }

    // Analyser la durée de fixation
    const avgFixation = gazeData.reduce((sum, p) => sum + p.fixation_duration, 0) / gazeData.length;
    
    if (avgFixation > 500) {
      insights.push('Haute concentration visuelle détectée');
    } else if (avgFixation < 200) {
      insights.push('Attention visuelle dispersée');
    }

    return insights;
  }

  /**
   * Générer une heatmap du regard
   */
  private static generateGazeHeatmap(gazeData: GazePoint[]): any {
    const gridSize = 20;
    const heatmap: number[][] = Array(gridSize).fill(0).map(() => Array(gridSize).fill(0));

    gazeData.forEach(point => {
      const gridX = Math.floor((point.x / 100) * gridSize);
      const gridY = Math.floor((point.y / 100) * gridSize);
      
      if (gridX >= 0 && gridX < gridSize && gridY >= 0 && gridY < gridSize) {
        heatmap[gridY][gridX]++;
      }
    });

    return heatmap;
  }

  /**
   * Calculer la variance
   */
  private static calculateVariance(values: number[]): number {
    if (values.length === 0) return 0;
    
    const mean = values.reduce((sum, v) => sum + v, 0) / values.length;
    const squaredDiffs = values.map(v => Math.pow(v - mean, 2));
    return squaredDiffs.reduce((sum, d) => sum + d, 0) / values.length;
  }

  /**
   * Obtenir le profil visuel de l'utilisateur
   */
  private static async getUserVisualProfile(userId: string): Promise<any> {
    const { data } = await supabase
      .from('user_visual_profiles')
      .select('*')
      .eq('user_id', userId)
      .single();

    return data || {
      preferred_complexity: 5,
      color_sensitivity: 0.7,
      motion_tolerance: 0.8
    };
  }

  /**
   * Compléter une session avec rapport visuel
   */
  static async completeSessionWithReport(
    sessionId: string,
    completion: {
      durationSeconds: number;
      finalState?: any;
      userFeedback?: string;
    }
  ): Promise<{
    visualReport: any;
    therapeuticInsights: string[];
    gazeAnalysis: any;
    achievementsUnlocked: string[];
  }> {
    const { data: session } = await supabase
      .from('screen_silk_sessions')
      .select('*')
      .eq('id', sessionId)
      .single();

    if (!session) throw new Error('Session not found');

    const effectiveness = this.calculateVisualTherapeuticEffectiveness(
      session.visual_adaptations,
      session.gaze_tracking_data
    );

    const achievements = this.calculateAchievements(session);

    await supabase
      .from('screen_silk_sessions')
      .update({
        duration_seconds: completion.durationSeconds,
        therapeutic_effectiveness: effectiveness,
        completed_at: new Date().toISOString()
      })
      .eq('id', sessionId);

    const gazeAnalysis = session.gaze_tracking_data 
      ? {
          insights: this.analyzeGazePatterns(session.gaze_tracking_data),
          heatmap: this.generateGazeHeatmap(session.gaze_tracking_data)
        }
      : null;

    return {
      visualReport: {
        effectiveness,
        totalAdaptations: session.visual_adaptations.length
      },
      therapeuticInsights: this.generateTherapeuticInsights(session),
      gazeAnalysis,
      achievementsUnlocked: achievements
    };
  }

  /**
   * Calculer l'efficacité thérapeutique visuelle
   */
  private static calculateVisualTherapeuticEffectiveness(
    adaptations: VisualAdaptation[],
    gazeData?: GazePoint[]
  ): number {
    if (adaptations.length === 0) return 0;

    const avgIntensity = adaptations.reduce((sum, a) => sum + a.therapeutic_intensity, 0) / adaptations.length;
    
    const responseQuality = adaptations
      .filter(a => a.user_response !== undefined)
      .reduce((sum, a) => sum + a.user_response!, 0) / adaptations.length || 0.5;

    let gazeScore = 0.5;
    if (gazeData && gazeData.length > 0) {
      const avgFixation = gazeData.reduce((sum, p) => sum + p.fixation_duration, 0) / gazeData.length;
      gazeScore = Math.min(1, avgFixation / 500);
    }

    return (avgIntensity * 0.4 + responseQuality * 0.4 + gazeScore * 0.2);
  }

  /**
   * Générer des insights thérapeutiques
   */
  private static generateTherapeuticInsights(session: ScreenSilkSession): string[] {
    const insights: string[] = [];

    const avgComplexity = session.visual_adaptations.reduce((sum, a) => sum + a.pattern_complexity, 0) / session.visual_adaptations.length;
    
    if (avgComplexity > 7) {
      insights.push('Préférence pour les patterns complexes détectée');
    } else if (avgComplexity < 3) {
      insights.push('Préférence pour la simplicité visuelle');
    }

    if (session.visual_adaptations.length > 15) {
      insights.push('Excellente adaptation visuelle');
    }

    return insights;
  }

  /**
   * Calculer les achievements
   */
  private static calculateAchievements(session: ScreenSilkSession): string[] {
    const achievements: string[] = [];

    if (session.duration_seconds >= 1200) achievements.push('VISUAL_MASTER');
    if (session.visual_adaptations.length >= 20) achievements.push('ADAPTIVE_PRO');
    if (session.gaze_tracking_data && session.gaze_tracking_data.length >= 100) {
      achievements.push('FOCUS_CHAMPION');
    }

    return achievements;
  }

  /**
   * Récupérer l'historique enrichi
   */
  static async fetchHistory(userId: string, limit: number = 20): Promise<ScreenSilkSession[]> {
    const { data, error } = await supabase
      .from('screen_silk_sessions')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) throw error;
    return data || [];
  }

  /**
   * Obtenir les statistiques visuelles
   */
  static async getVisualStats(userId: string): Promise<{
    totalSessions: number;
    averageComplexity: number;
    therapeuticProgress: number;
    favoritePatterns: string[];
    visualMastery: number;
  }> {
    const history = await this.fetchHistory(userId, 100);

    const avgComplexity = history
      .flatMap(s => s.visual_adaptations)
      .reduce((sum, a) => sum + a.pattern_complexity, 0) / history.length;

    const avgTherapeutic = history
      .filter(s => s.therapeutic_effectiveness)
      .reduce((sum, s) => sum + s.therapeutic_effectiveness!, 0) / history.length;

    const patternCounts: Record<string, number> = {};
    history.forEach(session => {
      patternCounts[session.silk_pattern] = (patternCounts[session.silk_pattern] || 0) + 1;
    });

    const favoritePatterns = Object.entries(patternCounts)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 3)
      .map(([pattern]) => pattern);

    return {
      totalSessions: history.length,
      averageComplexity: avgComplexity,
      therapeuticProgress: avgTherapeutic,
      favoritePatterns,
      visualMastery: Math.min(10, Math.floor(history.length / 10))
    };
  }
}
