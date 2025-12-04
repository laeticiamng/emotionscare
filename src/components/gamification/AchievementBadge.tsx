// @ts-nocheck

import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Trophy, Lock } from 'lucide-react';
import { motion } from 'framer-motion';

interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  points: number;
  unlocked: boolean;
  unlockedAt?: string;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
}

interface AchievementBadgeProps {
  achievement: Achievement;
  size?: 'sm' | 'md' | 'lg';
  showDetails?: boolean;
}

const AchievementBadge: React.FC<AchievementBadgeProps> = ({ 
  achievement, 
  size = 'md',
  showDetails = true
}) => {
  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'common': return 'border-gray-400 bg-gray-50 dark:bg-gray-900/50';
      case 'rare': return 'border-blue-400 bg-blue-50 dark:bg-blue-900/50';
      case 'epic': return 'border-purple-400 bg-purple-50 dark:bg-purple-900/50';
      case 'legendary': return 'border-yellow-400 bg-yellow-50 dark:bg-yellow-900/50';
      default: return 'border-gray-400 bg-gray-50 dark:bg-gray-900/50';
    }
  };

  const getRarityGlow = (rarity: string) => {
    switch (rarity) {
      case 'common': return 'shadow-gray-200';
      case 'rare': return 'shadow-blue-200';
      case 'epic': return 'shadow-purple-200';
      case 'legendary': return 'shadow-yellow-200';
      default: return 'shadow-gray-200';
    }
  };

  const sizeClasses = {
    sm: 'p-2',
    md: 'p-4',
    lg: 'p-6'
  };

  const iconSizes = {
    sm: 'h-6 w-6',
    md: 'h-8 w-8',
    lg: 'h-12 w-12'
  };

  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className={achievement.unlocked ? '' : 'cursor-not-allowed'}
    >
      <Card 
        className={`
          ${getRarityColor(achievement.rarity)} 
          border-2 
          ${achievement.unlocked ? `${getRarityGlow(achievement.rarity)} shadow-lg` : 'opacity-50 grayscale'}
          transition-all duration-300
        `}
      >
        <CardContent className={`${sizeClasses[size]} text-center`}>
          <div className="space-y-2">
            {/* Icon */}
            <div className={`mx-auto ${achievement.unlocked ? 'text-primary' : 'text-gray-400'}`}>
              {achievement.unlocked ? (
                <div className={iconSizes[size]}>
                  {achievement.icon}
                </div>
              ) : (
                <Lock className={iconSizes[size]} />
              )}
            </div>

            {showDetails && (
              <>
                {/* Title */}
                <h3 className={`font-semibold ${size === 'sm' ? 'text-sm' : size === 'lg' ? 'text-lg' : 'text-base'}`}>
                  {achievement.title}
                </h3>

                {/* Description */}
                <p className={`text-muted-foreground ${size === 'sm' ? 'text-xs' : 'text-sm'}`}>
                  {achievement.description}
                </p>

                {/* Points */}
                <div className="flex items-center justify-center gap-1 text-yellow-600">
                  <Trophy className="h-4 w-4" />
                  <span className="font-semibold text-sm">{achievement.points}</span>
                </div>

                {/* Rarity Badge */}
                <Badge 
                  variant="outline" 
                  className={`capitalize ${getRarityColor(achievement.rarity)} border-current`}
                >
                  {achievement.rarity}
                </Badge>

                {/* Unlock Date */}
                {achievement.unlocked && achievement.unlockedAt && (
                  <p className="text-xs text-muted-foreground">
                    Débloqué le {new Date(achievement.unlockedAt).toLocaleDateString('fr-FR')}
                  </p>
                )}
              </>
            )}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default AchievementBadge;
