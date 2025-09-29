
import React from 'react';
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";

interface KpiCardBadgeProps {
  delta: {
    value: number;
    label?: string;
    trend: 'up' | 'down' | 'neutral';
  };
  className?: string;
  isLoading?: boolean;
}

/**
 * Displays a trend badge with appropriate styling based on trend direction
 */
const KpiCardBadge: React.FC<KpiCardBadgeProps> = ({ delta, className, isLoading = false }) => {
  // Determine badge variant based on trend
  const getBadgeVariant = (trend: 'up' | 'down' | 'neutral') => {
    switch(trend) {
      case 'up':
        return 'success-subtle';
      case 'down':
        return 'error-subtle';
      default:
        return 'info-subtle';
    }
  };

  if (isLoading) {
    return (
      <div className={cn("mt-2 flex items-center", className)}>
        <Skeleton className="h-6 w-16" />
        {delta.label && <Skeleton className="h-4 w-24 ml-2" />}
      </div>
    );
  }

  return (
    <div className={cn("mt-2 flex items-center", className)}>
      <Badge 
        variant={getBadgeVariant(delta.trend)}
        className="text-sm font-medium px-2 py-1"
      >
        {delta.trend === 'up' ? '↑' : delta.trend === 'down' ? '↓' : '•'} {delta.value}%
      </Badge>
      {delta.label && (
        <span className="text-sm text-muted-foreground ml-2">
          {delta.label}
        </span>
      )}
    </div>
  );
};

export default KpiCardBadge;
