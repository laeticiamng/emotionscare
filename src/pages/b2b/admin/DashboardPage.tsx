
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, TrendingUp, Activity, AlertTriangle } from 'lucide-react';

const B2BAdminDashboardPage: React.FC = () => {
  return (
    <div className="container mx-auto p-4 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Tableau de Bord RH</h1>
        <p className="text-muted-foreground">Vue d'ensemble du bien-être organisationnel</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Collaborateurs Actifs</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">247</div>
            <p className="text-xs text-muted-foreground">+12% ce mois</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Bien-être Moyen</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">7.2/10</div>
            <p className="text-xs text-muted-foreground">+0.3 points</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Sessions Aujourd'hui</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">89</div>
            <p className="text-xs text-muted-foreground">Scans + Coach</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Alertes</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">3</div>
            <p className="text-xs text-muted-foreground">Équipes à risque</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Tendances Émotionnelles</CardTitle>
            <CardDescription>Évolution du bien-être sur 30 jours</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] flex items-center justify-center bg-muted rounded-lg">
              <p className="text-muted-foreground">Graphique des tendances</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Équipes à Surveiller</CardTitle>
            <CardDescription>Départements nécessitant une attention particulière</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
                <div>
                  <p className="font-medium">Équipe Marketing</p>
                  <p className="text-sm text-muted-foreground">Niveau de stress élevé</p>
                </div>
                <div className="text-red-600 font-bold">5.2/10</div>
              </div>
              <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
                <div>
                  <p className="font-medium">Développement</p>
                  <p className="text-sm text-muted-foreground">Fatigue détectée</p>
                </div>
                <div className="text-yellow-600 font-bold">6.1/10</div>
              </div>
              <div className="flex items-center justify-between p-3 bg-orange-50 rounded-lg">
                <div>
                  <p className="font-medium">Ventes</p>
                  <p className="text-sm text-muted-foreground">Pression commerciale</p>
                </div>
                <div className="text-orange-600 font-bold">6.5/10</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Actions Recommandées</CardTitle>
          <CardDescription>Suggestions basées sur l'analyse des données</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 border rounded-lg">
              <h4 className="font-medium mb-2">Session de Méditation Collective</h4>
              <p className="text-sm text-muted-foreground mb-3">
                Organiser une session pour l'équipe Marketing
              </p>
              <button className="text-primary text-sm font-medium">Planifier →</button>
            </div>
            <div className="p-4 border rounded-lg">
              <h4 className="font-medium mb-2">Formation Gestion du Stress</h4>
              <p className="text-sm text-muted-foreground mb-3">
                Module adapté aux équipes techniques
              </p>
              <button className="text-primary text-sm font-medium">Déployer →</button>
            </div>
            <div className="p-4 border rounded-lg">
              <h4 className="font-medium mb-2">Campagne de Sensibilisation</h4>
              <p className="text-sm text-muted-foreground mb-3">
                Promouvoir les outils de bien-être
              </p>
              <button className="text-primary text-sm font-medium">Lancer →</button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default B2BAdminDashboardPage;
