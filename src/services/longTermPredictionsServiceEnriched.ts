/**
 * LongTermPredictionsServiceEnriched - Prédictions enrichies avec export, historique, alertes
 */

import { supabase } from '@/integrations/supabase/client';
import { logger } from '@/lib/logger';

// Types existants (importés du service original)
export type TimeframeType = '3months' | '6months' | '12months';
export type PatternType = 'weekly' | 'monthly' | 'seasonal' | 'contextual' | 'trend';
export type RiskLevel = 'low' | 'medium' | 'high' | 'critical';

export interface EmotionalForecast {
  id: string;
  timeframe: TimeframeType;
  generatedAt: string;
  dataPoints: number;
  confidence: number;
  monthlyForecasts: MonthlyForecast[];
  patterns: IdentifiedPattern[];
  riskIndicators: RiskIndicator[];
  wellnessOpportunities: WellnessOpportunity[];
  aiInsights: string;
  stats: PredictionStats;
}

export interface MonthlyForecast {
  month: string;
  predictedEmotionBalance: number;
  dominantEmotions: { emotion: string; probability: number }[];
  expectedChallenge: string | null;
  expectedOpportunity: string | null;
  confidence: number;
}

export interface IdentifiedPattern {
  type: PatternType;
  description: string;
  frequency: string;
  emotionImpact: number;
  confidence: number;
  occurrences: number;
  examples?: string[];
}

export interface RiskIndicator {
  type: 'mood_decline' | 'stress_buildup' | 'isolation_risk' | 'burnout_risk' | 'seasonal_depression';
  description: string;
  severity: RiskLevel;
  estimatedStartMonth?: string;
  mitigationStrategies: string[];
  probability: number;
}

export interface WellnessOpportunity {
  type: 'peak_energy' | 'positive_pattern' | 'recovery_window' | 'growth_period';
  description: string;
  expectedMonth: string;
  actionItems: string[];
  expectedBenefit: string;
  priority: 'low' | 'medium' | 'high';
}

export interface PredictionStats {
  dataMonthsAvailable: number;
  dataPointsAnalyzed: number;
  accuracyScore: number;
  volatilityIndex: number;
  improvementTrend: number;
}

// Types enrichis
export interface PredictionAlert {
  id: string;
  forecastId: string;
  type: 'risk_detected' | 'opportunity' | 'accuracy_drop' | 'pattern_change';
  severity: 'info' | 'warning' | 'critical';
  title: string;
  message: string;
  createdAt: string;
  acknowledged: boolean;
  acknowledgedAt?: string;
}

export interface PredictionComparison {
  currentForecast: EmotionalForecast;
  previousForecast: EmotionalForecast | null;
  changes: {
    confidenceDiff: number;
    riskChange: 'increased' | 'decreased' | 'stable';
    newPatterns: IdentifiedPattern[];
    resolvedRisks: RiskIndicator[];
    newRisks: RiskIndicator[];
  };
}

export interface AccuracyMetrics {
  forecastId: string;
  month: string;
  predictedBalance: number;
  actualBalance: number;
  accuracy: number;
  createdAt: string;
}

const FORECASTS_KEY = 'predictions-forecasts-history';
const ALERTS_KEY = 'predictions-alerts';
const ACCURACY_KEY = 'predictions-accuracy';
const FAVORITES_KEY = 'predictions-favorites';

class LongTermPredictionsServiceEnriched {
  // Générer des prédictions (utilise le service original et enrichit)
  async generateLongTermPredictions(
    userId: string,
    timeframe: TimeframeType = '6months'
  ): Promise<EmotionalForecast> {
    try {
      logger.info(`Generating enriched ${timeframe} forecast`, { userId }, 'PREDICTIONS');

      // Récupérer l'historique précédent pour comparaison
      const previousForecast = this.getLatestForecast();

      // Générer la prédiction
      const historicalData = await this.fetchHistoricalData(userId);

      if (historicalData.length < 7) {
        throw new Error('Données historiques insuffisantes (minimum 7 points requis)');
      }

      const patterns = this.analyzePatterns(historicalData);
      const monthlyForecasts = this.generateMonthlyForecasts(historicalData, patterns, timeframe);
      const riskIndicators = this.detectRiskIndicators(historicalData, monthlyForecasts, patterns);
      const opportunities = this.identifyWellnessOpportunities(patterns, monthlyForecasts);
      const aiInsights = this.generateInsights(patterns, riskIndicators, opportunities);
      const stats = this.calculateStats(historicalData, patterns);

      const forecast: EmotionalForecast = {
        id: `forecast-${Date.now()}`,
        timeframe,
        generatedAt: new Date().toISOString(),
        dataPoints: historicalData.length,
        confidence: this.calculateConfidence(historicalData, patterns),
        monthlyForecasts,
        patterns,
        riskIndicators,
        wellnessOpportunities: opportunities,
        aiInsights,
        stats
      };

      // Sauvegarder
      this.saveForecast(forecast);

      // Générer des alertes si nécessaire
      this.generateAlerts(forecast, previousForecast);

      // Vérifier l'exactitude des prédictions passées
      await this.checkPastPredictionAccuracy(userId);

      logger.info('Enriched forecast generated', {
        patterns: patterns.length,
        risks: riskIndicators.length
      }, 'PREDICTIONS');

      return forecast;

    } catch (error) {
      logger.error('Failed to generate predictions', error as Error, 'PREDICTIONS');
      throw error;
    }
  }

