
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';

interface TeamMember {
  id: string;
  name: string;
  avatar?: string;
  department?: string;
  score: number;
  change?: number;
}

interface TeamLeaderboardCardProps {
  title?: string;
  members: TeamMember[];
  metric?: string;
}

const TeamLeaderboardCard: React.FC<TeamLeaderboardCardProps> = ({
  title = "Performance d'équipe",
  members,
  metric = "Score"
}) => {
  // Sort members by score (highest first)
  const sortedMembers = [...members].sort((a, b) => b.score - a.score);

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <div className="space-y-1">
          {sortedMembers.map((member, index) => (
            <div
              key={member.id}
              className="flex items-center justify-between p-3 hover:bg-muted/50 transition-colors"
            >
              <div className="flex items-center gap-3">
                <span className="text-muted-foreground font-mono w-5 text-right">
                  #{index + 1}
                </span>
                <Avatar className="h-8 w-8">
                  <AvatarImage src={member.avatar} />
                  <AvatarFallback>
                    {member.name.substring(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="text-sm font-medium">{member.name}</p>
                  {member.department && (
                    <p className="text-xs text-muted-foreground">
                      {member.department}
                    </p>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="outline">
                  {member.score} {metric}
                </Badge>
                {member.change !== undefined && (
                  <span
                    className={`text-xs ${
                      member.change > 0
                        ? 'text-green-500'
                        : member.change < 0
                        ? 'text-red-500'
                        : 'text-muted-foreground'
                    }`}
                  >
                    {member.change > 0 ? '+' : ''}
                    {member.change}%
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default TeamLeaderboardCard;
