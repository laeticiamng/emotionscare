
import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { LucideIcon } from 'lucide-react';
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";

/**
 * KPI Card component for displaying key performance indicators
 */
export interface KpiCardProps { 
  title: string; 
  value: string | number | React.ReactNode; 
  icon?: LucideIcon | React.ReactNode; 
  delta?: {
    value: number;
    label?: string;
    trend: 'up' | 'down' | 'neutral';
  };
  subtitle?: React.ReactNode;
  ariaLabel?: string;
  className?: string;
  isLoading?: boolean;
  onClick?: () => void;
}

const KpiCard: React.FC<KpiCardProps> = ({ 
  title, 
  value, 
  icon: Icon, 
  delta, 
  subtitle,
  ariaLabel,
  className,
  isLoading = false,
  onClick
}) => {
  // Determine if the card is interactive
  const isInteractive = typeof onClick === 'function';
  
  return (
    <Card 
      className={cn(
        "p-4 transition-all duration-200", 
        isInteractive && "cursor-pointer hover:shadow-md hover:translate-y-[-2px] focus-visible:ring-2 focus-visible:ring-primary focus-visible:outline-none", 
        className
      )}
      aria-label={ariaLabel || (isInteractive ? `Voir détails ${title}` : undefined)}
      aria-busy={isLoading}
      onClick={onClick}
      role={isInteractive ? "button" : undefined}
      tabIndex={isInteractive ? 0 : undefined}
    >
      <CardHeader className="p-0 pb-2 space-y-0">
        <CardTitle className="text-xl font-semibold text-gray-800 dark:text-gray-200 flex items-center">
          {isLoading ? (
            <>
              <Skeleton className="h-5 w-5 mr-2 rounded-full" />
              <Skeleton className="h-6 w-32" />
            </>
          ) : (
            <>
              {Icon && (typeof Icon === 'function' ? <Icon size={20} className="mr-2 text-primary" /> : Icon)}
              {title}
            </>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        {isLoading ? (
          <Skeleton className="h-8 w-24 my-2" />
        ) : (
          <div className="text-3xl font-bold">{value}</div>
        )}
        
        {delta && (
          isLoading ? (
            <Skeleton className="h-5 w-20 mt-2" />
          ) : (
            <Badge 
              variant={delta.trend === 'up' ? "outline" : delta.trend === 'down' ? "destructive" : "secondary"}
              className="mt-2 font-normal"
            >
              {delta.trend === 'up' ? '↑' : delta.trend === 'down' ? '↓' : '○'} 
              {delta.value}% {delta.label}
            </Badge>
          )
        )}
        
        {subtitle && (
          <div className="mt-2">
            {isLoading ? (
              <Skeleton className="h-4 w-full" />
            ) : (
              subtitle
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default KpiCard;