  // Récupérer les données historiques
  private async fetchHistoricalData(userId: string): Promise<any[]> {
    const oneYearAgo = new Date();
    oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);

    const { data: scans, error } = await supabase
      .from('emotion_scans')
      .select('*')
      .eq('user_id', userId)
      .gte('created_at', oneYearAgo.toISOString())
      .order('created_at', { ascending: true });

    if (error) throw error;

    return (scans || []).map((scan: any) => ({
      date: new Date(scan.created_at).toISOString().split('T')[0],
      emotionBalance: scan.emotional_balance || 50,
      dominantEmotion: scan.mood || 'neutral',
      confidence: scan.confidence || 0.5,
      intensity: scan.mood_score || 5
    }));
  }

  // Analyser les patterns
  private analyzePatterns(data: any[]): IdentifiedPattern[] {
    const patterns: IdentifiedPattern[] = [];

    // Pattern hebdomadaire
    const dayScores: Record<number, number[]> = {};
    data.forEach(point => {
      const day = new Date(point.date).getDay();
      if (!dayScores[day]) dayScores[day] = [];
      dayScores[day].push(point.emotionBalance);
    });

    const dayNames = ['Dimanche', 'Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi'];
    const dayAverages = Object.entries(dayScores)
      .map(([day, scores]) => ({
        day: parseInt(day),
        avg: scores.reduce((a, b) => a + b, 0) / scores.length
      }))
      .sort((a, b) => b.avg - a.avg);

    if (dayAverages.length >= 3) {
      patterns.push({
        type: 'weekly',
        description: `Meilleurs jours: ${dayNames[dayAverages[0].day]}. Moins bons: ${dayNames[dayAverages[dayAverages.length - 1].day]}`,
        frequency: 'Chaque semaine',
        emotionImpact: dayAverages[0].avg - dayAverages[dayAverages.length - 1].avg,
        confidence: 0.7,
        occurrences: data.length
      });
    }

    // Pattern de tendance
    const midPoint = Math.floor(data.length / 2);
    const firstHalf = data.slice(0, midPoint).reduce((s, d) => s + d.emotionBalance, 0) / midPoint;
    const secondHalf = data.slice(midPoint).reduce((s, d) => s + d.emotionBalance, 0) / (data.length - midPoint);
    const trend = secondHalf - firstHalf;

    if (Math.abs(trend) > 5) {
      patterns.push({
        type: 'trend',
        description: trend > 0 ? 'Tendance positive sur la période' : 'Tendance à la baisse détectée',
        frequency: 'Globale',
        emotionImpact: trend,
        confidence: 0.75,
        occurrences: data.length
      });
    }

    return patterns;
  }

  // Générer les prédictions mensuelles
  private generateMonthlyForecasts(data: any[], patterns: IdentifiedPattern[], timeframe: TimeframeType): MonthlyForecast[] {
    const months = timeframe === '3months' ? 3 : timeframe === '6months' ? 6 : 12;
    const baseline = data.reduce((s, d) => s + d.emotionBalance, 0) / data.length;
    const trendPattern = patterns.find(p => p.type === 'trend');
    const trend = trendPattern ? trendPattern.emotionImpact / 100 : 0;

    const forecasts: MonthlyForecast[] = [];
    const today = new Date();

    for (let i = 1; i <= months; i++) {
      const date = new Date(today);
      date.setMonth(date.getMonth() + i);

      const predicted = Math.max(20, Math.min(80, baseline + trend * i * 2 + (Math.random() * 10 - 5)));

      forecasts.push({
        month: date.toISOString().substring(0, 7),
        predictedEmotionBalance: Math.round(predicted),
        dominantEmotions: [
          { emotion: 'calme', probability: 0.3 + Math.random() * 0.2 },
          { emotion: 'joie', probability: 0.2 + Math.random() * 0.2 }
        ],
        expectedChallenge: i % 3 === 0 ? 'Période potentiellement stressante' : null,
        expectedOpportunity: i % 2 === 0 ? 'Opportunité de croissance personnelle' : null,
        confidence: Math.max(0.5, 0.9 - i * 0.05)
      });
    }

    return forecasts;
  }

  // Détecter les risques
  private detectRiskIndicators(data: any[], forecasts: MonthlyForecast[], patterns: IdentifiedPattern[]): RiskIndicator[] {
    const risks: RiskIndicator[] = [];

    // Détecter une tendance négative
    const trendPattern = patterns.find(p => p.type === 'trend');
    if (trendPattern && trendPattern.emotionImpact < -10) {
      risks.push({
        type: 'mood_decline',
        description: 'Une tendance à la baisse de l\'humeur a été détectée',
        severity: trendPattern.emotionImpact < -20 ? 'high' : 'medium',
        mitigationStrategies: [
          'Augmenter les activités de bien-être',
          'Consulter un professionnel si nécessaire',
          'Maintenir des routines positives'
        ],
        probability: 0.7
      });
    }

    // Détecter risque saisonnier
    const month = new Date().getMonth();
    if (month >= 10 || month <= 2) {
      risks.push({
        type: 'seasonal_depression',
        description: 'Risque de baisse saisonnière pendant les mois d\'hiver',
        severity: 'medium',
        estimatedStartMonth: 'Novembre-Février',
        mitigationStrategies: [
          'Exposition à la lumière naturelle',
          'Activité physique régulière',
          'Maintien des connexions sociales'
        ],
        probability: 0.5
      });
    }

    return risks;
  }

  // Identifier les opportunités
  private identifyWellnessOpportunities(patterns: IdentifiedPattern[], forecasts: MonthlyForecast[]): WellnessOpportunity[] {
    const opportunities: WellnessOpportunity[] = [];

    const trendPattern = patterns.find(p => p.type === 'trend');
    if (trendPattern && trendPattern.emotionImpact > 5) {
      opportunities.push({
        type: 'positive_pattern',
        description: 'Vous êtes sur une trajectoire positive',
        expectedMonth: forecasts[0]?.month || '',
        actionItems: ['Continuer les pratiques actuelles', 'Renforcer les habitudes positives'],
        expectedBenefit: 'Consolidation du bien-être',
        priority: 'high'
      });
    }

    // Opportunité de récupération
    const highForecast = forecasts.find(f => f.predictedEmotionBalance > 65);
    if (highForecast) {
      opportunities.push({
        type: 'peak_energy',
        description: 'Période d\'énergie élevée prévue',
        expectedMonth: highForecast.month,
        actionItems: ['Planifier des projets importants', 'Profiter de cette énergie'],
        expectedBenefit: 'Productivité accrue',
        priority: 'medium'
      });
    }

    return opportunities;
  }

  // Générer les insights
  private generateInsights(patterns: IdentifiedPattern[], risks: RiskIndicator[], opportunities: WellnessOpportunity[]): string {
    const parts: string[] = [];

    if (patterns.length > 0) {
      parts.push(`${patterns.length} patterns identifiés dans vos données.`);
    }

    if (risks.length > 0) {
      const criticalRisks = risks.filter(r => r.severity === 'high' || r.severity === 'critical');
      if (criticalRisks.length > 0) {
        parts.push(`⚠️ ${criticalRisks.length} risque(s) important(s) à surveiller.`);
      }
    }

    if (opportunities.length > 0) {
      parts.push(`✨ ${opportunities.length} opportunité(s) de bien-être identifiée(s).`);
    }

    return parts.join(' ') || 'Continuez à enregistrer vos émotions pour des prédictions plus précises.';
  }

  // Calculer les stats
  private calculateStats(data: any[], patterns: IdentifiedPattern[]): PredictionStats {
    const uniqueMonths = new Set(data.map(d => d.date.substring(0, 7)));
    const avgBalance = data.reduce((s, d) => s + d.emotionBalance, 0) / data.length;
    const variance = data.reduce((s, d) => s + Math.pow(d.emotionBalance - avgBalance, 2), 0) / data.length;

    return {
      dataMonthsAvailable: uniqueMonths.size,
      dataPointsAnalyzed: data.length,
      accuracyScore: Math.min(1, data.length / 30), // Plus de données = plus précis
      volatilityIndex: Math.min(1, Math.sqrt(variance) / 30),
      improvementTrend: patterns.find(p => p.type === 'trend')?.emotionImpact || 0
    };
  }

  // Calculer la confiance
  private calculateConfidence(data: any[], patterns: IdentifiedPattern[]): number {
    const dataConfidence = Math.min(1, data.length / 50);
    const patternConfidence = patterns.length > 0 ? 0.3 : 0;
    return Math.min(1, dataConfidence * 0.7 + patternConfidence);
  }

  // === Fonctionnalités enrichies ===

  // Sauvegarder une prédiction
  private saveForecast(forecast: EmotionalForecast): void {
    const stored = localStorage.getItem(FORECASTS_KEY);
    const forecasts: EmotionalForecast[] = stored ? JSON.parse(stored) : [];
    forecasts.unshift(forecast);
    localStorage.setItem(FORECASTS_KEY, JSON.stringify(forecasts.slice(0, 20)));
  }

  // Obtenir la dernière prédiction
  getLatestForecast(): EmotionalForecast | null {
    const stored = localStorage.getItem(FORECASTS_KEY);
    const forecasts: EmotionalForecast[] = stored ? JSON.parse(stored) : [];
    return forecasts[0] || null;
  }

  // Obtenir l'historique des prédictions
  getForecastHistory(): EmotionalForecast[] {
    const stored = localStorage.getItem(FORECASTS_KEY);
    return stored ? JSON.parse(stored) : [];
  }

  // Générer des alertes
  private generateAlerts(current: EmotionalForecast, previous: EmotionalForecast | null): void {
    const alerts: PredictionAlert[] = [];

    // Alerte pour nouveaux risques
    current.riskIndicators.forEach(risk => {
      if (risk.severity === 'high' || risk.severity === 'critical') {
        alerts.push({
          id: `alert-${Date.now()}-${Math.random()}`,
          forecastId: current.id,
          type: 'risk_detected',
          severity: risk.severity === 'critical' ? 'critical' : 'warning',
          title: 'Risque détecté',
          message: risk.description,
          createdAt: new Date().toISOString(),
          acknowledged: false
        });
      }
    });

    // Alerte pour opportunités importantes
    current.wellnessOpportunities.filter(o => o.priority === 'high').forEach(opp => {
      alerts.push({
        id: `alert-${Date.now()}-${Math.random()}`,
        forecastId: current.id,
        type: 'opportunity',
        severity: 'info',
        title: 'Opportunité identifiée',
        message: opp.description,
        createdAt: new Date().toISOString(),
        acknowledged: false
      });
    });

    // Sauvegarder les alertes
    const stored = localStorage.getItem(ALERTS_KEY);
    const existingAlerts: PredictionAlert[] = stored ? JSON.parse(stored) : [];
    localStorage.setItem(ALERTS_KEY, JSON.stringify([...alerts, ...existingAlerts].slice(0, 50)));
  }

  // Obtenir les alertes
  getAlerts(unreadOnly = false): PredictionAlert[] {
    const stored = localStorage.getItem(ALERTS_KEY);
    const alerts: PredictionAlert[] = stored ? JSON.parse(stored) : [];
    return unreadOnly ? alerts.filter(a => !a.acknowledged) : alerts;
  }

  // Acquitter une alerte
  acknowledgeAlert(alertId: string): void {
    const alerts = this.getAlerts();
    const updated = alerts.map(a =>
      a.id === alertId ? { ...a, acknowledged: true, acknowledgedAt: new Date().toISOString() } : a
    );
    localStorage.setItem(ALERTS_KEY, JSON.stringify(updated));
  }

  // Vérifier l'exactitude des prédictions passées
  private async checkPastPredictionAccuracy(userId: string): Promise<void> {
    const forecasts = this.getForecastHistory();
    const today = new Date().toISOString().substring(0, 7);

    for (const forecast of forecasts) {
      const pastMonth = forecast.monthlyForecasts.find(m => m.month < today);
      if (!pastMonth) continue;

      // Récupérer les données réelles pour ce mois
      const { data: scans } = await supabase
        .from('emotion_scans')
        .select('emotional_balance')
        .eq('user_id', userId)
        .gte('created_at', `${pastMonth.month}-01`)
        .lt('created_at', `${pastMonth.month}-32`);

      if (scans && scans.length > 0) {
        const actualBalance = scans.reduce((s, scan) => s + (scan.emotional_balance || 50), 0) / scans.length;
        const accuracy = 100 - Math.abs(pastMonth.predictedEmotionBalance - actualBalance);

        const metric: AccuracyMetrics = {
          forecastId: forecast.id,
          month: pastMonth.month,
          predictedBalance: pastMonth.predictedEmotionBalance,
          actualBalance: Math.round(actualBalance),
          accuracy: Math.max(0, accuracy),
          createdAt: new Date().toISOString()
        };

        this.saveAccuracyMetric(metric);
      }
    }
  }

  // Sauvegarder une métrique d'exactitude
  private saveAccuracyMetric(metric: AccuracyMetrics): void {
    const stored = localStorage.getItem(ACCURACY_KEY);
    const metrics: AccuracyMetrics[] = stored ? JSON.parse(stored) : [];

    // Éviter les doublons
    if (!metrics.find(m => m.forecastId === metric.forecastId && m.month === metric.month)) {
      metrics.unshift(metric);
      localStorage.setItem(ACCURACY_KEY, JSON.stringify(metrics.slice(0, 100)));
    }
  }

  // Obtenir les métriques d'exactitude
  getAccuracyMetrics(): AccuracyMetrics[] {
    const stored = localStorage.getItem(ACCURACY_KEY);
    return stored ? JSON.parse(stored) : [];
  }

  // Comparer deux prédictions
  comparePredictions(currentId: string, previousId: string): PredictionComparison | null {
    const forecasts = this.getForecastHistory();
    const current = forecasts.find(f => f.id === currentId);
    const previous = forecasts.find(f => f.id === previousId);

    if (!current) return null;

    const previousRiskTypes = new Set(previous?.riskIndicators.map(r => r.type) || []);
    const currentRiskTypes = new Set(current.riskIndicators.map(r => r.type));

    return {
      currentForecast: current,
      previousForecast: previous || null,
      changes: {
        confidenceDiff: current.confidence - (previous?.confidence || 0),
        riskChange: current.riskIndicators.length > (previous?.riskIndicators.length || 0) ? 'increased' :
          current.riskIndicators.length < (previous?.riskIndicators.length || 0) ? 'decreased' : 'stable',
        newPatterns: current.patterns.filter(p => !previous?.patterns.find(pp => pp.type === p.type)),
        resolvedRisks: previous?.riskIndicators.filter(r => !currentRiskTypes.has(r.type)) || [],
        newRisks: current.riskIndicators.filter(r => !previousRiskTypes.has(r.type))
      }
    };
  }

  // Exporter les prédictions
  exportPredictions(format: 'json' | 'csv' = 'json'): string {
    const forecasts = this.getForecastHistory();
    const alerts = this.getAlerts();
    const accuracy = this.getAccuracyMetrics();

    if (format === 'csv') {
      const headers = 'Forecast ID,Timeframe,Generated At,Confidence,Patterns,Risks,Opportunities\n';
      const rows = forecasts.map(f =>
        `${f.id},${f.timeframe},${f.generatedAt},${f.confidence},${f.patterns.length},${f.riskIndicators.length},${f.wellnessOpportunities.length}`
      ).join('\n');
      return headers + rows;
    }

    return JSON.stringify({ forecasts, alerts, accuracy, exportedAt: new Date().toISOString() }, null, 2);
  }

  // Favoris
  toggleFavorite(forecastId: string): boolean {
    const stored = localStorage.getItem(FAVORITES_KEY);
    const favorites: string[] = stored ? JSON.parse(stored) : [];

    const index = favorites.indexOf(forecastId);
    if (index > -1) {
      favorites.splice(index, 1);
    } else {
      favorites.push(forecastId);
    }

    localStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites));
    return index === -1;
  }

  getFavorites(): string[] {
    const stored = localStorage.getItem(FAVORITES_KEY);
    return stored ? JSON.parse(stored) : [];
  }
}

export const longTermPredictionsServiceEnriched = new LongTermPredictionsServiceEnriched();
export default longTermPredictionsServiceEnriched;
