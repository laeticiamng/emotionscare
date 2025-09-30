// @ts-nocheck

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { useGamification } from '@/hooks/useGamification';
import { Trophy, Star, Target, Flame, Award } from 'lucide-react';
import { motion } from 'framer-motion';

const GamificationPanel: React.FC = () => {
  const { userPoints, userBadges, loading } = useGamification();

  if (loading) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Trophy className="h-5 w-5" />
            Progression
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse space-y-4">
            <div className="h-4 bg-muted rounded w-full"></div>
            <div className="h-4 bg-muted rounded w-3/4"></div>
            <div className="h-4 bg-muted rounded w-1/2"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  const currentLevel = userPoints?.level || 1;
  const totalPoints = userPoints?.total_points || 0;
  const nextLevelPoints = calculateNextLevelPoints(currentLevel);
  const currentLevelPoints = calculateCurrentLevelPoints(currentLevel);
  const progressPercentage = ((totalPoints - currentLevelPoints) / (nextLevelPoints - currentLevelPoints)) * 100;

  return (
    <div className="space-y-6">
      {/* Level Progress */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Trophy className="h-5 w-5 text-yellow-500" />
            Niveau {currentLevel}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex justify-between text-sm text-muted-foreground">
            <span>{totalPoints} points</span>
            <span>{nextLevelPoints} points pour le niveau suivant</span>
          </div>
          <Progress value={progressPercentage} className="h-3" />
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold text-primary">{totalPoints}</div>
              <div className="text-xs text-muted-foreground">Points Total</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-green-500">{currentLevel}</div>
              <div className="text-xs text-muted-foreground">Niveau</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-orange-500">{userBadges.length}</div>
              <div className="text-xs text-muted-foreground">Badges</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Recent Badges */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Award className="h-5 w-5 text-purple-500" />
            Badges Récents
          </CardTitle>
        </CardHeader>
        <CardContent>
          {userBadges.length > 0 ? (
            <div className="grid grid-cols-2 gap-3">
              {userBadges.slice(0, 4).map((userBadge, index) => (
                <motion.div
                  key={userBadge.id}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-center gap-2 p-2 rounded-lg bg-muted/50"
                >
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-yellow-400 to-yellow-600 flex items-center justify-center">
                    <Star className="h-4 w-4 text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium truncate">{userBadge.badge.name}</div>
                    <div className="text-xs text-muted-foreground truncate">{userBadge.badge.description}</div>
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="text-center py-6 text-muted-foreground">
              <Award className="h-12 w-12 mx-auto mb-2 opacity-20" />
              <p>Aucun badge pour le moment</p>
              <p className="text-xs">Continuez à utiliser l'app pour débloquer des récompenses !</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Quick Stats */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5 text-blue-500" />
            Statistiques Rapides
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center p-3 rounded-lg bg-blue-50 dark:bg-blue-950/20">
              <Flame className="h-6 w-6 mx-auto mb-1 text-orange-500" />
              <div className="text-lg font-bold">7</div>
              <div className="text-xs text-muted-foreground">Jours de suite</div>
            </div>
            <div className="text-center p-3 rounded-lg bg-green-50 dark:bg-green-950/20">
              <Star className="h-6 w-6 mx-auto mb-1 text-green-500" />
              <div className="text-lg font-bold">85%</div>
              <div className="text-xs text-muted-foreground">Objectifs atteints</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

// Helper functions
function calculateNextLevelPoints(level: number): number {
  const levels = [0, 100, 300, 600, 1000, 1500, 2100, 2800, 3600, 4500, 5500];
  return levels[level] || levels[levels.length - 1] + (level - levels.length + 1) * 1000;
}

function calculateCurrentLevelPoints(level: number): number {
  const levels = [0, 100, 300, 600, 1000, 1500, 2100, 2800, 3600, 4500, 5500];
  return levels[level - 1] || 0;
}

export default GamificationPanel;
