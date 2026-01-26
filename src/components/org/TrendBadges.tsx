// @ts-nocheck
import React from 'react';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { TeamRow, Trend } from '@/hooks/useOrgWeekly';
import { Badge } from '@/components/ui/badge';

interface TrendBadgesProps {
  teams: TeamRow[];
}

const trendIcon = (trend: Trend) => {
  switch (trend) {
    case 'up': return <TrendingUp className="h-3 w-3" />;
    case 'down': return <TrendingDown className="h-3 w-3" />;
    case 'flat': return <Minus className="h-3 w-3" />;
  }
};

const trendLabel = (trend: Trend) => {
  switch (trend) {
    case 'up': return 'En hausse';
    case 'down': return 'En baisse'; 
    case 'flat': return 'Stable';
  }
};

const trendVariant = (trend: Trend) => {
  switch (trend) {
    case 'up': return 'default';
    case 'down': return 'destructive';
    case 'flat': return 'secondary';
  }
};

export const TrendBadges: React.FC<TrendBadgesProps> = ({ teams }) => {
  const trends = teams
    .filter(team => team.trend)
    .reduce((acc, team) => {
      const trend = team.trend!;
      if (!acc[trend]) acc[trend] = [];
      acc[trend].push(team);
      return acc;
    }, {} as Record<Trend, TeamRow[]>);

  if (Object.keys(trends).length === 0) {
    return null;
  }

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Tendances d'équipe</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {(['up', 'flat', 'down'] as Trend[]).map(trend => {
          const teamsWithTrend = trends[trend] || [];
          
          return (
            <div key={trend} className="space-y-2">
              <div className="flex items-center gap-2">
                <Badge variant={trendVariant(trend)} className="flex items-center gap-1">
                  {trendIcon(trend)}
                  {trendLabel(trend)}
                </Badge>
                <span className="text-sm text-muted-foreground">
                  ({teamsWithTrend.length})
                </span>
              </div>
              
              {teamsWithTrend.length > 0 && (
                <div className="space-y-1">
                  {teamsWithTrend.slice(0, 5).map(team => (
                    <div key={team.team_id} className="text-sm p-2 bg-muted rounded">
                      {team.team_name}
                    </div>
                  ))}
                  {teamsWithTrend.length > 5 && (
                    <div className="text-xs text-muted-foreground p-2">
                      +{teamsWithTrend.length - 5} autres équipes
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};