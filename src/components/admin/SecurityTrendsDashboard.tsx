import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  AlertCircle, 
  TrendingUp, 
  TrendingDown, 
  AlertTriangle,
  Activity,
  Shield,
  BarChart3
} from 'lucide-react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';
import { Line, Bar } from 'react-chartjs-2';
import { 
  getSecurityTrends, 
  getTrendsByType, 
  getTrendsBySeverity 
} from '@/services/securityTrendsService';
import { cn } from '@/lib/utils';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

export const SecurityTrendsDashboard: React.FC = () => {
  const [selectedPeriod, setSelectedPeriod] = useState<30 | 60 | 90>(30);

  const { data: trends, isLoading, error } = useQuery({
    queryKey: ['security-trends', selectedPeriod],
    queryFn: () => getSecurityTrends(selectedPeriod),
    refetchInterval: 5 * 60 * 1000,
  });

  const { data: trendsByType } = useQuery({
    queryKey: ['security-trends-by-type', selectedPeriod],
    queryFn: () => getTrendsByType(selectedPeriod),
  });

  const { data: trendsBySeverity } = useQuery({
    queryKey: ['security-trends-by-severity', selectedPeriod],
    queryFn: () => getTrendsBySeverity(selectedPeriod),
  });

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-64 w-full" />
        <div className="grid gap-6 md:grid-cols-2">
          <Skeleton className="h-80 w-full" />
          <Skeleton className="h-80 w-full" />
        </div>
      </div>
    );
  }

  if (error || !trends) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          Erreur lors du chargement des tendances de sécurité
        </AlertDescription>
      </Alert>
    );
  }

  const getTrendIcon = () => {
    switch (trends.trend) {
      case 'increasing':
        return <TrendingUp className="h-4 w-4 text-warning" />;
      case 'decreasing':
        return <TrendingDown className="h-4 w-4 text-success" />;
      default:
        return <Activity className="h-4 w-4 text-muted-foreground" />;
    }
  };

  const getRiskColor = (level: string) => {
    switch (level) {
      case 'critical':
        return 'bg-destructive/10 text-destructive border-destructive/20';
      case 'high':
        return 'bg-warning/10 text-warning border-warning/20';
      case 'medium':
        return 'bg-info/10 text-info border-info/20';
      case 'low':
        return 'bg-success/10 text-success border-success/20';
      default:
        return 'bg-muted/10 text-muted-foreground border-muted/20';
    }
  };

  // Configuration du graphique principal
  const mainChartData = {
    labels: trends.historical.map(d => d.date),
    datasets: [
      {
        label: 'Historique',
        data: trends.historical.map(d => d.count),
        borderColor: 'hsl(var(--primary))',
        backgroundColor: 'hsl(var(--primary) / 0.2)',
        fill: true,
        tension: 0.4,
      },
      {
        label: 'Prédictions',
        data: [
          ...trends.historical.map(() => null),
          trends.historical[trends.historical.length - 1]?.count,
          ...trends.predictions.map(p => p.predicted),
        ],
        borderColor: 'hsl(var(--warning))',
        backgroundColor: 'hsl(var(--warning) / 0.1)',
        borderDash: [5, 5],
        fill: false,
        tension: 0.4,
      },
    ],
  };

  const mainChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
        labels: {
          color: 'hsl(var(--foreground))',
        },
      },
      title: {
        display: false,
      },
    },
    scales: {
      x: {
        ticks: {
          color: 'hsl(var(--muted-foreground))',
        },
        grid: {
          color: 'hsl(var(--border))',
        },
      },
      y: {
        ticks: {
          color: 'hsl(var(--muted-foreground))',
        },
        grid: {
          color: 'hsl(var(--border))',
        },
      },
    },
  };

  // Configuration du graphique par type
  const typeChartData = trendsByType ? {
    labels: Object.values(trendsByType)[0]?.map(d => d.date) || [],
    datasets: Object.entries(trendsByType).map(([type, data], index) => ({
      label: type,
      data: data.map(d => d.count),
      borderColor: `hsl(var(--chart-${(index % 5) + 1}))`,
      backgroundColor: `hsl(var(--chart-${(index % 5) + 1}) / 0.2)`,
      fill: false,
      tension: 0.4,
    })),
  } : null;

  // Configuration du graphique par sévérité
  const severityChartData = trendsBySeverity ? {
    labels: Object.values(trendsBySeverity)[0]?.map(d => d.date) || [],
    datasets: Object.entries(trendsBySeverity).map(([severity, data]) => ({
      label: severity,
      data: data.map(d => d.count),
      backgroundColor: 
        severity === 'critical' ? 'hsl(var(--destructive))' :
        severity === 'high' ? 'hsl(var(--warning))' :
        severity === 'medium' ? 'hsl(var(--info))' :
        'hsl(var(--success))',
    })),
  } : null;

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Tendances de Sécurité
              </CardTitle>
              <CardDescription>
                Analyse prédictive des alertes de sécurité
              </CardDescription>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setSelectedPeriod(30)}
                className={cn(
                  'px-3 py-1 rounded text-sm',
                  selectedPeriod === 30 ? 'bg-primary text-primary-foreground' : 'bg-muted'
                )}
              >
                30j
              </button>
              <button
                onClick={() => setSelectedPeriod(60)}
                className={cn(
                  'px-3 py-1 rounded text-sm',
                  selectedPeriod === 60 ? 'bg-primary text-primary-foreground' : 'bg-muted'
                )}
              >
                60j
              </button>
              <button
                onClick={() => setSelectedPeriod(90)}
                className={cn(
                  'px-3 py-1 rounded text-sm',
                  selectedPeriod === 90 ? 'bg-primary text-primary-foreground' : 'bg-muted'
                )}
              >
                90j
              </button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3 mb-6">
            <Card className={cn('border-2', getRiskColor(trends.riskLevel))}>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium">Niveau de Risque</p>
                    <p className="text-2xl font-bold capitalize">{trends.riskLevel}</p>
                  </div>
                  <AlertTriangle className="h-8 w-8" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium">Tendance</p>
                    <p className="text-2xl font-bold capitalize">{trends.trend}</p>
                  </div>
                  {getTrendIcon()}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium">Évolution (7j)</p>
                    <p className={cn(
                      'text-2xl font-bold',
                      trends.changePercentage > 0 ? 'text-warning' : 'text-success'
                    )}>
                      {trends.changePercentage > 0 ? '+' : ''}
                      {trends.changePercentage.toFixed(1)}%
                    </p>
                  </div>
                  <BarChart3 className="h-8 w-8" />
                </div>
              </CardContent>
            </Card>
          </div>

          <Tabs defaultValue="overview" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="overview">Vue Générale</TabsTrigger>
              <TabsTrigger value="type">Par Type</TabsTrigger>
              <TabsTrigger value="severity">Par Sévérité</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Évolution et Prédictions</CardTitle>
                  <CardDescription>
                    Historique des alertes et prédictions sur 7 jours
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-96">
                    <Line data={mainChartData} options={mainChartOptions} />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="type" className="space-y-4">
              {typeChartData && (
                <Card>
                  <CardHeader>
                    <CardTitle>Tendances par Type d'Alerte</CardTitle>
                    <CardDescription>
                      Distribution des alertes par type sur la période
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="h-96">
                      <Line data={typeChartData} options={mainChartOptions} />
                    </div>
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            <TabsContent value="severity" className="space-y-4">
              {severityChartData && (
                <Card>
                  <CardHeader>
                    <CardTitle>Tendances par Sévérité</CardTitle>
                    <CardDescription>
                      Répartition des alertes par niveau de sévérité
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="h-96">
                      <Bar data={severityChartData} options={mainChartOptions} />
                    </div>
                  </CardContent>
                </Card>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};
