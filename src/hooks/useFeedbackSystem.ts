// @ts-nocheck

import { useState, useEffect } from 'react';
import { FeedbackEntry, ImprovementSuggestion, QualityMetrics, AuditLog } from '@/types/feedback';
import { FeedbackService } from '@/services/FeedbackService';
import { toast } from '@/hooks/use-toast';

interface UseFeedbackSystemReturn {
  // État
  feedbacks: FeedbackEntry[];
  suggestions: ImprovementSuggestion[];
  metrics: QualityMetrics | null;
  auditLogs: AuditLog[];
  isLoading: boolean;
  error: string | null;

  // Actions de feedback
  submitFeedback: (feedback: Partial<FeedbackEntry>) => Promise<void>;
  updateFeedbackStatus: (id: string, status: FeedbackEntry['status']) => Promise<void>;

  // Actions de suggestions
  generateSuggestions: () => Promise<void>;
  implementSuggestion: (id: string) => Promise<void>;

  // Actions d'audit
  refreshAuditLogs: () => Promise<void>;

  // Actions RGPD
  exportUserData: () => Promise<any>;
  deleteUserData: () => Promise<void>;

  // Méthodes utilitaires
  refreshAll: () => Promise<void>;
}

export const useFeedbackSystem = (): UseFeedbackSystemReturn => {
  const [feedbacks, setFeedbacks] = useState<FeedbackEntry[]>([]);
  const [suggestions, setSuggestions] = useState<ImprovementSuggestion[]>([]);
  const [metrics, setMetrics] = useState<QualityMetrics | null>(null);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Charger les données initiales
  useEffect(() => {
    loadInitialData();
  }, []);

  const loadInitialData = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const [feedbacksData, suggestionsData, metricsData, auditLogsData] = await Promise.all([
        FeedbackService.getFeedbacks(),
        FeedbackService.getSuggestions(),
        FeedbackService.getQualityMetrics(),
        FeedbackService.getAuditLogs()
      ]);

      setFeedbacks(feedbacksData);
      setSuggestions(suggestionsData);
      setMetrics(metricsData);
      setAuditLogs(auditLogsData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur lors du chargement des données');
      toast({
        title: "Erreur",
        description: "Impossible de charger les données du système de feedback",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Actions de feedback
  const submitFeedback = async (feedback: Partial<FeedbackEntry>) => {
    setIsLoading(true);
    setError(null);

    try {
      const newFeedback = await FeedbackService.createFeedback(feedback);
      setFeedbacks(prev => [newFeedback, ...prev]);
      
      // Rafraîchir les métriques
      const updatedMetrics = await FeedbackService.getQualityMetrics();
      setMetrics(updatedMetrics);

      toast({
        title: "Feedback envoyé",
        description: "Merci pour votre retour ! Il sera examiné par notre équipe.",
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur lors de l\'envoi du feedback');
      toast({
        title: "Erreur",
        description: "Impossible d'envoyer le feedback",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const updateFeedbackStatus = async (id: string, status: FeedbackEntry['status']) => {
    try {
      await FeedbackService.updateFeedbackStatus(id, status);
      setFeedbacks(prev => 
        prev.map(f => f.id === id ? { ...f, status, updated_at: new Date().toISOString() } : f)
      );

      toast({
        title: "Statut mis à jour",
        description: `Le feedback a été marqué comme "${status}"`,
      });
    } catch (err) {
      toast({
        title: "Erreur",
        description: "Impossible de mettre à jour le statut",
        variant: "destructive"
      });
    }
  };

  // Actions de suggestions
  const generateSuggestions = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const newSuggestions = await FeedbackService.generateImprovementSuggestions();
      setSuggestions(newSuggestions);

      toast({
        title: "Analyse terminée",
        description: `${newSuggestions.length} suggestions d'amélioration générées`,
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur lors de la génération des suggestions');
      toast({
        title: "Erreur",
        description: "Impossible de générer les suggestions",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const implementSuggestion = async (id: string) => {
    try {
      await FeedbackService.implementSuggestion(id);
      setSuggestions(prev => 
        prev.map(s => s.id === id ? { ...s, status: 'implemented' } : s)
      );

      // Rafraîchir les métriques
      const updatedMetrics = await FeedbackService.getQualityMetrics();
      setMetrics(updatedMetrics);

      toast({
        title: "Suggestion implémentée",
        description: "La suggestion a été marquée comme implémentée",
      });
    } catch (err) {
      toast({
        title: "Erreur",
        description: "Impossible d'implémenter la suggestion",
        variant: "destructive"
      });
    }
  };

  // Actions d'audit
  const refreshAuditLogs = async () => {
    try {
      const logs = await FeedbackService.getAuditLogs();
      setAuditLogs(logs);
    } catch (err) {
      toast({
        title: "Erreur",
        description: "Impossible de charger les logs d'audit",
        variant: "destructive"
      });
    }
  };

  // Actions RGPD
  const exportUserData = async () => {
    try {
      const userData = await FeedbackService.exportUserData('current-user'); // En production, utiliser l'ID réel
      
      // Créer et télécharger le fichier JSON
      const blob = new Blob([JSON.stringify(userData, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `emotionscare-data-export-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      toast({
        title: "Export terminé",
        description: "Vos données ont été exportées et téléchargées",
      });

      return userData;
    } catch (err) {
      toast({
        title: "Erreur",
        description: "Impossible d'exporter les données",
        variant: "destructive"
      });
      throw err;
    }
  };

  const deleteUserData = async () => {
    try {
      await FeedbackService.deleteUserData('current-user'); // En production, utiliser l'ID réel
      
      // Recharger les données
      await loadInitialData();

      toast({
        title: "Données supprimées",
        description: "Vos données personnelles ont été anonymisées conformément au RGPD",
      });
    } catch (err) {
      toast({
        title: "Erreur",
        description: "Impossible de supprimer les données",
        variant: "destructive"
      });
    }
  };

  // Méthodes utilitaires
  const refreshAll = async () => {
    await loadInitialData();
  };

  return {
    // État
    feedbacks,
    suggestions,
    metrics,
    auditLogs,
    isLoading,
    error,

    // Actions de feedback
    submitFeedback,
    updateFeedbackStatus,

    // Actions de suggestions
    generateSuggestions,
    implementSuggestion,

    // Actions d'audit
    refreshAuditLogs,

    // Actions RGPD
    exportUserData,
    deleteUserData,

    // Méthodes utilitaires
    refreshAll
  };
};
