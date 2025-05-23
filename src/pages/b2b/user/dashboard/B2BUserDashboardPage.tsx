
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Users, 
  TrendingUp, 
  Calendar, 
  Target, 
  Brain,
  Music,
  MessageCircle,
  Building,
  Award,
  Heart,
  Smile,
  Frown,
  Meh,
  BarChart3
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import EmotionScanner from '@/components/scan/EmotionScanner';
import AICoach from '@/components/coach/AICoach';
import MusicTherapy from '@/components/music/MusicTherapy';
import LoadingAnimation from '@/components/ui/loading-animation';

interface TeamStats {
  teamSize: number;
  averageMood: number;
  departmentRanking: number;
  teamGoals: string[];
}

interface UserStats {
  emotionalScore: number;
  weeklyProgress: number;
  streakDays: number;
  totalScans: number;
  mood: 'positive' | 'neutral' | 'negative';
}

const B2BUserDashboardPage: React.FC = () => {
  const { user } = useAuth();
  const [userStats, setUserStats] = useState<UserStats | null>(null);
  const [teamStats, setTeamStats] = useState<TeamStats | null>(null);
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

      // Charger les données utilisateur
      const { data: emotions, error: emotionsError } = await supabase
        .from('emotions')
        .select('*')
        .eq('user_id', user.id)
        .order('date', { ascending: false })
        .limit(30);

      if (emotionsError) throw emotionsError;

      // Calculer les statistiques utilisateur
      const avgScore = emotions?.length > 0 
        ? emotions.reduce((sum, e) => sum + (e.score || 0), 0) / emotions.length 
        : 0;

      const weeklyEmotions = emotions?.filter(e => 
        new Date(e.date) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
      ) || [];

      const weeklyAvg = weeklyEmotions.length > 0
        ? weeklyEmotions.reduce((sum, e) => sum + (e.score || 0), 0) / weeklyEmotions.length
        : 0;

      const mood: 'positive' | 'neutral' | 'negative' = 
        avgScore >= 70 ? 'positive' :
        avgScore >= 40 ? 'neutral' : 'negative';

      setUserStats({
        emotionalScore: Math.round(avgScore),
        weeklyProgress: Math.round((weeklyAvg - avgScore) * 10),
        streakDays: Math.min(emotions?.length || 0, 7),
        totalScans: emotions?.length || 0,
        mood
      });

      // Simuler les données d'équipe (remplacer par de vraies données quand disponible)
      setTeamStats({
        teamSize: 12,
        averageMood: 75,
        departmentRanking: 3,
        teamGoals: ['Réduire le stress', 'Améliorer la collaboration', 'Équilibre vie pro/perso']
      });

    } catch (error) {
      console.error('Dashboard data loading error:', error);
      toast.error("Impossible de charger les données du tableau de bord");
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <LoadingAnimation text="Chargement de votre espace collaborateur..." />
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

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Welcome Section */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Building className="h-8 w-8 text-primary" />
            Espace Collaborateur
          </h1>
          <p className="text-muted-foreground">
            Bienvenue {user?.name}, voici votre tableau de bord professionnel
          </p>
        </div>
        <div className="flex items-center gap-2">
          {userStats && getMoodIcon(userStats.mood)}
          <Badge variant="outline" className="text-sm">
            Collaborateur
          </Badge>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Mon Score</CardTitle>
            <Heart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{userStats?.emotionalScore || 0}/100</div>
            <Progress value={userStats?.emotionalScore || 0} className="mt-2" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Équipe</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{teamStats?.teamSize || 0}</div>
            <p className="text-xs text-muted-foreground">collaborateurs</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Moyenne équipe</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{teamStats?.averageMood || 0}%</div>
            <p className="text-xs text-muted-foreground">bien-être collectif</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Classement</CardTitle>
            <Award className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">#{teamStats?.departmentRanking || 0}</div>
            <p className="text-xs text-muted-foreground">dans le département</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="overview">Aperçu</TabsTrigger>
          <TabsTrigger value="scan">Scanner IA</TabsTrigger>
          <TabsTrigger value="coach">Coach IA</TabsTrigger>
          <TabsTrigger value="music">Musique</TabsTrigger>
          <TabsTrigger value="team">Équipe</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Objectifs d'équipe */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-5 w-5" />
                  Objectifs d'Équipe
                </CardTitle>
                <CardDescription>Objectifs collectifs de bien-être</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {teamStats?.teamGoals.map((goal, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                      <span className="font-medium">{goal}</span>
                      <Badge variant="outline">En cours</Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Actions rapides */}
            <Card>
              <CardHeader>
                <CardTitle>Actions Rapides</CardTitle>
                <CardDescription>Outils de bien-être disponibles</CardDescription>
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
                    Musicothérapie
                  </Button>
                  
                  <Button 
                    variant="outline" 
                    className="h-20 flex flex-col gap-2"
                    onClick={() => setActiveTab('team')}
                  >
                    <BarChart3 className="h-6 w-6" />
                    Statistiques
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="scan">
          <EmotionScanner />
        </TabsContent>

        <TabsContent value="coach">
          <AICoach />
        </TabsContent>

        <TabsContent value="music">
          <MusicTherapy />
        </TabsContent>

        <TabsContent value="team" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Analytique d'Équipe
              </CardTitle>
              <CardDescription>Vue d'ensemble du bien-être collectif</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-sm font-medium">Moral général de l'équipe</span>
                    <span className="text-sm text-muted-foreground">{teamStats?.averageMood}%</span>
                  </div>
                  <Progress value={teamStats?.averageMood} className="h-3" />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 bg-muted rounded-lg">
                    <div className="text-2xl font-bold text-green-600">{userStats?.emotionalScore}%</div>
                    <p className="text-sm text-muted-foreground">Votre score</p>
                  </div>
                  <div className="p-4 bg-muted rounded-lg">
                    <div className="text-2xl font-bold text-blue-600">{teamStats?.averageMood}%</div>
                    <p className="text-sm text-muted-foreground">Moyenne équipe</p>
                  </div>
                </div>

                <div className="text-center py-8">
                  <BarChart3 className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">
                    Graphiques détaillés disponibles pour les administrateurs
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default B2BUserDashboardPage;
