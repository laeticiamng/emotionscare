// @ts-nocheck
import { Sparkle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useHarmonyPoints } from '@/hooks/useHarmonyPoints';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

interface HarmonyPointsDisplayProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

/**
 * Affiche les Points Harmonie (monnaie interne)
 */
export const HarmonyPointsDisplay = ({ 
  className,
  size = 'md'
}: HarmonyPointsDisplayProps) => {
  const { points, isLoading } = useHarmonyPoints();

  if (isLoading || !points) return null;

  const sizeClasses = {
    sm: {
      icon: 'w-4 h-4',
      text: 'text-sm',
      badge: 'px-2 py-1 text-xs'
    },
    md: {
      icon: 'w-5 h-5',
      text: 'text-base',
      badge: 'px-3 py-1.5 text-sm'
    },
    lg: {
      icon: 'w-6 h-6',
      text: 'text-lg',
      badge: 'px-4 py-2 text-base'
    }
  };

  const styles = sizeClasses[size];

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div className={cn(
            'inline-flex items-center gap-2 bg-gradient-to-r from-purple-500/10 to-pink-500/10 rounded-full border border-purple-500/20',
            styles.badge,
            className
          )}>
            <Sparkle className={cn(styles.icon, 'text-purple-500 fill-purple-500')} />
            <span className={cn('font-bold tabular-nums', styles.text)}>
              {points.totalPoints.toLocaleString()}
            </span>
          </div>
        </TooltipTrigger>
        <TooltipContent side="bottom">
          <div className="space-y-2">
            <p className="font-semibold">
              ✨ Points Harmonie
            </p>
            <div className="text-xs space-y-1">
              <p>Points actuels : {points.totalPoints.toLocaleString()}</p>
              <p className="text-muted-foreground">
                Total gagné : {points.lifetimeEarned.toLocaleString()}
              </p>
              <p className="text-muted-foreground">
                Total dépensé : {points.lifetimeSpent.toLocaleString()}
              </p>
            </div>
            <div className="text-xs text-muted-foreground pt-2 border-t">
              <p>💡 Utilise tes points pour :</p>
              <ul className="list-disc list-inside pl-2 mt-1">
                <li>Débloquer des thèmes</li>
                <li>Musique premium</li>
                <li>Analyses avancées</li>
                <li>Offrir de l'énergie</li>
              </ul>
            </div>
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};
