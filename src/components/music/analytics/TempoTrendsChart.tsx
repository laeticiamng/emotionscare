/**
 * Graphique des tendances de tempo
 */

import React, { useEffect, useState } from 'react';
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
  ChartOptions,
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import { getUserHistory } from '@/services/music/history-service';
import { Skeleton } from '@/components/ui/skeleton';
import { logger } from '@/lib/logger';
import { format, subDays, parseISO } from 'date-fns';
import { fr } from 'date-fns/locale';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler);

interface TempoTrendsChartProps {
  height?: number;
}

export const TempoTrendsChart: React.FC<TempoTrendsChartProps> = ({ height = 300 }) => {
  const [chartData, setChartData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setIsLoading(true);
      
      const history = await getUserHistory(500);

      // Grouper par jour et calculer le tempo moyen
      const tempoByDay: Record<string, number[]> = {};
      
      history.forEach(entry => {
        const bpm = entry.metadata?.bpm || entry.metadata?.tempo || null;
        if (bpm && entry.played_at) {
          const day = format(parseISO(entry.played_at), 'yyyy-MM-dd');
          if (!tempoByDay[day]) {
            tempoByDay[day] = [];
          }
          tempoByDay[day].push(bpm);
        }
      });

      // Calculer les moyennes pour les 30 derniers jours
      const last30Days = Array.from({ length: 30 }, (_, i) => {
        const date = subDays(new Date(), 29 - i);
        return format(date, 'yyyy-MM-dd');
      });

      const avgTempos = last30Days.map(day => {
        const tempos = tempoByDay[day] || [];
        if (tempos.length === 0) return null;
        return Math.round(tempos.reduce((a, b) => a + b, 0) / tempos.length);
      });

      setChartData({
        labels: last30Days.map(day => format(parseISO(day), 'd MMM', { locale: fr })),
        datasets: [
          {
            label: 'Tempo moyen (BPM)',
            data: avgTempos,
            borderColor: 'rgba(236, 72, 153, 1)',
            backgroundColor: 'rgba(236, 72, 153, 0.1)',
            borderWidth: 2,
            fill: true,
            tension: 0.4,
            pointRadius: 3,
            pointHoverRadius: 6,
            spanGaps: true,
          },
        ],
      });

      logger.info('Tempo trends chart loaded', { daysWithData: avgTempos.filter(t => t !== null).length }, 'MUSIC');
    } catch (error) {
      logger.error('Failed to load tempo trends', error as Error, 'MUSIC');
    } finally {
      setIsLoading(false);
    }
  };

  const options: ChartOptions<'line'> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        callbacks: {
          label: (context) => {
            const value = context.parsed.y;
            return value ? `${value} BPM` : 'Pas de données';
          },
        },
      },
    },
    scales: {
      x: {
        grid: {
          display: false,
        },
        ticks: {
          color: 'hsl(var(--muted-foreground))',
          font: {
            size: 10,
          },
          maxRotation: 45,
          minRotation: 45,
        },
      },
      y: {
        beginAtZero: false,
        min: 60,
        max: 180,
        grid: {
          color: 'hsl(var(--border))',
        },
        ticks: {
          color: 'hsl(var(--muted-foreground))',
          font: {
            size: 11,
          },
          callback: (value) => `${value} BPM`,
        },
      },
    },
  };

  if (isLoading) {
    return <Skeleton className="w-full" style={{ height }} />;
  }

  if (!chartData) {
    return (
      <div className="flex items-center justify-center" style={{ height }}>
        <p className="text-muted-foreground">Aucune donnée disponible</p>
      </div>
    );
  }

  return (
    <div style={{ height }}>
      <Line data={chartData} options={options} />
    </div>
  );
};
