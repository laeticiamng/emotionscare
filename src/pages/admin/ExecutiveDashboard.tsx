import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { logger } from '@/lib/logger';
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
  Legend
} from 'recharts';
import { format as formatDate, subMonths, startOfMonth, endOfMonth } from 'date-fns';
import { fr } from 'date-fns/locale';
import { 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  Clock, 
  Zap, 
  Award,
  Download,
  RefreshCw
} from 'lucide-react';
import { toast } from 'sonner';
import { downloadExcel, generatePrintablePDF } from '@/lib/exportUtils';

type TimePeriod = '3months' | '6months' | '12months';

const ExecutiveDashboard: React.FC = () => {
  const [timePeriod, setTimePeriod] = useState<TimePeriod>('3months');
  const [isExporting, setIsExporting] = useState(false);

  const getMonthsCount = (period: TimePeriod) => {
    switch (period) {
      case '3months': return 3;
      case '6months': return 6;
      case '12months': return 12;
      default: return 3;
    }
  };

  // Fetch executive metrics
  const { data: executiveMetrics, isLoading, refetch } = useQuery({
    queryKey: ['executive-business-metrics', timePeriod],
    queryFn: async () => {
      const monthsCount = getMonthsCount(timePeriod);
      const startDate = startOfMonth(subMonths(new Date(), monthsCount));
      
      const { data, error } = await supabase
        .from('executive_business_metrics')
        .select('*')
        .gte('metric_date', startDate.toISOString().split('T')[0])
        .order('metric_date', { ascending: true });
      
      if (error) throw error;
      return data;
    },
    refetchInterval: 60000, // Refresh every minute
  });

  // Process metrics by month
  const processMonthlyData = () => {
    if (!executiveMetrics || executiveMetrics.length === 0) return [];

    const metricsByMonth: Record<string, any[]> = {};

    executiveMetrics.forEach(metric => {
      const month = formatDate(new Date(metric.metric_date), 'yyyy-MM');
      if (!metricsByMonth[month]) {
        metricsByMonth[month] = [];
      }
      metricsByMonth[month].push(metric);
    });

    const chartData: any[] = [];
    Object.entries(metricsByMonth).forEach(([month, metrics]) => {
      const totalEscalations = metrics.reduce((sum, m) => sum + (m.total_escalations || 0), 0);
      const totalCost = metrics.reduce((sum, m) => sum + parseFloat(m.total_escalation_cost || 0), 0);
      const totalValueSaved = metrics.reduce((sum, m) => sum + parseFloat(m.business_value_saved || 0), 0);
      const totalTimeSaved = metrics.reduce((sum, m) => sum + parseFloat(m.time_saved_hours || 0), 0);
      const avgAutomationRate = metrics.reduce((sum, m) => sum + parseFloat(m.automation_rate_percentage || 0), 0) / metrics.length;
      const totalABTestWins = metrics.reduce((sum, m) => sum + (m.ab_test_wins || 0), 0);
      const avgROI = metrics.reduce((sum, m) => sum + parseFloat(m.ab_test_roi_percentage || 0), 0) / metrics.length;

      chartData.push({
        month,
        monthFormatted: formatDate(new Date(month + '-01'), 'MMM yyyy', { locale: fr }),
        totalEscalations,
        totalCost,
        avgCostPerEscalation: totalEscalations > 0 ? totalCost / totalEscalations : 0,
        totalValueSaved,
        totalTimeSaved,
        avgAutomationRate,
        totalABTestWins,
        avgROI,
        netSavings: totalValueSaved - totalCost
      });
    });

    return chartData;
  };

  const chartData = processMonthlyData();

  // Calculate KPIs
  const calculateKPIs = () => {
    if (chartData.length === 0) return {};

    const latest = chartData[chartData.length - 1];
    const previous = chartData.length > 1 ? chartData[chartData.length - 2] : null;

    const totalCost = chartData.reduce((sum, d) => sum + d.totalCost, 0);
    const totalValueSaved = chartData.reduce((sum, d) => sum + d.totalValueSaved, 0);
    const totalTimeSaved = chartData.reduce((sum, d) => sum + d.totalTimeSaved, 0);
    const totalABTestWins = chartData.reduce((sum, d) => sum + d.totalABTestWins, 0);
    const avgAutomation = chartData.reduce((sum, d) => sum + d.avgAutomationRate, 0) / chartData.length;

    const calculateTrend = (current: number, prev: number | null) => {
      if (!prev || prev === 0) return { change: 0, trend: 'stable' as const };
      const change = ((current - prev) / prev) * 100;
      return {
        change,
        trend: Math.abs(change) > 5 ? (change > 0 ? 'up' as const : 'down' as const) : 'stable' as const
      };
    };

    return {
      totalCost,
      totalValueSaved,
      netROI: totalValueSaved - totalCost,
      roiPercentage: totalCost > 0 ? ((totalValueSaved - totalCost) / totalCost) * 100 : 0,
      totalTimeSaved,
      totalABTestWins,
      avgAutomation,
      costTrend: previous ? calculateTrend(latest.totalCost, previous.totalCost) : { change: 0, trend: 'stable' as const },
      valueTrend: previous ? calculateTrend(latest.totalValueSaved, previous.totalValueSaved) : { change: 0, trend: 'stable' as const },
      timeTrend: previous ? calculateTrend(latest.totalTimeSaved, previous.totalTimeSaved) : { change: 0, trend: 'stable' as const }
    };
  };

  const kpis = calculateKPIs();

  const handleExport = async (format: 'excel' | 'pdf') => {
    setIsExporting(true);
    try {
      const exportData = chartData.map(d => ({
        'Mois': d.monthFormatted,
        'Escalades': d.totalEscalations,
        'Coût Total (€)': d.totalCost.toFixed(2),
        'Coût Moyen (€)': d.avgCostPerEscalation.toFixed(2),
        'Valeur Sauvée (€)': d.totalValueSaved.toFixed(2),
        'Temps Économisé (h)': d.totalTimeSaved.toFixed(1),
        'Taux Automation (%)': d.avgAutomationRate.toFixed(1),
        'Tests A/B Gagnés': d.totalABTestWins,
        'ROI Moyen (%)': d.avgROI.toFixed(1),
        'Bénéfice Net (€)': d.netSavings.toFixed(2)
      }));

      const recommendations = [
        `ROI global de ${kpis.roiPercentage?.toFixed(1)}% sur ${getMonthsCount(timePeriod)} mois`,
        `Valeur business totale sauvée : ${kpis.totalValueSaved?.toFixed(0)}€`,
        `Temps économisé : ${kpis.totalTimeSaved?.toFixed(0)} heures (${(kpis.totalTimeSaved! / 8).toFixed(1)} jours)`,
        `${kpis.totalABTestWins} tests A/B gagnants déployés`,
        `Taux d'automation moyen : ${kpis.avgAutomation?.toFixed(1)}%`,
        kpis.netROI! > 0 
          ? `Bénéfice net positif de ${kpis.netROI?.toFixed(0)}€` 
          : `Optimisation nécessaire pour atteindre ROI positif`,
      ];

      if (format === 'excel') {
        downloadExcel(
          {
            title: `Rapport Exécutif EmotionsCare - ${getMonthsCount(timePeriod)} mois`,
            subtitle: `Période : ${chartData[0]?.monthFormatted} - ${chartData[chartData.length - 1]?.monthFormatted}`,
            data: exportData,
            mlRecommendations: recommendations
          },
          `executive-report-${timePeriod}-${formatDate(new Date(), 'yyyy-MM-dd')}.xlsx`
        );
        toast.success('Rapport Excel téléchargé');
      } else {
        generatePrintablePDF({
          title: `Rapport Exécutif EmotionsCare - ${getMonthsCount(timePeriod)} mois`,
          subtitle: `Période : ${chartData[0]?.monthFormatted} - ${chartData[chartData.length - 1]?.monthFormatted}`,
          data: exportData,
          mlRecommendations: recommendations
        });
        toast.success('PDF généré - Utilisez le dialogue d\'impression');
      }
    } catch (error) {
      logger.error('Export error:', error, 'PAGE');
      toast.error('Erreur lors de l\'export');
    } finally {
      setIsExporting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto py-8 px-4">
        <Card>
          <CardContent className="flex items-center justify-center h-64">
            <RefreshCw className="animate-spin h-8 w-8 text-primary" />
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Dashboard Exécutif</h1>
          <p className="text-muted-foreground mt-1">Vue d'ensemble des performances business</p>
        </div>
        <div className="flex gap-2">
          <Tabs value={timePeriod} onValueChange={(v) => setTimePeriod(v as TimePeriod)}>
            <TabsList>
              <TabsTrigger value="3months">3 mois</TabsTrigger>
              <TabsTrigger value="6months">6 mois</TabsTrigger>
              <TabsTrigger value="12months">12 mois</TabsTrigger>
            </TabsList>
          </Tabs>
          <Button variant="outline" size="icon" onClick={() => refetch()} aria-label="Actualiser les données">
            <RefreshCw className="h-4 w-4" />
          </Button>
          <Button variant="outline" onClick={() => handleExport('excel')} disabled={isExporting}>
            <Download className="h-4 w-4 mr-2" />
            Excel
          </Button>
          <Button variant="outline" onClick={() => handleExport('pdf')} disabled={isExporting}>
            <Download className="h-4 w-4 mr-2" />
            PDF
          </Button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* ROI Card */}
        <Card>
          <CardHeader className="pb-2">
            <CardDescription className="flex items-center gap-2">
              <Award className="h-4 w-4" />
              ROI Global
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">
              {kpis.roiPercentage?.toFixed(1)}%
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {kpis.netROI?.toFixed(0)}€ bénéfice net
            </p>
            {kpis.valueTrend && kpis.valueTrend.trend !== 'stable' && (
              <div className="flex items-center gap-1 mt-2">
                {kpis.valueTrend.trend === 'up' ? (
                  <TrendingUp className="h-4 w-4 text-green-500" />
                ) : (
                  <TrendingDown className="h-4 w-4 text-red-500" />
                )}
                <span className={`text-sm ${kpis.valueTrend.trend === 'up' ? 'text-green-500' : 'text-red-500'}`}>
                  {kpis.valueTrend.change > 0 ? '+' : ''}{kpis.valueTrend.change.toFixed(1)}%
                </span>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Cost Card */}
        <Card>
          <CardHeader className="pb-2">
            <CardDescription className="flex items-center gap-2">
              <DollarSign className="h-4 w-4" />
              Coût Total Escalades
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">
              {kpis.totalCost?.toFixed(0)}€
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {getMonthsCount(timePeriod)} derniers mois
            </p>
            {kpis.costTrend && kpis.costTrend.trend !== 'stable' && (
              <div className="flex items-center gap-1 mt-2">
                {kpis.costTrend.trend === 'up' ? (
                  <TrendingUp className="h-4 w-4 text-red-500" />
                ) : (
                  <TrendingDown className="h-4 w-4 text-green-500" />
                )}
                <span className={`text-sm ${kpis.costTrend.trend === 'up' ? 'text-red-500' : 'text-green-500'}`}>
                  {kpis.costTrend.change > 0 ? '+' : ''}{kpis.costTrend.change.toFixed(1)}%
                </span>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Time Saved Card */}
        <Card>
          <CardHeader className="pb-2">
            <CardDescription className="flex items-center gap-2">
              <Clock className="h-4 w-4" />
              Temps Économisé
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">
              {(kpis.totalTimeSaved! / 8).toFixed(1)} j
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {kpis.totalTimeSaved?.toFixed(0)} heures totales
            </p>
            {kpis.timeTrend && kpis.timeTrend.trend !== 'stable' && (
              <div className="flex items-center gap-1 mt-2">
                {kpis.timeTrend.trend === 'up' ? (
                  <TrendingUp className="h-4 w-4 text-green-500" />
                ) : (
                  <TrendingDown className="h-4 w-4 text-red-500" />
                )}
                <span className={`text-sm ${kpis.timeTrend.trend === 'up' ? 'text-green-500' : 'text-red-500'}`}>
                  {kpis.timeTrend.change > 0 ? '+' : ''}{kpis.timeTrend.change.toFixed(1)}%
                </span>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Automation Card */}
        <Card>
          <CardHeader className="pb-2">
            <CardDescription className="flex items-center gap-2">
              <Zap className="h-4 w-4" />
              Automation & A/B Tests
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">
              {kpis.avgAutomation?.toFixed(1)}%
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {kpis.totalABTestWins} tests A/B gagnants
            </p>
            <Badge variant="outline" className="mt-2">
              Taux automation moyen
            </Badge>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Cost vs Value Saved */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <DollarSign className="h-5 w-5" />
              Coûts vs Valeur Sauvée
            </CardTitle>
            <CardDescription>Analyse du retour sur investissement</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="cost" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(var(--destructive))" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="hsl(var(--destructive))" stopOpacity={0.1}/>
                  </linearGradient>
                  <linearGradient id="value" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0.1}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis 
                  dataKey="monthFormatted" 
                  stroke="hsl(var(--muted-foreground))"
                  fontSize={12}
                />
                <YAxis 
                  stroke="hsl(var(--muted-foreground))"
                  fontSize={12}
                  tickFormatter={(value) => `${(value / 1000).toFixed(0)}k€`}
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'hsl(var(--card))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px'
                  }}
                  formatter={(value: number) => `${value.toFixed(0)}€`}
                />
                <Legend />
                <Area 
                  type="monotone" 
                  dataKey="totalCost" 
                  stroke="hsl(var(--destructive))" 
                  fill="url(#cost)"
                  name="Coût escalades"
                />
                <Area 
                  type="monotone" 
                  dataKey="totalValueSaved" 
                  stroke="hsl(var(--primary))" 
                  fill="url(#value)"
                  name="Valeur sauvée"
                />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Time Saved */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              Temps Économisé
            </CardTitle>
            <CardDescription>Heures économisées par l'automation</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis 
                  dataKey="monthFormatted" 
                  stroke="hsl(var(--muted-foreground))"
                  fontSize={12}
                />
                <YAxis 
                  stroke="hsl(var(--muted-foreground))"
                  fontSize={12}
                  label={{ value: 'Heures', angle: -90, position: 'insideLeft' }}
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'hsl(var(--card))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px'
                  }}
                  formatter={(value: number) => `${value.toFixed(1)}h`}
                />
                <Bar 
                  dataKey="totalTimeSaved" 
                  fill="hsl(var(--primary))"
                  radius={[4, 4, 0, 0]}
                  name="Heures économisées"
                />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Automation Rate */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="h-5 w-5" />
              Taux d'Automation
            </CardTitle>
            <CardDescription>Évolution du taux d'automation</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis 
                  dataKey="monthFormatted" 
                  stroke="hsl(var(--muted-foreground))"
                  fontSize={12}
                />
                <YAxis 
                  stroke="hsl(var(--muted-foreground))"
                  fontSize={12}
                  domain={[0, 100]}
                  label={{ value: 'Taux (%)', angle: -90, position: 'insideLeft' }}
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'hsl(var(--card))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px'
                  }}
                  formatter={(value: number) => `${value.toFixed(1)}%`}
                />
                <Line 
                  type="monotone" 
                  dataKey="avgAutomationRate" 
                  stroke="hsl(var(--primary))" 
                  strokeWidth={3}
                  dot={{ fill: 'hsl(var(--primary))' }}
                  name="Taux automation"
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* A/B Test ROI */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Award className="h-5 w-5" />
              ROI Tests A/B
            </CardTitle>
            <CardDescription>Tests gagnants et ROI moyen</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis 
                  dataKey="monthFormatted" 
                  stroke="hsl(var(--muted-foreground))"
                  fontSize={12}
                />
                <YAxis 
                  yAxisId="left"
                  stroke="hsl(var(--muted-foreground))"
                  fontSize={12}
                  label={{ value: 'Tests gagnés', angle: -90, position: 'insideLeft' }}
                />
                <YAxis 
                  yAxisId="right"
                  orientation="right"
                  stroke="hsl(var(--muted-foreground))"
                  fontSize={12}
                  label={{ value: 'ROI (%)', angle: 90, position: 'insideRight' }}
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'hsl(var(--card))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px'
                  }}
                />
                <Legend />
                <Bar 
                  yAxisId="left"
                  dataKey="totalABTestWins" 
                  fill="hsl(var(--primary))"
                  radius={[4, 4, 0, 0]}
                  name="Tests A/B gagnés"
                />
                <Line 
                  yAxisId="right"
                  type="monotone" 
                  dataKey="avgROI" 
                  stroke="hsl(var(--accent))" 
                  strokeWidth={2}
                  dot={{ fill: 'hsl(var(--accent))' }}
                  name="ROI moyen (%)"
                />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ExecutiveDashboard;
