import React from 'react';
import { motion } from 'framer-motion';
import { Trophy, Lock, Star, Sparkles, Award, Crown, Rocket, Heart, Zap } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';

interface GalaxyAchievement {
  id: string;
  name: string;
  description: string;
  icon: 'star' | 'trophy' | 'crown' | 'rocket' | 'heart' | 'zap' | 'sparkles';
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  unlocked: boolean;
  unlockedAt?: string;
  progress?: number;
  maxProgress?: number;
}

interface GalaxyAchievementsPanelProps {
  achievements: GalaxyAchievement[];
  className?: string;
}

const ICON_MAP = {
  star: Star,
  trophy: Trophy,
  crown: Crown,
  rocket: Rocket,
  heart: Heart,
  zap: Zap,
  sparkles: Sparkles,
};

const RARITY_STYLES = {
  common: 'bg-gray-500/10 border-gray-500/30 text-gray-400',
  rare: 'bg-blue-500/10 border-blue-500/30 text-blue-400',
  epic: 'bg-purple-500/10 border-purple-500/30 text-purple-400',
  legendary: 'bg-amber-500/10 border-amber-500/30 text-amber-400',
};

const RARITY_LABELS = {
  common: 'Commun',
  rare: 'Rare',
  epic: 'Épique',
  legendary: 'Légendaire',
};

export const GalaxyAchievementsPanel: React.FC<GalaxyAchievementsPanelProps> = ({
  achievements,
  className
}) => {
  const unlockedCount = achievements.filter((a) => a.unlocked).length;

  return (
    <Card className={cn('bg-card/80 backdrop-blur-sm border-border/50', className)}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg flex items-center gap-2">
            <Award className="h-5 w-5 text-primary" />
            Achievements cosmiques
          </CardTitle>
          <Badge variant="secondary">
            {unlockedCount}/{achievements.length}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        {achievements.map((achievement, index) => {
          const IconComponent = ICON_MAP[achievement.icon] || Star;
          const isLocked = !achievement.unlocked;
          const hasProgress = achievement.progress !== undefined && achievement.maxProgress !== undefined;

          return (
            <motion.div
              key={achievement.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
              className={cn(
                'relative flex items-start gap-3 p-3 rounded-lg border transition-all',
                isLocked
                  ? 'bg-muted/30 border-border/50 opacity-60'
                  : RARITY_STYLES[achievement.rarity]
              )}
            >
              {/* Icône */}
              <div
                className={cn(
                  'shrink-0 w-10 h-10 rounded-full flex items-center justify-center',
                  isLocked ? 'bg-muted' : 'bg-background/50'
                )}
              >
                {isLocked ? (
                  <Lock className="h-4 w-4 text-muted-foreground" />
                ) : (
                  <IconComponent className={cn('h-5 w-5', RARITY_STYLES[achievement.rarity].split(' ').pop())} />
                )}
              </div>

              {/* Contenu */}
              <div className="flex-1 min-w-0 space-y-1">
                <div className="flex items-center gap-2">
                  <span className={cn(
                    'font-medium text-sm',
                    isLocked ? 'text-muted-foreground' : 'text-foreground'
                  )}>
                    {achievement.name}
                  </span>
                  <Badge
                    variant="outline"
                    className={cn(
                      'text-[10px] px-1.5 py-0',
                      isLocked ? '' : RARITY_STYLES[achievement.rarity]
                    )}
                  >
                    {RARITY_LABELS[achievement.rarity]}
                  </Badge>
                </div>
                <p className="text-xs text-muted-foreground line-clamp-2">
                  {achievement.description}
                </p>

                {/* Progression */}
                {hasProgress && isLocked && (
                  <div className="pt-1 space-y-1">
                    <div className="flex justify-between text-[10px] text-muted-foreground">
                      <span>Progression</span>
                      <span>{achievement.progress}/{achievement.maxProgress}</span>
                    </div>
                    <Progress 
                      value={(achievement.progress! / achievement.maxProgress!) * 100} 
                      className="h-1.5" 
                    />
                  </div>
                )}

                {/* Date de déverrouillage */}
                {achievement.unlockedAt && (
                  <p className="text-[10px] text-muted-foreground/70">
                    Débloqué le {new Date(achievement.unlockedAt).toLocaleDateString('fr-FR')}
                  </p>
                )}
              </div>

              {/* Glow effect for unlocked legendary */}
              {achievement.unlocked && achievement.rarity === 'legendary' && (
                <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-amber-500/5 to-orange-500/5 pointer-events-none" />
              )}
            </motion.div>
          );
        })}

        {achievements.length === 0 && (
          <div className="text-center py-6 text-muted-foreground">
            <Trophy className="h-8 w-8 mx-auto mb-2 opacity-50" />
            <p className="text-sm">Aucun achievement disponible</p>
            <p className="text-xs">Commencez votre voyage cosmique !</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
