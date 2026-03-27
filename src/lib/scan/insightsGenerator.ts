// @ts-nocheck
/**
 * EmotionInsightsGenerator - Générateur d'insights émotionnels personnalisés
 * Analyse les patterns et génère des recommandations intelligentes
 */

import { supabase } from '@/integrations/supabase/client';
import { logger } from '@/lib/logger';

export interface EmotionInsight {
  id: string;
  type: 'pattern' | 'trend' | 'recommendation' | 'warning' | 'achievement';
  title: string;
  description: string;
  priority: 'high' | 'medium' | 'low';
  confidence: number; // 0-100
  actionable: boolean;
  action?: {
    label: string;
    path: string;
  };
  expiresAt?: string;
  createdAt: string;
}

export interface EmotionPattern {
  name: string;
  frequency: number;
  timeOfDay?: 'morning' | 'afternoon' | 'evening' | 'night';
  dayOfWeek?: number;
  trend: 'improving' | 'declining' | 'stable';
  correlation?: string;
}

export interface InsightContext {
  recentScans: ScanData[];
  weeklyStats: WeeklyStats;
  monthlyStats: MonthlyStats;
  userPreferences?: Record<string, any>;
}

interface ScanData {
  id: string;
  valence: number;
  arousal: number;
  emotion: string;
  source: string;
  timestamp: string;
}

interface WeeklyStats {
  avgValence: number;
  avgArousal: number;
  scanCount: number;
  topEmotions: string[];
  trend: 'up' | 'down' | 'stable';
}

interface MonthlyStats {
  avgValence: number;
  avgArousal: number;
  scanCount: number;
  streakDays: number;
  bestDay: string;
  worstDay: string;
}

class EmotionInsightsGenerator {
  private insights: EmotionInsight[] = [];
  private userId: string | null = null;

  // Initialiser avec les données utilisateur
  async initialize(userId: string): Promise<void> {
    this.userId = userId;
    await this.loadSavedInsights();
  }

  // Charger les insights sauvegardés
  private async loadSavedInsights(): Promise<void> {
    if (!this.userId) return;

    try {
      const { data } = await supabase
        .from('user_settings')
        .select('value')
        .eq('user_id', this.userId)
        .eq('key', 'scan:insights')
        .single();

      if (data?.value) {
        this.insights = JSON.parse(data.value);
        // Nettoyer les insights expirés
        this.insights = this.insights.filter(i => 
          !i.expiresAt || new Date(i.expiresAt) > new Date()
        );
      }
    } catch (e) {
      logger.warn('[InsightsGenerator] Load failed', {}, 'SCAN');
    }
  }

  // Sauvegarder les insights
  private async saveInsights(): Promise<void> {
    if (!this.userId) return;

    try {
      await supabase
        .from('user_settings')
        .upsert({
          user_id: this.userId,
          key: 'scan:insights',
          value: JSON.stringify(this.insights),
          updated_at: new Date().toISOString()
        }, { onConflict: 'user_id,key' });
    } catch (e) {
      logger.error('[InsightsGenerator] Save failed', e, 'SCAN');
    }
  }

  // Générer tous les insights basés sur le contexte
  async generateInsights(context: InsightContext): Promise<EmotionInsight[]> {
    const newInsights: EmotionInsight[] = [];

    // Pattern insights
    newInsights.push(...this.detectPatterns(context));

    // Trend insights
    newInsights.push(...this.analyzeTrends(context));

    // Recommendations
    newInsights.push(...this.generateRecommendations(context));

    // Achievements
    newInsights.push(...this.checkAchievements(context));

    // Warnings
    newInsights.push(...this.detectWarnings(context));

    // Fusionner avec les insights existants (éviter les doublons)
    const existingIds = new Set(this.insights.map(i => i.id));
    const uniqueNew = newInsights.filter(i => !existingIds.has(i.id));
    
    this.insights = [...uniqueNew, ...this.insights].slice(0, 50);
    await this.saveInsights();

    return this.insights;
  }

