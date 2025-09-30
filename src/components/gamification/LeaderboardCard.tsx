// @ts-nocheck

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Trophy, Medal, Award, Crown } from 'lucide-react';

interface LeaderboardEntry {
  id: string;
  name: string;
  avatar?: string;
  points: number;
  level: number;
  rank: number;
}

interface LeaderboardCardProps {
  entries: LeaderboardEntry[];
  currentUserId?: string;
  title?: string;
}

const LeaderboardCard: React.FC<LeaderboardCardProps> = ({
  entries,
  currentUserId,
  title = "Classement de la Semaine"
}) => {
  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1: return <Crown className="h-4 w-4 text-yellow-500" />;
      case 2: return <Medal className="h-4 w-4 text-gray-400" />;
      case 3: return <Award className="h-4 w-4 text-amber-600" />;
      default: return <span className="text-sm font-bold text-muted-foreground">#{rank}</span>;
    }
  };

  const getRankStyle = (rank: number) => {
    switch (rank) {
      case 1: return "bg-gradient-to-r from-yellow-50 to-yellow-100 dark:from-yellow-950/20 dark:to-yellow-900/20 border-yellow-200";
      case 2: return "bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-950/20 dark:to-gray-900/20 border-gray-200";
      case 3: return "bg-gradient-to-r from-amber-50 to-amber-100 dark:from-amber-950/20 dark:to-amber-900/20 border-amber-200";
      default: return "bg-muted/30";
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Trophy className="h-5 w-5 text-yellow-500" />
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {entries.map((entry) => (
            <div
              key={entry.id}
              className={`flex items-center gap-3 p-3 rounded-lg border transition-all ${
                getRankStyle(entry.rank)
              } ${
                entry.id === currentUserId ? 'ring-2 ring-primary ring-offset-1' : ''
              }`}
            >
              <div className="flex items-center justify-center w-8">
                {getRankIcon(entry.rank)}
              </div>
              
              <Avatar className="h-10 w-10">
                <AvatarImage src={entry.avatar} />
                <AvatarFallback>{entry.name.charAt(0)}</AvatarFallback>
              </Avatar>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="font-medium truncate">{entry.name}</span>
                  {entry.id === currentUserId && (
                    <Badge variant="secondary" className="text-xs">Vous</Badge>
                  )}
                </div>
                <div className="text-sm text-muted-foreground">
                  Niveau {entry.level}
                </div>
              </div>
              
              <div className="text-right">
                <div className="font-bold text-primary">{entry.points.toLocaleString()}</div>
                <div className="text-xs text-muted-foreground">points</div>
              </div>
            </div>
          ))}
        </div>
        
        {entries.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">
            <Trophy className="h-12 w-12 mx-auto mb-2 opacity-20" />
            <p>Aucun classement disponible</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default LeaderboardCard;
