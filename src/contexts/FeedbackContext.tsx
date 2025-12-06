// @ts-nocheck

import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useUserMode } from '@/contexts/UserModeContext';
import { logger } from '@/lib/logger';

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
    overallSatisfaction: 8.2,
    moduleRatings: {
      scan: 8.5,
      music: 9.1,
      coach: 8.8,
      journal: 8.3,
      vr: 7.9,
      gamification: 8.6,
      socialCocon: 8.4
    },
    improvementScore: 85,
    userEngagement: 78,
    feedbackVolume: 245,
    resolutionRate: 92,
    averageResponseTime: 2.5
  });
  const [loading, setLoading] = useState(false);

  // Charger les feedbacks existants
  useEffect(() => {
    loadFeedbacks();
    generateMockSuggestions();
  }, [user]);

  const loadFeedbacks = () => {
    // Simulation de données de feedback existantes
    const mockFeedbacks: FeedbackEntry[] = [
      {
        id: '1',
        userId: user?.id || 'demo',
        module: 'scan',
        rating: 9,
        comment: 'Interface très intuitive et résultats précis',
        category: 'praise',
        timestamp: new Date(Date.now() - 86400000).toISOString(),
        status: 'processed',
        aiSuggestion: 'Considérer ajouter plus d\'options de personnalisation'
      },
      {
        id: '2',
        userId: user?.id || 'demo',
        module: 'music',
        rating: 8,
        comment: 'Bonne sélection mais manque de variété dans certains genres',
        category: 'improvement',
        timestamp: new Date(Date.now() - 172800000).toISOString(),
        status: 'pending'
      },
      {
        id: '3',
        userId: user?.id || 'demo',
        module: 'coach',
        rating: 10,
        comment: 'Conseils très pertinents et adaptés à mes besoins',
        category: 'praise',
        timestamp: new Date(Date.now() - 259200000).toISOString(),
        status: 'processed',
        aiSuggestion: 'Augmenter la fréquence des interactions proactives'
      }
    ];
    setFeedbacks(mockFeedbacks);
  };

  const generateMockSuggestions = () => {
    const mockSuggestions: ImprovementSuggestion[] = [
      {
        id: '1',
        module: 'scan',
        suggestion: 'Ajouter une fonction de comparaison historique des scans émotionnels',
        priority: 'high',
        impact: 8.5,
        implementationTime: '2-3 semaines',
        category: 'feature'
      },
      {
        id: '2',
        module: 'music',
        suggestion: 'Intégrer des playlists personnalisées basées sur l\'état émotionnel',
        priority: 'medium',
        impact: 7.8,
        implementationTime: '1-2 semaines',
        category: 'ux'
      },
      {
        id: '3',
        module: 'coach',
        suggestion: 'Optimiser les temps de réponse du chat IA',
        priority: 'high',
        impact: 9.2,
        implementationTime: '1 semaine',
        category: 'performance'
      },
      {
        id: '4',
        module: 'accessibility',
        suggestion: 'Améliorer la navigation au clavier pour les utilisateurs malvoyants',
        priority: 'high',
        impact: 9.5,
        implementationTime: '2-3 semaines',
        category: 'accessibility'
      }
    ];
    setSuggestions(mockSuggestions);
  };

  const submitFeedback = async (feedback: Omit<FeedbackEntry, 'id' | 'userId' | 'timestamp' | 'status'>) => {
    setLoading(true);
    try {
      const newFeedback: FeedbackEntry = {
        ...feedback,
        id: Date.now().toString(),
        userId: user?.id || 'anonymous',
        timestamp: new Date().toISOString(),
        status: 'pending'
      };

      setFeedbacks(prev => [newFeedback, ...prev]);
      
      // Simulation de traitement IA
      setTimeout(() => {
        processAISuggestions();
      }, 2000);

      logger.info('Feedback soumis avec succès', newFeedback, 'UI');
    } catch (error) {
      logger.error('Erreur lors de la soumission du feedback', error as Error, 'UI');
    } finally {
      setLoading(false);
    }
  };

  const processAISuggestions = async () => {
    setLoading(true);
    try {
      // Simulation de traitement IA pour générer des suggestions
      const newSuggestion: ImprovementSuggestion = {
        id: Date.now().toString(),
        module: 'general',
        suggestion: 'Améliorer l\'onboarding utilisateur basé sur les feedbacks récents',
        priority: 'medium',
        impact: 8.0,
        implementationTime: '1-2 semaines',
        category: 'ux'
      };

      setSuggestions(prev => [newSuggestion, ...prev]);
      
      // Mettre à jour les métriques
      setMetrics(prev => ({
        ...prev,
        improvementScore: Math.min(prev.improvementScore + 2, 100),
        feedbackVolume: prev.feedbackVolume + 1
      }));

      logger.info('Suggestion IA générée', newSuggestion, 'UI');
    } catch (error) {
      logger.error('Erreur lors du traitement IA', error as Error, 'UI');
    } finally {
      setLoading(false);
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
