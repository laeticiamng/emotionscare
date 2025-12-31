/**
 * Statistiques personnelles des sessions de groupe
 */

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { 
  Users, 
  Clock, 
  TrendingUp, 
  Sparkles, 
  Award,
  Mic,
  Calendar
} from 'lucide-react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface SessionStatsProps {
  stats: {
    totalSessions: number;
    hostedSessions: number;
    totalMinutes: number;
    averageMoodImprovement: number;
    xpEarned: number;
  } | null;
  loading?: boolean;
}

const StatCard = ({ 
  icon: IconComponent, 
  label, 
  value, 
  suffix, 
  color, 
  delay 
}: { 
  icon: typeof Users; 
  label: string; 
  value: number | string; 
  suffix?: string;
  color: string;
  delay: number;
}) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay, duration: 0.3 }}
  >
    <Card className="relative overflow-hidden">
      <div className={cn(
        "absolute inset-0 opacity-5",
        color
      )} />
      <CardContent className="p-4">
        <div className="flex items-center gap-3">
          <div className={cn(
            "h-10 w-10 rounded-lg flex items-center justify-center",
            color.replace('bg-', 'bg-').replace('-500', '-500/10')
          )}>
            <IconComponent className={cn("h-5 w-5", color.replace('bg-', 'text-'))} />
          </div>
          <div>
            <p className="text-sm text-muted-foreground">{label}</p>
            <p className="text-2xl font-bold">
              {value}{suffix && <span className="text-sm font-normal text-muted-foreground ml-1">{suffix}</span>}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  </motion.div>
);

export const SessionStats: React.FC<SessionStatsProps> = ({ stats, loading }) => {
  if (loading) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {[1, 2, 3, 4, 5].map(i => (
          <Card key={i} className="animate-pulse h-24" />
        ))}
      </div>
    );
  }

  if (!stats) {
    return (
      <Card>
        <CardContent className="py-8 text-center">
          <Users className="h-12 w-12 mx-auto text-muted-foreground mb-3" />
          <p className="text-muted-foreground">Participez à votre première session pour voir vos statistiques</p>
        </CardContent>
      </Card>
    );
  }

  const formatHours = (minutes: number) => {
    if (minutes < 60) return `${minutes}`;
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return mins > 0 ? `${hours}h${mins}` : `${hours}h`;
  };

  return (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        <StatCard
          icon={Calendar}
          label="Sessions participées"
          value={stats.totalSessions}
          color="bg-blue-500"
          delay={0}
        />
        <StatCard
          icon={Mic}
          label="Sessions animées"
          value={stats.hostedSessions}
          color="bg-purple-500"
          delay={0.05}
        />
        <StatCard
          icon={Clock}
          label="Temps total"
          value={formatHours(stats.totalMinutes)}
          suffix="min"
          color="bg-cyan-500"
          delay={0.1}
        />
        <StatCard
          icon={TrendingUp}
          label="Amélioration humeur"
          value={stats.averageMoodImprovement > 0 ? `+${stats.averageMoodImprovement}` : stats.averageMoodImprovement}
          color="bg-green-500"
          delay={0.15}
        />
        <StatCard
          icon={Sparkles}
          label="XP gagnés"
          value={stats.xpEarned}
          suffix="XP"
          color="bg-amber-500"
          delay={0.2}
        />
      </div>

      {/* Progress towards badges */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base flex items-center gap-2">
            <Award className="h-5 w-5 text-primary" />
            Progression
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Session participation badge */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm">Badge "Participant Engagé"</span>
              <Badge variant="outline" className="text-xs">
                {stats.totalSessions}/10 sessions
              </Badge>
            </div>
            <Progress 
              value={Math.min(stats.totalSessions * 10, 100)} 
              className="h-2" 
            />
          </div>

          {/* Host badge */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm">Badge "Animateur"</span>
              <Badge variant="outline" className="text-xs">
                {stats.hostedSessions}/5 sessions animées
              </Badge>
            </div>
            <Progress 
              value={Math.min(stats.hostedSessions * 20, 100)} 
              className="h-2" 
            />
          </div>

          {/* Time badge */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm">Badge "Temps partagé"</span>
              <Badge variant="outline" className="text-xs">
                {stats.totalMinutes}/300 minutes
              </Badge>
            </div>
            <Progress 
              value={Math.min((stats.totalMinutes / 300) * 100, 100)} 
              className="h-2" 
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SessionStats;
