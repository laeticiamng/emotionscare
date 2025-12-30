/**
 * Stats Panel - Statistiques et historique Bubble Beat
 */

import { memo } from 'react';
import { motion } from 'framer-motion';
import { 
  Trophy, 
  Target, 
  Clock, 
  Flame,
  TrendingUp,
  Gamepad2
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';

interface BubbleBeatStats {
  totalSessions: number;
  totalScore: number;
  totalBubblesPopped: number;
  averageScore: number;
  bestScore: number;
  totalPlaytimeMinutes: number;
  currentStreak?: number;
  bestStreak?: number;
}

interface StatsPanelProps {
  stats: BubbleBeatStats;
  isLoading?: boolean;
}

export const StatsPanel = memo(function StatsPanel({ stats, isLoading }: StatsPanelProps) {
  const statItems = [
    {
      icon: Gamepad2,
      label: 'Sessions',
      value: stats.totalSessions,
      color: 'text-blue-500'
    },
    {
      icon: Trophy,
      label: 'Meilleur score',
      value: stats.bestScore,
      color: 'text-amber-500'
    },
    {
      icon: Target,
      label: 'Bulles éclatées',
      value: stats.totalBubblesPopped,
      color: 'text-emerald-500'
    },
    {
      icon: TrendingUp,
      label: 'Score moyen',
      value: Math.round(stats.averageScore),
      color: 'text-purple-500'
    },
    {
      icon: Clock,
      label: 'Temps de jeu',
      value: Math.round(stats.totalPlaytimeMinutes),
      suffix: 'min',
      color: 'text-cyan-500'
    },
    {
      icon: Flame,
      label: 'Score total',
      value: stats.totalScore,
      color: 'text-orange-500'
    }
  ];

  // Calcul du niveau basé sur le score total
  const level = Math.floor(stats.totalScore / 1000) + 1;
  const progressToNext = (stats.totalScore % 1000) / 10;

  if (isLoading) {
    return (
      <Card className="animate-pulse">
        <CardHeader>
          <div className="h-6 bg-muted rounded w-1/3" />
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="h-20 bg-muted rounded" />
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-card/50 backdrop-blur-sm border-border/50">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg flex items-center gap-2">
          <Trophy className="w-5 h-5 text-amber-500" />
          Vos statistiques
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Niveau */}
        <div className="space-y-2 p-3 rounded-lg bg-primary/10 border border-primary/20">
          <div className="flex justify-between items-center">
            <span className="font-medium">Niveau {level}</span>
            <span className="text-sm text-muted-foreground">
              {stats.totalScore % 1000} / 1000 XP
            </span>
          </div>
          <Progress value={progressToNext} className="h-2" />
        </div>

        {/* Stats grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {statItems.map((item, index) => {
            const Icon = item.icon;
            return (
              <motion.div
                key={item.label}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="p-3 rounded-lg bg-muted/50 text-center"
              >
                <Icon className={`w-5 h-5 mx-auto mb-1 ${item.color}`} />
                <div className="text-xl font-bold">
                  {item.value.toLocaleString()}
                  {item.suffix && (
                    <span className="text-xs text-muted-foreground ml-1">
                      {item.suffix}
                    </span>
                  )}
                </div>
                <div className="text-xs text-muted-foreground">
                  {item.label}
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Streak info */}
        {stats.currentStreak && stats.currentStreak > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="p-3 rounded-lg bg-orange-500/10 border border-orange-500/20 text-center"
          >
            <Flame className="w-5 h-5 text-orange-500 mx-auto mb-1" />
            <p className="text-sm">
              🔥 Série de {stats.currentStreak} jour(s) !
            </p>
          </motion.div>
        )}
      </CardContent>
    </Card>
  );
});

export default StatsPanel;
