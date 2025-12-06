import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface WeeklyBarData {
  date: string;
  value: 'low' | 'medium' | 'high';
  label: string;
}

interface WeeklyBarsProps {
  data?: WeeklyBarData[];
}

/**
 * Barres hebdomadaires - Tendance 7 jours
 */
export const WeeklyBars: React.FC<WeeklyBarsProps> = ({ data }) => {
  if (!data) return null;

  const formatDay = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('fr-FR', { weekday: 'short' }).format(date);
  };

  const heights = { low: 'h-4', medium: 'h-8', high: 'h-12' };
  const colors = { low: 'bg-blue-400', medium: 'bg-green-400', high: 'bg-orange-400' };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Tendance 7 jours</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-end justify-between gap-2 h-16">
          {data.map((day) => (
            <div key={day.date} className="flex flex-col items-center gap-2 flex-1">
              <div 
                className={`w-full rounded-t-sm ${heights[day.value]} ${colors[day.value]}`}
                title={`${formatDay(day.date)}: ${day.label}`}
              />
              <span className="text-xs text-muted-foreground">
                {formatDay(day.date)}
              </span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};