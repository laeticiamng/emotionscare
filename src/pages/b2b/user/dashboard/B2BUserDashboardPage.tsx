
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Building, 
  Users, 
  Activity, 
  TrendingUp, 
  Calendar,
  Brain,
  MessageSquare,
  Music,
  Target,
  Heart
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';
import LoadingAnimation from '@/components/ui/loading-animation';

interface TeamStats {
  teamSize: number;
  activeMembers: number;
  teamMoodAverage: number;
  myPosition: number;
}

const B2BUserDashboardPage: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [teamStats, setTeamStats] = useState<TeamStats | null>(null);
  const [personalStats, setPersonalStats] = useState({
    emotionalScore: 0,
    weeklyProgress: 0,
    totalScans: 0,
    streak: 0
  });

  useEffect(() => {
    if (user) {
      loadDashboardData();
    }
  }, [user]);

  const loadDashboardData = async () => {
    if (!user) return;

    try {
      setIsLoading(true);

      // Charger les données personnelles
      const { data: emotions, error: emotionsError } = await supabase
        .from('emotions')
        .select('*')
        .eq('user_id', user.id)
        .order('date', { ascending: false })
        .limit(30);

      if (emotionsError) throw emotionsError;

      const avgScore = emotions?.length > 0 
        ? emotions.reduce((sum, e) => sum + (e.score || 0), 0) / emotions.length 
        : 0;

      const weeklyEmotions = emotions?.filter(e => 
        new Date(e.date) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
      ) || [];

      const weeklyAvg = weeklyEmotions.length > 0
        ? weeklyEmotions.reduce((sum, e) => sum + (e.score || 0), 0) / weeklyEmotions.length
        : 0;

      setPersonalStats({
        emotionalScore: Math.round(avgScore),
        weeklyProgress: Math.round(weeklyAvg),
        totalScans: emotions?.length || 0,
        streak: Math.min(emotions?.length || 0, 7)
      });

      // Simuler les statistiques d'équipe (à remplacer par de vraies données)
      setTeamStats({
        teamSize: 12,
        activeMembers: 8,
        teamMoodAverage: 72,
        myPosition: 3
      });

    } catch (error) {
      console.error('Dashboard data loading error:', error);
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

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Welcome Section */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">
            Bonjour {user?.name} !
          </h1>
          <p className="text-muted-foreground">
            Tableau de bord collaborateur - {user?.company || 'Votre entreprise'}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Building className="h-5 w-5 text-muted-foreground" />
          <span className="text-sm text-muted-foreground">Mode Collaborateur</span>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Mon Score</CardTitle>
            <Heart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{personalStats.emotionalScore}/100</div>
            <Progress value={personalStats.emotionalScore} className="mt-2" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Équipe Active</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {teamStats?.activeMembers}/{teamStats?.teamSize}
            </div>
            <p className="text-xs text-muted-foreground">membres connectés</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Humeur Équipe</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{teamStats?.teamMoodAverage}/100</div>
            <p className="text-xs text-muted-foreground">moyenne de l'équipe</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Ma Position</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">#{teamStats?.myPosition}</div>
            <p className="text-xs text-muted-foreground">dans l'équipe</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Aperçu</TabsTrigger>
          <TabsTrigger value="team">Équipe</TabsTrigger>
          <TabsTrigger value="wellness">Bien-être</TabsTrigger>
          <TabsTrigger value="goals">Objectifs</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Actions Rapides</CardTitle>
                <CardDescription>Accédez rapidement à vos outils</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  <Button 
                    variant="outline" 
                    className="h-20 flex flex-col gap-2"
                    onClick={() => navigate('/scan')}
                  >
                    <Brain className="h-6 w-6" />
                    Scan Émotionnel
                  </Button>
                  
                  <Button 
                    variant="outline" 
                    className="h-20 flex flex-col gap-2"
                    onClick={() => navigate('/coach')}
                  >
                    <MessageSquare className="h-6 w-6" />
                    Coach IA
                  </Button>
                  
                  <Button 
                    variant="outline" 
                    className="h-20 flex flex-col gap-2"
                    onClick={() => navigate('/music')}
                  >
                    <Music className="h-6 w-6" />
                    Musicothérapie
                  </Button>
                  
                  <Button 
                    variant="outline" 
                    className="h-20 flex flex-col gap-2"
                    onClick={() => navigate('/team')}
                  >
                    <Users className="h-6 w-6" />
                    Mon Équipe
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Team Activity */}
            <Card>
              <CardHeader>
                <CardTitle>Activité de l'Équipe</CardTitle>
                <CardDescription>Dernières activités de vos collègues</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                    <div>
                      <p className="font-medium">Session de groupe terminée</p>
                      <p className="text-sm text-muted-foreground">Il y a 2 heures</p>
                    </div>
                    <Users className="h-4 w-4 text-muted-foreground" />
                  </div>
                  <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                    <div>
                      <p className="font-medium">Nouveau défi d'équipe</p>
                      <p className="text-sm text-muted-foreground">Il y a 4 heures</p>
                    </div>
                    <Target className="h-4 w-4 text-muted-foreground" />
                  </div>
                  <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                    <div>
                      <p className="font-medium">Rapport hebdomadaire disponible</p>
                      <p className="text-sm text-muted-foreground">Hier</p>
                    </div>
                    <Activity className="h-4 w-4 text-muted-foreground" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="team">
          <Card>
            <CardHeader>
              <CardTitle>Mon Équipe</CardTitle>
              <CardDescription>Statut et bien-être de l'équipe</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12">
                <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">Fonctionnalité équipe en développement</p>
                <p className="text-sm text-muted-foreground">Bientôt disponible pour collaborer avec vos collègues</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="wellness">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Mon Bien-être</CardTitle>
                <CardDescription>Suivi de votre évolution personnelle</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="text-sm font-medium">Score émotionnel</span>
                      <span className="text-sm">{personalStats.emotionalScore}/100</span>
                    </div>
                    <Progress value={personalStats.emotionalScore} />
                  </div>
                  
                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="text-sm font-medium">Progression cette semaine</span>
                      <span className="text-sm">+{personalStats.weeklyProgress}%</span>
                    </div>
                    <Progress value={personalStats.weeklyProgress} />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 pt-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold">{personalStats.totalScans}</div>
                      <div className="text-sm text-muted-foreground">Scans réalisés</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold">{personalStats.streak}</div>
                      <div className="text-sm text-muted-foreground">Jours consécutifs</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Recommandations</CardTitle>
                <CardDescription>Suggestions personnalisées</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-4 bg-blue-50 rounded-lg">
                    <h4 className="font-medium text-blue-900">💆‍♀️ Pause détente</h4>
                    <p className="text-sm text-blue-800 mt-1">
                      Prenez 10 minutes pour une session de musicothérapie
                    </p>
                  </div>
                  
                  <div className="p-4 bg-green-50 rounded-lg">
                    <h4 className="font-medium text-green-900">🎯 Objectif du jour</h4>
                    <p className="text-sm text-green-800 mt-1">
                      Complétez votre scan émotionnel quotidien
                    </p>
                  </div>
                  
                  <div className="p-4 bg-purple-50 rounded-lg">
                    <h4 className="font-medium text-purple-900">👥 Équipe</h4>
                    <p className="text-sm text-purple-800 mt-1">
                      Participez à la session de groupe de demain
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="goals">
          <Card>
            <CardHeader>
              <CardTitle>Mes Objectifs</CardTitle>
              <CardDescription>Suivi de vos objectifs de bien-être</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">Améliorer l'équilibre vie pro/perso</h4>
                      <p className="text-sm text-muted-foreground">Objectif: Réduire le stress de 20%</p>
                    </div>
                    <span className="text-sm text-yellow-600 bg-yellow-100 px-2 py-1 rounded">En cours</span>
                  </div>
                  <Progress value={65} className="w-full" />
                  <p className="text-sm text-muted-foreground">65% accompli</p>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">Participation équipe</h4>
                      <p className="text-sm text-muted-foreground">Objectif: 80% de participation aux sessions</p>
                    </div>
                    <span className="text-sm text-blue-600 bg-blue-100 px-2 py-1 rounded">En cours</span>
                  </div>
                  <Progress value={75} className="w-full" />
                  <p className="text-sm text-muted-foreground">75% accompli</p>
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
