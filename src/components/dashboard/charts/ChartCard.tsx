// @ts-nocheck

import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import ChartTimeToggle from './ChartTimeToggle';
import { LucideIcon } from 'lucide-react';

interface ChartCardProps {
  title: string;
  description?: string;
  timeRange?: string;
  setTimeRange?: (value: string) => void;
  isLoading?: boolean;
  children?: React.ReactNode;
  icon?: LucideIcon;
  data?: Array<{ date: string; value: number }>;
  valueFormat?: (val: any) => string;
  trend?: number;
  trendLabel?: string;
}

const ChartCard: React.FC<ChartCardProps> = ({
  title,
  description,
  timeRange,
  setTimeRange,
  isLoading = false,
  children,
  icon: Icon,
  data,
  valueFormat,
  trend,
  trendLabel
}) => {
  // Calculer la valeur actuelle (dernière valeur dans les données)
  const currentValue = data?.length ? data[data.length - 1].value : 0;
  
  // Formater la valeur selon la fonction de formatage fournie ou par défaut
  const formattedValue = valueFormat ? valueFormat(currentValue) : currentValue;
  
  return (
    <Card className="glass-card overflow-hidden">
      <CardHeader className="pb-0">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            {Icon && <Icon className="h-5 w-5 text-primary" />}
            <CardTitle className="text-lg">
              {isLoading ? <Skeleton className="h-6 w-40" /> : title}
            </CardTitle>
          </div>
          {timeRange && setTimeRange && (
            <ChartTimeToggle timeRange={timeRange} setTimeRange={setTimeRange} disabled={isLoading} />
          )}
        </div>
        {description && (
          <CardDescription>
            {isLoading ? (
              <Skeleton className="h-4 w-32" />
            ) : description}
          </CardDescription>
        )}
      </CardHeader>
      <CardContent>
        {data ? (
          <div className="space-y-2 mb-4">
            <div className="text-3xl font-bold">{formattedValue}</div>
            {trend !== undefined && (
              <div className={`text-sm flex items-center ${trend >= 0 ? 'text-success' : 'text-destructive'}`}>
                <span>{trend >= 0 ? '↑' : '↓'} {Math.abs(trend)}%</span>
                {trendLabel && <span className="text-muted-foreground ml-1">{trendLabel}</span>}
              </div>
            )}
          </div>
        ) : null}
        <div className="h-64" aria-label={`Graphique de ${title.toLowerCase()}`} aria-busy={isLoading}>
          {isLoading ? (
            <div className="flex items-center justify-center h-full">
              <Skeleton className="h-full w-full" />
            </div>
          ) : (
            children
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default ChartCard;
