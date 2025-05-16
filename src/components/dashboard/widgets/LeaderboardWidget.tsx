
import React from 'react';
import { LeaderboardEntry } from '@/types/gamification';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

interface LeaderboardWidgetProps {
  leaderboard: LeaderboardEntry[];
}

const LeaderboardWidget: React.FC<LeaderboardWidgetProps> = ({ leaderboard }) => {
  return (
    <div className="space-y-3">
      {leaderboard.length === 0 ? (
        <p className="text-muted-foreground text-sm">Aucune donnée de classement disponible.</p>
      ) : (
        <div>
          {leaderboard.map((entry) => (
            <div 
              key={entry.id} 
              className="flex items-center justify-between py-2 border-b last:border-0 border-border/50"
            >
              <div className="flex items-center gap-3">
                <div className="w-6 h-6 flex items-center justify-center rounded-full bg-primary/10 text-primary font-medium text-xs">
                  {entry.position}
                </div>
                <Avatar className="h-6 w-6">
                  <AvatarImage src={entry.avatar} alt={entry.name} />
                  <AvatarFallback>{entry.name.substring(0, 2).toUpperCase()}</AvatarFallback>
                </Avatar>
                <span className="text-sm font-medium">{entry.name}</span>
              </div>
              <div className="flex items-center">
                <span className="text-sm font-medium">{entry.points}</span>
                <span className="text-xs text-muted-foreground ml-1">pts</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default LeaderboardWidget;
