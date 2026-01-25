/**
 * Panneau de statistiques Story Synth
 * @module story-synth
 */

import { memo } from 'react';
import { motion } from 'framer-motion';
import { 
  Book, 
  Clock, 
  Star, 
  TrendingUp, 
  Target,
  Sparkles,
  Award,
  Flame
} from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';
import type { StorySynthStats } from '../types';

interface StoryStatsProps {
  stats: StorySynthStats | null;
  weeklyGoal?: number;
  weeklyProgress?: number;
}

const themeLabels: Record<string, string> = {
  calme: 'Calme',
  aventure: 'Aventure',
  poetique: 'Poétique',
  mysterieux: 'Mystérieux',
  romance: 'Romance',
  introspection: 'Introspection',
  nature: 'Nature',
};

export const StoryStats = memo(function StoryStats({
  stats,
  weeklyGoal = 3,
  weeklyProgress = 0,
}: StoryStatsProps) {
  const progressPercent = Math.min((weeklyProgress / weeklyGoal) * 100, 100);

  const statItems = [
    {
      icon: Book,
      label: 'Histoires lues',
      value: stats?.total_stories_read || 0,
      color: 'text-purple-500',
      bg: 'bg-purple-500/10',
    },
    {
      icon: Clock,
      label: 'Temps de lecture',
      value: `${stats?.total_reading_time_minutes || 0} min`,
      color: 'text-blue-500',
      bg: 'bg-blue-500/10',
    },
    {
      icon: TrendingUp,
      label: 'Taux de complétion',
      value: `${Math.round((stats?.completion_rate || 0) * 100)}%`,
      color: 'text-green-500',
      bg: 'bg-green-500/10',
    },
    {
      icon: Star,
      label: 'Thème favori',
      value: stats?.favorite_theme ? themeLabels[stats.favorite_theme] || stats.favorite_theme : 'Aucun',
      color: 'text-amber-500',
      bg: 'bg-amber-500/10',
    },
  ];

  return (
    <div className="space-y-4">
      {/* Objectif hebdomadaire */}
      <Card className="p-4 bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Target className="w-5 h-5 text-primary" />
            <h3 className="font-semibold text-foreground">Objectif de la semaine</h3>
          </div>
          <span className="text-sm text-muted-foreground">
            {weeklyProgress} / {weeklyGoal} histoires
          </span>
        </div>
        <Progress value={progressPercent} className="h-2" />
        {progressPercent >= 100 && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-2 mt-2 text-green-600"
          >
            <Sparkles className="w-4 h-4" />
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
              <div className="text-xl font-bold text-foreground">
                {stat.value}
              </div>
              <p className="text-sm text-muted-foreground mt-1">
                {stat.label}
              </p>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Achievements preview */}
      <Card className="p-4">
        <div className="flex items-center gap-2 mb-3">
          <Award className="w-5 h-5 text-amber-500" />
          <h4 className="font-medium text-foreground">Succès narratifs</h4>
        </div>
        <div className="flex gap-2">
          {[
            { icon: '📖', name: 'Premier récit', unlocked: (stats?.total_stories_read || 0) >= 1 },
            { icon: '🔥', name: 'Série de 5', unlocked: (stats?.total_stories_read || 0) >= 5 },
            { icon: '⏰', name: '30 min lecture', unlocked: (stats?.total_reading_time_minutes || 0) >= 30 },
            { icon: '🏆', name: 'Explorateur', unlocked: (stats?.total_stories_read || 0) >= 10 },
          ].map(achievement => (
            <div
              key={achievement.name}
              className={cn(
                'w-10 h-10 rounded-lg flex items-center justify-center text-lg',
                achievement.unlocked
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

      {/* Streak */}
      <Card className="p-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-orange-500/10 flex items-center justify-center">
            <Flame className="w-6 h-6 text-orange-500" />
          </div>
          <div>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-bold text-foreground">
                {weeklyProgress}
              </span>
              <span className="text-sm text-muted-foreground">jours consécutifs</span>
            </div>
            <p className="text-xs text-muted-foreground mt-0.5">
              Continuez pour augmenter votre streak !
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
});

export default StoryStats;
