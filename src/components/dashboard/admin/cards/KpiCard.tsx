
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { TrendingDown, TrendingUp, Minus } from 'lucide-react';
import { KpiCardProps } from '@/types';

const KpiCard: React.FC<KpiCardProps> = ({
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
  // Process delta value
  let deltaValue = 0;
  let deltaLabel;
  let deltaTrend: 'up' | 'down' | 'neutral' = 'neutral';
  
  if (typeof delta === 'number') {
    deltaValue = delta;
    deltaTrend = delta > 0 ? 'up' : delta < 0 ? 'down' : 'neutral';
  } else if (delta && typeof delta === 'object') {
    deltaValue = delta.value;
    deltaLabel = delta.label;
    deltaTrend = delta.trend;
  }

  // Status color classes
  const statusColorClasses = {
    positive: 'text-green-600',
    negative: 'text-red-600',
    neutral: 'text-gray-500',
    success: 'text-green-600',
    warning: 'text-amber-600',
    danger: 'text-red-600'
  };

  // Helper to render trend indicator
  const renderTrendIndicator = (trend: 'up' | 'down' | 'neutral') => {
    if (trend === 'up') {
      return <TrendingUp className="h-4 w-4 text-green-600" />;
    } else if (trend === 'down') {
      return <TrendingDown className="h-4 w-4 text-red-600" />;
    } else {
      return <Minus className="h-4 w-4 text-gray-400" />;
    }
  };

  return (
    <Card
      className={cn(
        "overflow-hidden",
        onClick && "cursor-pointer hover:border-primary/50 transition-colors",
        className
      )}
      onClick={onClick}
      aria-label={ariaLabel || title}
    >
      <CardContent className="p-4 h-full flex flex-col justify-between">
        <div className="flex justify-between items-start">
          <h3 className="text-sm font-medium text-muted-foreground">{title}</h3>
          {icon && <div className="text-muted-foreground">{icon}</div>}
        </div>
        
        <div className="mt-2">
          {loading ? (
            <div className="h-7 bg-muted animate-pulse rounded w-24" />
          ) : (
            <div className="text-2xl font-bold">
              {value}
            </div>
          )}
          
          {(deltaValue !== 0 || deltaTrend !== 'neutral' || trendText) && (
            <div className="flex items-center gap-1 mt-1 text-sm">
              {renderTrendIndicator(deltaTrend)}
              <span className={statusColorClasses[status || (deltaTrend === 'up' ? 'positive' : deltaTrend === 'down' ? 'negative' : 'neutral')]}>
                {Math.abs(deltaValue)}% {deltaLabel || trendText || (deltaTrend === 'up' ? 'hausse' : deltaTrend === 'down' ? 'baisse' : '')}
              </span>
            </div>
          )}
          
          {subtitle && (
            <div className="text-xs text-muted-foreground mt-1">
              {subtitle}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default KpiCard;
