/**
 * Module Scores - Service
 * Service de calcul et gestion des scores émotionnels, wellbeing et engagement
 */

import { supabase } from '@/integrations/supabase/client';
import type {
import { logger } from '@/lib/logger';
  UserScore,
  ScoreHistory,
  VibeMetrics,
  VibeType,
  CurrentVibe,
  WeeklyMetrics,
  ScoreCalculationInput,
  ScoreCalculationResult,
  ScoreComponents,
  ScoreInsights,
  ScoreInsight,
  ScoreStatistics
} from './types';

// ============================================================================
// CONSTANTS
// ============================================================================

const VIBE_EMOJIS: Record<VibeType, string> = {
  energized: '⚡',
  calm: '😌',
  creative: '🎨',
  focused: '🎯',
  social: '👥',
  reflective: '🤔',
  playful: '🎮',
  determined: '💪',
  peaceful: '☮️',
  anxious: '😰',
  tired: '😴',
  overwhelmed: '😵',
  neutral: '😐',
  joyful: '😊',
  melancholic: '😔'
};

const VIBE_COLORS: Record<VibeType, string> = {
  energized: '#FF6B6B',
  calm: '#4ECDC4',
  creative: '#9B59B6',
  focused: '#3498DB',
  social: '#E74C3C',
  reflective: '#95A5A6',
  playful: '#F39C12',
  determined: '#16A085',
  peaceful: '#1ABC9C',
  anxious: '#E67E22',
  tired: '#7F8C8D',
  overwhelmed: '#C0392B',
  neutral: '#BDC3C7',
  joyful: '#F1C40F',
  melancholic: '#34495E'
};

// ============================================================================
// SCORES SERVICE
// ============================================================================

export class ScoresService {
  /**
   * Calculer les scores pour un utilisateur sur une période
   */
  static async calculateScores(
    input: ScoreCalculationInput
  ): Promise<ScoreCalculationResult> {
    const { user_id, start_date, end_date, include_components = false } = input;

    try {
      // Récupérer les données nécessaires pour le calcul
      const [emotionalData, activityData, sessionData] = await Promise.all([
        this.getEmotionalData(user_id, start_date, end_date),
        this.getActivityData(user_id, start_date, end_date),
        this.getSessionData(user_id, start_date, end_date)
      ]);

      // Calculer le score émotionnel
      const emotional_score = this.calculateEmotionalScore(emotionalData);

      // Calculer le score de wellbeing
      const wellbeing_score = this.calculateWellbeingScore(
        emotionalData,
        activityData
      );

      // Calculer le score d'engagement
      const engagement_score = this.calculateEngagementScore(
        sessionData,
        activityData
      );

      // Score global (moyenne pondérée)
      const overall_score = Math.round(
        emotional_score * 0.4 + wellbeing_score * 0.3 + engagement_score * 0.3
      );

      const result: ScoreCalculationResult = {
        emotional_score,
        wellbeing_score,
        engagement_score,
        overall_score,
        calculated_at: new Date().toISOString()
      };

      // Ajouter les composants détaillés si demandé
      if (include_components) {
        result.components = this.calculateScoreComponents(
          emotionalData,
          activityData,
          sessionData
        );
      }

      return result;
    } catch (error) {
      logger.error('[ScoresService] Calculate scores error:', error, 'MODULE');
      throw error;
    }
  }

  /**
   * Récupérer les scores d'un utilisateur
   */
  static async getUserScores(
    userId: string,
    weeks: number = 12
  ): Promise<UserScore[]> {
    const { data, error } = await supabase
      .from('user_scores')
      .select('*')
      .eq('user_id', userId)
      .order('year', { ascending: false })
      .order('week_number', { ascending: false })
      .limit(weeks);

    if (error) {
      logger.error('[ScoresService] Get user scores error:', error, 'MODULE');
      return [];
    }

    return (data as UserScore[]) || [];
  }

