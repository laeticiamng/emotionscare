/**
 * Service pour les métriques de la queue musicale
 */

import { supabase } from '@/integrations/supabase/client';
import { logger } from '@/lib/logger';

export interface DailyMetrics {
  date: string;
  total_requests: number;
  completed: number;
  failed: number;
  premium_requests: number;
  avg_processing_time_seconds: number;
  avg_retries: number;
}

export interface MetricsChartData {
  labels: string[];
  totalRequests: number[];
  completed: number[];
  failed: number[];
  successRate: number[];
  premiumRequests: number[];
  avgProcessingTime: number[];
}

/**
 * Récupère les métriques des N derniers jours
 */
export async function getMetrics(days: number = 7): Promise<DailyMetrics[]> {
  try {
    const { data, error } = await supabase
      .from('music_queue_stats')
      .select('*')
      .order('date', { ascending: false })
      .limit(days);

    if (error) {
      logger.error('Failed to fetch queue metrics', error, 'MUSIC_METRICS');
      return [];
    }

    return data as DailyMetrics[];
  } catch (error) {
    logger.error('Error fetching queue metrics', error as Error, 'MUSIC_METRICS');
    return [];
  }
}

/**
 * Formate les métriques pour Chart.js
 */
export function formatMetricsForChart(metrics: DailyMetrics[]): MetricsChartData {
  // Inverser pour avoir les dates dans l'ordre chronologique
  const reversedMetrics = [...metrics].reverse();

  return {
    labels: reversedMetrics.map(m => {
      const date = new Date(m.date);
      return date.toLocaleDateString('fr-FR', { day: '2-digit', month: 'short' });
    }),
    totalRequests: reversedMetrics.map(m => m.total_requests || 0),
    completed: reversedMetrics.map(m => m.completed || 0),
    failed: reversedMetrics.map(m => m.failed || 0),
    successRate: reversedMetrics.map(m => {
      const total = m.total_requests || 0;
      const completed = m.completed || 0;
      return total > 0 ? Math.round((completed / total) * 100) : 0;
    }),
    premiumRequests: reversedMetrics.map(m => m.premium_requests || 0),
    avgProcessingTime: reversedMetrics.map(m => 
      Math.round((m.avg_processing_time_seconds || 0) * 10) / 10
    ),
  };
}

/**
 * Exporte les métriques en CSV
 */
export function exportMetricsToCSV(metrics: DailyMetrics[]): string {
  const headers = [
    'Date',
    'Total Demandes',
    'Complétées',
    'Échouées',
    'Taux de Réussite (%)',
    'Demandes Premium',
    'Temps Moyen (s)',
    'Retries Moyens'
  ];

  const rows = metrics.map(m => {
    const total = m.total_requests || 0;
    const completed = m.completed || 0;
    const successRate = total > 0 ? Math.round((completed / total) * 100) : 0;
    
    return [
      m.date,
      m.total_requests || 0,
      m.completed || 0,
      m.failed || 0,
      successRate,
      m.premium_requests || 0,
      Math.round((m.avg_processing_time_seconds || 0) * 10) / 10,
      Math.round((m.avg_retries || 0) * 10) / 10,
    ];
  });

  const csvContent = [
    headers.join(','),
    ...rows.map(row => row.join(','))
  ].join('\n');

  return csvContent;
}

/**
 * Télécharge les métriques en CSV
 */
export function downloadMetricsCSV(metrics: DailyMetrics[], filename: string = 'music-queue-metrics.csv') {
  const csv = exportMetricsToCSV(metrics);
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  link.style.visibility = 'hidden';
  
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

/**
 * Calcule les statistiques globales
 */
export function calculateGlobalStats(metrics: DailyMetrics[]) {
  if (metrics.length === 0) {
    return {
      totalRequests: 0,
      totalCompleted: 0,
      totalFailed: 0,
      avgSuccessRate: 0,
      totalPremiumRequests: 0,
      avgProcessingTime: 0,
    };
  }

  const totalRequests = metrics.reduce((sum, m) => sum + (m.total_requests || 0), 0);
  const totalCompleted = metrics.reduce((sum, m) => sum + (m.completed || 0), 0);
  const totalFailed = metrics.reduce((sum, m) => sum + (m.failed || 0), 0);
  const totalPremiumRequests = metrics.reduce((sum, m) => sum + (m.premium_requests || 0), 0);
  
  const avgSuccessRate = totalRequests > 0 
    ? Math.round((totalCompleted / totalRequests) * 100) 
    : 0;

  const avgProcessingTime = metrics.reduce((sum, m) => 
    sum + (m.avg_processing_time_seconds || 0), 0
  ) / metrics.length;

  return {
    totalRequests,
    totalCompleted,
    totalFailed,
    avgSuccessRate,
    totalPremiumRequests,
    avgProcessingTime: Math.round(avgProcessingTime * 10) / 10,
  };
}
