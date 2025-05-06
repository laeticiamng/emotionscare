
import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { LucideIcon } from 'lucide-react';
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import KpiCardBadge from './KpiCardBadge';
import KpiCardValue from './KpiCardValue';

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
  className
}) => {
  return (
    <Card 
      className={cn("p-4 transition-shadow duration-200 hover:shadow-md", className)}
      aria-label={ariaLabel}
    >
      <CardHeader className="p-0 pb-2 space-y-0">
        <CardTitle className="text-xl font-semibold text-gray-800 dark:text-gray-200 flex items-center">
          <Icon size={20} className="mr-2 text-primary" />
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <KpiCardValue value={value} />
        
        {delta && <KpiCardBadge delta={delta} />}
        
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
