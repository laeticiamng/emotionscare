
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Users, 
  TrendingUp, 
  AlertTriangle, 
  Activity, 
  BarChart3, 
  Settings, 
  Shield,
  Bell,
  Calendar,
  MessageSquare
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

const B2BAdminDashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [notifications] = useState([
    { id: 1, type: 'warning', message: '3 employés avec un score de bien-être faible', time: 'Il y a 1h' },
    { id: 2, type: 'info', message: 'Nouveau rapport mensuel disponible', time: 'Il y a 2h' },
    { id: 3, type: 'success', message: 'Objectif de participation atteint (85%)', time: 'Il y a 4h' }
  ]);

  const stats = [
    {
      title: "Employés actifs",
      value: "127/150",
      change: "+5%",
      icon: Users,
      color: "text-blue-600",
      bgColor: "bg-blue-50"
    },
    {
      title: "Score moyen bien-être",
      value: "78/100",
      change: "+12%",
      icon: Activity,
      color: "text-green-600",
      bgColor: "bg-green-50"
    },
    {
      title: "Alertes actives",
      value: "3",
      change: "-2",
      icon: AlertTriangle,
      color: "text-orange-600",
      bgColor: "bg-orange-50"
    },
    {
      title: "Engagement",
      value: "84%",
      change: "+8%",
      icon: TrendingUp,
      color: "text-purple-600",
      bgColor: "bg-purple-50"
    }
  ];

  const quickActions = [
    {
      title: "Gérer les utilisateurs",
      description: "Administrer les comptes et permissions",
      icon: Users,
      action: () => navigate('/b2b/admin/users'),
      color: "bg-blue-600 hover:bg-blue-700"
    },
    {
      title: "Analytics avancées",
      description: "Rapports détaillés et insights",
      icon: BarChart3,
      action: () => navigate('/b2b/admin/analytics'),
      color: "bg-green-600 hover:bg-green-700"
    },
    {
      title: "Paramètres système",
      description: "Configuration de la plateforme",
      icon: Settings,
      action: () => console.log('Settings'),
      color: "bg-purple-600 hover:bg-purple-700"
    },
    {
      title: "Sécurité",
      description: "Audit et contrôles de sécurité",
      icon: Shield,
      action: () => console.log('Security'),
      color: "bg-red-600 hover:bg-red-700"
    }
  ];

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Dashboard Administrateur</h1>
          <p className="text-muted-foreground">
            Bienvenue {user?.name}, gérez le bien-être de votre organisation
          </p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline" size="icon">
            <Bell className="h-4 w-4" />
          </Button>
          <Button>
            <Calendar className="mr-2 h-4 w-4" />
            Planifier une intervention
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Card key={index}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">
                      {stat.title}
                    </p>
                    <p className="text-2xl font-bold">{stat.value}</p>
                    <div className="flex items-center mt-1">
                      <Badge variant={stat.change.startsWith('+') ? 'default' : 'secondary'} className="text-xs">
                        {stat.change}
                      </Badge>
                      <span className="text-xs text-muted-foreground ml-2">vs mois dernier</span>
                    </div>
                  </div>
                  <div className={`p-3 rounded-full ${stat.bgColor}`}>
                    <Icon className={`h-6 w-6 ${stat.color}`} />
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Actions rapides</CardTitle>
          <CardDescription>
            Accédez rapidement aux fonctionnalités d'administration
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {quickActions.map((action, index) => {
              const Icon = action.icon;
              return (
                <Button
                  key={index}
                  variant="outline"
                  className="h-auto p-4 flex flex-col items-center space-y-2"
                  onClick={action.action}
                >
                  <div className={`p-3 rounded-full ${action.color}`}>
                    <Icon className="h-6 w-6 text-white" />
                  </div>
                  <div className="text-center">
                    <h3 className="font-medium">{action.title}</h3>
                    <p className="text-xs text-muted-foreground">
                      {action.description}
                    </p>
                  </div>
                </Button>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Notifications and Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Bell className="mr-2 h-5 w-5" />
              Notifications importantes
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {notifications.map((notif) => (
              <div key={notif.id} className="flex items-start space-x-3 p-3 border rounded-lg">
                <div className={`w-2 h-2 rounded-full mt-2 ${
                  notif.type === 'warning' ? 'bg-orange-500' :
                  notif.type === 'success' ? 'bg-green-500' : 'bg-blue-500'
                }`}></div>
                <div className="flex-1">
                  <p className="text-sm font-medium">{notif.message}</p>
                  <p className="text-xs text-muted-foreground">{notif.time}</p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <MessageSquare className="mr-2 h-5 w-5" />
              Activité récente
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                  <Users className="h-4 w-4 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm font-medium">15 nouveaux utilisateurs cette semaine</p>
                  <p className="text-xs text-muted-foreground">Département Marketing</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                  <Activity className="h-4 w-4 text-green-600" />
                </div>
                <div>
                  <p className="text-sm font-medium">Score équipe IT : 92/100</p>
                  <p className="text-xs text-muted-foreground">Meilleure performance du mois</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                  <BarChart3 className="h-4 w-4 text-purple-600" />
                </div>
                <div>
                  <p className="text-sm font-medium">Rapport mensuel généré</p>
                  <p className="text-xs text-muted-foreground">Prêt pour la direction</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts placeholder */}
      <Card>
        <CardHeader>
          <CardTitle>Tendances bien-être</CardTitle>
          <CardDescription>
            Évolution des scores de bien-être sur les 6 derniers mois
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-64 flex items-center justify-center bg-muted/20 rounded-lg">
            <div className="text-center">
              <BarChart3 className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
              <p className="text-lg font-medium">Graphiques en développement</p>
              <p className="text-sm text-muted-foreground">
                Les analytics détaillées seront disponibles prochainement
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default B2BAdminDashboardPage;
