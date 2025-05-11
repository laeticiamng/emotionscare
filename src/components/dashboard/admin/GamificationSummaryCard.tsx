
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Trophy } from 'lucide-react';
import { Progress } from '@/components/ui/progress';

interface GamificationStats {
  activeUsersPercent: number;
  totalBadges: number;
  badgeLevels: {
    level: string;
    count: number;
  }[];
  topChallenges: {
    name: string;
    completions: number;
  }[];
}

interface GamificationSummaryCardProps {
  gamificationStats: GamificationStats;
}

const GamificationSummaryCard: React.FC<GamificationSummaryCardProps> = ({
  gamificationStats
}) => {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg flex items-center">
          <Trophy className="h-5 w-5 mr-2 text-amber-500" />
          Gamification
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="mb-4">
          <div className="flex justify-between items-center mb-1">
            <div className="text-sm font-medium">Utilisateurs actifs</div>
            <div className="text-sm font-medium">{gamificationStats.activeUsersPercent}%</div>
          </div>
          <Progress value={gamificationStats.activeUsersPercent} className="h-2" />
          <div className="text-xs text-muted-foreground mt-1">
            {gamificationStats.activeUsersPercent}% des utilisateurs participent activement
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <h4 className="text-sm font-medium mb-2">Distribution des badges</h4>
            <div className="space-y-2">
              {gamificationStats.badgeLevels.map((level) => (
                <div key={level.level} className="bg-muted/20 rounded-md p-2 flex justify-between">
                  <div className="text-sm">{level.level}</div>
                  <div className="text-sm font-medium">{level.count}</div>
                </div>
              ))}
            </div>
          </div>
          
          <div>
            <h4 className="text-sm font-medium mb-2">Défis populaires</h4>
            <div className="space-y-2">
              {gamificationStats.topChallenges.map((challenge) => (
                <div key={challenge.name} className="bg-muted/20 rounded-md p-2 flex justify-between">
                  <div className="text-sm">{challenge.name}</div>
                  <div className="text-sm font-medium">{challenge.completions}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
        
        <div className="text-center">
          <div className="text-sm font-medium">{gamificationStats.totalBadges} badges décernés au total</div>
        </div>
      </CardContent>
    </Card>
  );
};

export default GamificationSummaryCard;
