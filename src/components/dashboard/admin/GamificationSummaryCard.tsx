import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Trophy } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { GamificationStats } from '@/types/gamification';

interface GamificationSummaryCardProps {
  gamificationStats: GamificationStats;
}

const GamificationSummaryCard: React.FC<GamificationSummaryCardProps> = ({
  gamificationStats
}) => {
  // Define default values for optional properties
  const activeUsersPercent = gamificationStats.activeUsersPercent || 0;
  const totalBadges = gamificationStats.totalBadges || 0;
  const badgeLevels = gamificationStats.badgeLevels || [];
  const topChallenges = gamificationStats.topChallenges || [];

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
            <div className="text-sm font-medium">{activeUsersPercent}%</div>
          </div>
          <Progress value={activeUsersPercent} className="h-2" />
          <div className="text-xs text-muted-foreground mt-1">
            {activeUsersPercent}% des utilisateurs participent activement
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <h4 className="text-sm font-medium mb-2">Distribution des badges</h4>
            <div className="space-y-2">
              {stats.badgeLevels && Array.isArray(stats.badgeLevels) && stats.badgeLevels.map((level, index) => (
                <div key={index} className="bg-muted/20 rounded-md p-2 flex justify-between">
                  <div className="text-sm">{level.level}</div>
                  <div className="text-sm font-medium">{level.count}</div>
                </div>
              ))}
            </div>
          </div>
          
          <div>
            <h4 className="text-sm font-medium mb-2">Défis populaires</h4>
            <div className="space-y-2">
              {stats.topChallenges && Array.isArray(stats.topChallenges) && stats.topChallenges.map((challenge, index) => (
                <div key={index} className="flex justify-between items-center mb-2">
                  <span className="font-medium">{challenge.name || challenge.title}</span>
                  <div className="text-sm text-muted-foreground">
                    {challenge.completions || 0} complétions
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
        
        <div className="text-center">
          <div className="text-sm font-medium">{totalBadges} badges décernés au total</div>
        </div>
      </CardContent>
    </Card>
  );
};

export default GamificationSummaryCard;
