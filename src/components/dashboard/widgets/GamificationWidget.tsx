
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { useGamification } from '@/hooks/useGamification';
import { Trophy, Star, Award, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const GamificationWidget: React.FC = () => {
  const { userPoints, userBadges, loading } = useGamification();
  const navigate = useNavigate();

  if (loading) {
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
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Trophy className="h-5 w-5 text-yellow-500" />
          Niveau {currentLevel}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <div className="flex justify-between text-sm text-muted-foreground mb-2">
            <span>{totalPoints} points</span>
            <span>{nextLevelPoints - totalPoints} pour le niveau suivant</span>
          </div>
          <Progress value={progressPercentage} className="h-2" />
        </div>
        
        <div className="grid grid-cols-3 gap-2 text-center">
          <div>
            <div className="text-lg font-bold text-primary">{totalPoints}</div>
            <div className="text-xs text-muted-foreground">Points</div>
          </div>
          <div>
            <div className="text-lg font-bold text-green-500">{currentLevel}</div>
            <div className="text-xs text-muted-foreground">Niveau</div>
          </div>
          <div>
            <div className="text-lg font-bold text-purple-500">{userBadges.length}</div>
            <div className="text-xs text-muted-foreground">Badges</div>
          </div>
        </div>

        {userBadges.length > 0 && (
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Award className="h-4 w-4 text-purple-500" />
              <span className="text-sm font-medium">Derniers badges</span>
            </div>
            <div className="flex gap-2">
              {userBadges.slice(0, 3).map((badge) => (
                <div
                  key={badge.id}
                  className="w-8 h-8 rounded-full bg-gradient-to-br from-yellow-400 to-yellow-600 flex items-center justify-center"
                  title={badge.badge.name}
                >
                  <Star className="h-4 w-4 text-white" />
                </div>
              ))}
              {userBadges.length > 3 && (
                <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center text-xs font-medium">
                  +{userBadges.length - 3}
                </div>
              )}
            </div>
          </div>
        )}

        <Button 
          variant="outline" 
          size="sm" 
          className="w-full"
          onClick={() => navigate('/gamification')}
        >
          Voir détails
          <ArrowRight className="h-4 w-4 ml-2" />
        </Button>
      </CardContent>
    </Card>
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

export default GamificationWidget;
