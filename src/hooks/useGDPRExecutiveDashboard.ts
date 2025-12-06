import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { logger } from '@/lib/logger';

interface MonthlyData {
  month: string;
  complianceScore: number;
  consents: number;
  exports: number;
  deletions: number;
  alerts: number;
  criticalAlerts: number;
  averageResolutionTime: number;
}

interface YearlyTrend {
  year: number;
  months: MonthlyData[];
  averageScore: number;
  totalActions: number;
  improvementRate: number;
}

interface ComparisonMetrics {
  currentMonth: MonthlyData;
  previousMonth: MonthlyData;
  percentageChanges: {
    score: number;
    consents: number;
    exports: number;
    deletions: number;
    alerts: number;
  };
}

interface StrategicRecommendation {
  id: string;
  priority: 'high' | 'medium' | 'low';
  category: string;
  title: string;
  description: string;
  impact: string;
  actionItems: string[];
  estimatedTimeframe: string;
}

interface ExecutiveDashboardData {
  yearlyTrend: YearlyTrend;
  comparison: ComparisonMetrics;
  recommendations: StrategicRecommendation[];
  kpis: {
    overallCompliance: number;
    riskLevel: 'low' | 'medium' | 'high' | 'critical';
    monthlyImprovement: number;
    costOfNonCompliance: number;
  };
}

/**
 * Hook pour le tableau de bord exécutif RGPD
 */
