
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { motion } from 'framer-motion';
import { ArrowUp, ArrowDown, Minus } from 'lucide-react';

interface StatsCardProps {
  title: string;
  value: string | number;
  description?: string;
  trend?: {
    value: number;
    direction: 'up' | 'down' | 'stable';
  };
  icon?: React.ReactNode;
  className?: string;
}

const StatsCard: React.FC<StatsCardProps> = ({
  title,
  value,
  description,
  trend,
  icon,
  className = ''
}) => {
  const renderTrendIcon = () => {
    if (!trend) return null;
    
    switch (trend.direction) {
      case 'up':
        return (
          <div className="flex items-center text-emerald-600">
            <ArrowUp className="h-3 w-3 mr-1" />
            <span className="text-xs">+{trend.value}%</span>
          </div>
        );
      case 'down':
        return (
          <div className="flex items-center text-rose-600">
            <ArrowDown className="h-3 w-3 mr-1" />
            <span className="text-xs">-{trend.value}%</span>
          </div>
        );
      default:
        return (
          <div className="flex items-center text-gray-500">
            <Minus className="h-3 w-3 mr-1" />
            <span className="text-xs">{trend.value}%</span>
          </div>
        );
    }
  };
  
  return (
    <motion.div
      whileHover={{ y: -2, transition: { duration: 0.2 } }}
      className={`${className}`}
    >
      <Card className="overflow-hidden">
        <CardContent className="p-6">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-muted-foreground mb-2">{title}</p>
              <div className="flex items-end gap-2">
                <p className="text-2xl font-bold">{value}</p>
                {trend && <div className="mb-1">{renderTrendIcon()}</div>}
              </div>
              {description && (
                <p className="text-xs text-muted-foreground mt-1">{description}</p>
              )}
            </div>
            {icon && <div className="text-muted-foreground">{icon}</div>}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default StatsCard;
