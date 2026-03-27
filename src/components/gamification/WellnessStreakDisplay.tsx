// @ts-nocheck
import { useState } from 'react';
import { Flame, Award, Shield, Calendar, Check } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useWellnessStreak } from '@/hooks/useWellnessStreak';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { motion } from 'framer-motion';

interface WellnessStreakDisplayProps {
  className?: string;
  showCheckin?: boolean;
}

const STREAK_MILESTONES = [
  { days: 3, icon: '🌱', label: 'Début prometteur' },
  { days: 7, icon: '🔥', label: 'Semaine complète' },
  { days: 14, icon: '⭐', label: 'Deux semaines' },
  { days: 30, icon: '🏆', label: 'Un mois !' },
  { days: 60, icon: '💎', label: 'Deux mois' },
  { days: 100, icon: '👑', label: 'Centenaire' },
];

export const WellnessStreakDisplay = ({ 
  className,
  showCheckin = true
}: WellnessStreakDisplayProps) => {
  const { streak, hasCheckedInToday, isFrozen, checkin, isLoading } = useWellnessStreak();
  const [isCheckinLoading, setIsCheckinLoading] = useState(false);

  if (isLoading || !streak) return null;

  const handleCheckin = async () => {
    if (hasCheckedInToday) return;
    setIsCheckinLoading(true);
    await checkin();
    setIsCheckinLoading(false);
  };

  // Get current and next milestone
  const currentMilestone = [...STREAK_MILESTONES].reverse().find(m => streak.currentStreak >= m.days);
  const nextMilestone = STREAK_MILESTONES.find(m => m.days > streak.currentStreak);

  // Week view (last 7 days)
  const weekDays = ['L', 'M', 'M', 'J', 'V', 'S', 'D'];
  const today = new Date().getDay();
  const weekProgress = Array.from({ length: 7 }, (_, i) => {
    const dayIndex = (today - 6 + i + 7) % 7;
    // Mock: assume streak covers recent days
    const isCompleted = i >= 7 - Math.min(streak.currentStreak, 7);
    const isToday = i === 6;
    return { day: weekDays[dayIndex], isCompleted, isToday };
  });

  return (
    <TooltipProvider>
      <div className={cn('space-y-3', className)}>
        {/* Main Streak Display */}
        <div className="flex items-center gap-4">
          {/* Streak Counter */}
          <Tooltip>
            <TooltipTrigger asChild>
              <motion.div 
                className="flex items-center gap-2 cursor-help"
                whileHover={{ scale: 1.05 }}
              >
                <div className="relative">
                  <motion.div
                    animate={streak.currentStreak > 0 ? { 
                      scale: [1, 1.1, 1],
                    } : {}}
                    transition={{ duration: 1.5, repeat: Infinity }}
                  >
                    <Flame className={cn(
                      'w-10 h-10 transition-all',
                      streak.currentStreak > 0 
                        ? 'text-orange-500 fill-orange-500 drop-shadow-[0_0_8px_rgba(249,115,22,0.5)]' 
                        : 'text-muted-foreground'
                    )} />
                  </motion.div>
                  {isFrozen && (
                    <div className="absolute -top-1 -right-1">
                      <Shield className="w-4 h-4 text-blue-400 fill-blue-400/30" />
                    </div>
                  )}
                </div>
                <div>
                  <p className="text-3xl font-bold tabular-nums">
                    {streak.currentStreak}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    jour{streak.currentStreak !== 1 ? 's' : ''}
                  </p>
                </div>
              </motion.div>
            </TooltipTrigger>
            <TooltipContent side="bottom" className="max-w-xs">
              <div className="space-y-2">
                <p className="font-semibold">🔥 Série de bien-être</p>
                <p className="text-xs">Série actuelle : {streak.currentStreak} jours</p>
                <p className="text-xs">Record : {streak.longestStreak} jours</p>
                <p className="text-xs text-muted-foreground">Total : {streak.totalCheckins} check-ins</p>
                {isFrozen && (
                  <p className="text-xs text-blue-400">❄️ Protection active !</p>
                )}
              </div>
            </TooltipContent>
          </Tooltip>

          {/* Personal Record */}
          {streak.longestStreak > 0 && (
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="flex items-center gap-1 px-3 py-1.5 bg-gradient-to-r from-amber-500/10 to-orange-500/10 rounded-lg border border-amber-500/20">
                  <Award className="w-5 h-5 text-amber-500" />
                  <span className="font-bold text-amber-600">{streak.longestStreak}</span>
                </div>
              </TooltipTrigger>
              <TooltipContent>
                <p className="text-xs">🏆 Ton record personnel</p>
              </TooltipContent>
            </Tooltip>
          )}

          {/* Check-in Button */}
          {showCheckin && (
            <Button
              onClick={handleCheckin}
              disabled={hasCheckedInToday || isCheckinLoading}
              size="sm"
              variant={hasCheckedInToday ? 'outline' : 'default'}
              className={cn(
                'ml-auto transition-all',
                hasCheckedInToday && 'bg-green-500/10 border-green-500/30 text-green-600'
              )}
            >
              {isCheckinLoading ? (
                <span className="animate-spin">⏳</span>
              ) : hasCheckedInToday ? (
                <>
                  <Check className="w-4 h-4 mr-1" />
                  Fait !
                </>
              ) : (
                <>
                  <Calendar className="w-4 h-4 mr-1" />
                  Check-in
                </>
              )}
            </Button>
          )}
        </div>

        {/* Week View */}
        <div className="flex gap-1">
          {weekProgress.map((day, i) => (
            <Tooltip key={i}>
              <TooltipTrigger asChild>
                <div 
                  className={cn(
                    'flex-1 h-8 rounded flex items-center justify-center text-xs font-medium transition-all',
                    day.isCompleted 
                      ? 'bg-gradient-to-br from-orange-400 to-orange-600 text-white' 
                      : 'bg-muted text-muted-foreground',
                    day.isToday && !day.isCompleted && 'ring-2 ring-primary ring-offset-2'
                  )}
                >
                  {day.isCompleted ? <Check className="w-3 h-3" /> : day.day}
                </div>
              </TooltipTrigger>
              <TooltipContent>
                <p className="text-xs">
                  {day.isToday ? "Aujourd'hui" : day.day} - {day.isCompleted ? '✓ Complété' : 'Non complété'}
                </p>
              </TooltipContent>
            </Tooltip>
          ))}
        </div>

        {/* Milestones */}
        <div className="flex gap-1">
          {STREAK_MILESTONES.slice(0, 5).map((milestone) => (
            <Tooltip key={milestone.days}>
              <TooltipTrigger asChild>
                <div 
                  className={cn(
                    'flex-1 py-1 rounded text-center text-sm transition-all',
                    streak.currentStreak >= milestone.days
                      ? 'bg-gradient-to-br from-amber-400/20 to-orange-500/20 border border-amber-500/30'
                      : 'bg-muted/50 opacity-50'
                  )}
                >
                  {milestone.icon}
                </div>
              </TooltipTrigger>
              <TooltipContent>
                <p className="text-xs font-medium">{milestone.label}</p>
                <p className="text-xs text-muted-foreground">{milestone.days} jours</p>
                {streak.currentStreak >= milestone.days && (
                  <Badge variant="secondary" className="text-xs mt-1">✓ Débloqué</Badge>
                )}
              </TooltipContent>
            </Tooltip>
          ))}
        </div>

        {/* Next Milestone Progress */}
        {nextMilestone && (
          <div className="text-xs text-muted-foreground text-center">
            Plus que <span className="font-semibold text-foreground">{nextMilestone.days - streak.currentStreak}</span> jours pour "{nextMilestone.label}" {nextMilestone.icon}
          </div>
        )}
      </div>
    </TooltipProvider>
  );
};
