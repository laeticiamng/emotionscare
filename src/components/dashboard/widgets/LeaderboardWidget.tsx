
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ChevronRight } from 'lucide-react';
import { LeaderboardEntry } from '@/types/gamification';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';

interface LeaderboardWidgetProps {
  leaderboard: LeaderboardEntry[];
  title?: string;
  limit?: number;
  showSeeAll?: boolean;
  onSeeAll?: () => void;
  showCurrentUser?: boolean;
  className?: string;
}

const LeaderboardWidget: React.FC<LeaderboardWidgetProps> = ({
  leaderboard = [],
  title = "Leaderboard",
  limit = 5,
  showSeeAll = false,
  onSeeAll,
  showCurrentUser = true,
  className = ""
}) => {
  if (leaderboard.length === 0) {
    return (
      <Card className={className}>
        <CardHeader>
          <CardTitle>{title}</CardTitle>
        </CardHeader>
        <CardContent className="text-center py-8 text-muted-foreground">
          No data available for the leaderboard
        </CardContent>
      </Card>
    );
  }
  
  const displayEntries = leaderboard.slice(0, limit);
  const currentUser = leaderboard.find(entry => entry.isCurrentUser);
  
  const getPositionColor = (position: number) => {
    if (position === 1) return 'text-yellow-500';
    if (position === 2) return 'text-gray-400';
    if (position === 3) return 'text-amber-700';
    return 'text-muted-foreground';
  };
  
  const getPositionBg = (position: number) => {
    if (position === 1) return 'bg-yellow-50';
    if (position === 2) return 'bg-gray-50';
    if (position === 3) return 'bg-amber-50';
    return '';
  };
  
  const getTrendBadge = (trend?: 'up' | 'down' | 'stable') => {
    if (!trend) return null;
    
    const badgeProps = {
      up: { className: 'bg-green-100 text-green-800 hover:bg-green-100', text: '↑' },
      down: { className: 'bg-red-100 text-red-800 hover:bg-red-100', text: '↓' },
      stable: { className: 'bg-gray-100 text-gray-800 hover:bg-gray-100', text: '―' }
    }[trend];
    
    return (
      <Badge variant="outline" className={badgeProps.className}>
        {badgeProps.text}
      </Badge>
    );
  };
  
  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <ul className="divide-y">
          {displayEntries.map((entry) => (
            <li 
              key={entry.id} 
              className={`flex items-center justify-between p-4 ${
                entry.isCurrentUser ? 'bg-primary/5' : getPositionBg(entry.rank)
              }`}
            >
              <div className="flex items-center gap-3">
                <div className={`flex items-center justify-center w-6 h-6 font-medium ${getPositionColor(entry.rank)}`}>
                  {entry.rank}
                </div>
                <Avatar className="h-8 w-8">
                  <AvatarImage src={entry.avatar} alt={entry.name} />
                  <AvatarFallback>
                    {entry.name?.slice(0, 2)?.toUpperCase() || "U"}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <div className="font-medium">{entry.name}</div>
                  {entry.department && (
                    <div className="text-xs text-muted-foreground">{entry.department}</div>
                  )}
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                {entry.trend && getTrendBadge(entry.trend)}
                <div className="font-medium text-right min-w-16">
                  {entry.points} pts
                </div>
              </div>
            </li>
          ))}
        </ul>
      </CardContent>
      
      {(showSeeAll || (showCurrentUser && currentUser && !displayEntries.includes(currentUser))) && (
        <CardFooter className="pt-2 pb-4 px-4">
          {showSeeAll && onSeeAll && (
            <Button variant="ghost" className="w-full justify-between" onClick={onSeeAll}>
              <span>See full leaderboard</span>
              <ChevronRight className="h-4 w-4" />
            </Button>
          )}
          
          {showCurrentUser && currentUser && !displayEntries.includes(currentUser) && (
            <div className="w-full p-3 rounded-md bg-muted/50 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="flex items-center justify-center w-6 h-6 font-medium text-primary">
                  {currentUser.rank}
                </div>
                <Avatar className="h-8 w-8">
                  <AvatarImage src={currentUser.avatar} alt={currentUser.name} />
                  <AvatarFallback>{currentUser.name?.slice(0, 2)?.toUpperCase() || "U"}</AvatarFallback>
                </Avatar>
                <div className="font-medium">You</div>
              </div>
              <div className="font-medium">{currentUser.points} pts</div>
            </div>
          )}
        </CardFooter>
      )}
    </Card>
  );
};

export default LeaderboardWidget;
