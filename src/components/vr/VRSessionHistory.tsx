
import React from 'react';
import { VRSession } from '@/types/vr';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { formatDistance } from 'date-fns';

export interface VRSessionHistoryProps {
  sessions?: VRSession[];
  onSelect?: (session: VRSession) => void;
  emptyMessage?: string;
  limitDisplay?: number;
  showHeader?: boolean;
  className?: string;
  onSessionSelect?: (session: VRSession) => void;
}

const VRSessionHistory: React.FC<VRSessionHistoryProps> = ({
  sessions = [],
  onSelect,
  emptyMessage = "No session history available",
  limitDisplay,
  showHeader = true,
  className = "",
  onSessionSelect
}) => {
  const handleSelect = (session: VRSession) => {
    if (onSelect) {
      onSelect(session);
    } else if (onSessionSelect) {
      onSessionSelect(session);
    }
  };
  
  const displaySessions = limitDisplay ? sessions.slice(0, limitDisplay) : sessions;
  
  return (
    <Card className={className}>
      {showHeader && (
        <CardHeader>
          <CardTitle>Session History</CardTitle>
        </CardHeader>
      )}
      <CardContent>
        {displaySessions.length > 0 ? (
          <div className="space-y-4">
            {displaySessions.map(session => (
              <div 
                key={session.id}
                onClick={() => handleSelect(session)} 
                className="p-3 border rounded-md hover:bg-muted/50 cursor-pointer transition-colors"
              >
                <div className="flex justify-between">
                  <div className="font-medium">
                    Session #{session.id.substring(0, 6)}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {formatDistance(new Date(session.startTime), new Date(), { addSuffix: true })}
                  </div>
                </div>
                {session.endTime && (
                  <div className="text-xs text-muted-foreground mt-1">
                    Duration: {formatDistance(new Date(session.startTime), new Date(session.endTime))}
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-4 text-muted-foreground">
            {emptyMessage}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default VRSessionHistory;
