
import React from 'react';
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface KpiCardBadgeProps {
  delta: {
    value: number;
    label?: string;
    trend: 'up' | 'down' | 'neutral';
  };
  className?: string;
}

/**
 * Displays a trend badge with appropriate styling based on trend direction
 */
const KpiCardBadge: React.FC<KpiCardBadgeProps> = ({ delta, className }) => {
  // Determine badge color based on trend
  const getBadgeClasses = (trend: 'up' | 'down' | 'neutral') => {
    switch(trend) {
      case 'up':
        return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400';
      case 'down':
        return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-800/50 dark:text-gray-400';
    }
  };

  return (
    <div className={cn("mt-1 flex items-center", className)}>
      <Badge 
        className={cn(
          "text-sm font-medium px-2 py-1", 
          getBadgeClasses(delta.trend)
        )}
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
