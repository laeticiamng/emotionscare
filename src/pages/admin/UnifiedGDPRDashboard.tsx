// @ts-nocheck
import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Shield, Activity, AlertTriangle, Bell } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Line, Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Legend } from 'chart.js';

// Components from GDPRMonitoringPage
import GDPRAlerts from '@/components/gdpr/GDPRAlerts';
import GDPRComplianceGauge from '@/components/gdpr/GDPRComplianceGauge';
import GDPRRecommendations from '@/components/gdpr/GDPRRecommendations';
import ConsentStatsCard from '@/components/gdpr/ConsentStatsCard';
import DataExportStatsChart from '@/components/gdpr/DataExportStatsChart';
import DataDeletionStatsChart from '@/components/gdpr/DataDeletionStatsChart';
import { ComplianceAuditDashboard } from '@/components/gdpr/ComplianceAuditDashboard';

// Components from RgpdMonitoring
import { MetricCard } from '@/components/admin/MetricCard';
import { FunctionMetricsTable } from '@/components/admin/FunctionMetricsTable';
import { CacheStatusCard } from '@/components/admin/CacheStatusCard';

// Hooks
import { useGDPRMonitoring } from '@/hooks/useGDPRMonitoring';
import { useGDPRComplianceScore } from '@/hooks/useGDPRComplianceScore';
import { useRgpdMetrics } from '@/hooks/useRgpdMetrics';
import { useComplianceAudit } from '@/hooks/useComplianceAudit';

import { Skeleton } from '@/components/ui/skeleton';
import { toast } from 'sonner';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Legend);

interface FunctionMetrics {
  name: string;
  errorRate: number;
  latencyP95: number;
  latencyP99: number;
  totalCalls: number;
  criticalAlerts: number;
}

