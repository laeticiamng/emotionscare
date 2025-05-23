
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useEmotionalGamification } from '@/hooks/useEmotionalGamification';
import { useDashboardState } from '@/hooks/useDashboardState';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { 
  Heart, 
  TrendingUp, 
  Users, 
  Calendar, 
  Target, 
  Award,
  Activity,
  BookOpen,
  MessageCircle,
  Settings,
  BarChart3,
  ChevronRight,
  Plus
} from 'lucide-react';

interface DashboardStats {
  emotionScans: number;
  teamConnections: number;
  completedSessions: number;
  wellnessScore: number;
  streak: number;
  nextGoal: string;
}

const B2BUserDashboardPage: React.FC = () => {
  const { user } = useAuth();
  const { stats, isLoading: gamificationLoading } = useEmotionalGamification();
  const { minimalView, toggleMinimalView } = useDashboardState();
  
  const [dashboardStats, setDashboardStats] = useState<DashboardStats>({
    emotionScans: 0,
    teamConnections: 0,
    completedSessions: 0,
    wellnessScore: 75,
    streak: 0,
    nextGoal: 'Compléter 5 scans émotionnels'
  });
  
  const [isLoading, setIsLoading] = useState(true);
  const [recentActivities, setRecentActivities] = useState([]);

  useEffect(() => {
    const loadDashboardData = async () => {
      if (!user) return;
      
      setIsLoading(true);
      try {
        // Charger les statistiques utilisateur
        const { data: emotions } = await supabase
          .from('emotions')
          .select('*')
          .eq('user_id', user.id)
          .order('date', { ascending: false });

        const { data: buddies } = await supabase
          .from('buddies')
          .select('*')
          .eq('user_id', user.id);

        setDashboardStats(prev => ({
          ...prev,
          emotionScans: emotions?.length || 0,
          teamConnections: buddies?.length || 0,
          streak: stats.streakDays,
          completedSessions: Math.floor(Math.random() * 20) + 5, // Simulation pour l'exemple
        }));

        toast.success('Tableau de bord chargé');
      } catch (error) {
        console.error('Erreur chargement dashboard:', error);
        toast.error('Erreur lors du chargement des données');
      } finally {
        setIsLoading(false);
      }
    };

    loadDashboardData();
  }, [user, stats]);

  const quickActions = [
    {
      icon: Heart,
      label: 'Scanner mes émotions',
      description: 'Analyser mon état émotionnel actuel',
      action: () => window.location.href = '/b2b/user/scan',
      color: 'bg-red-500'
    },
    {
      icon: Users,
      label: 'Espace social',
      description: 'Rejoindre la communauté',
      action: () => window.location.href = '/b2b/user/social',
      color: 'bg-blue-500'
    },
    {
      icon: BookOpen,
      label: 'Ressources',
      description: 'Accéder aux contenus bien-être',
      action: () => toast.info('Redirection vers les ressources'),
      color: 'bg-green-500'
    },
    {
      icon: Target,
      label: 'Mes objectifs',
      description: 'Définir et suivre mes objectifs',
      action: () => toast.info('Gestion des objectifs'),
      color: 'bg-purple-500'
    }
  ];

  if (isLoading || gamificationLoading) {
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

  return (
    <div className="container mx-auto px-4 py-8">
      {/* En-tête */}
      <div className="flex justify-between items-start mb-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">
            Bonjour {user?.user_metadata?.name || 'Collaborateur'} 👋
          </h1>
          <p className="text-muted-foreground">
            Votre espace bien-être professionnel
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={toggleMinimalView}>
            {minimalView ? 'Vue complète' : 'Vue simplifiée'}
          </Button>
          <Button size="sm">
            <Settings className="h-4 w-4 mr-2" />
            Paramètres
          </Button>
        </div>
      </div>

      {/* Statistiques principales */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center">
              <Heart className="h-4 w-4 mr-2 text-red-500" />
              Scans émotionnels
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{dashboardStats.emotionScans}</div>
            <p className="text-xs text-muted-foreground">Ce mois-ci</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center">
              <TrendingUp className="h-4 w-4 mr-2 text-green-500" />
              Score bien-être
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{dashboardStats.wellnessScore}%</div>
            <Progress value={dashboardStats.wellnessScore} className="mt-2" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center">
              <Users className="h-4 w-4 mr-2 text-blue-500" />
              Connexions équipe
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{dashboardStats.teamConnections}</div>
            <p className="text-xs text-muted-foreground">Collègues connectés</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center">
              <Award className="h-4 w-4 mr-2 text-purple-500" />
              Série actuelle
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{dashboardStats.streak}</div>
            <p className="text-xs text-muted-foreground">Jours consécutifs</p>
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
                <div className="flex items-start space-x-3">
                  <div className={`p-2 rounded ${action.color} text-white`}>
                    <action.icon className="h-5 w-5" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-medium text-sm">{action.label}</h3>
                    <p className="text-xs text-muted-foreground mt-1">{action.description}</p>
                  </div>
                  <ChevronRight className="h-4 w-4 text-muted-foreground" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Contenu principal */}
      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList>
          <TabsTrigger value="overview">Vue d'ensemble</TabsTrigger>
          <TabsTrigger value="emotions">Émotions</TabsTrigger>
          <TabsTrigger value="team">Équipe</TabsTrigger>
          <TabsTrigger value="goals">Objectifs</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Progression personnelle */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Target className="h-5 w-5 mr-2" />
                  Ma progression
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium">Objectif en cours</span>
                    <Badge variant="outline">En cours</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground mb-2">{dashboardStats.nextGoal}</p>
                  <Progress value={60} />
                  <p className="text-xs text-muted-foreground mt-1">3/5 complétés</p>
                </div>
                
                <div className="pt-4 border-t">
                  <Button variant="outline" size="sm" className="w-full">
                    <Plus className="h-4 w-4 mr-2" />
                    Définir un nouvel objectif
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Activité récente */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Activity className="h-5 w-5 mr-2" />
                  Activité récente
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center space-x-3 text-sm">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span>Scan émotionnel complété</span>
                    <span className="text-muted-foreground text-xs ml-auto">Il y a 2h</span>
                  </div>
                  <div className="flex items-center space-x-3 text-sm">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <span>Connexion avec un collègue</span>
                    <span className="text-muted-foreground text-xs ml-auto">Hier</span>
                  </div>
                  <div className="flex items-center space-x-3 text-sm">
                    <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                    <span>Objectif atteint: 7 jours consécutifs</span>
                    <span className="text-muted-foreground text-xs ml-auto">Il y a 3j</span>
                  </div>
                </div>
                
                <Button variant="ghost" size="sm" className="w-full mt-4">
                  Voir toute l'activité
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="emotions">
          <Card>
            <CardHeader>
              <CardTitle>Analyse émotionnelle</CardTitle>
              <CardDescription>
                Suivez l'évolution de votre bien-être émotionnel
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <Heart className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground mb-4">Aucune donnée émotionnelle récente</p>
                <Button onClick={() => window.location.href = '/b2b/user/scan'}>
                  Commencer un scan
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="team">
          <Card>
            <CardHeader>
              <CardTitle>Votre équipe</CardTitle>
              <CardDescription>
                Connectez-vous avec vos collègues pour un soutien mutuel
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground mb-4">Aucune connexion d'équipe pour le moment</p>
                <Button onClick={() => window.location.href = '/b2b/user/social'}>
                  Rejoindre l'espace social
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="goals">
          <Card>
            <CardHeader>
              <CardTitle>Mes objectifs bien-être</CardTitle>
              <CardDescription>
                Définissez et suivez vos objectifs de développement personnel
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <Target className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground mb-4">Définissez votre premier objectif</p>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Créer un objectif
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default B2BUserDashboardPage;
