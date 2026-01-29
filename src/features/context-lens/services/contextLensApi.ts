/**
 * Context Lens API Service
 * Communication avec le backend EmotionsCare pour l'analyse des patterns émotionnels
 */

import { supabase } from '@/integrations/supabase/client';
import type {
  ContextLensInsight,
  ContextLensReport,
  EmotionPattern,
  NLPAnalysisResult,
  ContextLensNote,
  EmotionData,
  EmotionHistory,
  ReportConfig,
  ReportStatus,
} from '../types';

// ============ INSIGHTS API ============

export const contextLensApi = {
  /**
   * Récupère les insights personnalisés de l'utilisateur
   */
  async getInsights(options?: {
    type?: ContextLensInsight['type'];
    limit?: number;
    unreadOnly?: boolean;
  }): Promise<ContextLensInsight[]> {
    try {
      const { data, error } = await supabase.functions.invoke('context-lens-insights', {
        body: {
          action: 'list',
          type: options?.type,
          limit: options?.limit ?? 20,
          unread_only: options?.unreadOnly ?? false,
        },
      });

      if (error) throw error;
      return data.insights || [];
    } catch (err) {
      console.error('[Context Lens] Failed to fetch insights:', err);
      return [];
    }
  },

  /**
   * Marque un insight comme lu
   */
  async markInsightRead(insightId: string): Promise<boolean> {
    try {
      const { error } = await supabase.functions.invoke('context-lens-insights', {
        body: { action: 'mark_read', insight_id: insightId },
      });
      return !error;
    } catch {
      return false;
    }
  },

  // ============ PATTERNS API ============

  /**
   * Récupère les patterns émotionnels détectés
   */
  async getPatterns(options?: {
    period?: 'week' | 'month' | 'quarter';
  }): Promise<EmotionPattern[]> {
    try {
      const { data, error } = await supabase.functions.invoke('context-lens-patterns', {
        body: {
          action: 'list',
          period: options?.period ?? 'month',
        },
      });

      if (error) throw error;
      return data.patterns || [];
    } catch (err) {
      console.error('[Context Lens] Failed to fetch patterns:', err);
      return [];
    }
  },

  /**
   * Détecte les patterns à partir des données récentes
   */
  async detectPatterns(): Promise<EmotionPattern[]> {
    try {
      const { data, error } = await supabase.functions.invoke('context-lens-patterns', {
        body: { action: 'detect' },
      });

      if (error) throw error;
      return data.patterns || [];
    } catch (err) {
      console.error('[Context Lens] Pattern detection failed:', err);
      return [];
    }
  },

  // ============ NLP ANALYSIS API ============

  /**
   * Analyse NLP d'un texte (journal, note, etc.)
   */
  async analyzeText(text: string, options?: {
    language?: 'fr' | 'en' | 'es' | 'de' | 'it';
    extractEntities?: boolean;
  }): Promise<NLPAnalysisResult | null> {
    try {
      const { data, error } = await supabase.functions.invoke('context-lens-nlp', {
        body: {
          text,
          language: options?.language ?? 'fr',
          extract_entities: options?.extractEntities ?? true,
        },
      });

      if (error) throw error;
      return data.analysis;
    } catch (err) {
      console.error('[Context Lens] NLP analysis failed:', err);
      return null;
    }
  },

  // ============ NOTES API ============

  /**
   * Sauvegarde une note avec analyse NLP automatique
   */
  async saveNote(note: Omit<ContextLensNote, 'id' | 'created_at' | 'updated_at' | 'nlp_analysis'>): Promise<ContextLensNote | null> {
    try {
      const { data, error } = await supabase.functions.invoke('context-lens-notes', {
        body: {
          action: 'create',
          note,
        },
      });

      if (error) throw error;
      return data.note;
    } catch (err) {
      console.error('[Context Lens] Failed to save note:', err);
      return null;
    }
  },

  /**
   * Récupère les notes de l'utilisateur
   */
  async getNotes(options?: {
    limit?: number;
    source?: ContextLensNote['source'];
  }): Promise<ContextLensNote[]> {
    try {
      const { data, error } = await supabase.functions.invoke('context-lens-notes', {
        body: {
          action: 'list',
          limit: options?.limit ?? 50,
          source: options?.source,
        },
      });

      if (error) throw error;
      return data.notes || [];
    } catch {
      return [];
    }
  },

  // ============ REPORTS API ============

  /**
   * Génère un rapport hebdomadaire
   */
  async generateWeeklyReport(config?: ReportConfig): Promise<ReportStatus | null> {
    try {
      const { data, error } = await supabase.functions.invoke('context-lens-reports', {
        body: {
          action: 'generate',
          period: 'weekly',
          config,
        },
      });

      if (error) throw error;
      return data.status;
    } catch (err) {
      console.error('[Context Lens] Report generation failed:', err);
      return null;
    }
  },

  /**
   * Récupère le statut d'un rapport
   */
  async getReportStatus(reportId: string): Promise<ReportStatus | null> {
    try {
      const { data, error } = await supabase.functions.invoke('context-lens-reports', {
        body: {
          action: 'status',
          report_id: reportId,
        },
      });

      if (error) throw error;
      return data.status;
    } catch {
      return null;
    }
  },

  /**
   * Récupère le rapport complet
   */
  async getReport(reportId: string): Promise<ContextLensReport | null> {
    try {
      const { data, error } = await supabase.functions.invoke('context-lens-reports', {
        body: {
          action: 'get',
          report_id: reportId,
        },
      });

      if (error) throw error;
      return data.report;
    } catch {
      return null;
    }
  },

  // ============ EMOTION HISTORY API ============

  /**
   * Récupère l'historique émotionnel
   */
  async getEmotionHistory(options?: {
    from?: string;
    to?: string;
    interval?: 'hour' | 'day' | 'week';
  }): Promise<EmotionHistory | null> {
    try {
      const now = new Date();
      const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

      const { data, error } = await supabase.functions.invoke('context-lens-emotions', {
        body: {
          action: 'history',
          from: options?.from ?? weekAgo.toISOString(),
          to: options?.to ?? now.toISOString(),
          interval: options?.interval ?? 'day',
        },
      });

      if (error) throw error;
      return data.history;
    } catch (err) {
      console.error('[Context Lens] Failed to fetch emotion history:', err);
      return null;
    }
  },

  /**
   * Récupère les émotions actuelles (temps réel)
   */
  async getCurrentEmotions(): Promise<EmotionData | null> {
    try {
      const { data, error } = await supabase.functions.invoke('context-lens-emotions', {
        body: { action: 'current' },
      });

      if (error) throw error;
      return data.emotions;
    } catch {
      // Return simulated data for demo
      return {
        anxiety: 0.25 + Math.random() * 0.3,
        joy: 0.4 + Math.random() * 0.3,
        sadness: 0.1 + Math.random() * 0.2,
        anger: 0.05 + Math.random() * 0.1,
        disgust: 0.02 + Math.random() * 0.05,
        timestamp: new Date().toISOString(),
      };
    }
  },
};

export default contextLensApi;
