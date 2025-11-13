import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle, TrendingUp, TrendingDown } from 'lucide-react';
import { Line } from 'react-chartjs-2';
import type { MonthComparison } from '@/services/advancedAuditStatsService';

interface MonthComparisonChartProps {
  data: MonthComparison[];
  isLoading: boolean;
  error: Error | null;
}

export function MonthComparisonChart({ data, isLoading, error }: MonthComparisonChartProps) {
  if (isLoading) {
    return <Skeleton className="h-96 w-full" />;
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          Erreur lors du chargement de la comparaison mensuelle
        </AlertDescription>
      </Alert>
    );
  }

  const chartData = {
    labels: data.map((d) => d.month),
    datasets: [
      {
        label: 'Mois courant',
        data: data.map((d) => d.currentMonth),
        borderColor: 'hsl(var(--chart-1))',
        backgroundColor: 'hsl(var(--chart-1) / 0.2)',
        fill: true,
        tension: 0.4,
      },
      {
        label: 'Mois précédent',
        data: data.map((d) => d.previousMonth),
        borderColor: 'hsl(var(--chart-2))',
        backgroundColor: 'hsl(var(--chart-2) / 0.2)',
        fill: true,
        tension: 0.4,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
        labels: {
          color: 'hsl(var(--foreground))',
        },
      },
      title: {
        display: false,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          color: 'hsl(var(--muted-foreground))',
        },
        grid: {
          color: 'hsl(var(--border))',
        },
      },
      x: {
        ticks: {
          color: 'hsl(var(--muted-foreground))',
        },
        grid: {
          color: 'hsl(var(--border))',
        },
      },
    },
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Comparaison Mois à Mois</CardTitle>
        <CardDescription>
          Évolution des changements de rôles sur les 6 derniers mois
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-80">
          <Line data={chartData} options={chartOptions} />
        </div>

        <div className="mt-6 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {data.slice(0, 3).map((month, index) => (
            <div
              key={index}
              className="flex items-center justify-between rounded-lg border p-4"
            >
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  {month.month}
                </p>
                <p className="text-2xl font-bold">{month.currentMonth}</p>
              </div>
              <div
                className={cn(
                  'flex items-center gap-1 text-sm font-medium',
                  month.change >= 0 ? 'text-green-600' : 'text-red-600'
                )}
              >
                {month.change >= 0 ? (
                  <TrendingUp className="h-4 w-4" />
                ) : (
                  <TrendingDown className="h-4 w-4" />
                )}
                {month.changePercent > 0 ? '+' : ''}
                {month.changePercent}%
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

function cn(...classes: (string | boolean | undefined)[]) {
  return classes.filter(Boolean).join(' ');
}