  /**
   * Récupérer l'historique des scores
   */
  static async getScoreHistory(
    userId: string,
    weeks: number = 12
  ): Promise<ScoreHistory> {
    const scores = await this.getUserScores(userId, weeks);

    if (scores.length === 0) {
      return {
        scores: [],
        trend: 'stable',
        average: 0,
        change_percentage: 0,
        period_days: weeks * 7
      };
    }

    // Calculer la moyenne
    const totalScore = scores.reduce(
      (sum, s) => sum + (s.emotional_score + s.wellbeing_score + s.engagement_score) / 3,
      0
    );
    const average = totalScore / scores.length;

    // Calculer la tendance
    const trend = this.calculateTrend(scores);

    // Calculer le pourcentage de changement
    const firstScore =
      (scores[scores.length - 1].emotional_score +
        scores[scores.length - 1].wellbeing_score +
        scores[scores.length - 1].engagement_score) /
      3;
    const lastScore =
      (scores[0].emotional_score + scores[0].wellbeing_score + scores[0].engagement_score) / 3;
    const change_percentage =
      firstScore > 0 ? ((lastScore - firstScore) / firstScore) * 100 : 0;

    return {
      scores,
      trend,
      average,
      change_percentage,
      period_days: weeks * 7
    };
  }

  /**
   * Obtenir le vibe actuel de l'utilisateur
   */
  static async getCurrentVibe(userId: string): Promise<VibeMetrics> {
    try {
      // Récupérer les données récentes (dernières 24h)
      const now = new Date();
      const yesterday = new Date(now.getTime() - 24 * 60 * 60 * 1000);

      const [emotionScans, sessions, journalEntries] = await Promise.all([
        this.getRecentEmotionScans(userId, yesterday, now),
        this.getRecentSessions(userId, yesterday, now),
        this.getRecentJournalEntries(userId, yesterday, now)
      ]);

      // Déterminer le vibe actuel basé sur les données
      const vibeAnalysis = this.analyzeVibe(
        emotionScans,
        sessions,
        journalEntries
      );

      return vibeAnalysis;
    } catch (error) {
      logger.error('[ScoresService] Get current vibe error:', error, 'MODULE');
      // Retourner un vibe neutre par défaut
      return {
        current_vibe: 'neutral',
        vibe_intensity: 50,
        vibe_duration_hours: 0,
        recent_activities: [],
        contributing_factors: []
      };
    }
  }

  /**
   * Obtenir les métriques hebdomadaires
   */
  static async getWeeklyMetrics(
    userId: string,
    week: number,
    year: number
  ): Promise<WeeklyMetrics | null> {
    // TODO: Implémenter la récupération depuis la DB ou calculer
    return null;
  }

