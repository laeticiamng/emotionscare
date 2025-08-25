import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Mic, AudioWaveform, Brain, Heart, TrendingUp, History, Target } from 'lucide-react';
import VoiceRecorder from '@/components/voice/VoiceRecorder';
import { useAuth } from '@/contexts/AuthContext';

export const ScanVoicePage: React.FC = () => {
  const { user } = useAuth();
  const [recentAnalyses, setRecentAnalyses] = useState<any[]>([]);
  const [currentScore, setCurrentScore] = useState<number | null>(null);

  const handleAnalysisComplete = (analysis: any) => {
    console.log('✅ Analyse complétée:', analysis);
    setCurrentScore(analysis.wellness_score);
    setRecentAnalyses(prev => [analysis, ...prev.slice(0, 4)]); // Garder les 5 dernières
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-500';
    if (score >= 60) return 'text-yellow-500';
    if (score >= 40) return 'text-orange-500';
    return 'text-red-500';
  };

  const getScoreLevel = (score: number) => {
    if (score >= 80) return 'Excellent';
    if (score >= 60) return 'Bon';
    if (score >= 40) return 'Moyen';
    return 'Faible';
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center space-y-4"
      >
        <div className="flex items-center justify-center gap-2">
          <Mic className="h-8 w-8 text-primary" />
          <h1 className="text-3xl font-bold">Scan Vocal Émotionnel</h1>
        </div>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Analysez votre état émotionnel grâce à l'IA avancée d'analyse vocale. 
          Notre système détecte les nuances de votre voix pour évaluer votre bien-être psychologique.
        </p>
      </motion.div>

      {/* Statistiques rapides */}
      <div className="grid md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <AudioWaveform className="h-5 w-5 text-blue-500" />
              <div>
                <div className="text-sm text-muted-foreground">Précision IA</div>
                <div className="text-xl font-bold text-blue-500">94%</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Brain className="h-5 w-5 text-purple-500" />
              <div>
                <div className="text-sm text-muted-foreground">Analyses</div>
                <div className="text-xl font-bold text-purple-500">{recentAnalyses.length}</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Heart className="h-5 w-5 text-red-500" />
              <div>
                <div className="text-sm text-muted-foreground">Bien-être</div>
                <div className={`text-xl font-bold ${currentScore ? getScoreColor(currentScore) : 'text-gray-400'}`}>
                  {currentScore ? `${currentScore}/100` : '--'}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-green-500" />
              <div>
                <div className="text-sm text-muted-foreground">Niveau</div>
                <div className="text-lg font-bold text-green-500">
                  {currentScore ? getScoreLevel(currentScore) : 'À évaluer'}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="analysis" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="analysis" className="flex items-center gap-2">
            <Mic className="h-4 w-4" />
            Nouvelle Analyse
          </TabsTrigger>
          <TabsTrigger value="history" className="flex items-center gap-2">
            <History className="h-4 w-4" />
            Historique
          </TabsTrigger>
          <TabsTrigger value="insights" className="flex items-center gap-2">
            <Target className="h-4 w-4" />
            Insights
          </TabsTrigger>
        </TabsList>

        <TabsContent value="analysis" className="space-y-6">
          <VoiceRecorder 
            onAnalysisComplete={handleAnalysisComplete}
            analysisType="full"
          />
        </TabsContent>

        <TabsContent value="history" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <History className="h-5 w-5" />
                Historique des Analyses
              </CardTitle>
              <CardDescription>
                Suivez l'évolution de votre état émotionnel au fil du temps
              </CardDescription>
            </CardHeader>
            <CardContent>
              {recentAnalyses.length === 0 ? (
                <div className="text-center py-12 text-muted-foreground">
                  <Mic className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>Aucune analyse disponible.</p>
                  <p className="text-sm">Commencez votre première analyse vocale !</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {recentAnalyses.map((analysis, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="p-4 border rounded-lg"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <Badge variant="outline">{analysis.tone}</Badge>
                          <span className="text-sm text-muted-foreground">
                            Stress: {analysis.stress_level}/10
                          </span>
                        </div>
                        <div className={`text-lg font-bold ${getScoreColor(analysis.wellness_score)}`}>
                          {analysis.wellness_score}/100
                        </div>
                      </div>
                      
                      {analysis.transcription && (
                        <p className="text-sm text-muted-foreground italic mb-2">
                          "{analysis.transcription.substring(0, 100)}..."
                        </p>
                      )}
                      
                      <div className="flex flex-wrap gap-1">
                        {Object.entries(analysis.emotions).slice(0, 3).map(([emotion, intensity]) => (
                          <Badge key={emotion} variant="secondary" className="text-xs">
                            {emotion}: {Math.round((intensity as number) * 100)}%
                          </Badge>
                        ))}
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="insights" className="space-y-4">
          <div className="grid md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Brain className="h-5 w-5 text-purple-500" />
                  Insights Émotionnels
                </CardTitle>
              </CardHeader>
              <CardContent>
                {currentScore ? (
                  <div className="space-y-4">
                    <div className="p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg">
                      <h4 className="font-medium mb-2">État Actuel</h4>
                      <p className="text-sm text-muted-foreground">
                        Votre score de bien-être de <strong>{currentScore}/100</strong> indique 
                        un état <strong>{getScoreLevel(currentScore).toLowerCase()}</strong>.
                      </p>
                    </div>
                    
                    {recentAnalyses.length > 1 && (
                      <div className="p-4 bg-gradient-to-r from-green-50 to-blue-50 rounded-lg">
                        <h4 className="font-medium mb-2">Évolution</h4>
                        <p className="text-sm text-muted-foreground">
                          Comparé à votre dernière analyse, votre bien-être 
                          {recentAnalyses[0].wellness_score > recentAnalyses[1].wellness_score 
                            ? ' s\'améliore' 
                            : ' nécessite attention'}.
                        </p>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    <Target className="h-8 w-8 mx-auto mb-2 opacity-50" />
                    <p>Effectuez une analyse pour voir vos insights personnalisés</p>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-5 w-5 text-green-500" />
                  Recommandations
                </CardTitle>
              </CardHeader>
              <CardContent>
                {recentAnalyses.length > 0 && recentAnalyses[0].recommendations ? (
                  <div className="space-y-2">
                    {recentAnalyses[0].recommendations.slice(0, 3).map((rec: string, index: number) => (
                      <div key={index} className="flex items-start gap-2">
                        <span className="text-green-500 mt-1">•</span>
                        <p className="text-sm">{rec}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    <Heart className="h-8 w-8 mx-auto mb-2 opacity-50" />
                    <p>Vos recommandations personnalisées apparaîtront ici</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};