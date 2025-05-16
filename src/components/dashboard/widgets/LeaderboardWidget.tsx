
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ChevronRight, TrendingUp, TrendingDown, Minus, Medal, Award } from 'lucide-react';
import { LeaderboardEntry } from '@/types/gamification';

interface LeaderboardWidgetProps {
  leaderboard: LeaderboardEntry[];
  title?: string;
  showSeeAll?: boolean;
  onSeeAll?: () => void;
  highlightUserId?: string;
}

const LeaderboardWidget = ({ 
  leaderboard, 
  title = "Classement", 
  showSeeAll = true, 
  onSeeAll,
  highlightUserId
}: LeaderboardWidgetProps) => {
  // Sort leaderboard by position or rank or points
  const sortedLeaderboard = [...leaderboard].sort((a, b) => {
    if (a.position !== undefined && b.position !== undefined) {
      return a.position - b.position;
    }
    if (a.rank !== undefined && b.rank !== undefined) {
      return a.rank - b.rank;
    }
    return b.points - a.points;
  });
  
  // Function to get medal for top positions
  const getMedal = (position: number) => {
    if (position === 1) return <Medal className="h-4 w-4 text-yellow-500" />;
    if (position === 2) return <Medal className="h-4 w-4 text-gray-400" />;
    if (position === 3) return <Medal className="h-4 w-4 text-amber-700" />;
    return <span className="w-4 h-4 inline-flex items-center justify-center text-xs font-medium text-muted-foreground">{position}</span>;
  };
  
  // Function to get trend icon
  const getTrendIcon = (entry: LeaderboardEntry) => {
    if (entry.change && entry.change > 0 || entry.trend === 'up') {
      return <TrendingUp className="h-3 w-3 text-green-500" />;
    } else if (entry.change && entry.change < 0 || entry.trend === 'down') {
      return <TrendingDown className="h-3 w-3 text-red-500" />;
    }
    return <Minus className="h-3 w-3 text-gray-400" />;
  };
  
  // Calculate position for display
  const getPosition = (entry: LeaderboardEntry, index: number): number => {
    return entry.position ?? entry.rank ?? index + 1;
  };

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex justify-between items-center">
          <CardTitle>{title}</CardTitle>
          {showSeeAll && onSeeAll && (
            <Button 
              variant="ghost" 
              size="sm" 
              className="gap-1" 
              onClick={onSeeAll}
            >
              <span className="text-sm">Voir tout</span>
              <ChevronRight className="h-4 w-4" />
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {sortedLeaderboard.slice(0, 5).map((entry, index) => {
            const position = getPosition(entry, index);
            const isCurrentUser = entry.isCurrentUser || entry.userId === highlightUserId;
            
            return (
              <div 
                key={entry.id}
                className={`
                  flex items-center justify-between p-2 rounded-md
                  ${isCurrentUser ? 'bg-primary/10' : 'hover:bg-muted/50'}
                `}
              >
                <div className="flex items-center gap-3">
                  {getMedal(position)}
                  
                  <div className="h-8 w-8 rounded-full bg-muted flex-shrink-0 overflow-hidden">
                    {entry.avatar ? (
                      <img 
                        src={entry.avatar}
                        alt={entry.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-muted">
                        <Award className="h-4 w-4 text-muted-foreground" />
                      </div>
                    )}
                  </div>
                  
                  <div>
                    <p className="font-medium text-sm">{entry.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {entry.username || entry.department || `Niveau ${entry.level || 1}`}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <span className="font-medium">{entry.points}</span>
                  {getTrendIcon(entry)}
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};

export default LeaderboardWidget;
