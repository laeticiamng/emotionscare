/**
 * Onglet des achievements/succès Ambition Arcade
 */
import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Skeleton } from '@/components/ui/skeleton';
import { Lock, Trophy } from 'lucide-react';
import { useAmbitionAchievements, type Achievement } from '../hooks';

const RARITY_COLORS: Record<string, string> = {
  common: 'bg-muted text-muted-foreground',
  rare: 'bg-info/20 text-info',
  epic: 'bg-primary/20 text-primary',
  legendary: 'bg-warning/20 text-warning'
};

const RARITY_LABELS: Record<string, string> = {
  common: 'Commun',
  rare: 'Rare',
  epic: 'Épique',
  legendary: 'Légendaire'
};

interface AchievementCardProps {
  achievement: Achievement;
  index: number;
}

const AchievementCard: React.FC<AchievementCardProps> = ({ achievement, index }) => {
  const progressPercent = (achievement.progress / achievement.maxProgress) * 100;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: index * 0.05 }}
    >
      <Card className={`relative overflow-hidden transition-all ${
        achievement.unlocked 
          ? 'border-primary/50 bg-gradient-to-br from-primary/5 to-transparent' 
          : 'opacity-70'
      }`}>
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <div className={`text-3xl ${!achievement.unlocked ? 'grayscale' : ''}`}>
              {achievement.unlocked ? achievement.icon : <Lock className="w-8 h-8 text-muted-foreground" />}
            </div>
            
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <h3 className={`font-semibold truncate ${
                  achievement.unlocked ? 'text-foreground' : 'text-muted-foreground'
                }`}>
                  {achievement.name}
                </h3>
                <Badge className={RARITY_COLORS[achievement.rarity]} variant="secondary">
                  {RARITY_LABELS[achievement.rarity]}
                </Badge>
              </div>
              
              <p className="text-sm text-muted-foreground mb-2">
                {achievement.description}
              </p>
              
              {!achievement.unlocked && (
                <div className="space-y-1">
                  <Progress value={progressPercent} className="h-2" />
                  <p className="text-xs text-muted-foreground">
                    {achievement.progress}/{achievement.maxProgress}
                  </p>
                </div>
              )}
            </div>

            {achievement.unlocked && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', delay: index * 0.05 + 0.2 }}
              >
                <div className="w-8 h-8 rounded-full bg-success/20 flex items-center justify-center">
                  <Trophy className="w-4 h-4 text-success" />
                </div>
              </motion.div>
            )}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export const AchievementsTab: React.FC = () => {
  const { achievements, unlockedCount, totalCount, isLoading } = useAmbitionAchievements();

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-8 w-48" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-28" />
          ))}
        </div>
      </div>
    );
  }

  const unlockedAchievements = achievements.filter(a => a.unlocked);
  const lockedAchievements = achievements.filter(a => !a.unlocked);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold flex items-center gap-2">
            <Trophy className="w-5 h-5 text-warning" />
            Succès
          </h2>
          <p className="text-sm text-muted-foreground">
            {unlockedCount}/{totalCount} débloqués
          </p>
        </div>
        <Progress value={(unlockedCount / totalCount) * 100} className="w-32 h-2" />
      </div>

      {/* Unlocked */}
      {unlockedAchievements.length > 0 && (
        <div className="space-y-3">
          <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
            Débloqués
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {unlockedAchievements.map((achievement, index) => (
              <AchievementCard key={achievement.id} achievement={achievement} index={index} />
            ))}
          </div>
        </div>
      )}

      {/* Locked */}
      {lockedAchievements.length > 0 && (
        <div className="space-y-3">
          <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
            À débloquer
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {lockedAchievements.map((achievement, index) => (
              <AchievementCard key={achievement.id} achievement={achievement} index={index} />
            ))}
          </div>
        </div>
      )}

      {achievements.length === 0 && (
        <div className="text-center py-12">
          <Trophy className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
          <h3 className="text-xl font-semibold mb-2">Commencez l'aventure</h3>
          <p className="text-muted-foreground">
            Créez votre premier objectif pour débloquer des succès
          </p>
        </div>
      )}
    </div>
  );
};

export default AchievementsTab;
