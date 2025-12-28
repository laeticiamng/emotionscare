/**
 * CoachStatsPanel - Statistiques de coaching utilisateur
 */

import { memo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent } from '@/components/ui/card';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { BarChart3, Clock, MessageSquare, Star, TrendingUp } from 'lucide-react';

interface CoachStats {
  totalSessions: number;
  totalMessages: number;
  totalDuration: number;
  avgSatisfaction: number | null;
  avgMessagesPerSession: number;
}

function formatMinutes(seconds: number): string {
  const mins = Math.round(seconds / 60);
  if (mins < 60) return `${mins} min`;
  const hours = Math.floor(mins / 60);
  const remaining = mins % 60;
  return `${hours}h${remaining > 0 ? ` ${remaining}min` : ''}`;
}

export const CoachStatsPanel = memo(function CoachStatsPanel() {
  const { data: stats, isLoading } = useQuery({
    queryKey: ['coach-user-stats'],
    queryFn: async (): Promise<CoachStats> => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return { totalSessions: 0, totalMessages: 0, totalDuration: 0, avgSatisfaction: null, avgMessagesPerSession: 0 };

      const { data, error } = await supabase
        .from('ai_coach_sessions')
        .select('session_duration, messages_count, user_satisfaction')
        .eq('user_id', user.id);

      if (error) throw error;

      const sessions = data ?? [];
      const totalSessions = sessions.length;
      const totalMessages = sessions.reduce((sum, s) => sum + (s.messages_count || 0), 0);
      const totalDuration = sessions.reduce((sum, s) => sum + (s.session_duration || 0), 0);
      
      const satisfactions = sessions
        .filter((s) => s.user_satisfaction !== null)
        .map((s) => s.user_satisfaction as number);
      const avgSatisfaction = satisfactions.length > 0
        ? satisfactions.reduce((a, b) => a + b, 0) / satisfactions.length
        : null;

      const avgMessagesPerSession = totalSessions > 0 ? totalMessages / totalSessions : 0;

      return { totalSessions, totalMessages, totalDuration, avgSatisfaction, avgMessagesPerSession };
    },
    staleTime: 120_000,
  });

  if (isLoading || !stats || stats.totalSessions === 0) {
    return null;
  }

  const statItems = [
    {
      icon: BarChart3,
      label: 'Sessions',
      value: stats.totalSessions.toString(),
      tooltip: 'Nombre total de sessions de coaching',
    },
    {
      icon: Clock,
      label: 'Temps total',
      value: formatMinutes(stats.totalDuration),
      tooltip: 'Temps cumulé de coaching',
    },
    {
      icon: MessageSquare,
      label: 'Messages',
      value: stats.totalMessages.toString(),
      tooltip: 'Nombre total de messages échangés',
    },
    {
      icon: TrendingUp,
      label: 'Moy. msg/session',
      value: stats.avgMessagesPerSession.toFixed(1),
      tooltip: 'Messages moyens par session',
    },
  ];

  if (stats.avgSatisfaction !== null) {
    statItems.push({
      icon: Star,
      label: 'Satisfaction',
      value: `${stats.avgSatisfaction.toFixed(1)}/5`,
      tooltip: 'Note de satisfaction moyenne',
    });
  }

  return (
    <Card className="border-dashed bg-muted/30">
      <CardContent className="flex flex-wrap items-center justify-center gap-4 p-3">
        <TooltipProvider>
          {statItems.map((item) => (
            <Tooltip key={item.label}>
              <TooltipTrigger asChild>
                <div className="flex items-center gap-2 rounded-lg px-2 py-1 transition hover:bg-muted">
                  <item.icon className="h-4 w-4 text-muted-foreground" />
                  <div className="text-center">
                    <p className="text-sm font-semibold">{item.value}</p>
                    <p className="text-[10px] text-muted-foreground">{item.label}</p>
                  </div>
                </div>
              </TooltipTrigger>
              <TooltipContent>
                <p>{item.tooltip}</p>
              </TooltipContent>
            </Tooltip>
          ))}
        </TooltipProvider>
      </CardContent>
    </Card>
  );
});
