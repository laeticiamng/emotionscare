
import React, { ReactNode } from 'react';
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
  className,
  status,
  trendText,
  loading
}) => {
  const trendVariants = cva("text-xs flex items-center gap-1", {
    variants: {
      trend: {
        up: "text-green-500 dark:text-green-400",
        down: "text-red-500 dark:text-red-400",
        neutral: "text-gray-500 dark:text-gray-400"
      }
    },
    defaultVariants: {
      trend: "neutral"
    }
  });
  
  const statusVariants = cva("absolute top-2 right-2 w-2 h-2 rounded-full", {
    variants: {
      status: {
        success: "bg-green-500",
        warning: "bg-yellow-500",
        error: "bg-red-500",
        info: "bg-blue-500",
        default: "bg-gray-500"
      }
    },
    defaultVariants: {
      status: "default"
    }
  });

  const renderIcon = () => {
    if (!icon) return null;
    // Convert the icon to a ReactNode to satisfy type requirements
    const iconElement: ReactNode = icon;
    return (
      <div className="rounded-md w-8 h-8 flex items-center justify-center bg-primary/10 text-primary">
        {iconElement}
      </div>
    );
  };
  
  return (
    <Card 
      className={cn(
        "relative hover:shadow-md transition-shadow cursor-pointer", 
        className
      )} 
      onClick={onClick}
      id={id}
    >
      {status && <span className={statusVariants({ status })} />}
      
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            {title}
          </CardTitle>
          {renderIcon()}
        </div>
      </CardHeader>
      
      <CardContent>
        {loading ? (
          <div className="h-8 w-24 bg-muted animate-pulse rounded"></div>
        ) : (
          <div className="text-2xl font-bold" aria-label={ariaLabel}>
            {value}
          </div>
        )}
        
        {delta && (
          <div className={trendVariants({ trend: delta.trend })}>
            {delta.trend === "up" ? "↑" : delta.trend === "down" ? "↓" : "→"}
            {delta.value}%
            {delta.label && <span className="text-muted-foreground ml-1">{delta.label}</span>}
            {trendText && <span className="text-muted-foreground ml-1">{trendText}</span>}
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
