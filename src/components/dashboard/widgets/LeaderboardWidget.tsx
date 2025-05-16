
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { LeaderboardEntry } from '@/types/gamification';
import { TrendingUp, TrendingDown, Minus, Crown } from 'lucide-react';

interface LeaderboardWidgetProps {
  entries: LeaderboardEntry[];
  className?: string;
  title?: string;
  showAvatar?: boolean;
}

export const LeaderboardWidget: React.FC<LeaderboardWidgetProps> = ({
  entries,
  className = '',
  title = 'Classement',
  showAvatar = true
}) => {
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase();
  };

  const getTrendIcon = (entry: LeaderboardEntry) => {
    if (!entry.trend) return <Minus className="h-4 w-4 text-muted-foreground" />;
    
    if (entry.trend === 'up') {
      return <TrendingUp className="h-4 w-4 text-green-500" />;
    } else if (entry.trend === 'down') {
      return <TrendingDown className="h-4 w-4 text-red-500" />;
    } else {
      return <Minus className="h-4 w-4 text-muted-foreground" />;
    }
  };

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="text-lg">{title}</CardTitle>
      </CardHeader>
      <CardContent className="px-2">
        <div className="space-y-1">
          {entries.map((entry, index) => (
            <div
              key={entry.id}
              className={`flex items-center p-2 rounded-md ${
                entry.isCurrentUser ? 'bg-primary/10' : index % 2 === 0 ? 'bg-muted/50' : ''
              }`}
            >
              <div className="w-6 font-medium text-center">
                {index === 0 ? (
                  <Crown className="h-5 w-5 text-amber-500 mx-auto" />
                ) : (
                  <span>{index + 1}</span>
                )}
              </div>
              
              {showAvatar && (
                <Avatar className="h-8 w-8 ml-2">
                  {entry.avatar ? (
                    <AvatarImage src={entry.avatar} alt={entry.name} />
                  ) : (
                    <AvatarFallback>{getInitials(entry.name)}</AvatarFallback>
                  )}
                </Avatar>
              )}
              
              <div className="ml-3 flex-1">
                <p className={`text-sm font-medium ${entry.isCurrentUser ? 'text-primary' : ''}`}>
                  {entry.name}
                </p>
              </div>
              
              <div className="text-sm font-medium">{entry.points} pts</div>
              
              <div className="ml-2">{getTrendIcon(entry)}</div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default LeaderboardWidget;
