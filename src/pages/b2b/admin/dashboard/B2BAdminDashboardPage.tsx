
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
  BarChart3,
  Building,
  Calendar,
  Target,
  PieChart,
  UserCheck,
  Clock,
  Activity
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import LoadingAnimation from '@/components/ui/loading-animation';

interface AdminStats {
  totalUsers: number;
  activeUsers: number;
  averageWellbeing: number;
  alertsCount: number;
  departmentScores: Array<{
    name: string;
    score: number;
    trend: 'up' | 'down' | 'stable';
  }>;
  weeklyEngagement: number;
  criticalAlerts: number;
}

const B2BAdminDashboardPage: React.FC = () => {
  const { user } = useAuth();
  const { toast } = useToast();
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

      // Charger les données d'administration
      const { data: profiles } = await supabase
        .from('profiles')
        .select('*')
        .eq('role', 'b2b_user');

      const { data: emotions } = await supabase
        .from('emotions')
        .select('*')
        .order('date', { ascending: false })
        .limit(100);

      // Calculer les statistiques administrateur
      const totalUsers = profiles?.length || 0;
      const activeUsers = profiles?.filter(p => 
        new Date(p.updated_at) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
      ).length || 0;

      const avgWellbeing = emotions?.length > 0 
        ? emotions.reduce((sum, e) => sum + (e.score || 0), 0) / emotions.length 
        : 0;

      const weeklyEmotions = emotions?.filter(e => 
        new Date(e.date) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
      ) || [];

      const criticalEmotions = emotions?.filter(e => (e.score || 0) < 30).length || 0;

      // Simuler des scores par département
      const departmentScores = [
        { name: 'IT', score: 78, trend: 'up' as const },
        { name: 'Marketing', score: 72, trend: 'stable' as const },
        { name: 'RH', score: 85, trend: 'up' as const },
        { name: 'Finance', score: 65, trend: 'down' as const },
        { name: 'Commercial', score: 70, trend: 'stable' as const }
      ];

      setStats({
        totalUsers,
        activeUsers,
        averageWellbeing: Math.round(avgWellbeing),
        alertsCount: criticalEmotions,
        departmentScores,
        weeklyEngagement: Math.round((weeklyEmotions.length / totalUsers) * 100),
        criticalAlerts: Math.floor(criticalEmotions / 3)
      });

    } catch (error) {
      console.error('Admin dashboard data loading error:', error);
      toast({
        title: "Erreur",
        description: "Impossible de charger les données administrateur",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
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
      default: return <Activity className="h-4 w-4 text-gray-500" />;
    }
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Admin Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Shield className="h-8 w-8 text-primary" />
            Tableau de Bord Administrateur
          </h1>
          <p className="text-muted-foreground">
            Supervision du bien-être organisationnel - {user?.name || 'Administrateur'}
          </p>
        </div>
        <div className="flex items-center gap-2">
          {stats && stats.criticalAlerts > 0 && (
            <Badge className="bg-red-100 text-red-800 flex items-center gap-1">
              <AlertTriangle className="h-3 w-3" />
              {stats.criticalAlerts} Alertes
            </Badge>
          )}
        </div>
      </div>

      {/* Admin Quick Stats */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Utilisateurs Totaux</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalUsers}</div>
              <p className="text-xs text-muted-foreground">collaborateurs inscrits</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Utilisateurs Actifs</CardTitle>
              <UserCheck className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.activeUsers}</div>
              <p className="text-xs text-muted-foreground">cette semaine</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Bien-être Moyen</CardTitle>
              <BarChart3 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.averageWellbeing}/100</div>
              <Progress value={stats.averageWellbeing} className="mt-2" />
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Engagement</CardTitle>
              <Activity className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.weeklyEngagement}%</div>
              <p className="text-xs text-muted-foreground">participation hebdo</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Alertes</CardTitle>
              <AlertTriangle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">{stats.alertsCount}</div>
              <p className="text-xs text-muted-foreground">nécessitent attention</p>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Admin Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="overview">Vue d'ensemble</TabsTrigger>
          <TabsTrigger value="departments">Départements</TabsTrigger>
          <TabsTrigger value="analytics">Analytique</TabsTrigger>
          <TabsTrigger value="alerts">Alertes</TabsTrigger>
          <TabsTrigger value="settings">Paramètres</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Department Performance */}
            <Card>
              <CardHeader>
                <CardTitle>Performance par Département</CardTitle>
                <CardDescription>Scores de bien-être et tendances</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {stats?.departmentScores.map((dept) => (
                    <div key={dept.name} className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Building className="h-4 w-4 text-muted-foreground" />
                        <span className="font-medium">{dept.name}</span>
                        {getTrendIcon(dept.trend)}
                      </div>
                      <div className="flex items-center gap-2">
                        <Progress value={dept.score} className="w-20" />
                        <span className="text-sm font-medium">{dept.score}%</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Recent Alerts */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5 text-red-500" />
                  Alertes Récentes
                </CardTitle>
                <CardDescription>Situations nécess itant une attention</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-red-50 border border-red-200 rounded-lg">
                    <div>
                      <p className="font-medium text-red-800">Score faible détecté</p>
                      <p className="text-sm text-red-600">Département Finance - Score 28/100</p>
                    </div>
                    <Badge className="bg-red-100 text-red-800">Critique</Badge>
                  </div>
                  
                  <div className="flex items-center justify-between p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                    <div>
                      <p className="font-medium text-yellow-800">Baisse d'engagement</p>
                      <p className="text-sm text-yellow-600">Équipe Marketing - Participation -15%</p>
                    </div>
                    <Badge className="bg-yellow-100 text-yellow-800">Attention</Badge>
                  </div>
                  
                  <div className="flex items-center justify-between p-3 bg-orange-50 border border-orange-200 rounded-lg">
                    <div>
                      <p className="font-medium text-orange-800">Stress élevé</p>
                      <p className="text-sm text-orange-600">Période de surcharge détectée</p>
                    </div>
                    <Badge className="bg-orange-100 text-orange-800">Modéré</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Management Actions */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5" />
                Actions de Gestion
              </CardTitle>
              <CardDescription>Initiatives pour améliorer le bien-être organisationnel</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Button 
                  className="h-auto p-6 flex flex-col gap-3"
                  onClick={() => setActiveTab('analytics')}
                >
                  <PieChart className="h-8 w-8" />
                  <span>Générer Rapport</span>
                  <span className="text-xs opacity-75">Analyse complète</span>
                </Button>
                
                <Button 
                  variant="outline"
                  className="h-auto p-6 flex flex-col gap-3"
                  onClick={() => setActiveTab('departments')}
                >
                  <Building className="h-8 w-8" />
                  <span>Gérer Équipes</span>
                  <span className="text-xs opacity-75">Configuration département</span>
                </Button>
                
                <Button 
                  variant="outline"
                  className="h-auto p-6 flex flex-col gap-3"
                  onClick={() => setActiveTab('alerts')}
                >
                  <AlertTriangle className="h-8 w-8" />
                  <span>Gérer Alertes</span>
                  <span className="text-xs opacity-75">Paramètres notification</span>
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="departments" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Gestion des Départements</CardTitle>
              <CardDescription>Vue détaillée et configuration des équipes</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {stats?.departmentScores.map((dept) => (
                  <Card key={dept.name} className="p-4">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="font-semibold flex items-center gap-2">
                        <Building className="h-5 w-5" />
                        {dept.name}
                      </h3>
                      <div className="flex items-center gap-2">
                        {getTrendIcon(dept.trend)}
                        <span className="font-bold">{dept.score}/100</span>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                      <div>
                        <span className="text-muted-foreground">Collaborateurs:</span>
                        <span className="ml-2 font-medium">
                          {Math.floor(Math.random() * 20) + 5}
                        </span>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Participation:</span>
                        <span className="ml-2 font-medium">
                          {Math.floor(Math.random() * 30) + 60}%
                        </span>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Dernière activité:</span>
                        <span className="ml-2 font-medium">Aujourd'hui</span>
                      </div>
                    </div>
                    
                    <Progress value={dept.score} className="mt-4" />
                  </Card>
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
                Analytique Avancée
              </CardTitle>
              <CardDescription>Métriques détaillées et insights</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h4 className="font-medium">Métriques Clés</h4>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-sm">Taux de satisfaction global</span>
                      <span className="font-medium">78%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Stress moyen</span>
                      <span className="font-medium">32%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Engagement hebdomadaire</span>
                      <span className="font-medium">{stats?.weeklyEngagement}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Temps moyen par session</span>
                      <span className="font-medium">8 min</span>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <h4 className="font-medium">Tendances</h4>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-sm">Evolution mensuelle</span>
                      <span className="font-medium text-green-600">+12%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Adoption nouveaux outils</span>
                      <span className="font-medium text-blue-600">85%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Rétention utilisateurs</span>
                      <span className="font-medium text-green-600">94%</span>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="mt-6 pt-6 border-t">
                <Button className="w-full md:w-auto">
                  Exporter Rapport Complet
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="alerts" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-red-500" />
                Gestion des Alertes
              </CardTitle>
              <CardDescription>Configuration et suivi des notifications critiques</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Card className="p-4 border-red-200">
                    <h4 className="font-medium text-red-800 mb-2">Alertes Critiques</h4>
                    <p className="text-sm text-muted-foreground mb-3">
                      Score inférieur à 30/100 ou signalement direct
                    </p>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Seuil actuel:</span>
                      <Badge className="bg-red-100 text-red-800">30</Badge>
                    </div>
                  </Card>
                  
                  <Card className="p-4 border-yellow-200">
                    <h4 className="font-medium text-yellow-800 mb-2">Alertes Modérées</h4>
                    <p className="text-sm text-muted-foreground mb-3">
                      Baisse significative ou tendance négative
                    </p>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Seuil actuel:</span>
                      <Badge className="bg-yellow-100 text-yellow-800">50</Badge>
                    </div>
                  </Card>
                </div>
                
                <div className="space-y-3">
                  <h4 className="font-medium">Notifications</h4>
                  <div className="space-y-2">
                    <label className="flex items-center space-x-2">
                      <input type="checkbox" defaultChecked className="rounded" />
                      <span className="text-sm">Email immédiat pour alertes critiques</span>
                    </label>
                    <label className="flex items-center space-x-2">
                      <input type="checkbox" defaultChecked className="rounded" />
                      <span className="text-sm">Rapport hebdomadaire automatique</span>
                    </label>
                    <label className="flex items-center space-x-2">
                      <input type="checkbox" className="rounded" />
                      <span className="text-sm">SMS pour urgences</span>
                    </label>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="settings" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Paramètres Organisationnels</CardTitle>
              <CardDescription>Configuration de l'environnement EmotionsCare</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div>
                  <h4 className="font-medium mb-3">Accès et Permissions</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Button variant="outline" className="h-auto p-4 flex flex-col gap-2">
                      <Users className="h-6 w-6" />
                      Gérer les Utilisateurs
                    </Button>
                    <Button variant="outline" className="h-auto p-4 flex flex-col gap-2">
                      <Shield className="h-6 w-6" />
                      Permissions Département
                    </Button>
                  </div>
                </div>
                
                <div>
                  <h4 className="font-medium mb-3">Configuration Système</h4>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Période de rétention des données</span>
                      <Badge variant="outline">12 mois</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Fréquence des rappels</span>
                      <Badge variant="outline">Hebdomadaire</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Niveau de confidentialité</span>
                      <Badge variant="outline">Anonymisé</Badge>
                    </div>
                  </div>
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