  /**
   * Générer des insights basés sur les scores
   */
  static async generateInsights(userId: string): Promise<ScoreInsights> {
    try {
      const history = await this.getScoreHistory(userId, 4);
      const vibe = await this.getCurrentVibe(userId);

      const insights: ScoreInsight[] = [];
      const key_strengths: string[] = [];
      const areas_for_improvement: string[] = [];

      if (history.scores.length > 0) {
        const latestScore = history.scores[0];

        // Analyse du score émotionnel
        if (latestScore.emotional_score >= 75) {
          insights.push({
            type: 'positive',
            category: 'emotional',
            title: 'Excellent équilibre émotionnel',
            message: 'Votre score émotionnel est excellent. Continuez vos pratiques actuelles.',
            score_impact: 10,
            recommendations: ['Maintenez vos routines de bien-être'],
            priority: 'low'
          });
          key_strengths.push('Stabilité émotionnelle');
        } else if (latestScore.emotional_score < 50) {
          insights.push({
            type: 'concern',
            category: 'emotional',
            title: 'Score émotionnel à améliorer',
            message: 'Votre score émotionnel pourrait bénéficier de plus d\'attention.',
            score_impact: -15,
            recommendations: [
              'Essayez le module de respiration',
              'Tenez un journal quotidien',
              'Parlez au Coach IA'
            ],
            priority: 'high'
          });
          areas_for_improvement.push('Régulation émotionnelle');
        }

        // Analyse de la tendance
        if (history.trend === 'up') {
          insights.push({
            type: 'improvement',
            category: 'overall',
            title: 'Tendance positive',
            message: `Vos scores sont en progression de ${history.change_percentage.toFixed(1)}%`,
            score_impact: 5,
            recommendations: ['Continuez sur cette lancée!'],
            priority: 'medium'
          });
        }
      }

      // Analyse du vibe
      if (vibe.vibe_intensity > 75) {
        insights.push({
          type: vibe.current_vibe === 'anxious' || vibe.current_vibe === 'overwhelmed' ? 'concern' : 'positive',
          category: 'emotional',
          title: `Vibe intense: ${vibe.current_vibe}`,
          message: `Vous ressentez actuellement un vibe ${vibe.current_vibe} intense.`,
          score_impact: 0,
          recommendations: vibe.recommended_modules || [],
          priority: 'medium'
        });
      }

      const overall_sentiment =
        insights.filter((i) => i.type === 'positive' || i.type === 'improvement').length >
        insights.filter((i) => i.type === 'concern' || i.type === 'negative').length
          ? 'positive'
          : insights.filter((i) => i.type === 'concern' || i.type === 'negative').length > 0
          ? 'negative'
          : 'neutral';

      return {
        insights,
        overall_sentiment,
        key_strengths,
        areas_for_improvement,
        next_steps: insights
          .filter((i) => i.priority === 'high')
          .flatMap((i) => i.recommendations)
          .slice(0, 3)
      };
    } catch (error) {
      logger.error('[ScoresService] Generate insights error:', error, 'MODULE');
      return {
        insights: [],
        overall_sentiment: 'neutral',
        key_strengths: [],
        areas_for_improvement: [],
        next_steps: []
      };
    }
  }

  /**
   * Obtenir les statistiques globales
   */
  static async getStatistics(userId: string): Promise<ScoreStatistics> {
    const scores = await this.getUserScores(userId, 1000);

    if (scores.length === 0) {
      return {
        user_id: userId,
        total_score_entries: 0,
        highest_emotional_score: 0,
        highest_wellbeing_score: 0,
        highest_engagement_score: 0,
        average_emotional_score: 0,
        average_wellbeing_score: 0,
        average_engagement_score: 0,
        best_week: { week_number: 1, year: new Date().getFullYear(), score: 0 },
        improvement_rate: 0,
        consistency_rating: 0,
        last_updated: new Date().toISOString()
      };
    }

    const emotional_scores = scores.map((s) => s.emotional_score);
    const wellbeing_scores = scores.map((s) => s.wellbeing_score);
    const engagement_scores = scores.map((s) => s.engagement_score);

    return {
      user_id: userId,
      total_score_entries: scores.length,
      highest_emotional_score: Math.max(...emotional_scores),
      highest_wellbeing_score: Math.max(...wellbeing_scores),
      highest_engagement_score: Math.max(...engagement_scores),
      average_emotional_score:
        emotional_scores.reduce((a, b) => a + b, 0) / scores.length,
      average_wellbeing_score:
        wellbeing_scores.reduce((a, b) => a + b, 0) / scores.length,
      average_engagement_score:
        engagement_scores.reduce((a, b) => a + b, 0) / scores.length,
      best_week: this.findBestWeek(scores),
      improvement_rate: this.calculateImprovementRate(scores),
      consistency_rating: this.calculateConsistency(scores),
      last_updated: new Date().toISOString()
    };
  }

  // ============================================================================
  // HELPER METHODS
  // ============================================================================

  private static async getEmotionalData(
    userId: string,
    start: Date,
    end: Date
  ): Promise<Record<string, unknown>[]> {
    const { data } = await supabase
      .from('emotion_scans')
      .select('*')
      .eq('user_id', userId)
      .gte('created_at', start.toISOString())
      .lte('created_at', end.toISOString());

    return (data as Record<string, unknown>[]) || [];
  }

  private static async getActivityData(
    userId: string,
    start: Date,
    end: Date
  ): Promise<Record<string, unknown>[]> {
    const { data } = await supabase
      .from('user_activities')
      .select('*')
      .eq('user_id', userId)
      .gte('created_at', start.toISOString())
      .lte('created_at', end.toISOString());

    return (data as Record<string, unknown>[]) || [];
  }

