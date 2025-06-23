
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { BarChart3, Users, Settings, FileText } from 'lucide-react';

const B2BDashboardPage: React.FC = () => {
  return (
    <div data-testid="page-root" className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Dashboard B2B</h1>
        <p className="text-muted-foreground">
          Tableau de bord pour les entreprises - Gestion des équipes et analytics
        </p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5 text-blue-500" />
              Gestion des équipes
            </CardTitle>
            <CardDescription>
              Gérez vos collaborateurs et leurs accès
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button className="w-full">Accéder aux équipes</Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-green-500" />
              Analytics
            </CardTitle>
            <CardDescription>
              Tableaux de bord et rapports détaillés
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button className="w-full">Voir les analytics</Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5 text-orange-500" />
              Configuration
            </CardTitle>
            <CardDescription>
              Paramètres de l'organisation
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button className="w-full">Configurer</Button>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Activité récente
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
              <div>
                <p className="font-medium">Nouveau scan émotionnel</p>
                <p className="text-sm text-muted-foreground">Équipe Marketing - il y a 2 heures</p>
              </div>
              <Button variant="outline" size="sm">Voir</Button>
            </div>
            <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
              <div>
                <p className="font-medium">Rapport hebdomadaire généré</p>
                <p className="text-sm text-muted-foreground">Toutes équipes - il y a 1 jour</p>
              </div>
              <Button variant="outline" size="sm">Télécharger</Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default B2BDashboardPage;
