
import React from 'react';
import { VRSession } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { format } from 'date-fns';

interface VRSessionStatsProps {
  session: VRSession;
}

const VRSessionStats: React.FC<VRSessionStatsProps> = ({ session }) => {
  // Format timestamps to display nicely
  const formatDate = (dateValue: string | Date | undefined) => {
    if (!dateValue) return 'N/A';
    try {
      const date = typeof dateValue === 'string' ? new Date(dateValue) : dateValue;
      return format(date, 'yyyy-MM-dd HH:mm');
    } catch (e) {
      return 'Invalid date';
    }
  };
  
  // Display duration in minutes and seconds
  const formatDuration = (seconds?: number) => {
    if (!seconds) return 'N/A';
    const mins = Math.floor(seconds / 60);
    const secs = Math.round(seconds % 60);
    return `${mins}m ${secs}s`;
  };
  
  // Use date or startedAt or startTime for session date
  const sessionDate = 
    session.date || 
    session.startedAt || 
    session.startTime || 
    null;
  
  // Use duration or duration_seconds for session length
  const sessionDuration = 
    session.duration || 
    session.duration_seconds || 
    0;
  
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl">Session Information</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <p className="text-sm text-muted-foreground mb-1">Date</p>
          <p className="font-medium">{formatDate(sessionDate)}</p>
        </div>
        
        <div>
          <p className="text-sm text-muted-foreground mb-1">Duration</p>
          <p className="font-medium">{formatDuration(sessionDuration)}</p>
        </div>
        
        <div>
          <p className="text-sm text-muted-foreground mb-1">Type</p>
          <p className="font-medium">
            {session.is_audio_only ? 'Audio Only' : 'Immersive Experience'}
          </p>
        </div>
        
        <div>
          <p className="text-sm text-muted-foreground mb-1">Completed</p>
          <p className="font-medium">
            {session.isCompleted || session.completed ? 'Yes' : 'No'}
          </p>
        </div>
        
        {(session.heart_rate_before || session.heart_rate_after) && (
          <div>
            <p className="text-sm text-muted-foreground mb-1">Heart Rate Change</p>
            <div className="flex gap-4">
              {session.heart_rate_before !== undefined && (
                <div>
                  <span className="text-sm text-muted-foreground">Before:</span>{' '}
                  <span className="font-medium">{session.heart_rate_before} bpm</span>
                </div>
              )}
              {session.heart_rate_after !== undefined && (
                <div>
                  <span className="text-sm text-muted-foreground">After:</span>{' '}
                  <span className="font-medium">{session.heart_rate_after} bpm</span>
                </div>
              )}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default VRSessionStats;
