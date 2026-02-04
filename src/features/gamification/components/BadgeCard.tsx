/**
 * BadgeCard - Carte affichant un badge avec animation
 */

import React, { memo } from 'react';
import { motion } from 'framer-motion';
import { Lock, Sparkles } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge as BadgeUI } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import type { Badge, UserBadge, BadgeRarity } from '../types';
import { cn } from '@/lib/utils';

interface BadgeCardProps {
  badge: Badge;
  userBadge?: UserBadge;
  size?: 'sm' | 'md' | 'lg';
  showDetails?: boolean;
  onClick?: () => void;
  className?: string;
}

const RARITY_COLORS: Record<BadgeRarity, string> = {
  common: 'from-slate-400 to-slate-500',
  uncommon: 'from-green-400 to-green-600',
  rare: 'from-blue-400 to-blue-600',
  epic: 'from-purple-400 to-purple-600',
  legendary: 'from-yellow-400 to-orange-500',
  mythic: 'from-pink-400 via-purple-500 to-indigo-500',
};

const RARITY_LABELS: Record<BadgeRarity, string> = {
  common: 'Commun',
  uncommon: 'Peu commun',
  rare: 'Rare',
  epic: 'Épique',
  legendary: 'Légendaire',
  mythic: 'Mythique',
};

const RARITY_GLOW: Record<BadgeRarity, string> = {
  common: '',
  uncommon: 'shadow-green-500/20',
  rare: 'shadow-blue-500/30',
  epic: 'shadow-purple-500/40',
  legendary: 'shadow-yellow-500/50',
  mythic: 'shadow-pink-500/60',
};

export const BadgeCard = memo(function BadgeCard({
  badge,
  userBadge,
  size = 'md',
  showDetails = true,
  onClick,
  className = '',
}: BadgeCardProps) {
  const isUnlocked = !!userBadge;
  
  const sizeClasses = {
    sm: 'w-16 h-16',
    md: 'w-24 h-24',
    lg: 'w-32 h-32',
  };

  const iconSizes = {
    sm: 'text-2xl',
    md: 'text-4xl',
    lg: 'text-5xl',
  };

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={className}
          >
            <Card
              className={cn(
                'relative overflow-hidden cursor-pointer transition-all duration-300',
                isUnlocked ? `shadow-lg ${RARITY_GLOW[badge.rarity]}` : 'opacity-60',
                onClick && 'hover:ring-2 hover:ring-primary/50'
              )}
              onClick={onClick}
            >
              <CardContent className="p-4 flex flex-col items-center">
                {/* Badge Icon */}
                <div
                  className={cn(
                    'relative rounded-full flex items-center justify-center',
                    sizeClasses[size],
                    isUnlocked 
                      ? `bg-gradient-to-br ${RARITY_COLORS[badge.rarity]}` 
                      : 'bg-muted'
                  )}
                >
                  {isUnlocked ? (
                    <>
                      <span className={iconSizes[size]}>{badge.icon}</span>
                      {/* Sparkle effect for legendary+ */}
                      {['legendary', 'mythic'].includes(badge.rarity) && (
                        <motion.div
                          className="absolute inset-0 flex items-center justify-center"
                          animate={{ rotate: 360 }}
                          transition={{ duration: 10, repeat: Infinity, ease: 'linear' }}
                        >
                          <Sparkles className="text-yellow-300 absolute -top-1 -right-1" size={14} />
                          <Sparkles className="text-yellow-300 absolute -bottom-1 -left-1" size={10} />
                        </motion.div>
                      )}
                    </>
                  ) : (
                    <Lock className="text-muted-foreground" size={size === 'sm' ? 20 : 28} />
                  )}
                </div>

                {/* Badge Details */}
                {showDetails && (
                  <div className="mt-3 text-center space-y-1">
                    <p className={cn(
                      'font-medium line-clamp-1',
                      size === 'sm' ? 'text-xs' : 'text-sm'
                    )}>
                      {isUnlocked || !badge.is_hidden ? badge.name : '???'}
                    </p>
                    <BadgeUI 
                      variant="secondary" 
                      className={cn(
                        'text-xs',
                        isUnlocked && `bg-gradient-to-r ${RARITY_COLORS[badge.rarity]} text-white border-0`
                      )}
                    >
                      {RARITY_LABELS[badge.rarity]}
                    </BadgeUI>
                  </div>
                )}

                {/* Unlock date indicator */}
                {isUnlocked && userBadge.unlocked_at && (
                  <div className="absolute top-2 right-2">
                    <div className="w-2 h-2 rounded-full bg-green-500" />
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        </TooltipTrigger>
        <TooltipContent side="top" className="max-w-xs">
          <div className="space-y-1">
            <p className="font-semibold">{isUnlocked || !badge.is_hidden ? badge.name : 'Badge Mystère'}</p>
            <p className="text-sm text-muted-foreground">
              {isUnlocked || !badge.is_hidden ? badge.description : 'Débloquez ce badge pour découvrir son secret...'}
            </p>
            {isUnlocked && userBadge.unlocked_at && (
              <p className="text-xs text-muted-foreground">
                Débloqué le {new Date(userBadge.unlocked_at).toLocaleDateString('fr-FR')}
              </p>
            )}
            <p className="text-xs font-medium text-primary">
              +{badge.xp_reward} XP
            </p>
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
});

export default BadgeCard;
