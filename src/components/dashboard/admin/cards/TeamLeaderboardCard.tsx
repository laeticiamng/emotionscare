// @ts-nocheck

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Progress } from '@/components/ui/progress';

interface TeamMember {
  id: string;
  name: string;
  role: string;
  points: number;
  progress: number;
  avatar?: string;
}

interface TeamLeaderboardCardProps {
  title?: string;
  members: TeamMember[];
}

const TeamLeaderboardCard: React.FC<TeamLeaderboardCardProps> = ({
  title = "Performance d'équipe",
  members = []
}) => {
  // Sort members by points in descending order
  const sortedMembers = [...members].sort((a, b) => b.points - a.points);
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {sortedMembers.map((member, index) => (
            <div key={member.id} className="flex items-center space-x-4">
              <div className="font-medium text-sm w-5">{index + 1}</div>
              <Avatar className="h-9 w-9">
                <AvatarImage src={member.avatar} alt={member.name} />
                <AvatarFallback>
                  {member.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{member.name}</p>
                <p className="text-xs text-muted-foreground">{member.role}</p>
                <div className="mt-1">
                  <Progress value={member.progress} className="h-1" />
                </div>
              </div>
              <div className="font-semibold text-sm">{member.points}</div>
            </div>
          ))}

          {members.length === 0 && (
            <div className="text-center py-6 text-muted-foreground">
              Aucune donnée d'équipe disponible
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default TeamLeaderboardCard;
