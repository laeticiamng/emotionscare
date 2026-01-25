import React, { useState, useMemo } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  Area,
  AreaChart,
  ReferenceLine
} from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  TrendingUp, TrendingDown, Minus, Download, Share2, 
  Activity, Heart, Brain, Zap, Calendar
} from 'lucide-react';
import { BreathRow } from '@/services/breathApi';
import { useToast } from '@/hooks/use-toast';
import { motion } from 'framer-motion';

interface Props {
  data: BreathRow[];
  height?: number;
  showControls?: boolean;
  title?: string;
}

type MetricKey = 'hrv_stress_idx' | 'coherence_avg' | 'mindfulness_pct' | 'relax_pct' | 'mood_avg';
type TimeRange = '1w' | '1m' | '3m' | '6m' | 'all';

const metricConfig: Record<MetricKey, { label: string; color: string; icon: React.ReactNode }> = {
  hrv_stress_idx: { label: 'HRV Stress', color: '#ef4444', icon: <Activity className="h-4 w-4" /> },
  coherence_avg: { label: 'Cohérence', color: '#22c55e', icon: <Heart className="h-4 w-4" /> },
  mindfulness_pct: { label: 'Pleine conscience', color: '#3b82f6', icon: <Brain className="h-4 w-4" /> },
  relax_pct: { label: 'Relaxation', color: '#8b5cf6', icon: <Zap className="h-4 w-4" /> },
  mood_avg: { label: 'Humeur', color: '#f59e0b', icon: <Heart className="h-4 w-4" /> }
};

