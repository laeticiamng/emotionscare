
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const B2BAdminDashboardPage: React.FC = () => {
  return (
    <div data-testid="page-root" className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Dashboard Administrateur</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Utilisateurs</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">324</p>
              <p className="text-muted-foreground">Actifs ce mois</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Bien-être Équipe</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">78%</p>
              <p className="text-muted-foreground">Score moyen</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Analyses</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">1,247</p>
              <p className="text-muted-foreground">Cette semaine</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Alertes</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">3</p>
              <p className="text-muted-foreground">À traiter</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default B2BAdminDashboardPage;
