
import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, Activity, TrendingUp, AlertTriangle, Shield, LogOut } from 'lucide-react';

const B2BAdminDashboard: React.FC = () => {
  const { user, logout } = useAuth();

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-100 p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              <Shield className="inline w-8 h-8 mr-2 text-purple-600" />
              Administration RH
            </h1>
            <p className="text-gray-600">
              Tableau de bord - {user?.name || user?.email}
            </p>
          </div>
          <Button variant="outline" onClick={logout}>
            <LogOut className="w-4 h-4 mr-2" />
            Déconnexion
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Collaborateurs actifs</CardTitle>
              <Users className="w-4 h-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">247</div>
              <p className="text-xs text-muted-foreground">+12 ce mois</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Taux d'engagement</CardTitle>
              <Activity className="w-4 h-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">87%</div>
              <p className="text-xs text-muted-foreground">+5% vs mois dernier</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Score bien-être moyen</CardTitle>
              <TrendingUp className="w-4 h-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">82%</div>
              <p className="text-xs text-muted-foreground">+2% cette semaine</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Alertes</CardTitle>
              <AlertTriangle className="w-4 h-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">3</div>
              <p className="text-xs text-muted-foreground">Nécessitent attention</p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Équipes */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>Vue d'ensemble des équipes</CardTitle>
              <CardDescription>
                Performance bien-être par département
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <h3 className="font-medium">Développement</h3>
                    <p className="text-sm text-gray-600">45 collaborateurs</p>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-bold text-green-600">89%</div>
                    <p className="text-xs text-gray-500">Score bien-être</p>
                  </div>
                </div>

                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <h3 className="font-medium">Marketing</h3>
                    <p className="text-sm text-gray-600">32 collaborateurs</p>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-bold text-blue-600">85%</div>
                    <p className="text-xs text-gray-500">Score bien-être</p>
                  </div>
                </div>

                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <h3 className="font-medium">Ventes</h3>
                    <p className="text-sm text-gray-600">28 collaborateurs</p>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-bold text-orange-600">76%</div>
                    <p className="text-xs text-gray-500">Score bien-être</p>
                  </div>
                </div>

                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <h3 className="font-medium">Support</h3>
                    <p className="text-sm text-gray-600">22 collaborateurs</p>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-bold text-green-600">91%</div>
                    <p className="text-xs text-gray-500">Score bien-être</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Actions rapides */}
          <Card>
            <CardHeader>
              <CardTitle>Actions rapides</CardTitle>
              <CardDescription>
                Outils d'administration
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button className="w-full justify-start" variant="outline">
                <Users className="w-4 h-4 mr-2" />
                Gérer les utilisateurs
              </Button>

              <Button className="w-full justify-start" variant="outline">
                <Activity className="w-4 h-4 mr-2" />
                Rapports d'activité
              </Button>

              <Button className="w-full justify-start" variant="outline">
                <TrendingUp className="w-4 h-4 mr-2" />
                Analytics avancés
              </Button>

              <Button className="w-full justify-start" variant="outline">
                <AlertTriangle className="w-4 h-4 mr-2" />
                Alertes & notifications
              </Button>

              <div className="pt-4 border-t">
                <h4 className="font-medium mb-2">Dernières activités</h4>
                <div className="space-y-2 text-sm text-gray-600">
                  <p>• 12 nouveaux utilisateurs cette semaine</p>
                  <p>• 89% de participation aux sessions</p>
                  <p>• 3 alertes de stress détectées</p>
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
