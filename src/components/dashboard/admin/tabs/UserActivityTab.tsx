// @ts-nocheck
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface UserActivityTabProps {
  userId: string;
}

const UserActivityTab: React.FC<UserActivityTabProps> = ({ userId }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Activité de l'utilisateur</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <p className="text-muted-foreground mb-4">
            Historique d'activité pour l'utilisateur {userId}
          </p>
          
          <div className="space-y-3">
            {[
              { action: 'Connexion', timestamp: '2023-12-15 14:30', details: 'Connexion depuis Chrome sur Windows' },
              { action: 'Scan émotionnel', timestamp: '2023-12-15 14:35', details: 'Score: 78% - Humeur positive' },
              { action: 'Session musicothérapie', timestamp: '2023-12-15 15:00', details: 'Durée: 15 minutes - Playlist détente' },
              { action: 'Entrée journal', timestamp: '2023-12-15 15:20', details: 'Nouvelle entrée: "Journée productive"' },
              { action: 'Déconnexion', timestamp: '2023-12-15 16:00', details: 'Session terminée normalement' }
            ].map((activity, index) => (
              <div key={index} className="flex items-start gap-3 p-3 border rounded-lg">
                <div className="w-2 h-2 bg-primary rounded-full mt-2"></div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-sm">{activity.action}</span>
                    <span className="text-xs text-muted-foreground">{activity.timestamp}</span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">{activity.details}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default UserActivityTab;
