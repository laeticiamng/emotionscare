/**
 * Service d'analytics prédictives - Analyse et prédictions IA long-terme
 * Utilise l'historique de l'utilisateur pour prédire les tendances émotionnelles
 */

import { supabase } from '@/integrations/supabase/client';
import { logger } from '@/lib/logger';

export interface EmotionTrend {
  date: string;
  mood: string;
  emotionalBalance: number;
  confidence: number;
}

export interface PredictedTrend {
  date: string;
  predictedMood: string;
  predictedBalance: number;
  confidence: number;
  factors: string[];
}

export interface PatternInsight {
  type: 'weekly' | 'monthly' | 'seasonal' | 'contextual';
  pattern: string;
  description: string;
  confidence: number;
  occurrences: number;
  recommendations: string[];
}

export interface RiskAlert {
  severity: 'low' | 'medium' | 'high';
  type: 'mood_decline' | 'stress_buildup' | 'sleep_pattern' | 'activity_drop';
  message: string;
  predictedDate?: string;
  preventionSteps: string[];
}

export interface WellnessProjection {
  timeframe: '1week' | '1month' | '3months';
  overallTrend: 'improving' | 'stable' | 'declining';
  projectedScore: number;
  keyFactors: Array<{
    factor: string;
    impact: number; // -100 to +100
    importance: number; // 0 to 1
  }>;
  recommendations: string[];
}

export interface AnalyticsInsight {
  emotionTrends: EmotionTrend[];
  predictions: PredictedTrend[];
  patterns: PatternInsight[];
  riskAlerts: RiskAlert[];
  wellnessProjection: WellnessProjection;
  generatedAt: string;
}

class PredictiveAnalyticsService {
  /**
   * Générer une analyse prédictive complète
   */
  async generatePredictiveAnalysis(
    timeframeMonths = 3
  ): Promise<AnalyticsInsight> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');

