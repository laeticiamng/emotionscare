
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { 
  Heart, 
  Brain, 
  Music, 
  BookOpen, 
  Scan, 
  TrendingUp, 
  Calendar,
  Award,
  Target,
  Smile,
  Activity,
  Plus
} from 'lucide-react';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

const B2CDashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [stats, setStats] = useState({
    totalScans: 0,
    weeklyProgress: 0,
    currentStreak: 0,
    lastEmotion: 'Neutre'
  });

  const [recentActivities, setRecentActivities] = useState([]);

  useEffect(() => {
    loadDashboardData();
  }, [user]);

  const loadDashboardData = async () => {
    if (!user) return;
    
    setIsLoading(true);
    try {
      // Simuler le chargement des données
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setStats({
        totalScans: 12,
        weeklyProgress: 75,
        currentStreak: 5,
        lastEmotion: 'Joyeux'
      });

      setRecentActivities([
        { id: 1, type: 'scan', timestamp: new Date(), emotion: 'Joyeux' },
        { id: 2, type: 'music', timestamp: new Date(Date.now() - 3600000), title: 'Session de relaxation' },
        { id: 3, type: 'journal', timestamp: new Date(Date.now() - 7200000), title: 'Réflexion du jour' }
      ]);
    } catch (error) {
      toast.error('Erreur lors du chargement des données');
    } finally {
      setIsLoading(false);
    }
  };

  const quickActions = [
    {
      title: 'Scanner mes émotions',
      description: 'Analyser votre état émotionnel actuel',
      icon: Scan,
      action: () => navigate('/scan'),
      color: 'bg-blue-500'
    },
    {
      title: 'Coach IA',
      description: 'Obtenir des conseils personnalisés',
      icon: Brain,
      action: () => navigate('/coach'),
      color: 'bg-purple-500'
    },
    {
      title: 'Musique thérapeutique',
      description: 'Écouter des mélodies apaisantes',
      icon: Music,
      action: () => navigate('/music'),
      color: 'bg-green-500'
    },
    {
      title: 'Journal personnel',
      description: 'Écrire et réfléchir',
      icon: BookOpen,
      action: () => navigate('/journal'),
      color: 'bg-orange-500'
    }
  ];

  const getDayMessage = () => {
    const hour = new Date().getHours();
    const name = user?.user_metadata?.name || 'Utilisateur';
    
    if (hour < 12) return `Bonjour ${name} !`;
    if (hour < 18) return `Bon après-midi ${name} !`;
    return `Bonsoir ${name} !`;
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Chargement de votre tableau de bord...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* En-tête de bienvenue */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-8"
      >
        <h1 className="text-3xl font-bold mb-2">{getDayMessage()}</h1>
        <p className="text-muted-foreground">
          Comment vous sentez-vous aujourd'hui ? Explorons ensemble votre bien-être émotionnel.
        </p>
      </motion.div>

      {/* Statistiques rapides */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Analyses totales</p>
                <p className="text-2xl font-bold">{stats.totalScans}</p>
              </div>
              <Activity className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Progression</p>
                <p className="text-2xl font-bold">{stats.weeklyProgress}%</p>
              </div>
              <TrendingUp className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Série actuelle</p>
                <p className="text-2xl font-bold">{stats.currentStreak} jours</p>
              </div>
              <Award className="h-8 w-8 text-orange-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Dernière émotion</p>
                <p className="text-lg font-semibold">{stats.lastEmotion}</p>
              </div>
              <Smile className="h-8 w-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="actions" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="actions">Actions rapides</TabsTrigger>
          <TabsTrigger value="progress">Progression</TabsTrigger>
          <TabsTrigger value="activities">Activités récentes</TabsTrigger>
        </TabsList>

        <TabsContent value="actions" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {quickActions.map((action, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="cursor-pointer hover:shadow-lg transition-shadow" onClick={action.action}>
                  <CardContent className="p-6">
                    <div className="flex items-start space-x-4">
                      <div className={`p-3 rounded-lg ${action.color}`}>
                        <action.icon className="h-6 w-6 text-white" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold mb-1">{action.title}</h3>
                        <p className="text-sm text-muted-foreground">{action.description}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="progress" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Votre progression cette semaine</CardTitle>
              <CardDescription>
                Suivez votre évolution émotionnelle au fil du temps
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Objectif hebdomadaire</span>
                  <Badge variant="secondary">{stats.weeklyProgress}% atteint</Badge>
                </div>
                <div className="w-full bg-muted rounded-full h-2">
                  <div 
                    className="bg-primary h-2 rounded-full transition-all" 
                    style={{ width: `${stats.weeklyProgress}%` }}
                  ></div>
                </div>
                <p className="text-sm text-muted-foreground">
                  Excellent travail ! Vous êtes sur la bonne voie pour atteindre vos objectifs.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="activities" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Activités récentes</CardTitle>
              <CardDescription>
                Vos dernières interactions avec EmotionsCare
              </CardDescription>
            </CardHeader>
            <CardContent>
              {recentActivities.length > 0 ? (
                <div className="space-y-4">
                  {recentActivities.map((activity: any) => (
                    <div key={activity.id} className="flex items-center space-x-3 p-3 bg-muted/50 rounded-lg">
                      <div className="w-2 h-2 bg-primary rounded-full"></div>
                      <div className="flex-1">
                        <p className="text-sm font-medium">
                          {activity.type === 'scan' && `Scan émotionnel - ${activity.emotion}`}
                          {activity.type === 'music' && activity.title}
                          {activity.type === 'journal' && activity.title}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {activity.timestamp.toLocaleString()}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">Aucune activité récente</p>
                  <Button onClick={() => navigate('/scan')} className="mt-4">
                    <Plus className="h-4 w-4 mr-2" />
                    Commencer une analyse
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default B2CDashboardPage;
