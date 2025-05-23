
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { 
  Heart, 
  TrendingUp, 
  Calendar, 
  Target, 
  Brain,
  Smile,
  Activity,
  Clock,
  Book,
  Music
} from 'lucide-react';
import LoadingAnimation from '@/components/ui/loading-animation';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useNavigate } from 'react-router-dom';

const B2CDashboardPage: React.FC = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [stats, setStats] = useState({
    emotionalScore: 78,
    weeklyCheckins: 4,
    streak: 7,
    totalSessions: 23,
    lastUpdate: new Date().toLocaleDateString('fr-FR')
  });

  const [emotionData, setEmotionData] = useState([]);
  const [recentActivities, setRecentActivities] = useState([]);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setIsLoading(true);
      
      // Charger les données réelles des émotions de l'utilisateur
      if (user) {
        const { data: emotions, error } = await supabase
          .from('emotions')
          .select('*')
          .eq('user_id', user.id)
          .order('date', { ascending: true })
          .limit(7);

        if (error) {
          console.error('Erreur lors du chargement des émotions:', error);
        } else if (emotions) {
          const chartData = emotions.map((emotion, index) => ({
            date: new Date(emotion.date).toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit' }),
            score: emotion.score || 50
          }));
          setEmotionData(chartData);
        }
      }

      // Données factices pour les activités récentes
      const mockActivities = [
        { id: 1, type: 'emotion_scan', description: 'Analyse émotionnelle', time: '2h', icon: Heart },
        { id: 2, type: 'journal', description: 'Entrée journal', time: '1j', icon: Book },
        { id: 3, type: 'meditation', description: 'Session méditation', time: '2j', icon: Brain },
        { id: 4, type: 'music', description: 'Thérapie musicale', time: '3j', icon: Music }
      ];
      setRecentActivities(mockActivities);
      
      setIsLoading(false);
    } catch (error) {
      console.error('Erreur lors du chargement:', error);
      toast({
        title: "Erreur",
        description: "Impossible de charger les données du tableau de bord",
        variant: "error"
      });
      setIsLoading(false);
    }
  };

  const handleNewScan = () => {
    navigate('/b2c/scan');
  };

  const handleSocialAccess = () => {
    navigate('/b2c/social');
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
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Bonjour {user?.name || 'Utilisateur'} 👋</h1>
          <p className="text-muted-foreground">
            Comment vous sentez-vous aujourd'hui ?
          </p>
        </div>
        <Badge variant="outline" className="flex items-center gap-2">
          <Heart className="h-4 w-4" />
          Mode Personnel
        </Badge>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={handleNewScan}>
          <CardContent className="p-6 text-center">
            <Heart className="h-8 w-8 text-primary mx-auto mb-2" />
            <h3 className="font-medium">Nouvelle analyse</h3>
            <p className="text-sm text-muted-foreground">Scanner vos émotions</p>
          </CardContent>
        </Card>
        
        <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={handleSocialAccess}>
          <CardContent className="p-6 text-center">
            <Smile className="h-8 w-8 text-blue-500 mx-auto mb-2" />
            <h3 className="font-medium">Espace social</h3>
            <p className="text-sm text-muted-foreground">Rejoindre la communauté</p>
          </CardContent>
        </Card>
        
        <Card className="cursor-pointer hover:shadow-md transition-shadow">
          <CardContent className="p-6 text-center">
            <Brain className="h-8 w-8 text-green-500 mx-auto mb-2" />
            <h3 className="font-medium">Méditation</h3>
            <p className="text-sm text-muted-foreground">Session de détente</p>
          </CardContent>
        </Card>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Score émotionnel</p>
                <p className="text-2xl font-bold">{stats.emotionalScore}/100</p>
              </div>
              <Heart className="h-8 w-8 text-primary" />
            </div>
            <div className="mt-4 flex items-center text-sm text-green-600">
              <TrendingUp className="h-4 w-4 mr-1" />
              +5 points cette semaine
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Check-ins semaine</p>
                <p className="text-2xl font-bold">{stats.weeklyCheckins}</p>
              </div>
              <Calendar className="h-8 w-8 text-blue-500" />
            </div>
            <div className="mt-4 flex items-center text-sm text-green-600">
              <Target className="h-4 w-4 mr-1" />
              Objectif atteint
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Série actuelle</p>
                <p className="text-2xl font-bold">{stats.streak} jours</p>
              </div>
              <Activity className="h-8 w-8 text-green-500" />
            </div>
            <div className="mt-4 flex items-center text-sm text-green-600">
              <TrendingUp className="h-4 w-4 mr-1" />
              Record personnel !
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Sessions totales</p>
                <p className="text-2xl font-bold">{stats.totalSessions}</p>
              </div>
              <Clock className="h-8 w-8 text-orange-500" />
            </div>
            <div className="mt-4">
              <Button variant="outline" size="sm" onClick={handleNewScan}>
                Nouvelle session
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Tabs */}
      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Vue d'ensemble</TabsTrigger>
          <TabsTrigger value="emotions">Émotions</TabsTrigger>
          <TabsTrigger value="activities">Activités</TabsTrigger>
          <TabsTrigger value="insights">Insights</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Évolution émotionnelle</CardTitle>
                <CardDescription>Votre progression des 7 derniers jours</CardDescription>
              </CardHeader>
              <CardContent>
                {emotionData.length > 0 ? (
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={emotionData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" />
                      <YAxis />
                      <Tooltip />
                      <Line type="monotone" dataKey="score" stroke="#8884d8" strokeWidth={2} />
                    </LineChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="h-[300px] flex items-center justify-center text-muted-foreground">
                    <div className="text-center">
                      <Heart className="h-12 w-12 mx-auto mb-4 opacity-50" />
                      <p>Aucune donnée disponible</p>
                      <Button className="mt-4" onClick={handleNewScan}>
                        Commencer votre première analyse
                      </Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Activités récentes</CardTitle>
                <CardDescription>Vos dernières interactions</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentActivities.map((activity) => {
                    const IconComponent = activity.icon;
                    return (
                      <div key={activity.id} className="flex items-center gap-4 p-3 rounded-lg bg-muted/50">
                        <IconComponent className="h-8 w-8 text-primary" />
                        <div className="flex-1">
                          <p className="font-medium">{activity.description}</p>
                          <p className="text-sm text-muted-foreground">Il y a {activity.time}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="emotions" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Analyses émotionnelles</CardTitle>
              <CardDescription>Historique de vos scans émotionnels</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <Heart className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground mb-4">Explorez vos émotions en profondeur</p>
                <Button onClick={handleNewScan}>Commencer une analyse</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="activities" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Journal d'activités</CardTitle>
              <CardDescription>Toutes vos activités EmotionsCare</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentActivities.map((activity) => {
                  const IconComponent = activity.icon;
                  return (
                    <div key={activity.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center gap-4">
                        <IconComponent className="h-6 w-6 text-primary" />
                        <div>
                          <p className="font-medium">{activity.description}</p>
                          <p className="text-sm text-muted-foreground">Il y a {activity.time}</p>
                        </div>
                      </div>
                      <Button variant="outline" size="sm">Voir détails</Button>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="insights" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Insights personnalisés</CardTitle>
              <CardDescription>Recommandations basées sur vos données</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="p-4 bg-primary/10 rounded-lg">
                  <h3 className="font-medium text-primary mb-2">💡 Conseil du jour</h3>
                  <p className="text-sm">Votre score émotionnel est en hausse ! Continuez vos efforts et n'hésitez pas à partager vos succès.</p>
                </div>
                <div className="p-4 bg-blue-50 rounded-lg">
                  <h3 className="font-medium text-blue-700 mb-2">🎯 Objectif de la semaine</h3>
                  <p className="text-sm">Réalisez 5 check-ins émotionnels pour maintenir votre progression.</p>
                </div>
                <div className="p-4 bg-green-50 rounded-lg">
                  <h3 className="font-medium text-green-700 mb-2">🌟 Accomplissement</h3>
                  <p className="text-sm">Vous avez maintenu une série de 7 jours ! Félicitations pour votre régularité.</p>
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
