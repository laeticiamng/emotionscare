
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, TrendingUp, Shield, BarChart3 } from 'lucide-react';

const B2BAdminDashboard = () => {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900" data-testid="page-root">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Tableau de bord administrateur
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            Gérez le bien-être de votre organisation
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Utilisateurs actifs
              </CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">245</div>
              <p className="text-xs text-muted-foreground">
                +12% vs mois dernier
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Bien-être global
              </CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">7.8/10</div>
              <p className="text-xs text-muted-foreground">
                +0.3 vs mois dernier
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Alertes RH
              </CardTitle>
              <Shield className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">3</div>
              <p className="text-xs text-muted-foreground">
                Niveau d'attention requis
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Taux d'engagement
              </CardTitle>
              <BarChart3 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">87%</div>
              <p className="text-xs text-muted-foreground">
                +5% vs mois dernier
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Équipes à surveiller</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <h3 className="font-semibold">Équipe Marketing</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      Stress élevé détecté
                    </p>
                  </div>
                  <div className="text-right">
                    <div className="text-orange-600 font-semibold">6.2/10</div>
                    <div className="text-xs text-gray-500">Bien-être</div>
                  </div>
                </div>
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <h3 className="font-semibold">Équipe Développement</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      Performance stable
                    </p>
                  </div>
                  <div className="text-right">
                    <div className="text-green-600 font-semibold">8.1/10</div>
                    <div className="text-xs text-gray-500">Bien-être</div>
                  </div>
                </div>
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <h3 className="font-semibold">Équipe Ventes</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      Motivation en hausse
                    </p>
                  </div>
                  <div className="text-right">
                    <div className="text-blue-600 font-semibold">7.5/10</div>
                    <div className="text-xs text-gray-500">Bien-être</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Actions recommandées</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="p-4 bg-red-50 dark:bg-red-900/20 rounded-lg">
                  <h3 className="font-semibold text-red-900 dark:text-red-100 mb-2">
                    Intervention urgente
                  </h3>
                  <p className="text-sm text-red-700 dark:text-red-200">
                    Organiser une session de débriefing avec l'équipe Marketing
                  </p>
                </div>
                <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
                  <h3 className="font-semibold text-yellow-900 dark:text-yellow-100 mb-2">
                    Prévention
                  </h3>
                  <p className="text-sm text-yellow-700 dark:text-yellow-200">
                    Proposer des sessions de méditation collective
                  </p>
                </div>
                <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                  <h3 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">
                    Optimisation
                  </h3>
                  <p className="text-sm text-blue-700 dark:text-blue-200">
                    Étendre les bonnes pratiques de l'équipe Dev
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default B2BAdminDashboard;
