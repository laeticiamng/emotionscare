
import React, { useEffect, useState } from 'react';
import ProtectedLayout from '@/components/ProtectedLayout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useActivityLogging } from '@/hooks/useActivityLogging';
import { useAuth } from '@/contexts/AuthContext';
import { Brain, Activity, Calendar, History } from 'lucide-react';
import EnhancedEmotionAnalysis from '@/components/scan/EnhancedEmotionAnalysis';
import { EnhancedEmotionResult } from '@/lib/scan/enhancedAnalyzeService';
import { useToast } from '@/hooks/use-toast';
import { useMusic } from '@/contexts/MusicContext';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const ScanAdvancedPage = () => {
  const { user } = useAuth();
  const { logUserAction } = useActivityLogging('scan_advanced');
  const { toast } = useToast();
  const { loadPlaylistForEmotion } = useMusic();
  const [activeTab, setActiveTab] = useState('scan');
  const [analysisResult, setAnalysisResult] = useState<EnhancedEmotionResult | null>(null);
  
  // Données d'exemple pour les graphiques
  const emotionData = [
    { date: '01/05', score: 65, emotion: 'calm' },
    { date: '02/05', score: 78, emotion: 'happy' },
    { date: '03/05', score: 45, emotion: 'anxious' },
    { date: '04/05', score: 58, emotion: 'neutral' },
    { date: '05/05', score: 72, emotion: 'focused' },
    { date: '06/05', score: 80, emotion: 'happy' },
    { date: '07/05', score: 76, emotion: 'focused' },
  ];
  
  useEffect(() => {
    if (user) {
      logUserAction('visit_scan_advanced_page');
    }
  }, [user, logUserAction]);
  
  const handleAnalysisComplete = (result: EnhancedEmotionResult) => {
    setAnalysisResult(result);
    setActiveTab('results');
    
    // Adapter la musique à l'émotion détectée
    if (result.emotion) {
      loadPlaylistForEmotion(result.emotion);
      toast({
        title: "Musique adaptée",
        description: `Une playlist correspondant à votre état émotionnel "${result.emotion}" a été chargée.`
      });
    }
    
    logUserAction('complete_enhanced_scan', { emotion: result.emotion });
  };

  return (
    <ProtectedLayout>
      <div className="container mx-auto p-4 max-w-6xl">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold">Scan émotionnel avancé</h1>
            <p className="text-muted-foreground">Analyse approfondie par IA de votre état émotionnel</p>
          </div>
        </div>
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="mb-6">
            <TabsTrigger value="scan" className="flex items-center gap-2">
              <Brain className="h-4 w-4" />
              Nouvelle analyse
            </TabsTrigger>
            <TabsTrigger value="results" className="flex items-center gap-2">
              <Activity className="h-4 w-4" />
              Résultats
            </TabsTrigger>
            <TabsTrigger value="history" className="flex items-center gap-2">
              <History className="h-4 w-4" />
              Historique
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="scan" className="space-y-6">
            <EnhancedEmotionAnalysis onAnalysisComplete={handleAnalysisComplete} />
          </TabsContent>
          
          <TabsContent value="results" className="space-y-6">
            {analysisResult ? (
              <>
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Activity className="h-5 w-5 text-primary" />
                      Résultats de l'analyse
                    </CardTitle>
                    <CardDescription>
                      Analyse détaillée de votre état émotionnel avec recommandations personnalisées
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <Card className="bg-muted/20 p-4">
                        <h3 className="font-medium mb-1">Émotion principale</h3>
                        <p className="text-xl font-semibold text-primary">{analysisResult.emotion}</p>
                        <p className="text-xs text-muted-foreground mt-1">
                          Confiance: {(analysisResult.confidence * 100).toFixed(0)}%
                        </p>
                      </Card>
                      
                      <Card className="bg-muted/20 p-4">
                        <h3 className="font-medium mb-1">Intensité</h3>
                        <div className="w-full bg-muted/30 rounded-full h-3 mt-2">
                          <div className="bg-primary h-3 rounded-full" style={{width: `${analysisResult.confidence * 100}%`}}></div>
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">
                          Basée sur l'analyse des données fournies
                        </p>
                      </Card>
                      
                      <Card className="bg-muted/20 p-4">
                        <h3 className="font-medium mb-1">Date de l'analyse</h3>
                        <div className="flex items-center">
                          <Calendar className="h-4 w-4 mr-1 text-muted-foreground" />
                          <p>{new Date().toLocaleString()}</p>
                        </div>
                      </Card>
                    </div>
                    
                    <Card className="p-4">
                      <h3 className="font-medium mb-2">Feedback</h3>
                      <p>{analysisResult.feedback}</p>
                    </Card>
                    
                    <div>
                      <h3 className="font-medium mb-2">Recommandations</h3>
                      <div className="space-y-2">
                        {analysisResult.recommendations.map((rec, i) => (
                          <Card key={i} className="p-4 bg-muted/20 hover:bg-muted/30 transition-colors">
                            {rec}
                          </Card>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </>
            ) : (
              <Card className="p-6 text-center">
                <Brain className="h-12 w-12 mx-auto text-muted-foreground mb-3" />
                <h2 className="text-xl font-medium mb-2">Aucun résultat disponible</h2>
                <p className="text-muted-foreground mb-4">
                  Effectuez une nouvelle analyse pour voir les résultats détaillés
                </p>
              </Card>
            )}
          </TabsContent>
          
          <TabsContent value="history" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Historique des émotions</CardTitle>
                <CardDescription>Évolution de votre état émotionnel au fil du temps</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={emotionData}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} />
                      <XAxis dataKey="date" />
                      <YAxis domain={[0, 100]} />
                      <Tooltip 
                        formatter={(value, name) => [`${value}/100`, 'Score']}
                        labelFormatter={(value) => `Date: ${value}`}
                      />
                      <Line 
                        type="monotone" 
                        dataKey="score" 
                        stroke="#8884d8" 
                        strokeWidth={2}
                        dot={{ fill: '#8884d8', r: 5 }}
                        activeDot={{ r: 7 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
                
                <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Card className="p-4">
                    <h3 className="font-medium mb-2">Émotions récentes</h3>
                    <div className="space-y-2">
                      {emotionData.slice(0, 3).map((entry, i) => (
                        <div key={i} className="flex items-center justify-between p-2 bg-muted/20 rounded-md">
                          <div className="flex items-center">
                            <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                            <span>{entry.date}</span>
                          </div>
                          <div>
                            <span className="font-medium">{entry.emotion}</span>
                            <span className="text-xs ml-2 text-muted-foreground">({entry.score}/100)</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </Card>
                  
                  <Card className="p-4">
                    <h3 className="font-medium mb-2">Statistiques</h3>
                    <div className="space-y-4">
                      <div>
                        <div className="flex justify-between text-sm">
                          <span>Score moyen</span>
                          <span className="font-medium">
                            {Math.round(emotionData.reduce((acc, curr) => acc + curr.score, 0) / emotionData.length)}/100
                          </span>
                        </div>
                        <div className="w-full bg-muted/30 rounded-full h-2 mt-1">
                          <div 
                            className="bg-primary h-2 rounded-full" 
                            style={{
                              width: `${Math.round(emotionData.reduce((acc, curr) => acc + curr.score, 0) / emotionData.length)}%`
                            }}
                          ></div>
                        </div>
                      </div>
                      
                      <div>
                        <div className="flex justify-between text-sm">
                          <span>Émotion la plus fréquente</span>
                          <span className="font-medium">focused</span>
                        </div>
                      </div>
                      
                      <div>
                        <div className="flex justify-between text-sm">
                          <span>Tendance</span>
                          <span className="font-medium text-green-500">En amélioration</span>
                        </div>
                      </div>
                    </div>
                  </Card>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </ProtectedLayout>
  );
};

export default ScanAdvancedPage;
