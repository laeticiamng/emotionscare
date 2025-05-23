
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useEmotionalGamification } from '@/hooks/useEmotionalGamification';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { 
  Heart, 
  TrendingUp, 
  Calendar, 
  BookOpen, 
  Users, 
  Target,
  Plus,
  Activity,
  Smile,
  MessageCircle,
  BarChart3,
  ChevronRight
} from 'lucide-react';

interface DashboardStats {
  emotionScans: number;
  journalEntries: number;
  socialPosts: number;
  wellnessScore: number;
  streak: number;
  nextGoal: string;
}

const B2CDashboardPage: React.FC = () => {
  const { user } = useAuth();
  const { stats: gamificationStats, isLoading: gamificationLoading } = useEmotionalGamification();
  
  const [dashboardStats, setDashboardStats] = useState<DashboardStats>({
    emotionScans: 0,
    journalEntries: 0,
    socialPosts: 0,
    wellnessScore: 75,
    streak: 0,
    nextGoal: 'Compléter 3 scans émotionnels cette semaine'
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

        const { data: journalEntries } = await supabase
          .from('journal_entries')
          .select('*')
          .eq('user_id', user.id);

        const { data: posts } = await supabase
          .from('posts')
          .select('*')
          .eq('user_id', user.id);

        const averageScore = emotions?.length > 0 
          ? Math.round(emotions.reduce((acc, emotion) => acc + (emotion.score || 50), 0) / emotions.length)
          : 50;

        setDashboardStats(prev => ({
          ...prev,
          emotionScans: emotions?.length || 0,
          journalEntries: journalEntries?.length || 0,
          socialPosts: posts?.length || 0,
          wellnessScore: averageScore,
          streak: gamificationStats.streakDays || 0,
        }));

        // Simuler des activités récentes
        setRecentActivities([
          { type: 'emotion', text: 'Scan émotionnel complété', time: '2h', icon: Heart },
          { type: 'social', text: 'Nouveau post partagé', time: '1j', icon: MessageCircle },
          { type: 'goal', text: 'Objectif hebdomadaire atteint', time: '3j', icon: Target }
        ]);

        toast.success('Tableau de bord chargé');
      } catch (error) {
        console.error('Erreur chargement dashboard:', error);
        toast.error('Erreur lors du chargement des données');
      } finally {
        setIsLoading(false);
      }
    };

    loadDashboardData();
  }, [user, gamificationStats]);

  const quickActions = [
    {
      icon: Heart,
      label: 'Scanner mes émotions',
      description: 'Analyser mon état émotionnel',
      action: () => window.location.href = '/b2c/scan',
      color: 'bg-red-500'
    },
    {
      icon: BookOpen,
      label: 'Journal personnel',
      description: 'Écrire une entrée',
      action: () => toast.info('Redirection vers le journal'),
      color: 'bg-blue-500'
    },
    {
      icon: Users,
      label: 'Social Cocoon',
      description: 'Rejoindre la communauté',
      action: () => window.location.href = '/b2c/social',
      color: 'bg-green-500'
    },
    {
      icon: Target,
      label: 'Mes objectifs',
      description: 'Suivre mes progrès',
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
      {/* En-tête personnalisé */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">
          Bonjour {user?.user_metadata?.name || 'Utilisateur'} 👋
        </h1>
        <p className="text-muted-foreground">
          Voici votre espace personnel de bien-être émotionnel
        </p>
      </div>

      {/* Statistiques principales */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center">
              <Heart className="h-4 w-4 mr-2 text-red-500" />
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
              <Smile className="h-4 w-4 mr-2 text-blue-500" />
              Scans émotionnels
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{dashboardStats.emotionScans}</div>
            <p className="text-xs text-muted-foreground">Total effectués</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center">
              <Activity className="h-4 w-4 mr-2 text-green-500" />
              Série actuelle
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{dashboardStats.streak}</div>
            <p className="text-xs text-muted-foreground">Jours consécutifs</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center">
              <MessageCircle className="h-4 w-4 mr-2 text-purple-500" />
              Social Cocoon
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{dashboardStats.socialPosts}</div>
            <p className="text-xs text-muted-foreground">Posts partagés</p>
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
          <TabsTrigger value="progress">Progrès</TabsTrigger>
          <TabsTrigger value="community">Communauté</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Progression personnelle */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Target className="h-5 w-5 mr-2" />
                  Objectif actuel
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium">En cours</span>
                    <Badge variant="outline">Hebdomadaire</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground mb-2">{dashboardStats.nextGoal}</p>
                  <Progress value={70} />
                  <p className="text-xs text-muted-foreground mt-1">2/3 complétés</p>
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
                  {recentActivities.map((activity: any, index) => (
                    <div key={index} className="flex items-center space-x-3 text-sm">
                      <div className="w-2 h-2 bg-primary rounded-full"></div>
                      <span>{activity.text}</span>
                      <span className="text-muted-foreground text-xs ml-auto">Il y a {activity.time}</span>
                    </div>
                  ))}
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
                <p className="text-muted-foreground mb-4">
                  {dashboardStats.emotionScans === 0 
                    ? "Commencez votre premier scan émotionnel"
                    : "Consultez vos analyses détaillées"
                  }
                </p>
                <Button onClick={() => window.location.href = '/b2c/scan'}>
                  {dashboardStats.emotionScans === 0 ? "Premier scan" : "Voir les analyses"}
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="progress">
          <Card>
            <CardHeader>
              <CardTitle>Mes progrès</CardTitle>
              <CardDescription>
                Suivez votre évolution et vos accomplissements
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div>
                  <h4 className="font-medium mb-3">Badges obtenus</h4>
                  <div className="flex flex-wrap gap-2">
                    {gamificationStats.badges_earned.length > 0 ? (
                      gamificationStats.badges_earned.map((badge, index) => (
                        <Badge key={index} variant="outline">
                          {badge}
                        </Badge>
                      ))
                    ) : (
                      <p className="text-sm text-muted-foreground">
                        Continuez vos activités pour débloquer vos premiers badges !
                      </p>
                    )}
                  </div>
                </div>

                <div>
                  <h4 className="font-medium mb-3">Statistiques</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-4 border rounded">
                      <p className="text-2xl font-bold">{gamificationStats.points}</p>
                      <p className="text-sm text-muted-foreground">Points totaux</p>
                    </div>
                    <div className="text-center p-4 border rounded">
                      <p className="text-2xl font-bold">Niveau {gamificationStats.level}</p>
                      <p className="text-sm text-muted-foreground">Niveau actuel</p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="community">
          <Card>
            <CardHeader>
              <CardTitle>Communauté Social Cocoon</CardTitle>
              <CardDescription>
                Connectez-vous avec d'autres utilisateurs pour partager et vous soutenir
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground mb-4">
                  {dashboardStats.socialPosts === 0 
                    ? "Rejoignez la communauté et partagez votre première expérience"
                    : "Continuez à participer à la communauté bienveillante"
                  }
                </p>
                <Button onClick={() => window.location.href = '/b2c/social'}>
                  {dashboardStats.socialPosts === 0 ? "Découvrir la communauté" : "Voir mes posts"}
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default B2CDashboardPage;
