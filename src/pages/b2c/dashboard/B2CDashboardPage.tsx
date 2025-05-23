
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Heart, 
  TrendingUp, 
  Calendar, 
  Target, 
  Brain,
  Music,
  MessageCircle,
  Camera,
  Award,
  Smile,
  Frown,
  Meh
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import LoadingAnimation from '@/components/ui/loading-animation';

interface DashboardStats {
  emotionalScore: number;
  weeklyProgress: number;
  streakDays: number;
  totalScans: number;
  lastScanDate: string;
  mood: 'positive' | 'neutral' | 'negative';
}

interface RecentActivity {
  id: string;
  type: 'scan' | 'chat' | 'music' | 'journal';
  title: string;
  timestamp: Date;
  score?: number;
}

const B2CDashboardPage: React.FC = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [recentActivities, setRecentActivities] = useState<RecentActivity[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    if (user) {
      loadDashboardData();
    }
  }, [user]);

  const loadDashboardData = async () => {
    if (!user) return;
    
    try {
      setIsLoading(true);

      // Simuler le chargement des données
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Données simulées pour la démo
      const mockStats: DashboardStats = {
        emotionalScore: Math.floor(Math.random() * 40) + 60,
        weeklyProgress: Math.floor(Math.random() * 20) + 5,
        streakDays: Math.floor(Math.random() * 10) + 1,
        totalScans: Math.floor(Math.random() * 50) + 10,
        lastScanDate: new Date().toISOString(),
        mood: 'positive'
      };

      setStats(mockStats);

      // Activités récentes simulées
      const mockActivities: RecentActivity[] = [
        {
          id: '1',
          type: 'scan',
          title: 'Scan émotionnel matinal',
          timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
          score: 75
        },
        {
          id: '2',
          type: 'music',
          title: 'Session de relaxation',
          timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000)
        },
        {
          id: '3',
          type: 'chat',
          title: 'Conversation avec le coach IA',
          timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000)
        }
      ];

      setRecentActivities(mockActivities);

    } catch (error) {
      console.error('Dashboard data loading error:', error);
      toast({
        title: "Erreur",
        description: "Impossible de charger les données du tableau de bord",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <LoadingAnimation text="Chargement de votre tableau de bord..." />
      </div>
    );
  }

  const getMoodIcon = (mood: string) => {
    switch (mood) {
      case 'positive': return <Smile className="h-5 w-5 text-green-500" />;
      case 'negative': return <Frown className="h-5 w-5 text-red-500" />;
      default: return <Meh className="h-5 w-5 text-yellow-500" />;
    }
  };

  const getMoodColor = (mood: string) => {
    switch (mood) {
      case 'positive': return 'text-green-600 bg-green-50';
      case 'negative': return 'text-red-600 bg-red-50';
      default: return 'text-yellow-600 bg-yellow-50';
    }
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Welcome Section */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">
            Bonjour {user?.name || 'Utilisateur'} !
          </h1>
          <p className="text-muted-foreground">
            Voici un aperçu de votre bien-être émotionnel
          </p>
        </div>
        <div className="flex items-center gap-2">
          {stats && getMoodIcon(stats.mood)}
          <span className={`px-3 py-1 rounded-full text-sm font-medium ${getMoodColor(stats?.mood || 'neutral')}`}>
            Humeur {stats?.mood === 'positive' ? 'positive' : stats?.mood === 'negative' ? 'difficile' : 'neutre'}
          </span>
        </div>
      </div>

      {/* Quick Stats */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Score Émotionnel</CardTitle>
              <Heart className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.emotionalScore}/100</div>
              <Progress value={stats.emotionalScore} className="mt-2" />
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Progression</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">+{stats.weeklyProgress}%</div>
              <p className="text-xs text-muted-foreground">Cette semaine</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Série</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.streakDays}</div>
              <p className="text-xs text-muted-foreground">jours consécutifs</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Scans</CardTitle>
              <Brain className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalScans}</div>
              <p className="text-xs text-muted-foreground">analyses réalisées</p>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Main Content */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="overview">Aperçu</TabsTrigger>
          <TabsTrigger value="scan">Scanner IA</TabsTrigger>
          <TabsTrigger value="coach">Coach IA</TabsTrigger>
          <TabsTrigger value="music">Musique</TabsTrigger>
          <TabsTrigger value="goals">Objectifs</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Recent Activities */}
            <Card>
              <CardHeader>
                <CardTitle>Activités Récentes</CardTitle>
                <CardDescription>Vos dernières interactions avec EmotionsCare</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentActivities.length > 0 ? (
                    recentActivities.map((activity) => (
                      <div key={activity.id} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                            {activity.type === 'scan' && <Brain className="h-4 w-4 text-primary" />}
                            {activity.type === 'chat' && <MessageCircle className="h-4 w-4 text-primary" />}
                            {activity.type === 'music' && <Music className="h-4 w-4 text-primary" />}
                          </div>
                          <div>
                            <p className="font-medium">{activity.title}</p>
                            <p className="text-sm text-muted-foreground">
                              {activity.timestamp.toLocaleDateString()} à {activity.timestamp.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                            </p>
                          </div>
                        </div>
                        {activity.score && (
                          <Badge variant="outline">
                            Score: {activity.score}
                          </Badge>
                        )}
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-8">
                      <Camera className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                      <p className="text-muted-foreground">Aucune activité récente</p>
                      <p className="text-sm text-muted-foreground">Commencez par faire un scan émotionnel</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Actions Rapides</CardTitle>
                <CardDescription>Accédez rapidement à vos outils favoris</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  <Button 
                    variant="outline" 
                    className="h-20 flex flex-col gap-2"
                    onClick={() => setActiveTab('scan')}
                  >
                    <Brain className="h-6 w-6" />
                    Scan Émotionnel
                  </Button>
                  
                  <Button 
                    variant="outline" 
                    className="h-20 flex flex-col gap-2"
                    onClick={() => setActiveTab('coach')}
                  >
                    <MessageCircle className="h-6 w-6" />
                    Coach IA
                  </Button>
                  
                  <Button 
                    variant="outline" 
                    className="h-20 flex flex-col gap-2"
                    onClick={() => setActiveTab('music')}
                  >
                    <Music className="h-6 w-6" />
                    Musique Thérapie
                  </Button>
                  
                  <Button 
                    variant="outline" 
                    className="h-20 flex flex-col gap-2"
                    onClick={() => setActiveTab('goals')}
                  >
                    <Target className="h-6 w-6" />
                    Mes Objectifs
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="scan">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Brain className="h-5 w-5" />
                Scanner Émotionnel IA
              </CardTitle>
              <CardDescription>Analysez votre état émotionnel actuel</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12">
                <Brain className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">Scanner Émotionnel</h3>
                <p className="text-muted-foreground mb-6">
                  Utilisez notre IA avancée pour analyser votre état émotionnel
                </p>
                <Button>
                  Commencer le scan
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="coach">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageCircle className="h-5 w-5" />
                Coach IA Personnel
              </CardTitle>
              <CardDescription>Obtenez des conseils personnalisés pour votre bien-être</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12">
                <MessageCircle className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">Coach IA</h3>
                <p className="text-muted-foreground mb-6">
                  Discutez avec votre coach personnel pour améliorer votre bien-être
                </p>
                <Button>
                  Démarrer une conversation
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="music">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Music className="h-5 w-5" />
                Musique Thérapie
              </CardTitle>
              <CardDescription>Musique adaptée à votre état émotionnel</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12">
                <Music className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">Musique Thérapie</h3>
                <p className="text-muted-foreground mb-6">
                  Découvrez des playlists personnalisées pour votre bien-être
                </p>
                <Button>
                  Explorer la musique
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="goals" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5" />
                Mes Objectifs de Bien-être
              </CardTitle>
              <CardDescription>Suivez vos progrès vers un meilleur équilibre émotionnel</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">Réduire le stress quotidien</h4>
                      <p className="text-sm text-muted-foreground">Objectif: Score de stress {"<"} 30</p>
                    </div>
                    <Badge className="bg-yellow-100 text-yellow-800">En cours</Badge>
                  </div>
                  <Progress value={65} className="w-full" />
                  <p className="text-sm text-muted-foreground">65% accompli</p>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">Améliorer mon humeur</h4>
                      <p className="text-sm text-muted-foreground">Objectif: 7 jours consécutifs positifs</p>
                    </div>
                    <Badge className="bg-blue-100 text-blue-800">En cours</Badge>
                  </div>
                  <Progress value={43} className="w-full" />
                  <p className="text-sm text-muted-foreground">43% accompli</p>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">Pratique régulière</h4>
                      <p className="text-sm text-muted-foreground">Objectif: 30 scans émotionnels</p>
                    </div>
                    <Badge className="bg-green-100 text-green-800">
                      <Award className="h-3 w-3 mr-1" />
                      Accompli
                    </Badge>
                  </div>
                  <Progress value={100} className="w-full" />
                  <p className="text-sm text-muted-foreground">Félicitations ! Objectif atteint</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default B2CDashboardPage;
