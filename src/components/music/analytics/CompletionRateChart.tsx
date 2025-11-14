/**
 * Graphique du taux de complétion par cohorte
 */

import React, { useEffect, useState } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ChartOptions,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';
import { getUserHistory } from '@/services/music/history-service';
import { Skeleton } from '@/components/ui/skeleton';
import { logger } from '@/lib/logger';
import { format, subWeeks, parseISO, isAfter, isBefore } from 'date-fns';
import { fr } from 'date-fns/locale';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

interface CompletionRateChartProps {
  height?: number;
}

export const CompletionRateChart: React.FC<CompletionRateChartProps> = ({ height = 300 }) => {
  const [chartData, setChartData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setIsLoading(true);
      
      const history = await getUserHistory(500);

      // Définir les cohortes (semaines)
      const cohorts = Array.from({ length: 12 }, (_, i) => {
        const weekStart = subWeeks(new Date(), 11 - i);
        const weekEnd = subWeeks(new Date(), 10 - i);
        return {
          label: format(weekStart, "'S'w", { locale: fr }),
          start: weekStart,
          end: weekEnd,
        };
      });

      // Calculer le taux de complétion par cohorte
      const completionRates = cohorts.map(cohort => {
        const cohortEntries = history.filter(entry => {
          const playedAt = parseISO(entry.played_at);
          return isAfter(playedAt, cohort.start) && isBefore(playedAt, cohort.end);
        });

        if (cohortEntries.length === 0) return 0;

        const validCompletions = cohortEntries.filter(e => e.completion_rate !== null);
        if (validCompletions.length === 0) return 0;

        const avgCompletion = validCompletions.reduce((sum, e) => sum + (e.completion_rate || 0), 0) / validCompletions.length;
        return Math.round(avgCompletion);
      });

      setChartData({
        labels: cohorts.map(c => c.label),
        datasets: [
          {
            label: 'Taux de complétion moyen (%)',
            data: completionRates,
            backgroundColor: completionRates.map(rate => {
              if (rate >= 80) return 'rgba(34, 197, 94, 0.6)';
              if (rate >= 60) return 'rgba(249, 115, 22, 0.6)';
              return 'rgba(239, 68, 68, 0.6)';
            }),
            borderColor: completionRates.map(rate => {
              if (rate >= 80) return 'rgba(34, 197, 94, 1)';
              if (rate >= 60) return 'rgba(249, 115, 22, 1)';
              return 'rgba(239, 68, 68, 1)';
            }),
            borderWidth: 2,
            borderRadius: 6,
          },
        ],
      });

      logger.info('Completion rate chart loaded', { cohortCount: cohorts.length }, 'MUSIC');
    } catch (error) {
      logger.error('Failed to load completion rate', error as Error, 'MUSIC');
    } finally {
      setIsLoading(false);
    }
  };

  const options: ChartOptions<'bar'> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        callbacks: {
          label: (context) => {
            return `${context.parsed.y}% complété en moyenne`;
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
            size: 11,
          },
        },
      },
      y: {
        beginAtZero: true,
        max: 100,
        grid: {
          color: 'hsl(var(--border))',
        },
        ticks: {
          color: 'hsl(var(--muted-foreground))',
          font: {
            size: 11,
          },
          callback: (value) => `${value}%`,
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
      <Bar data={chartData} options={options} />
    </div>
  );
};