  private static async getSessionData(
    userId: string,
    start: Date,
    end: Date
  ): Promise<Record<string, unknown>[]> {
    const { data } = await supabase
      .from('sessions')
      .select('*')
      .eq('user_id', userId)
      .gte('created_at', start.toISOString())
      .lte('created_at', end.toISOString());

    return (data as Record<string, unknown>[]) || [];
  }

  private static calculateEmotionalScore(data: Record<string, unknown>[]): number {
    // Logique de calcul simplifiée
    if (data.length === 0) return 50;

    const moodScores = data
      .map((d) => d.mood_score as number)
      .filter((s) => s !== null && s !== undefined);

    if (moodScores.length === 0) return 50;

    const average = moodScores.reduce((a, b) => a + b, 0) / moodScores.length;
    return Math.round(Math.min(100, Math.max(0, average)));
  }

  private static calculateWellbeingScore(
    emotional: Record<string, unknown>[],
    activity: Record<string, unknown>[]
  ): number {
    // Score basé sur la régularité et diversité des activités
    const activityScore = Math.min(100, activity.length * 5);
    const emotionalConsistency = emotional.length > 5 ? 70 : emotional.length * 10;

    return Math.round((activityScore + emotionalConsistency) / 2);
  }

  private static calculateEngagementScore(
    sessions: Record<string, unknown>[],
    activities: Record<string, unknown>[]
  ): number {
    // Score basé sur fréquence et diversité
    const sessionScore = Math.min(100, sessions.length * 3);
    const activityScore = Math.min(100, activities.length * 4);

    return Math.round((sessionScore + activityScore) / 2);
  }

  private static calculateScoreComponents(
    emotional: Record<string, unknown>[],
    activity: Record<string, unknown>[],
    sessions: Record<string, unknown>[]
  ): ScoreComponents {
    // Composants détaillés (version simplifiée)
    return {
      emotional: {
        score: this.calculateEmotionalScore(emotional),
        trend: 'stable',
        factors: {
          mood_consistency: 70,
          positive_emotions: 60,
          negative_emotions: 30,
          emotional_range: 50
        }
      },
      wellbeing: {
        score: this.calculateWellbeingScore(emotional, activity),
        trend: 'stable',
        factors: {
          activities_completed: activity.length,
          sleep_quality: 70,
          stress_level: 40,
          self_care: 60
        }
      },
      engagement: {
        score: this.calculateEngagementScore(sessions, activity),
        trend: 'stable',
        factors: {
          session_frequency: sessions.length,
          module_diversity: 5,
          achievement_progress: 50,
          community_participation: 30
        }
      }
    };
  }

  private static calculateTrend(scores: UserScore[]): 'up' | 'down' | 'stable' {
    if (scores.length < 2) return 'stable';

    const recent = scores.slice(0, Math.ceil(scores.length / 3));
    const older = scores.slice(-Math.ceil(scores.length / 3));

    const recentAvg =
      recent.reduce((sum, s) => sum + (s.emotional_score + s.wellbeing_score) / 2, 0) /
      recent.length;
    const olderAvg =
      older.reduce((sum, s) => sum + (s.emotional_score + s.wellbeing_score) / 2, 0) /
      older.length;

    const diff = recentAvg - olderAvg;
    if (diff > 5) return 'up';
    if (diff < -5) return 'down';
    return 'stable';
  }

  private static async getRecentEmotionScans(
    userId: string,
    start: Date,
    end: Date
  ): Promise<Record<string, unknown>[]> {
    return this.getEmotionalData(userId, start, end);
  }

  private static async getRecentSessions(
    userId: string,
    start: Date,
    end: Date
  ): Promise<Record<string, unknown>[]> {
    return this.getSessionData(userId, start, end);
  }

