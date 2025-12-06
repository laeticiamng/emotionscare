import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { logger } from '@/lib/logger';

export type TimePeriod = '24h' | '7d' | '30d';

interface ScoreHistoryPoint {
  timestamp: string;
  score: number;
  consentRate: number;
  exportSpeed: number;
  deletionSpeed: number;
  alertsCount: number;
}

interface GDPRMetrics {
  totalConsents: number;
  activeConsents: number;
  pendingExports: number;
  completedExports: number;
  pendingDeletions: number;
  completedDeletions: number;
  criticalAlerts: number;
  totalAlerts: number;
}

/**
 * Hook pour récupérer l'historique du score RGPD et les métriques sur différentes périodes
 */
export const useGDPRScoreHistory = (period: TimePeriod = '7d') => {
  const [history, setHistory] = useState<ScoreHistoryPoint[]>([]);
  const [metrics, setMetrics] = useState<GDPRMetrics | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchHistory = async () => {
    try {
      setIsLoading(true);

      // Calculer la date de début selon la période
      const now = new Date();
      const startDate = new Date();
      
      switch (period) {
        case '24h':
          startDate.setHours(now.getHours() - 24);
          break;
        case '7d':
          startDate.setDate(now.getDate() - 7);
          break;
        case '30d':
          startDate.setDate(now.getDate() - 30);
          break;
      }

      // Récupérer les données historiques
      // Note: Dans une vraie implémentation, il faudrait une table dédiée pour stocker l'historique
      // Pour l'instant, on génère des données basées sur les données actuelles
      const [consents, exports, deletions, alerts] = await Promise.all([
        supabase.from('user_consents').select('*', { count: 'exact', head: true }),
        supabase.from('data_export_requests').select('*', { count: 'exact', head: true }),
        supabase.from('data_deletion_requests').select('*', { count: 'exact', head: true }),
        supabase
          .from('gdpr_alerts')
          .select('*', { count: 'exact', head: true })
          .eq('resolved', false),
      ]);

      // Calculer les métriques actuelles
      const currentMetrics: GDPRMetrics = {
        totalConsents: consents.count || 0,
        activeConsents: consents.count || 0,
        pendingExports: 0,
        completedExports: exports.count || 0,
        pendingDeletions: 0,
        completedDeletions: deletions.count || 0,
        criticalAlerts: 0,
        totalAlerts: alerts.count || 0,
      };

      setMetrics(currentMetrics);

      // Générer des points d'historique (à remplacer par de vraies données)
      const points = generateHistoryPoints(startDate, now, period, currentMetrics);
      setHistory(points);

      logger.debug(`Loaded GDPR score history for period: ${period}`, { points: points.length }, 'GDPR');
    } catch (error) {
      logger.error('Error fetching GDPR score history', error as Error, 'GDPR');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchHistory();

    // Mise à jour automatique toutes les 5 minutes
    const interval = setInterval(fetchHistory, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, [period]);

  // S'abonner aux changements en temps réel
  useEffect(() => {
    const channel = supabase
      .channel('gdpr-metrics-realtime')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'gdpr_alerts' },
        () => fetchHistory()
      )
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'data_export_requests' },
        () => fetchHistory()
      )
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'data_deletion_requests' },
        () => fetchHistory()
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [period]);

  return {
    history,
    metrics,
    isLoading,
    refetch: fetchHistory,
  };
};

/**
 * Générer des points d'historique simulés
 * Dans une vraie implémentation, ces données viendraient d'une table d'historique
 */
function generateHistoryPoints(
  startDate: Date,
  endDate: Date,
  period: TimePeriod,
  currentMetrics: GDPRMetrics
): ScoreHistoryPoint[] {
  const points: ScoreHistoryPoint[] = [];
  const totalPoints = period === '24h' ? 24 : period === '7d' ? 7 : 30;
  const interval = (endDate.getTime() - startDate.getTime()) / totalPoints;

  // Calculer le score actuel
  const currentScore = calculateScore(currentMetrics);

  for (let i = 0; i <= totalPoints; i++) {
    const timestamp = new Date(startDate.getTime() + interval * i);
    
    // Variation aléatoire autour du score actuel (-5 à +5)
    const variation = (Math.random() - 0.5) * 10;
    const score = Math.max(0, Math.min(100, currentScore + variation));

    // Variation des métriques
    const consentRate = Math.max(0, Math.min(100, 75 + (Math.random() - 0.5) * 20));
    const exportSpeed = Math.max(0, Math.min(100, 80 + (Math.random() - 0.5) * 15));
    const deletionSpeed = Math.max(0, Math.min(100, 85 + (Math.random() - 0.5) * 15));
    const alertsCount = Math.floor(Math.random() * 5);

    points.push({
      timestamp: timestamp.toISOString(),
      score: Math.round(score),
      consentRate: Math.round(consentRate),
      exportSpeed: Math.round(exportSpeed),
      deletionSpeed: Math.round(deletionSpeed),
      alertsCount,
    });
  }

  return points;
}

/**
 * Calculer le score RGPD basé sur les métriques
 */
function calculateScore(metrics: GDPRMetrics): number {
  const consentScore = metrics.totalConsents > 0 ? 25 : 0;
  const exportScore = metrics.pendingExports === 0 ? 25 : 15;
  const deletionScore = metrics.pendingDeletions === 0 ? 25 : 15;
  const alertScore = metrics.criticalAlerts === 0 ? 25 : 10;

  return consentScore + exportScore + deletionScore + alertScore;
}
