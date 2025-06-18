
import { useState, useEffect } from 'react';
import { FeedbackEntry, ImprovementSuggestion, QualityMetrics } from '@/types/feedback';
import { feedbackService } from '@/services/FeedbackService';
import { toast } from 'sonner';

interface UseFeedbackSystemReturn {
  feedbacks: FeedbackEntry[];
  suggestions: ImprovementSuggestion[];
  metrics: QualityMetrics | null;
  isLoading: boolean;
  submitFeedback: (feedback: Omit<FeedbackEntry, 'id' | 'created_at' | 'updated_at'>) => Promise<void>;
  generateSuggestions: (feedbackIds: string[]) => Promise<void>;
  refreshData: () => Promise<void>;
}

export const useFeedbackSystem = (): UseFeedbackSystemReturn => {
  const [feedbacks, setFeedbacks] = useState<FeedbackEntry[]>([]);
  const [suggestions, setSuggestions] = useState<ImprovementSuggestion[]>([]);
  const [metrics, setMetrics] = useState<QualityMetrics | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const loadFeedbacks = async () => {
    try {
      const data = await feedbackService.getFeedbacks({ limit: 50 });
      setFeedbacks(data);
    } catch (error) {
      console.error('Erreur lors du chargement des feedbacks:', error);
      toast.error('Erreur lors du chargement des feedbacks');
    }
  };

  const loadMetrics = async () => {
    try {
      const data = await feedbackService.getQualityMetrics();
      setMetrics({
        satisfaction_score: data.satisfaction_average,
        nps_score: data.nps_score,
        feature_adoption_rate: 0.89, // Mockée
        bug_report_frequency: 2.3,
        improvement_implementation_rate: data.improvement_rate,
        user_retention_rate: 0.94
      });
    } catch (error) {
      console.error('Erreur lors du chargement des métriques:', error);
      // Utiliser des données mockées en cas d'erreur
      setMetrics({
        satisfaction_score: 4.6,
        nps_score: 67,
        feature_adoption_rate: 0.89,
        bug_report_frequency: 2.3,
        improvement_implementation_rate: 0.78,
        user_retention_rate: 0.94
      });
    }
  };

  const submitFeedback = async (feedback: Omit<FeedbackEntry, 'id' | 'created_at' | 'updated_at'>) => {
    setIsLoading(true);
    try {
      const newFeedback = await feedbackService.submitFeedback(feedback);
      setFeedbacks(prev => [newFeedback, ...prev]);
      
      // Log audit event
      await feedbackService.logAuditEvent({
        user_id: feedback.user_id,
        action: 'feedback_submitted',
        module: feedback.module,
        impact: feedback.priority === 'critical' ? 'high' : 'medium',
        details: {
          type: feedback.type,
          rating: feedback.rating,
          module: feedback.module
        }
      });

      toast.success('Feedback soumis avec succès !');
    } catch (error) {
      console.error('Erreur lors de la soumission:', error);
      toast.error('Erreur lors de la soumission du feedback');
    } finally {
      setIsLoading(false);
    }
  };

  const generateSuggestions = async (feedbackIds: string[]) => {
    setIsLoading(true);
    try {
      const newSuggestions = await feedbackService.generateImprovementSuggestions(feedbackIds);
      setSuggestions(prev => [...prev, ...newSuggestions]);
      toast.success('Nouvelles suggestions générées !');
    } catch (error) {
      console.error('Erreur lors de la génération:', error);
      toast.error('Erreur lors de la génération des suggestions');
    } finally {
      setIsLoading(false);
    }
  };

  const refreshData = async () => {
    setIsLoading(true);
    try {
      await Promise.all([
        loadFeedbacks(),
        loadMetrics()
      ]);
    } catch (error) {
      console.error('Erreur lors du rafraîchissement:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    refreshData();
  }, []);

  return {
    feedbacks,
    suggestions,
    metrics,
    isLoading,
    submitFeedback,
    generateSuggestions,
    refreshData
  };
};
