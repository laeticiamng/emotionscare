
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

const B2BAdminDashboardPage: React.FC = () => {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Dashboard Administrateur</h1>
      <Card>
        <CardHeader>
          <CardTitle>Administration B2B</CardTitle>
          <CardDescription>Gestion de l'organisation</CardDescription>
        </CardHeader>
        <CardContent>
          <p>Interface d'administration à implémenter</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default B2BAdminDashboardPage;
