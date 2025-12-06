/**
 * STAT CARD COMPONENT - EMOTIONSCARE
 * Composant pour afficher des statistiques avec animations et variants
 */

import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';
import { LucideIcon, TrendingUp, TrendingDown, Minus } from 'lucide-react';

type StatVariant = 'default' | 'compact' | 'detailed' | 'progress' | 'trend';
type TrendDirection = 'up' | 'down' | 'neutral';

interface StatCardProps {
  variant?: StatVariant;
  className?: string;
  
  // Main data
  label: string;
  value: string | number;
  subtitle?: string;
  
  // Visual elements
  icon?: LucideIcon;
  color?: 'primary' | 'secondary' | 'success' | 'warning' | 'destructive' | 'muted';
  
  // Trend data
  trend?: {
    direction: TrendDirection;
    value: string | number;
    period?: string;
  };
  
  // Progress data (for progress variant)
  progress?: {
    current: number;
    target: number;
    label?: string;
  };
  
  // Status badge
  status?: {
    text: string;
    variant?: 'default' | 'secondary' | 'destructive' | 'outline' | 'success' | 'warning';
  };
  
  // Animation
  animate?: boolean;
  delay?: number;
  countUp?: boolean; // Animate numbers counting up
}

const colorClasses = {
  primary: {
    icon: 'text-primary bg-primary/10',
    value: 'text-primary',
    accent: 'bg-primary/5 border-primary/20'
  },
  secondary: {
    icon: 'text-secondary bg-secondary/10',
    value: 'text-secondary',
    accent: 'bg-secondary/5 border-secondary/20'
  },
  success: {
    icon: 'text-green-600 bg-green-100 dark:bg-green-950 dark:text-green-400',
    value: 'text-green-600 dark:text-green-400',
    accent: 'bg-green-50 border-green-200 dark:bg-green-950 dark:border-green-800'
  },
  warning: {
    icon: 'text-orange-600 bg-orange-100 dark:bg-orange-950 dark:text-orange-400',
    value: 'text-orange-600 dark:text-orange-400',
    accent: 'bg-orange-50 border-orange-200 dark:bg-orange-950 dark:border-orange-800'
  },
  destructive: {
    icon: 'text-red-600 bg-red-100 dark:bg-red-950 dark:text-red-400',
    value: 'text-red-600 dark:text-red-400',
    accent: 'bg-red-50 border-red-200 dark:bg-red-950 dark:border-red-800'
  },
  muted: {
    icon: 'text-muted-foreground bg-muted',
    value: 'text-foreground',
    accent: 'bg-muted/30 border-muted'
  }
};

const trendIcons = {
  up: TrendingUp,
  down: TrendingDown,
  neutral: Minus
};

const trendColors = {
  up: 'text-green-600 bg-green-100 dark:bg-green-950 dark:text-green-400',
  down: 'text-red-600 bg-red-100 dark:bg-red-950 dark:text-red-400',
  neutral: 'text-muted-foreground bg-muted'
};

const StatCard: React.FC<StatCardProps> = ({
  variant = 'default',
  className,
  label,
  value,
  subtitle,
  icon: Icon,
  color = 'primary',
  trend,
  progress,
  status,
  animate = true,
  delay = 0,
  countUp = false
}) => {
  const colors = colorClasses[color];
  const TrendIcon = trend ? trendIcons[trend.direction] : null;

  const formatValue = (val: string | number) => {
    if (typeof val === 'number' && countUp) {
      // Animation de comptage peut être ajoutée ici
      return val.toLocaleString();
    }
    return val.toString();
  };

  const cardVariants = {
    compact: 'p-4',
    default: 'p-6',
    detailed: 'p-6',
    progress: 'p-6',
    trend: 'p-6'
  };

  return (
    <motion.div
      initial={animate ? { opacity: 0, y: 20, scale: 0.95 } : false}
      animate={animate ? { opacity: 1, y: 0, scale: 1 } : false}
      transition={{ duration: 0.3, delay }}
      className={className}
    >
      <Card className={cn(
        'relative overflow-hidden transition-all duration-300 hover:shadow-md',
        colors.accent,
        'border-2'
      )}>
        <CardContent className={cardVariants[variant]}>
          {/* Header Section */}
          <div className="flex items-start justify-between mb-3">
            <div className="flex items-center gap-3">
              {Icon && (
                <div className={cn(
                  'p-2 rounded-lg transition-all duration-200',
                  colors.icon
                )}>
                  <Icon className="h-5 w-5" />
                </div>
              )}
              
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium text-muted-foreground truncate">
                  {label}
                </p>
                {subtitle && (
                  <p className="text-xs text-muted-foreground/80 truncate">
                    {subtitle}
                  </p>
                )}
              </div>
            </div>
            
            {status && (
              <Badge variant={status.variant || 'outline'} className="text-xs">
                {status.text}
              </Badge>
            )}
          </div>

          {/* Value Section */}
          <div className="space-y-2">
            <div className="flex items-baseline gap-2">
              <motion.span
                initial={countUp ? { opacity: 0, scale: 0.8 } : false}
                animate={countUp ? { opacity: 1, scale: 1 } : false}
                transition={{ duration: 0.5, delay: delay + 0.2 }}
                className={cn(
                  'text-2xl font-bold tracking-tight',
                  variant === 'compact' ? 'text-xl' : variant === 'detailed' ? 'text-3xl' : '',
                  colors.value
                )}
              >
                {formatValue(value)}
              </motion.span>
              
              {trend && (
                <div className={cn(
                  'flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium',
                  trendColors[trend.direction]
                )}>
                  {TrendIcon && <TrendIcon className="h-3 w-3" />}
                  <span>{trend.value}</span>
                  {trend.period && (
                    <span className="opacity-75">/{trend.period}</span>
                  )}
                </div>
              )}
            </div>

            {/* Progress Section (for progress variant) */}
            {variant === 'progress' && progress && (
              <div className="space-y-2">
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>{progress.label || 'Progression'}</span>
                  <span>{progress.current} / {progress.target}</span>
                </div>
                <Progress 
                  value={(progress.current / progress.target) * 100} 
                  className="h-2"
                />
              </div>
            )}

            {/* Detailed Information (for detailed variant) */}
            {variant === 'detailed' && (
              <div className="grid grid-cols-2 gap-4 pt-2 border-t border-border/50">
                {progress && (
                  <div className="text-center">
                    <p className="text-sm font-semibold text-foreground">
                      {progress.current}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {progress.label || 'Actuel'}
                    </p>
                  </div>
                )}
                
                {trend && (
                  <div className="text-center">
                    <div className={cn(
                      'inline-flex items-center gap-1 text-sm font-semibold',
                      trend.direction === 'up' ? 'text-green-600' :
                      trend.direction === 'down' ? 'text-red-600' : 'text-muted-foreground'
                    )}>
                      {TrendIcon && <TrendIcon className="h-4 w-4" />}
                      {trend.value}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Évolution
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Background Decoration */}
          <div className={cn(
            'absolute top-0 right-0 w-32 h-32 opacity-5 pointer-events-none',
            colors.icon
          )}>
            {Icon && <Icon className="w-full h-full" />}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default StatCard;