/**
 * ParkAchievementsPanel - Panneau des succès du parc émotionnel
 * Affiche les badges, trophées et accomplissements de l'utilisateur
 */

import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { Trophy, Star, Award, Lock, Check, Sparkles, Crown, Medal, Target, Zap } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  category: 'exploration' | 'mastery' | 'social' | 'streak' | 'special';
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  progress: number;
  maxProgress: number;
  unlocked: boolean;
  unlockedAt?: string;
  reward?: { xp: number; coins?: number };
}

interface ParkAchievementsPanelProps {
  achievements: Achievement[];
  totalXP?: number;
  totalCoins?: number;
  onClaimReward?: (achievementId: string) => void;
}

const rarityConfig = {
  common: { 
    color: 'text-gray-500', 
    bg: 'bg-gray-500/10', 
    border: 'border-gray-300',
    label: 'Commun'
  },
  rare: { 
    color: 'text-blue-500', 
    bg: 'bg-blue-500/10', 
    border: 'border-blue-300',
    label: 'Rare'
  },
  epic: { 
    color: 'text-purple-500', 
    bg: 'bg-purple-500/10', 
    border: 'border-purple-300',
    label: 'Épique'
  },
  legendary: { 
    color: 'text-yellow-500', 
    bg: 'bg-yellow-500/10', 
    border: 'border-yellow-300',
    label: 'Légendaire'
  }
};

const categoryConfig = {
  exploration: { icon: Target, label: 'Exploration', color: 'text-green-500' },
  mastery: { icon: Crown, label: 'Maîtrise', color: 'text-purple-500' },
  social: { icon: Award, label: 'Social', color: 'text-pink-500' },
  streak: { icon: Zap, label: 'Séries', color: 'text-orange-500' },
  special: { icon: Sparkles, label: 'Spécial', color: 'text-yellow-500' }
};

