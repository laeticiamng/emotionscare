
import React from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { cva } from "class-variance-authority";
import { KpiCardProps } from '@/types/dashboard';
import { LucideIcon } from 'lucide-react';

const KpiCard: React.FC<KpiCardProps & {
  icon?: React.ReactNode;
  delta?: {
    value: number;
    label?: string;
    trend: 'up' | 'down' | 'neutral';
  };
  subtitle?: React.ReactNode;
  ariaLabel?: string;
  isLoading?: boolean;
}> = ({
  title,
  value,
  icon,
  delta,
  subtitle,
  ariaLabel,
  onClick,
  isLoading,
  className
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
        {isLoading ? (
          <div className="h-10 bg-gray-100 animate-pulse rounded-md" />
        ) : (
          <>
            <div className="text-2xl font-bold mb-1">{value}</div>
            
            {delta && (
              <div className={trendVariants({ trend: delta.trend })}>
                {delta.trend === 'up' && <span>↑</span>}
                {delta.trend === 'down' && <span>↓</span>}
                {delta.trend === 'neutral' && <span>→</span>}
                <span>{Math.abs(delta.value)}% {delta.label}</span>
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
