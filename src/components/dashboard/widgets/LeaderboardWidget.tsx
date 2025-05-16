
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Trophy, Medal } from 'lucide-react';

interface LeaderboardEntry {
  id: string;
  userId: string;
  name: string;
  avatar: string;
  points: number;
  rank: number;
  level: number;
  isCurrentUser: boolean;
}

interface LeaderboardWidgetProps {
  leaderboard: LeaderboardEntry[];
  title?: string;
  showSeeAll?: boolean;
  onSeeAll?: () => void;
  className?: string;
}

const LeaderboardWidget: React.FC<LeaderboardWidgetProps> = ({
  leaderboard,
  title = "Classement",
  showSeeAll = false,
  onSeeAll,
  className,
}) => {
  return (
    <Card className={className}>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-lg font-medium">{title}</CardTitle>
        {showSeeAll && (
          <button
            onClick={onSeeAll}
            className="text-sm font-medium text-primary hover:underline"
          >
            Voir tout
          </button>
        )}
      </CardHeader>
      <CardContent>
        {leaderboard.length > 0 ? (
          <div className="space-y-3">
            {leaderboard.slice(0, 5).map((entry) => (
              <div
                key={entry.id}
                className={`flex items-center justify-between p-2 rounded-lg ${
                  entry.isCurrentUser ? 'bg-primary/10' : 'hover:bg-accent'
                } transition-colors`}
              >
                <div className="flex items-center gap-3">
                  <div className="w-6 text-center">
                    {entry.rank === 1 ? (
                      <Trophy className="h-5 w-5 text-yellow-500" />
                    ) : entry.rank === 2 ? (
                      <Medal className="h-5 w-5 text-gray-400" />
                    ) : entry.rank === 3 ? (
                      <Medal className="h-5 w-5 text-amber-700" />
                    ) : (
                      <span className="text-sm font-medium">{entry.rank}</span>
                    )}
                  </div>
                  
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={entry.avatar} />
                    <AvatarFallback>
                      {entry.name.substring(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  
                  <div>
                    <p className="text-sm font-medium line-clamp-1">
                      {entry.name}
                      {entry.isCurrentUser && (
                        <span className="ml-2 text-xs text-muted-foreground">(Vous)</span>
                      )}
                    </p>
                    <p className="text-xs text-muted-foreground">Niveau {entry.level}</p>
                  </div>
                </div>
                
                <div className="text-sm font-semibold">
                  {entry.points} pts
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-6 text-muted-foreground">
            <p>Aucun classement disponible</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default LeaderboardWidget;
