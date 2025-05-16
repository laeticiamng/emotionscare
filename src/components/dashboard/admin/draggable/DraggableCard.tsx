
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowUpRight, ArrowDownRight, Minus } from 'lucide-react';
import { cva } from 'class-variance-authority';
import { DraggableCardProps } from './types';

const cardVariants = cva(
  "text-card-foreground shadow-sm transition-all hover:shadow-md",
  {
    variants: {
      status: {
        default: "bg-card border",
        success: "bg-green-50 dark:bg-green-950/20 border-green-200 dark:border-green-900",
        warning: "bg-yellow-50 dark:bg-yellow-950/20 border-yellow-200 dark:border-yellow-900",
        danger: "bg-red-50 dark:bg-red-950/20 border-red-200 dark:border-red-900",
        info: "bg-blue-50 dark:bg-blue-950/20 border-blue-200 dark:border-blue-900",
      },
    },
    defaultVariants: {
      status: "default",
    },
  }
);

const DraggableCard: React.FC<DraggableCardProps> = ({
  title,
  value,
  icon,
  delta,
  subtitle,
  ariaLabel,
  onClick,
  status,
}) => {
  const getDeltaElement = () => {
    if (!delta) return null;
    
    // Handle case where delta is a number
    if (typeof delta === 'number') {
      const deltaObj = {
        value: delta,
        trend: delta > 0 ? 'up' : delta < 0 ? 'down' : 'neutral'
      } as const;
      
      return renderDelta(deltaObj);
    }
    
    return renderDelta(delta);
  };
  
  const renderDelta = (deltaInfo: { value: number, trend: 'up' | 'down' | 'neutral', label?: string }) => {
    const { value, trend, label } = deltaInfo;
    
    const trendColor = 
      trend === 'up' 
        ? 'text-green-600 dark:text-green-400' 
        : trend === 'down' 
          ? 'text-red-600 dark:text-red-400' 
          : 'text-gray-500';
    
    const TrendIcon = 
      trend === 'up' 
        ? ArrowUpRight 
        : trend === 'down' 
          ? ArrowDownRight 
          : Minus;
    
    return (
      <div className={`flex items-center ${trendColor} text-sm font-medium`}>
        <TrendIcon className="h-4 w-4 mr-1" />
        <span>{value > 0 ? '+' : ''}{value.toFixed(1)}%</span>
        {label && <span className="ml-1 text-muted-foreground text-xs">({label})</span>}
      </div>
    );
  };

  return (
    <Card 
      className={cardVariants({ status })}
      aria-label={ariaLabel}
      onClick={onClick}
    >
      <CardContent className="p-6">
        <div className="flex justify-between items-start">
          <div>
            <p className="text-sm font-medium text-muted-foreground mb-1">{title}</p>
            <h3 className="text-2xl font-bold">{value}</h3>
          </div>
          
          {icon && (
            <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
              {React.isValidElement(icon) ? icon : null}
            </div>
          )}
        </div>
        
        <div className="mt-2 space-y-1">
          {getDeltaElement()}
          {subtitle && (
            <p className="text-sm text-muted-foreground">{subtitle}</p>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default DraggableCard;
