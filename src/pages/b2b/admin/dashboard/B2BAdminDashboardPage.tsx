
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Shield, 
  Users, 
  TrendingUp, 
  AlertTriangle, 
  Building,
  BarChart3,
  Settings,
  UserPlus,
  Activity,
  Target,
  Calendar,
  Award
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import LoadingAnimation from '@/components/ui/loading-animation';

interface AdminStats {
  totalUsers: number;
  activeUsers: number;
  averageWellbeing: number;
  criticalAlerts: number;
  departmentData: DepartmentData[];
  recentActivity: ActivityData[];
}

interface DepartmentData {
  name: string;
  userCount: number;
  averageScore: number;
  trend: 'up' | 'down' | 'stable';
}

interface ActivityData {
  id: string;
  user: string;
  action: string;
  timestamp: Date;
  type: 'warning' | 'success' | 'info';
}

const B2BAdminDashboardPage: React.FC = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    if (user) {
      loadAdminData();
    }
  }, [user]);

  const loadAdminData = async () => {
    if (!user) return;
    
    try {
      setIsLoading(true);

      // Charger les données des utilisateurs B2B
      const { data: profiles, error: profilesError } = await supabase
        .from('profiles')
        .select('*')
        .in('role', ['b2b_user', 'b2b_admin']);

      if (profilesError) throw profilesError;

      // Charger les émotions récentes
      const { data: emotions, error: emotionsError } = await supabase
        .from('emotions')
        .select('*, profiles!inner(role)')
        .eq('profiles.role', 'b2b_user')
        .gte('date', new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString());

      if (emotionsError) throw emotionsError;

      // Calculer les statistiques
      const totalUsers = profiles?.filter(p => p.role === 'b2b_user').length || 0;
      const activeUsers = Math.round(totalUsers * 0.75); // Simulation
      
      const avgWellbeing = emotions?.length > 0 
        ? emotions.reduce((sum, e) => sum + (e.score || 0), 0) / emotions.length 
        : 0;

      const criticalAlerts = emotions?.filter(e => (e.score || 0) < 30).length || 0;

      // Simuler les données par département
      const departmentData: DepartmentData[] = [
        { name: 'IT', userCount: 8, averageScore: 78, trend: 'up' },
        { name: 'RH', userCount: 5, averageScore: 72, trend: 'stable' },
        { name: 'Marketing', userCount: 6, averageScore: 65, trend: 'down' },
        { name: 'Finance', userCount: 4, averageScore: 80, trend: 'up' }
      ];

      // Simuler l'activité récente
      const recentActivity: ActivityData[] = [
        {
          id: '1',
          user: 'Marie Dubois',
          action: 'Score émotionnel critique (25/100)',
          timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
          type: 'warning'
        },
        {
          id: '2',
          user: 'Pierre Martin',
          action: 'Objectif de bien-être atteint',
          timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000),
          type: 'success'
        },
        {
          id: '3',
          user: 'Sophie Laurent',
          action: 'Nouveau compte créé',
          timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000),
          type: 'info'
        }
      ];

      setStats({
        totalUsers,
        activeUsers,
        averageWellbeing: Math.round(avgWellbeing),
        criticalAlerts,
        departmentData,
        recentActivity
      });

    } catch (error) {
      console.error('Admin data loading error:', error);
      toast.error("Impossible de charger les données administrateur");
    } finally {
      setIsLoading(false);
    }
  };

  const handleInviteUser = () => {
    toast.info("Fonctionnalité d'invitation en développement");
  };

  const handleExportData = () => {
    toast.info("Export des données en développement");
  };

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <LoadingAnimation text="Chargement du tableau de bord administrateur..." />
      </div>
    );
  }

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up': return <TrendingUp className="h-4 w-4 text-green-500" />;
      case 'down': return <TrendingUp className="h-4 w-4 text-red-500 rotate-180" />;
      default: return <div className="h-4 w-4 bg-gray-300 rounded-full" />;
    }
  };

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'warning': return <AlertTriangle className="h-4 w-4 text-orange-500" />;
      case 'success': return <Award className="h-4 w-4 text-green-500" />;
      default: return <Activity className="h-4 w-4 text-blue-500" />;
    }
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Welcome Section */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Shield className="h-8 w-8 text-primary" />
            Administration EmotionsCare
          </h1>
          <p className="text-muted-foreground">
            Tableau de bord administrateur - Vue d'ensemble organisationnelle
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button onClick={handleInviteUser} className="flex items-center gap-2">
            <UserPlus className="h-4 w-4" />
            Inviter utilisateur
          </Button>
          <Button variant="outline" onClick={handleExportData}>
            Exporter données
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Utilisateurs Total</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.totalUsers || 0}</div>
            <p className="text-xs text-muted-foreground">+{stats?.activeUsers || 0} actifs</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Bien-être Moyen</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.averageWellbeing || 0}%</div>
            <Progress value={stats?.averageWellbeing || 0} className="mt-2" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Alertes Critiques</CardTitle>
            <AlertTriangle className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">{stats?.criticalAlerts || 0}</div>
            <p className="text-xs text-muted-foreground">Nécessitent attention</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Taux Engagement</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">85%</div>
            <p className="text-xs text-muted-foreground">Participation active</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Vue d'ensemble</TabsTrigger>
          <TabsTrigger value="departments">Départements</TabsTrigger>
          <TabsTrigger value="analytics">Analytiques</TabsTrigger>
          <TabsTrigger value="settings">Paramètres</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Activité récente */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="h-5 w-5" />
                  Activité Récente
                </CardTitle>
                <CardDescription>Événements importants des dernières heures</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {stats?.recentActivity.map((activity) => (
                    <div key={activity.id} className="flex items-center gap-3 p-3 bg-muted rounded-lg">
                      {getActivityIcon(activity.type)}
                      <div className="flex-1">
                        <p className="font-medium">{activity.user}</p>
                        <p className="text-sm text-muted-foreground">{activity.action}</p>
                        <p className="text-xs text-muted-foreground">
                          {activity.timestamp.toLocaleTimeString()}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Actions rapides */}
            <Card>
              <CardHeader>
                <CardTitle>Actions Administrateur</CardTitle>
                <CardDescription>Outils de gestion rapide</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <Button 
                    variant="outline" 
                    className="w-full justify-start"
                    onClick={() => setActiveTab('analytics')}
                  >
                    <BarChart3 className="mr-2 h-4 w-4" />
                    Voir les analytiques détaillées
                  </Button>
                  
                  <Button 
                    variant="outline" 
                    className="w-full justify-start"
                    onClick={handleInviteUser}
                  >
                    <UserPlus className="mr-2 h-4 w-4" />
                    Inviter de nouveaux utilisateurs
                  </Button>
                  
                  <Button 
                    variant="outline" 
                    className="w-full justify-start"
                    onClick={() => setActiveTab('settings')}
                  >
                    <Settings className="mr-2 h-4 w-4" />
                    Configuration organisation
                  </Button>
                  
                  <Button 
                    variant="outline" 
                    className="w-full justify-start"
                    onClick={handleExportData}
                  >
                    <Calendar className="mr-2 h-4 w-4" />
                    Planifier rapport mensuel
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="departments" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building className="h-5 w-5" />
                Performance par Département
              </CardTitle>
              <CardDescription>Analyse du bien-être par équipe</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {stats?.departmentData.map((dept, index) => (
                  <div key={index} className="p-4 border rounded-lg">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <h4 className="font-medium">{dept.name}</h4>
                        {getTrendIcon(dept.trend)}
                      </div>
                      <Badge variant="outline">
                        {dept.userCount} utilisateurs
                      </Badge>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Score moyen de bien-être</span>
                        <span className="font-medium">{dept.averageScore}%</span>
                      </div>
                      <Progress value={dept.averageScore} className="h-2" />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5" />
                Analytiques Avancées
              </CardTitle>
              <CardDescription>Analyses détaillées du bien-être organisationnel</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12">
                <BarChart3 className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium mb-2">Analytiques Détaillées</h3>
                <p className="text-muted-foreground mb-4">
                  Visualisations et rapports approfondis en développement
                </p>
                <Button onClick={() => toast.info("Fonctionnalité bientôt disponible")}>
                  Accéder aux rapports
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="settings" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5" />
                Paramètres Organisation
              </CardTitle>
              <CardDescription>Configuration de votre instance EmotionsCare</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="p-4 border rounded-lg">
                  <h4 className="font-medium mb-2">Invitations d'utilisateurs</h4>
                  <p className="text-sm text-muted-foreground mb-3">
                    Gérer les invitations et les rôles des nouveaux collaborateurs
                  </p>
                  <Button onClick={handleInviteUser}>
                    <UserPlus className="mr-2 h-4 w-4" />
                    Nouvelle invitation
                  </Button>
                </div>

                <div className="p-4 border rounded-lg">
                  <h4 className="font-medium mb-2">Notifications</h4>
                  <p className="text-sm text-muted-foreground mb-3">
                    Configurer les alertes et notifications automatiques
                  </p>
                  <Button variant="outline" onClick={() => toast.info("Configuration en développement")}>
                    Configurer notifications
                  </Button>
                </div>

                <div className="p-4 border rounded-lg">
                  <h4 className="font-medium mb-2">Rapports automatiques</h4>
                  <p className="text-sm text-muted-foreground mb-3">
                    Planifier l'envoi de rapports périodiques
                  </p>
                  <Button variant="outline" onClick={() => toast.info("Planification en développement")}>
                    Planifier rapports
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default B2BAdminDashboardPage;
