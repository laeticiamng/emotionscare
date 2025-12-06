/**
 * Composant de graphique à barres hebdomadaire
 */

import { Bar, BarChart, CartesianGrid, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import type { WeeklyMetric } from '../types';

interface WeeklyBarChartProps {
  metric: WeeklyMetric;
  showAverage?: boolean;
}

export const WeeklyBarChart = ({ metric, showAverage = true }: WeeklyBarChartProps) => {
  const metricLabels: Record<string, string> = {
    mood: 'Humeur',
    stress: 'Stress',
    energy: 'Énergie',
    sleep: 'Sommeil',
    activity: 'Activité'
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>{metricLabels[metric.type]}</span>
          {showAverage && (
            <span className="text-sm font-normal text-muted-foreground">
              Moyenne: {metric.average}
            </span>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={metric.data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              dataKey="label"
              tick={{ fontSize: 12 }}
            />
            <YAxis tick={{ fontSize: 12 }} />
            <Tooltip />
            <Bar dataKey="value" fill={metric.color} radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};
