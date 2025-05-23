
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Building, 
  Users, 
  TrendingUp, 
  AlertTriangle,
  BarChart3,
  Settings,
  UserPlus,
  Activity,
  Heart,
  Calendar,
  FileText
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import LoadingAnimation from '@/components/ui/loading-animation';

interface AdminStats {
  totalUsers: number;
  activeUsers: number;
  averageWellbeing: number;
  alertsCount: number;
  weeklyGrowth: number;
  engagementRate: number;
}

const B2BAdminDashboardPage: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [stats, setStats] = useState<AdminStats>({
    totalUsers: 0,
    activeUsers: 0,
    averageWellbeing: 0,
    alertsCount: 0,
    weeklyGrowth: 0,
    engagementRate: 0
  });

  useEffect(() => {
    loadAdminData();
  }, []);

  const loadAdminData = async () => {
    setIsLoading(true);
    
    // Simuler le chargement des données admin
    setTimeout(() => {
      setStats({
        totalUsers: 124,
        activeUsers: 98,
        averageWellbeing: 72,
        alertsCount: 3,
        weeklyGrowth: 12,
        engagementRate: 84
      });
      setIsLoading(false);
    }, 1500);
  };

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <LoadingAnimation text="Chargement du tableau de bord administrateur..." />
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">
            Administration - {user?.company || 'Votre entreprise'}
          </h1>
          <p className="text-muted-foreground">
            Tableau de bord administrateur EmotionsCare
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Building className="h-5 w-5 text-muted-foreground" />
          <span className="text-sm text-muted-foreground">Mode Administrateur</span>
        </div>
      </div>

      {/* Alert Section */}
      {stats.alertsCount > 0 && (
        <Card className="border-orange-200 bg-orange-50">
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <AlertTriangle className="h-8 w-8 text-orange-600" />
              <div>
                <h3 className="font-semibold text-orange-900">
                  {stats.alertsCount} alerte{stats.alertsCount > 1 ? 's' : ''} nécessite{stats.alertsCount > 1 ? 'nt' : ''} votre attention
                </h3>
                <p className="text-sm text-orange-800">
                  Des collaborateurs présentent des indicateurs de bien-être préoccupants
                </p>
              </div>
              <Button variant="outline" className="ml-auto">
                Voir les alertes
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Utilisateurs Totaux</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalUsers}</div>
            <p className="text-xs text-muted-foreground">
              +{stats.weeklyGrowth} cette semaine
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Utilisateurs Actifs</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.activeUsers}</div>
            <p className="text-xs text-muted-foreground">
              {Math.round((stats.activeUsers / stats.totalUsers) * 100)}% du total
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Bien-être Moyen</CardTitle>
            <Heart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.averageWellbeing}/100</div>
            <p className="text-xs text-muted-foreground">
              Score de l'entreprise
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Engagement</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.engagementRate}%</div>
            <p className="text-xs text-muted-foreground">
              Taux d'engagement
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="overview">Aperçu</TabsTrigger>
          <TabsTrigger value="users">Utilisateurs</TabsTrigger>
          <TabsTrigger value="analytics">Analytiques</TabsTrigger>
          <TabsTrigger value="reports">Rapports</TabsTrigger>
          <TabsTrigger value="settings">Paramètres</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Actions Rapides</CardTitle>
                <CardDescription>Accédez rapidement aux fonctions d'administration</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  <Button 
                    variant="outline" 
                    className="h-20 flex flex-col gap-2"
                    onClick={() => navigate('/b2b/admin/users')}
                  >
                    <UserPlus className="h-6 w-6" />
                    Inviter Utilisateur
                  </Button>
                  
                  <Button 
                    variant="outline" 
                    className="h-20 flex flex-col gap-2"
                    onClick={() => navigate('/b2b/admin/analytics')}
                  >
                    <BarChart3 className="h-6 w-6" />
                    Voir Analytiques
                  </Button>
                  
                  <Button 
                    variant="outline" 
                    className="h-20 flex flex-col gap-2"
                  >
                    <FileText className="h-6 w-6" />
                    Rapport Mensuel
                  </Button>
                  
                  <Button 
                    variant="outline" 
                    className="h-20 flex flex-col gap-2"
                  >
                    <Settings className="h-6 w-6" />
                    Paramètres
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Recent Activity */}
            <Card>
              <CardHeader>
                <CardTitle>Activité Récente</CardTitle>
                <CardDescription>Dernières actions dans votre organisation</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                    <div>
                      <p className="font-medium">5 nouveaux utilisateurs inscrits</p>
                      <p className="text-sm text-muted-foreground">Il y a 2 heures</p>
                    </div>
                    <UserPlus className="h-4 w-4 text-green-600" />
                  </div>
                  
                  <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                    <div>
                      <p className="font-medium">Rapport hebdomadaire généré</p>
                      <p className="text-sm text-muted-foreground">Il y a 4 heures</p>
                    </div>
                    <FileText className="h-4 w-4 text-blue-600" />
                  </div>
                  
                  <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                    <div>
                      <p className="font-medium">Session de formation terminée</p>
                      <p className="text-sm text-muted-foreground">Hier</p>
                    </div>
                    <Calendar className="h-4 w-4 text-purple-600" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Key Metrics */}
          <Card>
            <CardHeader>
              <CardTitle>Métriques Clés</CardTitle>
              <CardDescription>Indicateurs de performance de votre organisation</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <div className="text-2xl font-bold text-green-600">87%</div>
                  <div className="text-sm text-green-800">Satisfaction Utilisateurs</div>
                </div>
                
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600">92%</div>
                  <div className="text-sm text-blue-800">Taux de Rétention</div>
                </div>
                
                <div className="text-center p-4 bg-purple-50 rounded-lg">
                  <div className="text-2xl font-bold text-purple-600">15min</div>
                  <div className="text-sm text-purple-800">Temps Moyen par Session</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="users">
          <Card>
            <CardHeader>
              <CardTitle>Gestion des Utilisateurs</CardTitle>
              <CardDescription>Administrez les comptes de votre organisation</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12">
                <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">Interface de gestion des utilisateurs en développement</p>
                <Button className="mt-4" onClick={() => navigate('/b2b/admin/users')}>
                  Accéder à la gestion avancée
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics">
          <Card>
            <CardHeader>
              <CardTitle>Analytiques Avancées</CardTitle>
              <CardDescription>Analyses détaillées du bien-être organisationnel</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12">
                <BarChart3 className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">Tableaux de bord analytiques en développement</p>
                <Button className="mt-4" onClick={() => navigate('/b2b/admin/analytics')}>
                  Accéder aux analytiques
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="reports">
          <Card>
            <CardHeader>
              <CardTitle>Rapports</CardTitle>
              <CardDescription>Générez et consultez vos rapports</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12">
                <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">Système de rapports en développement</p>
                <p className="text-sm text-muted-foreground">Bientôt disponible pour générer des rapports détaillés</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="settings">
          <Card>
            <CardHeader>
              <CardTitle>Paramètres d'Organisation</CardTitle>
              <CardDescription>Configurez votre environnement EmotionsCare</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12">
                <Settings className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">Interface de paramètres en développement</p>
                <p className="text-sm text-muted-foreground">Bientôt disponible pour personnaliser votre organisation</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default B2BAdminDashboardPage;
