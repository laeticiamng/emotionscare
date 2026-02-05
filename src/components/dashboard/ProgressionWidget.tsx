import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Flame, BookOpen, TrendingUp } from 'lucide-react';
import { useUserStatsQuery } from '@/hooks/useUserStatsQuery';
import { useMoodWeeklyData } from '@/hooks/useMoodWeeklyData';
import { Skeleton } from '@/components/ui/skeleton';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip } from 'recharts';
import { cn } from '@/lib/utils';

interface ProgressionWidgetProps {
  className?: string;
}

export const ProgressionWidget: React.FC<ProgressionWidgetProps> = ({ className }) => {
  const { stats, loading: statsLoading } = useUserStatsQuery();
  const { data: moodData, isLoading: moodLoading } = useMoodWeeklyData();

  const isLoading = statsLoading || moodLoading;

  return (
    <Card className={cn('', className)}>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg flex items-center gap-2">
          📈 Ta progression
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Stats rapides */}
        <div className="grid grid-cols-2 gap-4">
          <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
            <div className="p-2 bg-warning/10 rounded-lg">
              <Flame className="h-5 w-5 text-warning" />
            </div>
            <div>
              {isLoading ? (
                <Skeleton className="h-6 w-12" />
              ) : (
                <div className="text-xl font-bold">{stats.currentStreak}</div>
              )}
              <div className="text-xs text-muted-foreground">jours consécutifs</div>
            </div>
          </div>
          
          <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
            <div className="p-2 bg-success/10 rounded-lg">
              <BookOpen className="h-5 w-5 text-success" />
            </div>
            <div>
              {isLoading ? (
                <Skeleton className="h-6 w-12" />
              ) : (
                <div className="text-xl font-bold">{stats.journalEntries}</div>
              )}
              <div className="text-xs text-muted-foreground">entrées journal</div>
            </div>
          </div>
        </div>

        {/* Graphique humeur 7 jours */}
        <div>
          <div className="flex items-center gap-2 mb-2 text-sm text-muted-foreground">
            <TrendingUp className="h-4 w-4" />
            <span>Évolution de ton humeur (7 jours)</span>
          </div>
          
          {moodLoading ? (
            <Skeleton className="h-[120px] w-full" />
          ) : moodData && moodData.length > 0 ? (
            <div className="h-[120px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={moodData}>
                  <XAxis 
                    dataKey="day" 
                    tick={{ fontSize: 11 }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <YAxis 
                    domain={[0, 10]} 
                    hide
                  />
                  <Tooltip 
                    content={({ active, payload }) => {
                      if (active && payload && payload.length) {
                        const value = payload[0].value as number;
                        return (
                          <div className="bg-popover text-popover-foreground p-2 rounded-lg shadow-md text-sm">
                            <p className="font-medium">Humeur: {value}/10</p>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="mood" 
                    stroke="hsl(var(--primary))"
                    strokeWidth={2}
                    dot={{ fill: 'hsl(var(--primary))', r: 3 }}
                    activeDot={{ r: 5 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="h-[120px] flex items-center justify-center text-sm text-muted-foreground bg-muted/30 rounded-lg">
              <p>Enregistre ton humeur pour voir ton évolution</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default ProgressionWidget;
