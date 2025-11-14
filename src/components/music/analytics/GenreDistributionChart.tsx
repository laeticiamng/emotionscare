/**
 * Graphique de distribution des genres musicaux
 */

import React, { useEffect, useState } from 'react';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, ChartOptions } from 'chart.js';
import { Pie } from 'react-chartjs-2';
import { getUserHistory } from '@/services/music/history-service';
import { getUserPreferences } from '@/services/music/preferences-service';
import { Skeleton } from '@/components/ui/skeleton';
import { logger } from '@/lib/logger';

ChartJS.register(ArcElement, Tooltip, Legend);

interface GenreDistributionChartProps {
  height?: number;
}

export const GenreDistributionChart: React.FC<GenreDistributionChartProps> = ({ height = 300 }) => {
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

      // Compter les genres depuis l'historique
      const genreCounts: Record<string, number> = {};
      
      history.forEach(entry => {
        const genre = entry.metadata?.genre || entry.emotion || 'autres';
        genreCounts[genre] = (genreCounts[genre] || 0) + 1;
      });

      // Ajouter les genres préférés (pondérés +5)
      if (preferences?.favorite_genres) {
        preferences.favorite_genres.forEach(genre => {
          genreCounts[genre] = (genreCounts[genre] || 0) + 5;
        });
      }

      // Préparer les données pour le graphique
      const sortedGenres = Object.entries(genreCounts)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 8); // Top 8 genres

      const colors = [
        'rgba(59, 130, 246, 0.8)',   // blue
        'rgba(168, 85, 247, 0.8)',   // purple
        'rgba(236, 72, 153, 0.8)',   // pink
        'rgba(249, 115, 22, 0.8)',   // orange
        'rgba(34, 197, 94, 0.8)',    // green
        'rgba(6, 182, 212, 0.8)',    // cyan
        'rgba(251, 191, 36, 0.8)',   // yellow
        'rgba(148, 163, 184, 0.8)',  // gray
      ];

      setChartData({
        labels: sortedGenres.map(([genre]) => genre.charAt(0).toUpperCase() + genre.slice(1)),
        datasets: [
          {
            data: sortedGenres.map(([, count]) => count),
            backgroundColor: colors,
            borderColor: colors.map(c => c.replace('0.8', '1')),
            borderWidth: 2,
          },
        ],
      });

      logger.info('Genre distribution chart loaded', { genreCount: sortedGenres.length }, 'MUSIC');
    } catch (error) {
      logger.error('Failed to load genre distribution', error as Error, 'MUSIC');
    } finally {
      setIsLoading(false);
    }
  };

  const options: ChartOptions<'pie'> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'right',
        labels: {
          padding: 15,
          font: {
            size: 12,
          },
          color: 'hsl(var(--foreground))',
        },
      },
      tooltip: {
        callbacks: {
          label: (context) => {
            const label = context.label || '';
            const value = context.parsed || 0;
            const total = context.dataset.data.reduce((a: number, b: number) => a + b, 0);
            const percentage = Math.round((value / total) * 100);
            return `${label}: ${value} écoutes (${percentage}%)`;
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
      <Pie data={chartData} options={options} />
    </div>
  );
};
