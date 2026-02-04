/**
 * Widget Streak de Journal Gamifié
 * Affiche la série de jours consécutifs d'écriture
 */

import { memo, useMemo } from 'react';
import { 
  Flame, 
  Calendar, 
  Award, 
  TrendingUp,
  Star,
  Zap
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface JournalStreakWidgetProps {
  currentStreak: number;
  longestStreak: number;
  totalEntries: number;
  entriesThisWeek: number;
  weeklyGoal?: number;
  lastEntryDate?: string;
  className?: string;
}

const STREAK_MILESTONES = [
  { days: 3, label: 'Bon début', icon: '🌱', color: 'text-green-500' },
  { days: 7, label: 'Une semaine', icon: '⭐', color: 'text-yellow-500' },
  { days: 14, label: 'Deux semaines', icon: '🔥', color: 'text-orange-500' },
  { days: 21, label: 'Habitude formée', icon: '💪', color: 'text-purple-500' },
  { days: 30, label: 'Un mois', icon: '🏆', color: 'text-amber-500' },
  { days: 60, label: 'Deux mois', icon: '💎', color: 'text-blue-500' },
  { days: 90, label: 'Trois mois', icon: '👑', color: 'text-indigo-500' },
  { days: 180, label: 'Six mois', icon: '🚀', color: 'text-pink-500' },
  { days: 365, label: 'Un an', icon: '🎖️', color: 'text-rose-500' },
];

export const JournalStreakWidget = memo(function JournalStreakWidget({
  currentStreak,
  longestStreak,
  totalEntries,
  entriesThisWeek,
  weeklyGoal = 5,
  lastEntryDate,
  className
}: JournalStreakWidgetProps) {
  const currentMilestone = useMemo(() => {
    return [...STREAK_MILESTONES].reverse().find(m => currentStreak >= m.days);
  }, [currentStreak]);

  const nextMilestone = useMemo(() => {
    return STREAK_MILESTONES.find(m => m.days > currentStreak);
  }, [currentStreak]);

  const weeklyProgress = Math.min((entriesThisWeek / weeklyGoal) * 100, 100);
  
  const streakStatus = useMemo(() => {
    if (!lastEntryDate) return 'none';
    const last = new Date(lastEntryDate);
    const today = new Date();
    const diffDays = Math.floor((today.getTime() - last.getTime()) / (1000 * 60 * 60 * 24));
    if (diffDays === 0) return 'today';
    if (diffDays === 1) return 'yesterday';
    return 'broken';
  }, [lastEntryDate]);

  const streakColor = currentStreak >= 7 
    ? 'text-orange-500' 
    : currentStreak >= 3 
      ? 'text-yellow-500' 
      : 'text-muted-foreground';

  return (
    <Card className={cn("border-border/50 overflow-hidden", className)}>
      {/* Animated background for active streak */}
      {currentStreak >= 3 && (
        <div className="absolute inset-0 bg-gradient-to-br from-orange-500/5 via-transparent to-yellow-500/5 pointer-events-none" />
      )}
      
      <CardHeader className="pb-2 relative">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className={cn(
              "p-2 rounded-full",
              currentStreak >= 7 ? "bg-orange-500/20" : "bg-muted"
            )}>
              <Flame className={cn("h-5 w-5", streakColor)} />
            </div>
            <div>
              <CardTitle className="text-base">Série d'écriture</CardTitle>
              <CardDescription className="text-xs">
                {streakStatus === 'today' && '✅ Écrit aujourd\'hui'}
                {streakStatus === 'yesterday' && '⚠️ Écrivez pour maintenir la série'}
                {streakStatus === 'broken' && '❌ Série interrompue'}
                {streakStatus === 'none' && 'Commencez votre série'}
              </CardDescription>
            </div>
          </div>
          {currentMilestone && (
            <Badge variant="secondary" className={cn("text-lg", currentMilestone.color)}>
              {currentMilestone.icon}
            </Badge>
          )}
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4 relative">
        {/* Main Streak Display */}
        <div className="flex items-center justify-center py-4">
          <div className="text-center">
            <div className={cn(
              "text-5xl font-bold tabular-nums",
              streakColor,
              currentStreak >= 7 && "animate-pulse"
            )}>
              {currentStreak}
            </div>
            <div className="text-sm text-muted-foreground mt-1">
              jour{currentStreak !== 1 ? 's' : ''} consécutif{currentStreak !== 1 ? 's' : ''}
            </div>
            {currentMilestone && (
              <Badge variant="outline" className="mt-2 text-xs">
                {currentMilestone.icon} {currentMilestone.label}
              </Badge>
            )}
          </div>
        </div>

        {/* Next Milestone Progress */}
        {nextMilestone && (
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="text-muted-foreground">Prochain palier</span>
              <span className="font-medium">
                {nextMilestone.icon} {nextMilestone.label} ({nextMilestone.days - currentStreak} jours)
              </span>
            </div>
            <Progress 
              value={(currentStreak / nextMilestone.days) * 100} 
              className="h-2"
            />
          </div>
        )}

        {/* Stats Grid */}
        <div className="grid grid-cols-3 gap-3 pt-2">
          <div className="text-center p-3 rounded-lg bg-muted/50">
            <TrendingUp className="h-4 w-4 mx-auto mb-1 text-blue-500" />
            <div className="text-lg font-bold">{longestStreak}</div>
            <div className="text-[10px] text-muted-foreground">Record</div>
          </div>
          <div className="text-center p-3 rounded-lg bg-muted/50">
            <Calendar className="h-4 w-4 mx-auto mb-1 text-green-500" />
            <div className="text-lg font-bold">{totalEntries}</div>
            <div className="text-[10px] text-muted-foreground">Total</div>
          </div>
          <div className="text-center p-3 rounded-lg bg-muted/50">
            <Zap className="h-4 w-4 mx-auto mb-1 text-yellow-500" />
            <div className="text-lg font-bold">{entriesThisWeek}/{weeklyGoal}</div>
            <div className="text-[10px] text-muted-foreground">Semaine</div>
          </div>
        </div>

        {/* Weekly Goal Progress */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="text-muted-foreground">Objectif hebdomadaire</span>
            <span className="font-medium">{Math.round(weeklyProgress)}%</span>
          </div>
          <Progress 
            value={weeklyProgress} 
            className={cn(
              "h-2",
              weeklyProgress >= 100 && "bg-green-500/20"
            )}
          />
          {weeklyProgress >= 100 && (
            <div className="text-xs text-green-600 flex items-center gap-1">
              <Star className="h-3 w-3" />
              Objectif atteint cette semaine !
            </div>
          )}
        </div>

        {/* Badges Earned */}
        {currentStreak >= 3 && (
          <div className="pt-2 border-t">
            <div className="text-xs font-medium text-muted-foreground mb-2 flex items-center gap-1">
              <Award className="h-3 w-3" />
              Badges obtenus
            </div>
            <div className="flex flex-wrap gap-2">
              {STREAK_MILESTONES.filter(m => currentStreak >= m.days).map((milestone) => (
                <Badge 
                  key={milestone.days} 
                  variant="secondary"
                  className={cn("text-xs", milestone.color)}
                >
                  {milestone.icon} {milestone.label}
                </Badge>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
});
