// @ts-nocheck
import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { useEmotionalEnergy } from '@/hooks/useEmotionalEnergy';
import { useWellnessStreak } from '@/hooks/useWellnessStreak';
import { useHarmonyPoints } from '@/hooks/useHarmonyPoints';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';
import { TrendingUp, TrendingDown, Minus, Flame, Zap, Trophy, Target } from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

const STORAGE_KEY = 'emotionscare_stats_history';

interface StatsHistory {
  date: string;
  progression: number;
  sessions: number;
  points: number;
  streak: number;
}

/**
 * Dashboard de stats de gamification (style Duolingo)
 * Affiche Progression, Sessions, Points, Série avec tendances
 */
export const GamificationStats = () => {
  const { energy } = useEmotionalEnergy();
  const { streak } = useWellnessStreak();
  const { points } = useHarmonyPoints();
  const [previousStats, setPreviousStats] = useState<StatsHistory | null>(null);
  const [animatedValues, setAnimatedValues] = useState({
    progression: 0,
    sessions: 0,
    points: 0,
    streak: 0,
  });

  // Load previous stats and animate values
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        const history: StatsHistory[] = JSON.parse(stored);
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        const yesterdayStr = yesterday.toISOString().split('T')[0];
        const prev = history.find(h => h.date === yesterdayStr);
        if (prev) setPreviousStats(prev);
      } catch (e) {
        // Invalid data
      }
    }

    // Animate values
    const progression = energy ? Math.round((energy.currentEnergy / energy.maxEnergy) * 100) : 0;
    const sessions = streak?.totalCheckins || 0;
    const totalPoints = points?.totalPoints || 0;
    const currentStreak = streak?.currentStreak || 0;

    // Animate counter
    const duration = 1000;
    const steps = 20;
    const interval = duration / steps;
    let step = 0;

    const timer = setInterval(() => {
      step++;
      const progress = step / steps;
      setAnimatedValues({
        progression: Math.round(progression * progress),
        sessions: Math.round(sessions * progress),
        points: Math.round(totalPoints * progress),
        streak: Math.round(currentStreak * progress),
      });
      if (step >= steps) clearInterval(timer);
    }, interval);

    // Save current stats
    const today = new Date().toISOString().split('T')[0];
    const currentStats: StatsHistory = {
      date: today,
      progression,
      sessions,
      points: totalPoints,
      streak: currentStreak,
    };

    const storedHistory = stored ? JSON.parse(stored) : [];
    const updatedHistory = [
      currentStats,
      ...storedHistory.filter((h: StatsHistory) => h.date !== today).slice(0, 29),
    ];
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedHistory));

    return () => clearInterval(timer);
  }, [energy, streak, points]);

  const getTrend = (current: number, previous: number | undefined) => {
    if (previous === undefined) return 'none';
    if (current > previous) return 'up';
    if (current < previous) return 'down';
    return 'same';
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up': return <TrendingUp className="w-3 h-3 text-green-500" />;
      case 'down': return <TrendingDown className="w-3 h-3 text-red-500" />;
      default: return <Minus className="w-3 h-3 text-muted-foreground" />;
    }
  };

  const stats = [
    {
      label: 'Progression',
      sublabel: 'Cette semaine',
      value: animatedValues.progression,
      displayValue: `${animatedValues.progression}%`,
      previousValue: previousStats?.progression,
      color: 'text-blue-500',
      bgColor: 'bg-blue-500/10',
      icon: <Target className="w-5 h-5" />,
      showProgress: true,
      progress: animatedValues.progression
    },
    {
      label: 'Sessions',
      sublabel: 'Ce mois-ci',
      value: animatedValues.sessions,
      displayValue: animatedValues.sessions,
      previousValue: previousStats?.sessions,
      color: 'text-green-500',
      bgColor: 'bg-green-500/10',
      icon: <Zap className="w-5 h-5" />,
    },
    {
      label: 'Points',
      sublabel: 'Total',
      value: animatedValues.points,
      displayValue: animatedValues.points.toLocaleString(),
      previousValue: previousStats?.points,
      color: 'text-purple-500',
      bgColor: 'bg-purple-500/10',
      icon: <Trophy className="w-5 h-5" />,
    },
    {
      label: 'Série',
      sublabel: 'Jours consécutifs',
      value: animatedValues.streak,
      displayValue: animatedValues.streak,
      previousValue: previousStats?.streak,
      color: 'text-orange-500',
      bgColor: 'bg-orange-500/10',
      icon: <Flame className="w-5 h-5" />,
      isStreak: true,
    }
  ];

  return (
    <TooltipProvider>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => {
          const trend = getTrend(stat.value, stat.previousValue);
          const diff = stat.previousValue !== undefined 
            ? stat.value - stat.previousValue 
            : 0;

          return (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className={cn('border-none relative overflow-hidden group', stat.bgColor)}>
                {/* Background animation for streak */}
                {stat.isStreak && stat.value > 0 && (
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-orange-500/5 to-red-500/5"
                    animate={{ opacity: [0.3, 0.6, 0.3] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  />
                )}

                <CardContent className="pt-6 pb-4 relative">
                  <div className="space-y-2">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <span className={stat.color}>{stat.icon}</span>
                          <p className="text-sm font-medium text-foreground/80">
                            {stat.label}
                          </p>
                        </div>
                        <p className="text-xs text-muted-foreground">
                          {stat.sublabel}
                        </p>
                      </div>
                      
                      <div className="text-right">
                        <motion.p 
                          className={cn('text-3xl font-bold tabular-nums', stat.color)}
                          key={stat.displayValue}
                        >
                          {stat.displayValue}
                        </motion.p>
                        
                        {/* Trend indicator */}
                        {stat.previousValue !== undefined && (
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <div className="flex items-center justify-end gap-1 mt-1">
                                {getTrendIcon(trend)}
                                <span className={cn(
                                  'text-xs',
                                  trend === 'up' && 'text-green-500',
                                  trend === 'down' && 'text-red-500',
                                  trend === 'same' && 'text-muted-foreground'
                                )}>
                                  {diff > 0 ? `+${diff}` : diff === 0 ? '=' : diff}
                                </span>
                              </div>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p className="text-xs">
                                {trend === 'up' ? '📈 En hausse' : trend === 'down' ? '📉 En baisse' : '➡️ Stable'}
                                {' '}vs hier ({stat.previousValue})
                              </p>
                            </TooltipContent>
                          </Tooltip>
                        )}
                      </div>
                    </div>
                    
                    {stat.showProgress && (
                      <div className="space-y-1">
                        <Progress value={stat.progress} className="h-2" />
                        <div className="flex justify-between text-xs text-muted-foreground">
                          <span>0%</span>
                          <span>100%</span>
                        </div>
                      </div>
                    )}

                    {/* Streak milestones */}
                    {stat.isStreak && (
                      <div className="flex gap-1 mt-2">
                        {[3, 7, 14, 30].map((milestone) => (
                          <div
                            key={milestone}
                            className={cn(
                              'flex-1 h-1.5 rounded-full transition-colors',
                              stat.value >= milestone
                                ? 'bg-orange-500'
                                : 'bg-muted'
                            )}
                            title={`${milestone} jours`}
                          />
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Hover effect */}
                  <motion.div
                    className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity"
                  />
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>
    </TooltipProvider>
  );
};
