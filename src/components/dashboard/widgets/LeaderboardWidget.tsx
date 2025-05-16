
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Trophy } from 'lucide-react';
import { LeaderboardEntry } from '@/types/gamification';

interface LeaderboardWidgetProps {
  entries: LeaderboardEntry[];
  title?: string;
  limit?: number;
}

const LeaderboardWidget: React.FC<LeaderboardWidgetProps> = ({
  entries,
  title = "Classement",
  limit = 5
}) => {
  // Take only the top N entries
  const topEntries = entries.slice(0, limit);
  
  return (
    <Card className="h-full">
      <CardHeader className="pb-2">
        <CardTitle className="text-xl flex items-center gap-2">
          <Trophy className="h-5 w-5 text-yellow-500" />
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="space-y-4">
          {topEntries.map((entry) => (
            <div 
              key={entry.id}
              className="flex items-center justify-between border-b border-border pb-2 last:border-0 last:pb-0"
            >
              <div className="flex items-center gap-3">
                <div className="flex items-center justify-center w-7 h-7 bg-muted rounded-full">
                  <span className="text-sm font-medium">
                    {entry.position}
                  </span>
                </div>
                <Avatar className="h-8 w-8">
                  <AvatarImage src={entry.avatar} />
                  <AvatarFallback>
                    {entry.name.substring(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="text-sm font-medium line-clamp-1">{entry.name}</p>
                  {entry.username && (
                    <p className="text-xs text-muted-foreground">@{entry.username}</p>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="secondary" className="font-mono">
                  {entry.points} pts
                </Badge>
                <span className="text-xs font-medium">Niv. {entry.level}</span>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default LeaderboardWidget;
