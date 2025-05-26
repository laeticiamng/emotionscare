
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';

const B2BAdminDashboard: React.FC = () => {
  const { user, signOut } = useAuth();

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto">
        <header className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Tableau de bord RH</h1>
          <Button onClick={signOut} variant="outline">
            Déconnexion
          </Button>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Vue d'ensemble</CardTitle>
            </CardHeader>
            <CardContent>
              <p>Suivi du bien-être de vos équipes</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Analyses émotionnelles</CardTitle>
            </CardHeader>
            <CardContent>
              <p>Tendances du bien-être organisationnel</p>
              <Button className="mt-4">Voir les rapports</Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Gestion des équipes</CardTitle>
            </CardHeader>
            <CardContent>
              <p>Administrez les accès et permissions</p>
              <Button className="mt-4">Gérer</Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default B2BAdminDashboard;
