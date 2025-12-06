
import React from 'react';
import { cn } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";

interface KpiCardValueProps {
  value: React.ReactNode;
  className?: string;
  isLoading?: boolean;
}

/**
 * Displays the main value of a KPI card
 */
const KpiCardValue: React.FC<KpiCardValueProps> = ({ value, className, isLoading = false }) => {
  if (isLoading) {
    return <Skeleton className={cn("h-9 w-24", className)} />;
  }

  return (
    <div className={cn("text-3xl font-bold text-gray-900 dark:text-gray-50", className)}>
      {value}
    </div>
  );
};

export default KpiCardValue;
