
import React from 'react';
import { Button } from '@/components/ui/button';
import { ChevronRight } from 'lucide-react';
import { LeaderboardEntry } from '@/types/gamification';
import { LeaderboardWidgetProps } from '@/types/widgets';

const LeaderboardWidget: React.FC<LeaderboardWidgetProps> = ({
  leaderboard,
  title = "Classement",
  showSeeAll = false,
  onSeeAll,
  highlightUserId
}) => {
  if (!leaderboard || leaderboard.length === 0) {
    return (
      <div className="text-center py-6 text-muted-foreground">
        Aucune donnée de classement disponible
      </div>
    );
  }
  
  return (
    <div className="space-y-4">
      {leaderboard.slice(0, 3).map((entry) => (
        <div 
          key={entry.id} 
          className={`flex items-center p-2 rounded-lg ${
            entry.id === highlightUserId ? 'bg-primary/10' : 'hover:bg-muted/50'
          }`}
        >
          <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center mr-3 flex-shrink-0">
            {entry.position}
          </div>
          <div className="min-w-0 flex-1">
            <p className="font-medium truncate">
              {entry.username || entry.name}
            </p>
            <p className="text-sm text-muted-foreground">Niveau {entry.level} • {entry.points} pts</p>
          </div>
        </div>
      ))}
      
      {showSeeAll && (
        <Button 
          variant="ghost" 
          className="w-full justify-between" 
          onClick={onSeeAll}
        >
          Voir tout le classement
          <ChevronRight className="h-4 w-4" />
        </Button>
      )}
    </div>
  );
};

export default LeaderboardWidget;
