// @ts-nocheck

import React from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Trophy, Medal } from 'lucide-react';

interface LeaderboardEntry {
  id: string;
  userId: string;
  name: string;
  avatar?: string;
  points: number;
  rank: number;
  level?: number;
  isCurrentUser?: boolean;
}

interface LeaderboardWidgetProps {
  entries: LeaderboardEntry[];
  title?: string;
  className?: string;
  showSeeAll?: boolean;
  onSeeAll?: () => void;
}

const LeaderboardWidget: React.FC<LeaderboardWidgetProps> = ({
  entries,
  title = "Classement",
  className,
  showSeeAll,
  onSeeAll,
}) => {
  const getPositionIcon = (position: number) => {
    switch (position) {
      case 1:
        return <Trophy className="h-5 w-5 text-warning" />;
      case 2:
        return <Medal className="h-5 w-5 text-muted-foreground" />;
      case 3:
        return <Medal className="h-5 w-5 text-warning/70" />;
      default:
        return <span className="text-sm font-medium">{position}</span>;
    }
  };

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="text-lg font-semibold">{title}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        {entries.slice(0, 5).map((entry) => (
          <div 
            key={entry.id} 
            className={`flex items-center justify-between p-2 rounded-md ${entry.isCurrentUser ? 'bg-primary/10' : 'hover:bg-accent'}`}
          >
            <div className="flex items-center gap-3">
              <div className="flex-shrink-0 w-7 h-7 flex items-center justify-center">
                {getPositionIcon(entry.rank)}
              </div>
              <Avatar className="h-8 w-8">
                <AvatarImage src={entry.avatar} alt={entry.name} />
                <AvatarFallback>{entry.name.substring(0, 2).toUpperCase()}</AvatarFallback>
              </Avatar>
              <div>
                <p className="text-sm font-medium">
                  {entry.name} 
                  {entry.isCurrentUser && <span className="text-xs text-muted-foreground ml-1">(Vous)</span>}
                </p>
                <p className="text-xs text-muted-foreground">Niveau {entry.level || 1}</p>
              </div>
            </div>
            <div className="text-sm font-medium">{entry.points} pts</div>
          </div>
        ))}
      </CardContent>
      {showSeeAll && (
        <CardFooter>
          <Button 
            variant="ghost" 
            size="sm" 
            className="w-full text-primary"
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
