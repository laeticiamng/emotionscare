// @ts-nocheck

import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface GridItem {
  id: string;
  component: React.ReactNode;
  gridArea?: string;
  className?: string;
}

interface DashboardGridProps {
  items: GridItem[];
  columns?: number;
  gap?: number;
  className?: string;
  responsive?: boolean;
}

const DashboardGrid: React.FC<DashboardGridProps> = ({
  items,
  columns = 12,
  gap = 4,
  className,
  responsive = true
}) => {
  const gridTemplateColumns = `repeat(${columns}, 1fr)`;
  
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className={cn(
        "grid w-full",
        `gap-${gap}`,
        responsive && "grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4",
        className
      )}
      style={!responsive ? { gridTemplateColumns } : undefined}
    >
      {items.map((item, index) => (
        <motion.div
          key={item.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          className={cn(item.className)}
          style={item.gridArea ? { gridArea: item.gridArea } : undefined}
        >
          {item.component}
        </motion.div>
      ))}
    </motion.div>
  );
};

export default DashboardGrid;
