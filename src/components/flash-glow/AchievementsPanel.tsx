/**
 * AchievementsPanel - Panneau des achievements Flash Glow
 */

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Award, Lock, CheckCircle } from 'lucide-react';
import type { FlashGlowAchievement } from './types';
import { cn } from '@/lib/utils';

interface AchievementsPanelProps {
  achievements: FlashGlowAchievement[];
}

const AchievementsPanel: React.FC<AchievementsPanelProps> = ({ achievements }) => {
  const unlockedCount = achievements.filter(a => a.unlocked).length;

  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Award className="h-5 w-5 text-warning" aria-hidden="true" />
            Achievements
          </CardTitle>
          <span className="text-sm text-muted-foreground">
            {unlockedCount}/{achievements.length}
          </span>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        {achievements.length === 0 ? (
          <div className="text-center py-6 text-muted-foreground">
            <div className="text-4xl mb-2">🏆</div>
            <p className="text-sm">Les achievements apparaîtront ici</p>
          </div>
        ) : (
          achievements.map((achievement) => {
            const progressPercent = Math.min(100, (achievement.progress / achievement.target) * 100);
            
            return (
              <div
                key={achievement.id}
                className={cn(
                  "flex items-center gap-3 p-3 rounded-lg border transition-all",
                  achievement.unlocked 
                    ? "bg-gradient-to-r from-warning/10 to-primary/10 border-warning/20" 
                    : "bg-muted/30 border-transparent opacity-70"
                )}
              >
                <div className={cn(
                  "w-12 h-12 rounded-full flex items-center justify-center text-2xl",
                  achievement.unlocked 
                    ? "bg-warning/20" 
                    : "bg-muted"
                )}>
                  {achievement.unlocked ? (
                    achievement.emoji
                  ) : (
                    <Lock className="h-5 w-5 text-muted-foreground" aria-hidden="true" />
                  )}
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className={cn(
                      "font-medium text-sm truncate",
                      achievement.unlocked && "text-foreground"
                    )}>
                      {achievement.name}
                    </span>
                    {achievement.unlocked && (
                      <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0" aria-hidden="true" />
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground truncate">
                    {achievement.description}
                  </p>
                  
                  {!achievement.unlocked && (
                    <div className="mt-2">
                      <Progress value={progressPercent} className="h-1.5" />
                      <span className="text-xs text-muted-foreground">
                        {achievement.progress}/{achievement.target}
                      </span>
                    </div>
                  )}
                  
                  {achievement.unlocked && achievement.unlockedAt && (
                    <p className="text-xs text-muted-foreground mt-1">
                      Débloqué le {new Date(achievement.unlockedAt).toLocaleDateString('fr-FR')}
                    </p>
                  )}
                </div>
              </div>
            );
          })
        )}
      </CardContent>
    </Card>
  );
};

export default AchievementsPanel;
