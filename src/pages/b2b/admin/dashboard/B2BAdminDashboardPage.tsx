
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { 
  Users, 
  TrendingUp, 
  AlertTriangle, 
  CheckCircle,
  Calendar,
  Building2,
  BarChart3,
  Settings,
  Shield,
  Activity
} from 'lucide-react';

const B2BAdminDashboardPage: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [companyWellness, setCompanyWellness] = useState(78);
  const [activeUsers, setActiveUsers] = useState(145);
  const [totalUsers, setTotalUsers] = useState(180);
  const [alertsCount, setAlertsCount] = useState(3);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setIsLoading(false);
    }, 1000);
  }, []);

  const adminActions = [
    {
      title: 'Gestion des utilisateurs',
      description: 'Gérer les comptes et les permissions',
      icon: <Users className="h-6 w-6" />,
      path: '/b2b/admin/users',
      color: 'bg-blue-500'
    },
    {
      title: 'Analyses et rapports',
      description: 'Voir les statistiques détaillées',
      icon: <BarChart3 className="h-6 w-6" />,
      path: '/b2b/admin/analytics',
      color: 'bg-green-500'
    },
    {
      title: 'Paramètres système',
      description: 'Configuration de l\'organisation',
      icon: <Settings className="h-6 w-6" />,
      path: '/settings',
      color: 'bg-purple-500'
    },
    {
      title: 'Gestion des équipes',
      description: 'Organiser les groupes de travail',
      icon: <Building2 className="h-6 w-6" />,
      path: '/b2b/admin/teams',
      color: 'bg-orange-500'
    }
  ];

  const handleAdminAction = (path: string) => {
    setIsLoading(true);
    navigate(path);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-700 p-6">
        <div className="container mx-auto space-y-6">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-gray-200 rounded w-1/4"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="h-32 bg-gray-200 rounded"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-700 p-6">
      <div className="container mx-auto space-y-6">
        {/* En-tête administrateur */}
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Shield className="h-6 w-6 text-slate-700 dark:text-slate-300" />
            <span className="text-sm text-muted-foreground">Administrateur B2B</span>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Tableau de bord administrateur
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            Gérez votre organisation EmotionsCare
          </p>
        </div>

        {/* Métriques clés */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Utilisateurs actifs</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{activeUsers}/{totalUsers}</div>
              <Progress value={(activeUsers / totalUsers) * 100} className="mt-2" />
              <p className="text-xs text-muted-foreground mt-2">
                {Math.round((activeUsers / totalUsers) * 100)}% d'engagement
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Bien-être général</CardTitle>
              <Activity className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{companyWellness}%</div>
              <Progress value={companyWellness} className="mt-2" />
              <p className="text-xs text-muted-foreground mt-2">
                Score moyen de l'organisation
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Alertes</CardTitle>
              <AlertTriangle className="h-4 w-4 text-orange-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-600">{alertsCount}</div>
              <p className="text-xs text-muted-foreground mt-2">
                Nécessitent votre attention
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Sessions cette semaine</CardTitle>
              <CheckCircle className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">347</div>
              <p className="text-xs text-green-600 mt-2">
                +15% vs semaine précédente
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Actions administrateur */}
        <div>
          <h2 className="text-xl font-semibold mb-4">Actions administrateur</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {adminActions.map((action, index) => (
              <Card 
                key={index} 
                className="cursor-pointer hover:shadow-lg transition-shadow"
                onClick={() => handleAdminAction(action.path)}
              >
                <CardHeader>
                  <div className={`${action.color} w-12 h-12 rounded-full flex items-center justify-center text-white mb-2`}>
                    {action.icon}
                  </div>
                  <CardTitle className="text-lg">{action.title}</CardTitle>
                  <CardDescription>{action.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <Button variant="ghost" className="w-full">
                    Accéder →
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Tableaux de bord et alertes */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                Tendances de l'organisation
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm">Engagement utilisateur</span>
                  <span className="text-sm font-medium text-green-600">+8%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Score de bien-être</span>
                  <span className="text-sm font-medium text-green-600">+5%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Sessions complétées</span>
                  <span className="text-sm font-medium text-green-600">+15%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Satisfaction</span>
                  <span className="text-sm font-medium text-green-600">+3%</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5" />
                Alertes et notifications
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex justify-between items-center p-2 bg-orange-50 border-l-4 border-orange-500 rounded">
                  <span className="text-sm">3 utilisateurs nécessitent un suivi</span>
                  <Button variant="ghost" size="sm">Voir</Button>
                </div>
                <div className="flex justify-between items-center p-2 bg-blue-50 border-l-4 border-blue-500 rounded">
                  <span className="text-sm">Rapport mensuel disponible</span>
                  <Button variant="ghost" size="sm">Voir</Button>
                </div>
                <div className="flex justify-between items-center p-2 bg-green-50 border-l-4 border-green-500 rounded">
                  <span className="text-sm">Nouvel utilisateur inscrit</span>
                  <Button variant="ghost" size="sm">Voir</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default B2BAdminDashboardPage;
