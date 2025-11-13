// @ts-nocheck
/**
 * FocusAnalyticsDashboard - Tableau de bord analytics Focus Flow
 */

import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  TrendingUp, 
  Clock, 
  Award, 
  Calendar,
  FileDown,
  Activity,
  Zap,
  Target
} from 'lucide-react';
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
  ArcElement,
} from 'chart.js';
import { Line, Bar, Doughnut } from 'react-chartjs-2';
import { useFocusAnalytics } from '@/hooks/useFocusAnalytics';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

export const FocusAnalyticsDashboard: React.FC = () => {
  const { sessions, summary, loading, exportPDF } = useFocusAnalytics();

  // Données pour graphique performance par mode
  const modePerformanceData = useMemo(() => {
    const modes = ['work', 'study', 'meditation'];
    const data = modes.map(mode => {
      const modeSessions = sessions.filter(s => s.mode === mode && s.completed);
      const avg = modeSessions.reduce((sum, s) => sum + (s.performance_score || 0), 0) / modeSessions.length;
      return isNaN(avg) ? 0 : avg;
    });

    return {
      labels: ['💼 Work', '📚 Study', '🧘 Meditation'],
      datasets: [
        {
          label: 'Performance moyenne',
          data,
          backgroundColor: ['rgba(59, 130, 246, 0.8)', 'rgba(16, 185, 129, 0.8)', 'rgba(139, 92, 246, 0.8)'],
          borderColor: ['rgb(59, 130, 246)', 'rgb(16, 185, 129)', 'rgb(139, 92, 246)'],
          borderWidth: 2,
        },
      ],
    };
  }, [sessions]);

  // Heatmap heures optimales
  const hourHeatmapData = useMemo(() => {
    const hours = Array.from({ length: 24 }, (_, i) => i);
    const data = hours.map(hour => {
      const hourSessions = sessions.filter(s => s.hour_of_day === hour && s.completed);
      const avg = hourSessions.reduce((sum, s) => sum + (s.performance_score || 0), 0) / hourSessions.length;
      return isNaN(avg) ? 0 : avg;
    });

    return {
      labels: hours.map(h => `${h}h`),
      datasets: [
        {
          label: 'Performance par heure',
          data,
          borderColor: 'rgb(249, 115, 22)',
          backgroundColor: 'rgba(249, 115, 22, 0.2)',
          fill: true,
          tension: 0.4,
        },
      ],
    };
  }, [sessions]);

  // Corrélation tempo/performance
  const tempoCorrelationData = useMemo(() => {
    const validSessions = sessions.filter(s => s.avg_tempo && s.performance_score && s.completed);
    
    return {
      labels: validSessions.map(s => `${s.avg_tempo} BPM`),
      datasets: [
        {
          label: 'Performance vs Tempo',
          data: validSessions.map(s => ({ x: s.avg_tempo, y: s.performance_score })),
          backgroundColor: 'rgba(236, 72, 153, 0.6)',
          borderColor: 'rgb(236, 72, 153)',
          pointRadius: 6,
        },
      ],
    };
  }, [sessions]);

  // Distribution des modes
  const modeDistributionData = useMemo(() => {
    const modes = ['work', 'study', 'meditation'];
    const data = modes.map(mode => sessions.filter(s => s.mode === mode).length);

    return {
      labels: ['💼 Work', '📚 Study', '🧘 Meditation'],
      datasets: [
        {
          data,
          backgroundColor: [
            'rgba(59, 130, 246, 0.8)',
            'rgba(16, 185, 129, 0.8)',
            'rgba(139, 92, 246, 0.8)',
          ],
          borderColor: ['rgb(59, 130, 246)', 'rgb(16, 185, 129)', 'rgb(139, 92, 246)'],
          borderWidth: 2,
        },
      ],
    };
  }, [sessions]);

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: true,
        labels: {
          color: 'hsl(var(--foreground))',
        },
      },
    },
    scales: {
      y: {
        ticks: { color: 'hsl(var(--muted-foreground))' },
        grid: { color: 'hsl(var(--border))' },
      },
      x: {
        ticks: { color: 'hsl(var(--muted-foreground))' },
        grid: { color: 'hsl(var(--border))' },
      },
    },
  };

  const dayNames = ['Dimanche', 'Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi'];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold flex items-center gap-2">
            <Activity className="h-8 w-8 text-primary" />
            Analytics Focus Flow
          </h2>
          <p className="text-muted-foreground mt-1">Analyse approfondie de vos sessions de productivité</p>
        </div>
        <Button onClick={exportPDF} className="gap-2">
          <FileDown className="h-4 w-4" />
          Export PDF
        </Button>
      </div>

      {/* KPIs */}
      {summary && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="bg-gradient-to-br from-blue-500/10 to-blue-600/10 border-blue-500/20">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Sessions totales</p>
                  <p className="text-3xl font-bold mt-1">{summary.totalSessions}</p>
                </div>
                <Calendar className="h-10 w-10 text-blue-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-green-500/10 to-green-600/10 border-green-500/20">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Performance moy.</p>
                  <p className="text-3xl font-bold mt-1">{summary.avgPerformance}%</p>
                </div>
                <TrendingUp className="h-10 w-10 text-green-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-orange-500/10 to-orange-600/10 border-orange-500/20">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Durée moyenne</p>
                  <p className="text-3xl font-bold mt-1">{summary.avgDuration}min</p>
                </div>
                <Clock className="h-10 w-10 text-orange-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-purple-500/10 to-purple-600/10 border-purple-500/20">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Taux complétion</p>
                  <p className="text-3xl font-bold mt-1">
                    {Math.round((summary.completedSessions / summary.totalSessions) * 100)}%
                  </p>
                </div>
                <Award className="h-10 w-10 text-purple-500" />
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Insights personnalisés */}
      {summary && (
        <Card className="bg-gradient-to-br from-primary/5 to-secondary/5 border-primary/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="h-5 w-5 text-yellow-500" />
              Suggestions personnalisées
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-start gap-3">
              <Target className="h-5 w-5 text-primary mt-0.5" />
              <div>
                <p className="font-medium">Meilleure heure de concentration</p>
                <p className="text-sm text-muted-foreground">
                  Vos performances sont optimales vers {summary.bestHour}h. Planifiez vos tâches importantes à ce moment.
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Target className="h-5 w-5 text-primary mt-0.5" />
              <div>
                <p className="font-medium">Jour optimal</p>
                <p className="text-sm text-muted-foreground">
                  Vous êtes plus productif le {dayNames[summary.bestDay]}. Concentrez vos efforts ce jour-là.
                </p>
              </div>
            </div>
            {summary.tempoCorrelation !== 0 && (
              <div className="flex items-start gap-3">
                <Target className="h-5 w-5 text-primary mt-0.5" />
                <div>
                  <p className="font-medium">Impact du tempo musical</p>
                  <p className="text-sm text-muted-foreground">
                    {summary.tempoCorrelation > 0 
                      ? `Les tempos plus élevés améliorent vos performances (corrélation: ${(summary.tempoCorrelation * 100).toFixed(0)}%)`
                      : `Les tempos plus calmes sont meilleurs pour vous (corrélation: ${(Math.abs(summary.tempoCorrelation) * 100).toFixed(0)}%)`
                    }
                  </p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Graphiques */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Performance par mode */}
        <Card>
          <CardHeader>
            <CardTitle>Performance par mode</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <Bar data={modePerformanceData} options={chartOptions} />
            </div>
          </CardContent>
        </Card>

        {/* Distribution des modes */}
        <Card>
          <CardHeader>
            <CardTitle>Distribution des sessions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] flex items-center justify-center">
              <Doughnut data={modeDistributionData} options={{ responsive: true, maintainAspectRatio: false }} />
            </div>
          </CardContent>
        </Card>

        {/* Heatmap heures */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Heatmap - Heures optimales de concentration</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <Line data={hourHeatmapData} options={chartOptions} />
            </div>
          </CardContent>
        </Card>

        {/* Corrélation tempo/performance */}
        {tempoCorrelationData.datasets[0].data.length > 0 && (
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>Corrélation Tempo / Performance</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <Line 
                  data={tempoCorrelationData} 
                  options={{
                    ...chartOptions,
                    scales: {
                      x: { title: { display: true, text: 'Tempo (BPM)', color: 'hsl(var(--foreground))' } },
                      y: { title: { display: true, text: 'Performance', color: 'hsl(var(--foreground))' } },
                    },
                  }} 
                />
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};
