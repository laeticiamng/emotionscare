
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { Building2, Users, Brain, TrendingUp, Activity, Calendar, MessageSquare, Target } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import LoadingAnimation from '@/components/ui/loading-animation';

interface DashboardStats {
  totalEmotions: number;
  averageScore: number;
  weeklyScans: number;
  teamMood: number;
}

const B2BUserDashboardPage: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [stats, setStats] = useState<DashboardStats>({
    totalEmotions: 0,
    averageScore: 0,
    weeklyScans: 0,
    teamMood: 0
  });
  const [isLoading, setIsLoading] = useState(true);
  const [recentEmotions, setRecentEmotions] = useState<any[]>([]);

  useEffect(() => {
    if (user) {
      fetchDashboardData();
    }
  }, [user]);

  const fetchDashboardData = async () => {
    if (!user) return;

    try {
      setIsLoading(true);
      
      // Fetch user emotions
      const { data: emotions, error: emotionsError } = await supabase
        .from('emotions')
        .select('*')
        .eq('user_id', user.id)
        .order('date', { ascending: false });

      if (emotionsError) throw emotionsError;

      // Calculate stats
      const now = new Date();
      const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      
      const weeklyEmotions = emotions?.filter(e => new Date(e.date) >= oneWeekAgo) || [];
      const scoresWithValue = emotions?.filter(e => e.score !== null) || [];
      
      const averageScore = scoresWithValue.length > 0 
        ? scoresWithValue.reduce((sum, e) => sum + e.score, 0) / scoresWithValue.length 
        : 0;

      setStats({
        totalEmotions: emotions?.length || 0,
        averageScore: Math.round(averageScore * 10) / 10,
        weeklyScans: weeklyEmotions.length,
        teamMood: 7.2 // Mock data for team mood
      });

      setRecentEmotions(emotions?.slice(0, 5) || []);
      
    } catch (error: any) {
      console.error('Error fetching dashboard data:', error);
      toast({
        title: "Erreur",
        description: "Impossible de charger les données du tableau de bord",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 7) return 'text-green-600';
    if (score >= 4) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getScoreLabel = (score: number) => {
    if (score >= 7) return 'Positif';
    if (score >= 4) return 'Neutre';
    return 'Négatif';
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (isLoading) {
    return (
      <div className="flex h-[calc(100vh-4rem)] items-center justify-center">
        <LoadingAnimation text="Chargement de votre tableau de bord..." />
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Building2 className="h-8 w-8 text-blue-600" />
            Tableau de bord Collaborateur
          </h1>
          <p className="text-muted-foreground mt-1">
            Bienvenue {user?.user_metadata?.name || user?.email}, voici votre aperçu bien-être
          </p>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid md:grid-cols-3 gap-4">
        <Button 
          onClick={() => navigate('/b2b/user/scan')}
          className="h-auto p-6 flex flex-col items-center gap-2 bg-blue-600 hover:bg-blue-700"
        >
          <Brain className="h-8 w-8" />
          <span className="font-semibold">Scanner mes émotions</span>
          <span className="text-sm opacity-90">Analyser mon état actuel</span>
        </Button>
        
        <Button 
          onClick={() => navigate('/b2b/user/social')}
          variant="outline"
          className="h-auto p-6 flex flex-col items-center gap-2"
        >
          <MessageSquare className="h-8 w-8" />
          <span className="font-semibold">Espace Social</span>
          <span className="text-sm text-muted-foreground">Échanger avec l'équipe</span>
        </Button>
        
        <Button 
          variant="outline"
          className="h-auto p-6 flex flex-col items-center gap-2"
        >
          <Target className="h-8 w-8" />
          <span className="font-semibold">Mes Objectifs</span>
          <span className="text-sm text-muted-foreground">Définir mes buts</span>
        </Button>
      </div>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">
            <TrendingUp className="h-4 w-4 mr-2" />
            Vue d'ensemble
          </TabsTrigger>
          <TabsTrigger value="emotions">
            <Brain className="h-4 w-4 mr-2" />
            Mes émotions
          </TabsTrigger>
          <TabsTrigger value="team">
            <Users className="h-4 w-4 mr-2" />
            Équipe
          </TabsTrigger>
          <TabsTrigger value="activities">
            <Activity className="h-4 w-4 mr-2" />
            Activités
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* KPIs */}
          <div className="grid md:grid-cols-4 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Total scans</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.totalEmotions}</div>
                <p className="text-xs text-muted-foreground">+{stats.weeklyScans} cette semaine</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Score moyen</CardTitle>
              </CardHeader>
              <CardContent>
                <div className={`text-2xl font-bold ${getScoreColor(stats.averageScore)}`}>
                  {stats.averageScore}/10
                </div>
                <p className="text-xs text-muted-foreground">
                  {getScoreLabel(stats.averageScore)}
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Humeur d'équipe</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">{stats.teamMood}/10</div>
                <p className="text-xs text-muted-foreground">Excellente ambiance</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Objectif hebdo</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>{stats.weeklyScans}/5 scans</span>
                    <span>{Math.round((stats.weeklyScans / 5) * 100)}%</span>
                  </div>
                  <Progress value={(stats.weeklyScans / 5) * 100} />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Recent Activity */}
          <div className="grid md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Activité récente</CardTitle>
                <CardDescription>Vos dernières analyses émotionnelles</CardDescription>
              </CardHeader>
              <CardContent>
                {recentEmotions.length === 0 ? (
                  <div className="text-center py-8">
                    <Brain className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                    <p className="text-muted-foreground">Aucune analyse pour le moment</p>
                    <Button 
                      onClick={() => navigate('/b2b/user/scan')}
                      className="mt-4"
                    >
                      Faire votre premier scan
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {recentEmotions.map((emotion) => (
                      <div key={emotion.id} className="flex justify-between items-center p-3 bg-muted rounded-lg">
                        <div className="flex-1">
                          <p className="text-sm">{formatDate(emotion.date)}</p>
                          {emotion.text && (
                            <p className="text-xs text-muted-foreground mt-1 truncate">
                              {emotion.text.substring(0, 50)}...
                            </p>
                          )}
                        </div>
                        {emotion.score && (
                          <div className={`font-bold ${getScoreColor(emotion.score)}`}>
                            {emotion.score}/10
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Recommandations</CardTitle>
                <CardDescription>Conseils pour améliorer votre bien-être</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-4 bg-blue-50 rounded-lg">
                  <h4 className="font-semibold text-blue-900 mb-2">💪 Objectif de la semaine</h4>
                  <p className="text-sm text-blue-800">
                    Réalisez 5 scans émotionnels pour mieux comprendre vos tendances.
                  </p>
                </div>
                
                <div className="p-4 bg-green-50 rounded-lg">
                  <h4 className="font-semibold text-green-900 mb-2">🧘 Conseil bien-être</h4>
                  <p className="text-sm text-green-800">
                    Prenez 5 minutes de pause toutes les 2 heures pour réduire le stress.
                  </p>
                </div>
                
                <div className="p-4 bg-purple-50 rounded-lg">
                  <h4 className="font-semibold text-purple-900 mb-2">👥 Social</h4>
                  <p className="text-sm text-purple-800">
                    Participez aux discussions d'équipe pour renforcer les liens.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="emotions" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Historique de mes émotions</CardTitle>
              <CardDescription>Toutes vos analyses émotionnelles</CardDescription>
            </CardHeader>
            <CardContent>
              {recentEmotions.length === 0 ? (
                <div className="text-center py-8">
                  <Brain className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <p className="text-muted-foreground">Commencez par analyser vos émotions</p>
                  <Button 
                    onClick={() => navigate('/b2b/user/scan')}
                    className="mt-4"
                  >
                    Faire un scan émotionnel
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  {recentEmotions.map((emotion) => (
                    <div key={emotion.id} className="border rounded-lg p-4">
                      <div className="flex justify-between items-start mb-2">
                        <p className="text-sm text-muted-foreground">
                          {formatDate(emotion.date)}
                        </p>
                        {emotion.score && (
                          <div className="text-right">
                            <div className={`font-bold ${getScoreColor(emotion.score)}`}>
                              {emotion.score}/10
                            </div>
                            <div className={`text-xs ${getScoreColor(emotion.score)}`}>
                              {getScoreLabel(emotion.score)}
                            </div>
                          </div>
                        )}
                      </div>
                      
                      {emotion.text && (
                        <div className="mb-2">
                          <strong>Texte:</strong> {emotion.text}
                        </div>
                      )}
                      
                      {emotion.emojis && (
                        <div className="mb-2">
                          <strong>Émojis:</strong> <span className="text-lg">{emotion.emojis}</span>
                        </div>
                      )}
                      
                      {emotion.ai_feedback && (
                        <div className="mt-3 p-3 bg-muted rounded">
                          <strong>Analyse IA:</strong> {emotion.ai_feedback}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="team" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Humeur d'équipe</CardTitle>
              <CardDescription>Vue d'ensemble du bien-être de l'équipe</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <Users className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <p className="text-muted-foreground">
                  Fonctionnalité en cours de développement
                </p>
                <p className="text-sm text-muted-foreground mt-2">
                  Bientôt disponible : statistiques d'équipe et comparaisons anonymes
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="activities" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Activités de bien-être</CardTitle>
              <CardDescription>Exercices et activités recommandés</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <Activity className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <p className="text-muted-foreground">
                  Fonctionnalité en cours de développement
                </p>
                <p className="text-sm text-muted-foreground mt-2">
                  Bientôt disponible : exercices de méditation, activités de team building
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default B2BUserDashboardPage;
