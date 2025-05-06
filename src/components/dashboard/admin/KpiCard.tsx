
import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { LucideIcon } from 'lucide-react';
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

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
}

const KpiCard: React.FC<KpiCardProps> = ({ 
  title, 
  value, 
  icon: Icon, 
  delta, 
  subtitle,
  ariaLabel
}) => {
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
    <Card 
      className="p-4 transition-shadow duration-200 hover:shadow-md"
      aria-label={ariaLabel}
    >
      <CardHeader className="p-0 pb-2 space-y-0">
        <CardTitle className="text-xl font-semibold text-gray-800 dark:text-gray-200 flex items-center">
          <Icon size={20} className="mr-2 text-primary" />
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <div className="text-3xl font-bold text-gray-900 dark:text-gray-50">
          {value}
        </div>
        
        {delta && (
          <div className="mt-1 flex items-center">
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
        )}
        
        {subtitle && (
          <div className="mt-1">
            {subtitle}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default KpiCard;
