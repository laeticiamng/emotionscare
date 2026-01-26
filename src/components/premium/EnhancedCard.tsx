// @ts-nocheck
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Sparkles, Star, Crown, Zap, Heart } from 'lucide-react';
import { cn } from '@/lib/utils';

interface EnhancedCardProps {
  title?: string;
  subtitle?: string;
  description?: string;
  icon?: React.ReactNode;
  variant?: 'default' | 'premium' | 'vip' | 'exclusive' | 'magical';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  interactive?: boolean;
  glowEffect?: boolean;
  children?: React.ReactNode;
  className?: string;
  onClick?: () => void;
  onHover?: () => void;
  badge?: string;
  badgeVariant?: 'default' | 'secondary' | 'destructive' | 'outline';
}

export const EnhancedCard: React.FC<EnhancedCardProps> = ({
  title,
  subtitle,
  description,
  icon,
  variant = 'default',
  size = 'md',
  interactive = false,
  glowEffect = false,
  children,
  className,
  onClick,
  onHover,
  badge,
  badgeVariant = 'default'
}) => {
  const [isHovered, setIsHovered] = useState(false);

  const variants = {
    default: {
      gradient: 'from-background/95 to-background/90',
      border: 'border-border/50',
      glow: 'shadow-lg',
      accent: 'text-primary'
    },
    premium: {
      gradient: 'from-purple-500/10 via-background/95 to-blue-500/10',
      border: 'border-purple-500/30',
      glow: 'shadow-purple-500/20 shadow-2xl',
      accent: 'text-purple-400'
    },
    vip: {
      gradient: 'from-amber-500/10 via-background/95 to-orange-500/10',
      border: 'border-amber-500/30',
      glow: 'shadow-amber-500/20 shadow-2xl',
      accent: 'text-amber-400'
    },
    exclusive: {
      gradient: 'from-emerald-500/10 via-background/95 to-teal-500/10',
      border: 'border-emerald-500/30',
      glow: 'shadow-emerald-500/20 shadow-2xl',
      accent: 'text-emerald-400'
    },
    magical: {
      gradient: 'from-pink-500/10 via-background/95 to-purple-500/10',
      border: 'border-pink-500/30',
      glow: 'shadow-pink-500/20 shadow-2xl',
      accent: 'text-pink-400'
    }
  };

  const sizes = {
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8',
    xl: 'p-10'
  };

  const currentVariant = variants[variant];
  const currentSize = sizes[size];

  const getVariantIcon = () => {
    switch (variant) {
      case 'premium': return <Sparkles className="w-4 h-4" />;
      case 'vip': return <Crown className="w-4 h-4" />;
      case 'exclusive': return <Star className="w-4 h-4" />;
      case 'magical': return <Heart className="w-4 h-4" />;
      default: return <Zap className="w-4 h-4" />;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={interactive ? { 
        y: -5, 
        scale: 1.02,
        transition: { duration: 0.2 }
      } : undefined}
      whileTap={interactive ? { scale: 0.98 } : undefined}
      onHoverStart={() => {
        setIsHovered(true);
        onHover?.();
      }}
      onHoverEnd={() => setIsHovered(false)}
      className={cn("relative group", className)}
    >
      {/* Effet de glow animé */}
      {(glowEffect || variant !== 'default') && (
        <motion.div
          className={cn(
            "absolute -inset-1 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300",
            currentVariant.glow
          )}
          style={{
            background: `linear-gradient(45deg, ${currentVariant.gradient.includes('purple') ? '#8b5cf6' : currentVariant.gradient.includes('amber') ? '#f59e0b' : currentVariant.gradient.includes('emerald') ? '#10b981' : '#ec4899'}, ${currentVariant.gradient.includes('blue') ? '#3b82f6' : currentVariant.gradient.includes('orange') ? '#f97316' : currentVariant.gradient.includes('teal') ? '#14b8a6' : '#a855f7'})`
          }}
        />
      )}

      <Card 
        className={cn(
          "relative overflow-hidden backdrop-blur-sm border-2 transition-all duration-300",
          `bg-gradient-to-br ${currentVariant.gradient}`,
          currentVariant.border,
          interactive && "cursor-pointer hover:shadow-lg",
          glowEffect && currentVariant.glow
        )}
        onClick={onClick}
      >
        {/* Particules flottantes */}
        {variant !== 'default' && (
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            {Array.from({ length: 8 }).map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-1 h-1 bg-white/30 rounded-full"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                }}
                animate={{
                  y: [0, -10, 0],
                  opacity: [0.3, 0.8, 0.3],
                  scale: [1, 1.2, 1]
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  delay: i * 0.3,
                  ease: "easeInOut"
                }}
              />
            ))}
          </div>
        )}

        {/* Header avec badge */}
        {(title || subtitle || badge) && (
          <CardHeader className={cn("space-y-3", size === 'sm' ? 'pb-3' : 'pb-4')}>
            <div className="flex items-start justify-between">
              <div className="space-y-1 flex-1">
                {title && (
                  <motion.h3 
                    className={cn(
                      "font-bold leading-tight",
                      size === 'sm' ? 'text-lg' : size === 'md' ? 'text-xl' : 'text-2xl',
                      currentVariant.accent
                    )}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 }}
                  >
                    <span className="flex items-center gap-2">
                      {icon && icon}
                      {!icon && getVariantIcon()}
                      <span>{title}</span>
                    </span>
                  </motion.h3>
                )}
                {subtitle && (
                  <motion.p 
                    className="text-muted-foreground text-sm"
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 }}
                  >
                    {subtitle}
                  </motion.p>
                )}
              </div>
              
              {badge && (
                <motion.div
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.3, type: "spring" }}
                >
                  <Badge 
                    variant={badgeVariant}
                    className={cn(
                      "ml-2",
                      variant !== 'default' && "bg-white/10 border-white/20 text-white/90"
                    )}
                  >
                    {badge}
                  </Badge>
                </motion.div>
              )}
            </div>
          </CardHeader>
        )}

        {/* Contenu */}
        <CardContent className={cn(currentSize, title || subtitle || badge ? 'pt-0' : '')}>
          {description && (
            <motion.p 
              className="text-muted-foreground mb-4 leading-relaxed"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              {description}
            </motion.p>
          )}
          
          {children && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              {children}
            </motion.div>
          )}
        </CardContent>

        {/* Effet de brillance au survol */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -skew-x-12"
          initial={{ x: '-100%' }}
          animate={isHovered ? { x: '200%' } : { x: '-100%' }}
          transition={{ duration: 0.6, ease: "easeInOut" }}
        />
      </Card>
    </motion.div>
  );
};

export default EnhancedCard;