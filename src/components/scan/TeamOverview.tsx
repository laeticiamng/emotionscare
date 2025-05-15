
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TeamOverviewProps } from '@/types/emotion';

const TeamOverview: React.FC<TeamOverviewProps> = ({
  teamId,
  period = 'month',
  showNames = true,
  compact = false,
  users = []
}) => {
  return (
    <Card className={compact ? 'p-2' : ''}>
      <CardHeader className={compact ? 'p-2' : ''}>
        <CardTitle className={compact ? 'text-lg' : ''}>Team Emotional Overview</CardTitle>
      </CardHeader>
      <CardContent className={compact ? 'p-2' : ''}>
        {users && users.length > 0 ? (
          <div className="space-y-4">
            {users.map(user => (
              <div key={user.id} className="flex items-center justify-between p-2 border rounded">
                <div className="flex items-center">
                  <div className="w-8 h-8 bg-primary/20 rounded-full flex items-center justify-center mr-3">
                    {user.name.charAt(0)}
                  </div>
                  <span>{showNames ? user.name : user.anonymity_code}</span>
                </div>
                <div className="font-medium">
                  Score: {user.emotional_score || 'N/A'}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-4 text-muted-foreground">
            {teamId ? (
              <p>Loading team overview for {teamId}, period: {period}...</p>
            ) : (
              <p>No team selected. Please select a team to view their emotional overview.</p>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default TeamOverview;
