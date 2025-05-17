
import React from 'react';
import { Badge } from '@/types/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface GamificationDashboardProps {
  badges: Badge[];
  points: number;
  level: number;
  streak: number;
  progressToNextLevel: number;
}

const GamificationDashboard: React.FC<GamificationDashboardProps> = ({
  badges,
  points,
  level,
  streak,
  progressToNextLevel
}) => {
  const recentBadges = badges
    .filter(badge => badge.unlockedAt || badge.unlocked_at)
    .sort((a, b) => {
      const dateA = new Date(a.unlockedAt || a.unlocked_at || '').getTime();
      const dateB = new Date(b.unlockedAt || b.unlocked_at || '').getTime();
      return dateB - dateA;
    })
    .slice(0, 3);

  const inProgressBadges = badges
    .filter(badge => !(badge.unlockedAt || badge.unlocked_at) && badge.progress !== undefined && badge.progress < 100)
    .slice(0, 3);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Points</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{points}</div>
            <div className="text-sm text-muted-foreground">
              {progressToNextLevel}% vers le niveau {level + 1}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Niveau</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{level}</div>
            <div className="text-sm text-muted-foreground">
              Rang: Apprenti
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Série</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{streak} jours</div>
            <div className="text-sm text-muted-foreground">
              Votre plus longue série: 14 jours
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Badges récents</CardTitle>
        </CardHeader>
        <CardContent>
          {recentBadges.length > 0 ? (
            <div className="grid grid-cols-3 gap-4">
              {recentBadges.map(badge => (
                <div key={badge.id} className="flex flex-col items-center">
                  <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center">
                    <span className="text-2xl">{badge.icon || '🏆'}</span>
                  </div>
                  <span className="text-center mt-2 font-medium">{badge.name}</span>
                  <span className="text-xs text-center text-muted-foreground">{badge.description}</span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-center py-4 text-muted-foreground">Aucun badge débloqué récemment</p>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Badges en cours</CardTitle>
        </CardHeader>
        <CardContent>
          {inProgressBadges.length > 0 ? (
            <div className="space-y-4">
              {inProgressBadges.map(badge => (
                <div key={badge.id} className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center">
                    <span className="text-xl">{badge.icon || '🏆'}</span>
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium">{badge.name}</h4>
                    <p className="text-xs text-muted-foreground mb-1">{badge.description}</p>
                    <div className="h-2 bg-muted rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-primary" 
                        style={{ width: `${badge.progress}%` }}
                      ></div>
                    </div>
                    <div className="flex justify-between text-xs text-muted-foreground mt-1">
                      <span>{badge.progress}%</span>
                      <span>{badge.threshold || 100}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-center py-4 text-muted-foreground">Aucun badge en cours</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default GamificationDashboard;
