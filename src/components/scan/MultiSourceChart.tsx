// @ts-nocheck
import React, { useMemo } from 'react';
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
  ChartOptions,
} from 'chart.js';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Skeleton } from '@/components/ui/skeleton';
import { TrendingUp } from 'lucide-react';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

interface ScanData {
  created_at: string;
  source_instrument: string;
  valence: number;
  arousal: number;
}

const fetchMultiSourceHistory = async (days = 30) => {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return [];

  const since = new Date();
  since.setDate(since.getDate() - days);

  const { data, error } = await supabase
    .from('clinical_signals')
    .select('created_at, source_instrument, metadata')
    .eq('user_id', user.id)
    .in('source_instrument', ['SAM', 'scan_camera', 'scan_sliders', 'voice'])
    .gte('created_at', since.toISOString())
    .order('created_at', { ascending: true });

  if (error) throw error;

  return (data || []).map((item): ScanData => {
    const metadata = item.metadata as any;
    return {
      created_at: item.created_at,
      source_instrument: item.source_instrument,
      valence: metadata?.valence ?? 50,
      arousal: metadata?.arousal ?? 50,
    };
  });
};

export const MultiSourceChart: React.FC = () => {
  const { data: scans, isLoading } = useQuery({
    queryKey: ['multi-source-history'],
    queryFn: () => fetchMultiSourceHistory(30),
    staleTime: 60_000,
  });

  const chartData = useMemo(() => {
    if (!scans || scans.length === 0) return null;

    // Grouper par source
    const bySource = {
      scan_camera: [] as ScanData[],
      SAM: [] as ScanData[],
      voice: [] as ScanData[],
      scan_sliders: [] as ScanData[],
    };

    scans.forEach(scan => {
      if (bySource[scan.source_instrument]) {
        bySource[scan.source_instrument].push(scan);
      }
    });

    // Créer les labels (dates uniques)
    const allDates = scans.map(s => new Date(s.created_at).toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit'
    }));
    const uniqueDates = Array.from(new Set(allDates));

    // Calculer moyenne valence par source et par date
    const datasets = [
      {
        label: 'Vidéo',
        data: uniqueDates.map(date => {
          const filtered = bySource.scan_camera.filter(s => 
            new Date(s.created_at).toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit' }) === date
          );
          if (filtered.length === 0) return null;
          return filtered.reduce((sum, s) => sum + s.valence, 0) / filtered.length;
        }),
        borderColor: 'rgb(59, 130, 246)',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        tension: 0.4,
        borderWidth: 2,
      },
      {
        label: 'Texte',
        data: uniqueDates.map(date => {
          const filtered = bySource.SAM.filter(s => 
            new Date(s.created_at).toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit' }) === date
          );
          if (filtered.length === 0) return null;
          return filtered.reduce((sum, s) => sum + s.valence, 0) / filtered.length;
        }),
        borderColor: 'rgb(34, 197, 94)',
        backgroundColor: 'rgba(34, 197, 94, 0.1)',
        tension: 0.4,
        borderWidth: 2,
      },
      {
        label: 'Vocal',
        data: uniqueDates.map(date => {
          const filtered = bySource.voice.filter(s => 
            new Date(s.created_at).toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit' }) === date
          );
          if (filtered.length === 0) return null;
          return filtered.reduce((sum, s) => sum + s.valence, 0) / filtered.length;
        }),
        borderColor: 'rgb(168, 85, 247)',
        backgroundColor: 'rgba(168, 85, 247, 0.1)',
        tension: 0.4,
        borderWidth: 2,
      },
      {
        label: 'Total',
        data: uniqueDates.map(date => {
          const filtered = scans.filter(s => 
            new Date(s.created_at).toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit' }) === date
          );
          if (filtered.length === 0) return null;
          return filtered.reduce((sum, s) => sum + s.valence, 0) / filtered.length;
        }),
        borderColor: 'rgb(234, 179, 8)',
        backgroundColor: 'rgba(234, 179, 8, 0.1)',
        tension: 0.4,
        borderWidth: 3,
        borderDash: [5, 5],
      },
    ];

    return {
      labels: uniqueDates,
      datasets: datasets.filter(ds => ds.data.some(v => v !== null)),
    };
  }, [scans]);

  const options: ChartOptions<'line'> = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: {
      mode: 'index',
      intersect: false,
    },
    plugins: {
      legend: {
        position: 'top' as const,
        labels: {
          usePointStyle: true,
          padding: 15,
          color: 'rgb(148, 163, 184)',
        },
      },
      tooltip: {
        backgroundColor: 'rgba(15, 23, 42, 0.95)',
        titleColor: 'rgb(248, 250, 252)',
        bodyColor: 'rgb(226, 232, 240)',
        borderColor: 'rgb(71, 85, 105)',
        borderWidth: 1,
        padding: 12,
        displayColors: true,
        callbacks: {
          label: function(context) {
            let label = context.dataset.label || '';
            if (label) {
              label += ': ';
            }
            if (context.parsed.y !== null) {
              label += Math.round(context.parsed.y) + '%';
            }
            return label;
          }
        }
      },
    },
    scales: {
      y: {
        min: 0,
        max: 100,
        ticks: {
          color: 'rgb(148, 163, 184)',
          callback: (value) => value + '%',
        },
        grid: {
          color: 'rgba(71, 85, 105, 0.2)',
        },
      },
      x: {
        ticks: {
          color: 'rgb(148, 163, 184)',
          maxRotation: 45,
          minRotation: 45,
        },
        grid: {
          color: 'rgba(71, 85, 105, 0.2)',
        },
      },
    },
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-48" />
          <Skeleton className="h-4 w-72" />
        </CardHeader>
        <CardContent>
          <Skeleton className="h-[300px] w-full" />
        </CardContent>
      </Card>
    );
  }

  if (!chartData || scans?.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Évolution multi-sources
          </CardTitle>
          <CardDescription>
            Visualisez l'évolution de vos émotions par type d'analyse
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground text-center py-12">
            Aucune donnée disponible pour afficher le graphique
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TrendingUp className="h-5 w-5" />
          Évolution multi-sources
        </CardTitle>
        <CardDescription>
          Visualisez l'évolution de vos émotions par type d'analyse (30 derniers jours)
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-[350px]">
          <Line data={chartData} options={options} />
        </div>
      </CardContent>
    </Card>
  );
};
