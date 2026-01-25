import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useQuery } from '@tanstack/react-query';
import { 
  getMetrics, 
  formatMetricsForChart, 
  downloadMetricsCSV,
  calculateGlobalStats 
} from '@/services/musicQueueMetricsService';
import { Download, TrendingUp, CheckCircle, Clock, Crown } from 'lucide-react';
import { toast } from 'sonner';
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

// Register ChartJS components
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

export default function MusicQueueMetricsDashboard() {
  const [days, setDays] = useState(7);

  const { data: metrics = [], isLoading } = useQuery({
    queryKey: ['music-queue-metrics', days],
    queryFn: () => getMetrics(days),
    refetchInterval: 60000, // Refresh toutes les minutes
  });

  const chartData = formatMetricsForChart(metrics);
  const globalStats = calculateGlobalStats(metrics);

  const handleExportCSV = () => {
    try {
      downloadMetricsCSV(metrics, `music-queue-metrics-${days}d.csv`);
      toast.success('Export CSV réussi');
    } catch (error) {
      toast.error('Échec de l\'export CSV');
    }
  };

  // Configuration du graphique d'évolution
  const evolutionChartData = {
    labels: chartData.labels,
    datasets: [
      {
        label: 'Total Demandes',
        data: chartData.totalRequests,
        borderColor: 'rgb(99, 102, 241)',
        backgroundColor: 'rgba(99, 102, 241, 0.1)',
        fill: true,
        tension: 0.4,
      },
      {
        label: 'Complétées',
        data: chartData.completed,
        borderColor: 'rgb(34, 197, 94)',
        backgroundColor: 'rgba(34, 197, 94, 0.1)',
        fill: true,
        tension: 0.4,
      },
      {
        label: 'Échouées',
        data: chartData.failed,
        borderColor: 'rgb(239, 68, 68)',
        backgroundColor: 'rgba(239, 68, 68, 0.1)',
        fill: true,
        tension: 0.4,
      },
    ],
  };

  // Configuration du graphique de taux de réussite
  const successRateChartData = {
    labels: chartData.labels,
    datasets: [
      {
        label: 'Taux de Réussite (%)',
        data: chartData.successRate,
        backgroundColor: 'rgba(34, 197, 94, 0.8)',
        borderColor: 'rgb(34, 197, 94)',
        borderWidth: 1,
      },
    ],
  };

  // Configuration du graphique temps de traitement
  const processingTimeChartData = {
    labels: chartData.labels,
    datasets: [
      {
        label: 'Temps Moyen (s)',
        data: chartData.avgProcessingTime,
        backgroundColor: 'rgba(147, 51, 234, 0.8)',
        borderColor: 'rgb(147, 51, 234)',
        borderWidth: 1,
      },
    ],
  };

  // Configuration du graphique Premium vs Standard
  const premiumChartData = {
    labels: chartData.labels,
    datasets: [
      {
        label: 'Demandes Premium',
        data: chartData.premiumRequests,
        backgroundColor: 'rgba(251, 191, 36, 0.8)',
        borderColor: 'rgb(251, 191, 36)',
        borderWidth: 1,
      },
      {
        label: 'Demandes Standard',
        data: chartData.totalRequests.map((total, i) => 
          total - (chartData.premiumRequests[i] || 0)
        ),
        backgroundColor: 'rgba(148, 163, 184, 0.8)',
        borderColor: 'rgb(148, 163, 184)',
        borderWidth: 1,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom' as const,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-muted-foreground">Chargement des métriques...</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* En-tête */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Dashboard de Métriques</h1>
          <p className="text-muted-foreground mt-1">
            Analyse des performances de la queue musicale
          </p>
        </div>
        <div className="flex items-center gap-2">
          <select
            value={days}
            onChange={(e) => setDays(Number(e.target.value))}
            className="px-4 py-2 border rounded-lg"
          >
            <option value={7}>7 jours</option>
            <option value={14}>14 jours</option>
            <option value={30}>30 jours</option>
          </select>
          <Button onClick={handleExportCSV} variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export CSV
          </Button>
        </div>
      </div>

      {/* Statistiques globales */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <TrendingUp className="h-4 w-4" />
              Total Demandes
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{globalStats.totalRequests}</div>
            <p className="text-xs text-muted-foreground mt-1">
              {globalStats.totalCompleted} complétées
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-green-500" />
              Taux de Réussite
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{globalStats.avgSuccessRate}%</div>
            <p className="text-xs text-muted-foreground mt-1">
              {globalStats.totalFailed} échouées
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <Crown className="h-4 w-4 text-yellow-500" />
              Demandes Premium
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{globalStats.totalPremiumRequests}</div>
            <p className="text-xs text-muted-foreground mt-1">
              {Math.round((globalStats.totalPremiumRequests / globalStats.totalRequests) * 100)}% du total
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <Clock className="h-4 w-4" />
              Temps Moyen
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{globalStats.avgProcessingTime}s</div>
            <p className="text-xs text-muted-foreground mt-1">
              Par génération
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Graphique d'évolution */}
      <Card>
        <CardHeader>
          <CardTitle>Évolution des Demandes</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[300px]">
            <Line data={evolutionChartData} options={chartOptions} />
          </div>
        </CardContent>
      </Card>

      {/* Graphiques secondaires */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Taux de Réussite</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[250px]">
              <Bar data={successRateChartData} options={chartOptions} />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Temps de Traitement</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[250px]">
              <Bar data={processingTimeChartData} options={chartOptions} />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Graphique Premium vs Standard */}
      <Card>
        <CardHeader>
          <CardTitle>Répartition Premium / Standard</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[300px]">
            <Bar 
              data={premiumChartData} 
              options={{
                ...chartOptions,
                plugins: {
                  ...chartOptions.plugins,
                  legend: {
                    position: 'bottom' as const,
                  },
                },
                scales: {
                  ...chartOptions.scales,
                  x: {
                    stacked: true,
                  },
                  y: {
                    stacked: true,
                    beginAtZero: true,
                  },
                },
              }} 
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
