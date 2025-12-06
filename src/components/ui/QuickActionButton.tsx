/**
 * QUICK ACTION BUTTON - EMOTIONSCARE
 * Bouton d'action rapide avec animations et états
 */

import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { LucideIcon, Loader2 } from 'lucide-react';

type ActionSize = 'sm' | 'md' | 'lg' | 'xl';
type ActionVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'premium';

interface QuickActionButtonProps {
  // Core props
  icon: LucideIcon;
  label: string;
  description?: string;
  onClick: () => void;
  
  // Styling
  variant?: ActionVariant;
  size?: ActionSize;
  className?: string;
  
  // State
  isLoading?: boolean;
  disabled?: boolean;
  badge?: {
    text: string;
    variant?: 'default' | 'secondary' | 'destructive' | 'outline' | 'success' | 'warning';
    pulse?: boolean;
  };
  
  // Animation
  animate?: boolean;
  delay?: number;
  pulseOnHover?: boolean;
  
  // Analytics
  trackingId?: string;
}

const sizeConfig = {
  sm: {
    container: 'p-3 min-h-16',
    icon: 'h-4 w-4',
    title: 'text-sm',
    description: 'text-xs',
    gap: 'gap-2'
  },
  md: {
    container: 'p-4 min-h-20',
    icon: 'h-5 w-5',
    title: 'text-sm',
    description: 'text-xs',
    gap: 'gap-2'
  },
  lg: {
    container: 'p-6 min-h-24',
    icon: 'h-6 w-6',
    title: 'text-base',
    description: 'text-sm',
    gap: 'gap-3'
  },
  xl: {
    container: 'p-8 min-h-28',
    icon: 'h-8 w-8',
    title: 'text-lg',
    description: 'text-base',
    gap: 'gap-4'
  }
};

const variantStyles = {
  primary: 'bg-primary text-primary-foreground hover:bg-primary/90 shadow-lg hover:shadow-xl',
  secondary: 'bg-secondary text-secondary-foreground hover:bg-secondary/80',
  outline: 'border-2 border-primary/20 hover:border-primary/40 hover:bg-primary/5',
  ghost: 'hover:bg-muted/50 border border-transparent hover:border-muted',
  premium: 'bg-gradient-to-br from-primary via-primary to-primary/80 text-primary-foreground shadow-lg hover:shadow-xl hover:from-primary/90'
};

const QuickActionButton: React.FC<QuickActionButtonProps> = ({
  icon: Icon,
  label,
  description,
  onClick,
  variant = 'outline',
  size = 'md',
  className,
  isLoading = false,
  disabled = false,
  badge,
  animate = true,
  delay = 0,
  pulseOnHover = false,
  trackingId
}) => {
  const config = sizeConfig[size];
  
  const handleClick = () => {
    if (disabled || isLoading) return;
    
    // Analytics tracking
    if (trackingId && typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('event', 'quick_action_click', {
        action_id: trackingId,
        action_label: label
      });
    }
    
    onClick();
  };

  return (
    <motion.div
      initial={animate ? { opacity: 0, scale: 0.9, y: 10 } : false}
      animate={animate ? { opacity: 1, scale: 1, y: 0 } : false}
      transition={{ 
        duration: 0.3, 
        delay,
        type: "spring",
        stiffness: 300,
        damping: 25
      }}
      whileHover={pulseOnHover && !disabled && !isLoading ? { 
        scale: 1.02,
        transition: { duration: 0.2 }
      } : undefined}
      whileTap={!disabled && !isLoading ? { 
        scale: 0.98,
        transition: { duration: 0.1 }
      } : undefined}
      className={className}
    >
      <Button
        onClick={handleClick}
        disabled={disabled || isLoading}
        variant="ghost"
        className={cn(
          'relative w-full h-auto flex flex-col items-center justify-center text-center',
          'transition-all duration-300 group overflow-hidden',
          config.container,
          config.gap,
          variantStyles[variant],
          disabled && 'opacity-50 cursor-not-allowed',
          isLoading && 'cursor-wait'
        )}
      >
        {/* Badge */}
        {badge && (
          <Badge 
            variant={badge.variant || 'outline'} 
            className={cn(
              'absolute -top-1 -right-1 text-xs z-10',
              badge.pulse && 'animate-pulse'
            )}
          >
            {badge.text}
          </Badge>
        )}

        {/* Loading overlay */}
        {isLoading && (
          <div className="absolute inset-0 bg-background/50 backdrop-blur-sm flex items-center justify-center">
            <Loader2 className="h-5 w-5 animate-spin" />
          </div>
        )}

        {/* Icon with animation */}
        <motion.div
          className={cn(
            'relative flex items-center justify-center rounded-lg p-2',
            variant === 'outline' && 'bg-primary/5 group-hover:bg-primary/10',
            variant === 'ghost' && 'bg-muted/30 group-hover:bg-muted/50'
          )}
          whileHover={!disabled && !isLoading ? {
            rotate: [0, -5, 5, 0],
            transition: { duration: 0.5 }
          } : undefined}
        >
          <Icon className={cn(
            config.icon,
            'transition-all duration-200',
            variant === 'primary' && 'group-hover:scale-110',
            variant === 'premium' && 'group-hover:scale-110 drop-shadow-sm'
          )} />
          
          {/* Glow effect for premium */}
          {variant === 'premium' && (
            <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          )}
        </motion.div>

        {/* Label */}
        <div className="space-y-1 min-w-0">
          <p className={cn(
            'font-medium leading-tight truncate',
            config.title
          )}>
            {label}
          </p>
          
          {description && (
            <p className={cn(
              'text-muted-foreground leading-tight line-clamp-2',
              config.description,
              variant === 'primary' && 'text-primary-foreground/80',
              variant === 'premium' && 'text-primary-foreground/80'
            )}>
              {description}
            </p>
          )}
        </div>

        {/* Ripple effect */}
        <div className="absolute inset-0 overflow-hidden rounded-lg">
          <div className={cn(
            'absolute inset-0 opacity-0 group-active:opacity-20 transition-opacity duration-150',
            'bg-gradient-radial from-white via-white to-transparent',
            variant === 'primary' && 'from-primary-foreground via-primary-foreground',
            variant === 'premium' && 'from-primary-foreground via-primary-foreground'
          )} />
        </div>

        {/* Shine effect for premium */}
        {variant === 'premium' && (
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -skew-x-12 translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-1000" />
        )}
      </Button>
    </motion.div>
  );
};

export default QuickActionButton;