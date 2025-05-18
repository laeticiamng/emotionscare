
import React from 'react';
import { ArrowUp, ArrowDown, Minus } from 'lucide-react';
import { TeamSummary } from '@/types/dashboard';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';

const teams: TeamSummary[] = [
  {
    teamId: 'marketing',
    memberCount: 12,
    averageMood: '72%',
    alertCount: 0,
    trendDirection: 'up'
  },
  {
    teamId: 'tech',
    memberCount: 24,
    averageMood: '68%',
    alertCount: 1,
    trendDirection: 'stable'
  },
  {
    teamId: 'design',
    memberCount: 8,
    averageMood: '85%',
    alertCount: 0,
    trendDirection: 'up'
  },
  {
    teamId: 'operations',
    memberCount: 16,
    averageMood: '62%',
    alertCount: 2,
    trendDirection: 'down'
  },
];

const TeamsSummaryTable: React.FC = () => {
  const renderTrend = (trend: 'up' | 'down' | 'stable') => {
    switch (trend) {
      case 'up':
        return (
          <div className="flex items-center text-emerald-600">
            <ArrowUp className="h-3 w-3 mr-1" />
            <span className="text-xs">↑</span>
          </div>
        );
      case 'down':
        return (
          <div className="flex items-center text-rose-600">
            <ArrowDown className="h-3 w-3 mr-1" />
            <span className="text-xs">↓</span>
          </div>
        );
      default:
        return (
          <div className="flex items-center text-gray-500">
            <Minus className="h-3 w-3 mr-1" />
            <span className="text-xs">=</span>
          </div>
        );
    }
  };
  
  return (
    <div className="space-y-4">
      {teams.map((team) => (
        <div 
          key={team.teamId}
          className="flex items-center justify-between p-2 hover:bg-muted/50 rounded-md transition-colors"
        >
          <div>
            <p className="font-medium capitalize">
              {team.teamId}
            </p>
            <p className="text-xs text-muted-foreground">
              {team.memberCount} membres
            </p>
          </div>
          <div className="flex items-center space-x-4">
            <div className="text-right">
              <div className="flex items-center space-x-1">
                <span className={cn(
                  "font-medium",
                  team.trendDirection === 'up' ? 'text-emerald-600' : 
                  team.trendDirection === 'down' ? 'text-rose-600' : ''
                )}>
                  {team.averageMood}
                </span>
                {renderTrend(team.trendDirection)}
              </div>
              <p className="text-xs text-muted-foreground">
                Bien-être moyen
              </p>
            </div>
            {team.alertCount > 0 && (
              <Badge variant="destructive" className="ml-2">
                {team.alertCount} alerte{team.alertCount > 1 ? 's' : ''}
              </Badge>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default TeamsSummaryTable;
