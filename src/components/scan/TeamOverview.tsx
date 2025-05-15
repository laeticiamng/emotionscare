
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TeamOverviewProps } from '@/types';

const TeamOverview: React.FC<TeamOverviewProps> = ({
  teamId,
  period = 'week',
  showFilters = true
}) => {
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Team Emotional Overview</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground">
          Team emotional data will be displayed here. Currently in development.
        </p>
      </CardContent>
    </Card>
  );
};

export default TeamOverview;