const BreathTrendChart: React.FC<Props> = ({ 
  data, 
  height = 300, 
  showControls = true,
  title = 'Tendances Respiration'
}) => {
  const { toast } = useToast();
  const [selectedMetrics, setSelectedMetrics] = useState<MetricKey[]>(['hrv_stress_idx', 'coherence_avg'] as MetricKey[]);
  const [timeRange, setTimeRange] = useState<TimeRange>('1m');
  const [chartType, setChartType] = useState<'line' | 'area'>('line');

  // Filter data based on time range
  const filteredData = useMemo(() => {
    if (!data || data.length === 0) return [];
    
    const now = new Date();
    let cutoffDate: Date;
    
    switch (timeRange) {
      case '1w':
        cutoffDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        break;
      case '1m':
        cutoffDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        break;
      case '3m':
        cutoffDate = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
        break;
      case '6m':
        cutoffDate = new Date(now.getTime() - 180 * 24 * 60 * 60 * 1000);
        break;
      default:
        return data;
    }

    return data.filter(item => {
      const itemDate = new Date(item.week || '');
      return itemDate >= cutoffDate;
    });
  }, [data, timeRange]);

  // Calculate statistics
  const stats = useMemo(() => {
    if (filteredData.length < 2) return null;

    const result: Record<MetricKey, { current: number; previous: number; trend: 'up' | 'down' | 'stable'; avg: number }> = {} as any;
    
    selectedMetrics.forEach(metric => {
      const values = filteredData.map(d => (d as unknown as Record<string, unknown>)[metric] as number).filter(v => v != null);
      if (values.length === 0) return;
      
      const current = values[values.length - 1];
      const previous = values.length > 1 ? values[values.length - 2] : current;
      const avg = values.reduce((a, b) => a + b, 0) / values.length;
      
      let trend: 'up' | 'down' | 'stable' = 'stable';
      if (current > previous * 1.05) trend = 'up';
      else if (current < previous * 0.95) trend = 'down';
      
      result[metric] = { current, previous, trend, avg };
    });

    return result;
  }, [filteredData, selectedMetrics]);

  const toggleMetric = (metric: MetricKey) => {
    setSelectedMetrics(prev => {
      if (prev.includes(metric)) {
        return prev.filter(m => m !== metric);
      }
      return [...prev, metric];
    });
  };

  const handleExport = () => {
    const exportData = filteredData.map(row => {
      const rowRecord = row as unknown as Record<string, unknown>;
      return {
        date: row.week,
        ...Object.fromEntries(selectedMetrics.map(m => [metricConfig[m].label, rowRecord[m]]))
      };
    });
    
    const csv = [
      ['Date', ...selectedMetrics.map(m => metricConfig[m].label)].join(','),
      ...exportData.map(row => {
        const rowData = row as Record<string, unknown>;
        return [
          row.date,
          ...selectedMetrics.map(m => rowData[metricConfig[m].label] ?? '')
        ].join(',');
      })
    ].join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `breath-trends-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    
    toast({ title: 'Export réussi', description: 'Données exportées en CSV.' });
  };

  const handleShare = async () => {
    if (!stats) return;
    
    const lines = selectedMetrics
      .filter(m => stats[m])
      .map(m => `• ${metricConfig[m].label}: ${stats[m].current.toFixed(1)} (${stats[m].trend === 'up' ? '↑' : stats[m].trend === 'down' ? '↓' : '→'})`);
    
    const text = `🧘 Mes tendances Breath:\n${lines.join('\n')}`;
    
    if (navigator.share) {
      await navigator.share({ title: 'Mes tendances Breath', text });
    } else {
      await navigator.clipboard.writeText(text);
      toast({ title: 'Copié !', description: 'Résumé copié dans le presse-papier.' });
    }
  };

  const TrendIcon = ({ trend }: { trend: 'up' | 'down' | 'stable' }) => {
    if (trend === 'up') return <TrendingUp className="h-3 w-3 text-green-500" />;
    if (trend === 'down') return <TrendingDown className="h-3 w-3 text-red-500" />;
    return <Minus className="h-3 w-3 text-muted-foreground" />;
  };

  const ChartComponent = chartType === 'area' ? AreaChart : LineChart;

  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5 text-primary" />
            {title}
          </CardTitle>
          
          {showControls && (
            <div className="flex items-center gap-2">
              <Select value={timeRange} onValueChange={(v) => setTimeRange(v as TimeRange)}>
                <SelectTrigger className="w-[100px]">
                  <Calendar className="h-4 w-4 mr-2" />
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1w">1 sem</SelectItem>
                  <SelectItem value="1m">1 mois</SelectItem>
                  <SelectItem value="3m">3 mois</SelectItem>
                  <SelectItem value="6m">6 mois</SelectItem>
                  <SelectItem value="all">Tout</SelectItem>
                </SelectContent>
              </Select>

              <Button
                variant="outline"
                size="sm"
                onClick={() => setChartType(prev => prev === 'line' ? 'area' : 'line')}
              >
                {chartType === 'line' ? 'Area' : 'Line'}
              </Button>

              <Button variant="outline" size="icon" onClick={handleExport}>
                <Download className="h-4 w-4" />
              </Button>
              
              <Button variant="outline" size="icon" onClick={handleShare}>
                <Share2 className="h-4 w-4" />
              </Button>
            </div>
          )}
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Metric toggles */}
        {showControls && (
          <div className="flex flex-wrap gap-2">
            {(Object.keys(metricConfig) as MetricKey[]).map(metric => (
              <Button
                key={metric}
                variant={selectedMetrics.includes(metric) ? 'default' : 'outline'}
                size="sm"
                onClick={() => toggleMetric(metric)}
                style={selectedMetrics.includes(metric) ? { backgroundColor: metricConfig[metric].color } : {}}
                className="gap-2"
              >
                {metricConfig[metric].icon}
                {metricConfig[metric].label}
              </Button>
            ))}
          </div>
        )}

        {/* Stats cards */}
        {stats && selectedMetrics.length > 0 && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {selectedMetrics.map(metric => stats[metric] && (
              <motion.div
                key={metric}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="p-3 rounded-lg bg-muted/50"
              >
                <div className="flex items-center gap-2 mb-1">
                  <div style={{ color: metricConfig[metric].color }}>
                    {metricConfig[metric].icon}
                  </div>
                  <span className="text-xs font-medium text-muted-foreground">
                    {metricConfig[metric].label}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-lg font-bold" style={{ color: metricConfig[metric].color }}>
                    {stats[metric].current.toFixed(1)}
                  </span>
                  <div className="flex items-center gap-1">
                    <TrendIcon trend={stats[metric].trend} />
                    <span className="text-xs text-muted-foreground">
                      moy: {stats[metric].avg.toFixed(1)}
                    </span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {/* Chart */}
        {filteredData.length > 0 ? (
          <div style={{ width: '100%', height }}>
            <ResponsiveContainer width="100%" height="100%">
              <ChartComponent data={filteredData} margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                <XAxis 
                  dataKey="week" 
                  tick={{ fontSize: 12 }}
                  tickFormatter={(value) => {
                    if (!value) return '';
                    const date = new Date(value);
                    return `${date.getDate()}/${date.getMonth() + 1}`;
                  }}
                />
                <YAxis domain={[0, 'dataMax + 10']} tick={{ fontSize: 12 }} />
                <Tooltip 
                  contentStyle={{
                    backgroundColor: 'hsl(var(--background))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px'
                  }}
                  labelFormatter={(value) => {
                    if (!value) return '';
                    return new Date(value).toLocaleDateString('fr-FR', { 
                      day: 'numeric', 
                      month: 'short', 
                      year: 'numeric' 
                    });
                  }}
                />
                <Legend />
                
                {selectedMetrics.map(metric => (
                  chartType === 'area' ? (
                    <Area
                      key={metric}
                      type="monotone"
                      dataKey={metric}
                      stroke={metricConfig[metric].color}
                      fill={metricConfig[metric].color}
                      fillOpacity={0.2}
                      name={metricConfig[metric].label}
                      strokeWidth={2}
                    />
                  ) : (
                    <Line
                      key={metric}
                      type="monotone"
                      dataKey={metric}
                      stroke={metricConfig[metric].color}
                      name={metricConfig[metric].label}
                      strokeWidth={2}
                      dot={{ fill: metricConfig[metric].color, r: 3 }}
                      activeDot={{ r: 5 }}
                    />
                  )
                ))}
                
                {/* Reference line for average */}
                {stats && selectedMetrics[0] && stats[selectedMetrics[0]] && (
                  <ReferenceLine 
                    y={stats[selectedMetrics[0]].avg} 
                    stroke={metricConfig[selectedMetrics[0]].color}
                    strokeDasharray="5 5"
                    opacity={0.5}
                  />
                )}
              </ChartComponent>
            </ResponsiveContainer>
          </div>
        ) : (
          <div className="flex items-center justify-center h-48 text-muted-foreground">
            <div className="text-center">
              <Activity className="h-12 w-12 mx-auto mb-3 opacity-50" />
              <p>Pas encore de données</p>
              <p className="text-sm">Les tendances apparaîtront après quelques sessions</p>
            </div>
          </div>
        )}

        {/* Data points indicator */}
        {filteredData.length > 0 && (
          <div className="flex items-center justify-between text-xs text-muted-foreground pt-2 border-t">
            <span>{filteredData.length} points de données</span>
            <span>
              {filteredData[0]?.week && new Date(filteredData[0].week).toLocaleDateString('fr-FR')} 
              {' → '}
              {filteredData[filteredData.length - 1]?.week && 
                new Date(filteredData[filteredData.length - 1].week).toLocaleDateString('fr-FR')}
            </span>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default BreathTrendChart;
