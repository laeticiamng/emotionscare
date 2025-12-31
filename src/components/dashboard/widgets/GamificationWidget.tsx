/**
 * Gamification Widget - Dashboard widget
 */

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { useGamification } from '@/modules/gamification';
import { Trophy, Star, Award, ArrowRight, Flame, Zap } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

const GamificationWidget: React.FC = () => {
  const { progress, achievements, dailyChallenges, isLoading } = useGamification();
  const navigate = useNavigate();

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Trophy className="h-5 w-5" />
            Progression
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse space-y-3">
            <div className="h-4 bg-muted rounded w-full" />
            <div className="h-4 bg-muted rounded w-3/4" />
            <div className="h-4 bg-muted rounded w-1/2" />
          </div>
        </CardContent>
      </Card>
    );
  }

  const currentLevel = progress?.level ?? 1;
  const currentXp = progress?.currentXp ?? 0;
  const nextLevelXp = progress?.nextLevelXp ?? 100;
  const totalPoints = progress?.totalPoints ?? 0;
  const streak = progress?.streak ?? 0;
  const progressPercentage = (currentXp / nextLevelXp) * 100;
  const unlockedAchievements = achievements.filter(a => a.unlocked);
  const completedChallenges = dailyChallenges.filter(c => c.completed).length;

  return (
    <Card className="overflow-hidden">
      <CardHeader className="bg-gradient-to-r from-primary/10 to-accent/10">
        <CardTitle className="flex items-center gap-2">
          <Trophy className="h-5 w-5 text-warning" />
          Niveau {currentLevel}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4 pt-4">
        {/* XP Progress */}
        <div>
          <div className="flex justify-between text-sm text-muted-foreground mb-2">
            <span>{currentXp} XP</span>
            <span>{nextLevelXp - currentXp} pour niveau {currentLevel + 1}</span>
          </div>
          <Progress value={progressPercentage} className="h-2" />
        </div>
        
        {/* Stats Grid */}
        <div className="grid grid-cols-4 gap-2 text-center">
          <motion.div 
            className="p-2 rounded-lg bg-muted/50"
            whileHover={{ scale: 1.05 }}
          >
            <Zap className="h-4 w-4 mx-auto mb-1 text-primary" />
            <div className="text-lg font-bold">{totalPoints}</div>
            <div className="text-xs text-muted-foreground">Points</div>
          </motion.div>
          <motion.div 
            className="p-2 rounded-lg bg-muted/50"
            whileHover={{ scale: 1.05 }}
          >
            <Flame className="h-4 w-4 mx-auto mb-1 text-warning" />
            <div className="text-lg font-bold">{streak}</div>
            <div className="text-xs text-muted-foreground">Série</div>
          </motion.div>
          <motion.div 
            className="p-2 rounded-lg bg-muted/50"
            whileHover={{ scale: 1.05 }}
          >
            <Award className="h-4 w-4 mx-auto mb-1 text-accent" />
            <div className="text-lg font-bold">{unlockedAchievements.length}</div>
            <div className="text-xs text-muted-foreground">Badges</div>
          </motion.div>
          <motion.div 
            className="p-2 rounded-lg bg-muted/50"
            whileHover={{ scale: 1.05 }}
          >
            <Star className="h-4 w-4 mx-auto mb-1 text-info" />
            <div className="text-lg font-bold">{completedChallenges}/{dailyChallenges.length}</div>
            <div className="text-xs text-muted-foreground">Défis</div>
          </motion.div>
        </div>

        {/* Recent Achievements */}
        {unlockedAchievements.length > 0 && (
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Award className="h-4 w-4 text-accent" />
              <span className="text-sm font-medium">Derniers succès</span>
            </div>
            <div className="flex gap-2">
              {unlockedAchievements.slice(0, 3).map((achievement) => (
                <motion.div
                  key={achievement.id}
                  whileHover={{ scale: 1.1 }}
                  className="w-8 h-8 rounded-full bg-gradient-to-br from-warning to-warning/70 flex items-center justify-center cursor-pointer"
                  title={achievement.name}
                >
                  <span className="text-sm">{achievement.icon}</span>
                </motion.div>
              ))}
              {unlockedAchievements.length > 3 && (
                <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center text-xs font-medium">
                  +{unlockedAchievements.length - 3}
                </div>
              )}
            </div>
          </div>
        )}

        <Button 
          variant="outline" 
          size="sm" 
          className="w-full group"
          onClick={() => navigate('/app/gamification')}
        >
          Voir détails
          <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
        </Button>
      </CardContent>
    </Card>
  );
};

export default GamificationWidget;
