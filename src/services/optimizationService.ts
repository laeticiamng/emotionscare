// @ts-nocheck
import { logger } from '@/lib/logger';
import { supabase } from '@/integrations/supabase/client';

/** Événement d'optimisation */
export interface OptimizationEvent {
  userId: string;
  module: string;
  action: string;
  timestamp?: string;
  duration?: number;
  metadata?: Record<string, unknown>;
}

/** Suggestion d'optimisation */
export interface OptimizationSuggestion {
  id: string;
  module: string;
  description: string;
  priority: number;
  category: 'usage' | 'performance' | 'engagement' | 'wellness';
  actionUrl?: string;
  dismissed?: boolean;
}

/** Rapport d'utilisation */
export interface UsageReport {
  module: string;
  usageCount: number;
  totalDuration: number;
  lastUsed?: Date;
  trend: 'up' | 'down' | 'stable';
  effectiveness: number;
}

/** Métriques de performance */
export interface PerformanceMetrics {
  loadTime: number;
  interactionTime: number;
  errorRate: number;
  completionRate: number;
}

/** Analyse d'optimisation */
export interface OptimizationAnalysis {
  overallScore: number;
  strengths: string[];
  improvements: string[];
  recommendations: OptimizationSuggestion[];
}

/** Enregistre un événement d'optimisation */
export async function logEvent(event: OptimizationEvent): Promise<void> {
  try {
    const { data: userData } = await supabase.auth.getUser();
    const userId = event.userId || userData.user?.id;

    await supabase.from('optimization_events').insert({
      user_id: userId,
      module: event.module,
      action: event.action,
      duration: event.duration,
      metadata: event.metadata,
      timestamp: event.timestamp || new Date().toISOString()
    });

    logger.info('Optimization event logged', { module: event.module, action: event.action }, 'ANALYTICS');
  } catch (error) {
    logger.error('Error logging optimization event', error as Error, 'ANALYTICS');
  }
}

/** Récupère le rapport d'utilisation */
export async function fetchUsageReport(userId: string): Promise<UsageReport[]> {
  try {
    const { data, error } = await supabase
      .from('module_usage_stats')
      .select('*')
      .eq('user_id', userId)
      .order('usage_count', { ascending: false });

    if (error || !data) {
      return getDefaultUsageReport();
    }

    return data.map(item => ({
      module: item.module,
      usageCount: item.usage_count,
      totalDuration: item.total_duration || 0,
      lastUsed: item.last_used ? new Date(item.last_used) : undefined,
      trend: calculateTrend(item.weekly_counts || []),
      effectiveness: item.effectiveness_score || 0
    }));
  } catch (error) {
    logger.error('Error fetching usage report', error as Error, 'ANALYTICS');
    return getDefaultUsageReport();
  }
}

/** Génère des suggestions d'optimisation */
export async function generateOptimizationSuggestions(userId: string): Promise<OptimizationSuggestion[]> {
  const report = await fetchUsageReport(userId);
  const suggestions: OptimizationSuggestion[] = [];

  // Analyser l'utilisation et générer des suggestions
  const totalUsage = report.reduce((sum, r) => sum + r.usageCount, 0);

  for (const item of report) {
    const usageRatio = totalUsage > 0 ? item.usageCount / totalUsage : 0;

    // Module sous-utilisé
    if (usageRatio < 0.1 && item.effectiveness > 0.5) {
      suggestions.push({
        id: `underused-${item.module}`,
        module: item.module,
        description: `Le module ${item.module} pourrait vous aider davantage. Essayez-le !`,
        priority: 8,
        category: 'usage',
        actionUrl: `/${item.module.toLowerCase()}`
      });
    }

    // Tendance à la baisse
    if (item.trend === 'down' && item.usageCount > 5) {
      suggestions.push({
        id: `declining-${item.module}`,
        module: item.module,
        description: `Votre utilisation de ${item.module} a diminué. Reprenez vos bonnes habitudes !`,
        priority: 6,
        category: 'engagement'
      });
    }

    // Module efficace mais peu utilisé
    if (item.effectiveness > 0.7 && item.usageCount < 10) {
      suggestions.push({
        id: `effective-${item.module}`,
        module: item.module,
        description: `${item.module} montre de bons résultats pour vous. Utilisez-le plus souvent !`,
        priority: 9,
        category: 'wellness'
      });
    }
  }

  // Suggestions générales
  if (totalUsage < 20) {
    suggestions.push({
      id: 'low-engagement',
      module: 'Global',
      description: 'Explorez davantage la plateforme pour optimiser votre bien-être.',
      priority: 7,
      category: 'engagement'
    });
  }

  return suggestions.sort((a, b) => b.priority - a.priority).slice(0, 10);
}

