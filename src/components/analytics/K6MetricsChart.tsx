import { useState, useMemo } from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Activity, AlertTriangle, ArrowDown, ArrowUp, Download, RefreshCw } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

interface K6Metrics {
  timestamp: string;
  function_name: string;
  http_req_duration_p95: number;
  http_req_duration_p99: number;
  http_req_failed_rate: number;
  data_received_rate: number;
  data_sent_rate: number;
}

interface K6MetricsChartProps {
  metrics: K6Metrics[];
  type: 'latency' | 'errors' | 'throughput';
  title?: string;
  onRefresh?: () => void;
  onExport?: () => void;
  isLoading?: boolean;
}

export function K6MetricsChart({ 
  metrics, 
  type,
  title,
  onRefresh,
  onExport,
  isLoading = false
}: K6MetricsChartProps) {
  const [timeRange, setTimeRange] = useState<'1h' | '6h' | '24h' | '7d'>('24h');

  // Statistiques calculées
  const stats = useMemo(() => {
    if (!metrics.length) return null;

    if (type === 'latency') {
      const p95Values = metrics.map(m => m.http_req_duration_p95);
      return {
        current: p95Values[p95Values.length - 1],
        average: p95Values.reduce((a, b) => a + b, 0) / p95Values.length,
        max: Math.max(...p95Values),
        min: Math.min(...p95Values),
        trend: p95Values.length > 1 ? p95Values[p95Values.length - 1] - p95Values[p95Values.length - 2] : 0
      };
    } else if (type === 'errors') {
      const errorRates = metrics.map(m => m.http_req_failed_rate * 100);
      return {
        current: errorRates[errorRates.length - 1],
        average: errorRates.reduce((a, b) => a + b, 0) / errorRates.length,
        max: Math.max(...errorRates),
        min: Math.min(...errorRates),
        trend: errorRates.length > 1 ? errorRates[errorRates.length - 1] - errorRates[errorRates.length - 2] : 0
      };
    } else {
      const throughput = metrics.map(m => m.data_received_rate / 1024);
      return {
        current: throughput[throughput.length - 1],
        average: throughput.reduce((a, b) => a + b, 0) / throughput.length,
        max: Math.max(...throughput),
        min: Math.min(...throughput),
        trend: throughput.length > 1 ? throughput[throughput.length - 1] - throughput[throughput.length - 2] : 0
      };
    }
  }, [metrics, type]);

  // Détection des anomalies
  const anomalies = useMemo(() => {
    if (!stats) return [];
    const threshold = stats.average * 1.5;
    return metrics
      .map((m, index) => {
        const value = type === 'latency' ? m.http_req_duration_p95 :
                      type === 'errors' ? m.http_req_failed_rate * 100 :
                      m.data_received_rate / 1024;
        return value > threshold ? index : -1;
      })
      .filter(i => i !== -1);
  }, [metrics, stats, type]);

  if (!metrics || metrics.length === 0) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center h-64 text-muted-foreground">
          <Activity className="h-12 w-12 mb-4 opacity-30" />
          <p>Aucune donnée disponible</p>
          {onRefresh && (
            <Button variant="outline" size="sm" className="mt-4" onClick={onRefresh}>
              <RefreshCw className="h-4 w-4 mr-2" />
              Actualiser
            </Button>
          )}
        </CardContent>
      </Card>
    );
  }

  const sortedMetrics = [...metrics].sort((a, b) => 
    new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
  );

  const labels = sortedMetrics.map(m => 
    new Date(m.timestamp).toLocaleString('fr-FR', { 
      month: 'short', 
      day: 'numeric', 
      hour: '2-digit', 
      minute: '2-digit' 
    })
  );

  let datasets: any[] = [];
  let chartTitle = '';
  let unit = '';

  if (type === 'latency') {
    chartTitle = 'Latence des requêtes';
    unit = 'ms';
    datasets = [
      {
        label: 'P95 Latence (ms)',
        data: sortedMetrics.map(m => m.http_req_duration_p95),
        borderColor: 'rgb(59, 130, 246)',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        fill: true,
        tension: 0.4,
        pointRadius: (ctx: any) => anomalies.includes(ctx.dataIndex) ? 6 : 3,
        pointBackgroundColor: (ctx: any) => anomalies.includes(ctx.dataIndex) ? 'rgb(239, 68, 68)' : 'rgb(59, 130, 246)',
      },
      {
        label: 'P99 Latence (ms)',
        data: sortedMetrics.map(m => m.http_req_duration_p99),
        borderColor: 'rgb(239, 68, 68)',
        backgroundColor: 'rgba(239, 68, 68, 0.1)',
        fill: true,
        tension: 0.4,
      },
    ];
  } else if (type === 'errors') {
    chartTitle = "Taux d'erreur";
    unit = '%';
    datasets = [
      {
        label: "Taux d'erreur (%)",
        data: sortedMetrics.map(m => m.http_req_failed_rate * 100),
        borderColor: 'rgb(239, 68, 68)',
        backgroundColor: 'rgba(239, 68, 68, 0.2)',
        fill: true,
        tension: 0.4,
        pointRadius: (ctx: any) => {
          const value = sortedMetrics[ctx.dataIndex]?.http_req_failed_rate * 100;
          return value > 1 ? 6 : 3;
        },
        pointBackgroundColor: (ctx: any) => {
          const value = sortedMetrics[ctx.dataIndex]?.http_req_failed_rate * 100;
          return value > 1 ? 'rgb(239, 68, 68)' : 'rgb(34, 197, 94)';
        },
      },
    ];
  } else if (type === 'throughput') {
    chartTitle = 'Débit réseau';
    unit = 'KB/s';
    datasets = [
      {
        label: 'Données reçues (KB/s)',
        data: sortedMetrics.map(m => m.data_received_rate / 1024),
        borderColor: 'rgb(34, 197, 94)',
        backgroundColor: 'rgba(34, 197, 94, 0.1)',
        fill: true,
        tension: 0.4,
      },
      {
        label: 'Données envoyées (KB/s)',
        data: sortedMetrics.map(m => m.data_sent_rate / 1024),
        borderColor: 'rgb(168, 85, 247)',
        backgroundColor: 'rgba(168, 85, 247, 0.1)',
        fill: true,
        tension: 0.4,
      },
    ];
  }

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      tooltip: {
        mode: 'index' as const,
        intersect: false,
        callbacks: {
          label: (context: any) => {
            return `${context.dataset.label}: ${context.parsed.y.toFixed(2)} ${unit}`;
          }
        }
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          color: 'rgba(0, 0, 0, 0.05)',
        },
      },
      x: {
        grid: {
          display: false,
        },
      },
    },
    interaction: {
      mode: 'nearest' as const,
      axis: 'x' as const,
      intersect: false,
    },
  };

  const data = {
    labels,
    datasets,
  };

  const getStatusColor = () => {
    if (type === 'errors' && stats && stats.current > 1) return 'text-red-500';
    if (type === 'latency' && stats && stats.current > 500) return 'text-orange-500';
    return 'text-green-500';
  };

  const getStatusBadge = () => {
    if (type === 'errors' && stats) {
      if (stats.current > 5) return { label: 'Critique', variant: 'destructive' as const };
      if (stats.current > 1) return { label: 'Dégradé', variant: 'secondary' as const };
      return { label: 'Normal', variant: 'outline' as const };
    }
    if (type === 'latency' && stats) {
      if (stats.current > 1000) return { label: 'Lent', variant: 'destructive' as const };
      if (stats.current > 500) return { label: 'Moyen', variant: 'secondary' as const };
      return { label: 'Rapide', variant: 'outline' as const };
    }
    return { label: 'Normal', variant: 'outline' as const };
  };

  const statusBadge = getStatusBadge();

  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <CardTitle className="text-lg">{title || chartTitle}</CardTitle>
            <Badge variant={statusBadge.variant}>{statusBadge.label}</Badge>
          </div>
          <div className="flex items-center gap-2">
            <Select value={timeRange} onValueChange={(v: any) => setTimeRange(v)}>
              <SelectTrigger className="w-24 h-8">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1h">1h</SelectItem>
                <SelectItem value="6h">6h</SelectItem>
                <SelectItem value="24h">24h</SelectItem>
                <SelectItem value="7d">7j</SelectItem>
              </SelectContent>
            </Select>
            
            {onRefresh && (
              <Button variant="ghost" size="icon" className="h-8 w-8" onClick={onRefresh} disabled={isLoading}>
                <RefreshCw className={cn("h-4 w-4", isLoading && "animate-spin")} />
              </Button>
            )}
            
            {onExport && (
              <Button variant="ghost" size="icon" className="h-8 w-8" onClick={onExport}>
                <Download className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>

        {/* Statistiques rapides */}
        {stats && (
          <div className="grid grid-cols-4 gap-4 mt-4">
            <motion.div 
              className="text-center"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <p className="text-xs text-muted-foreground">Actuel</p>
              <p className={cn("text-lg font-bold", getStatusColor())}>
                {stats.current.toFixed(1)} {unit}
              </p>
              <div className="flex items-center justify-center gap-1 text-xs">
                {stats.trend > 0 ? (
                  <ArrowUp className="h-3 w-3 text-red-500" />
                ) : stats.trend < 0 ? (
                  <ArrowDown className="h-3 w-3 text-green-500" />
                ) : null}
                <span className={stats.trend > 0 ? 'text-red-500' : 'text-green-500'}>
                  {Math.abs(stats.trend).toFixed(1)}
                </span>
              </div>
            </motion.div>
            
            <div className="text-center">
              <p className="text-xs text-muted-foreground">Moyenne</p>
              <p className="text-lg font-semibold">{stats.average.toFixed(1)} {unit}</p>
            </div>
            
            <div className="text-center">
              <p className="text-xs text-muted-foreground">Min</p>
              <p className="text-lg font-semibold text-green-600">{stats.min.toFixed(1)} {unit}</p>
            </div>
            
            <div className="text-center">
              <p className="text-xs text-muted-foreground">Max</p>
              <p className="text-lg font-semibold text-red-600">{stats.max.toFixed(1)} {unit}</p>
            </div>
          </div>
        )}

        {/* Alerte anomalies */}
        <AnimatePresence>
          {anomalies.length > 0 && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mt-3 p-2 bg-orange-50 dark:bg-orange-950/30 rounded-lg flex items-center gap-2"
            >
              <AlertTriangle className="h-4 w-4 text-orange-500" />
              <span className="text-sm text-orange-700 dark:text-orange-300">
                {anomalies.length} anomalie{anomalies.length > 1 ? 's' : ''} détectée{anomalies.length > 1 ? 's' : ''}
              </span>
            </motion.div>
          )}
        </AnimatePresence>
      </CardHeader>

      <CardContent>
        <div className="h-64">
          <Line options={options} data={data} />
        </div>
      </CardContent>
    </Card>
  );
}
