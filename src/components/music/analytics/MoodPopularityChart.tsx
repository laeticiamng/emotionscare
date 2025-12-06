/**
 * Graphique de popularité des moods
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
import { getUserPreferences } from '@/services/music/preferences-service';
import { Skeleton } from '@/components/ui/skeleton';
import { logger } from '@/lib/logger';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

interface MoodPopularityChartProps {
  height?: number;
}

export const MoodPopularityChart: React.FC<MoodPopularityChartProps> = ({ height = 300 }) => {
  const [chartData, setChartData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setIsLoading(true);
      
      const [history, preferences] = await Promise.all([
        getUserHistory(200),
        getUserPreferences(),
      ]);

      // Compter les moods depuis l'historique
      const moodCounts: Record<string, number> = {};
      
      history.forEach(entry => {
        if (entry.mood) {
          moodCounts[entry.mood] = (moodCounts[entry.mood] || 0) + 1;
        }
      });

      // Ajouter les moods préférés (pondérés +3)
      if (preferences?.favorite_moods) {
        preferences.favorite_moods.forEach(mood => {
          moodCounts[mood] = (moodCounts[mood] || 0) + 3;
        });
      }

      // Préparer les données pour le graphique
      const sortedMoods = Object.entries(moodCounts)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 10); // Top 10 moods

      setChartData({
        labels: sortedMoods.map(([mood]) => mood.charAt(0).toUpperCase() + mood.slice(1)),
        datasets: [
          {
            label: 'Nombre d\'écoutes',
            data: sortedMoods.map(([, count]) => count),
            backgroundColor: 'rgba(168, 85, 247, 0.6)',
            borderColor: 'rgba(168, 85, 247, 1)',
            borderWidth: 2,
            borderRadius: 8,
          },
        ],
      });

      logger.info('Mood popularity chart loaded', { moodCount: sortedMoods.length }, 'MUSIC');
    } catch (error) {
      logger.error('Failed to load mood popularity', error as Error, 'MUSIC');
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
            return `${context.parsed.y} écoutes`;
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
        grid: {
          color: 'hsl(var(--border))',
        },
        ticks: {
          color: 'hsl(var(--muted-foreground))',
          font: {
            size: 11,
          },
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
