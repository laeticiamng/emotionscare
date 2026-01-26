/**
 * Badge Showcase - Collection de badges utilisateur
 */

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useGamification } from '@/modules/gamification';
import { Award } from 'lucide-react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

const getRarityStyles = (rarity: string) => {
  switch (rarity) {
    case 'common':
      return { bg: 'bg-muted', text: 'text-muted-foreground', border: 'border-muted' };
    case 'rare':
      return { bg: 'bg-info/20', text: 'text-info', border: 'border-info/50' };
    case 'epic':
      return { bg: 'bg-accent/20', text: 'text-accent', border: 'border-accent/50' };
    case 'legendary':
      return { bg: 'bg-warning/20', text: 'text-warning', border: 'border-warning/50' };
    default:
      return { bg: 'bg-muted', text: 'text-muted-foreground', border: 'border-muted' };
  }
};

const BadgeShowcase: React.FC = () => {
  const { achievements, isLoading } = useGamification();

  // Filter to only show unlocked achievements as "badges"
  const unlockedBadges = achievements.filter(a => a.unlocked);

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Collection de Badges</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="h-20 bg-muted rounded-lg mb-2" />
                <div className="h-4 bg-muted rounded w-3/4 mx-auto" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Award className="h-5 w-5 text-warning" />
          Collection de Badges ({unlockedBadges.length}/{achievements.length})
        </CardTitle>
      </CardHeader>
      <CardContent>
        {achievements.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {achievements.map((achievement, index) => {
              const styles = getRarityStyles(achievement.rarity);
              const isUnlocked = achievement.unlocked;
              
              return (
                <motion.div
                  key={achievement.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="group relative"
                >
                  <div className={cn(
                    'text-center p-4 rounded-lg border-2 transition-all cursor-pointer',
                    isUnlocked 
                      ? `${styles.border} ${styles.bg}` 
                      : 'border-dashed border-muted opacity-50 grayscale',
                    'hover:scale-105'
                  )}>
                    {/* Badge Icon */}
                    <div className={cn(
                      'w-12 h-12 mx-auto mb-2 rounded-full flex items-center justify-center',
                      isUnlocked 
                        ? `bg-gradient-to-br from-${achievement.rarity === 'legendary' ? 'warning' : achievement.rarity === 'epic' ? 'accent' : achievement.rarity === 'rare' ? 'info' : 'muted-foreground'} to-${achievement.rarity === 'legendary' ? 'warning/70' : achievement.rarity === 'epic' ? 'accent/70' : achievement.rarity === 'rare' ? 'info/70' : 'muted'} text-white`
                        : 'bg-muted text-muted-foreground'
                    )}>
                      <span className="text-xl">{achievement.icon}</span>
                    </div>
                    
                    {/* Name */}
                    <h3 className="font-medium text-sm mb-1 truncate">{achievement.name}</h3>
                    
                    {/* Progress or Status */}
                    {isUnlocked ? (
                      <Badge variant="secondary" className={cn('text-xs', styles.text)}>
                        {achievement.rarity}
                      </Badge>
                    ) : (
                      <div className="text-xs text-muted-foreground">
                        {achievement.progress}/{achievement.maxProgress}
                      </div>
                    )}
                  </div>
                  
                  {/* Tooltip on hover */}
                  <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 opacity-0 group-hover:opacity-100 transition-opacity bg-popover border rounded-md p-2 text-xs w-48 z-10 pointer-events-none shadow-lg">
                    <p className="font-medium">{achievement.name}</p>
                    <p className="text-muted-foreground mt-1">{achievement.description}</p>
                    {isUnlocked && achievement.unlockedAt && (
                      <p className="text-primary mt-1">
                        Obtenu le {new Date(achievement.unlockedAt).toLocaleDateString('fr-FR')}
                      </p>
                    )}
                    <p className="text-warning mt-1">+{achievement.xpReward} XP</p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-12">
            <Award className="h-16 w-16 mx-auto mb-4 text-muted-foreground opacity-20" />
            <h3 className="text-lg font-medium mb-2">Aucun badge pour le moment</h3>
            <p className="text-muted-foreground">
              Utilisez l'application pour débloquer des badges et récompenses !
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default BadgeShowcase;
