/**
 * PlayerStats - Statistiques du joueur
 */

import React from 'react';
import { motion } from 'framer-motion';
import { Trophy, Star, Target, Flame, TrendingUp } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';

export interface PlayerStatsData {
  level: number;
  currentXP: number;
  maxXP: number;
  totalQuests: number;
  completedQuests: number;
  streak: number;
  bestStreak: number;
}

interface PlayerStatsProps {
  stats: PlayerStatsData;
  compact?: boolean;
}

export const PlayerStats: React.FC<PlayerStatsProps> = ({ stats, compact = false }) => {
  const xpProgress = (stats.currentXP / stats.maxXP) * 100;
  const completionRate = stats.totalQuests > 0 
    ? Math.round((stats.completedQuests / stats.totalQuests) * 100) 
    : 0;

  if (compact) {
    return (
      <div className="flex items-center gap-6 flex-wrap">
        <div className="flex items-center gap-2">
          <Trophy className="w-5 h-5 text-warning" />
          <span className="font-semibold">Niveau {stats.level}</span>
        </div>
        <div className="flex items-center gap-2">
          <Star className="w-5 h-5 text-info" />
          <span>{stats.currentXP} / {stats.maxXP} XP</span>
        </div>
        <div className="flex items-center gap-2">
          <Flame className="w-5 h-5 text-destructive" />
          <span>{stats.streak} jours</span>
        </div>
        <div className="flex-1 max-w-xs">
          <Progress value={xpProgress} className="h-2" />
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <Card className="bg-gradient-to-br from-warning/10 to-warning/5 border-warning/20">
          <CardContent className="pt-6 text-center">
            <Trophy className="w-8 h-8 mx-auto mb-2 text-warning" />
            <div className="text-2xl font-bold text-foreground">{stats.level}</div>
            <div className="text-sm text-muted-foreground">Niveau</div>
            <div className="mt-2">
              <Progress value={xpProgress} className="h-2" />
              <div className="text-xs text-muted-foreground mt-1">
                {stats.currentXP} / {stats.maxXP} XP
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <Card className="bg-gradient-to-br from-primary/10 to-primary/5 border-primary/20">
          <CardContent className="pt-6 text-center">
            <Target className="w-8 h-8 mx-auto mb-2 text-primary" />
            <div className="text-2xl font-bold text-foreground">{stats.completedQuests}</div>
            <div className="text-sm text-muted-foreground">Quêtes complétées</div>
            <div className="text-xs text-success mt-2">
              {completionRate}% de réussite
            </div>
          </CardContent>
        </Card>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <Card className="bg-gradient-to-br from-destructive/10 to-destructive/5 border-destructive/20">
          <CardContent className="pt-6 text-center">
            <Flame className="w-8 h-8 mx-auto mb-2 text-destructive" />
            <div className="text-2xl font-bold text-foreground">{stats.streak}</div>
            <div className="text-sm text-muted-foreground">Série actuelle</div>
            <div className="text-xs text-muted-foreground mt-2">
              Record: {stats.bestStreak} jours
            </div>
          </CardContent>
        </Card>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <Card className="bg-gradient-to-br from-info/10 to-info/5 border-info/20">
          <CardContent className="pt-6 text-center">
            <TrendingUp className="w-8 h-8 mx-auto mb-2 text-info" />
            <div className="text-2xl font-bold text-foreground">{stats.totalQuests}</div>
            <div className="text-sm text-muted-foreground">Quêtes totales</div>
            <div className="text-xs text-info mt-2">
              Continue ! 💪
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};
