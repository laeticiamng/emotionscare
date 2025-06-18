
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const EventsPage: React.FC = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <Card>
        <CardHeader>
          <CardTitle>Événements</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Page Events - Contenu à venir
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default EventsPage;
