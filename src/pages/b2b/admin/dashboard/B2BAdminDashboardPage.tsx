
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { 
  Users, 
  TrendingUp, 
  BarChart3, 
  Settings, 
  Shield, 
  AlertTriangle,
  UserCheck,
  Activity,
  Calendar,
  Target,
  Building,
  Crown
} from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { Progress } from '@/components/ui/progress';

interface AdminDashboardStats {
  totalUsers: number;
  activeUsers: number;
  avgWellbeingScore: number;
  criticalAlerts: number;
  weeklyGrowth: number;
  totalScans: number;
}

const B2BAdminDashboardPage: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState<AdminDashboardStats>({
    totalUsers: 0,
    activeUsers: 0,
    avgWellbeingScore: 75,
    criticalAlerts: 2,
    weeklyGrowth: 12,
    totalScans: 0
  });
  const [recentActivity, setRecentActivity] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadAdminDashboardData();
  }, [user]);

  const loadAdminDashboardData = async () => {
    if (!user) return;

    try {
      setIsLoading(true);
      
      // Charger les statistiques d'administration
      const [usersResult, emotionsResult, profilesResult] = await Promise.all([
        supabase.from('profiles').select('*').eq('role', 'b2b_user'),
        supabase.from('emotions').select('*'),
        supabase.from('profiles').select('*')
      ]);

      const totalUsers = usersResult.data?.length || 0;
      const totalScans = emotionsResult.data?.length || 0;
      const activeUsers = Math.floor(totalUsers * 0.7); // Simulation

      setStats(prev => ({
        ...prev,
        totalUsers,
        activeUsers,
        totalScans
      }));

      // Activité récente simulée
      const mockActivity = [
        {
          type: 'user_joined',
          title: 'Nouvel utilisateur',
          description: 'Sarah Martin a rejoint l\'équipe Marketing',
          time: 'Il y a 2h',
          icon: UserCheck
        },
        {
          type: 'alert',
          title: 'Alerte bien-être',
          description: 'Score critique détecté dans l\'équipe IT',
          time: 'Il y a 4h',
          icon: AlertTriangle
        },
        {
          type: 'milestone',
          title: 'Objectif atteint',
          description: '100 scans émotionnels ce mois',
          time: 'Hier',
          icon: Target
        }
      ];

      setRecentActivity(mockActivity);
    } catch (error) {
      console.error('Erreur chargement dashboard admin:', error);
      toast.error('Erreur lors du chargement du tableau de bord');
    } finally {
      setIsLoading(false);
    }
  };

  const adminActions = [
    {
      title: 'Gestion utilisateurs',
      description: 'Administrer les comptes collaborateurs',
      icon: Users,
      color: 'bg-blue-500',
      path: '/b2b/admin/users'
    },
    {
      title: 'Analytics avancées',
      description: 'Rapports et statistiques détaillées',
      icon: BarChart3,
      color: 'bg-green-500',
      path: '/b2b/admin/analytics'
    },
    {
      title: 'Configuration',
      description: 'Paramètres de l\'organisation',
      icon: Settings,
      color: 'bg-purple-500',
      path: '/settings'
    },
    {
      title: 'Alertes système',
      description: 'Surveillance et notifications',
      icon: AlertTriangle,
      color: 'bg-red-500',
      path: '/b2b/admin/alerts'
    }
  ];

  if (isLoading) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {[...Array(4)].map((_, i) => (
            <Card key={i}>
              <CardHeader className="space-y-0 pb-2">
                <div className="h-4 bg-muted rounded w-1/2"></div>
                <div className="h-8 bg-muted rounded w-3/4"></div>
              </CardHeader>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Tableau de bord Administrateur 👨‍💼
          </h1>
          <p className="text-muted-foreground">
            Interface d'administration EmotionsCare - {user?.user_metadata?.company || 'Votre organisation'}
          </p>
        </div>
        <div className="flex gap-2">
          <Badge variant="outline">
            <Shield className="h-3 w-3 mr-1" />
            Administrateur
          </Badge>
          <Badge variant="secondary">
            <Crown className="h-3 w-3 mr-1" />
            Accès total
          </Badge>
        </div>
      </div>

      {/* Critical Alerts */}
      {stats.criticalAlerts > 0 && (
        <Card className="border-red-200 bg-red-50/50 dark:border-red-800 dark:bg-red-900/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-red-700 dark:text-red-300">
              <AlertTriangle className="h-5 w-5" />
              Alertes critiques ({stats.criticalAlerts})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-red-600 dark:text-red-400">
              Des collaborateurs nécessitent une attention particulière. 
              <Button variant="link" className="p-0 h-auto text-red-600 dark:text-red-400">
                Voir les détails →
              </Button>
            </p>
          </CardContent>
        </Card>
      )}

      {/* Admin Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total collaborateurs</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalUsers}</div>
            <p className="text-xs text-muted-foreground">
              {stats.activeUsers} actifs cette semaine
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Score moyen organisation</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.avgWellbeingScore}/100</div>
            <Progress value={stats.avgWellbeingScore} className="mt-2" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total scans</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalScans}</div>
            <p className="text-xs text-muted-foreground">
              +{stats.weeklyGrowth}% cette semaine
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Taux d'engagement</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {Math.round((stats.activeUsers / Math.max(stats.totalUsers, 1)) * 100)}%
            </div>
            <Progress value={(stats.activeUsers / Math.max(stats.totalUsers, 1)) * 100} className="mt-2" />
          </CardContent>
        </Card>
      </div>

      {/* Admin Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Actions d'administration</CardTitle>
          <CardDescription>
            Gérez votre organisation et surveillez le bien-être de vos équipes
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {adminActions.map((action) => (
              <Button
                key={action.title}
                variant="outline"
                className="h-auto flex flex-col items-center gap-2 p-4"
                onClick={() => navigate(action.path)}
              >
                <div className={`p-2 rounded-full ${action.color} text-white`}>
                  <action.icon className="h-6 w-6" />
                </div>
                <div className="text-center">
                  <div className="font-medium">{action.title}</div>
                  <div className="text-xs text-muted-foreground">
                    {action.description}
                  </div>
                </div>
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Admin Panels */}
      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Activité récente</CardTitle>
            <CardDescription>
              Événements et notifications système
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivity.map((activity, index) => (
                <div key={index} className="flex items-center gap-4">
                  <div className="p-2 bg-muted rounded-full">
                    <activity.icon className="h-4 w-4" />
                  </div>
                  <div className="flex-1 space-y-1">
                    <p className="text-sm font-medium">{activity.title}</p>
                    <p className="text-xs text-muted-foreground">
                      {activity.description}
                    </p>
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {activity.time}
                  </div>
                </div>
              ))}
            </div>
            <Button variant="outline" className="w-full mt-4">
              Voir toute l'activité
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Vue d'ensemble organisation</CardTitle>
            <CardDescription>
              Métriques clés et tendances
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm">Adoption plateforme</span>
                <span className="text-sm font-medium">
                  {Math.round((stats.activeUsers / Math.max(stats.totalUsers, 1)) * 100)}%
                </span>
              </div>
              <Progress value={(stats.activeUsers / Math.max(stats.totalUsers, 1)) * 100} />
              
              <div className="grid grid-cols-2 gap-4 pt-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">+{stats.weeklyGrowth}%</div>
                  <div className="text-xs text-muted-foreground">Croissance hebdomadaire</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">{stats.criticalAlerts}</div>
                  <div className="text-xs text-muted-foreground">Alertes à traiter</div>
                </div>
              </div>

              <Button className="w-full mt-4" onClick={() => navigate('/b2b/admin/analytics')}>
                <BarChart3 className="h-4 w-4 mr-2" />
                Analytics détaillées
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default B2BAdminDashboardPage;
