/**
 * Composant StatsCard réutilisable avec loading states et animations
 * Supporte différentes variations et thèmes
 */

import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Skeleton } from '@/components/ui/skeleton';
import { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface StatsCardProps {
  label: string;
  value: string | number;
  subtitle?: string;
  icon?: LucideIcon;
  iconColor?: string;
  valueColor?: string;
  progress?: number;
  showProgress?: boolean;
  loading?: boolean;
  variant?: 'default' | 'gradient' | 'minimal' | 'elevated';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  delay?: number;
}

const variantStyles = {
  default: 'bg-card/50 backdrop-blur-sm border-border/20',
  gradient: 'bg-gradient-to-br from-primary/10 via-card/50 to-secondary/10 backdrop-blur-sm border-border/20',
  minimal: 'bg-transparent border-0 shadow-none',
  elevated: 'bg-card shadow-lg border-border/30'
};

const sizeStyles = {
  sm: 'p-3',
  md: 'p-4',
  lg: 'p-6'
};

const iconSizeStyles = {
  sm: 'h-4 w-4',
  md: 'h-5 w-5',
  lg: 'h-6 w-6'
};

const valueSizeStyles = {
  sm: 'text-lg',
  md: 'text-2xl',
  lg: 'text-3xl'
};

export const StatsCard: React.FC<StatsCardProps> = ({
  label,
  value,
  subtitle,
  icon: Icon,
  iconColor = 'text-primary',
  valueColor = 'text-foreground',
  progress,
  showProgress = false,
  loading = false,
  variant = 'default',
  size = 'md',
  className,
  delay = 0
}) => {
  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.4,
        delay: delay * 0.1,
        ease: [0.25, 0.46, 0.45, 0.94]
      }
    }
  };

  if (loading) {
    return (
      <Card className={cn(variantStyles[variant], className)}>
        <CardContent className={sizeStyles[size]}>
          <div className="space-y-3">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-8 w-16" />
            {showProgress && <Skeleton className="h-2 w-full" />}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <motion.div
      variants={cardVariants}
      initial="hidden"
      animate="visible"
      whileHover={{ scale: 1.02 }}
      transition={{ duration: 0.2 }}
    >
      <Card className={cn(variantStyles[variant], 'transition-all duration-300', className)}>
        <CardContent className={sizeStyles[size]}>
          <div className="flex items-center justify-between">
            <div className="space-y-1 flex-1">
              <div className="text-sm font-medium text-muted-foreground">{label}</div>
              {subtitle && (
                <div className="text-xs text-muted-foreground/70">{subtitle}</div>
              )}
            </div>
            
            <div className="flex items-center gap-3">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: delay * 0.1 + 0.2, type: 'spring', stiffness: 200 }}
                className={cn('font-bold', valueSizeStyles[size], valueColor)}
              >
                {typeof value === 'number' && value > 999 
                  ? value.toLocaleString() 
                  : value}
              </motion.div>
              
              {Icon && (
                <motion.div
                  initial={{ rotate: -180, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  transition={{ delay: delay * 0.1 + 0.3, duration: 0.5 }}
                >
                  <Icon className={cn(iconSizeStyles[size], iconColor)} aria-hidden="true" />
                </motion.div>
              )}
            </div>
          </div>

          {showProgress && progress !== undefined && (
            <motion.div
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ delay: delay * 0.1 + 0.4, duration: 0.6 }}
              className="mt-3"
            >
              <Progress value={progress} className="h-2" />
            </motion.div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
};

// Composant de grille pour afficher plusieurs stats
export interface StatsGridProps {
  children: React.ReactNode;
  columns?: 1 | 2 | 3 | 4;
  className?: string;
}

export const StatsGrid: React.FC<StatsGridProps> = ({
  children,
  columns = 4,
  className
}) => {
  return (
    <div 
      className={cn(
        'grid gap-4',
        columns === 1 && 'grid-cols-1',
        columns === 2 && 'grid-cols-1 md:grid-cols-2',
        columns === 3 && 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
        columns === 4 && 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4',
        className
      )}
    >
      {children}
    </div>
  );
};
