// @ts-nocheck
import { supabase } from '@/integrations/supabase/client';
import { logger } from '@/lib/logger';
import { subDays, format, startOfDay, endOfDay } from 'date-fns';

export interface TrendData {
  date: string;
  count: number;
  severity?: string;
  type?: string;
}

export interface PredictionData {
  date: string;
  predicted: number;
  confidence: number;
}

export interface TrendAnalysis {
  historical: TrendData[];
  predictions: PredictionData[];
  trend: 'increasing' | 'decreasing' | 'stable';
  riskLevel: 'low' | 'medium' | 'high' | 'critical';
  changePercentage: number;
}

/**
 * Récupère les tendances de sécurité sur une période
 */
export async function getSecurityTrends(days: number = 30): Promise<TrendAnalysis> {
  try {
    const startDate = subDays(new Date(), days);
    
    // Récupérer les alertes de sécurité
    const { data: alerts, error } = await supabase
      .from('security_alerts')
      .select('*')
      .gte('created_at', startDate.toISOString())
      .order('created_at', { ascending: true });

    if (error) throw error;

    // Grouper par jour
    const dailyCounts = new Map<string, number>();
    
    (alerts || []).forEach(alert => {
      const date = format(new Date(alert.created_at), 'yyyy-MM-dd');
      dailyCounts.set(date, (dailyCounts.get(date) || 0) + 1);
    });

    // Créer les données historiques
    const historical: TrendData[] = [];
    for (let i = 0; i < days; i++) {
      const date = format(subDays(new Date(), days - i - 1), 'yyyy-MM-dd');
      historical.push({
        date,
        count: dailyCounts.get(date) || 0,
      });
    }

    // Calculer les prédictions (moyenne mobile simple)
    const predictions = calculatePredictions(historical, 7);

    // Analyser la tendance
    const trend = analyzeTrend(historical);
    const riskLevel = calculateRiskLevel(historical, alerts || []);
    const changePercentage = calculateChangePercentage(historical);

    return {
      historical,
      predictions,
      trend,
      riskLevel,
      changePercentage,
    };
  } catch (error) {
    logger.error('Error getting security trends', error as Error, 'SECURITY');
    return {
      historical: [],
      predictions: [],
      trend: 'stable',
      riskLevel: 'low',
      changePercentage: 0,
    };
  }
}

/**
 * Récupère les tendances par type d'alerte
 */
export async function getTrendsByType(days: number = 30): Promise<Record<string, TrendData[]>> {
  try {
    const startDate = subDays(new Date(), days);
    
    const { data: alerts, error } = await supabase
      .from('security_alerts')
      .select('*')
      .gte('created_at', startDate.toISOString());

    if (error) throw error;

    const trendsByType: Record<string, Map<string, number>> = {};

    (alerts || []).forEach(alert => {
      const date = format(new Date(alert.created_at), 'yyyy-MM-dd');
      const type = alert.alert_type;

      if (!trendsByType[type]) {
        trendsByType[type] = new Map();
      }

      trendsByType[type].set(date, (trendsByType[type].get(date) || 0) + 1);
    });

    // Convertir en tableau
    const result: Record<string, TrendData[]> = {};
    
    Object.entries(trendsByType).forEach(([type, counts]) => {
      result[type] = [];
      for (let i = 0; i < days; i++) {
        const date = format(subDays(new Date(), days - i - 1), 'yyyy-MM-dd');
        result[type].push({
          date,
          count: counts.get(date) || 0,
          type,
        });
      }
    });

    return result;
  } catch (error) {
    logger.error('Error getting trends by type', error as Error, 'SECURITY');
    return {};
  }
}

/**
 * Récupère les tendances par sévérité
 */
