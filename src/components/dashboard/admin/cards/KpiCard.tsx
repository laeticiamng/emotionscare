
import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { KpiCardProps, KpiCardStatus, KpiDelta } from "@/types/dashboard";
import { ArrowDown, ArrowUp, Minus } from "lucide-react";

export const KpiCard = ({
  title,
  value,
  delta,
  icon,
  subtitle,
  status = 'default',
  className,
  isLoading,
  ariaLabel,
  onClick,
  footer,
}: KpiCardProps) => {
  // Handle loading state
  if (isLoading) {
    return (
      <Card
        className={cn(
          "overflow-hidden transition-all hover:shadow-md",
          className
        )}
      >
        <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
          <CardTitle
            className="text-sm font-medium text-muted-foreground animate-pulse"
          >
            &nbsp;
          </CardTitle>
          {icon && (
            <div className="opacity-70 animate-pulse">
              {icon}
            </div>
          )}
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold animate-pulse bg-muted h-8 w-24 rounded">
            &nbsp;
          </div>
          <p className="text-xs text-muted-foreground mt-2 animate-pulse bg-muted h-4 w-16 rounded">
            &nbsp;
          </p>
        </CardContent>
      </Card>
    );
  }

  // Convert number delta to object format for consistency in rendering
  const deltaObj = typeof delta === 'number' 
    ? { value: delta, trend: delta > 0 ? 'up' : delta < 0 ? 'down' : 'neutral' } as KpiDelta
    : delta as KpiDelta;

  // Handle status color based on card status
  let statusColor = "";
  if (deltaObj) {
    if (deltaObj.trend === 'up') {
      statusColor = status === 'default' || status === 'info' ? 'text-emerald-600 dark:text-emerald-400' : `text-${status}`;
    } else if (deltaObj.trend === 'down') {
      statusColor = status === 'default' || status === 'info' ? 'text-rose-600 dark:text-rose-400' : `text-${status}`;
    } else {
      statusColor = 'text-gray-600 dark:text-gray-400';
    }
  }

  return (
    <Card
      className={cn(
        "overflow-hidden transition-all hover:shadow-md",
        onClick ? "cursor-pointer" : "",
        className
      )}
      onClick={onClick}
      aria-label={ariaLabel}
    >
      <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {title}
        </CardTitle>
        {icon && <div className="opacity-70">{icon}</div>}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        {deltaObj && (
          <p className={cn("text-xs flex items-center gap-1 mt-1", statusColor)}>
            {deltaObj.trend === 'up' && <ArrowUp className="h-3 w-3" />}
            {deltaObj.trend === 'down' && <ArrowDown className="h-3 w-3" />}
            {deltaObj.trend === 'neutral' && <Minus className="h-3 w-3" />}
            {deltaObj.value !== undefined && (
              <span>{Math.abs(deltaObj.value).toFixed(1)}%</span>
            )}
            {deltaObj.label && <span>{deltaObj.label}</span>}
          </p>
        )}
        {subtitle && <p className="text-xs text-muted-foreground mt-1">{subtitle}</p>}
        {footer && <div className="mt-4">{footer}</div>}
      </CardContent>
    </Card>
  );
};

export default KpiCard;