  // Détecter les patterns émotionnels
  private detectPatterns(context: InsightContext): EmotionInsight[] {
    const insights: EmotionInsight[] = [];
    const { recentScans } = context;

    if (recentScans.length < 7) return insights;

    // Pattern par moment de la journée
    const morningScans = recentScans.filter(s => {
      const hour = new Date(s.timestamp).getHours();
      return hour >= 6 && hour < 12;
    });
    const eveningScans = recentScans.filter(s => {
      const hour = new Date(s.timestamp).getHours();
      return hour >= 18 && hour < 23;
    });

    if (morningScans.length >= 3 && eveningScans.length >= 3) {
      const morningAvg = morningScans.reduce((a, s) => a + s.valence, 0) / morningScans.length;
      const eveningAvg = eveningScans.reduce((a, s) => a + s.valence, 0) / eveningScans.length;

      if (morningAvg - eveningAvg > 15) {
        insights.push({
          id: `pattern-morning-person-${Date.now()}`,
          type: 'pattern',
          title: 'Vous êtes du matin 🌅',
          description: `Votre humeur est généralement ${Math.round(morningAvg - eveningAvg)}% meilleure le matin. Planifiez vos tâches importantes tôt.`,
          priority: 'medium',
          confidence: 75,
          actionable: false,
          createdAt: new Date().toISOString(),
          expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString()
        });
      } else if (eveningAvg - morningAvg > 15) {
        insights.push({
          id: `pattern-evening-person-${Date.now()}`,
          type: 'pattern',
          title: 'Vous êtes du soir 🌙',
          description: `Votre énergie augmente en fin de journée. Réservez les tâches créatives pour l'après-midi.`,
          priority: 'medium',
          confidence: 75,
          actionable: false,
          createdAt: new Date().toISOString(),
          expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString()
        });
      }
    }

    // Pattern d'émotions récurrentes
    const emotionCounts: Record<string, number> = {};
    recentScans.forEach(s => {
      emotionCounts[s.emotion] = (emotionCounts[s.emotion] || 0) + 1;
    });
    
    const sortedEmotions = Object.entries(emotionCounts)
      .sort((a, b) => b[1] - a[1]);

    if (sortedEmotions.length > 0) {
      const [topEmotion, count] = sortedEmotions[0];
      const percentage = Math.round((count / recentScans.length) * 100);
      
      if (percentage >= 40) {
        insights.push({
          id: `pattern-dominant-${topEmotion}-${Date.now()}`,
          type: 'pattern',
          title: `Émotion dominante: ${topEmotion}`,
          description: `${percentage}% de vos scans récents montrent "${topEmotion}". C'est votre état émotionnel principal.`,
          priority: 'low',
          confidence: 80,
          actionable: false,
          createdAt: new Date().toISOString(),
          expiresAt: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString()
        });
      }
    }

    return insights;
  }

  // Analyser les tendances
  private analyzeTrends(context: InsightContext): EmotionInsight[] {
    const insights: EmotionInsight[] = [];
    const { weeklyStats, monthlyStats } = context;

    // Tendance hebdomadaire
    if (weeklyStats.trend === 'up') {
      insights.push({
        id: `trend-weekly-up-${Date.now()}`,
        type: 'trend',
        title: 'Tendance positive 📈',
        description: `Votre bien-être s'améliore cette semaine avec une valence moyenne de ${Math.round(weeklyStats.avgValence)}%.`,
        priority: 'low',
        confidence: 70,
        actionable: false,
        createdAt: new Date().toISOString(),
        expiresAt: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString()
      });
    } else if (weeklyStats.trend === 'down' && weeklyStats.avgValence < 40) {
      insights.push({
        id: `trend-weekly-down-${Date.now()}`,
        type: 'trend',
        title: 'Attention à votre bien-être',
        description: 'Votre humeur a tendance à baisser. Prenez du temps pour des activités qui vous font du bien.',
        priority: 'high',
        confidence: 75,
        actionable: true,
        action: {
          label: 'Voir les activités',
          path: '/app/activities'
        },
        createdAt: new Date().toISOString(),
        expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString()
      });
    }

    // Comparaison semaine vs mois
    if (weeklyStats.avgValence > monthlyStats.avgValence + 10) {
      insights.push({
        id: `trend-improvement-${Date.now()}`,
        type: 'trend',
        title: 'Belle progression! 🎉',
        description: `Cette semaine est ${Math.round(weeklyStats.avgValence - monthlyStats.avgValence)}% meilleure que votre moyenne mensuelle.`,
        priority: 'medium',
        confidence: 85,
        actionable: false,
        createdAt: new Date().toISOString(),
        expiresAt: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString()
      });
    }

    return insights;
  }

