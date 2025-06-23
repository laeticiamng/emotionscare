
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const NotificationsPage: React.FC = () => {
  return (
    <div data-testid="page-root" className="min-h-screen bg-background p-6">
      <div className="container mx-auto">
        <h1 className="text-3xl font-bold mb-8">Notifications & Rappels</h1>
        <Card>
          <CardHeader>
            <CardTitle>Centre de notifications</CardTitle>
          </CardHeader>
          <CardContent>
            <p>Gérez vos notifications et rappels personnalisés.</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default NotificationsPage;
