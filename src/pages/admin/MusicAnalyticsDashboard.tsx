/**
 * MusicAnalyticsDashboard - Tableau de bord analytics musique
 * Métriques temps réel avec Chart.js et exports CSV
 */

import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Download, 
  Music2, 
  TrendingUp, 
  Clock, 
  Users,
  CheckCircle2,
  BarChart3
} from 'lucide-react';
import { Line, Bar, Pie } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';
import { supabase } from '@/integrations/supabase/client';
import { logger } from '@/lib/logger';
import { toast } from 'sonner';

// Enregistrer les composants Chart.js
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

interface MusicMetrics {
  totalGenerations: number;
  successRate: number;
  avgDuration: number;
  emotionDistribution: Record<string, number>;
  dailyGenerations: Array<{ date: string; count: number }>;
  emotionEvolution: Array<{ emotion: string; before: number; after: number }>;
  journeyStats: {
    total: number;
    completed: number;
    active: number;
    avgCompletion: number;
  };
}

export const MusicAnalyticsDashboard: React.FC = () => {
  const [metrics, setMetrics] = useState<MusicMetrics | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [timeRange, setTimeRange] = useState<'7d' | '30d' | '90d'>('30d');

  useEffect(() => {
    loadMetrics();
  }, [timeRange]);

  const loadMetrics = async () => {
    setIsLoading(true);
    try {
      const daysAgo = timeRange === '7d' ? 7 : timeRange === '30d' ? 30 : 90;
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - daysAgo);

      // Récupérer toutes les métriques en parallèle
      const [tracksRes, journeysRes, sessionsRes] = await Promise.all([
        supabase
          .from('generated_music_tracks')
          .select('*')
          .gte('created_at', startDate.toISOString()),
        supabase
          .from('music_journeys')
          .select('*')
          .gte('created_at', startDate.toISOString()),
        supabase
          .from('music_therapy_sessions')
          .select('*')
          .gte('created_at', startDate.toISOString())
      ]);

      const tracks = tracksRes.data || [];
      const journeys = journeysRes.data || [];
      const sessions = sessionsRes.data || [];

      // Calculer les métriques
      const totalGenerations = tracks.length;
      const successfulTracks = tracks.filter(t => t.generation_status === 'complete').length;
      const successRate = totalGenerations > 0 ? (successfulTracks / totalGenerations) * 100 : 0;

      const durations = tracks.filter(t => t.duration_seconds).map(t => t.duration_seconds || 0);
      const avgDuration = durations.length > 0 
        ? durations.reduce((a, b) => a + b, 0) / durations.length 
        : 0;

      // Distribution par émotion
      const emotionDist: Record<string, number> = {};
      tracks.forEach(track => {
        const emotion = track.emotion_detected || 'unknown';
        emotionDist[emotion] = (emotionDist[emotion] || 0) + 1;
      });

      // Générations quotidiennes
      const dailyMap = new Map<string, number>();
      tracks.forEach(track => {
        const date = new Date(track.created_at).toISOString().split('T')[0];
        dailyMap.set(date, (dailyMap.get(date) || 0) + 1);
      });
      const dailyGenerations = Array.from(dailyMap.entries())
        .map(([date, count]) => ({ date, count }))
        .sort((a, b) => a.date.localeCompare(b.date));

      // Évolution émotionnelle (avant/après sessions)
      const emotionEvol: Record<string, { before: number; after: number }> = {};
      sessions.forEach(session => {
        const before = session.emotion_before;
        const after = session.emotion_after || before;
        
        if (!emotionEvol[before]) emotionEvol[before] = { before: 0, after: 0 };
        emotionEvol[before].before++;
        
        if (after && after !== before) {
          if (!emotionEvol[after]) emotionEvol[after] = { before: 0, after: 0 };
          emotionEvol[after].after++;
        }
      });

      const emotionEvolution = Object.entries(emotionEvol).map(([emotion, data]) => ({
        emotion,
        ...data
      }));

      // Stats des parcours
      const completedJourneys = journeys.filter(j => j.status === 'completed').length;
      const activeJourneys = journeys.filter(j => j.status === 'active').length;
      const avgCompletion = journeys.length > 0
        ? journeys.reduce((sum, j) => sum + (j.progress_percentage || 0), 0) / journeys.length
        : 0;

      setMetrics({
        totalGenerations,
        successRate,
        avgDuration,
        emotionDistribution: emotionDist,
        dailyGenerations,
        emotionEvolution,
        journeyStats: {
          total: journeys.length,
          completed: completedJourneys,
          active: activeJourneys,
          avgCompletion
        }
      });

    } catch (error) {
      logger.error('❌ Failed to load music metrics', error as Error, 'MUSIC');
      toast.error('Erreur lors du chargement des métriques');
    } finally {
      setIsLoading(false);
    }
  };

  const exportToCSV = async () => {
    try {
      const { data: tracks } = await supabase
        .from('generated_music_tracks')
        .select('*')
        .order('created_at', { ascending: false });

      if (!tracks) throw new Error('No data');

      // Créer le CSV
      const headers = ['Date', 'Émotion', 'Statut', 'Durée (s)', 'User ID'];
      const rows = tracks.map(t => [
        new Date(t.created_at).toLocaleDateString(),
        t.emotion_detected || 'N/A',
        t.generation_status,
        t.duration_seconds || 0,
        t.user_id
      ]);

      const csv = [
        headers.join(','),
        ...rows.map(row => row.join(','))
      ].join('\n');

      // Télécharger
      const blob = new Blob([csv], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `music-analytics-${new Date().toISOString().split('T')[0]}.csv`;
      a.click();

      toast.success('Export CSV réussi');
      logger.info('📊 CSV exported', {}, 'MUSIC');

    } catch (error) {
      logger.error('❌ CSV export failed', error as Error, 'MUSIC');
      toast.error('Erreur lors de l\'export CSV');
    }
  };

  if (isLoading || !metrics) {
    return (
      <div className="flex items-center justify-center h-96">
        <Music2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }

  // Préparer les données pour les graphiques
  const emotionChartData = {
    labels: Object.keys(metrics.emotionDistribution),
    datasets: [{
      label: 'Compositions par émotion',
      data: Object.values(metrics.emotionDistribution),
      backgroundColor: [
        'rgba(239, 68, 68, 0.6)',
        'rgba(249, 115, 22, 0.6)',
        'rgba(245, 158, 11, 0.6)',
        'rgba(16, 185, 129, 0.6)',
        'rgba(6, 182, 212, 0.6)',
        'rgba(99, 102, 241, 0.6)',
        'rgba(139, 92, 246, 0.6)'
      ]
    }]
  };

  const dailyChartData = {
    labels: metrics.dailyGenerations.map(d => new Date(d.date).toLocaleDateString()),
    datasets: [{
      label: 'Générations quotidiennes',
      data: metrics.dailyGenerations.map(d => d.count),
      borderColor: 'rgb(99, 102, 241)',
      backgroundColor: 'rgba(99, 102, 241, 0.1)',
      fill: true,
      tension: 0.4
    }]
  };

  const evolutionChartData = {
    labels: metrics.emotionEvolution.map(e => e.emotion),
    datasets: [
      {
        label: 'Avant session',
        data: metrics.emotionEvolution.map(e => e.before),
        backgroundColor: 'rgba(239, 68, 68, 0.6)'
      },
      {
        label: 'Après session',
        data: metrics.emotionEvolution.map(e => e.after),
        backgroundColor: 'rgba(16, 185, 129, 0.6)'
      }
    ]
  };

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <BarChart3 className="h-8 w-8 text-primary" />
            Analytics Musicothérapie
          </h1>
          <p className="text-muted-foreground mt-1">
            Métriques et insights temps réel
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Tabs value={timeRange} onValueChange={(v) => setTimeRange(v as any)}>
            <TabsList>
              <TabsTrigger value="7d">7 jours</TabsTrigger>
              <TabsTrigger value="30d">30 jours</TabsTrigger>
              <TabsTrigger value="90d">90 jours</TabsTrigger>
            </TabsList>
          </Tabs>
          <Button onClick={exportToCSV} variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export CSV
          </Button>
        </div>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Générations
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{metrics.totalGenerations}</div>
            <Badge variant="secondary" className="mt-2">
              <TrendingUp className="h-3 w-3 mr-1" />
              {timeRange}
            </Badge>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Taux de succès
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{metrics.successRate.toFixed(1)}%</div>
            <Badge variant={metrics.successRate > 90 ? 'default' : 'secondary'} className="mt-2">
              <CheckCircle2 className="h-3 w-3 mr-1" />
              {metrics.successRate > 90 ? 'Excellent' : 'Bon'}
            </Badge>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Durée moyenne
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{Math.round(metrics.avgDuration)}s</div>
            <Badge variant="secondary" className="mt-2">
              <Clock className="h-3 w-3 mr-1" />
              Par track
            </Badge>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Parcours actifs
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{metrics.journeyStats.active}</div>
            <Badge variant="secondary" className="mt-2">
              <Users className="h-3 w-3 mr-1" />
              {metrics.journeyStats.completed} terminés
            </Badge>
          </CardContent>
        </Card>
      </div>

      {/* Graphiques */}
      <Tabs defaultValue="emotions" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="emotions">Émotions</TabsTrigger>
          <TabsTrigger value="timeline">Timeline</TabsTrigger>
          <TabsTrigger value="evolution">Évolution</TabsTrigger>
        </TabsList>

        <TabsContent value="emotions" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Distribution par émotion</CardTitle>
                <CardDescription>
                  Répartition des compositions générées
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Pie data={emotionChartData} options={{ maintainAspectRatio: true }} />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Compositions par émotion</CardTitle>
                <CardDescription>
                  Volume de génération par type émotionnel
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Bar data={emotionChartData} options={{ maintainAspectRatio: true }} />
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="timeline">
          <Card>
            <CardHeader>
              <CardTitle>Générations quotidiennes</CardTitle>
              <CardDescription>
                Évolution du nombre de compositions dans le temps
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Line data={dailyChartData} options={{ maintainAspectRatio: true }} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="evolution">
          <Card>
            <CardHeader>
              <CardTitle>Évolution émotionnelle</CardTitle>
              <CardDescription>
                Impact des sessions musicales sur l'état émotionnel
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Bar 
                data={evolutionChartData} 
                options={{ 
                  maintainAspectRatio: true,
                  scales: {
                    x: { stacked: false },
                    y: { stacked: false }
                  }
                }} 
              />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Stats des parcours */}
      <Card>
        <CardHeader>
          <CardTitle>Statistiques des parcours Journey</CardTitle>
          <CardDescription>
            Performance des parcours musicaux guidés
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">Total créés</p>
              <p className="text-2xl font-bold">{metrics.journeyStats.total}</p>
            </div>
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">Taux de complétion</p>
              <p className="text-2xl font-bold">
                {metrics.journeyStats.total > 0 
                ? ((metrics.journeyStats.completed / metrics.journeyStats.total) * 100).toFixed(1)
                : 0}%
            </p>
          </div>
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">Progression moyenne</p>
            <p className="text-2xl font-bold">
              {metrics.journeyStats.avgCompletion.toFixed(1)}%
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  </div>
  );
};

export default MusicAnalyticsDashboard;