/** Analyse complète d'optimisation */
export async function analyzeOptimization(userId: string): Promise<OptimizationAnalysis> {
  const report = await fetchUsageReport(userId);
  const suggestions = await generateOptimizationSuggestions(userId);

  const strengths: string[] = [];
  const improvements: string[] = [];

  for (const item of report) {
    if (item.usageCount > 10 && item.effectiveness > 0.6) {
      strengths.push(`Bonne utilisation de ${item.module}`);
    }
    if (item.trend === 'down') {
      improvements.push(`Reprendre ${item.module}`);
    }
  }

  const overallScore = calculateOverallScore(report);

  return {
    overallScore,
    strengths: strengths.slice(0, 5),
    improvements: improvements.slice(0, 5),
    recommendations: suggestions
  };
}

/** Récupère les métriques de performance d'un module */
export async function getModulePerformance(module: string): Promise<PerformanceMetrics> {
  try {
    const { data } = await supabase
      .from('module_performance')
      .select('*')
      .eq('module', module)
      .single();

    if (!data) {
      return { loadTime: 0, interactionTime: 0, errorRate: 0, completionRate: 0 };
    }

    return {
      loadTime: data.avg_load_time || 0,
      interactionTime: data.avg_interaction_time || 0,
      errorRate: data.error_rate || 0,
      completionRate: data.completion_rate || 0
    };
  } catch (error) {
    return { loadTime: 0, interactionTime: 0, errorRate: 0, completionRate: 0 };
  }
}

/** Enregistre les métriques de performance */
export async function logPerformanceMetrics(
  module: string,
  metrics: Partial<PerformanceMetrics>
): Promise<void> {
  try {
    await supabase.from('performance_logs').insert({
      module,
      load_time: metrics.loadTime,
      interaction_time: metrics.interactionTime,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    logger.error('Error logging performance', error as Error, 'ANALYTICS');
  }
}

/** Marque une suggestion comme ignorée */
export async function dismissSuggestion(suggestionId: string): Promise<void> {
  try {
    const { data: userData } = await supabase.auth.getUser();
    if (!userData.user?.id) return;

    await supabase.from('dismissed_suggestions').insert({
      user_id: userData.user.id,
      suggestion_id: suggestionId,
      dismissed_at: new Date().toISOString()
    });
  } catch (error) {
    logger.error('Error dismissing suggestion', error as Error, 'ANALYTICS');
  }
}

/** Récupère les tendances hebdomadaires */
export async function getWeeklyTrends(userId: string): Promise<{ week: string; score: number }[]> {
  try {
    const { data } = await supabase
      .from('weekly_optimization_scores')
      .select('week, score')
      .eq('user_id', userId)
      .order('week', { ascending: false })
      .limit(12);

    return data || [];
  } catch (error) {
    return [];
  }
}

/** Exporte le rapport d'optimisation */
export async function exportOptimizationReport(userId: string): Promise<string> {
  const report = await fetchUsageReport(userId);
  const analysis = await analyzeOptimization(userId);

  let csv = 'Rapport d\'optimisation\n\n';
  csv += `Score global,${analysis.overallScore}/100\n\n`;

  csv += 'Module,Utilisation,Durée totale,Efficacité,Tendance\n';
  for (const item of report) {
    csv += `${item.module},${item.usageCount},${item.totalDuration},${item.effectiveness},${item.trend}\n`;
  }

  csv += '\nPoints forts\n';
  for (const s of analysis.strengths) {
    csv += `${s}\n`;
  }

  csv += '\nAméliorations suggérées\n';
  for (const i of analysis.improvements) {
    csv += `${i}\n`;
  }

  return csv;
}

function getDefaultUsageReport(): UsageReport[] {
  return [
    { module: 'Journal', usageCount: 0, totalDuration: 0, trend: 'stable', effectiveness: 0 },
    { module: 'Coach', usageCount: 0, totalDuration: 0, trend: 'stable', effectiveness: 0 },
    { module: 'Music', usageCount: 0, totalDuration: 0, trend: 'stable', effectiveness: 0 },
    { module: 'Breath', usageCount: 0, totalDuration: 0, trend: 'stable', effectiveness: 0 },
    { module: 'Meditation', usageCount: 0, totalDuration: 0, trend: 'stable', effectiveness: 0 }
  ];
}

function calculateTrend(weeklyData: number[]): 'up' | 'down' | 'stable' {
  if (weeklyData.length < 2) return 'stable';
  const recent = weeklyData.slice(0, 2).reduce((a, b) => a + b, 0);
  const older = weeklyData.slice(-2).reduce((a, b) => a + b, 0);
  if (recent > older * 1.1) return 'up';
  if (recent < older * 0.9) return 'down';
  return 'stable';
}

function calculateOverallScore(report: UsageReport[]): number {
  if (report.length === 0) return 0;

  const usageScore = Math.min(100, report.reduce((sum, r) => sum + r.usageCount, 0) * 2);
  const effectivenessScore = (report.reduce((sum, r) => sum + r.effectiveness, 0) / report.length) * 100;
  const diversityScore = (report.filter(r => r.usageCount > 0).length / report.length) * 100;

  return Math.round((usageScore * 0.3 + effectivenessScore * 0.4 + diversityScore * 0.3));
}
