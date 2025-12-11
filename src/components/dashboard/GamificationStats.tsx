// @ts-nocheck
import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useEmotionalEnergy } from '@/hooks/useEmotionalEnergy';
import { useWellnessStreak } from '@/hooks/useWellnessStreak';
import { useHarmonyPoints } from '@/hooks/useHarmonyPoints';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  TrendingUp, TrendingDown, Minus, Flame, Zap, Trophy, Target,
  Share2, Settings, ChevronRight, Sparkles, Award, BarChart3
} from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';

const STORAGE_KEY = 'emotionscare_stats_history';
const GOALS_KEY = 'emotionscare_gamification_goals';

interface StatsHistory {
  date: string;
  progression: number;
  sessions: number;
  points: number;
  streak: number;
}

interface PersonalGoals {
  weeklySessionsTarget: number;
  weeklyPointsTarget: number;
  streakTarget: number;
}

const DEFAULT_GOALS: PersonalGoals = {
  weeklySessionsTarget: 10,
  weeklyPointsTarget: 500,
  streakTarget: 7,
};

/**
 * Dashboard de stats de gamification (style Duolingo)
 * Affiche Progression, Sessions, Points, Série avec tendances
 */
export const GamificationStats = () => {
  const { energy } = useEmotionalEnergy();
  const { streak } = useWellnessStreak();
  const { points } = useHarmonyPoints();
  const [previousStats, setPreviousStats] = useState<StatsHistory | null>(null);
  const [statsHistory, setStatsHistory] = useState<StatsHistory[]>([]);
  const [personalGoals, setPersonalGoals] = useState<PersonalGoals>(DEFAULT_GOALS);
  const [showGoalsDialog, setShowGoalsDialog] = useState(false);
  const [selectedStat, setSelectedStat] = useState<string | null>(null);
  const [animatedValues, setAnimatedValues] = useState({
    progression: 0,
    sessions: 0,
    points: 0,
    streak: 0,
  });
  const { toast } = useToast();

  // Load previous stats and animate values
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        const history: StatsHistory[] = JSON.parse(stored);
        setStatsHistory(history);
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        const yesterdayStr = yesterday.toISOString().split('T')[0];
        const prev = history.find(h => h.date === yesterdayStr);
        if (prev) setPreviousStats(prev);
      } catch (e) {
        // Invalid data
      }
    }

    // Load personal goals
    const storedGoals = localStorage.getItem(GOALS_KEY);
    if (storedGoals) {
      try {
        setPersonalGoals(JSON.parse(storedGoals));
      } catch (e) {
        // Use default
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
    setStatsHistory(updatedHistory);

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

  // Generate sparkline data from history
  const getSparklineData = (key: keyof StatsHistory) => {
    return statsHistory
      .slice(0, 7)
      .reverse()
      .map(h => h[key] as number);
  };

  // Simple SVG sparkline component
  const Sparkline = ({ data, color }: { data: number[]; color: string }) => {
    if (data.length < 2) return null;
    const max = Math.max(...data, 1);
    const min = Math.min(...data, 0);
    const range = max - min || 1;
    const width = 60;
    const height = 20;
    const points = data.map((value, i) => {
      const x = (i / (data.length - 1)) * width;
      const y = height - ((value - min) / range) * height;
      return `${x},${y}`;
    }).join(' ');

    return (
      <svg width={width} height={height} className="opacity-60">
        <polyline
          fill="none"
          stroke={color}
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          points={points}
        />
      </svg>
    );
  };

  // Save goals
  const saveGoals = (goals: PersonalGoals) => {
    setPersonalGoals(goals);
    localStorage.setItem(GOALS_KEY, JSON.stringify(goals));
    setShowGoalsDialog(false);
    toast({
      title: '🎯 Objectifs mis à jour !',
      description: 'Vos nouveaux objectifs ont été enregistrés.',
    });
  };

  // Share stats
  const shareStats = async () => {
    const text = `🏆 Mes stats EmotionsCare:\n• Progression: ${animatedValues.progression}%\n• Sessions: ${animatedValues.sessions}\n• Points: ${animatedValues.points}\n• Série: ${animatedValues.streak} jours\n\n#EmotionsCare #BienEtre`;
    
    if (navigator.share) {
      try {
        await navigator.share({ text });
      } catch (e) {
        // User cancelled
      }
    } else {
      await navigator.clipboard.writeText(text);
      toast({
        title: '📋 Copié !',
        description: 'Les stats ont été copiées dans le presse-papier.',
      });
    }
  };

  const stats = [
    {
      id: 'progression',
      label: 'Progression',
      sublabel: 'Cette semaine',
      value: animatedValues.progression,
      displayValue: `${animatedValues.progression}%`,
      previousValue: previousStats?.progression,
      color: 'text-blue-500',
      bgColor: 'bg-blue-500/10',
      sparklineColor: '#3b82f6',
      icon: <Target className="w-5 h-5" />,
      showProgress: true,
      progress: animatedValues.progression,
      goalValue: 100,
      goalLabel: 'Objectif: 100%',
    },
    {
      id: 'sessions',
      label: 'Sessions',
      sublabel: 'Ce mois-ci',
      value: animatedValues.sessions,
      displayValue: animatedValues.sessions,
      previousValue: previousStats?.sessions,
      color: 'text-green-500',
      bgColor: 'bg-green-500/10',
      sparklineColor: '#22c55e',
      icon: <Zap className="w-5 h-5" />,
      goalValue: personalGoals.weeklySessionsTarget,
      goalLabel: `Objectif: ${personalGoals.weeklySessionsTarget}/sem`,
    },
    {
      id: 'points',
      label: 'Points',
      sublabel: 'Total',
      value: animatedValues.points,
      displayValue: animatedValues.points.toLocaleString(),
      previousValue: previousStats?.points,
      color: 'text-purple-500',
      bgColor: 'bg-purple-500/10',
      sparklineColor: '#a855f7',
      icon: <Trophy className="w-5 h-5" />,
      goalValue: personalGoals.weeklyPointsTarget,
      goalLabel: `Objectif: ${personalGoals.weeklyPointsTarget}/sem`,
    },
    {
      id: 'streak',
      label: 'Série',
      sublabel: 'Jours consécutifs',
      value: animatedValues.streak,
      displayValue: animatedValues.streak,
      previousValue: previousStats?.streak,
      color: 'text-orange-500',
      bgColor: 'bg-orange-500/10',
      sparklineColor: '#f97316',
      icon: <Flame className="w-5 h-5" />,
      isStreak: true,
      goalValue: personalGoals.streakTarget,
      goalLabel: `Objectif: ${personalGoals.streakTarget} jours`,
    }
  ];

  return (
    <TooltipProvider>
      <div className="space-y-3">
        {/* Header with actions */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-primary" />
            <h3 className="font-semibold">Statistiques</h3>
          </div>
          <div className="flex items-center gap-1">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="icon" onClick={shareStats}>
                  <Share2 className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Partager mes stats</TooltipContent>
            </Tooltip>
            <Dialog open={showGoalsDialog} onOpenChange={setShowGoalsDialog}>
              <DialogTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Settings className="h-4 w-4" />
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>🎯 Mes objectifs personnels</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="sessions-goal">Sessions par semaine</Label>
                    <Input
                      id="sessions-goal"
                      type="number"
                      min={1}
                      max={50}
                      defaultValue={personalGoals.weeklySessionsTarget}
                      onChange={(e) => setPersonalGoals(prev => ({ 
                        ...prev, 
                        weeklySessionsTarget: parseInt(e.target.value) || 10 
                      }))}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="points-goal">Points par semaine</Label>
                    <Input
                      id="points-goal"
                      type="number"
                      min={100}
                      max={5000}
                      step={100}
                      defaultValue={personalGoals.weeklyPointsTarget}
                      onChange={(e) => setPersonalGoals(prev => ({ 
                        ...prev, 
                        weeklyPointsTarget: parseInt(e.target.value) || 500 
                      }))}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="streak-goal">Objectif série (jours)</Label>
                    <Input
                      id="streak-goal"
                      type="number"
                      min={1}
                      max={365}
                      defaultValue={personalGoals.streakTarget}
                      onChange={(e) => setPersonalGoals(prev => ({ 
                        ...prev, 
                        streakTarget: parseInt(e.target.value) || 7 
                      }))}
                    />
                  </div>
                  <Button onClick={() => saveGoals(personalGoals)} className="w-full">
                    Enregistrer les objectifs
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((stat, index) => {
            const trend = getTrend(stat.value, stat.previousValue);
            const diff = stat.previousValue !== undefined 
              ? stat.value - stat.previousValue 
              : 0;
            const sparklineData = getSparklineData(stat.id as keyof StatsHistory);
            const goalProgress = stat.goalValue ? Math.min((stat.value / stat.goalValue) * 100, 100) : 0;

            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Dialog>
                  <DialogTrigger asChild>
                    <Card className={cn(
                      'border-none relative overflow-hidden group cursor-pointer transition-all hover:scale-[1.02]', 
                      stat.bgColor
                    )}>
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
                              {/* Sparkline */}
                              {sparklineData.length >= 2 && (
                                <div className="mt-2">
                                  <Sparkline data={sparklineData} color={stat.sparklineColor} />
                                </div>
                              )}
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

                          {/* Goal progress (for non-progression stats) */}
                          {!stat.showProgress && stat.goalValue && (
                            <div className="space-y-1">
                              <div className="flex justify-between text-xs text-muted-foreground">
                                <span>{stat.goalLabel}</span>
                                <span>{Math.round(goalProgress)}%</span>
                              </div>
                              <Progress value={goalProgress} className="h-1.5" />
                            </div>
                          )}

                          {/* Streak milestones */}
                          {stat.isStreak && (
                            <div className="flex gap-1 mt-2">
                              {[3, 7, 14, 30].map((milestone) => (
                                <Tooltip key={milestone}>
                                  <TooltipTrigger asChild>
                                    <div
                                      className={cn(
                                        'flex-1 h-1.5 rounded-full transition-colors',
                                        stat.value >= milestone
                                          ? 'bg-orange-500'
                                          : 'bg-muted'
                                      )}
                                    />
                                  </TooltipTrigger>
                                  <TooltipContent>
                                    <p>{milestone} jours {stat.value >= milestone ? '✓' : ''}</p>
                                  </TooltipContent>
                                </Tooltip>
                              ))}
                            </div>
                          )}

                          {/* Click hint */}
                          <div className="absolute bottom-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            <ChevronRight className="h-4 w-4 text-muted-foreground" />
                          </div>
                        </div>

                        {/* Hover effect */}
                        <motion.div
                          className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity"
                        />
                      </CardContent>
                    </Card>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle className="flex items-center gap-2">
                        <span className={stat.color}>{stat.icon}</span>
                        {stat.label} - Détails
                      </DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                      {/* Current value */}
                      <div className="text-center p-4 bg-muted/30 rounded-lg">
                        <p className={cn('text-4xl font-bold', stat.color)}>
                          {stat.displayValue}
                        </p>
                        <p className="text-sm text-muted-foreground">{stat.sublabel}</p>
                      </div>

                      {/* 7-day history */}
                      <div>
                        <h4 className="font-medium mb-2 flex items-center gap-2">
                          <BarChart3 className="h-4 w-4" />
                          Évolution sur 7 jours
                        </h4>
                        <div className="flex items-end gap-1 h-20">
                          {sparklineData.map((value, i) => {
                            const max = Math.max(...sparklineData, 1);
                            const height = (value / max) * 100;
                            return (
                              <Tooltip key={i}>
                                <TooltipTrigger asChild>
                                  <div 
                                    className={cn(
                                      'flex-1 rounded-t transition-all hover:opacity-80',
                                      stat.bgColor.replace('/10', '/40')
                                    )}
                                    style={{ height: `${Math.max(height, 5)}%` }}
                                  />
                                </TooltipTrigger>
                                <TooltipContent>
                                  <p>Jour {i + 1}: {value}</p>
                                </TooltipContent>
                              </Tooltip>
                            );
                          })}
                        </div>
                      </div>

                      {/* Goal progress */}
                      {stat.goalValue && (
                        <div className="p-3 bg-primary/5 rounded-lg">
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-sm font-medium">Progression objectif</span>
                            <Badge variant={goalProgress >= 100 ? 'default' : 'outline'}>
                              {goalProgress >= 100 ? '🎉 Atteint !' : `${Math.round(goalProgress)}%`}
                            </Badge>
                          </div>
                          <Progress value={goalProgress} className="h-2" />
                          <p className="text-xs text-muted-foreground mt-1">
                            {stat.goalLabel}
                          </p>
                        </div>
                      )}

                      {/* Achievements hint */}
                      <div className="flex items-center gap-2 p-3 bg-muted/30 rounded-lg">
                        <Award className="h-5 w-5 text-yellow-500" />
                        <div>
                          <p className="text-sm font-medium">Prochain palier</p>
                          <p className="text-xs text-muted-foreground">
                            {stat.isStreak 
                              ? `${Math.ceil((stat.value + 1) / 7) * 7} jours de série`
                              : `${Math.ceil((stat.value + 1) / 100) * 100} ${stat.label.toLowerCase()}`
                            }
                          </p>
                        </div>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
              </motion.div>
            );
          })}
        </div>
      </div>
    </TooltipProvider>
  );
};
