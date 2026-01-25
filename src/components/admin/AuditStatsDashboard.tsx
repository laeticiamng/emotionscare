import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle, TrendingUp, Users, Activity } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';
import { Line, Bar, Doughnut } from 'react-chartjs-2';
import { getAuditStats } from '@/services/auditStatsService';
import { getStatsByRole, getMonthToMonthComparison, type AdvancedFilters } from '@/services/advancedAuditStatsService';
import { AdvancedAuditFilters } from './AdvancedAuditFilters';
import { MonthComparisonChart } from './MonthComparisonChart';
import { AlertSettingsManager } from './AlertSettingsManager';
import { SecurityAlertsPanel } from './SecurityAlertsPanel';
import { ReportManualTrigger } from './ReportManualTrigger';
import { useState } from 'react';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

export function AuditStatsDashboard() {
  const [filters, setFilters] = useState<AdvancedFilters>({});

  const { data: stats, isLoading, error } = useQuery({
    queryKey: ['audit-stats'],
    queryFn: getAuditStats,
    refetchInterval: 5 * 60 * 1000,
  });

  const { data: roleStats, isLoading: roleStatsLoading } = useQuery({
    queryKey: ['audit-stats-by-role', filters],
    queryFn: () => getStatsByRole(filters),
    enabled: Object.keys(filters).length > 0,
  });

  const { data: monthComparison, isLoading: monthComparisonLoading, error: monthComparisonError } = useQuery({
    queryKey: ['month-comparison'],
    queryFn: () => getMonthToMonthComparison(6),
  });

  const handleFiltersChange = (newFilters: AdvancedFilters) => {
    setFilters(newFilters);
  };

  const handleResetFilters = () => {
    setFilters({});
  };

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

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          Erreur lors du chargement des statistiques d'audit
        </AlertDescription>
      </Alert>
    );
  }

  if (!stats) return null;

  // Configuration graphique évolution hebdomadaire
  const weeklyChartData = {
    labels: stats.weeklyEvolution.map(w => w.week),
    datasets: [
      {
        label: 'Ajouts',
        data: stats.weeklyEvolution.map(w => w.add),
        borderColor: 'hsl(var(--chart-1))',
        backgroundColor: 'hsl(var(--chart-1) / 0.2)',
        fill: true,
        tension: 0.4,
      },
      {
        label: 'Suppressions',
        data: stats.weeklyEvolution.map(w => w.remove),
        borderColor: 'hsl(var(--chart-2))',
        backgroundColor: 'hsl(var(--chart-2) / 0.2)',
        fill: true,
        tension: 0.4,
      },
      {
        label: 'Modifications',
        data: stats.weeklyEvolution.map(w => w.update),
        borderColor: 'hsl(var(--chart-3))',
        backgroundColor: 'hsl(var(--chart-3) / 0.2)',
        fill: true,
        tension: 0.4,
      },
    ],
  };

  const weeklyChartOptions = {
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
      y: {
        beginAtZero: true,
        ticks: {
          color: 'hsl(var(--muted-foreground))',
        },
        grid: {
          color: 'hsl(var(--border))',
        },
      },
      x: {
        ticks: {
          color: 'hsl(var(--muted-foreground))',
        },
        grid: {
          color: 'hsl(var(--border))',
        },
      },
    },
  };

  // Configuration graphique top admins
  const topAdminsData = {
    labels: stats.topAdmins.map(a => a.admin_email),
    datasets: [
      {
        label: 'Nombre de changements',
        data: stats.topAdmins.map(a => a.changes_count),
        backgroundColor: [
          'hsl(var(--chart-1))',
          'hsl(var(--chart-2))',
          'hsl(var(--chart-3))',
          'hsl(var(--chart-4))',
          'hsl(var(--chart-5))',
        ],
      },
    ],
  };

  const topAdminsOptions = {
    responsive: true,
    maintainAspectRatio: false,
    indexAxis: 'y' as const,
    plugins: {
      legend: {
        display: false,
      },
      title: {
        display: false,
      },
    },
    scales: {
      x: {
        beginAtZero: true,
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

  // Configuration graphique répartition des actions
  const actionDistributionData = {
    labels: stats.actionDistribution.map(a => {
      const labels: Record<string, string> = {
        add: 'Ajouts',
        remove: 'Suppressions',
        update: 'Modifications',
      };
      return labels[a.action] || a.action;
    }),
    datasets: [
      {
        data: stats.actionDistribution.map(a => a.count),
        backgroundColor: [
          'hsl(var(--chart-1))',
          'hsl(var(--chart-2))',
          'hsl(var(--chart-3))',
        ],
        borderWidth: 2,
        borderColor: 'hsl(var(--background))',
      },
    ],
  };

  const actionDistributionOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom' as const,
        labels: {
          color: 'hsl(var(--foreground))',
          padding: 15,
        },
      },
      title: {
        display: false,
      },
    },
  };

  return (
    <div className="space-y-6">
      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="overview">Vue générale</TabsTrigger>
          <TabsTrigger value="advanced">Filtres avancés</TabsTrigger>
          <TabsTrigger value="comparison">Comparaison</TabsTrigger>
          <TabsTrigger value="security">Alertes</TabsTrigger>
          <TabsTrigger value="reports">Rapports</TabsTrigger>
          <TabsTrigger value="settings">Paramètres</TabsTrigger>
        </TabsList>

        {/* Onglet Vue générale */}
        <TabsContent value="overview" className="space-y-6">
          {/* KPIs */}
          <div className="grid gap-4 md:grid-cols-3">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Changements</CardTitle>
                <Activity className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.totalChanges}</div>
                <p className="text-xs text-muted-foreground">30 derniers jours</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Admins Actifs</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.topAdmins.length}</div>
                <p className="text-xs text-muted-foreground">Top 5 contributeurs</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Tendance</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {stats.weeklyEvolution[stats.weeklyEvolution.length - 1]?.total || 0}
                </div>
                <p className="text-xs text-muted-foreground">Cette semaine</p>
              </CardContent>
            </Card>
          </div>

          {/* Graphique évolution hebdomadaire */}
          <Card>
            <CardHeader>
              <CardTitle>Évolution des changements de rôles</CardTitle>
              <CardDescription>8 dernières semaines</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <Line data={weeklyChartData} options={weeklyChartOptions} />
              </div>
            </CardContent>
          </Card>

          {/* Graphiques bottom row */}
          <div className="grid gap-6 md:grid-cols-2">
            {/* Top 5 admins */}
            <Card>
              <CardHeader>
                <CardTitle>Top 5 Admins Actifs</CardTitle>
                <CardDescription>30 derniers jours</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <Bar data={topAdminsData} options={topAdminsOptions} />
                </div>
              </CardContent>
            </Card>

            {/* Répartition des actions */}
            <Card>
              <CardHeader>
                <CardTitle>Répartition des Actions</CardTitle>
                <CardDescription>30 derniers jours</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px] flex items-center justify-center">
                  <Doughnut data={actionDistributionData} options={actionDistributionOptions} />
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Onglet Filtres avancés */}
        <TabsContent value="advanced" className="space-y-6">
          <AdvancedAuditFilters
            onFiltersChange={handleFiltersChange}
            onReset={handleResetFilters}
          />

          {roleStats && roleStats.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Statistiques par Rôle</CardTitle>
                <CardDescription>Résultats filtrés</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {roleStats.map((stat) => (
                    <div
                      key={stat.role}
                      className="flex items-center justify-between border-b pb-4 last:border-0"
                    >
                      <div className="flex-1">
                        <p className="font-medium">{stat.role}</p>
                        <p className="text-sm text-muted-foreground">
                          Total: {stat.total} changements
                        </p>
                      </div>
                      <div className="flex gap-4 text-sm">
                        <span className="text-green-600">+{stat.add}</span>
                        <span className="text-red-600">-{stat.remove}</span>
                        <span className="text-blue-600">~{stat.update}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {roleStatsLoading && (
            <Skeleton className="h-96 w-full" />
          )}
        </TabsContent>

        {/* Onglet Comparaison mensuelle */}
        <TabsContent value="comparison" className="space-y-6">
          <MonthComparisonChart
            data={monthComparison || []}
            isLoading={monthComparisonLoading}
            error={monthComparisonError}
          />
        </TabsContent>

        {/* Onglet Alertes sécurité */}
        <TabsContent value="security" className="space-y-6">
          <SecurityAlertsPanel />
        </TabsContent>

        {/* Onglet Rapports manuels */}
        <TabsContent value="reports" className="space-y-6">
          <ReportManualTrigger />
        </TabsContent>

        {/* Onglet Paramètres d'alerte */}
        <TabsContent value="settings" className="space-y-6">
          <AlertSettingsManager />
        </TabsContent>
      </Tabs>
    </div>
  );
}
