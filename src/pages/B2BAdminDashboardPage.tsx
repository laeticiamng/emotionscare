
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const B2BAdminDashboardPage: React.FC = () => {
  return (
    <div data-testid="page-root" className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Dashboard Administration</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card data-testid="admin-panel">
          <CardHeader>
            <CardTitle>Gestion des Équipes</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              Gérez les équipes et leurs membres
            </p>
          </CardContent>
        </Card>
        
        <Card data-testid="team-management">
          <CardHeader>
            <CardTitle>Rapports</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              Consultez les rapports de bien-être
            </p>
          </CardContent>
        </Card>
        
        <Card data-testid="reports-section">
          <CardHeader>
            <CardTitle>Événements</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              Organisez des événements de bien-être
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default B2BAdminDashboardPage;
