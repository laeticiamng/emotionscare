/**
 * XPProgressBar - Barre de progression XP avec animation
 */

import React, { memo } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Star, TrendingUp } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import type { UserLevel } from '../types';

interface XPProgressBarProps {
  userLevel: UserLevel;
  showDetails?: boolean;
  animate?: boolean;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const XPProgressBar = memo(function XPProgressBar({
  userLevel,
  showDetails = true,
  animate = true,
  size = 'md',
  className = '',
}: XPProgressBarProps) {
  const sizeClasses = {
    sm: 'h-2',
    md: 'h-3',
    lg: 'h-4',
  };

  const iconSizes = {
    sm: 14,
    md: 18,
    lg: 22,
  };

  return (
    <div className={`space-y-2 ${className}`}>
      {/* Header avec niveau et titre */}
      {showDetails && (
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <motion.div
              className="flex items-center justify-center w-8 h-8 rounded-full bg-gradient-to-br from-primary to-primary/60 text-primary-foreground font-bold text-sm"
              initial={animate ? { scale: 0 } : undefined}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', stiffness: 260, damping: 20 }}
            >
              {userLevel.level}
            </motion.div>
            <div>
              <p className="font-medium text-sm">{userLevel.title}</p>
              <p className="text-xs text-muted-foreground">
                Niveau {userLevel.level}
              </p>
            </div>
          </div>
          
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                  <Sparkles size={iconSizes[size]} className="text-yellow-500" />
                  <span>{userLevel.total_xp.toLocaleString()} XP</span>
                </div>
              </TooltipTrigger>
              <TooltipContent>
                <p>XP total accumulé</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      )}

      {/* Barre de progression */}
      <div className="relative">
        <motion.div
          initial={animate ? { opacity: 0, y: 10 } : undefined}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Progress 
            value={userLevel.progress_percent} 
            className={`${sizeClasses[size]} bg-muted`}
          />
        </motion.div>

        {/* Indicateur de niveau suivant */}
        {userLevel.progress_percent > 90 && (
          <motion.div
            className="absolute right-0 top-1/2 -translate-y-1/2"
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ repeat: Infinity, duration: 2 }}
          >
            <Star size={iconSizes[size]} className="text-yellow-500 fill-yellow-500" />
          </motion.div>
        )}
      </div>

      {/* Footer avec XP restant */}
      {showDetails && (
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span>{userLevel.current_xp} XP</span>
          <div className="flex items-center gap-1">
            <TrendingUp size={12} />
            <span>{userLevel.xp_to_next} XP pour niveau {userLevel.level + 1}</span>
          </div>
        </div>
      )}
    </div>
  );
});

export default XPProgressBar;
