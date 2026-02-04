/**
 * TrendIndicator - Indicateur de tendance avec animation
 */

import React, { memo } from 'react';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { cn } from '@/lib/utils';

export type TrendDirection = 'up' | 'down' | 'stable';

interface TrendIndicatorProps {
  value: number;
  previousValue?: number;
  direction?: TrendDirection;
  showPercentage?: boolean;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const TrendIndicator = memo(function TrendIndicator({
  value,
  previousValue,
  direction: explicitDirection,
  showPercentage = true,
  size = 'md',
  className
}: TrendIndicatorProps) {
  // Calcul de la direction si non fournie
  const direction = explicitDirection ?? calculateDirection(value, previousValue);
  
  // Calcul du pourcentage de changement
  const percentChange = previousValue 
    ? Math.abs(((value - previousValue) / previousValue) * 100)
    : 0;

  const sizeClasses = {
    sm: { icon: 'w-3 h-3', text: 'text-xs' },
    md: { icon: 'w-4 h-4', text: 'text-sm' },
    lg: { icon: 'w-5 h-5', text: 'text-base' }
  };

  const directionStyles = {
    up: {
      color: 'text-green-600 dark:text-green-400',
      bg: 'bg-green-100 dark:bg-green-950/30',
      Icon: TrendingUp
    },
    down: {
      color: 'text-red-600 dark:text-red-400',
      bg: 'bg-red-100 dark:bg-red-950/30',
      Icon: TrendingDown
    },
    stable: {
      color: 'text-muted-foreground',
      bg: 'bg-muted',
      Icon: Minus
    }
  };

  const style = directionStyles[direction];
  const sizes = sizeClasses[size];

  return (
    <div 
      className={cn(
        'inline-flex items-center gap-1 px-2 py-0.5 rounded-full',
        style.bg,
        style.color,
        className
      )}
      role="status"
      aria-label={getTrendLabel(direction, percentChange)}
    >
      <style.Icon className={sizes.icon} aria-hidden="true" />
      {showPercentage && percentChange > 0 && (
        <span className={cn('font-medium', sizes.text)}>
          {percentChange.toFixed(1)}%
        </span>
      )}
    </div>
  );
});

function calculateDirection(value: number, previousValue?: number): TrendDirection {
  if (!previousValue) return 'stable';
  if (value > previousValue * 1.01) return 'up';
  if (value < previousValue * 0.99) return 'down';
  return 'stable';
}

function getTrendLabel(direction: TrendDirection, percentChange: number): string {
  switch (direction) {
    case 'up': return `En hausse de ${percentChange.toFixed(1)}%`;
    case 'down': return `En baisse de ${percentChange.toFixed(1)}%`;
    default: return 'Stable';
  }
}

export default TrendIndicator;
