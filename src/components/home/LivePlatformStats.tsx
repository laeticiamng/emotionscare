/**
 * LivePlatformStats - Widget affichant les statistiques temps réel
 * Utilise la RPC get_live_platform_stats pour données dynamiques
 */

import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { Users, Activity, Trophy, Wind, TrendingUp, Heart } from 'lucide-react';
import { cn } from '@/lib/utils';

interface PlatformStats {
  active_users: number;
  total_users: number;
  sessions_today: number;
  mood_improvements: number;
  badges_unlocked: number;
  breath_sessions: number;
}

interface StatItemProps {
  icon: React.ReactNode;
  value: number | string;
  label: string;
  color: string;
  trend?: 'up' | 'down' | 'stable';
}

const StatItem: React.FC<StatItemProps> = ({ icon, value, label, color, trend }) => (
  <div className="flex items-center gap-3 p-3 rounded-xl bg-muted/30 hover:bg-muted/50 transition-colors">
    <div className={cn("p-2.5 rounded-lg", color)}>
      {icon}
    </div>
    <div className="flex-1 min-w-0">
      <div className="flex items-center gap-2">
        <span className="text-lg font-bold text-foreground">{value}</span>
        {trend === 'up' && <TrendingUp className="h-3 w-3 text-emerald-500" />}
      </div>
      <span className="text-xs text-muted-foreground truncate block">{label}</span>
    </div>
  </div>
);

export const LivePlatformStats: React.FC<{ className?: string }> = ({ className }) => {
  const { data: stats, isLoading } = useQuery<PlatformStats>({
    queryKey: ['platform-stats'],
    queryFn: async () => {
      const { data, error } = await supabase.rpc('get_live_platform_stats');
      if (error) throw error;
      return data as PlatformStats;
    },
    refetchInterval: 60000, // Refresh every minute
    staleTime: 30000
  });

  if (isLoading) {
    return (
      <Card className={cn("animate-pulse", className)}>
        <CardContent className="p-4">
          <div className="h-20 bg-muted rounded-lg" />
        </CardContent>
      </Card>
    );
  }

  if (!stats) return null;

  const statItems: StatItemProps[] = [
    {
      icon: <Users className="h-4 w-4 text-blue-500" />,
      value: stats.total_users.toLocaleString(),
      label: 'Utilisateurs',
      color: 'bg-blue-500/10',
      trend: 'up'
    },
    {
      icon: <Activity className="h-4 w-4 text-emerald-500" />,
      value: stats.active_users,
      label: 'Actifs maintenant',
      color: 'bg-emerald-500/10'
    },
    {
      icon: <Heart className="h-4 w-4 text-pink-500" />,
      value: stats.mood_improvements,
      label: 'Améliorations humeur',
      color: 'bg-pink-500/10',
      trend: 'up'
    },
    {
      icon: <Wind className="h-4 w-4 text-cyan-500" />,
      value: stats.breath_sessions,
      label: 'Sessions respiration',
      color: 'bg-cyan-500/10'
    },
    {
      icon: <Trophy className="h-4 w-4 text-amber-500" />,
      value: stats.badges_unlocked,
      label: 'Badges débloqués',
      color: 'bg-amber-500/10'
    }
  ];

  return (
    <Card className={cn("border-0 shadow-sm bg-gradient-to-br from-background to-muted/20", className)}>
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-sm text-muted-foreground">
            Statistiques en direct
          </h3>
          <Badge variant="outline" className="text-xs animate-pulse">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 mr-1.5" />
            Live
          </Badge>
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-3">
          {statItems.map((stat, idx) => (
            <StatItem key={idx} {...stat} />
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default LivePlatformStats;
