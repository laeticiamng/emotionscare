
import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';

const TeamLeaderboardCard: React.FC = () => {
  const teamMembers = [
    { id: '1', name: 'Équipe Marketing', score: 85, trend: 'up', members: 12 },
    { id: '2', name: 'R&D', score: 82, trend: 'up', members: 8 },
    { id: '3', name: 'Ventes', score: 78, trend: 'down', members: 15 },
    { id: '4', name: 'Support Client', score: 76, trend: 'up', members: 6 },
    { id: '5', name: 'Développement', score: 73, trend: 'down', members: 9 }
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Classement des équipes</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {teamMembers.map((team, index) => (
            <div key={team.id} className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="w-6 h-6 flex items-center justify-center bg-primary/10 text-primary rounded-full text-sm font-medium mr-3">
                  {index + 1}
                </div>
                <div>
                  <div className="font-medium">{team.name}</div>
                  <div className="text-xs text-muted-foreground">
                    {team.members} membres
                  </div>
                </div>
              </div>
              <div className="flex items-center">
                <Badge 
                  variant={team.trend === 'up' ? 'success' : 'destructive'}
                  className="mr-2"
                >
                  {team.trend === 'up' ? '↑' : '↓'}
                </Badge>
                <span className="font-medium">{team.score}</span>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default TeamLeaderboardCard;
