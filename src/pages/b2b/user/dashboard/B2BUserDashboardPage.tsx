
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { 
  BarChart3, 
  Users, 
  Heart, 
  TrendingUp, 
  Calendar, 
  MessageSquare, 
  Target,
  Clock,
  Building,
  Activity
} from 'lucide-react';
import LoadingAnimation from '@/components/ui/loading-animation';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';

const B2BUserDashboardPage: React.FC = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [stats, setStats] = useState({
    emotionalScore: 75,
    teamAverage: 68,
    weeklyCheckins: 5,
    totalTeamMembers: 12,
    lastUpdate: new Date().toLocaleDateString('fr-FR')
  });

  const [emotionData, setEmotionData] = useState([]);
  const [teamData, setTeamData] = useState([]);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setIsLoading(true);
      
      // Simuler le chargement des données
      setTimeout(() => {
        const mockEmotionData = [
          { date: '01/12', score: 65, team: 60 },
          { date: '02/12', score: 72, team: 65 },
          { date: '03/12', score: 68, team: 63 },
          { date: '04/12', score: 75, team: 68 },
          { date: '05/12', score: 78, team: 70 },
          { date: '06/12', score: 73, team: 67 },
          { date: '07/12', score: 80, team: 72 }
        ];

        const mockTeamData = [
          { name: 'Marketing', score: 78, members: 5 },
          { name: 'Développement', score: 72, members: 8 },
          { name: 'Commercial', score: 65, members: 4 },
          { name: 'Support', score: 82, members: 3 }
        ];

        setEmotionData(mockEmotionData);
        setTeamData(mockTeamData);
        setIsLoading(false);
      }, 1000);

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
          <h1 className="text-3xl font-bold">Tableau de bord collaborateur</h1>
          <p className="text-muted-foreground">
            Bonjour {user?.name || 'Collaborateur'}, voici votre vue d'ensemble
          </p>
        </div>
        <Badge variant="outline" className="flex items-center gap-2">
          <Building className="h-4 w-4" />
          Mode Collaborateur
        </Badge>
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
                <p className="text-sm font-medium text-muted-foreground">Moyenne équipe</p>
                <p className="text-2xl font-bold">{stats.teamAverage}/100</p>
              </div>
              <Users className="h-8 w-8 text-blue-500" />
            </div>
            <div className="mt-4 flex items-center text-sm text-muted-foreground">
              <Activity className="h-4 w-4 mr-1" />
              {stats.totalTeamMembers} membres
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
              <Calendar className="h-8 w-8 text-green-500" />
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
                <p className="text-sm font-medium text-muted-foreground">Dernière activité</p>
                <p className="text-sm font-bold">{stats.lastUpdate}</p>
              </div>
              <Clock className="h-8 w-8 text-orange-500" />
            </div>
            <div className="mt-4">
              <Button variant="outline" size="sm">
                Nouveau scan
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
          <TabsTrigger value="team">Équipe</TabsTrigger>
          <TabsTrigger value="activities">Activités</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Évolution émotionnelle</CardTitle>
                <CardDescription>Votre progression vs moyenne équipe</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={emotionData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Line type="monotone" dataKey="score" stroke="#8884d8" name="Votre score" />
                    <Line type="monotone" dataKey="team" stroke="#82ca9d" name="Moyenne équipe" />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Performance par équipe</CardTitle>
                <CardDescription>Scores de bien-être par département</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={teamData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="score" fill="#8884d8" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="emotions" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Analyse émotionnelle détaillée</CardTitle>
              <CardDescription>Vos dernières analyses et recommandations</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="text-center py-8">
                  <Heart className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">Aucune analyse récente</p>
                  <Button className="mt-4">Faire une nouvelle analyse</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="team" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Vue équipe</CardTitle>
              <CardDescription>Données agrégées de votre équipe</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {teamData.map((team) => (
                  <div key={team.name} className="p-4 border rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-medium">{team.name}</h3>
                      <Badge variant="outline">{team.members} membres</Badge>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="flex-1 bg-muted rounded-full h-2">
                        <div 
                          className="bg-primary h-2 rounded-full" 
                          style={{ width: `${team.score}%` }}
                        />
                      </div>
                      <span className="text-sm font-medium">{team.score}%</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="activities" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Activités récentes</CardTitle>
              <CardDescription>Vos dernières interactions avec EmotionsCare</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="text-center py-8">
                  <MessageSquare className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">Aucune activité récente</p>
                  <Button variant="outline" className="mt-4">Voir toutes les activités</Button>
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
