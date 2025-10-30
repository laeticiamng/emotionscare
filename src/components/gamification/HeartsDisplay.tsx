// @ts-nocheck
import { Heart } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useHearts } from '@/hooks/useHearts';
import { useEffect, useState } from 'react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

interface HeartsDisplayProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  showTimer?: boolean;
}

/**
 * Affiche le nombre de vies de l'utilisateur avec animation
 * Style inspiré de Duolingo
 */
export const HeartsDisplay = ({ 
  className, 
  size = 'md',
  showTimer = true 
}: HeartsDisplayProps) => {
  const { hearts, maxHearts, isFull, getTimeUntilNextHeart, isLoading } = useHearts();
  const [timeRemaining, setTimeRemaining] = useState('');

  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6'
  };

  // Formatter le temps restant
  const formatTime = (ms: number) => {
    const totalSeconds = Math.floor(ms / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  // Mettre à jour le timer
  useEffect(() => {
    if (isFull || !showTimer) return;

    const updateTimer = () => {
      const remaining = getTimeUntilNextHeart();
      if (remaining > 0) {
        setTimeRemaining(formatTime(remaining));
      } else {
        setTimeRemaining('');
      }
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);

    return () => clearInterval(interval);
  }, [isFull, getTimeUntilNextHeart, showTimer]);

  if (isLoading) {
    return null;
  }

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div className={cn('flex items-center gap-1.5', className)}>
            {Array.from({ length: maxHearts }).map((_, index) => {
              const isFilled = index < hearts;
              return (
                <Heart
                  key={index}
                  className={cn(
                    sizeClasses[size],
                    'transition-all duration-300',
                    isFilled
                      ? 'fill-red-500 text-red-500 scale-100'
                      : 'fill-none text-muted-foreground/30 scale-90'
                  )}
                />
              );
            })}
            {!isFull && showTimer && timeRemaining && (
              <span className="text-xs text-muted-foreground ml-1 font-mono">
                {timeRemaining}
              </span>
            )}
          </div>
        </TooltipTrigger>
        <TooltipContent side="bottom" className="max-w-xs">
          <div className="space-y-1">
            <p className="font-semibold">
              {hearts} / {maxHearts} vies
            </p>
            {!isFull && (
              <p className="text-xs text-muted-foreground">
                Une vie se régénère toutes les 30 minutes
              </p>
            )}
            {hearts === 0 && (
              <p className="text-xs text-destructive font-medium">
                Plus de vies ! Attendez la régénération ou gagnez-en en complétant des défis.
              </p>
            )}
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};
