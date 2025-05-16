
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { VRSession, VRSessionHistoryProps } from '@/types';

const VRSessionHistory: React.FC<VRSessionHistoryProps> = ({
  sessions = [],
  userId,
  limit = 5,
  showHeader = true,
  className = ''
}) => {
  // Format date in a readable format
  const formatDate = (date: string | Date): string => {
    if (!date) return 'N/A';
    const dateObj = new Date(date);
    return dateObj.toLocaleDateString(undefined, {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  // Slice sessions to the limit
  const recentSessions = sessions.slice(0, limit);

  return (
    <div className={`space-y-4 ${className}`}>
      {showHeader && <h3 className="text-lg font-medium">Recent Sessions</h3>}
      
      {recentSessions.length === 0 ? (
        <p className="text-sm text-muted-foreground">No session history available.</p>
      ) : (
        <div className="space-y-3">
          {recentSessions.map((session) => (
            <Card key={session.id} className="bg-muted/10">
              <CardContent className="p-4">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="font-medium">
                      {session.templateId || 'Session'}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {formatDate(
                        session.startedAt || 
                        (session.start_time ?? session.startTime) || 
                        session.date || 
                        new Date()
                      )}
                    </p>
                  </div>
                  <div className="text-right">
                    <span className={`px-2 py-1 rounded text-xs ${
                      session.completed ? 
                        'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100' : 
                        'bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-100'
                    }`}>
                      {session.completed ? 'Completed' : 'In progress'}
                    </span>
                    {session.rating !== undefined && (
                      <p className="text-xs text-muted-foreground mt-1">
                        Rating: {session.rating}/5
                      </p>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default VRSessionHistory;
