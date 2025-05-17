
import React from 'react';
import { Badge } from '@/types';
import BadgeCard from './BadgeCard';
import { Progress } from '@/components/ui/progress';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface GamificationDashboardProps {
  badges: Badge[];
  level: number;
  xp: number;
  nextLevelXp: number;
}

const GamificationDashboard: React.FC<GamificationDashboardProps> = ({
  badges,
  level,
  xp,
  nextLevelXp
}) => {
  const progressPercentage = (xp / nextLevelXp) * 100;

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Level {level}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>{xp} XP</span>
              <span>{nextLevelXp} XP</span>
            </div>
            <Progress value={progressPercentage} className="h-2" />
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {badges.map((badge) => (
          <BadgeCard
            key={badge.id}
            badge={badge}
            progress={badge.progress || 0} // Use property that exists in the Badge type
          />
        ))}
      </div>
    </div>
  );
};

export default GamificationDashboard;
