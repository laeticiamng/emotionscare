
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface DraggableKpiCardProps {
  title: string;
  value: string | number;
  icon?: React.ReactNode;
  description?: string;
  className?: string;
  onClick?: () => void;
  // Additional props for extended functionality
  trend?: number;
  status?: 'positive' | 'negative' | 'warning' | 'neutral';
  trendText?: string;
  details?: React.ReactNode;
  period?: string;
  loading?: boolean;
}

const DraggableKpiCard: React.FC<DraggableKpiCardProps> = ({
  title,
  value,
  trend,
  icon,
  description,
  status = 'neutral',
  onClick,
  className = "",
  trendText,
  details,
  period,
  loading,
}) => {
  const getStatusColor = () => {
    switch (status) {
      case 'positive':
        return 'text-green-600';
      case 'negative':
        return 'text-red-600';
      case 'warning':
        return 'text-yellow-600';
      default:
        return 'text-muted-foreground';
    }
  };

  const getTrendIcon = () => {
    if (trend === undefined) return null;
    
    return trend > 0 ? (
      <span className="text-green-600">↑</span>
    ) : trend < 0 ? (
      <span className="text-red-600">↓</span>
    ) : (
      <span className="text-gray-600">→</span>
    );
  };

  return (
    <Card className={`${className} cursor-move`} onClick={onClick}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">
          {title}
        </CardTitle>
        {icon && <div className="h-4 w-4 text-muted-foreground">{icon}</div>}
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="animate-pulse h-9 bg-muted rounded" />
        ) : (
          <div className="text-2xl font-bold">{value}</div>
        )}
        
        {(trend !== undefined || trendText) && (
          <p className={`text-xs ${getStatusColor()} flex items-center gap-1 mt-1`}>
            {getTrendIcon()}
            {trendText || `${Math.abs(trend || 0)}% depuis ${period || 'le dernier mois'}`}
          </p>
        )}
        
        {description && (
          <p className="text-xs text-muted-foreground mt-2">
            {description}
          </p>
        )}
        
        {details && (
          <div className="mt-2 pt-2 border-t text-xs text-muted-foreground">
            {details}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default DraggableKpiCard;