export const useGDPRExecutiveDashboard = () => {
  const [data, setData] = useState<ExecutiveDashboardData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchExecutiveData = async () => {
    try {
      setIsLoading(true);

      // Récupérer les données des 12 derniers mois
      const endDate = new Date();
      const startDate = new Date();
      startDate.setFullYear(startDate.getFullYear() - 1);

      // Générer les données mensuelles (dans une vraie implémentation, ces données viendraient de la DB)
      const monthlyData = await generateMonthlyData(startDate, endDate);

      // Calculer les tendances annuelles
      const yearlyTrend: YearlyTrend = {
        year: endDate.getFullYear(),
        months: monthlyData,
        averageScore: monthlyData.reduce((sum, m) => sum + m.complianceScore, 0) / monthlyData.length,
        totalActions: monthlyData.reduce((sum, m) => sum + m.consents + m.exports + m.deletions, 0),
        improvementRate: calculateImprovementRate(monthlyData),
      };

      // Calculer les comparaisons
      const currentMonth = monthlyData[monthlyData.length - 1];
      const previousMonth = monthlyData[monthlyData.length - 2];
      const comparison: ComparisonMetrics = {
        currentMonth,
        previousMonth,
        percentageChanges: {
          score: calculatePercentageChange(previousMonth.complianceScore, currentMonth.complianceScore),
          consents: calculatePercentageChange(previousMonth.consents, currentMonth.consents),
          exports: calculatePercentageChange(previousMonth.exports, currentMonth.exports),
          deletions: calculatePercentageChange(previousMonth.deletions, currentMonth.deletions),
          alerts: calculatePercentageChange(previousMonth.alerts, currentMonth.alerts),
        },
      };

      // Générer les recommandations stratégiques
      const recommendations = await generateStrategicRecommendations(currentMonth, yearlyTrend);

      // Calculer les KPIs
      const kpis = {
        overallCompliance: currentMonth.complianceScore,
        riskLevel: determineRiskLevel(currentMonth),
        monthlyImprovement: comparison.percentageChanges.score,
        costOfNonCompliance: calculatePotentialCost(currentMonth),
      };

      setData({
        yearlyTrend,
        comparison,
        recommendations,
        kpis,
      });

      logger.debug('Executive dashboard data loaded', { yearlyTrend, comparison }, 'GDPR');
    } catch (error) {
      logger.error('Error fetching executive dashboard data', error as Error, 'GDPR');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchExecutiveData();

    // Rafraîchir toutes les heures
    const interval = setInterval(fetchExecutiveData, 60 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  return {
    data,
    isLoading,
    refetch: fetchExecutiveData,
  };
};

/**
 * Générer les données mensuelles à partir des données réelles
 */
async function generateMonthlyData(startDate: Date, endDate: Date): Promise<MonthlyData[]> {
  const months: MonthlyData[] = [];
  const currentDate = new Date(startDate);

  while (currentDate <= endDate) {
    const monthStart = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
    const monthEnd = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);

    // Récupérer les données réelles pour ce mois
    const [consents, exports, deletions, alerts] = await Promise.all([
      supabase
        .from('user_consents')
        .select('*', { count: 'exact', head: true })
        .gte('created_at', monthStart.toISOString())
        .lte('created_at', monthEnd.toISOString()),
      supabase
        .from('data_export_requests')
        .select('*', { count: 'exact', head: true })
        .gte('created_at', monthStart.toISOString())
        .lte('created_at', monthEnd.toISOString()),
      supabase
        .from('data_deletion_requests')
        .select('*', { count: 'exact', head: true })
        .gte('created_at', monthStart.toISOString())
        .lte('created_at', monthEnd.toISOString()),
      supabase
        .from('gdpr_alerts')
        .select('*')
        .gte('created_at', monthStart.toISOString())
        .lte('created_at', monthEnd.toISOString()),
    ]);

    const criticalAlertsCount = alerts.data?.filter((a: any) => a.severity === 'critical').length || 0;
    const totalAlerts = alerts.data?.length || 0;

    // Calculer le score de conformité pour ce mois
    const score = calculateMonthlyScore(
      consents.count || 0,
      exports.count || 0,
      deletions.count || 0,
      criticalAlertsCount
    );

    months.push({
      month: monthStart.toLocaleDateString('fr-FR', { year: 'numeric', month: 'short' }),
      complianceScore: score,
      consents: consents.count || 0,
      exports: exports.count || 0,
      deletions: deletions.count || 0,
      alerts: totalAlerts,
      criticalAlerts: criticalAlertsCount,
      averageResolutionTime: 24, // Simulé
    });

    currentDate.setMonth(currentDate.getMonth() + 1);
  }

  return months;
}

function calculateMonthlyScore(
  consents: number,
  exports: number,
  deletions: number,
  criticalAlerts: number
): number {
  // Score basé sur l'activité et l'absence d'alertes critiques
  let score = 70; // Base

  if (consents > 10) score += 10;
  if (exports === 0 && deletions === 0) score += 10;
  if (criticalAlerts === 0) score += 10;
  if (criticalAlerts > 5) score -= 20;

  return Math.max(0, Math.min(100, score));
}

function calculatePercentageChange(oldValue: number, newValue: number): number {
  if (oldValue === 0) return newValue > 0 ? 100 : 0;
  return ((newValue - oldValue) / oldValue) * 100;
}

function calculateImprovementRate(months: MonthlyData[]): number {
  if (months.length < 2) return 0;
  const firstScore = months[0].complianceScore;
  const lastScore = months[months.length - 1].complianceScore;
  return calculatePercentageChange(firstScore, lastScore);
}

function determineRiskLevel(month: MonthlyData): 'low' | 'medium' | 'high' | 'critical' {
  if (month.criticalAlerts > 5 || month.complianceScore < 50) return 'critical';
  if (month.criticalAlerts > 2 || month.complianceScore < 70) return 'high';
  if (month.alerts > 10 || month.complianceScore < 85) return 'medium';
  return 'low';
}

function calculatePotentialCost(month: MonthlyData): number {
  // Estimation du coût potentiel de non-conformité (en euros)
  const baseCost = 10000;
  const criticalAlertCost = month.criticalAlerts * 5000;
  const lowScoreCost = month.complianceScore < 70 ? 20000 : 0;
  return baseCost + criticalAlertCost + lowScoreCost;
}

async function generateStrategicRecommendations(
  currentMonth: MonthlyData,
  yearlyTrend: YearlyTrend
): Promise<StrategicRecommendation[]> {
  const recommendations: StrategicRecommendation[] = [];

  // Recommandation basée sur les alertes critiques
  if (currentMonth.criticalAlerts > 0) {
    recommendations.push({
      id: 'reduce-critical-alerts',
      priority: 'high',
      category: 'Gestion des risques',
      title: 'Réduire les alertes critiques',
      description: `${currentMonth.criticalAlerts} alertes critiques détectées ce mois. Une action immédiate est requise pour éviter des risques de non-conformité.`,
      impact: 'Réduction du risque de sanctions RGPD jusqu\'à 20M€',
      actionItems: [
        'Analyser les causes racines des alertes critiques',
        'Mettre en place des processus de prévention',
        'Former les équipes sur les bonnes pratiques RGPD',
        'Automatiser la détection précoce des anomalies',
      ],
      estimatedTimeframe: '1-2 mois',
    });
  }

  // Recommandation basée sur le score
  if (currentMonth.complianceScore < 85) {
    recommendations.push({
      id: 'improve-compliance-score',
      priority: 'high',
      category: 'Conformité générale',
      title: 'Améliorer le score de conformité',
      description: `Score actuel: ${currentMonth.complianceScore}/100. Un score inférieur à 85 indique des axes d'amélioration significatifs.`,
      impact: 'Augmentation de la confiance des utilisateurs et réduction des risques légaux',
      actionItems: [
        'Audit complet des processus de gestion des données',
        'Optimiser les temps de réponse aux demandes d\'export',
        'Renforcer les mécanismes de consentement',
        'Mettre en place un suivi mensuel des KPIs',
      ],
      estimatedTimeframe: '3-6 mois',
    });
  }

  // Recommandation basée sur la tendance
  if (yearlyTrend.improvementRate < 0) {
    recommendations.push({
      id: 'reverse-negative-trend',
      priority: 'high',
      category: 'Stratégie',
      title: 'Inverser la tendance négative',
      description: `Le score de conformité a diminué de ${Math.abs(yearlyTrend.improvementRate).toFixed(1)}% sur l'année. Une stratégie de redressement est nécessaire.`,
      impact: 'Prévention de sanctions et amélioration de la réputation',
      actionItems: [
        'Identifier les facteurs de dégradation',
        'Définir un plan d\'action correctif prioritaire',
        'Allouer des ressources dédiées à la conformité RGPD',
        'Mettre en place des revues trimestrielles avec la direction',
      ],
      estimatedTimeframe: '6-12 mois',
    });
  } else {
    recommendations.push({
      id: 'maintain-improvement',
      priority: 'medium',
      category: 'Optimisation',
      title: 'Maintenir la dynamique positive',
      description: `Amélioration de ${yearlyTrend.improvementRate.toFixed(1)}% sur l'année. Consolider les acquis et viser l'excellence.`,
      impact: 'Positionnement comme leader en matière de protection des données',
      actionItems: [
        'Documenter et partager les bonnes pratiques',
        'Mettre en place des certifications (ISO 27001, etc.)',
        'Développer une culture de la privacy by design',
        'Communiquer sur les efforts de conformité',
      ],
      estimatedTimeframe: 'Continue',
    });
  }

  // Recommandation sur l'automatisation
  if (currentMonth.exports > 20 || currentMonth.deletions > 20) {
    recommendations.push({
      id: 'automate-processes',
      priority: 'medium',
      category: 'Efficacité opérationnelle',
      title: 'Automatiser les processus répétitifs',
      description: `Volume élevé de demandes (${currentMonth.exports} exports, ${currentMonth.deletions} suppressions). L'automatisation permettrait de gagner en efficacité.`,
      impact: 'Réduction des coûts opérationnels de 40% et amélioration du temps de traitement',
      actionItems: [
        'Implémenter des workflows automatisés',
        'Développer des APIs self-service pour les utilisateurs',
        'Mettre en place des notifications automatiques',
        'Créer des tableaux de bord en temps réel',
      ],
      estimatedTimeframe: '2-4 mois',
    });
  }

  return recommendations;
}

/**
 * Générer un rapport PDF exécutif
 */
export const generateExecutivePDFReport = async (data: ExecutiveDashboardData): Promise<void> => {
  try {
    const { data: pdfData, error } = await supabase.functions.invoke('generate-executive-report', {
      body: { reportData: data },
    });

    if (error) throw error;

    // Créer un Blob à partir du HTML et ouvrir dans un nouvel onglet
    if (pdfData?.html) {
      const blob = new Blob([pdfData.html], { type: 'text/html' });
      const url = URL.createObjectURL(blob);
      const newWindow = window.open(url, '_blank');
      
      // Ajouter un bouton d'impression dans la nouvelle fenêtre
      if (newWindow) {
        newWindow.onload = () => {
          setTimeout(() => {
            newWindow.print();
          }, 500);
        };
      }
    }

    logger.info('Executive PDF report generated successfully', undefined, 'GDPR');
  } catch (error) {
    logger.error('Error generating executive PDF report', error as Error, 'GDPR');
    throw error;
  }
};
