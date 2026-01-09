/**
 * TimeStats - Statistiques temporelles par type de bloc
 */
import React, { memo } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import type { LucideIcon } from 'lucide-react';
import {
  Sparkles,
  Moon,
  AlertTriangle,
  Heart,
  Target,
  Clock,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import type { TimeBlockStats, TimeBlockType } from '@/hooks/timecraft';

interface TimeStatsProps {
  stats: TimeBlockStats;
  className?: string;
  compact?: boolean;
}

const statConfig: Record<TimeBlockType, {
  icon: LucideIcon;
  label: string;
  color: string;
  bgColor: string;
  progressColor: string;
}> = {
  creation: {
    icon: Sparkles,
    label: 'Création',
    color: 'text-purple-600',
    bgColor: 'bg-purple-500/10 border-purple-500/20',
    progressColor: 'bg-purple-500',
  },
  recovery: {
    icon: Moon,
    label: 'Récupération',
    color: 'text-blue-600',
    bgColor: 'bg-blue-500/10 border-blue-500/20',
    progressColor: 'bg-blue-500',
  },
  constraint: {
    icon: AlertTriangle,
    label: 'Contrainte',
    color: 'text-orange-600',
    bgColor: 'bg-orange-500/10 border-orange-500/20',
    progressColor: 'bg-orange-500',
  },
  emotional: {
    icon: Heart,
    label: 'Charge émotionnelle',
    color: 'text-red-600',
    bgColor: 'bg-red-500/10 border-red-500/20',
    progressColor: 'bg-red-500',
  },
  chosen: {
    icon: Target,
    label: 'Temps choisi',
    color: 'text-green-600',
    bgColor: 'bg-green-500/10 border-green-500/20',
    progressColor: 'bg-green-500',
  },
  imposed: {
    icon: Clock,
    label: 'Temps subi',
    color: 'text-gray-600',
    bgColor: 'bg-gray-500/10 border-gray-500/20',
    progressColor: 'bg-gray-500',
  },
};

export const TimeStats = memo(function TimeStats({
  stats,
  className,
  compact = false,
}: TimeStatsProps) {
  const types: TimeBlockType[] = ['creation', 'recovery', 'constraint', 'emotional', 'chosen', 'imposed'];
  const maxHours = Math.max(...types.map(t => stats[t]), 1);

  if (compact) {
    return (
      <div className={cn('grid grid-cols-2 lg:grid-cols-3 gap-3', className)}>
        {types.map((type, index) => {
          const config = statConfig[type];
          const Icon = config.icon;
          const hours = stats[type];
          const percentage = stats.total > 0 ? (hours / stats.total) * 100 : 0;

          return (
            <motion.div
              key={type}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <Card className={cn('border', config.bgColor)}>
                <CardContent className="p-3">
                  <div className="flex items-center gap-2 mb-2">
                    <Icon className={cn('h-4 w-4', config.color)} />
                    <span className="text-xs font-medium truncate">{config.label}</span>
                  </div>
                  <div className="flex items-baseline gap-1">
                    <span className="text-xl font-bold">{hours}</span>
                    <span className="text-xs text-muted-foreground">h</span>
                  </div>
                  <div className="mt-2 h-1.5 rounded-full bg-muted overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${percentage}%` }}
                      transition={{ delay: 0.3 + index * 0.05, duration: 0.5 }}
                      className={cn('h-full rounded-full', config.progressColor)}
                    />
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>
    );
  }

  return (
    <div className={cn('space-y-4', className)}>
      {types.map((type, index) => {
        const config = statConfig[type];
        const Icon = config.icon;
        const hours = stats[type];
        const percentage = stats.total > 0 ? (hours / stats.total) * 100 : 0;
        const barWidth = (hours / maxHours) * 100;

        return (
          <motion.div
            key={type}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.05 }}
            className="space-y-2"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className={cn('p-1.5 rounded-md', config.bgColor)}>
                  <Icon className={cn('h-4 w-4', config.color)} />
                </div>
                <span className="text-sm font-medium">{config.label}</span>
              </div>
              <div className="flex items-baseline gap-1">
                <span className="text-lg font-bold">{hours}</span>
                <span className="text-xs text-muted-foreground">h</span>
                <span className="text-xs text-muted-foreground ml-1">
                  ({Math.round(percentage)}%)
                </span>
              </div>
            </div>
            <div className="h-2 rounded-full bg-muted overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${barWidth}%` }}
                transition={{ delay: 0.2 + index * 0.05, duration: 0.6, ease: 'easeOut' }}
                className={cn('h-full rounded-full', config.progressColor)}
              />
            </div>
          </motion.div>
        );
      })}

      {/* Total */}
      <div className="pt-4 border-t">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-muted-foreground">Total cartographié</span>
          <div className="flex items-baseline gap-1">
            <span className="text-2xl font-bold">{stats.total}</span>
            <span className="text-sm text-muted-foreground">heures</span>
          </div>
        </div>
      </div>
    </div>
  );
});

export default TimeStats;
