/**
 * Composant principal du module weekly-bars
 */

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart3 } from 'lucide-react';
import { useWeeklyBars } from '../useWeeklyBars';
import { WeeklyBarChart } from '../ui/WeeklyBarChart';
import { TrendIndicator } from '../ui/TrendIndicator';

export function WeeklyBarsMain() {
  const { data, status, error } = useWeeklyBars({
    autoLoad: true,
    defaultConfig: {
      metrics: ['mood', 'stress', 'energy'],
      showAverage: true,
      showTrend: true
    }
  });

  if (status === 'loading') {
    return (
      <div className="container max-w-6xl mx-auto py-8">
        <Card>
          <CardContent className="py-8 text-center">
            <p className="text-muted-foreground">Chargement des statistiques...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (status === 'error') {
    return (
      <div className="container max-w-6xl mx-auto py-8">
        <Card>
          <CardContent className="py-8 text-center">
            <p className="text-destructive">{error}</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container max-w-6xl mx-auto py-8 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5 text-primary" />
            Statistiques hebdomadaires
          </CardTitle>
        </CardHeader>
      </Card>

      <div className="grid grid-cols-1 gap-6">
        {data.map((metric) => (
          <div key={metric.type} className="space-y-2">
            <div className="flex items-center justify-end">
              <TrendIndicator trend={metric.trend} />
            </div>
            <WeeklyBarChart metric={metric} showAverage />
          </div>
        ))}
      </div>
    </div>
  );
}

export default WeeklyBarsMain;
