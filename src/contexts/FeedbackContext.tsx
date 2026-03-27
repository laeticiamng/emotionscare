// @ts-nocheck
import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useUserMode } from '@/contexts/UserModeContext';
import { logger } from '@/lib/logger';
import { supabase } from '@/integrations/supabase/client';

interface FeedbackEntry {
  id: string;
  userId: string;
  module: string;
  rating: number;
  comment: string;
  category: 'bug' | 'feature' | 'improvement' | 'praise';
  timestamp: string;
  status: 'pending' | 'processed' | 'implemented';
  aiSuggestion?: string;
}

interface ImprovementSuggestion {
  id: string;
  module: string;
  suggestion: string;
  priority: 'low' | 'medium' | 'high';
  impact: number;
  implementationTime: string;
  category: 'ux' | 'performance' | 'feature' | 'accessibility';
}

interface FeedbackMetrics {
  overallSatisfaction: number;
  moduleRatings: { [key: string]: number };
  improvementScore: number;
  userEngagement: number;
  feedbackVolume: number;
  resolutionRate: number;
  averageResponseTime: number;
}

interface FeedbackContextType {
  feedbacks: FeedbackEntry[];
  suggestions: ImprovementSuggestion[];
  metrics: FeedbackMetrics;
  submitFeedback: (feedback: Omit<FeedbackEntry, 'id' | 'userId' | 'timestamp' | 'status'>) => Promise<void>;
  processAISuggestions: () => Promise<void>;
  generateImprovementReport: () => Promise<string>;
  exportFeedbackData: () => Promise<void>;
  getModuleRecommendations: (module: string) => ImprovementSuggestion[];
  loading: boolean;
}

const FeedbackContext = createContext<FeedbackContextType | undefined>(undefined);

export const FeedbackProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const { userMode } = useUserMode();
  const [feedbacks, setFeedbacks] = useState<FeedbackEntry[]>([]);
  const [suggestions, setSuggestions] = useState<ImprovementSuggestion[]>([]);
  const [metrics, setMetrics] = useState<FeedbackMetrics>({
    overallSatisfaction: 0,
    moduleRatings: {},
    improvementScore: 0,
    userEngagement: 0,
    feedbackVolume: 0,
    resolutionRate: 0,
    averageResponseTime: 0
  });
  const [loading, setLoading] = useState(false);

  // Charger les feedbacks existants
  useEffect(() => {
    loadFeedbacks();
  }, [user]);

  const loadFeedbacks = async () => {
    if (!user?.id) {
      setFeedbacks([]);
      setSuggestions([]);
      return;
    }
    try {
      const { data, error } = await supabase
        .from('user_feedbacks')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(50);
      if (error) {
        logger.error('Failed to load feedbacks', { error }, 'feedback');
        setFeedbacks([]);
        return;
      }
      if (data && data.length > 0) {
        setFeedbacks(data.map((row: any) => ({
          id: row.id,
          userId: row.user_id,
          module: row.module ?? 'general',
          rating: row.rating ?? 0,
          comment: row.comment ?? '',
          category: row.category ?? 'improvement',
          timestamp: row.created_at,
          status: row.status ?? 'pending',
          aiSuggestion: row.ai_suggestion,
        })));
      } else {
        setFeedbacks([]);
      }
      setSuggestions([]);
    } catch (err) {
      logger.error('Unexpected error loading feedbacks', { err }, 'feedback');
      setFeedbacks([]);
    }
  };

  const submitFeedback = async (feedback: Omit<FeedbackEntry, 'id' | 'userId' | 'timestamp' | 'status'>) => {
    setLoading(true);
    try {
      const { data, error } = await supabase.from('user_feedbacks').insert({
        user_id: user?.id,
        module: feedback.module,
        rating: feedback.rating,
        comment: feedback.comment,
        category: feedback.category,
        status: 'pending',
      }).select().single();

      if (error) throw error;

      const newFeedback: FeedbackEntry = {
        id: data?.id || Date.now().toString(),
        userId: user?.id || 'anonymous',
        module: feedback.module,
        rating: feedback.rating,
        comment: feedback.comment,
        category: feedback.category,
        timestamp: data?.created_at || new Date().toISOString(),
        status: 'pending',
      };

      setFeedbacks(prev => [newFeedback, ...prev]);
      logger.info('Feedback soumis avec succes', undefined, 'UI');
    } catch (error) {
      logger.error('Erreur lors de la soumission du feedback', error as Error, 'UI');
    } finally {
      setLoading(false);
    }
  };

  const processAISuggestions = async () => {
    try {
      const { data, error } = await supabase.functions.invoke('ai-feedback-suggestions', {
        body: { feedbacks: feedbacks.slice(0, 10) },
      });
      if (error) {
        logger.warn('AI suggestions not available', 'UI');
        return;
      }
      if (data?.suggestions) {
        setSuggestions(data.suggestions);
      }
    } catch {
      logger.info('AI suggestion engine not configured', undefined, 'UI');
    }
  };

  const generateImprovementReport = async (): Promise<string> => {
    setLoading(true);
    try {
      const report = `
# Rapport d'Amélioration Continue - ${new Date().toLocaleDateString()}

## Métriques Globales
- Satisfaction globale: ${metrics.overallSatisfaction}/10
- Score d'amélioration: ${metrics.improvementScore}%
- Engagement utilisateur: ${metrics.userEngagement}%
- Taux de résolution: ${metrics.resolutionRate}%

## Modules les mieux notés
${Object.entries(metrics.moduleRatings)
  .sort(([,a], [,b]) => b - a)
  .slice(0, 3)
  .map(([module, rating]) => `- ${module}: ${rating}/10`)
  .join('\n')}

## Suggestions prioritaires
${suggestions
  .filter(s => s.priority === 'high')
  .slice(0, 3)
  .map(s => `- ${s.module}: ${s.suggestion} (Impact: ${s.impact}/10)`)
  .join('\n')}

## Recommandations d'action
1. Implémenter les suggestions haute priorité dans les 2 semaines
2. Continuer la collecte de feedback sur les modules les moins notés
3. Maintenir le taux de résolution au-dessus de 90%
      `;

      logger.info('Rapport d\'amélioration généré', undefined, 'UI');
      return report.trim();
    } finally {
      setLoading(false);
    }
  };

  const exportFeedbackData = async () => {
    try {
      const data = {
        feedbacks,
        suggestions,
        metrics,
        exportDate: new Date().toISOString()
      };

      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `feedback-data-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      logger.info('Données de feedback exportées', undefined, 'UI');
    } catch (error) {
      logger.error('Erreur lors de l\'export', error as Error, 'UI');
    }
  };

  const getModuleRecommendations = (module: string): ImprovementSuggestion[] => {
    return suggestions.filter(s => s.module === module || s.module === 'general').slice(0, 3);
  };

  return (
    <FeedbackContext.Provider value={{
      feedbacks,
      suggestions,
      metrics,
      submitFeedback,
      processAISuggestions,
      generateImprovementReport,
      exportFeedbackData,
      getModuleRecommendations,
      loading
    }}>
      {children}
    </FeedbackContext.Provider>
  );
};

export const useFeedback = () => {
  const context = useContext(FeedbackContext);
  if (!context) {
    throw new Error('useFeedback must be used within FeedbackProvider');
  }
  return context;
};
