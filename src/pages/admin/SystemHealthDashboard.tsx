import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Activity, AlertTriangle, CheckCircle2, Clock, Settings, Zap } from 'lucide-react';
import { toast } from 'sonner';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';
import { SystemHealthHistoryCharts } from '@/components/monitoring/SystemHealthHistoryCharts';

const SystemHealthDashboard: React.FC = () => {
  const queryClient = useQueryClient();
  const [isThresholdDialogOpen, setIsThresholdDialogOpen] = useState(false);
  const [editingThreshold, setEditingThreshold] = useState<any>(null);

  // Fetch real-time metrics
  const { data: metrics, isLoading: _metricsLoading } = useQuery({
    queryKey: ['system-health-metrics'],
    queryFn: async () => {
      const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);
      
      const { data, error } = await supabase
        .from('system_health_metrics')
        .select('*')
        .gte('timestamp', oneHourAgo.toISOString())
        .order('timestamp', { ascending: true });
      
      if (error) throw error;
      return data;
    },
    refetchInterval: 10000, // Refresh every 10 seconds
  });

  // Fetch thresholds
  const { data: thresholds } = useQuery({
    queryKey: ['system-health-thresholds'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('system_health_thresholds')
        .select('*')
        .eq('enabled', true)
        .order('metric_name');
      
      if (error) throw error;
      return data;
    },
  });

  // Calculate current KPIs from latest metrics
  const calculateKPIs = () => {
    if (!metrics || metrics.length === 0) return {};

    const kpis: Record<string, { value: number; unit: string; status: 'healthy' | 'warning' | 'critical'; trend: 'up' | 'down' | 'stable' }> = {};

    // Group metrics by name and get latest value
    const metricsByName = metrics.reduce((acc, metric) => {
      if (!acc[metric.metric_name]) {
        acc[metric.metric_name] = [];
      }
      acc[metric.metric_name].push(metric);
      return acc;
    }, {} as Record<string, any[]>);

    Object.entries(metricsByName).forEach(([name, metricList]) => {
      const sortedMetrics = (metricList as any[]).sort((a, b) => 
        new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
      );
      
      const latest = sortedMetrics[0];
      const threshold = thresholds?.find(t => t.metric_name === name);
      
      let status: 'healthy' | 'warning' | 'critical' = 'healthy';
      if (threshold) {
        const value = latest.metric_value;
        const { warning_threshold, critical_threshold, comparison_operator } = threshold;
        
        if (comparison_operator === 'gt') {
          if (value > critical_threshold) status = 'critical';
          else if (value > warning_threshold) status = 'warning';
        } else if (comparison_operator === 'lt') {
          if (value < critical_threshold) status = 'critical';
          else if (value < warning_threshold) status = 'warning';
        }
      }

      // Calculate trend
      let trend: 'up' | 'down' | 'stable' = 'stable';
      if (sortedMetrics.length >= 2) {
        const current = sortedMetrics[0].metric_value;
        const previous = sortedMetrics[1].metric_value;
        const diff = current - previous;
        if (Math.abs(diff) > current * 0.05) { // 5% threshold for trend
          trend = diff > 0 ? 'up' : 'down';
        }
      }

      kpis[name] = {
        value: latest.metric_value,
        unit: latest.metric_unit || '',
        status,
        trend
      };
    });

    return kpis;
  };

  const kpis = calculateKPIs();

  const updateThresholdMutation = useMutation({
    mutationFn: async (data: any) => {
      const { error } = await supabase
        .from('system_health_thresholds')
        .update(data)
        .eq('id', editingThreshold.id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['system-health-thresholds'] });
      toast.success('Seuil mis à jour');
      setIsThresholdDialogOpen(false);
      setEditingThreshold(null);
    },
  });

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'healthy': return <CheckCircle2 className="h-5 w-5 text-green-500" />;
      case 'warning': return <AlertTriangle className="h-5 w-5 text-amber-500" />;
      case 'critical': return <AlertTriangle className="h-5 w-5 text-red-500" />;
      default: return <Activity className="h-5 w-5 text-gray-500" />;
    }
  };

  const getTrendIcon = (trend: string) => {
    if (trend === 'up') return '↗';
    if (trend === 'down') return '↘';
    return '→';
  };

  // Prepare chart data for each metric
  const prepareChartData = (metricName: string) => {
    if (!metrics) return [];
    
    return metrics
      .filter(m => m.metric_name === metricName)
      .map(m => ({
        time: new Date(m.timestamp).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }),
        value: m.metric_value
      }));
  };

  const displayMetrics = [
    { name: 'uptime_percentage', label: 'Uptime', icon: Activity },
    { name: 'avg_response_time_ms', label: 'Latence Moyenne', icon: Clock },
    { name: 'error_rate_percentage', label: 'Taux d\'Erreur', icon: AlertTriangle },
    { name: 'alerts_per_hour', label: 'Alertes/Heure', icon: Zap },
  ];

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-3">
            <Activity className="h-8 w-8 text-primary" />
            Santé du Système
          </h1>
          <p className="text-muted-foreground mt-2">
            Surveillance en temps réel des KPIs avec alerting automatique
          </p>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {displayMetrics.map((metric) => {
          const kpi = kpis[metric.name];

          
          return (
            <Card key={metric.name}>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">{metric.label}</CardTitle>
                {kpi && getStatusIcon(kpi.status)}
              </CardHeader>
              <CardContent>
                {kpi ? (
                  <>
                    <div className="text-2xl font-bold">
                      {kpi.value.toFixed(metric.name.includes('percentage') ? 2 : 0)}
                      {kpi.unit}
                    </div>
                    <div className="flex items-center gap-2 mt-2">
                      <Badge variant={kpi.status === 'healthy' ? 'default' : 'destructive'}>
                        {kpi.status}
                      </Badge>
                      <span className="text-sm text-muted-foreground">
                        {getTrendIcon(kpi.trend)}
                      </span>
                    </div>
                  </>
                ) : (
                  <p className="text-sm text-muted-foreground">Aucune donnée</p>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Metric Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {displayMetrics.map((metric) => {
          const chartData = prepareChartData(metric.name);
          const threshold = thresholds?.find(t => t.metric_name === metric.name);
          
          return (
            <Card key={metric.name}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base">{metric.label} - Dernière Heure</CardTitle>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => {
                      setEditingThreshold(threshold);
                      setIsThresholdDialogOpen(true);
                    }}
                  >
                    <Settings className="h-4 w-4" />
                  </Button>
                </div>
                <CardDescription>
                  Seuil d'alerte: {threshold?.warning_threshold || 'N/A'} | 
                  Critique: {threshold?.critical_threshold || 'N/A'}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={200}>
                  <LineChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis 
                      dataKey="time" 
                      stroke="hsl(var(--muted-foreground))"
                      style={{ fontSize: '10px' }}
                    />
                    <YAxis 
                      stroke="hsl(var(--muted-foreground))"
                      style={{ fontSize: '10px' }}
                    />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'hsl(var(--card))',
                        border: '1px solid hsl(var(--border))',
                        borderRadius: '8px'
                      }}
                    />
                    {threshold && (
                      <>
                        <ReferenceLine 
                          y={threshold.warning_threshold} 
                          stroke="hsl(var(--amber-500))" 
                          strokeDasharray="3 3"
                          label="Warning"
                        />
                        <ReferenceLine 
                          y={threshold.critical_threshold} 
                          stroke="hsl(var(--destructive))" 
                          strokeDasharray="3 3"
                          label="Critical"
                        />
                      </>
                    )}
                    <Line 
                      type="monotone" 
                      dataKey="value" 
                      stroke="hsl(var(--primary))" 
                      strokeWidth={2}
                      dot={false}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Historical Performance Charts */}
      <SystemHealthHistoryCharts thresholds={thresholds} />

      {/* Threshold Configuration Dialog */}
      <Dialog open={isThresholdDialogOpen} onOpenChange={setIsThresholdDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Configurer les Seuils</DialogTitle>
          </DialogHeader>
          {editingThreshold && (
            <div className="space-y-4">
              <div>
                <Label>Métrique</Label>
                <Input value={editingThreshold.metric_name} disabled />
              </div>
              <div>
                <Label>Seuil d'Alerte</Label>
                <Input
                  type="number"
                  value={editingThreshold.warning_threshold}
                  onChange={(e) => setEditingThreshold({
                    ...editingThreshold,
                    warning_threshold: parseFloat(e.target.value)
                  })}
                />
              </div>
              <div>
                <Label>Seuil Critique</Label>
                <Input
                  type="number"
                  value={editingThreshold.critical_threshold}
                  onChange={(e) => setEditingThreshold({
                    ...editingThreshold,
                    critical_threshold: parseFloat(e.target.value)
                  })}
                />
              </div>
              <Button onClick={() => updateThresholdMutation.mutate(editingThreshold)}>
                Mettre à jour
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default SystemHealthDashboard;
