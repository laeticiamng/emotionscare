
import React from 'react';
import { cn } from "@/lib/utils";

interface KpiCardValueProps {
  value: React.ReactNode;
  className?: string; 
}

/**
 * Displays the main value of a KPI card
 */
const KpiCardValue: React.FC<KpiCardValueProps> = ({ value, className }) => {
  return (
    <div className={cn("text-3xl font-bold text-gray-900 dark:text-gray-50", className)}>
      {value}
    </div>
  );
};

export default KpiCardValue;
