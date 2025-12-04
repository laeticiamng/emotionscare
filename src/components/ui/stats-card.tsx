import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { cn } from '@/lib/utils';

interface StatsCardProps {
  title: string;
  value: string | number;
  change?: {
    value: number;
    label: string;
    type: 'increase' | 'decrease' | 'neutral';
  };
  icon?: React.ReactNode;
  description?: string;
  className?: string;
  variant?: 'default' | 'success' | 'warning' | 'error';
}

const StatsCard: React.FC<StatsCardProps> = ({
  title,
  value,
  change,
  icon,
  description,
  className = '',
  variant = 'default'
}) => {
  const getTrendIcon = (type: string) => {
    switch (type) {
      case 'increase':
        return <TrendingUp className="h-3 w-3" />;
      case 'decrease':
        return <TrendingDown className="h-3 w-3" />;
      default:
        return <Minus className="h-3 w-3" />;
    }
  };

  const getTrendColor = (type: string) => {
    switch (type) {
      case 'increase':
        return 'text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/50';
      case 'decrease':
        return 'text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/50';
      default:
        return 'text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-900/50';
    }
  };

  const getVariantStyles = (variant: string) => {
    switch (variant) {
      case 'success':
        return 'border-green-200 dark:border-green-800 bg-green-50/50 dark:bg-green-900/30';
      case 'warning':
        return 'border-yellow-200 dark:border-yellow-800 bg-yellow-50/50 dark:bg-yellow-900/30';
      case 'error':
        return 'border-red-200 dark:border-red-800 bg-red-50/50 dark:bg-red-900/30';
      default:
        return '';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      whileHover={{ y: -2 }}
      className={className}
    >
      <Card className={cn(
        'transition-all duration-300 hover:shadow-md',
        getVariantStyles(variant)
      )}>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            {title}
          </CardTitle>
          {icon && (
            <div className="text-muted-foreground">
              {icon}
            </div>
          )}
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{value}</div>
          {change && (
            <div className="flex items-center gap-1 mt-1">
              <Badge 
                variant="secondary" 
                className={cn(
                  'text-xs px-1 py-0.5 flex items-center gap-1',
                  getTrendColor(change.type)
                )}
              >
                {getTrendIcon(change.type)}
                {Math.abs(change.value)}%
              </Badge>
              <span className="text-xs text-muted-foreground">
                {change.label}
              </span>
            </div>
          )}
          {description && (
            <p className="text-xs text-muted-foreground mt-1">
              {description}
            </p>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default StatsCard;
