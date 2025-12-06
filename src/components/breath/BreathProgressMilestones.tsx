import React, { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Trophy, Flame, Target, Star } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  earned: boolean;
  progress?: number;
  maxProgress?: number;
}

interface BreathProgressMilestonesProps {
  totalSessions: number;
  totalMinutes: number;
  currentStreak: number;
  weeklyMinutes: number;
}

const getMilestoneAchievements = (
  totalSessions: number,
  totalMinutes: number,
  currentStreak: number,
  weeklyMinutes: number
): Achievement[] => {
  return [
    {
      id: 'first_breath',
      name: 'Premier Souffle',
      description: 'Complète ta première séance',
      icon: <Trophy className="h-5 w-5" />,
      earned: totalSessions >= 1,
      progress: totalSessions,
      maxProgress: 1,
    },
    {
      id: 'breathing_streak_3',
      name: 'Souffle Régulier',
      description: '3 jours d\'affilée',
      icon: <Flame className="h-4 w-4" />,
      earned: currentStreak >= 3,
      progress: currentStreak,
      maxProgress: 3,
    },
    {
      id: 'breathing_streak_7',
      name: 'Une Semaine de Sérénité',
      description: '7 jours d\'affilée',
      icon: <Flame className="h-5 w-5" />,
      earned: currentStreak >= 7,
      progress: currentStreak,
      maxProgress: 7,
    },
    {
      id: 'breathing_sessions_10',
      name: 'Dix Respirations',
      description: '10 séances complétées',
      icon: <Trophy className="h-5 w-5" />,
      earned: totalSessions >= 10,
      progress: totalSessions,
      maxProgress: 10,
    },
    {
      id: 'breathing_sessions_25',
      name: 'Maître Respiratoire',
      description: '25 séances complétées',
      icon: <Trophy className="h-5 w-5" />,
      earned: totalSessions >= 25,
      progress: totalSessions,
      maxProgress: 25,
    },
    {
      id: 'breathing_time_30',
      name: 'Demi-Heure de Paix',
      description: '30 minutes de respiration totales',
      icon: <Target className="h-5 w-5" />,
      earned: totalMinutes >= 30,
      progress: totalMinutes,
      maxProgress: 30,
    },
    {
      id: 'breathing_time_100',
      name: 'Centime de Sérénité',
      description: '100 minutes de respiration',
      icon: <Star className="h-5 w-5" />,
      earned: totalMinutes >= 100,
      progress: totalMinutes,
      maxProgress: 100,
    },
    {
      id: 'weekly_warrior',
      name: 'Guerrier de la Semaine',
      description: '15 minutes cette semaine',
      icon: <Target className="h-5 w-5" />,
      earned: weeklyMinutes >= 15,
      progress: weeklyMinutes,
      maxProgress: 15,
    },
  ];
};

const AchievementCard: React.FC<{ achievement: Achievement }> = ({ achievement }) => {
  const progressPercent = achievement.maxProgress
    ? Math.min(100, (achievement.progress || 0) / achievement.maxProgress * 100)
    : 0;

  return (
    <div className={cn(
      'rounded-lg border-2 p-4 transition-all',
      achievement.earned
        ? 'border-amber-400/50 bg-amber-400/10'
        : 'border-slate-800/50 bg-slate-900/30 opacity-60'
    )}>
      <div className="flex items-start gap-3">
        <div className={cn(
          'rounded-lg p-2.5 transition-colors',
          achievement.earned
            ? 'bg-amber-500/30 text-amber-300'
            : 'bg-slate-800/50 text-slate-600'
        )}>
          {achievement.icon}
        </div>
        <div className="flex-1 min-w-0">
          <h4 className="font-semibold text-slate-100 text-sm">{achievement.name}</h4>
          <p className="text-xs text-slate-400 mt-0.5">{achievement.description}</p>

          {achievement.maxProgress && achievement.progress !== undefined && (
            <div className="mt-2">
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs text-slate-400">
                  {achievement.progress}/{achievement.maxProgress}
                </span>
              </div>
              <div className="h-2 rounded-full bg-slate-800/50 overflow-hidden">
                <div
                  className={cn(
                    'h-full transition-all rounded-full',
                    achievement.earned ? 'bg-amber-400' : 'bg-slate-600'
                  )}
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
            </div>
          )}
        </div>
        {achievement.earned && (
          <Badge className="bg-amber-500/30 text-amber-200 border-0 flex-shrink-0">✓</Badge>
        )}
      </div>
    </div>
  );
};

export const BreathProgressMilestones: React.FC<BreathProgressMilestonesProps> = ({
  totalSessions,
  totalMinutes,
  currentStreak,
  weeklyMinutes,
}) => {
  const achievements = useMemo(
    () => getMilestoneAchievements(totalSessions, totalMinutes, currentStreak, weeklyMinutes),
    [totalSessions, totalMinutes, currentStreak, weeklyMinutes]
  );

  const earnedCount = achievements.filter(a => a.earned).length;
  const nextMilestone = achievements.find(a => !a.earned);

  return (
    <Card className="border-slate-800/50 bg-slate-950/40" data-zero-number-check="true">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-lg font-semibold text-slate-100">Tes Exploits</CardTitle>
            <p className="text-sm text-slate-400 mt-1">
              {earnedCount}/{achievements.length} accomplissements débloqués
            </p>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-amber-400">{earnedCount}</div>
            <div className="text-xs text-slate-400">Trophées</div>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Next Milestone */}
        {nextMilestone && (
          <div className="rounded-lg border border-cyan-500/30 bg-cyan-500/10 p-4">
            <p className="text-xs font-medium text-cyan-400 mb-2">PROCHAIN OBJECTIF</p>
            <div className="flex items-start gap-3">
              <div className="rounded-lg p-2 bg-cyan-500/20 text-cyan-400 flex-shrink-0">
                {nextMilestone.icon}
              </div>
              <div>
                <p className="font-semibold text-slate-100 text-sm">{nextMilestone.name}</p>
                <p className="text-xs text-slate-400">{nextMilestone.description}</p>
                {nextMilestone.maxProgress && nextMilestone.progress !== undefined && (
                  <div className="mt-2 flex items-center gap-2">
                    <div className="flex-1 h-2 rounded-full bg-cyan-500/20 overflow-hidden">
                      <div
                        className="h-full bg-cyan-400 rounded-full transition-all"
                        style={{ width: `${Math.min(100, (nextMilestone.progress / nextMilestone.maxProgress) * 100)}%` }}
                      />
                    </div>
                    <span className="text-xs text-cyan-400 font-medium whitespace-nowrap">
                      {nextMilestone.progress}/{nextMilestone.maxProgress}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* All Achievements Grid */}
        <div className="grid gap-3">
          {achievements.map((achievement) => (
            <AchievementCard key={achievement.id} achievement={achievement} />
          ))}
        </div>

        {earnedCount === achievements.length && (
          <div className="rounded-lg border border-amber-500/30 bg-amber-500/10 p-4 text-center">
            <p className="text-sm font-semibold text-amber-200">
              🎉 Félicitations ! Tu as débloqué tous les exploits !
            </p>
            <p className="text-xs text-amber-300/70 mt-1">
              Continue à respirer pour maintenir ta série
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
