
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const NotificationDemoPage: React.FC = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <Card>
        <CardHeader>
          <CardTitle>Démonstration des Notifications</CardTitle>
        </CardHeader>
        <CardContent>
          <p>Page de démonstration du système de notifications - À implémenter</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default NotificationDemoPage;
