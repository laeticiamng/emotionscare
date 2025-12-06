import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export const PushNotificationManager: React.FC = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Gestionnaire de notifications push</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground">Configuration des notifications push à venir.</p>
      </CardContent>
    </Card>
  );
};

export default PushNotificationManager;
