// @ts-nocheck
import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { Line } from 'react-chartjs-2';
import { AlertTriangle, DollarSign, TrendingUp, Activity } from 'lucide-react';

interface APIUsageMetric {
  function_name: string;
  total_calls: number;
  failed_calls: number;
  rate_limited_calls: number;
  estimated_cost: number;
  last_call: string;
}

export default function APIMonitoringDashboard() {
  const [metrics, setMetrics] = useState<APIUsageMetric[]>([]);
  const [dailyCosts, setDailyCosts] = useState<any[]>([]);
  const [alerts, setAlerts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMetrics();
    const interval = setInterval(fetchMetrics, 30000); // Refresh 30s
    return () => clearInterval(interval);
  }, []);

  const fetchMetrics = async () => {
    try {
      // Requête aux logs d'accès pour agréger usage
      const { data: logs, error } = await supabase
        .from('access_logs')
        .select('*')
        .gte('created_at', new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString())
        .order('created_at', { ascending: false });

      if (error) throw error;

      // Agréger métriques par fonction
      const metricsMap = new Map<string, APIUsageMetric>();
      
      logs?.forEach((log: any) => {
        const funcName = log.route || 'unknown';
        if (!metricsMap.has(funcName)) {
          metricsMap.set(funcName, {
            function_name: funcName,
            total_calls: 0,
            failed_calls: 0,
            rate_limited_calls: 0,
            estimated_cost: 0,
            last_call: log.created_at
          });
        }
        
        const metric = metricsMap.get(funcName)!;
        metric.total_calls++;
        
        if (log.result === 'denied') metric.failed_calls++;
        if (log.action === 'rate_limit') metric.rate_limited_calls++;
        
        // Estimation coûts selon fonction
        metric.estimated_cost += estimateCost(funcName);
      });

      setMetrics(Array.from(metricsMap.values()).sort((a, b) => b.total_calls - a.total_calls));

      // Calculer coûts journaliers
      const costsByDay = calculateDailyCosts(logs || []);
      setDailyCosts(costsByDay);

      // Détecter alertes
      detectAlerts(Array.from(metricsMap.values()));

      setLoading(false);
    } catch (error) {
      console.error('Error fetching metrics:', error);
      setLoading(false);
    }
  };

  const estimateCost = (functionName: string): number => {
    const costs: Record<string, number> = {
      'openai-chat': 0.15,
      'openai-emotion-analysis': 0.03,
      'ai-coach-response': 0.04,
      'analyze-voice-hume': 0.007,
      'openai-tts': 0.015,
      'openai-transcribe': 0.006,
      'openai-embeddings': 0.00002,
      'openai-moderate': 0,
      'openai-structured-output': 0.015,
      'hume-analysis': 0.01,
    };
    return costs[functionName] || 0.001;
  };

  const calculateDailyCosts = (logs: any[]) => {
    const dayMap = new Map<string, number>();
    logs.forEach(log => {
      const day = new Date(log.created_at).toLocaleDateString();
      const cost = estimateCost(log.route || '');
      dayMap.set(day, (dayMap.get(day) || 0) + cost);
    });
    return Array.from(dayMap.entries()).map(([date, cost]) => ({ date, cost }));
  };

  const detectAlerts = (metrics: APIUsageMetric[]) => {
    const newAlerts: any[] = [];
    
    metrics.forEach(metric => {
      // Alerte: Trop de rate limits
      if (metric.rate_limited_calls > 50) {
        newAlerts.push({
          level: 'warning',
          function: metric.function_name,
          message: `${metric.rate_limited_calls} requêtes rate limited en 24h`
        });
      }

      // Alerte: Coût élevé
      if (metric.estimated_cost > 10) {
        newAlerts.push({
          level: 'error',
          function: metric.function_name,
          message: `Coût estimé élevé: $${metric.estimated_cost.toFixed(2)}`
        });
      }

      // Alerte: Taux échec élevé
      if (metric.failed_calls / metric.total_calls > 0.2) {
        newAlerts.push({
          level: 'warning',
          function: metric.function_name,
          message: `Taux échec: ${((metric.failed_calls / metric.total_calls) * 100).toFixed(1)}%`
        });
      }
    });

    setAlerts(newAlerts);
  };

  const totalCost = metrics.reduce((sum, m) => sum + m.estimated_cost, 0);
  const totalCalls = metrics.reduce((sum, m) => sum + m.total_calls, 0);
  const totalRateLimited = metrics.reduce((sum, m) => sum + m.rate_limited_calls, 0);

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Monitoring APIs Payantes</h1>
          <p className="text-muted-foreground">OpenAI, Hume AI - Temps réel</p>
        </div>
        <Badge variant={totalCost > 50 ? 'destructive' : 'default'}>
          Dernières 24h
        </Badge>
      </div>

      {/* Alertes */}
      {alerts.length > 0 && (
        <div className="space-y-2">
          {alerts.map((alert, i) => (
            <Alert key={i} variant={alert.level === 'error' ? 'destructive' : 'default'}>
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                <strong>{alert.function}:</strong> {alert.message}
              </AlertDescription>
            </Alert>
          ))}
        </div>
      )}

      {/* KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Coût Total 24h</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalCost.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">Estimation OpenAI + Hume</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Appels API</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalCalls.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">Toutes fonctions confondues</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Rate Limited</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalRateLimited}</div>
            <p className="text-xs text-muted-foreground">Requêtes bloquées</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Coût Moyen/Appel</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ${totalCalls > 0 ? (totalCost / totalCalls).toFixed(4) : '0.00'}
            </div>
            <p className="text-xs text-muted-foreground">Moyenne pondérée</p>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="functions" className="space-y-4">
        <TabsList>
          <TabsTrigger value="functions">Fonctions</TabsTrigger>
          <TabsTrigger value="costs">Coûts</TabsTrigger>
        </TabsList>

        <TabsContent value="functions" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Usage par Fonction Edge</CardTitle>
              <CardDescription>Classé par nombre d'appels (24h)</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {metrics.map((metric) => (
                  <div key={metric.function_name} className="flex items-center justify-between border-b pb-3">
                    <div className="space-y-1">
                      <p className="font-medium">{metric.function_name}</p>
                      <div className="flex gap-2 text-sm text-muted-foreground">
                        <span>{metric.total_calls} appels</span>
                        <span>•</span>
                        <span className="text-destructive">{metric.failed_calls} échecs</span>
                        <span>•</span>
                        <span className="text-orange-500">{metric.rate_limited_calls} rate limited</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-bold">${metric.estimated_cost.toFixed(3)}</p>
                      <p className="text-xs text-muted-foreground">Coût estimé</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="costs" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Évolution des Coûts</CardTitle>
              <CardDescription>Coûts journaliers estimés</CardDescription>
            </CardHeader>
            <CardContent>
              {dailyCosts.length > 0 && (
                <Line
                  data={{
                    labels: dailyCosts.map(d => d.date),
                    datasets: [{
                      label: 'Coût estimé ($)',
                      data: dailyCosts.map(d => d.cost),
                      borderColor: 'rgb(239, 68, 68)',
                      backgroundColor: 'rgba(239, 68, 68, 0.1)',
                      tension: 0.3
                    }]
                  }}
                  options={{
                    responsive: true,
                    plugins: {
                      legend: { position: 'top' },
                      tooltip: {
                        callbacks: {
                          label: (ctx) => `Coût: $${ctx.parsed.y.toFixed(2)}`
                        }
                      }
                    }
                  }}
                />
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
