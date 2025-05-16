
import React from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Trophy, Crown } from 'lucide-react';

interface LeaderboardEntry {
  id: string;
  userId: string;
  name: string;
  avatar?: string;
  points: number;
  rank: number;
  level: number;
  isCurrentUser: boolean;
}

export interface LeaderboardWidgetProps {
  leaderboard: LeaderboardEntry[];
  title?: string;
  showSeeAll?: boolean;
  onSeeAll?: () => void;
}

const LeaderboardWidget: React.FC<LeaderboardWidgetProps> = ({
  leaderboard,
  title = "Classement",
  showSeeAll = false,
  onSeeAll
}) => {
  return (
    <Card className="overflow-hidden">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-medium">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        {leaderboard.length === 0 ? (
          <div className="text-center py-8">
            <div className="flex justify-center mb-3">
              <Trophy className="h-10 w-10 text-muted-foreground opacity-50" />
            </div>
            <p className="text-muted-foreground">Aucun classement disponible</p>
          </div>
        ) : (
          <div className="space-y-2">
            {leaderboard.map((entry) => (
              <div 
                key={entry.id}
                className={`flex items-center p-2 rounded-md ${
                  entry.isCurrentUser ? 'bg-primary/10' : 'hover:bg-muted'
                }`}
              >
                <div className="w-6 flex justify-center">
                  {entry.rank === 1 ? (
                    <Crown className="h-4 w-4 text-yellow-500" />
                  ) : (
                    <span className="text-sm font-medium">{entry.rank}</span>
                  )}
                </div>
                
                <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center mx-2">
                  {entry.avatar ? (
                    <img 
                      src={entry.avatar} 
                      alt={entry.name} 
                      className="w-full h-full rounded-full object-cover"
                    />
                  ) : (
                    <span className="text-xs font-medium">
                      {entry.name.substring(0, 2).toUpperCase()}
                    </span>
                  )}
                </div>
                
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">
                    {entry.name}
                    {entry.isCurrentUser && <span className="ml-1 text-xs">(vous)</span>}
                  </p>
                </div>
                
                <div className="flex flex-col items-end">
                  <span className="text-xs font-medium">{entry.points} pts</span>
                  <span className="text-xs text-muted-foreground">Niv. {entry.level}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
      {showSeeAll && leaderboard.length > 0 && (
        <CardFooter className="pt-0">
          <Button 
            variant="ghost" 
            size="sm" 
            className="w-full text-xs"
            onClick={onSeeAll}
          >
            Voir le classement complet
          </Button>
        </CardFooter>
      )}
    </Card>
  );
};

export default LeaderboardWidget;
