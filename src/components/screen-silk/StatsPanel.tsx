/**
 * Stats Panel - Statistiques Screen Silk
 */

import { memo } from 'react';
import { motion } from 'framer-motion';
import { 
  Eye, 
  Clock, 
  Target, 
  Flame, 
  Trophy,
  TrendingUp
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import type { SilkStats } from './types';

interface StatsPanelProps {
  stats: SilkStats;
}

export const StatsPanel = memo(function StatsPanel({ stats }: StatsPanelProps) {
  const statItems = [
    {
      icon: Eye,
      label: 'Sessions totales',
      value: stats.totalSessions,
      color: 'text-blue-500'
    },
    {
      icon: Target,
      label: 'Complétées',
      value: stats.completedSessions,
      color: 'text-emerald-500'
    },
    {
      icon: Clock,
      label: 'Minutes de pause',
      value: Math.round(stats.totalBreakMinutes),
      suffix: 'min',
      color: 'text-purple-500'
    },
    {
      icon: TrendingUp,
      label: 'Durée moyenne',
      value: Math.round(stats.averageDuration),
      suffix: 'min',
      color: 'text-cyan-500'
    },
    {
      icon: Flame,
      label: 'Série actuelle',
      value: stats.currentStreak,
      suffix: 'jours',
      color: 'text-orange-500'
    },
    {
      icon: Trophy,
      label: 'Meilleure série',
      value: stats.bestStreak,
      suffix: 'jours',
      color: 'text-amber-500'
    }
  ];

  return (
    <Card className="bg-card/50 backdrop-blur-sm border-border/50">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg flex items-center gap-2">
          <Eye className="w-5 h-5 text-primary" />
          Vos statistiques
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Completion rate */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Taux de complétion</span>
            <span className="font-medium">{Math.round(stats.completionRate)}%</span>
          </div>
          <Progress value={stats.completionRate} className="h-2" />
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
                  {item.value}
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

        {/* Encouragement message */}
        {stats.currentStreak > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="p-3 rounded-lg bg-primary/10 border border-primary/20 text-center"
          >
            <Flame className="w-5 h-5 text-orange-500 mx-auto mb-1" />
            <p className="text-sm">
              {stats.currentStreak >= 7 
                ? `Incroyable ! ${stats.currentStreak} jours de suite !` 
                : stats.currentStreak >= 3 
                  ? `Belle série de ${stats.currentStreak} jours !`
                  : `Continuez ! ${stats.currentStreak} jour(s) de suite.`
              }
            </p>
          </motion.div>
        )}
      </CardContent>
    </Card>
  );
});

export default StatsPanel;
