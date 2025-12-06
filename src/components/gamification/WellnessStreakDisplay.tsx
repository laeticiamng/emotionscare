// @ts-nocheck
import { Flame, Award } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useWellnessStreak } from '@/hooks/useWellnessStreak';
import { Button } from '@/components/ui/button';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

interface WellnessStreakDisplayProps {
  className?: string;
  showCheckin?: boolean;
}

/**
 * Affiche la série (streak) de bien-être
 */
export const WellnessStreakDisplay = ({ 
  className,
  showCheckin = true
}: WellnessStreakDisplayProps) => {
  const { streak, hasCheckedInToday, isFrozen, checkin, isLoading } = useWellnessStreak();

  if (isLoading || !streak) return null;

  const handleCheckin = async () => {
    if (hasCheckedInToday) return;
    await checkin();
  };

  return (
    <TooltipProvider>
      <div className={cn('flex items-center gap-4', className)}>
        {/* Streak Counter */}
        <Tooltip>
          <TooltipTrigger asChild>
            <div className="flex items-center gap-2">
              <div className="relative">
                <Flame className={cn(
                  'w-8 h-8 transition-all',
                  streak.currentStreak > 0 
                    ? 'text-orange-500 fill-orange-500' 
                    : 'text-muted-foreground'
                )} />
                {isFrozen && (
                  <div className="absolute -top-1 -right-1 w-3 h-3 bg-blue-400 rounded-full border-2 border-background" />
                )}
              </div>
              <div>
                <p className="text-2xl font-bold tabular-nums">
                  {streak.currentStreak}
                </p>
                <p className="text-xs text-muted-foreground">
                  {streak.currentStreak === 0 ? 'Série' : streak.currentStreak === 1 ? 'jour' : 'jours'}
                </p>
              </div>
            </div>
          </TooltipTrigger>
          <TooltipContent side="bottom">
            <div className="space-y-2">
              <p className="font-semibold">
                🔥 Série de bien-être
              </p>
              <p className="text-xs">
                Série actuelle : {streak.currentStreak} jour{streak.currentStreak > 1 ? 's' : ''}
              </p>
              <p className="text-xs">
                Record : {streak.longestStreak} jour{streak.longestStreak > 1 ? 's' : ''}
              </p>
              <p className="text-xs text-muted-foreground">
                Total check-ins : {streak.totalCheckins}
              </p>
              {isFrozen && (
                <p className="text-xs text-blue-400">
                  ❄️ Série protégée !
                </p>
              )}
            </div>
          </TooltipContent>
        </Tooltip>

        {/* Personal Record */}
        {streak.longestStreak > 0 && (
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="flex items-center gap-1 px-2 py-1 bg-muted rounded-md">
                <Award className="w-4 h-4 text-amber-500" />
                <span className="text-xs font-medium">{streak.longestStreak}</span>
              </div>
            </TooltipTrigger>
            <TooltipContent>
              <p className="text-xs">Ton record personnel</p>
            </TooltipContent>
          </Tooltip>
        )}

        {/* Check-in Button */}
        {showCheckin && (
          <Button
            onClick={handleCheckin}
            disabled={hasCheckedInToday}
            size="sm"
            variant={hasCheckedInToday ? 'outline' : 'default'}
            className={cn(
              'ml-auto',
              hasCheckedInToday && 'opacity-50'
            )}
          >
            {hasCheckedInToday ? (
              <>✓ Check-in fait</>
            ) : (
              <>📅 Check-in</>
            )}
          </Button>
        )}
      </div>
    </TooltipProvider>
  );
};
