
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { Activity, Heart, MessageCircle, Users, TrendingUp, Calendar, BarChart3 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { Badge } from '@/components/ui/badge';

interface SocialActivity {
  id: string;
  user_id: string;
  content: string;
  reactions: number;
  created_at: string;
  user?: {
    name: string;
    email: string;
  };
}

interface EmotionData {
  id: string;
  user_id: string;
  score: number;
  emojis: string;
  date: string;
  user?: {
    name: string;
  };
}

const B2BAdminSocialPage: React.FC = () => {
  const navigate = useNavigate();
  const [socialActivities, setSocialActivities] = useState<SocialActivity[]>([]);
  const [emotionData, setEmotionData] = useState<EmotionData[]>([]);
  const [stats, setStats] = useState({
    totalPosts: 0,
    totalReactions: 0,
    averageMood: 0,
    activeUsers: 0
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadSocialData();
  }, []);

  const loadSocialData = async () => {
    try {
      setIsLoading(true);

      // Charger les posts sociaux
      const { data: posts } = await supabase
        .from('posts')
        .select(`
          *,
          profiles:user_id (
            name,
            email
          )
        `)
        .order('date', { ascending: false })
        .limit(10);

      // Charger les données émotionnelles
      const { data: emotions } = await supabase
        .from('emotions')
        .select(`
          *,
          profiles:user_id (
            name
          )
        `)
        .order('date', { ascending: false })
        .limit(20);

      if (posts) {
        setSocialActivities(posts.map(post => ({
          ...post,
          user: post.profiles
        })));
      }

      if (emotions) {
        setEmotionData(emotions.map(emotion => ({
          ...emotion,
          user: emotion.profiles
        })));
      }

      // Calculer les statistiques
      const totalReactions = posts?.reduce((sum, post) => sum + (post.reactions || 0), 0) || 0;
      const averageMood = emotions?.length 
        ? emotions.reduce((sum, emotion) => sum + (emotion.score || 0), 0) / emotions.length 
        : 0;

      setStats({
        totalPosts: posts?.length || 0,
        totalReactions,
        averageMood: Math.round(averageMood * 10) / 10,
        activeUsers: [...new Set(posts?.map(p => p.user_id) || [])].length
      });

    } catch (error) {
      console.error('Erreur lors du chargement des données sociales:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getMoodColor = (score: number) => {
    if (score >= 4) return 'text-green-600 bg-green-50';
    if (score >= 3) return 'text-yellow-600 bg-yellow-50';
    return 'text-red-600 bg-red-50';
  };

  const getMoodLabel = (score: number) => {
    if (score >= 4) return 'Excellent';
    if (score >= 3) return 'Bon';
    if (score >= 2) return 'Moyen';
    return 'Difficile';
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted p-4">
      <div className="container mx-auto max-w-6xl">
        <header className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-2">
              <Activity className="h-8 w-8 text-primary" />
              Analyse Sociale & Émotionnelle
            </h1>
            <p className="text-muted-foreground mt-1">
              Observez le bien-être et l'engagement de votre organisation
            </p>
          </div>
          <Button onClick={() => navigate('/b2b/admin/dashboard')} variant="outline">
            Retour au tableau de bord
          </Button>
        </header>

        {/* Statistiques principales */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Posts Partagés</CardTitle>
              <MessageCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{isLoading ? '...' : stats.totalPosts}</div>
              <p className="text-xs text-muted-foreground">Cette semaine</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Réactions</CardTitle>
              <Heart className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{isLoading ? '...' : stats.totalReactions}</div>
              <p className="text-xs text-muted-foreground">Total</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Humeur Moyenne</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{isLoading ? '...' : `${stats.averageMood}/5`}</div>
              <p className="text-xs text-muted-foreground">Échelle de bien-être</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Utilisateurs Actifs</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{isLoading ? '...' : stats.activeUsers}</div>
              <p className="text-xs text-muted-foreground">Participants</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Activités sociales récentes */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageCircle className="h-5 w-5" />
                Activités Sociales Récentes
              </CardTitle>
              <CardDescription>
                Derniers posts et interactions de votre équipe
              </CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary mx-auto"></div>
                  <p className="mt-2 text-sm text-muted-foreground">Chargement...</p>
                </div>
              ) : socialActivities.length === 0 ? (
                <div className="text-center py-8">
                  <MessageCircle className="h-12 w-12 text-muted-foreground mx-auto mb-2" />
                  <p className="text-muted-foreground">Aucune activité récente</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {socialActivities.map((activity) => (
                    <div key={activity.id} className="border-b pb-4 last:border-b-0">
                      <div className="flex items-start gap-3">
                        <div className="h-8 w-8 bg-primary/10 rounded-full flex items-center justify-center">
                          <span className="text-xs font-medium text-primary">
                            {activity.user?.name?.charAt(0) || 'U'}
                          </span>
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-medium text-sm">
                              {activity.user?.name || 'Utilisateur anonyme'}
                            </span>
                            <span className="text-xs text-muted-foreground">
                              {new Date(activity.created_at).toLocaleDateString()}
                            </span>
                          </div>
                          <p className="text-sm text-muted-foreground mb-2">
                            {activity.content}
                          </p>
                          <div className="flex items-center gap-2">
                            <div className="flex items-center gap-1 text-xs text-muted-foreground">
                              <Heart className="h-3 w-3" />
                              {activity.reactions} réactions
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Suivi émotionnel */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5" />
                Suivi Émotionnel
              </CardTitle>
              <CardDescription>
                État émotionnel récent de vos collaborateurs
              </CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary mx-auto"></div>
                  <p className="mt-2 text-sm text-muted-foreground">Chargement...</p>
                </div>
              ) : emotionData.length === 0 ? (
                <div className="text-center py-8">
                  <BarChart3 className="h-12 w-12 text-muted-foreground mx-auto mb-2" />
                  <p className="text-muted-foreground">Aucune donnée émotionnelle</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {emotionData.slice(0, 8).map((emotion) => (
                    <div key={emotion.id} className="flex items-center justify-between p-3 rounded-lg border">
                      <div className="flex items-center gap-3">
                        <div className="h-8 w-8 bg-primary/10 rounded-full flex items-center justify-center">
                          <span className="text-xs font-medium text-primary">
                            {emotion.user?.name?.charAt(0) || 'U'}
                          </span>
                        </div>
                        <div>
                          <p className="font-medium text-sm">
                            {emotion.user?.name || 'Utilisateur anonyme'}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {new Date(emotion.date).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {emotion.emojis && (
                          <span className="text-lg">{emotion.emojis}</span>
                        )}
                        <Badge 
                          variant="outline" 
                          className={getMoodColor(emotion.score)}
                        >
                          {getMoodLabel(emotion.score)}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default B2BAdminSocialPage;
