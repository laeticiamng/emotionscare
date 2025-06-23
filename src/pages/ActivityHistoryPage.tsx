
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const ActivityHistoryPage: React.FC = () => {
  return (
    <div data-testid="page-root" className="min-h-screen bg-background p-6">
      <div className="container mx-auto">
        <h1 className="text-3xl font-bold mb-8">Historique Activité</h1>
        <Card>
          <CardHeader>
            <CardTitle>Votre parcours</CardTitle>
          </CardHeader>
          <CardContent>
            <p>Consultez l'historique de toutes vos activités sur la plateforme.</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ActivityHistoryPage;
