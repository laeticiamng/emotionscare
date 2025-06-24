
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { useDashboardData } from '@/hooks/useDashboardData';
import AdminSidebar from '@/components/admin/premium/AdminSidebar';
import { 
  Users, 
  BarChart3, 
  Shield, 
  Settings, 
  Activity,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  Clock,
  UserCheck
} from 'lucide-react';

const B2BAdminDashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const { dashboardData, isLoading } = useDashboardData();

  const adminFeatures = [
    { 
      title: 'Gestion Équipes', 
      icon: Users, 
      path: '/teams', 
      color: 'bg-blue-500',
      description: 'Gérer les équipes et collaborateurs'
    },
    { 
      title: 'Analytics', 
      icon: BarChart3, 
      path: '/reports', 
      color: 'bg-green-500',
      description: 'Rapports et analytics avancés'
    },
    { 
      title: 'Journal d\'activité', 
      icon: Activity, 
      path: '/audit', 
      color: 'bg-purple-500',
      description: 'Logs et audit trail'
    },
    { 
      title: 'Paramètres', 
      icon: Settings, 
      path: '/settings', 
      color: 'bg-gray-500',
      description: 'Configuration système'
    },
    { 
      title: 'Sécurité', 
      icon: Shield, 
      path: '/security', 
      color: 'bg-red-500',
      description: 'Sécurité et conformité'
    },
    { 
      title: 'Événements', 
      icon: Clock, 
      path: '/events', 
      color: 'bg-indigo-500',
      description: 'Gestion des événements'
    }
  ];

  return (
    <div data-testid="page-root" className="flex h-screen bg-gray-50">
      <AdminSidebar currentPath="/b2b/admin/dashboard" />
      
      <div className="flex-1 overflow-auto">
        <div className="container mx-auto p-6 space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Administration</h1>
              <p className="text-gray-600">Tableau de bord administrateur EmotionsCare</p>
            </div>
            <div className="flex items-center space-x-2 text-sm text-gray-500">
              <Shield className="h-4 w-4" />
              <span>Admin Dashboard</span>
            </div>
          </div>

          {/* Key Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Utilisateurs actifs</CardTitle>
                <UserCheck className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">247</div>
                <p className="text-xs text-muted-foreground">
                  +12% ce mois
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Équipes</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">18</div>
                <p className="text-xs text-muted-foreground">
                  3 nouvelles cette semaine
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Bien-être moyen</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">7.8/10</div>
                <p className="text-xs text-muted-foreground">
                  +0.3 cette semaine
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Alerts</CardTitle>
                <AlertTriangle className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">3</div>
                <p className="text-xs text-muted-foreground">
                  nécessitent attention
                </p>
              </CardContent>
            </Card>
          </div>

          {/* System Status */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">État du système</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">API Backend</span>
                    <div className="flex items-center space-x-2">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      <span className="text-sm text-green-600">Opérationnel</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Base de données</span>
                    <div className="flex items-center space-x-2">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      <span className="text-sm text-green-600">Opérationnel</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Services IA</span>
                    <div className="flex items-center space-x-2">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      <span className="text-sm text-green-600">Opérationnel</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Activité récente</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="text-sm">
                    <div className="font-medium">Nouvelle équipe créée</div>
                    <div className="text-gray-500">Équipe Marketing - il y a 2h</div>
                  </div>
                  <div className="text-sm">
                    <div className="font-medium">Rapport généré</div>
                    <div className="text-gray-500">Analytics mensuels - il y a 4h</div>
                  </div>
                  <div className="text-sm">
                    <div className="font-medium">Utilisateur ajouté</div>
                    <div className="text-gray-500">15 nouveaux collaborateurs - hier</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Actions rapides</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <Button variant="outline" size="sm" className="w-full justify-start">
                    <Users className="h-4 w-4 mr-2" />
                    Ajouter une équipe
                  </Button>
                  <Button variant="outline" size="sm" className="w-full justify-start">
                    <BarChart3 className="h-4 w-4 mr-2" />
                    Générer rapport
                  </Button>
                  <Button variant="outline" size="sm" className="w-full justify-start">
                    <Settings className="h-4 w-4 mr-2" />
                    Configuration
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Admin Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {adminFeatures.map((feature) => {
              const Icon = feature.icon;
              return (
                <Card 
                  key={feature.path} 
                  className="cursor-pointer hover:shadow-lg transition-shadow"
                  onClick={() => navigate(feature.path)}
                >
                  <CardHeader className="text-center pb-2">
                    <div className={`w-12 h-12 ${feature.color} rounded-full flex items-center justify-center mx-auto mb-2`}>
                      <Icon className="h-6 w-6 text-white" />
                    </div>
                    <CardTitle className="text-lg">{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent className="text-center">
                    <p className="text-sm text-gray-600 mb-4">{feature.description}</p>
                    <Button variant="outline" size="sm" className="w-full">
                      Accéder
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default B2BAdminDashboardPage;
