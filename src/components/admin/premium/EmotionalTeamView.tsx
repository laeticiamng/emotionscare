
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { EmotionalTeamViewProps } from '@/types/emotion';

const EmotionalTeamView: React.FC<EmotionalTeamViewProps> = ({ 
  teamId, 
  period = 'week',
  anonymized,
  dateRange,
  showGraph = true, 
  showMembers = true,
  className = ''
}) => {
  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>Team Emotional State</CardTitle>
      </CardHeader>
      <CardContent>
        <div>
          <p>Team ID: {teamId}</p>
          <p>Period: {period}</p>
          {dateRange && (
            <p>
              Date Range: {dateRange[0].toLocaleDateString()} - {dateRange[1].toLocaleDateString()}
            </p>
          )}
          {showGraph && <div>Graph visualization would appear here</div>}
          {showMembers && <div>Members list would appear here</div>}
        </div>
      </CardContent>
    </Card>
  );
};

export default EmotionalTeamView;
