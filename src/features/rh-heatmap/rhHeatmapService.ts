/**
 * Service RH Heatmap
 * Visualisation agrégée du bien-être organisationnel
 */
import { supabase } from '@/integrations/supabase/client';
import { logger } from '@/lib/logger';

const LOG_TAG = 'RH_HEATMAP';

// ============================================================================
// TYPES
// ============================================================================

export interface HeatmapCell {
  teamId: string;
  teamName: string;
  period: string;
  score: number;
  participationRate: number;
  memberCount: number;
  trend: 'up' | 'down' | 'stable';
  alertLevel: 'none' | 'low' | 'medium' | 'high';
}

export interface HeatmapRow {
  teamId: string;
  teamName: string;
  cells: HeatmapCell[];
  avgScore: number;
  avgParticipation: number;
}

export interface HeatmapData {
  rows: HeatmapRow[];
  periods: string[];
  orgAvgScore: number;
  orgAvgParticipation: number;
  generatedAt: string;
}

export interface HeatmapFilters {
  startDate?: string;
  endDate?: string;
  teamIds?: string[];
  minParticipation?: number;
  granularity?: 'day' | 'week' | 'month';
}

export interface TeamAlert {
  teamId: string;
  teamName: string;
  alertType: 'low_score' | 'declining_trend' | 'low_participation' | 'high_variance';
  severity: 'low' | 'medium' | 'high';
  message: string;
  value: number;
  threshold: number;
  createdAt: string;
}

// ============================================================================
// SERVICE
// ============================================================================

export const rhHeatmapService = {
  /**
   * Récupérer les données heatmap pour une organisation
   */
  async getHeatmapData(orgId: string, filters: HeatmapFilters = {}): Promise<HeatmapData> {
    const {
      startDate = getDefaultStartDate(),
      endDate = new Date().toISOString().split('T')[0],
      teamIds,
      minParticipation = 0,
      granularity = 'week'
    } = filters;

    try {
      // Fetch aggregated wellness data
      const { data, error } = await supabase.functions.invoke('b2b-wellness-aggregates', {
        body: {
          orgId,
          startDate,
          endDate,
          granularity,
          teamIds,
          minParticipation
        }
      });

      if (error) {
        logger.error('Error fetching heatmap data', error as Error, LOG_TAG);
        throw error;
      }

      return {
        rows: data?.rows || [],
        periods: data?.periods || generatePeriods(startDate, endDate, granularity),
        orgAvgScore: data?.orgAvgScore || 0,
        orgAvgParticipation: data?.orgAvgParticipation || 0,
        generatedAt: new Date().toISOString()
      };
    } catch (error) {
      logger.error('getHeatmapData error', error as Error, LOG_TAG);
      
      // Return empty data when service is unavailable
      return {
        rows: [],
        periods: generatePeriods(startDate, endDate, granularity),
        orgAvgScore: 0,
        orgAvgParticipation: 0,
        generatedAt: new Date().toISOString()
      };
    }
  },

  /**
   * Récupérer les alertes pour une organisation
   */
  async getAlerts(orgId: string): Promise<TeamAlert[]> {
    try {
      const { data, error } = await supabase
        .from('b2b_wellness_alerts')
        .select('*')
        .eq('org_id', orgId)
        .eq('resolved', false)
        .order('severity', { ascending: false })
        .limit(50);

      if (error) {
        logger.warn('Error fetching alerts, using generated alerts', { error }, LOG_TAG);
        return [];
      }

      return (data || []).map(alert => ({
        teamId: alert.team_id,
        teamName: alert.team_name || 'Unknown',
        alertType: alert.alert_type as TeamAlert['alertType'],
        severity: alert.severity as TeamAlert['severity'],
        message: alert.message,
        value: alert.value,
        threshold: alert.threshold,
        createdAt: alert.created_at
      }));
    } catch (error) {
      logger.error('getAlerts error', error as Error, LOG_TAG);
      return [];
    }
  },

  /**
   * Calculer le score de couleur pour une cellule (0-100 -> couleur)
   */
  getScoreColor(score: number): string {
    if (score >= 80) return 'bg-green-500';
    if (score >= 70) return 'bg-green-400';
    if (score >= 60) return 'bg-yellow-400';
    if (score >= 50) return 'bg-orange-400';
    return 'bg-red-500';
  },

  /**
   * Calculer le niveau d'alerte basé sur le score
   */
  calculateAlertLevel(score: number, trend: 'up' | 'down' | 'stable'): TeamAlert['severity'] | 'none' {
    if (score < 50) return 'high';
    if (score < 60 || (score < 70 && trend === 'down')) return 'medium';
    if (score < 70 && trend === 'down') return 'low';
    return 'none';
  },

  /**
   * Exporter les données heatmap
   */
  async exportData(orgId: string, format: 'csv' | 'xlsx' | 'pdf'): Promise<{ url: string }> {
    try {
      const { data, error } = await supabase.functions.invoke('b2b-report-export', {
        body: {
          orgId,
          reportType: 'heatmap',
          format
        }
      });

      if (error) throw error;

      return { url: data.downloadUrl };
    } catch (error) {
      logger.error('exportData error', error as Error, LOG_TAG);
      throw new Error('Export impossible');
    }
  },

  /**
   * Obtenir les statistiques globales
   */
  async getGlobalStats(orgId: string): Promise<{
    currentScore: number;
    previousScore: number;
    trend: number;
    participation: number;
    activeTeams: number;
    totalTeams: number;
  }> {
    try {
      const { data, error } = await supabase.functions.invoke('b2b-wellness-aggregates', {
        body: {
          orgId,
          type: 'global_stats'
        }
      });

      if (error) throw error;

      return {
        currentScore: data?.currentScore || 0,
        previousScore: data?.previousScore || 0,
        trend: data?.trend || 0,
        participation: data?.participation || 0,
        activeTeams: data?.activeTeams || 0,
        totalTeams: data?.totalTeams || 0
      };
    } catch (error) {
      logger.error('getGlobalStats error', error as Error, LOG_TAG);
      return {
        currentScore: 0,
        previousScore: 0,
        trend: 0,
        participation: 0,
        activeTeams: 0,
        totalTeams: 0
      };
    }
  }
};

// ============================================================================
// HELPERS
// ============================================================================

function getDefaultStartDate(): string {
  const date = new Date();
  date.setMonth(date.getMonth() - 3);
  return date.toISOString().split('T')[0];
}

function generatePeriods(startDate: string, endDate: string, granularity: 'day' | 'week' | 'month'): string[] {
  const periods: string[] = [];
  const start = new Date(startDate);
  const end = new Date(endDate);
  
  const increment = granularity === 'day' ? 1 : granularity === 'week' ? 7 : 30;
  
  let current = new Date(start);
  while (current <= end) {
    if (granularity === 'month') {
      periods.push(`${current.getFullYear()}-${String(current.getMonth() + 1).padStart(2, '0')}`);
      current.setMonth(current.getMonth() + 1);
    } else if (granularity === 'week') {
      periods.push(`S${getWeekNumber(current)}`);
      current.setDate(current.getDate() + 7);
    } else {
      periods.push(current.toISOString().split('T')[0]);
      current.setDate(current.getDate() + 1);
    }
  }
  
  return periods;
}

function getWeekNumber(date: Date): number {
  const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
  const dayNum = d.getUTCDay() || 7;
  d.setUTCDate(d.getUTCDate() + 4 - dayNum);
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
  return Math.ceil((((d.getTime() - yearStart.getTime()) / 86400000) + 1) / 7);
}

export default rhHeatmapService;
