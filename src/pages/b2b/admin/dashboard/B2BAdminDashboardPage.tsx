
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import SocialCocoonTab from '@/components/dashboard/admin/tabs/SocialCocoonTab';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { 
  Users, 
  TrendingUp, 
  Activity, 
  AlertTriangle,
  BarChart3,
  Shield,
  Settings,
  Download,
  Calendar,
  MessageSquare,
  Heart,
  Building,
  UserCheck,
  Clock
} from 'lucide-react';

interface AdminStats {
  totalUsers: number;
  activeUsers: number;
  emotionScans: number;
  alertsCount: number;
  wellnessAverage: number;
  engagementRate: number;
}

const B2BAdminDashboardPage: React.FC = () => {
  const { user } = useAuth();
  const [adminStats, setAdminStats] = useState<AdminStats>({
    totalUsers: 0,
    activeUsers: 0,
    emotionScans: 0,
    alertsCount: 0,
    wellnessAverage: 0,
    engagementRate: 0
  });
  
  const [isLoading, setIsLoading] = useState(true);
  const [socialCocoonData, setSocialCocoonData] = useState({
    totalPosts: 0,
    moderationRate: 0,
    topHashtags: []
  });

  useEffect(() => {
    const loadAdminDashboard = async () => {
      setIsLoading(true);
      try {
        // Charger les statistiques d'administration
        const { data: profiles, error: profilesError } = await supabase
          .from('profiles')
          .select('*')
          .in('role', ['b2b_user', 'b2b_admin']);

        const { data: emotions, error: emotionsError } = await supabase
          .from('emotions')
          .select('*');

        const { data: posts, error: postsError } = await supabase
          .from('posts')
          .select('*');

        if (profilesError) throw profilesError;

        // Calculer les statistiques
        const totalUsers = profiles?.length || 0;
        const activeUsers = profiles?.filter(p => {
          const lastActive = new Date(p.updated_at);
          const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
          return lastActive > weekAgo;
        }).length || 0;

        const emotionScans = emotions?.length || 0;
        const wellnessAverage = emotions?.reduce((acc, emotion) => acc + (emotion.score || 50), 0) / (emotions?.length || 1);

        setAdminStats({
          totalUsers,
          activeUsers,
          emotionScans,
          alertsCount: Math.floor(Math.random() * 5), // Simulation
          wellnessAverage: Math.round(wellnessAverage),
          engagementRate: totalUsers > 0 ? Math.round((activeUsers / totalUsers) * 100) : 0
        });

        // Données Social Cocoon
        setSocialCocoonData({
          totalPosts: posts?.length || 0,
          moderationRate: Math.floor(Math.random() * 10),
          topHashtags: [
            { tag: '#bienetre', count: 42 },
            { tag: '#entraide', count: 36 },
            { tag: '#motivation', count: 31 },
            { tag: '#equilibre', count: 28 },
            { tag: '#equipe', count: 24 }
          ]
        });

        toast.success('Tableau de bord administrateur chargé');
      } catch (error) {
        console.error('Erreur chargement dashboard admin:', error);
        toast.error('Erreur lors du chargement des données');
      } finally {
        setIsLoading(false);
      }
    };

    loadAdminDashboard();
  }, []);

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-muted rounded w-1/3"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-32 bg-muted rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  const quickActions = [
    {
      icon: Users,
      label: 'Gestion utilisateurs',
      description: 'Gérer les comptes et accès',
      action: () => window.location.href = '/b2b/admin/users'
    },
    {
      icon: BarChart3,
      label: 'Analytics avancées',
      description: 'Rapports détaillés',
      action: () => window.location.href = '/b2b/admin/analytics'
    },
    {
      icon: MessageSquare,
      label: 'Modération contenu',
      description: 'Social Cocoon',
      action: () => window.location.href = '/b2b/admin/social-cocon'
    },
    {
      icon: Settings,
      label: 'Configuration',
      description: 'Paramètres organisation',
      action: () => toast.info('Configuration en cours de développement')
    }
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      {/* En-tête */}
      <div className="flex justify-between items-start mb-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">
            Administration B2B
          </h1>
          <p className="text-muted-foreground">
            Gérez le bien-être de votre organisation
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Exporter données
          </Button>
          <Button size="sm">
            <Calendar className="h-4 w-4 mr-2" />
            Planifier rapport
          </Button>
        </div>
      </div>

      {/* Alertes importantes */}
      {adminStats.alertsCount > 0 && (
        <Card className="mb-8 border-orange-200 bg-orange-50">
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <AlertTriangle className="h-5 w-5 text-orange-600" />
              <div>
                <p className="font-medium text-orange-800">
                  {adminStats.alertsCount} alerte{adminStats.alertsCount > 1 ? 's' : ''} nécessite{adminStats.alertsCount > 1 ? 'nt' : ''} votre attention
                </p>
                <p className="text-sm text-orange-600">
                  Collaborateurs avec indicateurs de bien-être préoccupants
                </p>
              </div>
              <Button variant="outline" size="sm" className="ml-auto">
                Voir les alertes
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Métriques principales */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center">
              <Users className="h-4 w-4 mr-2 text-blue-500" />
              Utilisateurs
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{adminStats.totalUsers}</div>
            <div className="flex items-center mt-2">
              <Badge variant="secondary" className="text-xs">
                {adminStats.activeUsers} actifs
              </Badge>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center">
              <Heart className="h-4 w-4 mr-2 text-red-500" />
              Bien-être moyen
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{adminStats.wellnessAverage}%</div>
            <Progress value={adminStats.wellnessAverage} className="mt-2" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center">
              <Activity className="h-4 w-4 mr-2 text-green-500" />
              Engagement
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{adminStats.engagementRate}%</div>
            <p className="text-xs text-muted-foreground">Participation active</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center">
              <TrendingUp className="h-4 w-4 mr-2 text-purple-500" />
              Scans émotionnels
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{adminStats.emotionScans}</div>
            <p className="text-xs text-muted-foreground">Ce mois-ci</p>
          </CardContent>
        </Card>
      </div>

      {/* Actions rapides */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Actions rapides</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {quickActions.map((action, index) => (
            <Card key={index} className="cursor-pointer hover:shadow-md transition-shadow">
              <CardContent className="p-4" onClick={action.action}>
                <div className="flex items-center space-x-3">
                  <div className="p-2 rounded bg-primary/10">
                    <action.icon className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-medium text-sm">{action.label}</h3>
                    <p className="text-xs text-muted-foreground">{action.description}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Contenu principal avec onglets */}
      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList>
          <TabsTrigger value="overview">Vue d'ensemble</TabsTrigger>
          <TabsTrigger value="users">Utilisateurs</TabsTrigger>
          <TabsTrigger value="social">Social Cocoon</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Tendances récentes</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Nouvelles inscriptions</span>
                    <Badge>+{Math.floor(Math.random() * 10) + 1} cette semaine</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Taux de participation</span>
                    <Badge variant="secondary">{adminStats.engagementRate}%</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Score bien-être général</span>
                    <Badge variant={adminStats.wellnessAverage > 70 ? "default" : "destructive"}>
                      {adminStats.wellnessAverage}%
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Actions requises</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {adminStats.alertsCount > 0 && (
                    <div className="flex items-center justify-between p-3 bg-orange-50 rounded">
                      <div className="flex items-center space-x-2">
                        <AlertTriangle className="h-4 w-4 text-orange-600" />
                        <span className="text-sm">Alertes bien-être</span>
                      </div>
                      <Badge variant="destructive">{adminStats.alertsCount}</Badge>
                    </div>
                  )}
                  <div className="flex items-center justify-between p-3 bg-blue-50 rounded">
                    <div className="flex items-center space-x-2">
                      <Clock className="h-4 w-4 text-blue-600" />
                      <span className="text-sm">Rapports à valider</span>
                    </div>
                    <Badge>2</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="users">
          <Card>
            <CardHeader>
              <CardTitle>Gestion des utilisateurs</CardTitle>
              <CardDescription>
                Administrez les comptes et droits d'accès de votre organisation
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground mb-4">Interface de gestion des utilisateurs</p>
                <Button onClick={() => window.location.href = '/b2b/admin/users'}>
                  Accéder à la gestion
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="social">
          <SocialCocoonTab socialCocoonData={socialCocoonData} />
        </TabsContent>

        <TabsContent value="analytics">
          <Card>
            <CardHeader>
              <CardTitle>Analyses avancées</CardTitle>
              <CardDescription>
                Rapports détaillés sur l'utilisation et le bien-être
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <BarChart3 className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground mb-4">Module d'analytics en développement</p>
                <Button onClick={() => window.location.href = '/b2b/admin/analytics'}>
                  Voir les analyses
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default B2BAdminDashboardPage;
