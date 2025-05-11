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
        <p className="text-muted-foreground">
          Historique des sessions pour l'utilisateur {userId}
        </p>
        {/* Contenu des sessions à implémenter */}
      </CardContent>
    </Card>
  );
};

export default UserSessionsTab;
