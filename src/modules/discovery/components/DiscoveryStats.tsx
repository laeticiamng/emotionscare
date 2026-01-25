/**
 * Panneau de statistiques Discovery
 * @module discovery
 */

import { memo } from 'react';
import { motion } from 'framer-motion';
import { 
  Trophy, 
  Flame, 
  Star, 
  Clock, 
  Target,
  TrendingUp,
  Zap,
  Award
} from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';
import { DiscoveryStats as DiscoveryStatsType } from '../types';

interface DiscoveryStatsProps {
  stats: DiscoveryStatsType;
  dailyGoal: number;
}

const categoryLabels: Record<string, string> = {
  emotion: 'Émotions',
  activity: 'Activités',
  technique: 'Techniques',
  insight: 'Insights',
  challenge: 'Défis',
  ressource: 'Ressources',
};

export const DiscoveryStatsPanel = memo(function DiscoveryStatsPanel({
  stats,
  dailyGoal,
}: DiscoveryStatsProps) {
  const todayProgress = stats.weeklyProgress[stats.weeklyProgress.length - 1];
  const progressPercent = Math.min((todayProgress?.count || 0) / dailyGoal * 100, 100);

  const statItems = [
    {
      icon: Trophy,
      label: 'Découvertes',
      value: stats.completedDiscoveries,
      subtext: `/ ${stats.totalDiscoveries}`,
      color: 'text-amber-500',
      bg: 'bg-amber-500/10',
    },
    {
      icon: Flame,
      label: 'Streak actuel',
      value: stats.currentStreak,
      subtext: 'jours',
      color: 'text-orange-500',
      bg: 'bg-orange-500/10',
    },
    {
      icon: Star,
      label: 'XP Total',
      value: stats.totalXpEarned,
      subtext: 'points',
      color: 'text-purple-500',
      bg: 'bg-purple-500/10',
    },
    {
      icon: Clock,
      label: 'Temps passé',
      value: Math.floor(stats.timeSpentMinutes / 60),
      subtext: 'heures',
      color: 'text-blue-500',
      bg: 'bg-blue-500/10',
    },
  ];

  return (
    <div className="space-y-4">
      {/* Objectif quotidien */}
      <Card className="p-4 bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Target className="w-5 h-5 text-primary" />
            <h3 className="font-semibold text-foreground">Objectif du jour</h3>
          </div>
          <span className="text-sm text-muted-foreground">
            {todayProgress?.count || 0} / {dailyGoal}
          </span>
        </div>
        <Progress value={progressPercent} className="h-2" />
        {progressPercent >= 100 && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-2 mt-2 text-green-600"
          >
            <Zap className="w-4 h-4" />
            <span className="text-sm font-medium">Objectif atteint ! 🎉</span>
          </motion.div>
        )}
      </Card>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-3">
        {statItems.map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className="p-4 hover:shadow-md transition-shadow">
              <div className={cn('w-10 h-10 rounded-lg flex items-center justify-center mb-3', stat.bg)}>
                <stat.icon className={cn('w-5 h-5', stat.color)} />
              </div>
              <div className="flex items-baseline gap-1">
                <span className="text-2xl font-bold text-foreground">
                  {stat.value}
                </span>
                <span className="text-xs text-muted-foreground">
                  {stat.subtext}
                </span>
              </div>
              <p className="text-sm text-muted-foreground mt-1">
                {stat.label}
              </p>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Catégorie favorite */}
      {stats.favoriteCategory && (
        <Card className="p-4">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="w-4 h-4 text-primary" />
            <h4 className="font-medium text-foreground">Catégorie favorite</h4>
          </div>
          <p className="text-lg font-semibold text-primary">
            {categoryLabels[stats.favoriteCategory] || stats.favoriteCategory}
          </p>
        </Card>
      )}

      {/* Activité hebdomadaire */}
      <Card className="p-4">
        <h4 className="font-medium text-foreground mb-4">Activité cette semaine</h4>
        <div className="flex items-end justify-between gap-2 h-20">
          {stats.weeklyProgress.map((day, index) => {
            const maxCount = Math.max(...stats.weeklyProgress.map(d => d.count), 1);
            const height = (day.count / maxCount) * 100;
            
            return (
              <div key={day.day} className="flex-1 flex flex-col items-center gap-1">
                <motion.div
                  initial={{ height: 0 }}
                  animate={{ height: `${Math.max(height, 4)}%` }}
                  transition={{ delay: index * 0.1, duration: 0.5 }}
                  className={cn(
                    'w-full rounded-t-sm',
                    day.count > 0 ? 'bg-primary' : 'bg-muted'
                  )}
                />
                <span className="text-xs text-muted-foreground">{day.day}</span>
              </div>
            );
          })}
        </div>
      </Card>

      {/* Achievements Preview */}
      <Card className="p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Award className="w-4 h-4 text-amber-500" />
            <h4 className="font-medium text-foreground">Succès</h4>
          </div>
          <span className="text-xs text-muted-foreground">
            {stats.achievements.filter(a => a.unlockedAt).length} / {stats.achievements.length}
          </span>
        </div>
        <div className="flex gap-2">
          {stats.achievements.slice(0, 4).map(achievement => (
            <div
              key={achievement.id}
              className={cn(
                'w-10 h-10 rounded-lg flex items-center justify-center text-lg',
                achievement.unlockedAt
                  ? 'bg-amber-500/20'
                  : 'bg-muted opacity-40 grayscale'
              )}
              title={achievement.name}
            >
              {achievement.icon}
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
});

export default DiscoveryStatsPanel;
