
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import EmotionScanForm from '@/components/scan/EmotionScanForm';
import { Brain, History, TrendingUp, Plus } from 'lucide-react';
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

const B2CScanPage: React.FC = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [showScanForm, setShowScanForm] = useState(false);
  const [emotions, setEmotions] = useState<EmotionEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [stats, setStats] = useState({
    totalScans: 0,
    averageScore: 0,
    lastScan: null as string | null
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
        .limit(10);

      if (error) {
        throw error;
      }

      setEmotions(data || []);
      
      // Calculer les statistiques
      if (data && data.length > 0) {
        const scores = data.filter(e => e.score !== null).map(e => e.score!);
        const avgScore = scores.length > 0 ? scores.reduce((a, b) => a + b, 0) / scores.length : 0;
        
        setStats({
          totalScans: data.length,
          averageScore: Math.round(avgScore * 10) / 10,
          lastScan: data[0]?.date || null
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
        title: "Scan terminé !",
        description: "Votre analyse émotionnelle a été sauvegardée.",
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
        <LoadingAnimation text="Chargement de vos scans..." />
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Brain className="h-8 w-8 text-blue-600" />
            Scanner d'émotions
          </h1>
          <p className="text-muted-foreground mt-1">
            Analysez et suivez vos émotions pour améliorer votre bien-être
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
        <EmotionScanForm 
          onComplete={handleScanComplete} 
          onClose={() => setShowScanForm(false)} 
        />
      ) : (
        <Tabs defaultValue="dashboard" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="dashboard">
              <TrendingUp className="h-4 w-4 mr-2" />
              Tableau de bord
            </TabsTrigger>
            <TabsTrigger value="history">
              <History className="h-4 w-4 mr-2" />
              Historique
            </TabsTrigger>
            <TabsTrigger value="insights">
              <Brain className="h-4 w-4 mr-2" />
              Insights
            </TabsTrigger>
          </TabsList>

          <TabsContent value="dashboard" className="space-y-6">
            {/* Statistiques */}
            <div className="grid md:grid-cols-3 gap-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Total des scans</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.totalScans}</div>
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
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Dernier scan</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {stats.lastScan ? 
                      new Date(stats.lastScan).toLocaleDateString('fr-FR') : 
                      'Aucun'
                    }
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Derniers scans */}
            {emotions.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Derniers scans</CardTitle>
                  <CardDescription>Vos 5 dernières analyses émotionnelles</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {emotions.slice(0, 5).map((emotion) => (
                    <div key={emotion.id} className="border-l-4 border-blue-500 pl-4 py-2">
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <p className="text-sm text-muted-foreground">
                            {formatDate(emotion.date)}
                          </p>
                          {emotion.text && (
                            <p className="mt-1 text-sm">{emotion.text}</p>
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
                      {emotion.ai_feedback && (
                        <div className="mt-2 p-2 bg-muted rounded text-sm">
                          <strong>IA:</strong> {emotion.ai_feedback}
                        </div>
                      )}
                    </div>
                  ))}
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="history" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Historique complet</CardTitle>
                <CardDescription>Toutes vos analyses émotionnelles</CardDescription>
              </CardHeader>
              <CardContent>
                {emotions.length === 0 ? (
                  <div className="text-center py-8">
                    <Brain className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                    <p className="text-muted-foreground">Aucun scan effectué pour le moment</p>
                    <Button 
                      onClick={() => setShowScanForm(true)}
                      className="mt-4"
                    >
                      Faire votre premier scan
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

          <TabsContent value="insights" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Insights et recommandations</CardTitle>
                <CardDescription>Analyse de vos tendances émotionnelles</CardDescription>
              </CardHeader>
              <CardContent>
                {emotions.length === 0 ? (
                  <div className="text-center py-8">
                    <TrendingUp className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                    <p className="text-muted-foreground">
                      Effectuez plusieurs scans pour obtenir des insights personnalisés
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="p-4 bg-blue-50 rounded-lg">
                      <h3 className="font-semibold mb-2">Tendance générale</h3>
                      <p className="text-sm">
                        Votre score émotionnel moyen est de <strong>{stats.averageScore}/10</strong>.
                        {stats.averageScore >= 7 && " C'est excellent ! Continuez sur cette voie positive."}
                        {stats.averageScore >= 4 && stats.averageScore < 7 && " Vous êtes dans une zone stable, essayez d'identifier ce qui pourrait améliorer votre bien-être."}
                        {stats.averageScore < 4 && " Il pourrait être bénéfique de consulter un professionnel ou d'explorer des techniques de bien-être."}
                      </p>
                    </div>
                    
                    <div className="p-4 bg-green-50 rounded-lg">
                      <h3 className="font-semibold mb-2">Recommandations</h3>
                      <ul className="text-sm space-y-1">
                        <li>• Continuez à scanner régulièrement vos émotions</li>
                        <li>• Tenez un journal de vos activités et humeurs</li>
                        <li>• Pratiquez la méditation ou la pleine conscience</li>
                        <li>• Maintenez des relations sociales positives</li>
                      </ul>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      )}
    </div>
  );
};

export default B2CScanPage;