  private static async getRecentJournalEntries(
    userId: string,
    start: Date,
    end: Date
  ): Promise<Record<string, unknown>[]> {
    const { data } = await supabase
      .from('journal_entries')
      .select('*')
      .eq('user_id', userId)
      .gte('created_at', start.toISOString())
      .lte('created_at', end.toISOString());

    return (data as Record<string, unknown>[]) || [];
  }

  private static analyzeVibe(
    emotions: Record<string, unknown>[],
    sessions: Record<string, unknown>[],
    journal: Record<string, unknown>[]
  ): VibeMetrics {
    // Analyse simplifiée du vibe
    const vibe: VibeType = 'neutral';
    const intensity = 50;

    return {
      current_vibe: vibe,
      vibe_intensity: intensity,
      vibe_duration_hours: 0,
      recent_activities: sessions.map((s) => (s.type as string) || 'unknown'),
      contributing_factors: []
    };
  }

  private static findBestWeek(scores: UserScore[]): {
    week_number: number;
    year: number;
    score: number;
  } {
    if (scores.length === 0) {
      return { week_number: 1, year: new Date().getFullYear(), score: 0 };
    }

    const best = scores.reduce((best, current) => {
      const currentAvg =
        (current.emotional_score + current.wellbeing_score + current.engagement_score) / 3;
      const bestAvg = (best.emotional_score + best.wellbeing_score + best.engagement_score) / 3;
      return currentAvg > bestAvg ? current : best;
    });

    return {
      week_number: best.week_number,
      year: best.year,
      score: Math.round(
        (best.emotional_score + best.wellbeing_score + best.engagement_score) / 3
      )
    };
  }

  private static calculateImprovementRate(scores: UserScore[]): number {
    if (scores.length < 2) return 0;

    const firstScore =
      (scores[scores.length - 1].emotional_score + scores[scores.length - 1].wellbeing_score) / 2;
    const lastScore = (scores[0].emotional_score + scores[0].wellbeing_score) / 2;

    return firstScore > 0 ? ((lastScore - firstScore) / scores.length) * 10 : 0;
  }

  private static calculateConsistency(scores: UserScore[]): number {
    if (scores.length < 3) return 50;

    // Calculer la variance des scores
    const avgScores = scores.map(
      (s) => (s.emotional_score + s.wellbeing_score + s.engagement_score) / 3
    );
    const mean = avgScores.reduce((a, b) => a + b, 0) / avgScores.length;
    const variance =
      avgScores.reduce((sum, score) => sum + Math.pow(score - mean, 2), 0) / avgScores.length;
    const stdDev = Math.sqrt(variance);

    // Convertir en score de consistance (0-100)
    // Moins de variance = plus de consistance
    return Math.round(Math.max(0, 100 - stdDev));
  }

  /**
   * Obtenir le vibe formaté pour l'affichage
   */
  static getVibeDisplay(vibeType: VibeType): CurrentVibe {
    return {
      vibe: vibeType,
      intensity: 75,
      emoji: VIBE_EMOJIS[vibeType],
      color: VIBE_COLORS[vibeType],
      description: this.getVibeDescription(vibeType)
    };
  }

  private static getVibeDescription(vibe: VibeType): string {
    const descriptions: Record<VibeType, string> = {
      energized: 'Plein d\'énergie et prêt à conquérir le monde',
      calm: 'Serein et en paix avec soi-même',
      creative: 'Imagination débordante et créativité au sommet',
      focused: 'Concentré et déterminé sur vos objectifs',
      social: 'Envie de connexion et de partage',
      reflective: 'En introspection et contemplation',
      playful: 'D\'humeur ludique et légère',
      determined: 'Motivé et résolu à avancer',
      peaceful: 'Dans un état de tranquillité profonde',
      anxious: 'Ressenti d\'inquiétude, besoin de soutien',
      tired: 'Besoin de repos et de récupération',
      overwhelmed: 'Sentiment de surcharge, prenez soin de vous',
      neutral: 'État d\'esprit équilibré',
      joyful: 'Débordant de joie et de bonheur',
      melancholic: 'Humeur contemplative et un peu mélancolique'
    };

    return descriptions[vibe];
  }
}

export const scoresService = ScoresService;
export default ScoresService;
