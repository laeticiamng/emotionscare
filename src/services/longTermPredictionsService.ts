/**
 * Long-Term Predictions Service - Phase 4.2
 * Analyse des patterns historiques et prédictions IA pour 3-6-12 mois
 */

import { supabase } from '@/integrations/supabase/client';
import { logger } from '@/lib/logger';

// Types de prédictions
export type TimeframeType = '3months' | '6months' | '12months';
export type PatternType = 'weekly' | 'monthly' | 'seasonal' | 'contextual' | 'trend';
export type RiskLevel = 'low' | 'medium' | 'high' | 'critical';

export interface EmotionalForecast {
  timeframe: TimeframeType;
  generatedAt: Date;
  dataPoints: number;
  confidence: number; // 0-1

  // Prédictions mensuelles
  monthlyForecasts: MonthlyForecast[];

  // Patterns identifiés
  patterns: IdentifiedPattern[];

  // Risques détectés
  riskIndicators: RiskIndicator[];

  // Opportunités de bien-être
  wellnessOpportunities: WellnessOpportunity[];

  // Insigths IA enrichis
  aiInsights: string;

  // Statistiques
  stats: PredictionStats;
}

export interface MonthlyForecast {
  month: string; // "2025-01", "2025-02", etc.
  predictedEmotionBalance: number; // 0-100
  dominantEmotions: Array<{
    emotion: string;
    probability: number; // 0-1
  }>;
  expectedChallenge: string | null;
  expectedOpportunity: string | null;
  confidence: number; // 0-1
}

export interface IdentifiedPattern {
  type: PatternType;
  description: string;
  frequency: string; // "Every Monday", "Beginning of month", "Q1 seasonal", etc.
  emotionImpact: number; // -100 to +100
  confidence: number; // 0-1
  occurrences: number;
  examples?: string[];
}

export interface RiskIndicator {
  type: 'mood_decline' | 'stress_buildup' | 'isolation_risk' | 'burnout_risk' | 'seasonal_depression';
  description: string;
  severity: RiskLevel;
  estimatedStartMonth?: string;
  mitigationStrategies: string[];
  probability: number; // 0-1
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
  accuracyScore: number; // 0-1, based on historical pattern consistency
  volatilityIndex: number; // 0-1, emotional stability
  improvementTrend: number; // -1 to 1, overall direction
}

export interface HistoricalEmotionData {
  date: string;
  emotionBalance: number;
  dominantEmotion: string;
  confidence: number;
  intensity: number;
  context?: string[];
}

class LongTermPredictionsService {
  /**
   * Générer des prédictions long-terme
   */
  async generateLongTermPredictions(
    userId: string,
    timeframe: TimeframeType = '6months'
  ): Promise<EmotionalForecast> {
    try {
      logger.info(
        `Generating ${timeframe} forecast for user ${userId}`,
        {},
        'PREDICTIONS'
      );

      // 1. Récupérer les données historiques
      const historicalData = await this.fetchHistoricalData(userId);

      if (historicalData.length < 7) {
        throw new Error('Insufficient historical data (minimum 7 data points required)');
      }

      // 2. Analyser les patterns
      const patterns = this.analyzePatterns(historicalData);

      // 3. Générer les prédictions
      const monthlyForecasts = this.generateMonthlyForecasts(
        historicalData,
        patterns,
        timeframe
      );

      // 4. Détecter les risques
      const riskIndicators = this.detectRiskIndicators(
        historicalData,
        monthlyForecasts,
        patterns
      );

      // 5. Identifier les opportunités
      const opportunities = this.identifyWellnessOpportunities(
        patterns,
        monthlyForecasts
      );

      // 6. Générer les insights IA
      const aiInsights = await this.generateAIInsights(
        patterns,
        monthlyForecasts,
        riskIndicators,
        opportunities,
        historicalData
      );

      // 7. Calculer les statistiques
      const stats = this.calculateStats(historicalData, patterns, monthlyForecasts);

      const forecast: EmotionalForecast = {
        timeframe,
        generatedAt: new Date(),
        dataPoints: historicalData.length,
        confidence: this.calculateConfidence(historicalData, patterns),
        monthlyForecasts,
        patterns,
        riskIndicators,
        wellnessOpportunities: opportunities,
        aiInsights,
        stats,
      };

      logger.info(
        `Forecast generated successfully`,
        {
          timeframe,
          patterns: patterns.length,
          risks: riskIndicators.length,
          opportunities: opportunities.length,
        },
        'PREDICTIONS'
      );

      return forecast;
    } catch (error) {
      logger.error(
        'Failed to generate long-term predictions',
        error as Error,
        'PREDICTIONS'
      );
      throw error;
    }
  }

