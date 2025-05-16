
import React from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { cva } from "class-variance-authority";
import { KpiCardProps } from '@/types/dashboard';

const KpiCard: React.FC<KpiCardProps> = ({
  id,
  title,
  value,
  icon,
  delta,
  subtitle,
  ariaLabel,
  onClick,
  isLoading,
  className,
  status,
  trendText,
  loading
}) => {
  // CSS variant for trend colors
  const trendVariants = cva("text-xs flex items-center gap-1", {
    variants: {
      trend: {
        up: "text-green-600",
        down: "text-red-600",
        neutral: "text-gray-500"
      }
    },
    defaultVariants: {
      trend: "neutral"
    }
  });
  
  const renderIcon = () => {
    if (!icon) return null;
    return (
      <div className="h-9 w-9 rounded-full bg-primary/10 flex items-center justify-center text-primary">
        {icon}
      </div>
    );
  };
  
  const handleClick = () => {
    if (onClick) onClick();
  };

  // Helper to handle both types of delta (number or object)
  const getDeltaTrend = () => {
    if (!delta) return 'neutral';
    if (typeof delta === 'number') {
      return delta > 0 ? 'up' : delta < 0 ? 'down' : 'neutral';
    }
    return delta.trend;
  };

  const getDeltaValue = () => {
    if (!delta) return 0;
    return typeof delta === 'number' ? delta : delta.value;
  };

  const getDeltaLabel = () => {
    if (!delta || typeof delta === 'number') return '';
    return delta.label || '';
  };
  
  return (
    <Card 
      className={cn(
        "overflow-hidden transition-all duration-200 hover:shadow-md cursor-pointer", 
        className
      )}
      onClick={handleClick}
      aria-label={ariaLabel}
    >
      <CardHeader className="pb-2 flex flex-row justify-between items-start">
        <CardTitle className="text-base font-medium">{title}</CardTitle>
        {renderIcon()}
      </CardHeader>
      <CardContent>
        {isLoading || loading ? (
          <div className="h-10 bg-gray-100 animate-pulse rounded-md" />
        ) : (
          <>
            <div className="text-2xl font-bold mb-1">{value}</div>
            
            {delta && (
              <div className={trendVariants({ trend: getDeltaTrend() })}>
                {getDeltaTrend() === 'up' && <span>↑</span>}
                {getDeltaTrend() === 'down' && <span>↓</span>}
                {getDeltaTrend() === 'neutral' && <span>→</span>}
                <span>{Math.abs(getDeltaValue())}% {getDeltaLabel()}</span>
              </div>
            )}
            
            {subtitle && (
              <div className="mt-2">
                {subtitle}
              </div>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default KpiCard;
