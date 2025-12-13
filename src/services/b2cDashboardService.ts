// @ts-nocheck
import { supabase } from '@/integrations/supabase/client';
import { logger } from '@/lib/logger';

/**
 * Service pour centraliser les appels du dashboard particulier
 */
export interface AnalyzeEmotionPayload {
  emojis?: string[];
  text?: string;
  audio_url?: string;
  source?: 'text' | 'voice' | 'facial';
}

export interface AnalyzeEmotionResult {
  score?: number;
  ai_feedback: string;
  emotion?: string;
  valence?: number;
  arousal?: number;
  confidence?: number;
  recommendations?: string[];
}

export interface JournalAnalysisResult {
  ai_feedback: string;
  sentiment?: string;
  themes?: string[];
  suggestions?: string[];
}

export interface CoachResponse {
  response: string;
  suggestedActions?: string[];
  resources?: { title: string; url: string }[];
}

/** Résumé du dashboard */
export interface DashboardSummary {
  moodTrend: 'improving' | 'stable' | 'declining';
  averageMoodScore: number;
  streakDays: number;
  totalSessions: number;
  favoriteModule: string;
  recentAchievements: string[];
  nextGoal?: string;
}

/** Widget d'activité */
export interface ActivityWidget {
  type: 'journal' | 'scan' | 'music' | 'breath' | 'coach';
  count: number;
  lastActivity?: Date;
  trend: number;
}

/** Insight personnalisé */
export interface PersonalInsight {
  id: string;
  title: string;
  description: string;
  category: 'mood' | 'activity' | 'progress' | 'recommendation';
  priority: number;
  actionUrl?: string;
}

