
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { LeaderboardEntry } from '@/types/gamification';
import { ChevronRight, TrendingDown, TrendingUp, Minus } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

interface LeaderboardWidgetProps {
  entries: LeaderboardEntry[];
  title?: string;
  showSeeAll?: boolean;
  onSeeAll?: () => void;
}

const LeaderboardWidget: React.FC<LeaderboardWidgetProps> = ({ 
  entries, 
  title = 'Classement', 
  showSeeAll = false, 
  onSeeAll 
}) => {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-lg font-medium">{title}</CardTitle>
        {showSeeAll && onSeeAll && (
          <Button variant="ghost" size="sm" onClick={onSeeAll} className="h-8 px-2">
            Tout voir <ChevronRight className="h-4 w-4 ml-1" />
          </Button>
        )}
      </CardHeader>
      <CardContent>
        {entries.length === 0 ? (
          <div className="text-center py-6 text-muted-foreground">
            Aucun classement disponible
          </div>
        ) : (
          <div className="space-y-3">
            {entries.map((entry) => (
              <div 
                key={entry.id} 
                className={`flex items-center p-2 rounded-lg ${
                  entry.isCurrentUser ? 'bg-muted/40' : ''
                }`}
              >
                <div className="w-8 text-center font-bold">
                  {entry.rank}.
                </div>
                
                <Avatar className="h-8 w-8 mr-3">
                  {entry.avatar ? (
                    <AvatarImage src={entry.avatar} alt={entry.name} />
                  ) : null}
                  <AvatarFallback>{entry.name.substring(0, 2).toUpperCase()}</AvatarFallback>
                </Avatar>
                
                <div className="flex-1 min-w-0">
                  <p className={`font-medium truncate ${entry.isCurrentUser ? 'text-primary' : ''}`}>
                    {entry.name}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Niveau {entry.level}
                  </p>
                </div>
                
                <div className="text-right">
                  <p className="font-medium">{entry.points} pts</p>
                  <div className="flex items-center justify-end text-xs">
                    {entry.trend === 'up' ? (
                      <TrendingUp className="h-3 w-3 text-green-500 mr-1" />
                    ) : entry.trend === 'down' ? (
                      <TrendingDown className="h-3 w-3 text-red-500 mr-1" />
                    ) : (
                      <Minus className="h-3 w-3 mr-1" />
                    )}
                    <span className={
                      entry.trend === 'up' ? 'text-green-500' : 
                      entry.trend === 'down' ? 'text-red-500' : ''
                    }>
                      {entry.trend === 'up' ? '+' : entry.trend === 'down' ? '-' : ''}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default LeaderboardWidget;
