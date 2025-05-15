
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TeamOverviewProps } from '@/types/emotion';

const TeamOverview: React.FC<TeamOverviewProps> = ({
  teamId,
  period = 'month',
  showNames = true,
  compact = false
}) => {
  return (
    <Card className={compact ? 'p-2' : ''}>
      <CardHeader className={compact ? 'p-2' : ''}>
        <CardTitle className={compact ? 'text-lg' : ''}>Team Emotional Overview</CardTitle>
      </CardHeader>
      <CardContent className={compact ? 'p-2' : ''}>
        <div className="text-center py-4 text-muted-foreground">
          {teamId ? (
            <p>Loading team overview for {teamId}, period: {period}...</p>
          ) : (
            <p>No team selected. Please select a team to view their emotional overview.</p>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default TeamOverview;