const AchievementCard: React.FC<{ 
  achievement: Achievement; 
  index: number;
  onClaim?: () => void;
}> = ({ achievement, index, onClaim: _onClaim }) => {
  const rarity = rarityConfig[achievement.rarity];
  const progress = (achievement.progress / achievement.maxProgress) * 100;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
    >
      <Card className={`
        relative overflow-hidden transition-all duration-300
        ${achievement.unlocked 
          ? `${rarity.bg} border-2 ${rarity.border} hover:scale-[1.02]` 
          : 'bg-muted/30 border border-border/50 opacity-60'
        }
      `}>
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            {/* Icon */}
            <motion.div
              className={`
                relative w-14 h-14 rounded-xl flex items-center justify-center text-2xl
                ${achievement.unlocked ? rarity.bg : 'bg-muted'}
              `}
              whileHover={achievement.unlocked ? { rotate: [0, -10, 10, 0] } : undefined}
            >
              {achievement.unlocked ? (
                <span>{achievement.icon}</span>
              ) : (
                <Lock className="h-6 w-6 text-muted-foreground" />
              )}
              
              {achievement.unlocked && (
                <motion.div
                  className="absolute -top-1 -right-1 bg-green-500 rounded-full p-0.5"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                >
                  <Check className="h-3 w-3 text-white" />
                </motion.div>
              )}
            </motion.div>

            {/* Content */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <h4 className={`font-semibold truncate ${achievement.unlocked ? 'text-foreground' : 'text-muted-foreground'}`}>
                  {achievement.title}
                </h4>
                <Badge variant="outline" className={`text-xs ${rarity.color} shrink-0`}>
                  {rarity.label}
                </Badge>
              </div>
              
              <p className="text-xs text-muted-foreground mb-2 line-clamp-2">
                {achievement.description}
              </p>

              {/* Progress */}
              {!achievement.unlocked && (
                <div className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span>Progression</span>
                    <span>{achievement.progress}/{achievement.maxProgress}</span>
                  </div>
                  <Progress value={progress} className="h-1.5" />
                </div>
              )}

              {/* Reward */}
              {achievement.unlocked && achievement.reward && (
                <div className="flex items-center gap-2 mt-2">
                  <Badge variant="secondary" className="text-xs gap-1">
                    <Star className="h-3 w-3" />
                    +{achievement.reward.xp} XP
                  </Badge>
                  {achievement.reward.coins && (
                    <Badge variant="secondary" className="text-xs gap-1">
                      🪙 +{achievement.reward.coins}
                    </Badge>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Unlocked date */}
          {achievement.unlocked && achievement.unlockedAt && (
            <p className="text-xs text-muted-foreground mt-2 text-right">
              Débloqué le {new Date(achievement.unlockedAt).toLocaleDateString('fr-FR')}
            </p>
          )}
        </CardContent>

        {/* Legendary glow effect */}
        {achievement.unlocked && achievement.rarity === 'legendary' && (
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-yellow-500/10 via-orange-500/10 to-yellow-500/10"
            animate={{ opacity: [0.3, 0.6, 0.3] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
        )}
      </Card>
    </motion.div>
  );
};

export const ParkAchievementsPanel: React.FC<ParkAchievementsPanelProps> = ({
  achievements,
  totalXP = 0,
  totalCoins = 0,
  onClaimReward
}) => {
  const stats = useMemo(() => {
    const unlocked = achievements.filter(a => a.unlocked).length;
    const total = achievements.length;
    const byRarity = {
      common: achievements.filter(a => a.rarity === 'common' && a.unlocked).length,
      rare: achievements.filter(a => a.rarity === 'rare' && a.unlocked).length,
      epic: achievements.filter(a => a.rarity === 'epic' && a.unlocked).length,
      legendary: achievements.filter(a => a.rarity === 'legendary' && a.unlocked).length
    };
    return { unlocked, total, byRarity, percentage: Math.round((unlocked / total) * 100) };
  }, [achievements]);

  const categories = useMemo(() => {
    return Object.keys(categoryConfig) as Array<keyof typeof categoryConfig>;
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6"
    >
      {/* Header Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <Card className="bg-gradient-to-br from-primary/10 to-primary/5">
          <CardContent className="p-4 text-center">
            <Trophy className="h-6 w-6 text-primary mx-auto mb-2" />
            <p className="text-2xl font-bold">{stats.unlocked}/{stats.total}</p>
            <p className="text-xs text-muted-foreground">Succès débloqués</p>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-to-br from-yellow-500/10 to-orange-500/5">
          <CardContent className="p-4 text-center">
            <Star className="h-6 w-6 text-yellow-500 mx-auto mb-2" />
            <p className="text-2xl font-bold">{totalXP.toLocaleString()}</p>
            <p className="text-xs text-muted-foreground">XP Total</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-500/10 to-pink-500/5">
          <CardContent className="p-4 text-center">
            <Medal className="h-6 w-6 text-purple-500 mx-auto mb-2" />
            <p className="text-2xl font-bold">{stats.byRarity.legendary}</p>
            <p className="text-xs text-muted-foreground">Légendaires</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-500/10 to-emerald-500/5">
          <CardContent className="p-4 text-center">
            <Target className="h-6 w-6 text-green-500 mx-auto mb-2" />
            <p className="text-2xl font-bold">{stats.percentage}%</p>
            <p className="text-xs text-muted-foreground">Complétion</p>
          </CardContent>
        </Card>
      </div>

      {/* Tabs by Category */}
      <Tabs defaultValue="all" className="w-full">
        <TabsList className="w-full flex-wrap h-auto gap-1 p-1">
          <TabsTrigger value="all" className="flex-1">
            Tous
          </TabsTrigger>
          {categories.map(cat => {
            const config = categoryConfig[cat];
            const Icon = config.icon;
            return (
              <TabsTrigger key={cat} value={cat} className="flex-1 gap-1">
                <Icon className={`h-3 w-3 ${config.color}`} />
                <span className="hidden sm:inline">{config.label}</span>
              </TabsTrigger>
            );
          })}
        </TabsList>

        <TabsContent value="all" className="mt-4">
          <div className="grid gap-3 md:grid-cols-2">
            {achievements.map((achievement, index) => (
              <AchievementCard
                key={achievement.id}
                achievement={achievement}
                index={index}
                onClaim={onClaimReward ? () => onClaimReward(achievement.id) : undefined}
              />
            ))}
          </div>
        </TabsContent>

        {categories.map(cat => (
          <TabsContent key={cat} value={cat} className="mt-4">
            <div className="grid gap-3 md:grid-cols-2">
              {achievements
                .filter(a => a.category === cat)
                .map((achievement, index) => (
                  <AchievementCard
                    key={achievement.id}
                    achievement={achievement}
                    index={index}
                    onClaim={onClaimReward ? () => onClaimReward(achievement.id) : undefined}
                  />
                ))}
            </div>
          </TabsContent>
        ))}
      </Tabs>
    </motion.div>
  );
};

export default ParkAchievementsPanel;
