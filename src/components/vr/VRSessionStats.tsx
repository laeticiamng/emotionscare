
import React from 'react';
import { VRSession } from '@/types';

interface VRSessionStatsProps {
  session: VRSession;
}

const VRSessionStats: React.FC<VRSessionStatsProps> = ({ session }) => {
  // Format date for display
  const formatDate = (dateString?: string | Date): string => {
    if (!dateString) return 'N/A';
    const date = typeof dateString === 'string' ? new Date(dateString) : dateString;
    return date.toLocaleDateString(undefined, { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Calculate session duration in minutes
  const getDurationInMinutes = (): number => {
    if (session.duration) {
      return Math.round(session.duration / 60);
    }
    if (session.duration_seconds) {
      return Math.round(session.duration_seconds / 60);
    }
    
    if (session.start_time && session.end_time) {
      const start = new Date(session.start_time);
      const end = new Date(session.end_time);
      return Math.round((end.getTime() - start.getTime()) / (60 * 1000));
    }
    
    if (session.startTime && session.end_time) {
      const start = new Date(session.startTime);
      const end = new Date(session.end_time);
      return Math.round((end.getTime() - start.getTime()) / (60 * 1000));
    }
    
    return 0;
  };

  // Get heart rate difference if available
  const getHeartRateDifference = (): number | null => {
    const before = session.heart_rate_before || session.heartRateBefore;
    const after = session.heart_rate_after || session.heartRateAfter;
    
    if (before && after) {
      return after - before;
    }
    return null;
  };

  // Check if session was completed
  const isSessionCompleted = (): boolean => {
    return session.completed || session.isCompleted || false;
  };

  // Get formatted date when session was completed
  const getCompletedDate = (): string => {
    // Check for completed timestamp
    if (session.end_time) {
      return formatDate(session.end_time);
    }
    
    if (session.endTime) {
      return formatDate(session.endTime);
    }
    
    // Fallback to start time
    return session.start_time ? formatDate(session.start_time) : 'Not completed';
  };

  const heartRateDiff = getHeartRateDifference();
  const durationMinutes = getDurationInMinutes();
  
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Session Statistics</h3>
      
      <div className="grid grid-cols-2 gap-4">
        <div className="p-4 bg-muted/20 rounded-md">
          <div className="text-sm text-muted-foreground">Session Date</div>
          <div className="font-medium">{formatDate(session.start_time || session.startTime)}</div>
        </div>
        
        <div className="p-4 bg-muted/20 rounded-md">
          <div className="text-sm text-muted-foreground">Duration</div>
          <div className="font-medium">{durationMinutes} minutes</div>
        </div>
        
        <div className="p-4 bg-muted/20 rounded-md">
          <div className="text-sm text-muted-foreground">Status</div>
          <div className="font-medium">
            {isSessionCompleted() ? 
              <span className="text-green-500">Completed</span> : 
              <span className="text-amber-500">Not completed</span>
            }
          </div>
        </div>
        
        <div className="p-4 bg-muted/20 rounded-md">
          <div className="text-sm text-muted-foreground">Completion Date</div>
          <div className="font-medium">{getCompletedDate()}</div>
        </div>
        
        {heartRateDiff !== null && (
          <>
            <div className="p-4 bg-muted/20 rounded-md">
              <div className="text-sm text-muted-foreground">Heart Rate Change</div>
              <div className="font-medium">
                {heartRateDiff > 0 ? '+' : ''}{heartRateDiff} BPM
                <span className="text-xs ml-2 text-muted-foreground">
                  ({session.heart_rate_before || session.heartRateBefore} → {session.heart_rate_after || session.heartRateAfter})
                </span>
              </div>
            </div>
          </>
        )}
        
        {session.rating && (
          <div className="p-4 bg-muted/20 rounded-md">
            <div className="text-sm text-muted-foreground">User Rating</div>
            <div className="font-medium">{session.rating}/5</div>
          </div>
        )}
      </div>
      
      {session.notes && (
        <div className="p-4 bg-muted/20 rounded-md">
          <div className="text-sm text-muted-foreground mb-1">User Notes</div>
          <div className="italic">{session.notes}</div>
        </div>
      )}
    </div>
  );
};

export default VRSessionStats;
