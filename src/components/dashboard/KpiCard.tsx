
import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { LucideIcon } from 'lucide-react';
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";
import { KpiCardStatus } from '@/types/dashboard';

/**
 * KPI Card component for displaying key performance indicators
 */
export interface KpiCardProps { 
  id?: string;
  title: string; 
  value: string | number | React.ReactNode; 
  icon?: React.ReactNode; 
  delta?: number | {
    value: number;
    label?: string;
    trend: 'up' | 'down' | 'neutral';
  };
  subtitle?: React.ReactNode;
  ariaLabel?: string;
  className?: string;
  isLoading?: boolean;
  onClick?: () => void;
  status?: KpiCardStatus;
  footer?: React.ReactNode;
  
  // Properties for grid positioning
  x?: number;
  y?: number;
  w?: number;
  h?: number;
}

const KpiCard: React.FC<KpiCardProps> = ({ 
  id,
  title, 
  value, 
  icon, 
  delta, 
  subtitle,
  ariaLabel,
  className,
  isLoading = false,
  onClick,
  status
}) => {
  // Determine if the card is interactive
  const isInteractive = typeof onClick === 'function';
  
  // Helper function to determine badge variant based on trend
  const getBadgeVariant = (trend?: string) => {
    if (!trend) return 'secondary';
    switch (trend) {
      case 'up': return 'success';
      case 'down': return 'destructive';
      default: return 'secondary';
    }
  };

  // Helper function to format delta display
  const renderDelta = () => {
    if (!delta) return null;
    
    // If delta is a number, convert to simple object
    const deltaObj = typeof delta === 'number' 
      ? { value: delta, trend: delta >= 0 ? 'up' : 'down' } 
      : delta;
    
    return (
      <Badge 
        variant={getBadgeVariant(deltaObj.trend)}
        className="mt-2 font-normal"
      >
        {deltaObj.trend === 'up' ? '↑' : deltaObj.trend === 'down' ? '↓' : '○'} 
        {deltaObj.value}% {deltaObj.label || ''}
      </Badge>
    );
  };
  
  return (
    <Card 
      id={id}
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
              {icon && <div className="mr-2 text-primary">{icon}</div>}
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
        
        {isLoading ? (
          delta ? <Skeleton className="h-5 w-20 mt-2" /> : null
        ) : (
          renderDelta()
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