  // Générer des recommandations
  private generateRecommendations(context: InsightContext): EmotionInsight[] {
    const insights: EmotionInsight[] = [];
    const { weeklyStats, recentScans } = context;

    // Recommandation basée sur l'arousal
    if (weeklyStats.avgArousal < 35) {
      insights.push({
        id: `rec-low-energy-${Date.now()}`,
        type: 'recommendation',
        title: 'Boostez votre énergie',
        description: 'Votre niveau d\'énergie est bas. Essayez un exercice de respiration dynamique.',
        priority: 'medium',
        confidence: 70,
        actionable: true,
        action: {
          label: 'Respiration',
          path: '/app/breathwork'
        },
        createdAt: new Date().toISOString(),
        expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString()
      });
    } else if (weeklyStats.avgArousal > 75) {
      insights.push({
        id: `rec-high-arousal-${Date.now()}`,
        type: 'recommendation',
        title: 'Moment de calme suggéré',
        description: 'Votre niveau d\'activation est élevé. Une méditation pourrait vous aider à vous recentrer.',
        priority: 'medium',
        confidence: 70,
        actionable: true,
        action: {
          label: 'Méditation',
          path: '/app/breathwork'
        },
        createdAt: new Date().toISOString(),
        expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString()
      });
    }

    // Recommandation de régularité
    if (weeklyStats.scanCount < 5) {
      insights.push({
        id: `rec-regularity-${Date.now()}`,
        type: 'recommendation',
        title: 'Scannez plus régulièrement',
        description: `Vous n'avez fait que ${weeklyStats.scanCount} scan(s) cette semaine. La régularité améliore la connaissance de soi.`,
        priority: 'low',
        confidence: 90,
        actionable: true,
        action: {
          label: 'Scanner maintenant',
          path: '/app/scan'
        },
        createdAt: new Date().toISOString(),
        expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString()
      });
    }

    return insights;
  }

  // Vérifier les achievements
  private checkAchievements(context: InsightContext): EmotionInsight[] {
    const insights: EmotionInsight[] = [];
    const { monthlyStats, weeklyStats } = context;

    // Achievement de streak
    if (monthlyStats.streakDays >= 7) {
      insights.push({
        id: `ach-streak-7-${Date.now()}`,
        type: 'achievement',
        title: '🏆 1 semaine de streak!',
        description: `${monthlyStats.streakDays} jours consécutifs de scan. Continuez comme ça!`,
        priority: 'low',
        confidence: 100,
        actionable: false,
        createdAt: new Date().toISOString(),
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString()
      });
    }

    // Achievement de bien-être
    if (weeklyStats.avgValence >= 75) {
      insights.push({
        id: `ach-wellbeing-${Date.now()}`,
        type: 'achievement',
        title: '✨ Semaine excellente!',
        description: 'Votre bien-être émotionnel est au top cette semaine. Bravo!',
        priority: 'low',
        confidence: 100,
        actionable: false,
        createdAt: new Date().toISOString(),
        expiresAt: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString()
      });
    }

    return insights;
  }

  // Détecter les alertes
  private detectWarnings(context: InsightContext): EmotionInsight[] {
    const insights: EmotionInsight[] = [];
    const { recentScans, weeklyStats } = context;

    // Warning: valence très basse persistante
    const lowValenceScans = recentScans.filter(s => s.valence < 30);
    if (lowValenceScans.length >= 3) {
      insights.push({
        id: `warn-low-mood-${Date.now()}`,
        type: 'warning',
        title: '⚠️ Humeur basse détectée',
        description: 'Plusieurs scans récents montrent une humeur basse. N\'hésitez pas à en parler à quelqu\'un.',
        priority: 'high',
        confidence: 85,
        actionable: true,
        action: {
          label: 'Ressources d\'aide',
          path: '/app/support'
        },
        createdAt: new Date().toISOString(),
        expiresAt: new Date(Date.now() + 48 * 60 * 60 * 1000).toISOString()
      });
    }

    return insights;
  }

  // Récupérer les insights actifs
  getActiveInsights(): EmotionInsight[] {
    return this.insights.filter(i => 
      !i.expiresAt || new Date(i.expiresAt) > new Date()
    );
  }

  // Récupérer les insights par type
  getInsightsByType(type: EmotionInsight['type']): EmotionInsight[] {
    return this.getActiveInsights().filter(i => i.type === type);
  }

  // Récupérer les insights prioritaires
  getPriorityInsights(): EmotionInsight[] {
    return this.getActiveInsights()
      .filter(i => i.priority === 'high')
      .sort((a, b) => b.confidence - a.confidence);
  }

  // Marquer un insight comme lu/traité
  async dismissInsight(id: string): Promise<void> {
    this.insights = this.insights.filter(i => i.id !== id);
    await this.saveInsights();
  }
}

export const emotionInsightsGenerator = new EmotionInsightsGenerator();
export default emotionInsightsGenerator;
