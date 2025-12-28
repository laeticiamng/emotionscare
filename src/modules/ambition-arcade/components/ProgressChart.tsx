/**
 * Graphique de progression Ambition Arcade
 */
import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, Calendar, Zap } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { format, subDays, eachDayOfInterval, isSameDay } from 'date-fns';
import { fr } from 'date-fns/locale';

interface DayData {
  date: Date;
  quests: number;
  xp: number;
}

export const ProgressChart: React.FC = () => {
  const { user } = useAuth();

  const { data: activityData, isLoading } = useQuery({
    queryKey: ['ambition-activity', user?.id],
    queryFn: async () => {
      if (!user?.id) return [];

      // Get runs IDs
      const { data: runs } = await supabase
        .from('ambition_runs')
        .select('id')
        .eq('user_id', user.id);

      const runIds = runs?.map(r => r.id) || [];
      if (runIds.length === 0) return [];

      // Get completed quests from last 14 days
      const twoWeeksAgo = subDays(new Date(), 14).toISOString();
      
      const { data: quests } = await supabase
        .from('ambition_quests')
        .select('completed_at, xp_reward')
        .in('run_id', runIds)
        .eq('status', 'completed')
        .gte('completed_at', twoWeeksAgo);

      return quests || [];
    },
    enabled: !!user?.id,
  });

  const chartData = useMemo(() => {
    const days = eachDayOfInterval({
      start: subDays(new Date(), 13),
      end: new Date()
    });

    return days.map(day => {
      const dayQuests = activityData?.filter(q => 
        q.completed_at && isSameDay(new Date(q.completed_at), day)
      ) || [];

      return {
        date: day,
        quests: dayQuests.length,
        xp: dayQuests.reduce((sum, q) => sum + (q.xp_reward || 0), 0)
      };
    });
  }, [activityData]);

  const maxQuests = Math.max(...chartData.map(d => d.quests), 1);
  const totalXP = chartData.reduce((sum, d) => sum + d.xp, 0);
  const totalQuests = chartData.reduce((sum, d) => sum + d.quests, 0);
  const avgPerDay = (totalQuests / 14).toFixed(1);

  if (isLoading) {
    return (
      <Card className="animate-pulse">
        <CardContent className="h-48" />
      </Card>
    );
  }

  // Empty state
  if (totalQuests === 0) {
    return (
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center gap-2 text-base">
            <TrendingUp className="w-4 h-4 text-primary" />
            Activité (14 jours)
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <Calendar className="w-10 h-10 text-muted-foreground mb-3 opacity-50" />
            <p className="text-sm text-muted-foreground">Aucune activité récente</p>
            <p className="text-xs text-muted-foreground mt-1">Complétez des quêtes pour voir votre progression</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center justify-between text-base">
          <div className="flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-primary" />
            Activité (14 jours)
          </div>
          <div className="flex gap-2">
            <Badge variant="secondary" className="font-normal">
              <Zap className="w-3 h-3 mr-1" />
              {totalXP} XP
            </Badge>
            <Badge variant="outline" className="font-normal">
              {totalQuests} quêtes
            </Badge>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {/* Bar Chart */}
        <div className="flex items-end justify-between gap-1 h-32 mb-4">
          {chartData.map((day, index) => {
            const heightPercent = (day.quests / maxQuests) * 100;
            const isToday = isSameDay(day.date, new Date());
            
            return (
              <div
                key={day.date.toISOString()}
                className="flex-1 flex flex-col items-center gap-1"
              >
                <motion.div
                  initial={{ height: 0 }}
                  animate={{ height: `${Math.max(heightPercent, 4)}%` }}
                  transition={{ delay: index * 0.03, duration: 0.3 }}
                  className={`w-full rounded-t ${
                    day.quests === 0 
                      ? 'bg-muted' 
                      : isToday 
                        ? 'bg-primary' 
                        : 'bg-primary/60'
                  }`}
                  title={`${day.quests} quêtes, ${day.xp} XP`}
                />
                <span className={`text-[10px] ${
                  isToday ? 'text-primary font-medium' : 'text-muted-foreground'
                }`}>
                  {format(day.date, 'd', { locale: fr })}
                </span>
              </div>
            );
          })}
        </div>

        {/* Summary */}
        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <div className="flex items-center gap-1">
            <Calendar className="w-3 h-3" />
            <span>Moyenne: {avgPerDay} quêtes/jour</span>
          </div>
          <div>
            {format(subDays(new Date(), 13), 'd MMM', { locale: fr })} - {format(new Date(), 'd MMM', { locale: fr })}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProgressChart;