  /**
   * Récupérer les données historiques
   */
  private async fetchHistoricalData(userId: string): Promise<HistoricalEmotionData[]> {
    try {
      // Récupérer 12 mois de données maximum
      const oneYearAgo = new Date();
      oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);

      const { data: scans, error } = await supabase
        .from('emotion_scans')
        .select('*')
        .eq('user_id', userId)
        .gte('created_at', oneYearAgo.toISOString())
        .order('created_at', { ascending: true });

      if (error) throw error;

      if (!scans || scans.length === 0) {
        return [];
      }

      // Transformer en format prévisible
      return scans.map((scan: any) => ({
        date: new Date(scan.created_at).toISOString().split('T')[0],
        emotionBalance: scan.emotional_balance || 50,
        dominantEmotion: scan.mood || 'neutral',
        confidence: scan.confidence || 0.5,
        intensity: scan.mood_score || 5,
        context: scan.recommendations || [],
      }));
    } catch (error) {
      logger.error('Failed to fetch historical data', error as Error, 'PREDICTIONS');
      return [];
    }
  }

  /**
   * Analyser les patterns dans les données historiques
   */
  private analyzePatterns(data: HistoricalEmotionData[]): IdentifiedPattern[] {
    const patterns: IdentifiedPattern[] = [];

    if (data.length < 7) return patterns;

    // 1. Pattern hebdomadaire
    const weeklyPattern = this.analyzeWeeklyPattern(data);
    if (weeklyPattern) patterns.push(weeklyPattern);

    // 2. Pattern mensuel
    const monthlyPattern = this.analyzeMonthlyPattern(data);
    if (monthlyPattern) patterns.push(monthlyPattern);

    // 3. Pattern saisonnier
    const seasonalPattern = this.analyzeSeasonalPattern(data);
    if (seasonalPattern) patterns.push(seasonalPattern);

    // 4. Trend général
    const trendPattern = this.analyzeTrendPattern(data);
    if (trendPattern) patterns.push(trendPattern);

    // 5. Pattern contextuel (émotions fréquentes)
    const contextualPatterns = this.analyzeContextualPatterns(data);
    patterns.push(...contextualPatterns);

    return patterns;
  }

  /**
   * Analyser les patterns hebdomadaires
   */
  private analyzeWeeklyPattern(
    data: HistoricalEmotionData[]
  ): IdentifiedPattern | null {
    const dayScores: { [key: number]: number[] } = {};

    // Grouper par jour de la semaine
    data.forEach((point) => {
      const dayOfWeek = new Date(point.date).getDay();
      if (!dayScores[dayOfWeek]) dayScores[dayOfWeek] = [];
      dayScores[dayOfWeek].push(point.emotionBalance);
    });

    // Calculer les moyennes
    const dayAverages = Object.entries(dayScores)
      .map(([day, scores]) => ({
        day: parseInt(day),
        average: scores.reduce((a, b) => a + b, 0) / scores.length,
      }))
      .sort((a, b) => b.average - a.average);

    if (dayAverages.length < 3) return null;

    const bestDay = ['Dimanche', 'Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi'][
      dayAverages[0].day
    ];
    const worstDay = ['Dimanche', 'Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi'][
      dayAverages[dayAverages.length - 1].day
    ];

    const impact =
      (dayAverages[0].average - dayAverages[dayAverages.length - 1].average) / 2 - 50;

    return {
      type: 'weekly',
      description: `Vos meilleurs jours sont généralement les ${bestDay}s, et vous avez tendance à être moins énergique le ${worstDay}`,
      frequency: 'Chaque semaine',
      emotionImpact: impact,
      confidence: Math.min(
        1,
        Object.keys(dayScores).length / 7 * 0.8
      ),
      occurrences: Object.keys(dayScores).length,
    };
  }

  /**
   * Analyser les patterns mensuels
   */
  private analyzeMonthlyPattern(
    data: HistoricalEmotionData[]
  ): IdentifiedPattern | null {
    const monthPhases: { [key: string]: number[] } = {
      beginning: [], // Jours 1-10
      middle: [],    // Jours 11-20
      end: [],       // Jours 21-31
    };

    data.forEach((point) => {
      const dayOfMonth = parseInt(point.date.split('-')[2]);
      if (dayOfMonth <= 10) monthPhases.beginning.push(point.emotionBalance);
      else if (dayOfMonth <= 20) monthPhases.middle.push(point.emotionBalance);
      else monthPhases.end.push(point.emotionBalance);
    });

    const phaseAverages = {
      beginning: monthPhases.beginning.length > 0 ?
        monthPhases.beginning.reduce((a, b) => a + b, 0) / monthPhases.beginning.length : 0,
      middle: monthPhases.middle.length > 0 ?
        monthPhases.middle.reduce((a, b) => a + b, 0) / monthPhases.middle.length : 0,
      end: monthPhases.end.length > 0 ?
        monthPhases.end.reduce((a, b) => a + b, 0) / monthPhases.end.length : 0,
    };

    const diff = Math.abs(phaseAverages.beginning - phaseAverages.end);
    if (diff < 10) return null; // Pas de pattern significatif

    const bestPhase = Object.entries(phaseAverages).sort(([, a], [, b]) => b - a)[0];

    return {
      type: 'monthly',
      description: `Un pattern mensuel est détectable : vous vous sentez généralement mieux en ${
        bestPhase[0] === 'beginning' ? 'début' : bestPhase[0] === 'middle' ? 'milieu' : 'fin'
      } de mois`,
      frequency: 'Chaque mois',
      emotionImpact: (phaseAverages.beginning - 50) * 0.1,
      confidence: 0.6,
      occurrences: Math.min(
        Math.floor(data.length / 30),
        12
      ),
    };
  }

  /**
   * Analyser les patterns saisonniers
   */
  private analyzeSeasonalPattern(
    data: HistoricalEmotionData[]
  ): IdentifiedPattern | null {
    const seasonScores: { [key: string]: number[] } = {
      winter: [],   // Dec, Jan, Feb
      spring: [],   // Mar, Apr, May
      summer: [],   // Jun, Jul, Aug
      autumn: [],   // Sep, Oct, Nov
    };

    data.forEach((point) => {
      const month = parseInt(point.date.split('-')[1]);
      if ([12, 1, 2].includes(month)) seasonScores.winter.push(point.emotionBalance);
      else if ([3, 4, 5].includes(month)) seasonScores.spring.push(point.emotionBalance);
      else if ([6, 7, 8].includes(month)) seasonScores.summer.push(point.emotionBalance);
      else seasonScores.autumn.push(point.emotionBalance);
    });

    const seasonAverages = Object.entries(seasonScores)
      .filter(([, scores]) => scores.length > 0)
      .map(([season, scores]) => ({
        season,
        average: scores.reduce((a, b) => a + b, 0) / scores.length,
      }));

    if (seasonAverages.length < 2) return null;

    const best = seasonAverages.sort((a, b) => b.average - a.average)[0];
    const worst = seasonAverages.sort((a, b) => a.average - b.average)[0];

    const seasonNames: { [key: string]: string } = {
      winter: 'hiver',
      spring: 'printemps',
      summer: 'été',
      autumn: 'automne',
    };

    const diff = best.average - worst.average;
    if (diff < 5) return null; // Pas de pattern significatif

    return {
      type: 'seasonal',
      description: `Vous avez une préférence saisonnière : vous vous sentez mieux en ${seasonNames[best.season]} qu'en ${seasonNames[worst.season]}`,
      frequency: 'Annuellement',
      emotionImpact: (best.average - 50) * 0.1,
      confidence: 0.7,
      occurrences: Math.max(...seasonAverages.map((s) => 1)),
    };
  }

  /**
   * Analyser le trend général
   */
  private analyzeTrendPattern(
    data: HistoricalEmotionData[]
  ): IdentifiedPattern | null {
    if (data.length < 14) return null;

    // Comparer première moitié vs deuxième moitié
    const mid = Math.floor(data.length / 2);
    const firstHalf = data.slice(0, mid).reduce((sum, d) => sum + d.emotionBalance, 0) / mid;
    const secondHalf = data
      .slice(mid)
      .reduce((sum, d) => sum + d.emotionBalance, 0) / (data.length - mid);

    const trendDiff = secondHalf - firstHalf;
    if (Math.abs(trendDiff) < 5) return null;

    return {
      type: 'trend',
      description:
        trendDiff > 0
          ? `Tendance positive : votre bien-être émotionnel s'améliore globalement`
          : `Tendance à la baisse : il y a une graduelle dégradation de votre bien-être`,
      frequency: 'Tendance générale',
      emotionImpact: trendDiff,
      confidence: 0.75,
      occurrences: data.length,
    };
  }

  /**
   * Analyser les patterns contextuels (émotions fréquentes)
   */
  private analyzeContextualPatterns(data: HistoricalEmotionData[]): IdentifiedPattern[] {
    const emotionFreq: { [key: string]: number } = {};

    data.forEach((point) => {
      emotionFreq[point.dominantEmotion] = (emotionFreq[point.dominantEmotion] || 0) + 1;
    });

    const sorted = Object.entries(emotionFreq)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 3);

    return sorted.map(([emotion, count]) => ({
      type: 'contextual',
      description: `L'émotion "${emotion}" revient fréquemment dans vos données`,
      frequency: `${Math.round((count / data.length) * 100)}% des scans`,
      emotionImpact: emotion.includes('joie') || emotion.includes('calme') ? 15 : -15,
      confidence: (count / data.length) * 0.8,
      occurrences: count,
    }));
  }

  /**
   * Générer les prédictions mensuelles
   */
  private generateMonthlyForecasts(
    data: HistoricalEmotionData[],
    patterns: IdentifiedPattern[],
    timeframe: TimeframeType
  ): MonthlyForecast[] {
    const months = timeframe === '3months' ? 3 : timeframe === '6months' ? 6 : 12;
    const today = new Date();
    const forecasts: MonthlyForecast[] = [];

    // Calculer la moyenne de base
    const baselineBalance =
      data.reduce((sum, d) => d.emotionBalance, 0) / data.length;

    // Calculer le trend
    const trendPattern = patterns.find((p) => p.type === 'trend');
    const trend = trendPattern ? trendPattern.emotionImpact / 100 : 0;

    for (let i = 1; i <= months; i++) {
      const date = new Date(today);
      date.setMonth(date.getMonth() + i);

      // Appliquer les patterns saisonniers
      let seasonalModifier = 0;
      const seasonalPattern = patterns.find((p) => p.type === 'seasonal');
      if (seasonalPattern) {
        seasonalModifier = seasonalPattern.emotionImpact / 100;
      }

      // Appliquer le trend
      const trendModifier = trend * i;

      const predictedBalance = Math.max(
        20,
        Math.min(
          80,
          baselineBalance + seasonalModifier * 5 + trendModifier * 2 + Math.random() * 10 - 5
        )
      );

      forecasts.push({
        month: date.toISOString().slice(0, 7),
        predictedEmotionBalance: Math.round(predictedBalance),
        dominantEmotions: this.predictDominantEmotions(data, seasonalModifier),
        expectedChallenge: this.predictChallenge(patterns, i),
        expectedOpportunity: this.predictOpportunity(patterns, i),
        confidence: Math.max(0.5, 0.9 - i * 0.05),
      });
    }

    return forecasts;
  }

  /**
   * Prédire les émotions dominantes
   */
  private predictDominantEmotions(
    data: HistoricalEmotionData[],
    seasonalModifier: number
  ): Array<{ emotion: string; probability: number }> {
    const emotionFreq: { [key: string]: number } = {};

    data.forEach((d) => {
      emotionFreq[d.dominantEmotion] = (emotionFreq[d.dominantEmotion] || 0) + 1;
    });

    return Object.entries(emotionFreq)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 3)
      .map(([emotion, count]) => ({
        emotion,
        probability: Math.min(
          1,
          (count / data.length) * (1 + seasonalModifier)
        ),
      }));
  }

  /**
   * Prédire les défis
   */
  private predictChallenge(patterns: IdentifiedPattern[], monthOffset: number): string | null {
    const riskPatterns = patterns.filter((p) => p.emotionImpact < 0);
    if (riskPatterns.length === 0) return null;

    const season = ['', 'hiver', 'hiver', 'printemps', 'printemps', 'printemps', 'été', 'été', 'été', 'automne', 'automne', 'automne', 'hiver'][monthOffset] || '';
    if (season === 'hiver' && riskPatterns.some((p) => p.type === 'seasonal')) {
      return 'Période potentiellement plus difficile basée sur vos patterns saisonniers';
    }

    return null;
  }

  /**
   * Prédire les opportunités
   */
  private predictOpportunity(patterns: IdentifiedPattern[], monthOffset: number): string | null {
    const positivePatterns = patterns.filter((p) => p.emotionImpact > 0);
    if (positivePatterns.length === 0) return null;

    return 'Opportunité de croissance émotionnelle basée sur vos patterns positifs';
  }

  /**
   * Détecter les risques
   */
  private detectRiskIndicators(
    data: HistoricalEmotionData[],
    forecasts: MonthlyForecast[],
    patterns: IdentifiedPattern[]
  ): RiskIndicator[] {
    const risks: RiskIndicator[] = [];

    // 1. Mood decline
    if (data.length >= 14) {
      const recent = data.slice(-14).reduce((sum, d) => sum + d.emotionBalance, 0) / 14;
      const previous = data.slice(-28, -14).reduce((sum, d) => sum + d.emotionBalance, 0) / 14;

      if (previous - recent > 10) {
        risks.push({
          type: 'mood_decline',
          description: 'Tendance à la baisse du bien-être émotionnel detectée',
          severity: previous - recent > 20 ? 'high' : 'medium',
          mitigationStrategies: [
            'Augmenter les sessions de relaxation',
            'Pratiquer la pleine conscience',
            'Chercher du soutien social',
          ],
          probability: Math.min(1, (previous - recent) / 50),
        });
      }
    }

    // 2. Seasonal depression (hiver)
    const winterPattern = patterns.find((p) => p.type === 'seasonal' && p.emotionImpact < 0);
    if (winterPattern) {
      risks.push({
        type: 'seasonal_depression',
        description: 'Vous pouvez expérimenter une baisse saisonnière du moral en hiver',
        severity: 'medium',
        estimatedStartMonth: '2025-12',
        mitigationStrategies: [
          'Augmenter la luminothérapie',
          'Pratiquer des exercices réguliers',
          'Maintenir les connexions sociales',
        ],
        probability: 0.6,
      });
    }

    // 3. Burnout risk (patterns déclinants)
    const trendPattern = patterns.find((p) => p.type === 'trend');
    if (trendPattern && trendPattern.emotionImpact < -20) {
      risks.push({
        type: 'burnout_risk',
        description: 'Signes potentiels de surmenage ou d\'épuisement émotionnel',
        severity: 'high',
        mitigationStrategies: [
          'Prendre des pauses régulières',
          'Réévaluer les objectifs et priorités',
          'Consulter un professionnel si nécessaire',
        ],
        probability: 0.5,
      });
    }

    return risks;
  }

  /**
   * Identifier les opportunités de bien-être
   */
  private identifyWellnessOpportunities(
    patterns: IdentifiedPattern[],
    forecasts: MonthlyForecast[]
  ): WellnessOpportunity[] {
    const opportunities: WellnessOpportunity[] = [];

    // 1. Peak energy periods
    const positiveForecasts = forecasts.filter((f) => f.predictedEmotionBalance > 60);
    if (positiveForecasts.length > 0) {
      const peakMonth = positiveForecasts[0].month;
      opportunities.push({
        type: 'peak_energy',
        description: 'Période d\'énergie élevée et de bien-être émotionnel',
        expectedMonth: peakMonth,
        actionItems: [
          'Lancer de nouveaux projets créatifs',
          'Renforcer les relations sociales',
          'Mettre en place de nouvelles habitudes saines',
        ],
        expectedBenefit: 'Accélération de la croissance personnelle',
        priority: 'high',
      });
    }

    // 2. Seasonal advantages
    const seasonalPattern = patterns.find((p) => p.type === 'seasonal' && p.emotionImpact > 0);
    if (seasonalPattern) {
      opportunities.push({
        type: 'recovery_window',
        description: 'Période saisonnière favorable pour la récupération et le renouvellement',
        expectedMonth: '', // À déterminer selon la saison
        actionItems: [
          'Planifier les activités importantes',
          'Renforcer les pratiques de bien-être',
        ],
        expectedBenefit: 'Stabilité émotionnelle accrue',
        priority: 'medium',
      });
    }

    return opportunities;
  }

  /**
   * Générer les insights IA avec OpenAI
   */
  private async generateAIInsights(
    patterns: IdentifiedPattern[],
    forecasts: MonthlyForecast[],
    risks: RiskIndicator[],
    opportunities: WellnessOpportunity[],
    historicalData: HistoricalEmotionData[]
  ): Promise<string> {
    try {
      const prompt = `
Vous êtes un coach émotionnel expert. Basé sur les données suivantes, générez un insight personnalisé et encourageant (2-3 paragraphes, max 300 mots):

**Patterns identifiés:**
${patterns.slice(0, 3).map((p) => `- ${p.description} (Confiance: ${Math.round(p.confidence * 100)}%)`).join('\n')}

**Risques détectés:**
${risks.slice(0, 2).map((r) => `- ${r.description} (Sévérité: ${r.severity})`).join('\n')}

**Opportunités:**
${opportunities.slice(0, 2).map((o) => `- ${o.description}`).join('\n')}

**Données historiques:**
- Nombre de scans: ${historicalData.length}
- Bien-être moyen: ${Math.round(historicalData.reduce((s, d) => s + d.emotionBalance, 0) / historicalData.length)}/100
- Période analysée: ${historicalData.length} jours

Provide warm, actionable, and personalized insights. Respond in French.
`;

      // Utiliser l'Edge Function openai-chat au lieu de l'API directe
      const { data, error } = await supabase.functions.invoke('openai-chat', {
        body: {
          messages: [
            {
              role: 'system',
              content:
                'Vous êtes un coach émotionnel bienveillant et expert en bien-être psychologique. Répondez toujours en français de manière chaleureuse et encourageante.',
            },
            {
              role: 'user',
              content: prompt,
            },
          ],
        },
      });

      if (error) {
        throw new Error(`Edge Function error: ${error.message}`);
      }

      return data?.response || 'Continuez à tracker vos émotions pour des prédictions personnalisées.';
    } catch (error) {
      logger.warn('Failed to generate AI insights', error as Error, 'PREDICTIONS');
      return this.generateFallbackInsights(patterns, risks, opportunities);
    }
  }

  /**
   * Générer des insights de fallback sans IA
   */
  private generateFallbackInsights(
    patterns: IdentifiedPattern[],
    risks: RiskIndicator[],
    opportunities: WellnessOpportunity[]
  ): string {
    const insights: string[] = [];

    if (patterns.length > 0) {
      const topPattern = patterns[0];
      insights.push(`📊 ${topPattern.description}`);
    }

    if (risks.length > 0 && risks[0].severity !== 'low') {
      insights.push(`⚠️ Point d'attention : ${risks[0].description}. ${risks[0].mitigationStrategies[0] || 'Restez vigilant.'}`);
    }

    if (opportunities.length > 0) {
      insights.push(`✨ Opportunité à saisir : ${opportunities[0].description}`);
    }

    if (insights.length === 0) {
      insights.push('Continuez à tracker vos émotions régulièrement pour obtenir des prédictions personnalisées et découvrir vos patterns émotionnels.');
    }

    return insights.join('\n\n');
  }

  /**
   * Calculer la confiance générale
   */
  private calculateConfidence(
    data: HistoricalEmotionData[],
    patterns: IdentifiedPattern[]
  ): number {
    // Plus de données = plus de confiance
    const dataConfidence = Math.min(1, data.length / 180); // 180 = ~6 mois

    // Plus de patterns = plus de confiance
    const patternConfidence = Math.min(1, patterns.length / 5);

    // Pattern consistency (moyenne des confiances des patterns)
    const patternQuality =
      patterns.length > 0
        ? patterns.reduce((sum, p) => sum + p.confidence, 0) / patterns.length
        : 0;

    return (dataConfidence + patternConfidence + patternQuality) / 3;
  }

  /**
   * Calculer les statistiques
   */
  private calculateStats(
    data: HistoricalEmotionData[],
    patterns: IdentifiedPattern[],
    forecasts: MonthlyForecast[]
  ): PredictionStats {
    const dataMonthsAvailable = Math.floor(data.length / 30);

    // Calculer la volatilité (écart-type de l'équilibre émotionnel)
    const avg = data.reduce((s, d) => s + d.emotionBalance, 0) / data.length;
    const variance =
      data.reduce((s, d) => s + Math.pow(d.emotionBalance - avg, 2), 0) / data.length;
    const volatility = Math.sqrt(variance) / 50; // Normalisé à 0-1

    // Trend de l'amélioration
    let improvementTrend = 0;
    if (data.length >= 14) {
      const recent = data.slice(-7).reduce((s, d) => s + d.emotionBalance, 0) / 7;
      const old = data.slice(0, 7).reduce((s, d) => s + d.emotionBalance, 0) / 7;
      improvementTrend = (recent - old) / 50;
    }

    // Score de précision basé sur la consistance des patterns
    const accuracyScore = patterns.reduce((sum, p) => sum + p.confidence, 0) / Math.max(1, patterns.length);

    return {
      dataMonthsAvailable,
      dataPointsAnalyzed: data.length,
      accuracyScore,
      volatilityIndex: Math.min(1, volatility),
      improvementTrend: Math.max(-1, Math.min(1, improvementTrend)),
    };
  }

  /**
   * Récupérer les prédictions sauvegardées pour un utilisateur
   */
  async getPredictions(userId: string, timeframe: TimeframeType) {
    try {
      const { data, error } = await supabase
        .from('long_term_predictions')
        .select('*')
        .eq('user_id', userId)
        .eq('timeframe', timeframe)
        .order('created_at', { ascending: false })
        .limit(1);

      if (error) throw error;
      return data?.[0] || null;
    } catch (error) {
      logger.error('Failed to fetch predictions', error as Error, 'PREDICTIONS');
      return null;
    }
  }

  /**
   * Sauvegarder les prédictions
   */
  async savePredictions(userId: string, forecast: EmotionalForecast): Promise<boolean> {
    try {
      const { error } = await supabase.from('long_term_predictions').insert({
        user_id: userId,
        timeframe: forecast.timeframe,
        forecast_data: forecast,
        created_at: new Date().toISOString(),
      });

      if (error) throw error;
      return true;
    } catch (error) {
      logger.error('Failed to save predictions', error as Error, 'PREDICTIONS');
      return false;
    }
  }
}

export const longTermPredictionsService = new LongTermPredictionsService();
