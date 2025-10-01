// @ts-nocheck

import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

export interface LegendItem {
  id: string;
  label: string;
  color: string;
  value?: number | string;
  disabled?: boolean;
}

export interface ChartInteractiveLegendProps {
  items: LegendItem[];
  onToggle?: (id: string) => void;
  className?: string;
  orientation?: 'horizontal' | 'vertical';
}

export const ChartInteractiveLegend = ({
  items,
  onToggle,
  className,
  orientation = 'horizontal',
}: ChartInteractiveLegendProps) => {
  return (
    <div 
      className={cn(
        "flex flex-wrap gap-2 text-sm", 
        orientation === 'vertical' ? "flex-col" : "",
        className
      )}
    >
      {items.map((item) => (
        <motion.button
          key={item.id}
          type="button"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className={cn(
            "inline-flex items-center rounded-lg px-2 py-1",
            "focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
            item.disabled ? "opacity-50 cursor-default" : "hover:bg-muted cursor-pointer"
          )}
          onClick={() => onToggle && onToggle(item.id)}
          disabled={item.disabled}
        >
          <div
            className="h-3 w-3 rounded-full mr-2"
            style={{ backgroundColor: item.color }}
          />
          <span>{item.label}</span>
          {item.value !== undefined && (
            <span className="ml-1 font-medium">{item.value}</span>
          )}
        </motion.button>
      ))}
    </div>
  );
};
