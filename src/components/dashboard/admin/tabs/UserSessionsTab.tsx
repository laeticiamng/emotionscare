// @ts-nocheck
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface UserSessionsTabProps {
  userId: string;
}

const UserSessionsTab: React.FC<UserSessionsTabProps> = ({ userId }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Sessions</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <p className="text-muted-foreground mb-4">
            Historique des sessions pour l'utilisateur {userId}
          </p>
          
          <div className="grid gap-4">
            {[
              { 
                id: 'S001', 
                type: 'Méditation guidée', 
                duration: '20 min', 
                date: '2023-12-15', 
                status: 'Terminée',
                score: 85 
              },
              { 
                id: 'S002', 
                type: 'Musicothérapie', 
                duration: '15 min', 
                date: '2023-12-14', 
                status: 'Terminée',
                score: 78 
              },
              { 
                id: 'S003', 
                type: 'Relaxation VR', 
                duration: '25 min', 
                date: '2023-12-13', 
                status: 'Interrompue',
                score: 65 
              },
              { 
                id: 'S004', 
                type: 'Chat avec Coach IA', 
                duration: '12 min', 
                date: '2023-12-12', 
                status: 'Terminée',
                score: 92 
              }
            ].map((session) => (
              <div key={session.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex-1">
                  <div className="flex items-center gap-3">
                    <span className="font-medium">{session.type}</span>
                    <span className={`text-xs px-2 py-1 rounded ${
                      session.status === 'Terminée' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {session.status}
                    </span>
                  </div>
                  <div className="flex items-center gap-4 mt-1 text-sm text-muted-foreground">
                    <span>ID: {session.id}</span>
                    <span>Durée: {session.duration}</span>
                    <span>Date: {session.date}</span>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-lg font-bold text-primary">{session.score}%</div>
                  <div className="text-xs text-muted-foreground">Score</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default UserSessionsTab;
