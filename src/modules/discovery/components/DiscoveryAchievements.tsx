/**
 * Succès et achievements Discovery
 * @module discovery
 */

import React, { memo } from 'react';
import { motion } from 'framer-motion';
import { Trophy, Lock, Sparkles, Star } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';
import { DiscoveryStats } from '../types';

interface DiscoveryAchievementsProps {
  achievements: DiscoveryStats['achievements'];
}

const rarityColors: Record<string, { bg: string; border: string; text: string; glow: string }> = {
  common: { 
    bg: 'bg-slate-500/10', 
    border: 'border-slate-500/30', 
    text: 'text-slate-600',
    glow: 'shadow-slate-500/20'
  },
  uncommon: { 
    bg: 'bg-green-500/10', 
    border: 'border-green-500/30', 
    text: 'text-green-600',
    glow: 'shadow-green-500/20'
  },
  rare: { 
    bg: 'bg-blue-500/10', 
    border: 'border-blue-500/30', 
    text: 'text-blue-600',
    glow: 'shadow-blue-500/20'
  },
  epic: { 
    bg: 'bg-purple-500/10', 
    border: 'border-purple-500/30', 
    text: 'text-purple-600',
    glow: 'shadow-purple-500/20'
  },
  legendary: { 
    bg: 'bg-amber-500/10', 
    border: 'border-amber-500/30', 
    text: 'text-amber-600',
    glow: 'shadow-amber-500/20'
  },
};

const rarityLabels: Record<string, string> = {
  common: 'Commun',
  uncommon: 'Peu commun',
  rare: 'Rare',
  epic: 'Épique',
  legendary: 'Légendaire',
};

export const DiscoveryAchievementsPanel = memo(function DiscoveryAchievementsPanel({
  achievements,
}: DiscoveryAchievementsProps) {
  const unlockedCount = achievements.filter(a => a.unlockedAt).length;

  return (
    <Card className="p-5">
      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 rounded-lg bg-amber-500/10 flex items-center justify-center">
            <Trophy className="w-5 h-5 text-amber-500" />
          </div>
          <div>
            <h3 className="font-semibold text-foreground">Succès</h3>
            <p className="text-xs text-muted-foreground">
              {unlockedCount} / {achievements.length} débloqués
            </p>
          </div>
        </div>
        <div className="flex items-center gap-1 text-amber-500">
          <Sparkles className="w-4 h-4" />
          <span className="text-sm font-medium">{Math.round((unlockedCount / achievements.length) * 100)}%</span>
        </div>
      </div>

      {/* Achievements Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {achievements.map((achievement, index) => {
          const isUnlocked = !!achievement.unlockedAt;
          const colors = rarityColors[achievement.rarity];
          const progressPercent = (achievement.progress / achievement.target) * 100;

          return (
            <motion.div
              key={achievement.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 }}
            >
              <div
                className={cn(
                  'relative p-4 rounded-xl border-2 transition-all duration-300',
                  isUnlocked 
                    ? `${colors.bg} ${colors.border} shadow-lg ${colors.glow}` 
                    : 'bg-muted/30 border-muted opacity-60'
                )}
              >
                {/* Badge de rareté */}
                <div className="absolute -top-2 -right-2">
                  <span className={cn(
                    'px-2 py-0.5 text-xs font-medium rounded-full',
                    colors.bg, colors.text
                  )}>
                    {rarityLabels[achievement.rarity]}
                  </span>
                </div>

                {/* Content */}
                <div className="flex items-start gap-3">
                  {/* Icon */}
                  <div 
                    className={cn(
                      'w-12 h-12 rounded-xl flex items-center justify-center text-2xl shrink-0',
                      isUnlocked ? colors.bg : 'bg-muted'
                    )}
                  >
                    {isUnlocked ? (
                      achievement.icon
                    ) : (
                      <Lock className="w-5 h-5 text-muted-foreground" />
                    )}
                  </div>

                  {/* Info */}
                  <div className="flex-grow min-w-0">
                    <h4 className={cn(
                      'font-semibold truncate',
                      isUnlocked ? 'text-foreground' : 'text-muted-foreground'
                    )}>
                      {achievement.name}
                    </h4>
                    <p className="text-xs text-muted-foreground line-clamp-2 mt-0.5">
                      {achievement.description}
                    </p>

                    {/* Progress */}
                    <div className="mt-2">
                      <div className="flex justify-between text-xs mb-1">
                        <span className="text-muted-foreground">
                          {achievement.progress} / {achievement.target}
                        </span>
                        {isUnlocked && (
                          <span className={cn('font-medium', colors.text)}>
                            ✓ Débloqué
                          </span>
                        )}
                      </div>
                      <Progress 
                        value={progressPercent} 
                        className={cn(
                          'h-1.5',
                          isUnlocked && '[&>div]:bg-gradient-to-r [&>div]:from-amber-500 [&>div]:to-amber-400'
                        )}
                      />
                    </div>
                  </div>
                </div>

                {/* Sparkle effect for unlocked */}
                {isUnlocked && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: [0, 1, 0] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="absolute inset-0 pointer-events-none"
                  >
                    <Star className="absolute top-2 left-2 w-3 h-3 text-amber-400" />
                    <Star className="absolute bottom-3 right-8 w-2 h-2 text-amber-400" />
                  </motion.div>
                )}
              </div>
            </motion.div>
          );
        })}
      </div>
    </Card>
  );
});

export default DiscoveryAchievementsPanel;
