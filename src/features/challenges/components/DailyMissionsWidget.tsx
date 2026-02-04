/**
 * DailyMissionsWidget - Widget des missions quotidiennes
 */

import React, { memo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Flame, Gift, CheckCircle2, Circle, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

export interface DailyMission {
  id: string;
  title: string;
  icon: string;
  completed: boolean;
  xpReward: number;
}

export interface DailyMissionsData {
  missions: DailyMission[];
  streakDays: number;
  bonusXP: number;
  allCompletedBonus: number;
  resetAt: string;
}

interface DailyMissionsWidgetProps {
  data: DailyMissionsData;
  onMissionClick?: (mission: DailyMission) => void;
  onClaimBonus?: () => void;
  className?: string;
}

export const DailyMissionsWidget = memo(function DailyMissionsWidget({
  data,
  onMissionClick,
  onClaimBonus,
  className
}: DailyMissionsWidgetProps) {
  const completedCount = data.missions.filter(m => m.completed).length;
  const totalMissions = data.missions.length;
  const allCompleted = completedCount === totalMissions;
  const progress = (completedCount / totalMissions) * 100;

  return (
    <Card className={cn('', className)}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg flex items-center gap-2">
            <span role="img" aria-label="missions">🎯</span>
            Missions du Jour
          </CardTitle>
          <div className="flex items-center gap-2">
            <Badge 
              variant="outline" 
              className="bg-orange-100 text-orange-700 dark:bg-orange-950 dark:text-orange-400"
            >
              <Flame className="w-3 h-3 mr-1" aria-hidden="true" />
              {data.streakDays} jours
            </Badge>
          </div>
        </div>

        {/* Barre de progression globale */}
        <div className="space-y-1 mt-2">
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>{completedCount}/{totalMissions} missions</span>
            <span>+{data.allCompletedBonus} XP bonus si tout complété</span>
          </div>
          <Progress 
            value={progress} 
            className="h-2"
            aria-label={`${completedCount} missions sur ${totalMissions} complétées`}
          />
        </div>
      </CardHeader>

      <CardContent className="space-y-2">
        {/* Liste des missions */}
        {data.missions.map(mission => (
          <div
            key={mission.id}
            className={cn(
              'flex items-center justify-between p-3 rounded-lg transition-colors',
              mission.completed 
                ? 'bg-green-50 dark:bg-green-950/20' 
                : 'bg-muted/50 hover:bg-muted cursor-pointer'
            )}
            onClick={() => !mission.completed && onMissionClick?.(mission)}
            onKeyDown={(e) => {
              if ((e.key === 'Enter' || e.key === ' ') && !mission.completed) {
                onMissionClick?.(mission);
              }
            }}
            role="button"
            tabIndex={mission.completed ? -1 : 0}
            aria-label={`Mission: ${mission.title}${mission.completed ? ' - Complétée' : ''}`}
          >
            <div className="flex items-center gap-3">
              {mission.completed ? (
                <CheckCircle2 className="w-5 h-5 text-green-500" aria-hidden="true" />
              ) : (
                <Circle className="w-5 h-5 text-muted-foreground" aria-hidden="true" />
              )}
              <span 
                className="text-xl" 
                role="img" 
                aria-hidden="true"
              >
                {mission.icon}
              </span>
              <span className={cn(
                'font-medium',
                mission.completed && 'line-through text-muted-foreground'
              )}>
                {mission.title}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <Badge 
                variant={mission.completed ? 'outline' : 'secondary'}
                className={cn(
                  mission.completed && 'bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-400'
                )}
              >
                +{mission.xpReward} XP
              </Badge>
              {!mission.completed && (
                <ChevronRight className="w-4 h-4 text-muted-foreground" aria-hidden="true" />
              )}
            </div>
          </div>
        ))}

        {/* Bonus de complétion */}
        {allCompleted && (
          <div className="mt-4 p-4 rounded-lg bg-gradient-to-r from-primary/10 to-primary/5 border border-primary/20">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Gift className="w-6 h-6 text-primary" aria-hidden="true" />
                <div>
                  <p className="font-semibold">Toutes les missions complétées !</p>
                  <p className="text-sm text-muted-foreground">
                    Réclamez votre bonus quotidien
                  </p>
                </div>
              </div>
              <Button onClick={onClaimBonus} aria-label={`Réclamer ${data.allCompletedBonus} XP bonus`}>
                +{data.allCompletedBonus} XP
              </Button>
            </div>
          </div>
        )}

        {/* Timer de reset */}
        <p className="text-xs text-center text-muted-foreground pt-2">
          Réinitialisation à minuit
        </p>
      </CardContent>
    </Card>
  );
});

export default DailyMissionsWidget;
