
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import EmotionScanForm from '@/components/scan/EmotionScanForm';
import { Brain, History, TrendingUp, Plus, Building2, Users } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { EmotionResult } from '@/types/emotion';
import { useToast } from '@/hooks/use-toast';
import LoadingAnimation from '@/components/ui/loading-animation';

interface EmotionEntry {
  id: string;
  user_id: string;
  text?: string;
  emojis?: string;
  audio_url?: string;
  score?: number;
  ai_feedback?: string;
  date: string;
}

const B2BUserScanPage: React.FC = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [showScanForm, setShowScanForm] = useState(false);
  const [emotions, setEmotions] = useState<EmotionEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [stats, setStats] = useState({
    totalScans: 0,
    averageScore: 0,
    lastScan: null as string | null,
    weeklyScans: 0
  });

  useEffect(() => {
    if (user) {
      fetchEmotions();
    }
  }, [user]);

  const fetchEmotions = async () => {
    if (!user) return;

    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('emotions')
        .select('*')
        .eq('user_id', user.id)
        .order('date', { ascending: false })
        .limit(20);

      if (error) {
        throw error;
      }

      setEmotions(data || []);
      
      // Calculer les statistiques
      if (data && data.length > 0) {
        const scores = data.filter(e => e.score !== null).map(e => e.score!);
        const avgScore = scores.length > 0 ? scores.reduce((a, b) => a + b, 0) / scores.length : 0;
        
        // Scans de la semaine
        const oneWeekAgo = new Date();
        oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
        const weeklyEmotions = data.filter(e => new Date(e.date) >= oneWeekAgo);
        
        setStats({
          totalScans: data.length,
          averageScore: Math.round(avgScore * 10) / 10,
          lastScan: data[0]?.date || null,
          weeklyScans: weeklyEmotions.length
        });
      }
    } catch (error: any) {
      console.error('Error fetching emotions:', error);
      toast({
        title: "Erreur",
        description: "Impossible de charger l'historique des scans",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleScanComplete = async (result: EmotionResult) => {
    try {
      const { error } = await supabase
        .from('emotions')
        .insert([{
          user_id: user?.id,
          text: result.text,
          emojis: result.emojis,
          audio_url: result.audioUrl,
          score: result.score,
          ai_feedback: result.feedback
        }]);

      if (error) {
        throw error;
      }

      toast({
        title: "Analyse complétée !",
        description: "Votre scan émotionnel a été sauvegardé et partagé avec votre équipe (de manière anonyme).",
        variant: "success"
      });

      setShowScanForm(false);
      fetchEmotions(); // Recharger la liste
    } catch (error: any) {
      console.error('Error saving emotion:', error);
      toast({
        title: "Erreur",
        description: "Impossible de sauvegarder le scan",
        variant: "destructive"
      });
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
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

  if (isLoading) {
    return (
      <div className="flex h-[calc(100vh-4rem)] items-center justify-center">
        <LoadingAnimation text="Chargement de vos analyses..." />
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Brain className="h-8 w-8 text-blue-600" />
            Scanner d'émotions - Collaborateur
          </h1>
          <p className="text-muted-foreground mt-1 flex items-center gap-2">
            <Building2 className="h-4 w-4" />
            Analysez vos émotions dans un contexte professionnel
          </p>
        </div>
        {!showScanForm && (
          <Button 
            onClick={() => setShowScanForm(true)}
            className="bg-blue-600 hover:bg-blue-700"
          >
            <Plus className="h-4 w-4 mr-2" />
            Nouveau scan
          </Button>
        )}
      </div>

      {showScanForm ? (
        <div className="space-y-4">
          <Card className="border-blue-200 bg-blue-50">
            <CardContent className="p-4">
              <div className="flex items-center gap-2 text-blue-800">
                <Users className="h-5 w-5" />
                <p className="text-sm">
                  <strong>Mode collaborateur :</strong> Votre analyse sera anonymisée et contribuera aux statistiques d'équipe pour améliorer le bien-être collectif.
                </p>
              </div>
            </CardContent>
          </Card>
          
          <EmotionScanForm 
            onComplete={handleScanComplete} 
            onClose={() => setShowScanForm(false)} 
          />
        </div>
      ) : (
        <Tabs defaultValue="dashboard" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="dashboard">
              <TrendingUp className="h-4 w-4 mr-2" />
              Mon tableau de bord
            </TabsTrigger>
            <TabsTrigger value="history">
              <History className="h-4 w-4 mr-2" />
              Mes analyses
            </TabsTrigger>
            <TabsTrigger value="team-insights">
              <Users className="h-4 w-4 mr-2" />
              Insights équipe
            </TabsTrigger>
          </TabsList>

          <TabsContent value="dashboard" className="space-y-6">
            {/* Statistiques personnelles */}
            <div className="grid md:grid-cols-4 gap-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Mes scans</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.totalScans}</div>
                  <p className="text-xs text-muted-foreground">+{stats.weeklyScans} cette semaine</p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Mon score moyen</CardTitle>
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
                  <CardTitle className="text-sm font-medium">Équipe</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-green-600">7.2/10</div>
                  <p className="text-xs text-muted-foreground">Moral général positif</p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Objectif</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">3/5</div>
                  <p className="text-xs text-muted-foreground">Scans hebdomadaires</p>
                </CardContent>
              </Card>
            </div>

            {/* Conseils contextuels pour le travail */}
            <div className="grid md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Mes dernières analyses</CardTitle>
                  <CardDescription>Suivi de votre bien-être au travail</CardDescription>
                </CardHeader>
                <CardContent>
                  {emotions.length === 0 ? (
                    <div className="text-center py-8">
                      <Brain className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                      <p className="text-muted-foreground">Aucune analyse pour le moment</p>
                      <Button 
                        onClick={() => setShowScanForm(true)}
                        className="mt-4"
                      >
                        Faire votre première analyse
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {emotions.slice(0, 5).map((emotion) => (
                        <div key={emotion.id} className="border-l-4 border-blue-500 pl-4 py-2">
                          <div className="flex justify-between items-start">
                            <div className="flex-1">
                              <p className="text-sm text-muted-foreground">
                                {formatDate(emotion.date)}
                              </p>
                              {emotion.text && (
                                <p className="mt-1 text-sm">{emotion.text.substring(0, 100)}...</p>
                              )}
                              {emotion.emojis && (
                                <p className="mt-1 text-lg">{emotion.emojis}</p>
                              )}
                            </div>
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
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Conseils bien-être au travail</CardTitle>
                  <CardDescription>Recommandations personnalisées</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="p-4 bg-blue-50 rounded-lg">
                    <h4 className="font-semibold text-blue-900 mb-2">🎯 Objectif de la semaine</h4>
                    <p className="text-sm text-blue-800">
                      Réalisez 5 analyses émotionnelles pour mieux gérer votre stress professionnel.
                    </p>
                  </div>
                  
                  <div className="p-4 bg-green-50 rounded-lg">
                    <h4 className="font-semibold text-green-900 mb-2">💪 Gestion du stress</h4>
                    <p className="text-sm text-green-800">
                      Prenez une pause de 5 minutes toutes les 2 heures pour maintenir votre concentration.
                    </p>
                  </div>
                  
                  <div className="p-4 bg-purple-50 rounded-lg">
                    <h4 className="font-semibold text-purple-900 mb-2">🤝 Équipe</h4>
                    <p className="text-sm text-purple-800">
                      Participez aux échanges d'équipe pour renforcer la cohésion et le soutien mutuel.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="history" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Historique complet de mes analyses</CardTitle>
                <CardDescription>Toutes vos analyses émotionnelles professionnelles</CardDescription>
              </CardHeader>
              <CardContent>
                {emotions.length === 0 ? (
                  <div className="text-center py-8">
                    <Brain className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                    <p className="text-muted-foreground">Commencez votre suivi émotionnel</p>
                    <Button 
                      onClick={() => setShowScanForm(true)}
                      className="mt-4"
                    >
                      Faire votre première analyse
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {emotions.map((emotion) => (
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
                            <strong>Contexte:</strong> {emotion.text}
                          </div>
                        )}
                        
                        {emotion.emojis && (
                          <div className="mb-2">
                            <strong>Ressenti:</strong> <span className="text-lg">{emotion.emojis}</span>
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

          <TabsContent value="team-insights" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Insights équipe (anonymes)</CardTitle>
                <CardDescription>Vue d'ensemble du bien-être collectif</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid md:grid-cols-3 gap-4">
                  <div className="text-center p-4 bg-green-50 rounded-lg">
                    <div className="text-2xl font-bold text-green-600 mb-1">7.2/10</div>
                    <p className="text-sm text-green-800">Moral général</p>
                  </div>
                  
                  <div className="text-center p-4 bg-blue-50 rounded-lg">
                    <div className="text-2xl font-bold text-blue-600 mb-1">85%</div>
                    <p className="text-sm text-blue-800">Participation</p>
                  </div>
                  
                  <div className="text-center p-4 bg-purple-50 rounded-lg">
                    <div className="text-2xl font-bold text-purple-600 mb-1">↗️ +12%</div>
                    <p className="text-sm text-purple-800">Évolution ce mois</p>
                  </div>
                </div>

                <div className="p-4 bg-yellow-50 rounded-lg border-l-4 border-yellow-400">
                  <h4 className="font-semibold text-yellow-900 mb-2">📊 Tendances équipe</h4>
                  <ul className="text-sm text-yellow-800 space-y-1">
                    <li>• Le moral de l'équipe est globalement positif</li>
                    <li>• Les lundis matins montrent des scores plus bas</li>
                    <li>• Les après-midis sont généralement plus productifs émotionnellement</li>
                    <li>• Les projets collaboratifs augmentent le bien-être</li>
                  </ul>
                </div>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Recommandations pour l'équipe</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="p-3 bg-blue-50 rounded">
                      <strong className="text-blue-900">💼 Gestion du lundi :</strong>
                      <p className="text-sm text-blue-800 mt-1">
                        Organiser des réunions d'équipe positives le lundi matin pour commencer la semaine sur une bonne note.
                      </p>
                    </div>
                    
                    <div className="p-3 bg-green-50 rounded">
                      <strong className="text-green-900">🤝 Collaboration :</strong>
                      <p className="text-sm text-green-800 mt-1">
                        Encourager plus de projets en binôme ou en petites équipes pour maintenir la motivation.
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      )}
    </div>
  );
};

export default B2BUserScanPage;
