/**
 * Service pour la récupération des données weekly-bars
 */

import { supabase } from '@/integrations/supabase/client';
import type { WeeklyMetric, MetricType, WeeklyDataPoint } from './types';

export class WeeklyBarsService {
  /**
   * Récupère les données d'une métrique pour une période
   */
  static async fetchMetricData(
    userId: string,
    metricType: MetricType,
    startDate: Date,
    endDate: Date
  ): Promise<WeeklyDataPoint[]> {
    const { data, error } = await supabase
      .from('breath_weekly_metrics')
      .select('week_start, mood_score, coherence_avg, hrv_stress_idx, mindfulness_avg, mvpa_week')
      .eq('user_id', userId)
      .gte('week_start', startDate.toISOString())
      .lte('week_start', endDate.toISOString())
      .order('week_start', { ascending: true });

    if (error) throw error;

    return (data || []).map(row => ({
      date: row.week_start,
      value: this.extractMetricValue(row, metricType),
      label: new Date(row.week_start).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short' })
    }));
  }

  /**
   * Extrait la valeur correspondant au type de métrique
   */
  private static extractMetricValue(row: any, metricType: MetricType): number {
    switch (metricType) {
      case 'mood':
        return row.mood_score || 0;
      case 'stress':
        return row.hrv_stress_idx || 0;
      case 'energy':
        return row.coherence_avg || 0;
      case 'sleep':
        return row.mindfulness_avg || 0;
      case 'activity':
        return row.mvpa_week || 0;
      default:
        return 0;
    }
  }

  /**
   * Calcule la moyenne d'une série de données
   */
  static calculateAverage(data: WeeklyDataPoint[]): number {
    if (data.length === 0) return 0;
    const sum = data.reduce((acc, point) => acc + point.value, 0);
    return Math.round(sum / data.length);
  }

  /**
   * Détermine la tendance (up, down, stable)
   */
  static calculateTrend(data: WeeklyDataPoint[]): 'up' | 'down' | 'stable' {
    if (data.length < 2) return 'stable';
    
    const firstHalf = data.slice(0, Math.floor(data.length / 2));
    const secondHalf = data.slice(Math.floor(data.length / 2));
    
    const firstAvg = this.calculateAverage(firstHalf);
    const secondAvg = this.calculateAverage(secondHalf);
    
    const diff = secondAvg - firstAvg;
    const threshold = firstAvg * 0.1; // 10% de variation
    
    if (Math.abs(diff) < threshold) return 'stable';
    return diff > 0 ? 'up' : 'down';
  }

  /**
   * Couleur associée à chaque métrique
   */
  static getMetricColor(metricType: MetricType): string {
    const colors: Record<MetricType, string> = {
      mood: 'hsl(var(--chart-1))',
      stress: 'hsl(var(--chart-2))',
      energy: 'hsl(var(--chart-3))',
      sleep: 'hsl(var(--chart-4))',
      activity: 'hsl(var(--chart-5))'
    };
    return colors[metricType];
  }

  /**
   * Récupère toutes les métriques pour un utilisateur
   */
  static async fetchAllMetrics(
    userId: string,
    metrics: MetricType[],
    startDate: Date,
    endDate: Date
  ): Promise<WeeklyMetric[]> {
    const results = await Promise.all(
      metrics.map(async (metricType) => {
        const data = await this.fetchMetricData(userId, metricType, startDate, endDate);
        const average = this.calculateAverage(data);
        const trend = this.calculateTrend(data);
        const color = this.getMetricColor(metricType);

        return {
          type: metricType,
          data,
          average,
          trend,
          color
        };
      })
    );

    return results;
  }
}
