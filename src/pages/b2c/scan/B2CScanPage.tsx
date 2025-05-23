
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
  Calendar,
  Heart,
  BarChart3
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

const B2CScanPage: React.FC = () => {
  const { user, logout } = useAuth();
  const { setUserMode } = useUserMode();
  const navigate = useNavigate();
  const [showScanForm, setShowScanForm] = useState(false);
  const [emotions, setEmotions] = useState<EmotionResult[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [stats, setStats] = useState({
    totalScans: 0,
    averageScore: 0,
    lastScan: null as string | null,
    trend: 'stable' as 'up' | 'down' | 'stable'
  });

  useEffect(() => {
    setUserMode('b2c');
    fetchEmotions();
  }, [setUserMode]);

  const fetchEmotions = async () => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('emotions')
        .select('*')
        .eq('user_id', user?.id)
        .order('date', { ascending: false });

      if (error) throw error;

      setEmotions(data || []);
      calculateStats(data || []);
    } catch (error) {
      console.error('Error fetching emotions:', error);
      toast.error('Erreur lors du chargement des analyses');
    } finally {
      setIsLoading(false);
    }
  };

  const calculateStats = (emotionData: EmotionResult[]) => {
    if (emotionData.length === 0) {
      setStats({
        totalScans: 0,
        averageScore: 0,
        lastScan: null,
        trend: 'stable'
      });
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

    setStats({
      totalScans,
      averageScore: Math.round(averageScore),
      lastScan,
      trend
    });
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

      toast.success('Analyse enregistrée avec succès !');
      setShowScanForm(false);
      fetchEmotions();
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
            <Button variant="ghost" onClick={() => navigate('/b2c/dashboard')}>
              ← Tableau de bord
            </Button>
            <h1 className="text-xl font-bold">Scanner d'émotions B2C</h1>
          </div>
          <div className="flex items-center space-x-4">
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
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total Analyses</p>
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
                  <p className="text-sm font-medium text-muted-foreground">Score Moyen</p>
                  <p className="text-2xl font-bold">{stats.averageScore}%</p>
                </div>
                <Heart className="h-8 w-8 text-red-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Tendance</p>
                  <p className="text-2xl font-bold capitalize">{stats.trend === 'up' ? 'Positive' : stats.trend === 'down' ? 'Négative' : 'Stable'}</p>
                </div>
                {getTrendIcon(stats.trend)}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Dernière Analyse</p>
                  <p className="text-sm font-bold">
                    {stats.lastScan ? new Date(stats.lastScan).toLocaleDateString('fr-FR') : 'Jamais'}
                  </p>
                </div>
                <Calendar className="h-8 w-8 text-purple-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="scan" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="scan">
              <Brain className="h-4 w-4 mr-2" />
              Nouvelle Analyse
            </TabsTrigger>
            <TabsTrigger value="history">
              <History className="h-4 w-4 mr-2" />
              Historique
            </TabsTrigger>
          </TabsList>

          <TabsContent value="scan" className="space-y-6">
            {!showScanForm && (
              <Card>
                <CardHeader>
                  <CardTitle>Analyser vos émotions</CardTitle>
                  <CardDescription>
                    Choisissez votre méthode d'analyse préférée pour évaluer votre état émotionnel
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Button 
                    onClick={() => setShowScanForm(true)}
                    className="w-full"
                    size="lg"
                  >
                    <Brain className="h-5 w-5 mr-2" />
                    Commencer une nouvelle analyse
                  </Button>
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
                    Commencez votre première analyse pour voir votre historique
                  </p>
                  <Button onClick={() => setShowScanForm(true)}>
                    Première analyse
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
                            Analyse du {new Date(emotion.date).toLocaleDateString('fr-FR')}
                          </CardTitle>
                          <CardDescription>
                            {new Date(emotion.date).toLocaleTimeString('fr-FR')}
                          </CardDescription>
                        </div>
                        <Badge className={getScoreColor(emotion.score)}>
                          {emotion.score}%
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {emotion.text && (
                        <div>
                          <p className="font-medium text-sm mb-2">Texte analysé :</p>
                          <p className="text-sm bg-muted p-3 rounded">{emotion.text}</p>
                        </div>
                      )}
                      
                      {emotion.emojis && (
                        <div>
                          <p className="font-medium text-sm mb-2">Émojis sélectionnés :</p>
                          <p className="text-2xl">{emotion.emojis}</p>
                        </div>
                      )}
                      
                      {emotion.ai_feedback && (
                        <div>
                          <p className="font-medium text-sm mb-2">Analyse IA :</p>
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
        </Tabs>
      </div>
    </div>
  );
};

export default B2CScanPage;
