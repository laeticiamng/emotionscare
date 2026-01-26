import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
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
  ReferenceLine 
} from 'recharts';
import { format, subDays, startOfDay } from 'date-fns';
import { fr } from 'date-fns/locale';
import { TrendingUp, TrendingDown, Activity, Zap } from 'lucide-react';

type TimePeriod = '7days' | '30days' | '90days';

interface SystemHealthHistoryChartsProps {
  thresholds?: any[];
}

export const SystemHealthHistoryCharts: React.FC<SystemHealthHistoryChartsProps> = ({ thresholds = [] }) => {
  const [timePeriod, setTimePeriod] = useState<TimePeriod>('7days');

  const getDaysCount = (period: TimePeriod) => {
    switch (period) {
      case '7days': return 7;
      case '30days': return 30;
      case '90days': return 90;
      default: return 7;
    }
  };

  // Fetch historical metrics
  const { data: historicalMetrics, isLoading } = useQuery({
    queryKey: ['system-health-history', timePeriod],
    queryFn: async () => {
      const daysCount = getDaysCount(timePeriod);
      const startDate = startOfDay(subDays(new Date(), daysCount));
      
      const { data, error } = await supabase
        .from('system_health_metrics')
        .select('*')
        .gte('timestamp', startDate.toISOString())
        .order('timestamp', { ascending: true });
      
      if (error) throw error;
      return data;
    },
    refetchInterval: 30000, // Refresh every 30 seconds
  });

  // Process data by metric type and day
  const processMetricsData = () => {
    if (!historicalMetrics || historicalMetrics.length === 0) return {};

    const metricsByDay: Record<string, Record<string, any[]>> = {};

    historicalMetrics.forEach(metric => {
      const day = format(new Date(metric.timestamp), 'yyyy-MM-dd');
      if (!metricsByDay[day]) {
        metricsByDay[day] = {};
      }
      if (!metricsByDay[day][metric.metric_name]) {
        metricsByDay[day][metric.metric_name] = [];
      }
      metricsByDay[day][metric.metric_name].push(metric);
    });

    // Calculate daily averages
    const chartData: any[] = [];
    Object.entries(metricsByDay).forEach(([day, metrics]) => {
      const dayData: any = { date: day, dateFormatted: format(new Date(day), 'dd MMM', { locale: fr }) };
      
      Object.entries(metrics).forEach(([metricName, values]) => {
        const avg = values.reduce((sum, v) => sum + v.metric_value, 0) / values.length;
        const max = Math.max(...values.map(v => v.metric_value));
        const min = Math.min(...values.map(v => v.metric_value));
        
        dayData[metricName] = avg;
        dayData[`${metricName}_max`] = max;
        dayData[`${metricName}_min`] = min;
      });
      
      chartData.push(dayData);
    });

    return { chartData, metricsByDay };
  };

  const { chartData = [] } = processMetricsData();

  // Calculate period comparison
  const calculateComparison = () => {
    if (chartData.length === 0) return {};

    const halfPoint = Math.floor(chartData.length / 2);
    const firstHalf = chartData.slice(0, halfPoint);
    const secondHalf = chartData.slice(halfPoint);

    const comparison: Record<string, { change: number; trend: 'up' | 'down' | 'stable' }> = {};

    ['uptime_percentage', 'avg_response_time_ms', 'error_rate_percentage', 'alerts_per_hour'].forEach(metric => {
      const firstAvg = firstHalf.reduce((sum, d) => sum + (d[metric] || 0), 0) / firstHalf.length;
      const secondAvg = secondHalf.reduce((sum, d) => sum + (d[metric] || 0), 0) / secondHalf.length;
      
      const change = ((secondAvg - firstAvg) / firstAvg) * 100;
      let trend: 'up' | 'down' | 'stable' = 'stable';
      
      if (Math.abs(change) > 5) {
        trend = change > 0 ? 'up' : 'down';
      }
      
      comparison[metric] = { change, trend };
    });

    return comparison;
  };

  const comparison = calculateComparison();

  const getThreshold = (metricName: string) => {
    return thresholds.find(t => t.metric_name === metricName);
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Historique des métriques</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-64">
            <Activity className="animate-spin h-8 w-8 text-primary" />
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Time Period Selector */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Historique des performances système</CardTitle>
              <CardDescription>Analyse comparative sur {getDaysCount(timePeriod)} jours</CardDescription>
            </div>
            <Tabs value={timePeriod} onValueChange={(v) => setTimePeriod(v as TimePeriod)}>
              <TabsList>
                <TabsTrigger value="7days">7 jours</TabsTrigger>
                <TabsTrigger value="30days">30 jours</TabsTrigger>
                <TabsTrigger value="90days">90 jours</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        </CardHeader>
      </Card>

      {/* Comparison Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { key: 'uptime_percentage', label: 'Uptime', unit: '%', good: 'up' },
          { key: 'avg_response_time_ms', label: 'Latence', unit: 'ms', good: 'down' },
          { key: 'error_rate_percentage', label: 'Erreurs', unit: '%', good: 'down' },
          { key: 'alerts_per_hour', label: 'Alertes/h', unit: '', good: 'down' }
 ].map(({ key, label, good }) => {
          const comp = comparison[key];
          const isGood = comp ? (comp.trend === good || comp.trend === 'stable') : true;
          
          return (
            <Card key={key}>
              <CardHeader className="pb-2">
                <CardDescription>{label}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {comp && comp.trend !== 'stable' && (
                      <>
                        {comp.trend === 'up' ? (
                          <TrendingUp className={`h-5 w-5 ${isGood ? 'text-green-500' : 'text-red-500'}`} />
                        ) : (
                          <TrendingDown className={`h-5 w-5 ${isGood ? 'text-green-500' : 'text-red-500'}`} />
                        )}
                        <span className={`text-sm font-medium ${isGood ? 'text-green-500' : 'text-red-500'}`}>
                          {comp.change > 0 ? '+' : ''}{comp.change.toFixed(1)}%
                        </span>
                      </>
                    )}
                    {(!comp || comp.trend === 'stable') && (
                      <Badge variant="outline">Stable</Badge>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Uptime & Response Time Chart */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5" />
            Disponibilité & Performance
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={chartData}>
              <defs>
                <linearGradient id="uptime" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0.1}/>
                </linearGradient>
                <linearGradient id="response" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(var(--accent))" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="hsl(var(--accent))" stopOpacity={0.1}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis 
                dataKey="dateFormatted" 
                stroke="hsl(var(--muted-foreground))"
                fontSize={12}
              />
              <YAxis 
                yAxisId="left"
                stroke="hsl(var(--muted-foreground))"
                fontSize={12}
                label={{ value: 'Uptime (%)', angle: -90, position: 'insideLeft' }}
              />
              <YAxis 
                yAxisId="right"
                orientation="right"
                stroke="hsl(var(--muted-foreground))"
                fontSize={12}
                label={{ value: 'Latence (ms)', angle: 90, position: 'insideRight' }}
              />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'hsl(var(--card))',
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '8px'
                }}
              />
              <Legend />
              {getThreshold('uptime_percentage') && (
                <ReferenceLine 
                  yAxisId="left"
                  y={getThreshold('uptime_percentage').warning_threshold} 
                  stroke="hsl(var(--destructive))" 
                  strokeDasharray="3 3"
                  label="Seuil uptime"
                />
              )}
              <Area 
                yAxisId="left"
                type="monotone" 
                dataKey="uptime_percentage" 
                stroke="hsl(var(--primary))" 
                fill="url(#uptime)"
                name="Uptime (%)"
              />
              <Area 
                yAxisId="right"
                type="monotone" 
                dataKey="avg_response_time_ms" 
                stroke="hsl(var(--accent))" 
                fill="url(#response)"
                name="Latence (ms)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Error Rate & Alerts Chart */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="h-5 w-5" />
            Erreurs & Alertes
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis 
                dataKey="dateFormatted" 
                stroke="hsl(var(--muted-foreground))"
                fontSize={12}
              />
              <YAxis 
                yAxisId="left"
                stroke="hsl(var(--muted-foreground))"
                fontSize={12}
                label={{ value: 'Taux erreur (%)', angle: -90, position: 'insideLeft' }}
              />
              <YAxis 
                yAxisId="right"
                orientation="right"
                stroke="hsl(var(--muted-foreground))"
                fontSize={12}
                label={{ value: 'Alertes/h', angle: 90, position: 'insideRight' }}
              />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'hsl(var(--card))',
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '8px'
                }}
              />
              <Legend />
              {getThreshold('error_rate_percentage') && (
                <ReferenceLine 
                  yAxisId="left"
                  y={getThreshold('error_rate_percentage').critical_threshold} 
                  stroke="hsl(var(--destructive))" 
                  strokeDasharray="3 3"
                  label="Seuil critique"
                />
              )}
              <Bar 
                yAxisId="left"
                dataKey="error_rate_percentage" 
                fill="hsl(var(--destructive))"
                name="Taux erreur (%)"
                radius={[4, 4, 0, 0]}
              />
              <Bar 
                yAxisId="right"
                dataKey="alerts_per_hour" 
                fill="hsl(var(--warning))"
                name="Alertes/h"
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* CPU & Memory Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Ressources système</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis 
                dataKey="dateFormatted" 
                stroke="hsl(var(--muted-foreground))"
                fontSize={12}
              />
              <YAxis 
                stroke="hsl(var(--muted-foreground))"
                fontSize={12}
                label={{ value: 'Utilisation (%)', angle: -90, position: 'insideLeft' }}
                domain={[0, 100]}
              />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'hsl(var(--card))',
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '8px'
                }}
              />
              <Legend />
              <ReferenceLine y={80} stroke="hsl(var(--warning))" strokeDasharray="3 3" label="Seuil attention" />
              <ReferenceLine y={90} stroke="hsl(var(--destructive))" strokeDasharray="3 3" label="Seuil critique" />
              <Line 
                type="monotone" 
                dataKey="cpu_usage_percentage" 
                stroke="hsl(var(--primary))" 
                strokeWidth={2}
                dot={{ fill: 'hsl(var(--primary))' }}
                name="CPU (%)"
              />
              <Line 
                type="monotone" 
                dataKey="memory_usage_percentage" 
                stroke="hsl(var(--accent))" 
                strokeWidth={2}
                dot={{ fill: 'hsl(var(--accent))' }}
                name="Mémoire (%)"
              />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
};
