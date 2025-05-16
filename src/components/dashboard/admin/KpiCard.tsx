
import React from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { cva } from "class-variance-authority";
import { KpiCardProps } from '@/types/dashboard';
import { ReactNode } from 'react';

// Adding this helper type to resolve LucideIcon issues
type IconType = React.ReactNode;

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
    
    // Convert the icon to a ReactNode to satisfy type requirements
    const iconElement: ReactNode = icon;
    return iconElement;
  };
  
  return (
    <Card 
      className={cn("hover:shadow-md transition-shadow", className)} 
      onClick={onClick}
      id={id}
    >
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            {title}
          </CardTitle>
          {renderIcon()}
        </div>
      </CardHeader>
      
      <CardContent>
        <div className="text-2xl font-bold" aria-label={ariaLabel}>
          {isLoading ? "Loading..." : value}
        </div>
        
        {delta && (
          <div className={trendVariants({ trend: delta.trend })}>
            {delta.trend === "up" ? "↑" : delta.trend === "down" ? "↓" : ""}
            {delta.value}%
            {delta.label && <span className="text-muted-foreground ml-1">{delta.label}</span>}
          </div>
        )}
      </CardContent>
      
      {subtitle && (
        <CardFooter className="pt-0">
          <p className="text-xs text-muted-foreground">{subtitle}</p>
        </CardFooter>
      )}
    </Card>
  );
};

export default KpiCard;
