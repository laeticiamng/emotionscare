
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { ChevronRight } from 'lucide-react';
import { LeaderboardEntry } from '@/types/gamification';
import { LeaderboardWidgetProps } from '@/types/widgets';
import { cn } from '@/lib/utils';

const LeaderboardWidget: React.FC<LeaderboardWidgetProps> = ({
  leaderboard,
  title = "Classement",
  showSeeAll = true,
  onSeeAll,
  highlightUserId,
}) => {
  // Display only the top 3 entries
  const topEntries = leaderboard.slice(0, 3);

  // Get initials for avatar fallback
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle>{title}</CardTitle>
          {showSeeAll && (
            <Button variant="ghost" size="sm" onClick={onSeeAll}>
              Voir tout
            </Button>
          )}
        </div>
        <CardDescription>Top des utilisateurs par points</CardDescription>
      </CardHeader>
      <CardContent className="grid gap-2">
        {topEntries.map((entry) => (
          <div
            key={entry.id}
            className={cn(
              "flex items-center justify-between py-2 px-1",
              entry.userId === highlightUserId && "bg-muted/50 rounded-md"
            )}
          >
            <div className="flex items-center gap-3">
              <div className="text-sm font-medium text-muted-foreground w-5 text-center">
                {entry.position || entry.rank || '#'}
              </div>
              <Avatar className="h-8 w-8">
                <AvatarImage src={entry.avatar} alt={entry.name} />
                <AvatarFallback>
                  {getInitials(entry.username || entry.name)}
                </AvatarFallback>
              </Avatar>
              <div>
                <div className="font-medium text-sm">{entry.username || entry.name}</div>
                <div className="text-xs text-muted-foreground">
                  {entry.points} pts {entry.level ? `· Niv. ${entry.level}` : ''}
                </div>
              </div>
            </div>
            <ChevronRight className="h-4 w-4 text-muted-foreground" />
          </div>
        ))}
      </CardContent>
    </Card>
  );
};

export default LeaderboardWidget;
