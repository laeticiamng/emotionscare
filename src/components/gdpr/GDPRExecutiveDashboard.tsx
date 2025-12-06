import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
} from 'recharts';
import {
  FileDown,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  Shield,
  DollarSign,
  Target,
  CheckCircle2,
  ArrowUpRight,
  ArrowDownRight,
} from 'lucide-react';
import { useGDPRExecutiveDashboard, generateExecutivePDFReport } from '@/hooks/useGDPRExecutiveDashboard';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from 'sonner';

/**
 * Tableau de bord exécutif RGPD
 * Vue stratégique pour la direction
 */
export const GDPRExecutiveDashboard: React.FC = () => {
  const { data, isLoading } = useGDPRExecutiveDashboard();
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);

  const handleGeneratePDF = async () => {
    if (!data) return;
    
    try {
      setIsGeneratingPDF(true);
      await generateExecutivePDFReport(data);
      toast.success('Rapport PDF généré avec succès');
    } catch (error) {
      toast.error('Erreur lors de la génération du rapport PDF');
    } finally {
      setIsGeneratingPDF(false);
    }
  };

  if (isLoading || !data) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-48 w-full" />
        <Skeleton className="h-96 w-full" />
      </div>
    );
  }

  const getRiskColor = (level: string) => {
    const colors = {
      low: 'text-green-600 bg-green-100 dark:bg-green-950',
      medium: 'text-yellow-600 bg-yellow-100 dark:bg-yellow-950',
      high: 'text-orange-600 bg-orange-100 dark:bg-orange-950',
      critical: 'text-red-600 bg-red-100 dark:bg-red-950',
    };
    return colors[level as keyof typeof colors] || colors.medium;
  };

  const getRiskLabel = (level: string) => {
    const labels = {
      low: 'Faible',
      medium: 'Moyen',
      high: 'Élevé',
      critical: 'Critique',
    };
    return labels[level as keyof typeof labels] || 'Inconnu';
  };

  return (
    <div className="space-y-6">
      {/* En-tête exécutif */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-foreground">Tableau de Bord Exécutif RGPD</h2>
          <p className="text-muted-foreground mt-1">
            Vue stratégique et recommandations pour la direction
          </p>
        </div>
        <Button onClick={handleGeneratePDF} disabled={isGeneratingPDF}>
          <FileDown className="h-4 w-4 mr-2" />
          {isGeneratingPDF ? 'Génération...' : 'Télécharger le rapport PDF'}
        </Button>
      </div>

      {/* KPIs Exécutifs */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <ExecutiveKPI
          label="Score de Conformité Global"
          value={data.kpis.overallCompliance}
          suffix="/100"
          icon={Shield}
          color={data.kpis.overallCompliance >= 85 ? 'green' : 'orange'}
          trend={data.kpis.monthlyImprovement}
        />
        <ExecutiveKPI
          label="Niveau de Risque"
          value={getRiskLabel(data.kpis.riskLevel)}
          icon={AlertTriangle}
          color={data.kpis.riskLevel === 'low' ? 'green' : data.kpis.riskLevel === 'critical' ? 'red' : 'orange'}
          badge={<Badge className={getRiskColor(data.kpis.riskLevel)}>{getRiskLabel(data.kpis.riskLevel)}</Badge>}
        />
        <ExecutiveKPI
          label="Amélioration Mensuelle"
          value={Math.abs(data.kpis.monthlyImprovement).toFixed(1)}
          suffix="%"
          icon={data.kpis.monthlyImprovement >= 0 ? TrendingUp : TrendingDown}
          color={data.kpis.monthlyImprovement >= 0 ? 'green' : 'red'}
          trend={data.kpis.monthlyImprovement}
        />
        <ExecutiveKPI
          label="Coût Potentiel de Non-Conformité"
          value={`${(data.kpis.costOfNonCompliance / 1000).toFixed(0)}K`}
          suffix="€"
          icon={DollarSign}
          color="red"
        />
      </div>

      {/* Tendances Annuelles */}
      <Card>
        <CardHeader>
          <CardTitle>Tendances Annuelles {data.yearlyTrend.year}</CardTitle>
          <CardDescription>
            Évolution du score de conformité sur 12 mois
            {data.yearlyTrend.improvementRate !== 0 && (
              <span className={`ml-2 font-semibold ${data.yearlyTrend.improvementRate > 0 ? 'text-green-600' : 'text-red-600'}`}>
                {data.yearlyTrend.improvementRate > 0 ? '+' : ''}
                {data.yearlyTrend.improvementRate.toFixed(1)}% sur l'année
              </span>
            )}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={data.yearlyTrend.months}>
              <defs>
                <linearGradient id="scoreGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0.1} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" fontSize={12} />
              <YAxis domain={[0, 100]} stroke="hsl(var(--muted-foreground))" fontSize={12} />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'hsl(var(--background))',
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '8px',
                }}
              />
              <Area
                type="monotone"
                dataKey="complianceScore"
                stroke="hsl(var(--primary))"
                strokeWidth={3}
                fill="url(#scoreGradient)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Comparaison Mensuelle */}
      <Card>
        <CardHeader>
          <CardTitle>Comparaison Mensuelle</CardTitle>
          <CardDescription>
            {data.comparison.currentMonth.month} vs {data.comparison.previousMonth.month}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-semibold mb-4">Métriques Clés</h4>
              <div className="space-y-3">
                <ComparisonMetric
                  label="Score de conformité"
                  current={data.comparison.currentMonth.complianceScore}
                  previous={data.comparison.previousMonth.complianceScore}
                  change={data.comparison.percentageChanges.score}
                  suffix="/100"
                />
                <ComparisonMetric
                  label="Consentements"
                  current={data.comparison.currentMonth.consents}
                  previous={data.comparison.previousMonth.consents}
                  change={data.comparison.percentageChanges.consents}
                />
                <ComparisonMetric
                  label="Exports"
                  current={data.comparison.currentMonth.exports}
                  previous={data.comparison.previousMonth.exports}
                  change={data.comparison.percentageChanges.exports}
                />
                <ComparisonMetric
                  label="Suppressions"
                  current={data.comparison.currentMonth.deletions}
                  previous={data.comparison.previousMonth.deletions}
                  change={data.comparison.percentageChanges.deletions}
                />
                <ComparisonMetric
                  label="Alertes"
                  current={data.comparison.currentMonth.alerts}
                  previous={data.comparison.previousMonth.alerts}
                  change={data.comparison.percentageChanges.alerts}
                  invertColors
                />
              </div>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Vue d'ensemble</h4>
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={[data.comparison.previousMonth, data.comparison.currentMonth]}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                  <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'hsl(var(--background))',
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px',
                    }}
                  />
                  <Legend />
                  <Bar dataKey="consents" fill="hsl(221 83% 53%)" name="Consentements" />
                  <Bar dataKey="exports" fill="hsl(142 76% 36%)" name="Exports" />
                  <Bar dataKey="deletions" fill="hsl(0 84% 60%)" name="Suppressions" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Recommandations Stratégiques */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5" />
            Recommandations Stratégiques
          </CardTitle>
          <CardDescription>
            Actions prioritaires pour améliorer la conformité RGPD
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {data.recommendations.map((rec) => (
              <StrategicRecommendation key={rec.id} recommendation={rec} />
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

/**
 * KPI Exécutif animé
 */
interface ExecutiveKPIProps {
  label: string;
  value: string | number;
  suffix?: string;
  icon: React.FC<{ className?: string }>;
  color: 'green' | 'red' | 'orange' | 'blue';
  trend?: number;
  badge?: React.ReactNode;
}

const ExecutiveKPI: React.FC<ExecutiveKPIProps> = ({
  label,
  value,
  suffix,
  icon: Icon,
  color,
  trend,
  badge,
}) => {
  const colorClasses = {
    green: 'text-green-600 bg-green-50 dark:bg-green-950',
    red: 'text-red-600 bg-red-50 dark:bg-red-950',
    orange: 'text-orange-600 bg-orange-50 dark:bg-orange-950',
    blue: 'text-blue-600 bg-blue-50 dark:bg-blue-950',
  };

  return (
    <motion.div
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <Card>
        <CardContent className="p-6">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <p className="text-sm text-muted-foreground mb-2">{label}</p>
              {badge ? (
                <div className="mt-2">{badge}</div>
              ) : (
                <div className="flex items-baseline gap-2">
                  <motion.span
                    key={value}
                    initial={{ scale: 1.2, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="text-3xl font-bold text-foreground"
                  >
                    {value}
                  </motion.span>
                  {suffix && <span className="text-lg text-muted-foreground">{suffix}</span>}
                </div>
              )}
              {trend !== undefined && trend !== 0 && (
                <div className="flex items-center gap-1 mt-2">
                  {trend > 0 ? (
                    <ArrowUpRight className="h-4 w-4 text-green-600" />
                  ) : (
                    <ArrowDownRight className="h-4 w-4 text-red-600" />
                  )}
                  <span className={`text-sm font-medium ${trend > 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {Math.abs(trend).toFixed(1)}%
                  </span>
                </div>
              )}
            </div>
            <div className={`p-3 rounded-full ${colorClasses[color]}`}>
              <Icon className="h-6 w-6" />
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

/**
 * Métrique de comparaison
 */
interface ComparisonMetricProps {
  label: string;
  current: number;
  previous: number;
  change: number;
  suffix?: string;
  invertColors?: boolean;
}

const ComparisonMetric: React.FC<ComparisonMetricProps> = ({
  label,
  current,
  previous,
  change,
  suffix = '',
  invertColors = false,
}) => {
  const isPositive = invertColors ? change < 0 : change > 0;
  const color = isPositive ? 'text-green-600' : 'text-red-600';

  return (
    <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
      <div>
        <p className="text-sm font-medium text-foreground">{label}</p>
        <div className="flex items-baseline gap-2 mt-1">
          <span className="text-lg font-bold">{current}{suffix}</span>
          <span className="text-xs text-muted-foreground">vs {previous}{suffix}</span>
        </div>
      </div>
      <div className={`flex items-center gap-1 ${color}`}>
        {change > 0 ? <ArrowUpRight className="h-4 w-4" /> : <ArrowDownRight className="h-4 w-4" />}
        <span className="text-sm font-semibold">{Math.abs(change).toFixed(1)}%</span>
      </div>
    </div>
  );
};

/**
 * Recommandation stratégique
 */
interface StrategicRecommendationProps {
  recommendation: any;
}

const StrategicRecommendation: React.FC<StrategicRecommendationProps> = ({ recommendation }) => {
  const priorityColors = {
    high: 'bg-red-100 text-red-800 dark:bg-red-950 dark:text-red-300',
    medium: 'bg-orange-100 text-orange-800 dark:bg-orange-950 dark:text-orange-300',
    low: 'bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300',
  };

  return (
    <div className="border rounded-lg p-4 space-y-3">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <h4 className="font-semibold text-foreground">{recommendation.title}</h4>
            <Badge className={priorityColors[recommendation.priority as keyof typeof priorityColors]}>
              {recommendation.priority === 'high' ? 'Priorité Haute' : recommendation.priority === 'medium' ? 'Priorité Moyenne' : 'Priorité Basse'}
            </Badge>
            <Badge variant="outline">{recommendation.category}</Badge>
          </div>
          <p className="text-sm text-muted-foreground">{recommendation.description}</p>
        </div>
      </div>

      <div className="bg-muted/50 p-3 rounded-md">
        <p className="text-sm font-medium text-foreground mb-2">
          <span className="text-primary">Impact:</span> {recommendation.impact}
        </p>
        <p className="text-sm text-muted-foreground">
          <span className="font-medium">Délai estimé:</span> {recommendation.estimatedTimeframe}
        </p>
      </div>

      <div>
        <p className="text-sm font-medium text-foreground mb-2">Plan d'action:</p>
        <ul className="space-y-1">
          {recommendation.actionItems.map((item: string, index: number) => (
            <li key={index} className="flex items-start gap-2 text-sm text-muted-foreground">
              <CheckCircle2 className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default GDPRExecutiveDashboard;
