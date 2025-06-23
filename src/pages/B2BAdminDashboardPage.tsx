
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

const B2BAdminDashboardPage: React.FC = () => {
  return (
    <div data-testid="page-root" className="min-h-screen bg-background p-6">
      <div className="container mx-auto">
        <h1 className="text-3xl font-bold mb-8">Dashboard Administration</h1>
        
        <div className="grid md:grid-cols-4 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Analytics RH</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">Tableau de bord complet</p>
              <Button asChild>
                <Link to="/analytics">Voir les stats</Link>
              </Button>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Gestion Équipes</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">Administrer les équipes</p>
              <Button asChild>
                <Link to="/teams">Gérer</Link>
              </Button>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Rapports</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">Générer des rapports</p>
              <Button asChild>
                <Link to="/reports">Créer</Link>
              </Button>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Paramètres</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">Configuration système</p>
              <Button asChild>
                <Link to="/settings">Configurer</Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default B2BAdminDashboardPage;
