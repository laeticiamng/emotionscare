
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { mockChallenges, mockBadges, mockLeaderboard } from '@/hooks/community-gamification/mockData';

export interface GamificationTabProps {
  className?: string;
}

const GamificationTab: React.FC<GamificationTabProps> = ({ className }) => {
  return (
    <div className={className}>
      <Card>
        <CardHeader>
          <CardTitle>Gamification</CardTitle>
        </CardHeader>
        <CardContent>
          <h3 className="text-lg font-medium mb-4">Défis</h3>
          <div className="space-y-4 mb-6">
            {mockChallenges.slice(0, 3).map(challenge => (
              <div key={challenge.id} className="border p-3 rounded-md">
                <div className="flex justify-between items-center">
                  <h4 className="font-medium">{challenge.title}</h4>
                  <span className="text-sm">{challenge.progress}%</span>
                </div>
                <p className="text-sm text-muted-foreground">{challenge.description}</p>
              </div>
            ))}
          </div>

          <h3 className="text-lg font-medium mb-4">Badges</h3>
          <div className="grid grid-cols-3 gap-4 mb-6">
            {mockBadges.map(badge => (
              <div key={badge.id} className="border p-3 rounded-md text-center">
                <div className="text-2xl mb-2">🏅</div>
                <p className="text-sm font-medium">{badge.name}</p>
              </div>
            ))}
          </div>

          <h3 className="text-lg font-medium mb-4">Classement</h3>
          <div className="space-y-2">
            {mockLeaderboard.slice(0, 3).map(entry => (
              <div key={entry.id} className="flex justify-between items-center border p-2 rounded-md">
                <div className="flex items-center gap-2">
                  <span className="font-bold">{entry.rank}</span>
                  <span>{entry.username}</span>
                </div>
                <span className="font-medium">{entry.score} pts</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default GamificationTab;
