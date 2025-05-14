
import React from 'react';
import { VRSession } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface VRSessionHistoryProps {
  sessions: VRSession[];
}

const VRSessionHistory: React.FC<VRSessionHistoryProps> = ({ sessions }) => {
  if (!sessions || sessions.length === 0) {
    return null;
  }
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Sessions récentes</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {sessions.map(session => (
            <div key={session.id} className="p-3 border rounded-md flex justify-between items-center">
              <div>
                <div className="font-medium">{session.template?.title || "Session VR"}</div>
                <div className="text-sm text-muted-foreground">
                  {session.date ? new Date(session.date).toLocaleDateString() : "Date inconnue"}
                </div>
              </div>
              <div className="text-sm">
                {session.duration ? `${session.duration} min` : ""}
                {session.completed ? " • Complétée" : ""}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default VRSessionHistory;