export async function getTrendsBySeverity(days: number = 30): Promise<Record<string, TrendData[]>> {
  try {
    const startDate = subDays(new Date(), days);
    
    const { data: alerts, error } = await supabase
      .from('security_alerts')
      .select('*')
      .gte('created_at', startDate.toISOString());

    if (error) throw error;

    const trendsBySeverity: Record<string, Map<string, number>> = {};

    (alerts || []).forEach(alert => {
      const date = format(new Date(alert.created_at), 'yyyy-MM-dd');
      const severity = alert.severity;

      if (!trendsBySeverity[severity]) {
        trendsBySeverity[severity] = new Map();
      }

      trendsBySeverity[severity].set(date, (trendsBySeverity[severity].get(date) || 0) + 1);
    });

    // Convertir en tableau
    const result: Record<string, TrendData[]> = {};
    
    Object.entries(trendsBySeverity).forEach(([severity, counts]) => {
      result[severity] = [];
      for (let i = 0; i < days; i++) {
        const date = format(subDays(new Date(), days - i - 1), 'yyyy-MM-dd');
        result[severity].push({
          date,
          count: counts.get(date) || 0,
          severity,
        });
      }
    });

    return result;
  } catch (error) {
    logger.error('Error getting trends by severity', error as Error, 'SECURITY');
    return {};
  }
}

/**
 * Calcule les prédictions basées sur la moyenne mobile
 */
function calculatePredictions(historical: TrendData[], futureDays: number): PredictionData[] {
  if (historical.length < 7) return [];

  const predictions: PredictionData[] = [];
  const windowSize = 7; // Moyenne sur 7 jours

  // Calculer la moyenne mobile
  const lastValues = historical.slice(-windowSize).map(d => d.count);
  const average = lastValues.reduce((sum, val) => sum + val, 0) / windowSize;

  // Calculer la tendance (pente)
  const slope = calculateSlope(lastValues);

  // Générer les prédictions
  for (let i = 1; i <= futureDays; i++) {
    const predicted = Math.max(0, Math.round(average + slope * i));
    const confidence = Math.max(0.3, 1 - (i * 0.1)); // La confiance diminue avec le temps

    const futureDate = format(new Date(Date.now() + i * 24 * 60 * 60 * 1000), 'yyyy-MM-dd');
    
    predictions.push({
      date: futureDate,
      predicted,
      confidence,
    });
  }

  return predictions;
}

/**
 * Calcule la pente d'une série de valeurs
 */
function calculateSlope(values: number[]): number {
  const n = values.length;
  if (n < 2) return 0;

  const xSum = (n * (n - 1)) / 2;
  const ySum = values.reduce((sum, val) => sum + val, 0);
  const xySum = values.reduce((sum, val, i) => sum + i * val, 0);
  const x2Sum = (n * (n - 1) * (2 * n - 1)) / 6;

  return (n * xySum - xSum * ySum) / (n * x2Sum - xSum * xSum);
}

/**
 * Analyse la tendance générale
 */
function analyzeTrend(historical: TrendData[]): 'increasing' | 'decreasing' | 'stable' {
  if (historical.length < 7) return 'stable';

  const recentValues = historical.slice(-7).map(d => d.count);
  const slope = calculateSlope(recentValues);

  if (slope > 0.5) return 'increasing';
  if (slope < -0.5) return 'decreasing';
  return 'stable';
}

/**
 * Calcule le niveau de risque
 */
function calculateRiskLevel(
  historical: TrendData[],
  alerts: any[]
): 'low' | 'medium' | 'high' | 'critical' {
  const recentDays = 7;
  const recentAlerts = historical.slice(-recentDays);
  const recentCount = recentAlerts.reduce((sum, d) => sum + d.count, 0);
  const avgPerDay = recentCount / recentDays;

  // Compter les alertes critiques et high récentes
  const recentCritical = alerts.filter(
    a => 
      (a.severity === 'critical' || a.severity === 'high') &&
      new Date(a.created_at) > subDays(new Date(), recentDays)
  ).length;

  if (recentCritical > 5 || avgPerDay > 10) return 'critical';
  if (recentCritical > 2 || avgPerDay > 5) return 'high';
  if (recentCritical > 0 || avgPerDay > 2) return 'medium';
  return 'low';
}

/**
 * Calcule le pourcentage de changement
 */
function calculateChangePercentage(historical: TrendData[]): number {
  if (historical.length < 14) return 0;

  const recentWeek = historical.slice(-7);
  const previousWeek = historical.slice(-14, -7);

  const recentSum = recentWeek.reduce((sum, d) => sum + d.count, 0);
  const previousSum = previousWeek.reduce((sum, d) => sum + d.count, 0);

  if (previousSum === 0) return recentSum > 0 ? 100 : 0;

  return ((recentSum - previousSum) / previousSum) * 100;
}
