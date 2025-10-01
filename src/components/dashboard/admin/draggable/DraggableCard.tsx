// @ts-nocheck

import React from 'react';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { ArrowDown, ArrowUp, GripHorizontal, Minus } from 'lucide-react';
import { DraggableCardProps } from '@/types/widgets';

export const DraggableCard: React.FC<DraggableCardProps> = ({
  title,
  value,
  icon,
  delta,
  subtitle,
  ariaLabel,
  onClick,
  status
}) => {
  // Function to render the delta indicator
  const renderDelta = () => {
    if (!delta) return null;

    const deltaValue = typeof delta === 'number' ? delta : delta.value;
    const deltaTrend = typeof delta === 'number' ? (delta > 0 ? 'up' : delta < 0 ? 'down' : 'neutral') : delta.trend;
    const deltaLabel = typeof delta === 'object' && delta.label ? delta.label : '';
    
    let Icon;
    let colorClass;
    
    switch (deltaTrend) {
      case 'up':
        Icon = <ArrowUp className="h-3 w-3" />;
        colorClass = 'text-green-600';
        break;
      case 'down':
        Icon = <ArrowDown className="h-3 w-3" />;
        colorClass = 'text-red-600';
        break;
      default:
        Icon = <Minus className="h-3 w-3" />;
        colorClass = 'text-gray-500';
    }

    return (
      <div className={cn("flex items-center gap-1 text-xs", colorClass)}>
        {Icon}
        <span>{deltaValue > 0 ? '+' : ''}{deltaValue}%</span>
        {deltaLabel && <span className="text-muted-foreground ml-1">{deltaLabel}</span>}
      </div>
    );
  };

  // Determine card status styles
  const getStatusStyles = () => {
    switch (status) {
      case 'success':
        return 'border-green-500/20 bg-green-500/10';
      case 'warning':
        return 'border-amber-500/20 bg-amber-500/10';
      case 'danger':
        return 'border-red-500/20 bg-red-500/10';
      default:
        return '';
    }
  };

  return (
    <Card 
      className={cn("h-full transition-all", getStatusStyles())}
      onClick={onClick}
      role={onClick ? 'button' : undefined}
      aria-label={ariaLabel}
    >
      <div className="absolute top-2 right-2 drag-handle cursor-move text-muted-foreground hover:text-foreground">
        <GripHorizontal className="h-4 w-4" />
      </div>
      
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {icon && (
              <div className="rounded-md bg-muted p-1.5">
                {icon}
              </div>
            )}
            <div className="text-sm font-medium text-muted-foreground">{title}</div>
          </div>
        </div>
        
        <div className="mt-3">
          <div className="text-2xl font-semibold">{value}</div>
          {subtitle && <div className="text-xs text-muted-foreground">{subtitle}</div>}
        </div>
      </CardContent>
      
      {delta && (
        <CardFooter className="p-4 pt-0">
          {renderDelta()}
        </CardFooter>
      )}
    </Card>
  );
};
