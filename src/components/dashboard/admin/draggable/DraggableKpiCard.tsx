
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingDown, TrendingUp, Minus } from 'lucide-react';
import { KpiCardProps } from '@/types';
import { cn } from '@/lib/utils';

const DraggableKpiCard: React.FC<KpiCardProps> = ({ 
  title, 
  value, 
  delta,
  icon: Icon,
  subtitle,
  className,
  onClick,
  ariaLabel
}) => {
  // Determine if the card is interactive
  const isInteractive = typeof onClick === 'function';
  
  return (
    <Card 
      className={cn(
        "relative p-4", 
        isInteractive && "cursor-pointer hover:shadow-md hover:translate-y-[-2px]", 
        className
      )}
      onClick={onClick}
      role={isInteractive ? "button" : undefined}
      aria-label={ariaLabel}
    >
      <CardHeader className="p-0 pb-2">
        <CardTitle className="text-sm font-medium flex items-center">
          {Icon && <Icon className="mr-2 h-4 w-4 text-primary" />}
          {title}
        </CardTitle>
      </CardHeader>
      
      <CardContent className="p-0">
        <div className="text-2xl font-bold">
          {value}
        </div>
        
        {delta !== undefined && (
          <div className="flex items-center mt-1 text-xs">
            {delta > 0 ? (
              <>
                <TrendingUp className="mr-1 h-3 w-3 text-green-500" />
                <span className="text-green-500">+{delta}%</span>
              </>
            ) : delta < 0 ? (
              <>
                <TrendingDown className="mr-1 h-3 w-3 text-red-500" />
                <span className="text-red-500">{delta}%</span>
              </>
            ) : (
              <>
                <Minus className="mr-1 h-3 w-3 text-gray-500" />
                <span className="text-gray-500">Stable</span>
              </>
            )}
            <span className="ml-1 text-muted-foreground">
              depuis 30 jours
            </span>
          </div>
        )}
        
        {subtitle && (
          <div className="mt-2 text-sm text-muted-foreground">
            {subtitle}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default DraggableKpiCard;
