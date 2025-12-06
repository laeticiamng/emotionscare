import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  Clock, 
  Zap, 
  Award,
  AlertTriangle,
  Activity,
  CheckCircle2,
  Brain,
  BarChart3,
  RefreshCw
} from 'lucide-react';
import { format, subMonths, startOfMonth } from 'date-fns';
import { fr } from 'date-fns/locale';
import ExecutiveDashboard from './ExecutiveDashboard';
import SystemHealthDashboard from './SystemHealthDashboard';
import IncidentReportsPage from './IncidentReportsPage';

const UnifiedAdminDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState('overview');

  // Fetch executive metrics
  const { data: executiveMetrics } = useQuery({
    queryKey: ['executive-metrics-overview'],
    queryFn: async () => {
      const startDate = startOfMonth(subMonths(new Date(), 3));
      const { data, error } = await supabase
        .from('executive_business_metrics')
        .select('*')
        .gte('metric_date', startDate.toISOString().split('T')[0])
        .order('metric_date', { ascending: false });
      if (error) throw error;
      return data;
    },
    refetchInterval: 60000,
  });

  // Fetch system health metrics
  const { data: healthMetrics } = useQuery({
    queryKey: ['health-metrics-overview'],
    queryFn: async () => {
      const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);
      const { data, error } = await supabase
        .from('system_health_metrics')
        .select('*')
        .gte('timestamp', oneHourAgo.toISOString())
        .order('timestamp', { ascending: false })
        .limit(10);
      if (error) throw error;
      return data;
    },
    refetchInterval: 10000,
  });

  // Fetch incidents
  const { data: incidents } = useQuery({
    queryKey: ['incidents-overview'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('incident_reports')
        .select('*')
        .order('started_at', { ascending: false })
        .limit(10);
      if (error) throw error;
      return data;
    },
    refetchInterval: 30000,
  });

  // Fetch active escalations
  const { data: activeEscalations } = useQuery({
    queryKey: ['active-escalations-overview'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('active_escalations')
        .select('*')
        .eq('status', 'active')
        .order('started_at', { ascending: false });
      if (error) throw error;
      return data;
    },
    refetchInterval: 5000,
  });

  // Calculate unified KPIs
  const calculateUnifiedKPIs = () => {
    // Executive KPIs
    const totalCost = executiveMetrics?.reduce((sum, m) => sum + parseFloat(m.total_escalation_cost || 0), 0) || 0;
    const totalValueSaved = executiveMetrics?.reduce((sum, m) => sum + parseFloat(m.business_value_saved || 0), 0) || 0;
    const netROI = totalValueSaved - totalCost;
    const roiPercentage = totalCost > 0 ? ((totalValueSaved - totalCost) / totalCost) * 100 : 0;

    // System Health KPIs
    const latestHealth = healthMetrics?.[0];
    const uptimePercentage = latestHealth?.metric_value || 0;
    const errorRate = healthMetrics?.find(m => m.metric_name === 'error_rate_percentage')?.metric_value || 0;
    
    // Incident KPIs
    const openIncidents = incidents?.filter(i => i.status === 'open').length || 0;
    const criticalIncidents = incidents?.filter(i => i.severity === 'critical').length || 0;
    const avgResolutionTime = incidents
      ?.filter(i => i.resolved_at)
      .reduce((sum, i) => {
        const start = new Date(i.started_at).getTime();
        const end = new Date(i.resolved_at).getTime();
        return sum + (end - start);
      }, 0) / (incidents?.filter(i => i.resolved_at).length || 1);

    // Active Escalations
    const activeCount = activeEscalations?.length || 0;
    const criticalEscalations = activeEscalations?.filter(e => e.escalation_level >= 3).length || 0;

    return {
      // Financial
      totalCost,
      totalValueSaved,
      netROI,
      roiPercentage,
      
      // Health
      uptimePercentage,
      errorRate,
      
      // Incidents
      openIncidents,
      criticalIncidents,
      avgResolutionTime: avgResolutionTime / (1000 * 60), // minutes
      
      // Escalations
      activeCount,
      criticalEscalations,
      
      // Overall Health Score (0-100)
      healthScore: Math.round(
        (uptimePercentage * 0.3) + // 30% weight
        ((100 - errorRate) * 0.2) + // 20% weight
        ((openIncidents === 0 ? 100 : Math.max(0, 100 - (openIncidents * 10))) * 0.2) + // 20% weight
        ((roiPercentage > 0 ? Math.min(100, roiPercentage) : 0) * 0.3) // 30% weight
      )
    };
  };

  const kpis = calculateUnifiedKPIs();

  const getHealthScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-500';
    if (score >= 60) return 'text-yellow-500';
    return 'text-red-500';
  };

  const getHealthScoreBadge = (score: number) => {
    if (score >= 80) return { variant: 'default' as const, label: 'Excellent' };
    if (score >= 60) return { variant: 'warning' as const, label: 'Bon' };
    return { variant: 'destructive' as const, label: 'Attention' };
  };

  return (
    <div className="container mx-auto py-8 px-4 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Dashboard Unifié</h1>
          <p className="text-muted-foreground mt-1">Vue consolidée des performances de la plateforme</p>
        </div>
        <Button variant="outline" size="icon" onClick={() => window.location.reload()} aria-label="Recharger la page">
          <RefreshCw className="h-4 w-4" />
        </Button>
      </div>

      {/* Unified KPIs Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Overall Health Score */}
        <Card className="col-span-1 md:col-span-2 lg:col-span-1">
          <CardHeader className="pb-2">
            <CardDescription className="flex items-center gap-2">
              <Activity className="h-4 w-4" />
              Score de Santé Global
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className={`text-4xl font-bold ${getHealthScoreColor(kpis.healthScore)}`}>
              {kpis.healthScore}
            </div>
            <div className="flex items-center gap-2 mt-2">
              <Badge variant={getHealthScoreBadge(kpis.healthScore).variant}>
                {getHealthScoreBadge(kpis.healthScore).label}
              </Badge>
              <span className="text-xs text-muted-foreground">/100</span>
            </div>
          </CardContent>
        </Card>

        {/* ROI Card */}
        <Card>
          <CardHeader className="pb-2">
            <CardDescription className="flex items-center gap-2">
              <DollarSign className="h-4 w-4" />
              ROI Global
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">
              {kpis.roiPercentage.toFixed(1)}%
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {kpis.netROI.toFixed(0)}€ bénéfice net
            </p>
            {kpis.roiPercentage > 0 && (
              <div className="flex items-center gap-1 mt-2">
                <TrendingUp className="h-4 w-4 text-green-500" />
                <span className="text-sm text-green-500">Positif</span>
              </div>
            )}
          </CardContent>
        </Card>

        {/* System Uptime */}
        <Card>
          <CardHeader className="pb-2">
            <CardDescription className="flex items-center gap-2">
              <Zap className="h-4 w-4" />
              Disponibilité Système
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">
              {kpis.uptimePercentage.toFixed(2)}%
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Erreurs: {kpis.errorRate.toFixed(2)}%
            </p>
            {kpis.uptimePercentage >= 99.9 ? (
              <div className="flex items-center gap-1 mt-2">
                <CheckCircle2 className="h-4 w-4 text-green-500" />
                <span className="text-sm text-green-500">Excellent</span>
              </div>
            ) : (
              <div className="flex items-center gap-1 mt-2">
                <AlertTriangle className="h-4 w-4 text-yellow-500" />
                <span className="text-sm text-yellow-500">À surveiller</span>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Incidents Status */}
        <Card>
          <CardHeader className="pb-2">
            <CardDescription className="flex items-center gap-2">
              <AlertTriangle className="h-4 w-4" />
              Incidents & Escalades
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <div className="text-2xl font-bold text-foreground">
                {kpis.openIncidents}
              </div>
              <span className="text-sm text-muted-foreground">ouverts</span>
            </div>
            <div className="flex items-center gap-2 mt-1">
              <Badge variant={kpis.criticalIncidents > 0 ? 'destructive' : 'secondary'}>
                {kpis.criticalIncidents} critiques
              </Badge>
              <Badge variant="outline">
                {kpis.activeCount} escalades actives
              </Badge>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Cross-KPIs Summary */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            Résumé des Métriques Croisées
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div>
              <label className="text-sm font-medium text-muted-foreground">Performance Financière</label>
              <div className="mt-2 space-y-1">
                <div className="flex justify-between">
                  <span className="text-sm">Coût total</span>
                  <span className="text-sm font-medium">{kpis.totalCost.toFixed(0)}€</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Valeur sauvée</span>
                  <span className="text-sm font-medium text-green-500">{kpis.totalValueSaved.toFixed(0)}€</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm font-semibold">Bénéfice net</span>
                  <span className={`text-sm font-semibold ${kpis.netROI > 0 ? 'text-green-500' : 'text-red-500'}`}>
                    {kpis.netROI.toFixed(0)}€
                  </span>
                </div>
              </div>
            </div>

            <div>
              <label className="text-sm font-medium text-muted-foreground">Santé Système</label>
              <div className="mt-2 space-y-1">
                <div className="flex justify-between">
                  <span className="text-sm">Uptime</span>
                  <span className="text-sm font-medium">{kpis.uptimePercentage.toFixed(2)}%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Taux erreur</span>
                  <span className="text-sm font-medium">{kpis.errorRate.toFixed(2)}%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm font-semibold">Score santé</span>
                  <span className={`text-sm font-semibold ${getHealthScoreColor(kpis.healthScore)}`}>
                    {kpis.healthScore}/100
                  </span>
                </div>
              </div>
            </div>

            <div>
              <label className="text-sm font-medium text-muted-foreground">Gestion Incidents</label>
              <div className="mt-2 space-y-1">
                <div className="flex justify-between">
                  <span className="text-sm">Incidents ouverts</span>
                  <span className="text-sm font-medium">{kpis.openIncidents}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Critiques</span>
                  <span className="text-sm font-medium text-red-500">{kpis.criticalIncidents}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm font-semibold">Résolution moy.</span>
                  <span className="text-sm font-semibold">{kpis.avgResolutionTime.toFixed(0)} min</span>
                </div>
              </div>
            </div>

            <div>
              <label className="text-sm font-medium text-muted-foreground">Escalades Actives</label>
              <div className="mt-2 space-y-1">
                <div className="flex justify-between">
                  <span className="text-sm">Total actives</span>
                  <span className="text-sm font-medium">{kpis.activeCount}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Niveau critique</span>
                  <span className="text-sm font-medium text-red-500">{kpis.criticalEscalations}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm font-semibold">Taux critique</span>
                  <span className="text-sm font-semibold">
                    {kpis.activeCount > 0 ? ((kpis.criticalEscalations / kpis.activeCount) * 100).toFixed(0) : 0}%
                  </span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Detailed Views Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Vue d'ensemble</TabsTrigger>
          <TabsTrigger value="executive">Business</TabsTrigger>
          <TabsTrigger value="health">Santé Système</TabsTrigger>
          <TabsTrigger value="incidents">Incidents</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="mt-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Recent Critical Incidents */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5 text-destructive" />
                  Incidents Critiques Récents
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {incidents?.filter(i => i.severity === 'critical').slice(0, 5).map((incident) => (
                    <div key={incident.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <Badge variant="destructive">{incident.severity}</Badge>
                          <Badge variant={incident.status === 'open' ? 'destructive' : 'secondary'}>
                            {incident.status}
                          </Badge>
                        </div>
                        <p className="text-sm font-medium mt-1">{incident.title}</p>
                        <p className="text-xs text-muted-foreground mt-1">
                          {format(new Date(incident.started_at), 'PPp', { locale: fr })}
                        </p>
                      </div>
                      {incident.root_cause_confidence && (
                        <div className="flex items-center gap-2">
                          <Brain className="h-4 w-4 text-primary" />
                          <span className="text-sm font-medium">{incident.root_cause_confidence}%</span>
                        </div>
                      )}
                    </div>
                  ))}
                  {(!incidents || incidents.filter(i => i.severity === 'critical').length === 0) && (
                    <div className="text-center py-8 text-muted-foreground">
                      <CheckCircle2 className="h-12 w-12 mx-auto mb-2 text-green-500" />
                      <p>Aucun incident critique</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Active Escalations */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Zap className="h-5 w-5 text-warning" />
                  Escalades Actives
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {activeEscalations?.slice(0, 5).map((escalation) => (
                    <div key={escalation.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <Badge variant={escalation.escalation_level >= 3 ? 'destructive' : 'warning'}>
                            Niveau {escalation.escalation_level}
                          </Badge>
                          <Badge variant="outline">{escalation.status}</Badge>
                        </div>
                        <p className="text-sm font-medium mt-1">
                          Escalade #{escalation.id?.slice(0, 8)}
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">
                          {format(new Date(escalation.started_at), 'PPp', { locale: fr })}
                        </p>
                      </div>
                    </div>
                  ))}
                  {(!activeEscalations || activeEscalations.length === 0) && (
                    <div className="text-center py-8 text-muted-foreground">
                      <CheckCircle2 className="h-12 w-12 mx-auto mb-2 text-green-500" />
                      <p>Aucune escalade active</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="executive">
          <ExecutiveDashboard />
        </TabsContent>

        <TabsContent value="health">
          <SystemHealthDashboard />
        </TabsContent>

        <TabsContent value="incidents">
          <IncidentReportsPage />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default UnifiedAdminDashboard;