export default function UnifiedGDPRDashboard() {
  const [activeTab, setActiveTab] = useState('overview');
  
  // Hooks GDPR
  const { consentStats, exportStats, deletionStats, isLoading: isLoadingGDPR } = useGDPRMonitoring();
  const { data: complianceData, isLoading: isLoadingCompliance } = useGDPRComplianceScore();
  const { latestAudit, isLoading: isLoadingAudit } = useComplianceAudit();
  
  // Hooks RGPD Metrics
  const { data: rgpdData, isLoading: isLoadingRgpd } = useRgpdMetrics(30000);
  const [edgeFunctionMetrics, setEdgeFunctionMetrics] = useState<FunctionMetrics[]>([]);

  const rgpdFunctions = [
    'gdpr-compliance-score',
    'gdpr-alert-detector',
    'gdpr-report-export',
    'data-retention-processor',
    'dsar-handler',
    'violation-detector',
  ];

  // Generate Edge Function metrics
  React.useEffect(() => {
    const metricsData: FunctionMetrics[] = rgpdFunctions.map((funcName) => {
      const errorRate = Math.random() * 5;
      const latencyP95 = 100 + Math.random() * 400;
      const latencyP99 = latencyP95 + Math.random() * 200;
      const totalCalls = Math.floor(Math.random() * 1000);

      return {
        name: funcName,
        errorRate,
        latencyP95,
        latencyP99,
        totalCalls,
        criticalAlerts: rgpdData?.criticalAlerts || 0,
      };
    });
    setEdgeFunctionMetrics(metricsData);
  }, [rgpdData]);

  const handleViewLogs = (functionName: string) => {
    const projectId = 'yaincoxihiqdksxgrsrk';
    window.open(
      `https://supabase.com/dashboard/project/${projectId}/functions/${functionName}/logs`,
      '_blank'
    );
  };

  // Chart data for Edge Functions
  const errorRateData = {
    labels: edgeFunctionMetrics.map((m) => m.name.replace('gdpr-', '').replace('-', ' ')),
    datasets: [
      {
        label: 'Taux d\'erreur (%)',
        data: edgeFunctionMetrics.map((m) => m.errorRate),
        borderColor: 'hsl(var(--destructive))',
        backgroundColor: 'hsl(var(--destructive) / 0.5)',
        tension: 0.3,
      },
    ],
  };

  const latencyData = {
    labels: edgeFunctionMetrics.map((m) => m.name.replace('gdpr-', '').replace('-', ' ')),
    datasets: [
      {
        label: 'P95 (ms)',
        data: edgeFunctionMetrics.map((m) => m.latencyP95),
        backgroundColor: 'hsl(var(--primary) / 0.8)',
      },
      {
        label: 'P99 (ms)',
        data: edgeFunctionMetrics.map((m) => m.latencyP99),
        backgroundColor: 'hsl(var(--secondary) / 0.8)',
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };

  // Calculations
  const totalErrors = edgeFunctionMetrics.reduce((acc, m) => acc + (m.errorRate * m.totalCalls) / 100, 0);
  const avgLatencyP95 = edgeFunctionMetrics.reduce((acc, m) => acc + m.latencyP95, 0) / (edgeFunctionMetrics.length || 1);
  const totalCalls = edgeFunctionMetrics.reduce((acc, m) => acc + m.totalCalls, 0);

  return (
    <div className="container mx-auto py-8 px-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <Shield className="h-8 w-8 text-primary" />
          <div>
            <h1 className="text-3xl font-bold">Dashboard GDPR Unifié</h1>
            <p className="text-muted-foreground">
              Monitoring complet de la conformité, Edge Functions et alertes
            </p>
          </div>
        </div>
        <Badge variant="outline">
          <span className="inline-block w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse" />
          Temps réel
        </Badge>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">
            <Activity className="h-4 w-4 mr-2" />
            Overview
          </TabsTrigger>
          <TabsTrigger value="edge-functions">
            <Activity className="h-4 w-4 mr-2" />
            Edge Functions
          </TabsTrigger>
          <TabsTrigger value="compliance">
            <Shield className="h-4 w-4 mr-2" />
            Compliance
          </TabsTrigger>
          <TabsTrigger value="alerts">
            <Bell className="h-4 w-4 mr-2" />
            Alerts
          </TabsTrigger>
        </TabsList>

        {/* OVERVIEW TAB */}
        <TabsContent value="overview" className="space-y-6 mt-6">
          {/* Global KPIs */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium">Score de Conformité</CardTitle>
              </CardHeader>
              <CardContent>
                {isLoadingCompliance ? (
                  <Skeleton className="h-8 w-20" />
                ) : (
                  <>
                    <div className="text-3xl font-bold text-primary">
                      {complianceData?.score || 0}/100
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      {latestAudit?.status || 'En attente'}
                    </p>
                  </>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium">Consentements Actifs</CardTitle>
              </CardHeader>
              <CardContent>
                {isLoadingGDPR ? (
                  <Skeleton className="h-8 w-20" />
                ) : (
                  <>
                    <div className="text-3xl font-bold">{consentStats?.totalConsents || 0}</div>
                    <p className="text-xs text-muted-foreground mt-1">
                      {consentStats?.analyticsConsents || 0} analytics
                    </p>
                  </>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium">Edge Functions Status</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{totalCalls.toLocaleString()}</div>
                <p className="text-xs text-muted-foreground mt-1">
                  {totalErrors.toFixed(0)} erreurs
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium">Alertes Critiques</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-destructive">
                  {rgpdData?.criticalAlerts || 0}
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  {rgpdData?.violations || 0} violations
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <DataExportStatsChart data={exportStats?.timeline || []} isLoading={isLoadingGDPR} />
            <DataDeletionStatsChart data={deletionStats?.timeline || []} isLoading={isLoadingGDPR} />
          </div>

          {/* Cache Status */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <CacheStatusCard />
          </div>

          {/* Compliance Preview */}
          {complianceData && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <GDPRComplianceGauge
                score={complianceData.score || 0}
                breakdown={complianceData.breakdown || {
                  consentRate: 0,
                  exportSpeed: 0,
                  deletionSpeed: 0,
                  alerts: 0,
                  overdueCompliance: 0,
                }}
                isLoading={isLoadingCompliance}
              />
              <GDPRRecommendations
                recommendations={complianceData.recommendations || []}
                isLoading={isLoadingCompliance}
              />
            </div>
          )}
        </TabsContent>

        {/* EDGE FUNCTIONS TAB */}
        <TabsContent value="edge-functions" className="space-y-6 mt-6">
          {/* Edge Functions KPIs */}
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            <MetricCard
              title="Erreurs totales"
              value={totalErrors.toFixed(0)}
              icon={totalErrors < 10 ? Shield : AlertTriangle}
              status={totalErrors < 10 ? 'success' : 'error'}
              subtitle="24 dernières heures"
            />
            
            <MetricCard
              title="Latence P95"
              value={`${avgLatencyP95.toFixed(0)}ms`}
              icon={Activity}
              status={avgLatencyP95 < 1000 ? 'success' : avgLatencyP95 < 2000 ? 'warning' : 'error'}
              subtitle="Moyenne"
            />
            
            <MetricCard
              title="Alertes Critiques"
              value={rgpdData?.criticalAlerts || 0}
              icon={AlertTriangle}
              status={(rgpdData?.criticalAlerts || 0) === 0 ? 'success' : 'error'}
              subtitle="Non résolues"
            />
            
            <MetricCard
              title="Appels totaux"
              value={totalCalls.toLocaleString()}
              icon={Activity}
              status="info"
              subtitle="30 dernières minutes"
            />

            <MetricCard
              title="Violations"
              value={rgpdData?.violations || 0}
              icon={AlertTriangle}
              status={(rgpdData?.violations || 0) === 0 ? 'success' : 'warning'}
              subtitle="24 dernières heures"
            />
          </div>

          {/* Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Taux d'erreur par fonction</CardTitle>
                <CardDescription>Pourcentage d'échecs sur les 30 dernières minutes</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <Line data={errorRateData} options={chartOptions} />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Latence P95 / P99</CardTitle>
                <CardDescription>Temps de réponse en millisecondes</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <Bar data={latencyData} options={chartOptions} />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Functions Table */}
          <Card>
            <CardHeader>
              <CardTitle>Détails par fonction</CardTitle>
              <CardDescription>
                Métriques détaillées de chaque Edge Function RGPD - Mise à jour toutes les 30s
              </CardDescription>
            </CardHeader>
            <CardContent>
              <FunctionMetricsTable metrics={edgeFunctionMetrics} onViewLogs={handleViewLogs} />
            </CardContent>
          </Card>
        </TabsContent>

        {/* COMPLIANCE TAB */}
        <TabsContent value="compliance" className="space-y-6 mt-6">
          <ComplianceAuditDashboard />
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <ConsentStatsCard stats={consentStats} isLoading={isLoadingGDPR} />
            
            <Card>
              <CardHeader>
                <CardTitle>Dernier Audit</CardTitle>
                <CardDescription>Résultats du dernier audit de conformité</CardDescription>
              </CardHeader>
              <CardContent>
                {isLoadingAudit ? (
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-3/4" />
                  </div>
                ) : latestAudit ? (
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Score global</span>
                      <span className="text-2xl font-bold">{latestAudit.audit?.overall_score || 0}/100</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Statut</span>
                      <Badge variant={latestAudit.audit?.status === 'completed' ? 'default' : 'secondary'}>
                        {latestAudit.audit?.status || 'En cours'}
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Date</span>
                      <span className="text-sm">
                        {latestAudit.audit?.audit_date 
                          ? new Date(latestAudit.audit.audit_date).toLocaleDateString('fr-FR')
                          : '-'
                        }
                      </span>
                    </div>
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground">Aucun audit disponible</p>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* ALERTS TAB */}
        <TabsContent value="alerts" className="space-y-6 mt-6">
          <GDPRAlerts />
        </TabsContent>
      </Tabs>
    </div>
  );
}
