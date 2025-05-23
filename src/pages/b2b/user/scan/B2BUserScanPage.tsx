
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useUserMode } from '@/contexts/UserModeContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import EmotionScanForm from '@/components/scan/EmotionScanForm';
import { toast } from 'sonner';
import { 
  Brain, 
  History, 
  TrendingUp, 
  Loader2,
  Users,
  Building2,
  BarChart3,
  Calendar,
  Target
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface EmotionResult {
  id: string;
  user_id: string;
  emojis?: string;
  text?: string;
  audio_url?: string;
  score: number;
  date: string;
  ai_feedback?: string;
}

const B2BUserScanPage: React.FC = () => {
  const { user, logout } = useAuth();
  const { setUserMode } = useUserMode();
  const navigate = useNavigate();
  const [showScanForm, setShowScanForm] = useState(false);
  const [emotions, setEmotions] = useState<EmotionResult[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [userProfile, setUserProfile] = useState<any>(null);
  const [teamAverage, setTeamAverage] = useState(0);
  const [stats, setStats] = useState({
    totalScans: 0,
    averageScore: 0,
    lastScan: null as string | null,
    trend: 'stable' as 'up' | 'down' | 'stable',
    weeklyGoal: 75
  });

  useEffect(() => {
    setUserMode('b2b_user');
    fetchData();
  }, [setUserMode]);

  const fetchData = async () => {
    try {
      setIsLoading(true);
      
      // Fetch user profile
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user?.id)
        .single();

      if (profileError) throw profileError;
      setUserProfile(profile);

      // Fetch user emotions
      const { data: emotionsData, error: emotionsError } = await supabase
        .from('emotions')
        .select('*')
        .eq('user_id', user?.id)
        .order('date', { ascending: false });

      if (emotionsError) throw emotionsError;
      setEmotions(emotionsData || []);
      calculateStats(emotionsData || []);

      // Fetch team average (users in same department)
      const { data: teamData, error: teamError } = await supabase
        .from('emotions')
        .select(`
          score,
          profiles!inner(department)
        `)
        .eq('profiles.department', profile?.department);

      if (teamError) throw teamError;
      
      if (teamData && teamData.length > 0) {
        const avgScore = teamData.reduce((sum: number, item: any) => sum + item.score, 0) / teamData.length;
        setTeamAverage(Math.round(avgScore));
      }

    } catch (error) {
      console.error('Error fetching data:', error);
      toast.error('Erreur lors du chargement des données');
    } finally {
      setIsLoading(false);
    }
  };

  const calculateStats = (emotionData: EmotionResult[]) => {
    if (emotionData.length === 0) {
      setStats(prev => ({
        ...prev,
        totalScans: 0,
        averageScore: 0,
        lastScan: null,
        trend: 'stable'
      }));
      return;
    }

    const totalScans = emotionData.length;
    const averageScore = emotionData.reduce((sum, emotion) => sum + emotion.score, 0) / totalScans;
    const lastScan = emotionData[0]?.date;

    // Calculate trend (compare last 3 vs previous 3)
    let trend: 'up' | 'down' | 'stable' = 'stable';
    if (emotionData.length >= 6) {
      const recent = emotionData.slice(0, 3);
      const previous = emotionData.slice(3, 6);
      const recentAvg = recent.reduce((sum, e) => sum + e.score, 0) / 3;
      const previousAvg = previous.reduce((sum, e) => sum + e.score, 0) / 3;
      
      if (recentAvg > previousAvg + 5) trend = 'up';
      else if (recentAvg < previousAvg - 5) trend = 'down';
    }

    setStats(prev => ({
      ...prev,
      totalScans,
      averageScore: Math.round(averageScore),
      lastScan,
      trend
    }));
  };

  const handleScanComplete = async (result: EmotionResult) => {
    try {
      const { error } = await supabase
        .from('emotions')
        .insert([
          {
            user_id: user?.id,
            emojis: result.emojis,
            text: result.text,
            audio_url: result.audio_url,
            score: result.score,
            ai_feedback: result.ai_feedback
          }
        ]);

      if (error) throw error;

      // Update profile emotional score
      await supabase
        .from('profiles')
        .update({ emotional_score: result.score })
        .eq('id', user?.id);

      toast.success('Analyse enregistrée avec succès !');
      setShowScanForm(false);
      fetchData();
    } catch (error) {
      console.error('Error saving emotion:', error);
      toast.error('Erreur lors de l\'enregistrement');
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 70) return 'text-green-600 bg-green-50';
    if (score >= 40) return 'text-yellow-600 bg-yellow-50';
    return 'text-red-600 bg-red-50';
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up': return <TrendingUp className="h-4 w-4 text-green-600" />;
      case 'down': return <TrendingUp className="h-4 w-4 text-red-600 rotate-180" />;
      default: return <BarChart3 className="h-4 w-4 text-gray-600" />;
    }
  };

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-background to-muted flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p>Chargement de vos analyses...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted">
      {/* Header */}
      <header className="border-b bg-background/95 backdrop-blur">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button variant="ghost" onClick={() => navigate('/b2b/user/dashboard')}>
              ← Tableau de bord
            </Button>
            <h1 className="text-xl font-bold">Analyse Bien-être Collaborateur</h1>
          </div>
          <div className="flex items-center space-x-4">
            <Badge variant="outline" className="bg-green-50 text-green-600">
              Collaborateur
            </Badge>
            <Badge variant="outline">
              {user?.user_metadata?.name || user?.email}
            </Badge>
            <Button onClick={handleLogout} variant="outline">
              Déconnexion
            </Button>
          </div>
        </div>
      </header>

      <div className="container py-8">
        {/* Stats Cards */}
        <div className="grid md:grid-cols-5 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Mes Analyses</p>
                  <p className="text-2xl font-bold">{stats.totalScans}</p>
                </div>
                <Brain className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Mon Score</p>
                  <p className="text-2xl font-bold">{stats.averageScore}%</p>
                </div>
                <Target className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Équipe</p>
                  <p className="text-2xl font-bold">{teamAverage}%</p>
                </div>
                <Users className="h-8 w-8 text-purple-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Objectif</p>
                  <p className="text-2xl font-bold">{stats.weeklyGoal}%</p>
                </div>
                <Target className="h-8 w-8 text-orange-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Tendance</p>
                  <p className="text-lg font-bold capitalize">
                    {stats.trend === 'up' ? 'Positive' : stats.trend === 'down' ? 'Négative' : 'Stable'}
                  </p>
                </div>
                {getTrendIcon(stats.trend)}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Department Info */}
        <Card className="mb-8">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <Building2 className="h-8 w-8 text-blue-600" />
                <div>
                  <h3 className="font-semibold">Département: {userProfile?.department || 'Non défini'}</h3>
                  <p className="text-sm text-muted-foreground">
                    Poste: {userProfile?.job_title || 'Non défini'}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm text-muted-foreground">Comparaison avec l'équipe</p>
                <div className="flex items-center space-x-2">
                  <span className="text-lg font-bold">Vous: {stats.averageScore}%</span>
                  <span className="text-muted-foreground">vs</span>
                  <span className="text-lg font-bold">Équipe: {teamAverage}%</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Tabs defaultValue="scan" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="scan">
              <Brain className="h-4 w-4 mr-2" />
              Nouvelle Analyse
            </TabsTrigger>
            <TabsTrigger value="history">
              <History className="h-4 w-4 mr-2" />
              Mon Historique
            </TabsTrigger>
            <TabsTrigger value="wellness">
              <BarChart3 className="h-4 w-4 mr-2" />
              Bien-être Équipe
            </TabsTrigger>
          </TabsList>

          <TabsContent value="scan" className="space-y-6">
            {!showScanForm && (
              <Card>
                <CardHeader>
                  <CardTitle>Évaluer votre bien-être</CardTitle>
                  <CardDescription>
                    Analysez votre état émotionnel pour contribuer au bien-être de l'équipe
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="bg-blue-50 p-4 rounded-lg border-l-4 border-blue-500">
                      <h4 className="font-semibold text-blue-900">Objectif de la semaine</h4>
                      <p className="text-blue-800">Maintenir un score de bien-être supérieur à {stats.weeklyGoal}%</p>
                    </div>
                    <Button 
                      onClick={() => setShowScanForm(true)}
                      className="w-full"
                      size="lg"
                    >
                      <Brain className="h-5 w-5 mr-2" />
                      Commencer une évaluation
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
            
            {showScanForm && (
              <EmotionScanForm 
                onComplete={handleScanComplete} 
                onClose={() => setShowScanForm(false)} 
              />
            )}
          </TabsContent>

          <TabsContent value="history" className="space-y-6">
            {emotions.length === 0 ? (
              <Card>
                <CardContent className="text-center py-12">
                  <History className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                  <h3 className="font-semibold mb-2">Aucune analyse disponible</h3>
                  <p className="text-muted-foreground mb-4">
                    Commencez votre première évaluation bien-être
                  </p>
                  <Button onClick={() => setShowScanForm(true)}>
                    Première évaluation
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-4">
                {emotions.map((emotion) => (
                  <Card key={emotion.id} className="hover:shadow-lg transition-shadow">
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <div>
                          <CardTitle className="text-lg">
                            Évaluation du {new Date(emotion.date).toLocaleDateString('fr-FR')}
                          </CardTitle>
                          <CardDescription>
                            {new Date(emotion.date).toLocaleTimeString('fr-FR')}
                          </CardDescription>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Badge className={getScoreColor(emotion.score)}>
                            {emotion.score}%
                          </Badge>
                          {emotion.score >= stats.weeklyGoal && (
                            <Badge variant="outline" className="bg-green-50 text-green-600">
                              Objectif atteint
                            </Badge>
                          )}
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {emotion.text && (
                        <div>
                          <p className="font-medium text-sm mb-2">Contexte :</p>
                          <p className="text-sm bg-muted p-3 rounded">{emotion.text}</p>
                        </div>
                      )}
                      
                      {emotion.emojis && (
                        <div>
                          <p className="font-medium text-sm mb-2">Émojis :</p>
                          <p className="text-2xl">{emotion.emojis}</p>
                        </div>
                      )}
                      
                      {emotion.ai_feedback && (
                        <div>
                          <p className="font-medium text-sm mb-2">Recommandations IA :</p>
                          <p className="text-sm bg-blue-50 p-3 rounded border-l-4 border-blue-500">
                            {emotion.ai_feedback}
                          </p>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="wellness" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Bien-être de l'équipe</CardTitle>
                <CardDescription>
                  Vue d'ensemble du bien-être dans votre département
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="text-center">
                      <div className="text-3xl font-bold text-blue-600 mb-2">{stats.averageScore}%</div>
                      <p className="text-sm text-muted-foreground">Votre score moyen</p>
                    </div>
                    <div className="text-center">
                      <div className="text-3xl font-bold text-purple-600 mb-2">{teamAverage}%</div>
                      <p className="text-sm text-muted-foreground">Score moyen de l'équipe</p>
                    </div>
                  </div>
                  
                  <div className="bg-muted p-4 rounded-lg">
                    <h4 className="font-semibold mb-2">Recommandations pour l'équipe</h4>
                    <ul className="text-sm space-y-1">
                      <li>• Organisez des pauses collectives régulières</li>
                      <li>• Participez aux activités de team building</li>
                      <li>• Communiquez ouvertement avec vos collègues</li>
                      <li>• Prenez soin de votre équilibre vie pro/perso</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default B2BUserScanPage;
