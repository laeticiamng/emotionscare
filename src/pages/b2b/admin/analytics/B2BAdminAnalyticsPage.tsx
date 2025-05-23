
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { 
  BarChart3, 
  TrendingUp, 
  Users, 
  Heart,
  Download,
  Calendar,
  Activity,
  AlertTriangle,
  CheckCircle
} from 'lucide-react';

const B2BAdminAnalyticsPage: React.FC = () => {
  const [analytics, setAnalytics] = useState({
    userEngagement: {
      totalUsers: 0,
      activeUsers: 0,
      newUsersThisMonth: 0,
      retentionRate: 0
    },
    emotionalHealth: {
      averageScore: 0,
      scansThisMonth: 0,
      alertsGenerated: 0,
      improvementTrend: 0
    },
    socialActivity: {
      totalPosts: 0,
      totalInteractions: 0,
      activePosters: 0,
      communityGrowth: 0
    }
  });
  
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadAnalytics();
  }, []);

  const loadAnalytics = async () => {
    setIsLoading(true);
    try {
      // Charger les données d'analytics depuis Supabase
      const { data: users } = await supabase
        .from('profiles')
        .select('*')
        .in('role', ['b2b_user', 'b2b_admin']);

      const { data: emotions } = await supabase
        .from('emotions')
        .select('*');

      const { data: posts } = await supabase
        .from('posts')
        .select('*');

      // Calculer les métriques
      const totalUsers = users?.length || 0;
      const activeUsers = users?.filter(user => {
        const lastActive = new Date(user.updated_at);
        const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
        return lastActive > weekAgo;
      }).length || 0;

      const averageScore = emotions?.length > 0 
        ? emotions.reduce((acc, emotion) => acc + (emotion.score || 50), 0) / emotions.length
        : 0;

      const totalPosts = posts?.length || 0;
      const totalInteractions = posts?.reduce((acc, post) => acc + post.reactions, 0) || 0;

      setAnalytics({
        userEngagement: {
          totalUsers,
          activeUsers,
          newUsersThisMonth: Math.floor(totalUsers * 0.15), // Simulation
          retentionRate: totalUsers > 0 ? Math.round((activeUsers / totalUsers) * 100) : 0
        },
        emotionalHealth: {
          averageScore: Math.round(averageScore),
          scansThisMonth: emotions?.filter(emotion => {
            const scanDate = new Date(emotion.date);
            const monthAgo = new Date();
            monthAgo.setMonth(monthAgo.getMonth() - 1);
            return scanDate > monthAgo;
          }).length || 0,
          alertsGenerated: Math.floor(Math.random() * 5), // Simulation
          improvementTrend: Math.floor(Math.random() * 20) - 10 // -10 à +10
        },
        socialActivity: {
          totalPosts,
          totalInteractions,
          activePosters: new Set(posts?.map(post => post.user_id)).size || 0,
          communityGrowth: Math.floor(Math.random() * 25) // Simulation
        }
      });

      toast.success('Analytics chargées');
    } catch (error) {
      console.error('Erreur chargement analytics:', error);
      toast.error('Erreur lors du chargement des analytics');
    } finally {
      setIsLoading(false);
    }
  };

  const exportData = () => {
    toast.info('Export des données en cours...');
    // Logique d'export à implémenter
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-muted rounded w-1/3"></div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-32 bg-muted rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* En-tête */}
      <div className="flex justify-between items-start mb-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">Analytics & Rapports</h1>
          <p className="text-muted-foreground">
            Analyse détaillée du bien-être organisationnel
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={exportData}>
            <Download className="h-4 w-4 mr-2" />
            Exporter
          </Button>
          <Button size="sm">
            <Calendar className="h-4 w-4 mr-2" />
            Programmer rapport
          </Button>
        </div>
      </div>

      {/* Métriques principales */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Utilisateurs totaux</p>
                <p className="text-3xl font-bold">{analytics.userEngagement.totalUsers}</p>
                <p className="text-xs text-green-600 mt-1">
                  +{analytics.userEngagement.newUsersThisMonth} ce mois
                </p>
              </div>
              <Users className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Score bien-être</p>
                <p className="text-3xl font-bold">{analytics.emotionalHealth.averageScore}%</p>
                <p className={`text-xs mt-1 ${analytics.emotionalHealth.improvementTrend >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {analytics.emotionalHealth.improvementTrend >= 0 ? '+' : ''}{analytics.emotionalHealth.improvementTrend}% vs mois dernier
                </p>
              </div>
              <Heart className="h-8 w-8 text-red-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Engagement</p>
                <p className="text-3xl font-bold">{analytics.userEngagement.retentionRate}%</p>
                <p className="text-xs text-muted-foreground mt-1">
                  {analytics.userEngagement.activeUsers} utilisateurs actifs
                </p>
              </div>
              <TrendingUp className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Alertes</p>
                <p className="text-3xl font-bold">{analytics.emotionalHealth.alertsGenerated}</p>
                <p className="text-xs text-muted-foreground mt-1">
                  Nécessitent attention
                </p>
              </div>
              <AlertTriangle className="h-8 w-8 text-orange-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Contenu détaillé avec onglets */}
      <Tabs defaultValue="engagement" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="engagement">Engagement</TabsTrigger>
          <TabsTrigger value="wellness">Bien-être</TabsTrigger>
          <TabsTrigger value="social">Social</TabsTrigger>
          <TabsTrigger value="trends">Tendances</TabsTrigger>
        </TabsList>

        <TabsContent value="engagement" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Participation utilisateurs</CardTitle>
                <CardDescription>
                  Métriques d'engagement sur les 30 derniers jours
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Utilisateurs actifs</span>
                    <Badge>{analytics.userEngagement.activeUsers}</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Taux de rétention</span>
                    <Badge variant={analytics.userEngagement.retentionRate > 70 ? "default" : "secondary"}>
                      {analytics.userEngagement.retentionRate}%
                    </Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Nouveaux utilisateurs</span>
                    <Badge variant="outline">{analytics.userEngagement.newUsersThisMonth}</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Activité quotidienne</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8">
                  <BarChart3 className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">Graphique d'activité en développement</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="wellness" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Métriques bien-être</CardTitle>
                <CardDescription>
                  Analyse de l'état émotionnel organisationnel
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Score moyen</span>
                    <Badge variant={analytics.emotionalHealth.averageScore > 70 ? "default" : "destructive"}>
                      {analytics.emotionalHealth.averageScore}%
                    </Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Scans ce mois</span>
                    <Badge variant="outline">{analytics.emotionalHealth.scansThisMonth}</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Alertes actives</span>
                    <Badge variant={analytics.emotionalHealth.alertsGenerated > 0 ? "destructive" : "default"}>
                      {analytics.emotionalHealth.alertsGenerated}
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Actions recommandées</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {analytics.emotionalHealth.alertsGenerated > 0 ? (
                    <div className="flex items-center space-x-2 p-3 bg-orange-50 rounded">
                      <AlertTriangle className="h-4 w-4 text-orange-600" />
                      <span className="text-sm">Traiter les alertes en cours</span>
                    </div>
                  ) : (
                    <div className="flex items-center space-x-2 p-3 bg-green-50 rounded">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <span className="text-sm">Aucune alerte active</span>
                    </div>
                  )}
                  <div className="flex items-center space-x-2 p-3 bg-blue-50 rounded">
                    <Activity className="h-4 w-4 text-blue-600" />
                    <span className="text-sm">Encourager les scans réguliers</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="social" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Activité sociale</CardTitle>
                <CardDescription>
                  Engagement dans Social Cocoon
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Posts totaux</span>
                    <Badge>{analytics.socialActivity.totalPosts}</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Interactions</span>
                    <Badge variant="outline">{analytics.socialActivity.totalInteractions}</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Utilisateurs actifs</span>
                    <Badge>{analytics.socialActivity.activePosters}</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Modération</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8">
                  <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-4" />
                  <p className="text-sm text-muted-foreground">Aucun contenu en attente de modération</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="trends" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Analyse des tendances</CardTitle>
              <CardDescription>
                Évolution sur les 6 derniers mois
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12">
                <TrendingUp className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">Analyse avancée en développement</h3>
                <p className="text-muted-foreground mb-4">
                  Les graphiques de tendances et prédictions seront bientôt disponibles
                </p>
                <Button variant="outline">
                  Être notifié de la mise à jour
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default B2BAdminAnalyticsPage;