    try {
      // Récupérer les données historiques
      const historicalData = await this.fetchHistoricalData(user.id, timeframeMonths);

      // Analyser les tendances
      const emotionTrends = this.analyzeTrends(historicalData);

      // Générer des prédictions
      const predictions = await this.generatePredictions(emotionTrends);

      // Identifier les patterns
      const patterns = this.identifyPatterns(historicalData);

      // Détecter les risques
      const riskAlerts = this.detectRisks(emotionTrends, predictions);

      // Projeter le bien-être
      const wellnessProjection = this.projectWellness(emotionTrends, patterns);

      logger.info('Predictive analysis generated', { userId: user.id }, 'ANALYTICS');

      return {
        emotionTrends,
        predictions,
        patterns,
        riskAlerts,
        wellnessProjection,
        generatedAt: new Date().toISOString()
      };
    } catch (error) {
      logger.error('Failed to generate predictive analysis', error as Error, 'ANALYTICS');
      throw error;
    }
  }

  /**
   * Obtenir des recommandations personnalisées basées sur l'IA
   */
  async getPersonalizedRecommendations(): Promise<{
    immediate: string[];
    shortTerm: string[];
    longTerm: string[];
  }> {
    const analysis = await this.generatePredictiveAnalysis();

    const immediate: string[] = [];
    const shortTerm: string[] = [];
    const longTerm: string[] = [];

    // Recommandations immédiates basées sur les alertes
    if (analysis.riskAlerts.some(a => a.severity === 'high')) {
      immediate.push('Envisagez de consulter un professionnel de santé mentale');
      immediate.push('Pratiquez des techniques de relaxation (respiration, méditation)');
    }

    // Recommandations à court terme basées sur les patterns
    const moodPatterns = analysis.patterns.filter(p => p.confidence > 0.7);
    if (moodPatterns.length > 0) {
      shortTerm.push('Maintenez un journal quotidien pour mieux comprendre vos émotions');
      shortTerm.push(`Portez attention à : ${moodPatterns[0].pattern}`);
    }

    // Recommandations à long terme basées sur la projection
    if (analysis.wellnessProjection.overallTrend === 'declining') {
      longTerm.push('Développez une routine de bien-être régulière');
      longTerm.push('Identifiez et adressez les sources de stress chronique');
    } else if (analysis.wellnessProjection.overallTrend === 'improving') {
      longTerm.push('Continuez vos pratiques actuelles de bien-être');
      longTerm.push('Explorez de nouvelles activités pour maintenir votre élan positif');
    }

    // Ajouter les recommandations des facteurs clés
    analysis.wellnessProjection.keyFactors
      .filter(f => Math.abs(f.impact) > 30 && f.importance > 0.7)
      .forEach(factor => {
        if (factor.impact < 0) {
          shortTerm.push(`Travaillez sur : ${factor.factor}`);
        } else {
          shortTerm.push(`Continuez à cultiver : ${factor.factor}`);
        }
      });

    return { immediate, shortTerm, longTerm };
  }

  /**
   * Générer un rapport d'analyse pour le RH ou le coach
   */
  async generateAnalyticsReport(): Promise<{
    summary: string;
    trends: EmotionTrend[];
    insights: string[];
    recommendations: string[];
  }> {
    const analysis = await this.generatePredictiveAnalysis();

    const summary = this.generateSummaryText(analysis);
    const insights = this.extractInsights(analysis);
    const recommendations = (await this.getPersonalizedRecommendations()).longTerm;

    return {
      summary,
      trends: analysis.emotionTrends,
      insights,
      recommendations
    };
  }

  // ============================================
  // MÉTHODES PRIVÉES - ANALYSE
  // ============================================

  private async fetchHistoricalData(userId: string, months: number) {
    const startDate = new Date();
    startDate.setMonth(startDate.getMonth() - months);

    // Récupérer les scans émotionnels
    const { data: scans } = await supabase
      .from('emotion_scans')
      .select('*')
      .eq('user_id', userId)
      .gte('created_at', startDate.toISOString())
      .order('created_at', { ascending: true });

    // Récupérer les entrées de journal template
    const { data: journalEntries } = await supabase
      .from('journal_template_entries')
      .select('*')
      .eq('user_id', userId)
      .gte('created_at', startDate.toISOString())
      .order('created_at', { ascending: true });

    return {
      scans: scans || [],
      journalEntries: journalEntries || []
    };
  }

  private analyzeTrends(historicalData: any): EmotionTrend[] {
    const { scans } = historicalData;

    return scans.map((scan: any) => ({
      date: scan.created_at,
      mood: scan.mood || 'neutral',
      emotionalBalance: scan.emotional_balance || 50,
      confidence: scan.confidence || 0.5
    }));
  }

  private async generatePredictions(trends: EmotionTrend[]): Promise<PredictedTrend[]> {
    if (trends.length < 7) {
      // Pas assez de données pour faire des prédictions
      return [];
    }

    const predictions: PredictedTrend[] = [];

    // Utiliser une moyenne mobile et tendance linéaire simple
    const recentTrends = trends.slice(-14); // 2 dernières semaines
    const avgBalance = recentTrends.reduce((sum, t) => sum + t.emotionalBalance, 0) / recentTrends.length;

    // Calculer la tendance (pente)
    const slope = this.calculateSlope(recentTrends.map((t, i) => ({ x: i, y: t.emotionalBalance })));

    // Prédire les 7 prochains jours
    for (let i = 1; i <= 7; i++) {
      const predictedBalance = avgBalance + (slope * i);
      const predictedMood = this.balanceToMood(predictedBalance);

      const futureDate = new Date();
      futureDate.setDate(futureDate.getDate() + i);

      predictions.push({
        date: futureDate.toISOString(),
        predictedMood,
        predictedBalance: Math.max(0, Math.min(100, predictedBalance)),
        confidence: Math.max(0.3, 1 - (i * 0.1)), // Confiance décroissante
        factors: this.identifyInfluencingFactors(recentTrends)
      });
    }

    return predictions;
  }

  private identifyPatterns(historicalData: any): PatternInsight[] {
    const patterns: PatternInsight[] = [];

    // Pattern hebdomadaire
    const weeklyPattern = this.detectWeeklyPattern(historicalData.scans);
    if (weeklyPattern) patterns.push(weeklyPattern);

    // Pattern mensuel
    const monthlyPattern = this.detectMonthlyPattern(historicalData.scans);
    if (monthlyPattern) patterns.push(monthlyPattern);

    // Pattern journal
    const journalPattern = this.detectJournalPattern(historicalData.journalEntries);
    if (journalPattern) patterns.push(journalPattern);

    return patterns;
  }

  private detectRisks(trends: EmotionTrend[], predictions: PredictedTrend[]): RiskAlert[] {
    const risks: RiskAlert[] = [];

    // Détecter un déclin de l'humeur
    const recentTrend = trends.slice(-7);
    const avgRecent = recentTrend.reduce((sum, t) => sum + t.emotionalBalance, 0) / recentTrend.length;

    if (avgRecent < 40) {
      risks.push({
        severity: avgRecent < 30 ? 'high' : 'medium',
        type: 'mood_decline',
        message: 'Votre humeur montre une tendance à la baisse',
        preventionSteps: [
          'Prenez du temps pour vous-même chaque jour',
          'Parlez à un ami ou professionnel de confiance',
          'Pratiquez des activités qui vous apportent de la joie'
        ]
      });
    }

    // Détecter stress accumulé (variation élevée)
    const variance = this.calculateVariance(recentTrend.map(t => t.emotionalBalance));
    if (variance > 400) {
      risks.push({
        severity: 'medium',
        type: 'stress_buildup',
        message: 'Vos émotions varient beaucoup, signe possible de stress',
        preventionSteps: [
          'Identifiez vos sources de stress',
          'Pratiquez la méditation ou le yoga',
          'Établissez des limites saines'
        ]
      });
    }

    // Prédiction de déclin futur
    const futureTrend = predictions.slice(0, 3);
    const avgFuture = futureTrend.reduce((sum, p) => sum + p.predictedBalance, 0) / futureTrend.length;

    if (avgFuture < avgRecent - 10) {
      risks.push({
        severity: 'low',
        type: 'mood_decline',
        message: 'Une baisse d\'humeur est possible dans les prochains jours',
        predictedDate: predictions[0]?.date,
        preventionSteps: [
          'Planifiez des activités agréables',
          'Assurez un bon sommeil',
          'Maintenez vos routines de bien-être'
        ]
      });
    }

    return risks;
  }

  private projectWellness(trends: EmotionTrend[], patterns: PatternInsight[]): WellnessProjection {
    const recentTrends = trends.slice(-30); // Dernier mois
    const avgBalance = recentTrends.reduce((sum, t) => sum + t.emotionalBalance, 0) / recentTrends.length;

    // Calculer la tendance générale
    const slope = this.calculateSlope(recentTrends.map((t, i) => ({ x: i, y: t.emotionalBalance })));

    let overallTrend: 'improving' | 'stable' | 'declining';
    if (slope > 1) overallTrend = 'improving';
    else if (slope < -1) overallTrend = 'declining';
    else overallTrend = 'stable';

    // Projection à 1 mois
    const projectedScore = Math.max(0, Math.min(100, avgBalance + (slope * 30)));

    // Identifier les facteurs clés
    const keyFactors = [
      {
        factor: 'Pratique du journal',
        impact: patterns.some(p => p.type === 'contextual') ? 25 : -10,
        importance: 0.8
      },
      {
        factor: 'Régularité émotionnelle',
        impact: this.calculateVariance(recentTrends.map(t => t.emotionalBalance)) < 200 ? 20 : -15,
        importance: 0.7
      },
      {
        factor: 'Tendance générale',
        impact: slope * 10,
        importance: 0.9
      }
    ];

    const recommendations = [
      overallTrend === 'improving'
        ? 'Continuez vos bonnes pratiques actuelles'
        : 'Envisagez d\'ajuster votre routine de bien-être',
      'Maintenez un journal régulier pour suivre votre progression',
      'Célébrez vos petites victoires quotidiennes'
    ];

    return {
      timeframe: '1month',
      overallTrend,
      projectedScore,
      keyFactors,
      recommendations
    };
  }

  // ============================================
  // HELPERS
  // ============================================

  private detectWeeklyPattern(scans: any[]): PatternInsight | null {
    if (scans.length < 14) return null;

    const dayOfWeekScores = new Map<number, number[]>();

    scans.forEach(scan => {
      const dayOfWeek = new Date(scan.created_at).getDay();
      const balance = scan.emotional_balance || 50;

      if (!dayOfWeekScores.has(dayOfWeek)) {
        dayOfWeekScores.set(dayOfWeek, []);
      }
      dayOfWeekScores.get(dayOfWeek)!.push(balance);
    });

    // Trouver le jour avec le meilleur score moyen
    let bestDay = 0;
    let bestScore = 0;

    dayOfWeekScores.forEach((scores, day) => {
      const avg = scores.reduce((a, b) => a + b, 0) / scores.length;
      if (avg > bestScore) {
        bestScore = avg;
        bestDay = day;
      }
    });

    const days = ['Dimanche', 'Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi'];

    return {
      type: 'weekly',
      pattern: `Les ${days[bestDay]}s sont généralement vos meilleurs jours`,
      description: `Votre humeur est plus élevée les ${days[bestDay]}s`,
      confidence: 0.7,
      occurrences: dayOfWeekScores.get(bestDay)!.length,
      recommendations: [
        `Planifiez des activités importantes les ${days[bestDay]}s`,
        'Identifiez ce qui rend ces jours spéciaux',
        'Reproduisez ces conditions d\'autres jours'
      ]
    };
  }

  private detectMonthlyPattern(scans: any[]): PatternInsight | null {
    // Simplification: détecter si début ou fin de mois est meilleur
    if (scans.length < 30) return null;

    const startOfMonthScores: number[] = [];
    const endOfMonthScores: number[] = [];

    scans.forEach(scan => {
      const dayOfMonth = new Date(scan.created_at).getDate();
      const balance = scan.emotional_balance || 50;

      if (dayOfMonth <= 10) {
        startOfMonthScores.push(balance);
      } else if (dayOfMonth >= 20) {
        endOfMonthScores.push(balance);
      }
    });

    if (startOfMonthScores.length === 0 || endOfMonthScores.length === 0) return null;

    const avgStart = startOfMonthScores.reduce((a, b) => a + b, 0) / startOfMonthScores.length;
    const avgEnd = endOfMonthScores.reduce((a, b) => a + b, 0) / endOfMonthScores.length;

    const diff = Math.abs(avgStart - avgEnd);

    if (diff < 5) return null; // Pas de différence significative

    return {
      type: 'monthly',
      pattern: avgStart > avgEnd ? 'Début de mois plus positif' : 'Fin de mois plus positif',
      description: `Votre humeur varie selon la période du mois`,
      confidence: 0.6,
      occurrences: Math.min(startOfMonthScores.length, endOfMonthScores.length),
      recommendations: [
        'Préparez-vous aux périodes difficiles',
        'Profitez des périodes positives pour avancer sur vos objectifs'
      ]
    };
  }

  private detectJournalPattern(journalEntries: any[]): PatternInsight | null {
    if (journalEntries.length < 5) return null;

    const avgCompletion = journalEntries.reduce((sum, e) => sum + (e.completion_percentage || 0), 0) / journalEntries.length;

    if (avgCompletion > 70) {
      return {
        type: 'contextual',
        pattern: 'Pratique régulière du journal',
        description: `Vous complétez vos entrées de journal à ${avgCompletion.toFixed(0)}%`,
        confidence: 0.8,
        occurrences: journalEntries.length,
        recommendations: [
          'Votre régularité est excellente, continuez !',
          'Essayez de nouveaux templates pour varier',
          'Relisez vos anciennes entrées pour voir votre progression'
        ]
      };
    }

    return null;
  }

  private calculateSlope(points: Array<{ x: number; y: number }>): number {
    const n = points.length;
    if (n === 0) return 0;

    const sumX = points.reduce((sum, p) => sum + p.x, 0);
    const sumY = points.reduce((sum, p) => sum + p.y, 0);
    const sumXY = points.reduce((sum, p) => sum + p.x * p.y, 0);
    const sumX2 = points.reduce((sum, p) => sum + p.x * p.x, 0);

    return (n * sumXY - sumX * sumY) / (n * sumX2 - sumX * sumX);
  }

  private calculateVariance(values: number[]): number {
    const mean = values.reduce((a, b) => a + b, 0) / values.length;
    return values.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / values.length;
  }

  private balanceToMood(balance: number): string {
    if (balance >= 80) return 'excellent';
    if (balance >= 65) return 'good';
    if (balance >= 50) return 'neutral';
    if (balance >= 35) return 'low';
    return 'very_low';
  }

  private identifyInfluencingFactors(trends: EmotionTrend[]): string[] {
    const factors: string[] = [];

    // Analyser la tendance récente
    const recentSlope = this.calculateSlope(trends.map((t, i) => ({ x: i, y: t.emotionalBalance })));

    if (recentSlope > 2) {
      factors.push('Amélioration continue récente');
    } else if (recentSlope < -2) {
      factors.push('Déclin récent observé');
    }

    // Analyser la variance
    const variance = this.calculateVariance(trends.map(t => t.emotionalBalance));

    if (variance > 300) {
      factors.push('Variation émotionnelle élevée');
    } else if (variance < 100) {
      factors.push('Stabilité émotionnelle');
    }

    return factors.length > 0 ? factors : ['Données historiques'];
  }

  private generateSummaryText(analysis: AnalyticsInsight): string {
    const { wellnessProjection, riskAlerts, patterns } = analysis;

    let summary = `Analyse prédictive du bien-être émotionnel. `;

    summary += `Tendance générale: ${wellnessProjection.overallTrend === 'improving' ? 'en amélioration' : wellnessProjection.overallTrend === 'declining' ? 'en déclin' : 'stable'}. `;

    summary += `Score projeté à 1 mois: ${wellnessProjection.projectedScore.toFixed(0)}/100. `;

    if (riskAlerts.length > 0) {
      summary += `${riskAlerts.length} alerte(s) détectée(s). `;
    }

    if (patterns.length > 0) {
      summary += `${patterns.length} pattern(s) identifié(s). `;
    }

    return summary;
  }

  private extractInsights(analysis: AnalyticsInsight): string[] {
    const insights: string[] = [];

    // Insights des patterns
    analysis.patterns.forEach(pattern => {
      if (pattern.confidence > 0.6) {
        insights.push(pattern.description);
      }
    });

    // Insights des alertes
    analysis.riskAlerts.forEach(alert => {
      if (alert.severity !== 'low') {
        insights.push(alert.message);
      }
    });

    // Insights de la projection
    analysis.wellnessProjection.keyFactors
      .filter(f => Math.abs(f.impact) > 20)
      .forEach(factor => {
        insights.push(`${factor.factor}: impact ${factor.impact > 0 ? 'positif' : 'négatif'} de ${Math.abs(factor.impact).toFixed(0)}%`);
      });

    return insights;
  }
}

export const predictiveAnalyticsService = new PredictiveAnalyticsService();
