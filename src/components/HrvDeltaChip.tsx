import React, { useState } from 'react';
import { TrendingUp, TrendingDown, Minus, Info, Heart } from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';

interface HrvDeltaChipProps {
  delta: number;
  previousDelta?: number;
  showTrend?: boolean;
  showTooltip?: boolean;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const HrvDeltaChip: React.FC<HrvDeltaChipProps> = ({
  delta,
  previousDelta,
  showTrend = true,
  showTooltip = true,
  size = 'md',
  className,
}) => {
  const [isHovered, setIsHovered] = useState(false);

  // Determine status based on delta value
  const getStatus = () => {
    if (delta >= 10) return 'excellent';
    if (delta >= 5) return 'good';
    if (delta >= 0) return 'neutral';
    if (delta >= -5) return 'low';
    return 'critical';
  };

  const status = getStatus();

  // Color schemes based on status
  const colorSchemes = {
    excellent: 'bg-emerald-100 text-emerald-700 border-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-400 dark:border-emerald-800',
    good: 'bg-green-100 text-green-700 border-green-200 dark:bg-green-900/30 dark:text-green-400 dark:border-green-800',
    neutral: 'bg-slate-100 text-slate-700 border-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700',
    low: 'bg-amber-100 text-amber-700 border-amber-200 dark:bg-amber-900/30 dark:text-amber-400 dark:border-amber-800',
    critical: 'bg-red-100 text-red-700 border-red-200 dark:bg-red-900/30 dark:text-red-400 dark:border-red-800',
  };

  // Size variants
  const sizeClasses = {
    sm: 'px-2 py-0.5 text-xs gap-1',
    md: 'px-3 py-1 text-sm gap-1.5',
    lg: 'px-4 py-1.5 text-base gap-2',
  };

  const iconSizes = {
    sm: 'h-3 w-3',
    md: 'h-4 w-4',
    lg: 'h-5 w-5',
  };

  // Calculate trend from previous delta
  const getTrend = () => {
    if (previousDelta === undefined) return null;
    const diff = delta - previousDelta;
    if (diff > 2) return 'up';
    if (diff < -2) return 'down';
    return 'stable';
  };

  const trend = getTrend();

  // Trend icon component
  const TrendIcon = () => {
    if (!showTrend || !trend) return null;
    
    const icons = {
      up: <TrendingUp className={cn(iconSizes[size], 'text-emerald-500')} />,
      down: <TrendingDown className={cn(iconSizes[size], 'text-red-500')} />,
      stable: <Minus className={cn(iconSizes[size], 'text-slate-400')} />,
    };

    return icons[trend];
  };

  // Status labels for tooltip
  const statusLabels = {
    excellent: 'Excellent - Votre HRV est très élevé',
    good: 'Bon - Votre HRV est dans une bonne plage',
    neutral: 'Normal - Variabilité cardiaque stable',
    low: 'Attention - HRV légèrement bas',
    critical: 'Alerte - HRV significativement bas',
  };

  // Recommendations based on status
  const recommendations = {
    excellent: 'Continuez ainsi ! Votre récupération est optimale.',
    good: 'Bonne forme ! Maintenez vos habitudes actuelles.',
    neutral: 'État stable. Une session de respiration pourrait aider.',
    low: 'Pensez à vous reposer et faire une session de cohérence.',
    critical: 'Repos recommandé. Évitez les efforts intenses.',
  };

  const sign = delta >= 0 ? '+' : '';

  const chipContent = (
    <span
      className={cn(
        'inline-flex items-center rounded-full border font-medium transition-all duration-200',
        colorSchemes[status],
        sizeClasses[size],
        isHovered && 'scale-105 shadow-sm',
        className
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Heart className={cn(iconSizes[size], 'animate-pulse')} />
      <span className="font-semibold">{sign}{delta}</span>
      <span className="opacity-70">RMSSD</span>
      <TrendIcon />
    </span>
  );

  if (!showTooltip) {
    return chipContent;
  }

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          {chipContent}
        </TooltipTrigger>
        <TooltipContent 
          side="top" 
          className="max-w-xs p-3 space-y-2"
        >
          <div className="flex items-center gap-2 font-medium">
            <Info className="h-4 w-4 text-primary" />
            {statusLabels[status]}
          </div>
          <p className="text-xs text-muted-foreground">
            {recommendations[status]}
          </p>
          {previousDelta !== undefined && (
            <div className="text-xs text-muted-foreground border-t pt-2 mt-2">
              <span className="opacity-70">Précédent : </span>
              <span className="font-medium">{previousDelta >= 0 ? '+' : ''}{previousDelta} RMSSD</span>
              {trend && (
                <span className={cn(
                  'ml-2',
                  trend === 'up' && 'text-emerald-500',
                  trend === 'down' && 'text-red-500'
                )}>
                  ({trend === 'up' ? '↑ amélioration' : trend === 'down' ? '↓ baisse' : '→ stable'})
                </span>
              )}
            </div>
          )}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default HrvDeltaChip;
