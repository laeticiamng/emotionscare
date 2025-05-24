
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

const B2BUserDashboardPage: React.FC = () => {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Dashboard Utilisateur B2B</h1>
      <Card>
        <CardHeader>
          <CardTitle>Tableau de bord collaborateur</CardTitle>
          <CardDescription>Vos outils et statistiques</CardDescription>
        </CardHeader>
        <CardContent>
          <p>Contenu du dashboard B2B utilisateur à implémenter</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default B2BUserDashboardPage;
