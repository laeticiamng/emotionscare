
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { VRSession } from '@/types';
import { formatDistanceToNow } from 'date-fns';

interface VRSessionStatsProps {
  session?: VRSession;
  className?: string;
}

const VRSessionStats: React.FC<VRSessionStatsProps> = ({ 
  session,
  className = ""
}) => {
  if (!session) {
    return null;
  }
  
  const formatDuration = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}m ${remainingSeconds}s`;
  };
  
  const getStartDate = () => {
    if (session.startTime) {
      return new Date(session.startTime);
    } else if (session.startedAt) {
      return new Date(session.startedAt);
    } else if (session.date) {
      return new Date(session.date);
    }
    return null;
  };
  
  const startDate = getStartDate();
  
  return (
    <Card className={className}>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg">Session Statistics</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1">
            <p className="text-sm text-muted-foreground">Start time</p>
            <p className="font-medium">
              {startDate ? formatDistanceToNow(startDate, { addSuffix: true }) : 'Unknown'}
            </p>
          </div>
          
          <div className="space-y-1">
            <p className="text-sm text-muted-foreground">Duration</p>
            <p className="font-medium">
              {session.duration
                ? formatDuration(session.duration)
                : session.duration_seconds
                ? formatDuration(session.duration_seconds)
                : 'Unknown'
              }
            </p>
          </div>
          
          {(session.heartRateBefore || session.heart_rate_before) && (
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Heart rate (before)</p>
              <p className="font-medium">{session.heartRateBefore || session.heart_rate_before} BPM</p>
            </div>
          )}
          
          {(session.heartRateAfter || session.heart_rate_after) && (
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Heart rate (after)</p>
              <p className="font-medium">{session.heartRateAfter || session.heart_rate_after} BPM</p>
            </div>
          )}
        </div>
        
        <div className="pt-2">
          <p className="text-sm text-muted-foreground">Status</p>
          <div className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
            session.completedAt || session.completed || session.isCompleted
              ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100' 
              : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100'
          }`}>
            {session.completedAt || session.completed || session.isCompleted ? 'Completed' : 'In Progress'}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default VRSessionStats;
