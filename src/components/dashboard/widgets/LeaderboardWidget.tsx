
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { LeaderboardEntry } from '@/types';
import { Trophy, TrendingDown, TrendingUp, Minus } from 'lucide-react';

interface LeaderboardWidgetProps {
  data: LeaderboardEntry[];
  title?: string;
  className?: string;
  compact?: boolean;
}

const LeaderboardWidget: React.FC<LeaderboardWidgetProps> = ({
  data = [],
  title = "Classement",
  className,
  compact = false
}) => {
  // Helper function to generate avatar fallback
  const getAvatarFallback = (name: string) => {
    return name?.charAt(0).toUpperCase() || 'U';
  };

  // Helper function to render the trend indicator
  const renderTrendIndicator = (change?: number) => {
    if (!change) return <Minus className="h-3 w-3 text-gray-400" />;
    
    if (change > 0) {
      return <TrendingUp className="h-3 w-3 text-green-500" />;
    } else if (change < 0) {
      return <TrendingDown className="h-3 w-3 text-red-500" />;
    } else {
      return <Minus className="h-3 w-3 text-gray-400" />;
    }
  };

  return (
    <Card className={cn("h-full flex flex-col", className)}>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg flex items-center">
          <Trophy className="mr-2 h-5 w-5 text-amber-500" />
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent className="flex-1 overflow-auto">
        {data.length === 0 ? (
          <div className="h-full flex items-center justify-center text-center text-muted-foreground p-4">
            <p>Aucune données de classement disponible</p>
          </div>
        ) : (
          <div className="space-y-2">
            {data.map((entry) => (
              <div
                key={entry.id}
                className={cn(
                  "flex items-center p-2 rounded-md",
                  entry.isCurrentUser ? "bg-primary/10" : "hover:bg-accent"
                )}
              >
                <div className="w-7 flex justify-center font-medium">
                  {entry.position || '–'}
                </div>
                
                <Avatar className="h-8 w-8 mr-3">
                  <AvatarImage src={entry.avatar} />
                  <AvatarFallback>{getAvatarFallback(entry.name)}</AvatarFallback>
                </Avatar>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center">
                    <p className="font-medium text-sm truncate">
                      {entry.name || entry.username || "Utilisateur"}
                    </p>
                    {entry.isCurrentUser && (
                      <Badge variant="outline" className="ml-2 text-[10px] h-4">Vous</Badge>
                    )}
                  </div>
                  {!compact && (
                    <p className="text-xs text-muted-foreground">Niveau {entry.level || 1}</p>
                  )}
                </div>
                
                <div className="flex items-center gap-2">
                  <div className="flex flex-col items-end">
                    <span className="font-medium text-sm">{entry.points} pts</span>
                    {!compact && entry.change !== undefined && (
                      <div className="flex items-center text-xs">
                        {renderTrendIndicator(entry.change)}
                        <span className={cn(
                          "ml-0.5",
                          entry.change > 0 ? "text-green-600" : 
                          entry.change < 0 ? "text-red-600" : "text-muted-foreground"
                        )}>
                          {Math.abs(entry.change)}
                        </span>
                      </div>
                    )}
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
