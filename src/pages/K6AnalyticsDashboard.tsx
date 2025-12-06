import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { K6MetricsChart } from '@/components/analytics/K6MetricsChart';
import { Activity, TrendingUp, AlertTriangle, CheckCircle, Clock, Zap } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { logger } from '@/lib/logger';

interface K6Metrics {
  timestamp: string;
  function_name: string;
  http_req_duration_p95: number;
  http_req_duration_p99: number;
  http_req_failed_rate: number;
  vus_max: number;
  iterations: number;
  data_received_rate: number;
  data_sent_rate: number;
}

interface EdgeFunctionStats {
  name: string;
  avgP95: number;
  avgP99: number;
  errorRate: number;
  totalRequests: number;
  lastRun: string;
}

/**
 * Dashboard Analytics K6 - Visualisation des tests de charge
 * Affiche métriques de performance, latence P95/P99, taux d'erreur
 */
export default function K6AnalyticsDashboard() {
  const [metrics, setMetrics] = useState<K6Metrics[]>([]);
  const [edgeFunctionStats, setEdgeFunctionStats] = useState<EdgeFunctionStats[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedFunction, setSelectedFunction] = useState<string>('all');

  useEffect(() => {
    loadMetrics();
  }, []);

  const loadMetrics = async () => {
    try {
      setLoading(true);
      
      // Charger métriques K6 depuis Supabase
      const { data: metricsData, error } = await supabase
        .from('k6_metrics')
        .select('*')
        .order('timestamp', { ascending: false })
        .limit(100);

      if (error) throw error;

      setMetrics(metricsData || []);
      
      // Calculer statistiques par Edge Function
      const statsMap = new Map<string, EdgeFunctionStats>();
      
      (metricsData || []).forEach((metric) => {
        const existing = statsMap.get(metric.function_name);
        
        if (!existing) {
          statsMap.set(metric.function_name, {
            name: metric.function_name,
            avgP95: metric.http_req_duration_p95,
            avgP99: metric.http_req_duration_p99,
            errorRate: metric.http_req_failed_rate,
            totalRequests: metric.iterations,
            lastRun: metric.timestamp,
          });
        } else {
          existing.avgP95 = (existing.avgP95 + metric.http_req_duration_p95) / 2;
          existing.avgP99 = (existing.avgP99 + metric.http_req_duration_p99) / 2;
          existing.errorRate = (existing.errorRate + metric.http_req_failed_rate) / 2;
          existing.totalRequests += metric.iterations;
        }
      });

      setEdgeFunctionStats(Array.from(statsMap.values()));
    } catch (error) {
      logger.error('Error loading K6 metrics:', error, 'PAGE');
    } finally {
      setLoading(false);
    }
  };

  const getPerformanceStatus = (p95: number) => {
    if (p95 < 200) return { label: 'Excellent', variant: 'default' as const, color: 'text-green-600' };
    if (p95 < 500) return { label: 'Bon', variant: 'secondary' as const, color: 'text-blue-600' };
    if (p95 < 1000) return { label: 'Moyen', variant: 'outline' as const, color: 'text-yellow-600' };
    return { label: 'Lent', variant: 'destructive' as const, color: 'text-red-600' };
  };

  const getErrorRateStatus = (rate: number) => {
    if (rate === 0) return { icon: CheckCircle, color: 'text-green-600', label: '0% erreurs' };
    if (rate < 0.01) return { icon: CheckCircle, color: 'text-blue-600', label: '< 1% erreurs' };
    if (rate < 0.05) return { icon: AlertTriangle, color: 'text-yellow-600', label: `${(rate * 100).toFixed(1)}% erreurs` };
    return { icon: AlertTriangle, color: 'text-red-600', label: `${(rate * 100).toFixed(1)}% erreurs` };
  };

  const filteredMetrics = selectedFunction === 'all' 
    ? metrics 
    : metrics.filter(m => m.function_name === selectedFunction);

  const functionNames = Array.from(new Set(metrics.map(m => m.function_name)));

  if (loading) {
    return (
      <div className="container mx-auto py-8 px-4">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground flex items-center gap-2">
            <Activity className="w-8 h-8 text-primary" />
            Dashboard K6 Analytics
          </h1>
          <p className="text-muted-foreground mt-1">
            Métriques de performance et tests de charge des Edge Functions RGPD
          </p>
        </div>
      </div>

      {/* KPIs Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">P95 Latence Moy.</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {metrics.length > 0 
                ? `${(metrics.reduce((sum, m) => sum + m.http_req_duration_p95, 0) / metrics.length).toFixed(0)}ms`
                : 'N/A'}
            </div>
            <p className="text-xs text-muted-foreground">95% des requêtes</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">P99 Latence Moy.</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {metrics.length > 0 
                ? `${(metrics.reduce((sum, m) => sum + m.http_req_duration_p99, 0) / metrics.length).toFixed(0)}ms`
                : 'N/A'}
            </div>
            <p className="text-xs text-muted-foreground">99% des requêtes</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Taux d'Erreur</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {metrics.length > 0 
                ? `${((metrics.reduce((sum, m) => sum + m.http_req_failed_rate, 0) / metrics.length) * 100).toFixed(2)}%`
                : 'N/A'}
            </div>
            <p className="text-xs text-muted-foreground">Requêtes échouées</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">VUs Max</CardTitle>
            <Zap className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {metrics.length > 0 ? Math.max(...metrics.map(m => m.vus_max)) : 'N/A'}
            </div>
            <p className="text-xs text-muted-foreground">Utilisateurs simultanés</p>
          </CardContent>
        </Card>
      </div>

      {/* Edge Functions Performance */}
      <Card>
        <CardHeader>
          <CardTitle>Performance par Edge Function</CardTitle>
          <CardDescription>
            Statistiques détaillées des tests de charge par fonction RGPD
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {edgeFunctionStats.map((stat) => {
              const perfStatus = getPerformanceStatus(stat.avgP95);
              const errorStatus = getErrorRateStatus(stat.errorRate);
              const ErrorIcon = errorStatus.icon;

              return (
                <div key={stat.name} className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                  <div className="flex-1">
                    <h3 className="font-semibold text-foreground">{stat.name}</h3>
                    <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                      <span>P95: <span className={perfStatus.color}>{stat.avgP95.toFixed(0)}ms</span></span>
                      <span>P99: {stat.avgP99.toFixed(0)}ms</span>
                      <span className="flex items-center gap-1">
                        <ErrorIcon className={`w-4 h-4 ${errorStatus.color}`} />
                        {errorStatus.label}
                      </span>
                      <span>{stat.totalRequests.toLocaleString()} req</span>
                    </div>
                  </div>
                  <Badge variant={perfStatus.variant}>{perfStatus.label}</Badge>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Charts */}
      <Tabs defaultValue="latency" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="latency">Latence</TabsTrigger>
          <TabsTrigger value="errors">Erreurs</TabsTrigger>
          <TabsTrigger value="throughput">Débit</TabsTrigger>
        </TabsList>

        <TabsContent value="latency" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Latence P95/P99 au fil du temps</CardTitle>
              <div className="flex gap-2 mt-2">
                <button
                  onClick={() => setSelectedFunction('all')}
                  className={`px-3 py-1 text-sm rounded-md ${selectedFunction === 'all' ? 'bg-primary text-primary-foreground' : 'bg-muted'}`}
                >
                  Toutes
                </button>
                {functionNames.map(name => (
                  <button
                    key={name}
                    onClick={() => setSelectedFunction(name)}
                    className={`px-3 py-1 text-sm rounded-md ${selectedFunction === name ? 'bg-primary text-primary-foreground' : 'bg-muted'}`}
                  >
                    {name}
                  </button>
                ))}
              </div>
            </CardHeader>
            <CardContent>
              <K6MetricsChart metrics={filteredMetrics} type="latency" />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="errors" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Taux d'erreur au fil du temps</CardTitle>
            </CardHeader>
            <CardContent>
              <K6MetricsChart metrics={filteredMetrics} type="errors" />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="throughput" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Débit réseau</CardTitle>
            </CardHeader>
            <CardContent>
              <K6MetricsChart metrics={filteredMetrics} type="throughput" />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Alerts */}
      {edgeFunctionStats.some(s => s.avgP95 > 1000 || s.errorRate > 0.05) && (
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Alertes de Performance</AlertTitle>
          <AlertDescription>
            <ul className="list-disc pl-4 mt-2">
              {edgeFunctionStats
                .filter(s => s.avgP95 > 1000)
                .map(s => (
                  <li key={s.name}>
                    <strong>{s.name}</strong>: Latence P95 élevée ({s.avgP95.toFixed(0)}ms)
                  </li>
                ))}
              {edgeFunctionStats
                .filter(s => s.errorRate > 0.05)
                .map(s => (
                  <li key={s.name}>
                    <strong>{s.name}</strong>: Taux d'erreur élevé ({(s.errorRate * 100).toFixed(1)}%)
                  </li>
                ))}
            </ul>
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
}
