
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Building, 
  Users, 
  TrendingUp, 
  Calendar, 
  Target, 
  Brain,
  Music,
  MessageCircle,
  BarChart3,
  Clock
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import EmotionScanner from '@/components/scan/EmotionScanner';
import AICoach from '@/components/coach/AICoach';
import MusicTherapy from '@/components/music/MusicTherapy';
import LoadingAnimation from '@/components/ui/loading-animation';

interface B2BUserStats {
  emotionalScore: number;
  teamScore: number;
  weeklyProgress: number;
  totalScans: number;
  lastScanDate: string;
  workStressLevel: 'low' | 'medium' | 'high';
}

const B2BUserDashboardPage: React.FC = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [stats, setStats] = useState<B2BUserStats | null>(null);
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

      // Charger les données spécifiques B2B
      const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      const { data: emotions } = await supabase
        .from('emotions')
        .select('*')
        .eq('user_id', user.id)
        .order('date', { ascending: false })
        .limit(30);

      // Calculer les statistiques
      const avgScore = emotions?.length > 0 
        ? emotions.reduce((sum, e) => sum + (e.score || 0), 0) / emotions.length 
        : 0;

      const weeklyEmotions = emotions?.filter(e => 
        new Date(e.date) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
      ) || [];

      const weeklyAvg = weeklyEmotions.length > 0
        ? weeklyEmotions.reduce((sum, e) => sum + (e.score || 0), 0) / weeklyEmotions.length
        : 0;

      setStats({
        emotionalScore: Math.round(avgScore),
        teamScore: Math.round(avgScore + Math.random() * 20 - 10), // Simulé
        weeklyProgress: Math.round(weeklyAvg),
        totalScans: emotions?.length || 0,
        lastScanDate: emotions?.[0]?.date || new Date().toISOString(),
        workStressLevel: avgScore >= 70 ? 'low' : avgScore >= 40 ? 'medium' : 'high'
      });

    } catch (error) {
      console.error('B2B Dashboard data loading error:', error);
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
        <LoadingAnimation text="Chargement de votre espace collaborateur..." />
      </div>
    );
  }

  const getStressColor = (level: string) => {
    switch (level) {
      case 'low': return 'text-green-600 bg-green-50';
      case 'high': return 'text-red-600 bg-red-50';
      default: return 'text-yellow-600 bg-yellow-50';
    }
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Welcome Section */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">
            Espace Collaborateur - {user?.name || 'Utilisateur'}
          </h1>
          <p className="text-muted-foreground">
            Votre bien-être au travail avec EmotionsCare
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Building className="h-5 w-5 text-primary" />
          <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStressColor(stats?.workStressLevel || 'medium')}`}>
            Stress au travail: {stats?.workStressLevel === 'low' ? 'Faible' : stats?.workStressLevel === 'high' ? 'Élevé' : 'Modéré'}
          </span>
        </div>
      </div>

      {/* Quick Stats for B2B */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Mon Score</CardTitle>
              <Brain className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.emotionalScore}/100</div>
              <Progress value={stats.emotionalScore} className="mt-2" />
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Score Équipe</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.teamScore}/100</div>
              <p className="text-xs text-muted-foreground">Moyenne département</p>
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
              <CardTitle className="text-sm font-medium">Analyses</CardTitle>
              <BarChart3 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalScans}</div>
              <p className="text-xs text-muted-foreground">scans réalisés</p>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Main Content Tabs */}
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
            {/* Workplace Wellness */}
            <Card>
              <CardHeader>
                <CardTitle>Bien-être au Travail</CardTitle>
                <CardDescription>Votre équilibre professionnel aujourd'hui</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Charge de travail</span>
                    <Badge variant="outline">Modérée</Badge>
                  </div>
                  <Progress value={65} className="w-full" />
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Satisfaction</span>
                    <Badge className="bg-green-100 text-green-800">Élevée</Badge>
                  </div>
                  <Progress value={82} className="w-full" />
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Énergie</span>
                    <Badge className="bg-yellow-100 text-yellow-800">Moyenne</Badge>
                  </div>
                  <Progress value={58} className="w-full" />
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions for B2B */}
            <Card>
              <CardHeader>
                <CardTitle>Actions Rapides</CardTitle>
                <CardDescription>Outils adaptés à votre environnement professionnel</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  <Button 
                    variant="outline" 
                    className="h-20 flex flex-col gap-2"
                    onClick={() => setActiveTab('scan')}
                  >
                    <Brain className="h-6 w-6" />
                    Check-in Émotionnel
                  </Button>
                  
                  <Button 
                    variant="outline" 
                    className="h-20 flex flex-col gap-2"
                    onClick={() => setActiveTab('coach')}
                  >
                    <MessageCircle className="h-6 w-6" />
                    Coach Pro
                  </Button>
                  
                  <Button 
                    variant="outline" 
                    className="h-20 flex flex-col gap-2"
                    onClick={() => setActiveTab('music')}
                  >
                    <Music className="h-6 w-6" />
                    Pause Musicale
                  </Button>
                  
                  <Button 
                    variant="outline" 
                    className="h-20 flex flex-col gap-2"
                    onClick={() => setActiveTab('team')}
                  >
                    <Users className="h-6 w-6" />
                    Mon Équipe
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Daily Tips */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5" />
                Conseil du Jour
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="bg-primary/5 border border-primary/20 rounded-lg p-4">
                <h4 className="font-medium mb-2">Technique de respiration au bureau</h4>
                <p className="text-sm text-muted-foreground mb-3">
                  Prenez 2 minutes pour pratiquer la respiration 4-7-8 : inspirez 4 secondes, 
                  retenez 7 secondes, expirez 8 secondes. Parfait pour réduire le stress entre deux réunions.
                </p>
                <Button size="sm" variant="outline">
                  Commencer l'exercice
                </Button>
              </div>
            </CardContent>
          </Card>
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
                Bien-être de l'Équipe
              </CardTitle>
              <CardDescription>Aperçu anonymisé du climat émotionnel de votre équipe</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="text-center p-4 bg-green-50 rounded-lg">
                    <div className="text-2xl font-bold text-green-600">78%</div>
                    <div className="text-sm text-green-700">Équipe satisfaite</div>
                  </div>
                  <div className="text-center p-4 bg-blue-50 rounded-lg">
                    <div className="text-2xl font-bold text-blue-600">65%</div>
                    <div className="text-sm text-blue-700">Niveau d'énergie</div>
                  </div>
                  <div className="text-center p-4 bg-yellow-50 rounded-lg">
                    <div className="text-2xl font-bold text-yellow-600">32%</div>
                    <div className="text-sm text-yellow-700">Stress modéré</div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="font-medium">Initiatives Bien-être</h4>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                      <span className="text-sm">Session méditation équipe</span>
                      <Badge>Vendredi 15h</Badge>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                      <span className="text-sm">Atelier gestion du stress</span>
                      <Badge variant="outline">Prochainement</Badge>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                      <span className="text-sm">Challenge bien-être mensuel</span>
                      <Badge className="bg-green-100 text-green-800">En cours</Badge>
                    </div>
                  </div>
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
