/**
 * Graphique de tendance SEUIL
 */
import React, { memo } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TrendingUp } from 'lucide-react';
import { useSeuilTrendData } from '../hooks/useSeuilStats';
import { format, subDays } from 'date-fns';
import { fr } from 'date-fns/locale';

export const SeuilTrendChart: React.FC = memo(() => {
  const { data: trendData, isLoading } = useSeuilTrendData();

  if (isLoading) {
    return (
      <Card className="animate-pulse">
        <CardContent className="h-48" />
      </Card>
    );
  }

  if (!trendData || trendData.length < 2) {
    return null;
  }

  // Aggregate by day for last 7 days
  const last7Days = Array.from({ length: 7 }, (_, i) => {
    const date = subDays(new Date(), 6 - i);
    return format(date, 'yyyy-MM-dd');
  });

  const dailyData = last7Days.map(dateStr => {
    const dayEvents = trendData.filter(e => 
      format(new Date(e.date), 'yyyy-MM-dd') === dateStr
    );
    return {
      date: dateStr,
      label: format(new Date(dateStr), 'EEE', { locale: fr }),
      avgLevel: dayEvents.length > 0
        ? dayEvents.reduce((s, e) => s + e.level, 0) / dayEvents.length
        : null,
      count: dayEvents.length,
    };
  });

  const maxLevel = Math.max(...dailyData.map(d => d.avgLevel || 0), 100);
  const chartHeight = 120;

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-base flex items-center gap-2">
          <TrendingUp className="w-4 h-4 text-primary" />
          Tendance sur 7 jours
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="relative" style={{ height: chartHeight + 40 }}>
          {/* Y-axis labels */}
          <div className="absolute left-0 top-0 bottom-8 w-8 flex flex-col justify-between text-xs text-muted-foreground">
            <span>100</span>
            <span>50</span>
            <span>0</span>
          </div>

          {/* Chart area */}
          <div className="ml-10 h-full">
            {/* Grid lines */}
            <div className="absolute inset-x-10 top-0" style={{ height: chartHeight }}>
              {[0, 25, 50, 75, 100].map(level => (
                <div
                  key={level}
                  className="absolute w-full border-t border-muted/30"
                  style={{ top: `${100 - level}%` }}
                />
              ))}
            </div>

            {/* Bars */}
            <div className="flex items-end justify-between gap-2 h-full pb-8" style={{ height: chartHeight }}>
              {dailyData.map((day, idx) => (
                <motion.div
                  key={day.date}
                  initial={{ height: 0 }}
                  animate={{ height: day.avgLevel ? `${(day.avgLevel / maxLevel) * 100}%` : '0%' }}
                  transition={{ delay: idx * 0.05, duration: 0.3 }}
                  className="flex-1 relative group"
                >
                  {day.avgLevel !== null ? (
                    <div
                      className={`w-full rounded-t-md transition-opacity ${
                        day.avgLevel <= 30 ? 'bg-emerald-500/60' :
                        day.avgLevel <= 60 ? 'bg-amber-500/60' :
                        day.avgLevel <= 85 ? 'bg-rose-500/60' :
                        'bg-indigo-500/60'
                      }`}
                      style={{ height: '100%' }}
                    />
                  ) : (
                    <div className="w-full h-1 rounded bg-muted/30" />
                  )}

                  {/* Tooltip */}
                  {day.avgLevel !== null && (
                    <div className="absolute -top-8 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity z-10">
                      <div className="bg-popover border rounded-md px-2 py-1 text-xs shadow-lg whitespace-nowrap">
                        <p className="font-medium">{Math.round(day.avgLevel)}%</p>
                        <p className="text-muted-foreground">{day.count} session(s)</p>
                      </div>
                    </div>
                  )}
                </motion.div>
              ))}
            </div>

            {/* X-axis labels */}
            <div className="flex justify-between text-xs text-muted-foreground mt-2">
              {dailyData.map(day => (
                <span key={day.date} className="flex-1 text-center capitalize">
                  {day.label}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Legend */}
        <div className="flex flex-wrap gap-3 mt-4 justify-center text-xs">
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 rounded bg-emerald-500/60" />
            <span className="text-muted-foreground">0-30%</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 rounded bg-amber-500/60" />
            <span className="text-muted-foreground">31-60%</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 rounded bg-rose-500/60" />
            <span className="text-muted-foreground">61-85%</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 rounded bg-indigo-500/60" />
            <span className="text-muted-foreground">86-100%</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
});

SeuilTrendChart.displayName = 'SeuilTrendChart';

export default SeuilTrendChart;
