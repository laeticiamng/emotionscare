import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Sparkles } from 'lucide-react';

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  description?: string;
  icon?: React.ComponentType<{ className?: string }>;
  gradient?: string;
  badge?: string;
  stats?: Array<{
    label: string;
    value: string;
    icon?: React.ComponentType<{ className?: string }>;
    color?: string;
  }>;
  actions?: Array<{
    label: string;
    onClick: () => void;
    variant?: 'default' | 'outline' | 'secondary';
    icon?: React.ComponentType<{ className?: string }>;
  }>;
  className?: string;
}

const PageHeader: React.FC<PageHeaderProps> = ({
  title,
  subtitle,
  description,
  icon: Icon,
  gradient = 'from-primary/20 to-primary/5',
  badge,
  stats,
  actions,
  className
}) => {
  const shouldReduceMotion = useReducedMotion();

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: shouldReduceMotion ? 0.01 : 0.6,
        staggerChildren: shouldReduceMotion ? 0 : 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { 
      opacity: 0, 
      y: shouldReduceMotion ? 0 : -20
    },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: {
        duration: shouldReduceMotion ? 0.01 : 0.6
      }
    }
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className={cn("space-y-8", className)}
    >
      {/* Main Header */}
      <motion.div variants={itemVariants} className="text-center space-y-6">
        {/* Icon */}
        {Icon && (
          <div className="flex items-center justify-center mb-6">
            <motion.div 
              className={cn(
                "p-4 bg-gradient-to-br rounded-3xl border border-primary/20 shadow-lg",
                gradient
              )}
              whileHover={shouldReduceMotion ? {} : { 
                scale: 1.1, 
                rotate: [0, -5, 5, 0] 
              }}
              transition={{ duration: 0.6 }}
            >
              <Icon className="h-12 w-12 text-primary" />
            </motion.div>
          </div>
        )}

        {/* Badge */}
        {badge && (
          <Badge 
            variant="outline" 
            className="mb-4 px-6 py-2 text-sm font-medium bg-background/80 backdrop-blur-sm"
          >
            <Sparkles className="w-4 h-4 mr-2" />
            {badge}
          </Badge>
        )}

        {/* Title & Subtitle */}
        <div className="space-y-4">
          <h1 className="text-4xl md:text-5xl font-bold text-gradient">
            {title}
          </h1>
          
          {subtitle && (
            <p className="text-xl md:text-2xl text-muted-foreground font-light">
              {subtitle}
            </p>
          )}
          
          {description && (
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
              {description}
            </p>
          )}
        </div>

        {/* Actions */}
        {actions && actions.length > 0 && (
          <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
            {actions.map((action, index) => {
              const ActionIcon = action.icon;
              return (
                <Button
                  key={index}
                  variant={action.variant || 'default'}
                  size="lg"
                  onClick={action.onClick}
                  className="min-w-[140px]"
                >
                  {ActionIcon && <ActionIcon className="mr-2 h-5 w-5" />}
                  {action.label}
                </Button>
              );
            })}
          </div>
        )}
      </motion.div>

      {/* Stats */}
      {stats && stats.length > 0 && (
        <motion.div 
          variants={itemVariants}
          className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto"
        >
          {stats.map((stat, index) => {
            const StatIcon = stat.icon;
            return (
              <Card key={index} className="p-4 text-center bg-background/50 backdrop-blur-sm">
                <div className="space-y-2">
                  {StatIcon && (
                    <StatIcon className={cn(
                      "h-6 w-6 mx-auto",
                      stat.color || "text-primary"
                    )} />
                  )}
                  <div className={cn(
                    "text-2xl font-bold",
                    stat.color || "text-primary"
                  )}>
                    {stat.value}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {stat.label}
                  </div>
                </div>
              </Card>
            );
          })}
        </motion.div>
      )}
    </motion.div>
  );
};

export default PageHeader;