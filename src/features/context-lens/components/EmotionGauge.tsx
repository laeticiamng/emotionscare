/**
 * EmotionGauge - Indicateur visuel d'émotion
 */

import React, { memo } from 'react';
import { cn } from '@/lib/utils';

interface EmotionGaugeProps {
  emotion: string;
  value: number;
  color: string;
  isActive?: boolean;
  className?: string;
}

const EmotionGauge: React.FC<EmotionGaugeProps> = memo(({
  emotion,
  value,
  color,
  isActive = false,
  className,
}) => {
  const percentage = Math.round(value * 100);
  const strokeDashoffset = 100 - percentage;

  return (
    <div
      className={cn(
        'flex flex-col items-center p-3 rounded-lg transition-all',
        isActive && 'bg-primary/10 ring-2 ring-primary',
        className
      )}
    >
      <div className="relative w-16 h-16">
        <svg
          className="w-full h-full -rotate-90"
          viewBox="0 0 36 36"
        >
          {/* Background circle */}
          <circle
            className="text-muted stroke-current"
            strokeWidth="3"
            fill="none"
            cx="18"
            cy="18"
            r="16"
          />
          {/* Progress circle */}
          <circle
            className="transition-all duration-500 ease-out"
            stroke={color}
            strokeWidth="3"
            strokeLinecap="round"
            fill="none"
            cx="18"
            cy="18"
            r="16"
            strokeDasharray="100"
            strokeDashoffset={strokeDashoffset}
            style={{
              filter: isActive ? 'drop-shadow(0 0 4px currentColor)' : undefined,
            }}
          />
        </svg>
        
        {/* Percentage in center */}
        <div className="absolute inset-0 flex items-center justify-center">
          <span className={cn(
            'text-sm font-semibold',
            isActive && 'text-primary'
          )}>
            {percentage}%
          </span>
        </div>
      </div>

      <span className={cn(
        'mt-2 text-xs font-medium text-muted-foreground',
        isActive && 'text-primary'
      )}>
        {emotion}
      </span>

      {isActive && (
        <span className="text-[10px] text-primary mt-0.5">Dominante</span>
      )}
    </div>
  );
});

EmotionGauge.displayName = 'EmotionGauge';

export default EmotionGauge;
