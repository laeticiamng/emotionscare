
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  Building2, 
  Users, 
  BarChart3, 
  Calendar,
  Settings,
  TrendingUp,
  AlertCircle
} from 'lucide-react';
import { Link } from 'react-router-dom';

const B2BAdminDashboardPage: React.FC = () => {
  const adminModules = [
    { name: 'Gestion équipes', icon: Users, path: '/teams', color: 'text-blue-500' },
    { name: 'Rapports', icon: BarChart3, path: '/reports', color: 'text-green-500' },
    { name: 'Événements', icon: Calendar, path: '/events', color: 'text-purple-500' },
    { name: 'Optimisation', icon: TrendingUp, path: '/optimisation', color: 'text-orange-500' },
  ];

  return (
    <div className="min-h-screen bg-background" data-testid="page-root">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Tableau de bord RH</h1>
          <p className="text-muted-foreground">Gestion et suivi du bien-être de vos équipes</p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Collaborateurs actifs</p>
                  <p className="text-2xl font-bold">247</p>
                </div>
                <Users className="h-8 w-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Score moyen bien-être</p>
                  <p className="text-2xl font-bold text-green-500">78%</p>
                </div>
                <TrendingUp className="h-8 w-8 text-green-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Sessions cette semaine</p>
                  <p className="text-2xl font-bold">1,234</p>
                </div>
                <BarChart3 className="h-8 w-8 text-purple-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Alertes</p>
                  <p className="text-2xl font-bold text-orange-500">3</p>
                </div>
                <AlertCircle className="h-8 w-8 text-orange-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {adminModules.map((module) => (
            <Link key={module.name} to={module.path}>
              <Card className="hover:shadow-lg transition-shadow cursor-pointer h-full">
                <CardHeader className="text-center">
                  <module.icon className={`h-12 w-12 mx-auto mb-4 ${module.color}`} />
                  <CardTitle>{module.name}</CardTitle>
                </CardHeader>
                <CardContent className="text-center">
                  <Button variant="outline" className="w-full">
                    Accéder
                  </Button>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building2 className="h-6 w-6 text-green-500" />
                Vue d'ensemble organisation
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span>Taux d'utilisation</span>
                  <span className="font-bold text-green-500">84%</span>
                </div>
                <div className="flex justify-between">
                  <span>Satisfaction moyenne</span>
                  <span className="font-bold text-blue-500">4.2/5</span>
                </div>
                <div className="flex justify-between">
                  <span>Amélioration bien-être</span>
                  <span className="font-bold text-purple-500">+15%</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Actions rapides</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button variant="outline" className="w-full justify-start">
                <Calendar className="h-4 w-4 mr-2" />
                Planifier un événement
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <BarChart3 className="h-4 w-4 mr-2" />
                Générer un rapport
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <Settings className="h-4 w-4 mr-2" />
                Paramètres organisation
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default B2BAdminDashboardPage;
