import React, { useMemo, useState } from 'react';
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
import { Badge } from '@/components/ui/badge';
import { TrendingUp, Video, Mic, FileText } from 'lucide-react';

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

type SourceKey = 'video' | 'text' | 'voice' | 'total';
type SourceInstrument = 'scan_camera' | 'SAM' | 'voice' | 'scan_sliders';

const fetchMultiSourceHistory = async (days = 30): Promise<ScanData[]> => {
  const { data: userData } = await supabase.auth.getUser();
  if (!userData?.user) return [];

  const since = new Date();
  since.setDate(since.getDate() - days);

  const { data, error } = await supabase
    .from('clinical_signals')
    .select('created_at, source_instrument, metadata')
    .eq('user_id', userData.user.id)
    .in('source_instrument', ['SAM', 'scan_camera', 'scan_sliders', 'voice'])
    .gte('created_at', since.toISOString())
    .order('created_at', { ascending: true });

  if (error) throw error;

  return (data || []).map((item): ScanData => {
    const metadata = item.metadata as Record<string, unknown> | null;
    return {
      created_at: item.created_at,
      source_instrument: item.source_instrument,
      valence: (metadata?.valence as number) ?? 50,
      arousal: (metadata?.arousal as number) ?? 50,
    };
  });
};

export const MultiSourceChart: React.FC = () => {
  const [visibleSources, setVisibleSources] = useState<Record<SourceKey, boolean>>({
    video: true,
    text: true,
    voice: true,
    total: true,
  });

  const { data: scans, isLoading } = useQuery({
    queryKey: ['multi-source-history'],
    queryFn: () => fetchMultiSourceHistory(30),
    staleTime: 60_000,
  });

  const toggleSource = (source: SourceKey) => {
    setVisibleSources(prev => ({ ...prev, [source]: !prev[source] }));
  };

  const chartData = useMemo(() => {
    if (!scans || scans.length === 0) return null;

    // Grouper par source
    const bySource: Record<SourceInstrument, ScanData[]> = {
      scan_camera: [],
      SAM: [],
      voice: [],
      scan_sliders: [],
    };

    scans.forEach(scan => {
      const instrument = scan.source_instrument as SourceInstrument;
      if (bySource[instrument]) {
        bySource[instrument].push(scan);
      }
    });

    // Créer les labels (dates uniques)
    const allDates = scans.map(s => new Date(s.created_at).toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit'
    }));
    const uniqueDates = Array.from(new Set(allDates));

    // Calculer moyenne valence par source et par date
    const allDatasets: Array<{
      key: SourceKey;
      label: string;
      data: (number | null)[];
      borderColor: string;
      backgroundColor: string;
      tension: number;
      borderWidth: number;
      borderDash?: number[];
    }> = [
      {
        key: 'video',
        label: 'Vidéo',
        data: uniqueDates.map(date => {
          const filtered = bySource.scan_camera.filter(s => 
            new Date(s.created_at).toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit' }) === date
          );
          if (filtered.length === 0) return null;
          return filtered.reduce((sum, s) => sum + s.valence, 0) / filtered.length;
        }),
        borderColor: 'hsl(221, 83%, 53%)',
        backgroundColor: 'hsla(221, 83%, 53%, 0.1)',
        tension: 0.4,
        borderWidth: 2,
      },
      {
        key: 'text',
        label: 'Texte',
        data: uniqueDates.map(date => {
          const filtered = bySource.SAM.filter(s => 
            new Date(s.created_at).toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit' }) === date
          );
          if (filtered.length === 0) return null;
          return filtered.reduce((sum, s) => sum + s.valence, 0) / filtered.length;
        }),
        borderColor: 'hsl(142, 76%, 36%)',
        backgroundColor: 'hsla(142, 76%, 36%, 0.1)',
        tension: 0.4,
        borderWidth: 2,
      },
      {
        key: 'voice',
        label: 'Vocal',
        data: uniqueDates.map(date => {
          const filtered = bySource.voice.filter(s => 
            new Date(s.created_at).toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit' }) === date
          );
          if (filtered.length === 0) return null;
          return filtered.reduce((sum, s) => sum + s.valence, 0) / filtered.length;
        }),
        borderColor: 'hsl(271, 81%, 56%)',
        backgroundColor: 'hsla(271, 81%, 56%, 0.1)',
        tension: 0.4,
        borderWidth: 2,
      },
      {
        key: 'total',
        label: 'Total',
        data: uniqueDates.map(date => {
          const filtered = scans.filter(s => 
            new Date(s.created_at).toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit' }) === date
          );
          if (filtered.length === 0) return null;
          return filtered.reduce((sum, s) => sum + s.valence, 0) / filtered.length;
        }),
        borderColor: 'hsl(47, 96%, 53%)',
        backgroundColor: 'hsla(47, 96%, 53%, 0.1)',
        tension: 0.4,
        borderWidth: 3,
        borderDash: [5, 5],
      },
    ];

    const datasets = allDatasets
      .filter(ds => visibleSources[ds.key] && ds.data.some(v => v !== null))
      .map(({ key, ...rest }) => rest);

    return {
      labels: uniqueDates,
      datasets,
    };
  }, [scans, visibleSources]);

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
        <div className="flex flex-wrap gap-2 mt-4">
          <Badge
            variant={visibleSources.video ? "default" : "outline"}
            className="cursor-pointer gap-1.5"
            onClick={() => toggleSource('video')}
          >
            <Video className="h-3.5 w-3.5" />
            Vidéo
          </Badge>
          <Badge
            variant={visibleSources.text ? "default" : "outline"}
            className="cursor-pointer gap-1.5"
            onClick={() => toggleSource('text')}
            style={visibleSources.text ? { backgroundColor: 'hsl(142, 76%, 36%)', borderColor: 'hsl(142, 76%, 36%)' } : {}}
          >
            <FileText className="h-3.5 w-3.5" />
            Texte
          </Badge>
          <Badge
            variant={visibleSources.voice ? "default" : "outline"}
            className="cursor-pointer gap-1.5"
            onClick={() => toggleSource('voice')}
            style={visibleSources.voice ? { backgroundColor: 'hsl(271, 81%, 56%)', borderColor: 'hsl(271, 81%, 56%)' } : {}}
          >
            <Mic className="h-3.5 w-3.5" />
            Vocal
          </Badge>
          <Badge
            variant={visibleSources.total ? "default" : "outline"}
            className="cursor-pointer gap-1.5"
            onClick={() => toggleSource('total')}
            style={visibleSources.total ? { backgroundColor: 'hsl(47, 96%, 53%)', borderColor: 'hsl(47, 96%, 53%)', color: 'hsl(222, 84%, 5%)' } : {}}
          >
            <TrendingUp className="h-3.5 w-3.5" />
            Total
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="h-[350px]">
          <Line data={chartData} options={options} />
        </div>
      </CardContent>
    </Card>
  );
};
