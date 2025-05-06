
import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { LucideIcon } from 'lucide-react';
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import KpiCardBadge from './KpiCardBadge';
import KpiCardValue from './KpiCardValue';
import { Skeleton } from "@/components/ui/skeleton";

export interface KpiCardProps {
  title: string;
  value: React.ReactNode;
  icon: LucideIcon;
  delta?: {
    value: number;
    label?: string;
    trend: 'up' | 'down' | 'neutral';
  };
  subtitle?: React.ReactNode;
  ariaLabel?: string;
  className?: string;
  isLoading?: boolean;
  onClick?: () => void; // Added onClick handler for drill-down
}

/**
 * KpiCard component for displaying key performance indicators
 */
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
              <Icon size={20} className="mr-2 text-primary" />
              {title}
            </>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <KpiCardValue value={value} isLoading={isLoading} />
        
        {delta && <KpiCardBadge delta={delta} isLoading={isLoading} />}
        
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
