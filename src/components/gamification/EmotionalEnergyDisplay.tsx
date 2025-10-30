// @ts-nocheck
import { Sparkles, Zap } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useEmotionalEnergy } from '@/hooks/useEmotionalEnergy';
import { Progress } from '@/components/ui/progress';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

interface EmotionalEnergyDisplayProps {
  className?: string;
  showLabel?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

/**
 * Affiche l'énergie émotionnelle de l'utilisateur
 */
export const EmotionalEnergyDisplay = ({ 
  className, 
  showLabel = true,
  size = 'md'
}: EmotionalEnergyDisplayProps) => {
  const { energy, isLow, isFull, timeUntilRefill, isLoading } = useEmotionalEnergy();

  if (isLoading || !energy) return null;

  const percentage = (energy.currentEnergy / energy.maxEnergy) * 100;

  const formatTime = (ms: number) => {
    const hours = Math.floor(ms / (60 * 60 * 1000));
    const minutes = Math.floor((ms % (60 * 60 * 1000)) / (60 * 1000));
    return `${hours}h ${minutes}m`;
  };

  const sizeClasses = {
    sm: 'text-xs',
    md: 'text-sm',
    lg: 'text-base'
  };

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div className={cn('flex items-center gap-3', className)}>
            {/* Icon */}
            <div className={cn(
              'relative',
              size === 'sm' && 'w-8 h-8',
              size === 'md' && 'w-10 h-10',
              size === 'lg' && 'w-12 h-12'
            )}>
              <div className={cn(
                'absolute inset-0 rounded-full transition-all',
                isFull && 'bg-gradient-to-br from-purple-500/20 to-pink-500/20 animate-pulse',
                isLow && 'bg-gradient-to-br from-amber-500/20 to-red-500/20'
              )}>
                {isFull ? (
                  <Sparkles className={cn(
                    'text-purple-500 absolute inset-0 m-auto',
                    size === 'sm' && 'w-4 h-4',
                    size === 'md' && 'w-5 h-5',
                    size === 'lg' && 'w-6 h-6'
                  )} />
                ) : (
                  <Zap className={cn(
                    'absolute inset-0 m-auto',
                    isLow ? 'text-amber-500' : 'text-primary',
                    size === 'sm' && 'w-4 h-4',
                    size === 'md' && 'w-5 h-5',
                    size === 'lg' && 'w-6 h-6'
                  )} />
                )}
              </div>
            </div>

            {/* Info */}
            <div className="flex-1 min-w-0">
              {showLabel && (
                <p className={cn('font-medium', sizeClasses[size])}>
                  Énergie Émotionnelle
                </p>
              )}
              <div className="flex items-center gap-2">
                <Progress 
                  value={percentage} 
                  className={cn(
                    'flex-1',
                    size === 'sm' && 'h-1.5',
                    size === 'md' && 'h-2',
                    size === 'lg' && 'h-3'
                  )}
                />
                <span className={cn(
                  'font-bold tabular-nums',
                  sizeClasses[size],
                  isLow && 'text-amber-500',
                  isFull && 'text-purple-500'
                )}>
                  {energy.currentEnergy}/{energy.maxEnergy}
                </span>
              </div>
            </div>
          </div>
        </TooltipTrigger>
        <TooltipContent side="bottom" className="max-w-xs">
          <div className="space-y-2">
            <p className="font-semibold">
              {energy.currentEnergy} / {energy.maxEnergy} points d'énergie
            </p>
            
            {isFull ? (
              <p className="text-xs text-success">
                ✨ Énergie au maximum ! Tu es prêt(e) pour toutes les activités.
              </p>
            ) : isLow ? (
              <p className="text-xs text-amber-500">
                ⚡ Énergie basse. Prends une pause ou utilise un boost émotionnel.
              </p>
            ) : (
              <p className="text-xs text-muted-foreground">
                Prochaine recharge dans {formatTime(timeUntilRefill)}
              </p>
            )}

            <div className="text-xs text-muted-foreground pt-2 border-t">
              <p>💡 Recharge automatique : 1 point toutes les 4h</p>
              <p>✨ Gagne de l'énergie en complétant des quêtes</p>
            </div>
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};
