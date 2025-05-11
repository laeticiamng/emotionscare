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
        <p className="text-muted-foreground">
          Historique d'activité pour l'utilisateur {userId}
        </p>
        {/* Contenu de l'activité à implémenter */}
      </CardContent>
    </Card>
  );
};

export default UserActivityTab;
