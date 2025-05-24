
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

const B2CDashboardPage: React.FC = () => {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Dashboard Particulier</h1>
      <Card>
        <CardHeader>
          <CardTitle>Bienvenue</CardTitle>
          <CardDescription>Votre tableau de bord personnel</CardDescription>
        </CardHeader>
        <CardContent>
          <p>Contenu du dashboard à implémenter</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default B2CDashboardPage;
