// @ts-nocheck
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Challenge, Badge as BadgeType } from '@/types/gamification';
import { Trophy, Award } from 'lucide-react';

interface GamificationSummaryCardProps {
  challenges: Challenge[];
  badges: BadgeType[];
  className?: string;
}

const GamificationSummaryCard: React.FC<GamificationSummaryCardProps> = ({
  challenges = [],
  badges = [],
  className
}) => {
  const completedChallenges = challenges.filter(challenge => challenge.completed).length;
  const unlockedBadges = badges.filter(badge => badge.earned || badge.achieved || badge.unlocked).length;
  
  return (
    <Card className={className}>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg">Gamification</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Trophy className="h-4 w-4 text-warning" />
              <span className="text-sm font-medium">Défis</span>
            </div>
            <Badge variant="outline">
              {completedChallenges}/{challenges.length}
            </Badge>
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Award className="h-4 w-4 text-primary" />
              <span className="text-sm font-medium">Badges</span>
            </div>
            <Badge variant="outline">
              {unlockedBadges}/{badges.length}
            </Badge>
          </div>
          
          {challenges.length > 0 && (
            <div className="mt-4">
              <h4 className="text-sm font-medium mb-2">Défis actifs</h4>
              <ul className="space-y-1">
                {challenges.slice(0, 2).map(challenge => (
                  <li key={challenge.id} className="text-xs flex items-center justify-between">
                    <span className="truncate">{challenge.title}</span>
                    <span className="text-muted-foreground">{challenge.progress}%</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default GamificationSummaryCard;