export const b2cDashboardService = {
  /** Analyse les émotions */
  async analyzeEmotion(payload: AnalyzeEmotionPayload): Promise<AnalyzeEmotionResult> {
    try {
      const { data, error } = await supabase.functions.invoke('analyze-emotion', {
        body: payload,
      });
      if (error) throw error;
      logger.info('Emotion analyzed', { source: payload.source }, 'DASHBOARD');
      return data as AnalyzeEmotionResult;
    } catch (error) {
      logger.error('Error analyzing emotion', error as Error, 'DASHBOARD');
      throw error;
    }
  },

  /** Analyse le journal */
  async analyzeJournal(content: string, journalId?: string): Promise<JournalAnalysisResult> {
    try {
      const { data, error } = await supabase.functions.invoke('analyze-journal', {
        body: { content, journal_id: journalId },
      });
      if (error) throw error;
      return data as JournalAnalysisResult;
    } catch (error) {
      logger.error('Error analyzing journal', error as Error, 'DASHBOARD');
      throw error;
    }
  },

  /** Envoie un message au coach */
  async sendCoachMessage(prompt: string, emotion?: string, context?: string): Promise<CoachResponse> {
    try {
      const { data, error } = await supabase.functions.invoke('coach-ai', {
        body: { action: 'get_recommendation', prompt, emotion, context },
      });
      if (error) throw error;
      return data as CoachResponse;
    } catch (error) {
      logger.error('Error sending coach message', error as Error, 'DASHBOARD');
      throw error;
    }
  },

  /** Génère une recommandation musicale */
  async generateMusicRecommendation(emotion: string, preferences?: Record<string, unknown>): Promise<CoachResponse> {
    try {
      const { data, error } = await supabase.functions.invoke('coach-ai', {
        body: { action: 'generate_music', emotion, preferences },
      });
      if (error) throw error;
      return data as CoachResponse;
    } catch (error) {
      logger.error('Error generating music recommendation', error as Error, 'DASHBOARD');
      throw error;
    }
  },

  /** Récupère le résumé du dashboard */
  async getDashboardSummary(): Promise<DashboardSummary> {
    try {
      const { data: userData } = await supabase.auth.getUser();
      if (!userData.user?.id) {
        return this.getDefaultSummary();
      }

      const { data, error } = await supabase
        .from('user_dashboard_summary')
        .select('*')
        .eq('user_id', userData.user.id)
        .single();

      if (error || !data) return this.getDefaultSummary();

      return {
        moodTrend: data.mood_trend || 'stable',
        averageMoodScore: data.average_mood_score || 0,
        streakDays: data.streak_days || 0,
        totalSessions: data.total_sessions || 0,
        favoriteModule: data.favorite_module || 'Journal',
        recentAchievements: data.recent_achievements || [],
        nextGoal: data.next_goal
      };
    } catch (error) {
      return this.getDefaultSummary();
    }
  },

  /** Récupère les widgets d'activité */
  async getActivityWidgets(): Promise<ActivityWidget[]> {
    try {
      const { data: userData } = await supabase.auth.getUser();
      if (!userData.user?.id) return [];

      const { data, error } = await supabase
        .from('activity_widgets')
        .select('*')
        .eq('user_id', userData.user.id);

      if (error || !data) return [];

      return data.map(w => ({
        type: w.type,
        count: w.count,
        lastActivity: w.last_activity ? new Date(w.last_activity) : undefined,
        trend: w.trend || 0
      }));
    } catch (error) {
      return [];
    }
  },

  /** Récupère les insights personnalisés */
  async getPersonalInsights(): Promise<PersonalInsight[]> {
    try {
      const { data: userData } = await supabase.auth.getUser();
      if (!userData.user?.id) return [];

      const { data, error } = await supabase
        .from('personal_insights')
        .select('*')
        .eq('user_id', userData.user.id)
        .eq('dismissed', false)
        .order('priority', { ascending: false })
        .limit(5);

      if (error || !data) return [];

      return data.map(i => ({
        id: i.id,
        title: i.title,
        description: i.description,
        category: i.category,
        priority: i.priority,
        actionUrl: i.action_url
      }));
    } catch (error) {
      return [];
    }
  },

  /** Marque un insight comme lu */
  async dismissInsight(insightId: string): Promise<void> {
    try {
      await supabase
        .from('personal_insights')
        .update({ dismissed: true })
        .eq('id', insightId);
    } catch (error) {
      logger.error('Error dismissing insight', error as Error, 'DASHBOARD');
    }
  },

  /** Récupère l'historique des émotions */
  async getEmotionHistory(days = 7): Promise<{ date: string; score: number; emotion: string }[]> {
    try {
      const { data: userData } = await supabase.auth.getUser();
      if (!userData.user?.id) return [];

      const startDate = new Date();
      startDate.setDate(startDate.getDate() - days);

      const { data, error } = await supabase
        .from('emotion_history')
        .select('date, score, emotion')
        .eq('user_id', userData.user.id)
        .gte('date', startDate.toISOString())
        .order('date', { ascending: true });

      if (error || !data) return [];
      return data;
    } catch (error) {
      return [];
    }
  },

  /** Récupère les objectifs de l'utilisateur */
  async getUserGoals(): Promise<{ id: string; title: string; progress: number; target: number }[]> {
    try {
      const { data: userData } = await supabase.auth.getUser();
      if (!userData.user?.id) return [];

      const { data, error } = await supabase
        .from('user_goals')
        .select('*')
        .eq('user_id', userData.user.id)
        .eq('active', true);

      if (error || !data) return [];

      return data.map(g => ({
        id: g.id,
        title: g.title,
        progress: g.progress || 0,
        target: g.target
      }));
    } catch (error) {
      return [];
    }
  },

  /** Enregistre une activité rapide */
  async logQuickActivity(type: string, duration?: number, mood?: string): Promise<void> {
    try {
      const { data: userData } = await supabase.auth.getUser();
      if (!userData.user?.id) return;

      await supabase.from('quick_activities').insert({
        user_id: userData.user.id,
        type,
        duration,
        mood,
        timestamp: new Date().toISOString()
      });

      logger.info('Quick activity logged', { type }, 'DASHBOARD');
    } catch (error) {
      logger.error('Error logging quick activity', error as Error, 'DASHBOARD');
    }
  },

  /** Exporte les données du dashboard */
  async exportDashboardData(): Promise<string> {
    const summary = await this.getDashboardSummary();
    const history = await this.getEmotionHistory(30);
    const goals = await this.getUserGoals();

    let csv = 'Résumé Dashboard\n';
    csv += `Tendance humeur,${summary.moodTrend}\n`;
    csv += `Score moyen,${summary.averageMoodScore}\n`;
    csv += `Série jours,${summary.streakDays}\n`;
    csv += `Sessions totales,${summary.totalSessions}\n\n`;

    csv += 'Historique émotions\nDate,Score,Émotion\n';
    for (const h of history) {
      csv += `${h.date},${h.score},${h.emotion}\n`;
    }

    csv += '\nObjectifs\nTitre,Progression,Cible\n';
    for (const g of goals) {
      csv += `${g.title},${g.progress},${g.target}\n`;
    }

    return csv;
  },

  getDefaultSummary(): DashboardSummary {
    return {
      moodTrend: 'stable',
      averageMoodScore: 0,
      streakDays: 0,
      totalSessions: 0,
      favoriteModule: 'Journal',
      recentAchievements: []
    };
  }
};

export default b2cDashboardService;
