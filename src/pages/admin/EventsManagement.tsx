
import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

const EventsManagementPage = () => {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Gestion des événements</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Interface de gestion des événements et activités.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default EventsManagementPage;
