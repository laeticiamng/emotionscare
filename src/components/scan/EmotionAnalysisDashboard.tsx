import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { 
  Brain, 
  Music, 
  Heart, 
  Activity, 
  Clock,
  Target,
  BarChart3
} from 'lucide-react';
import EmotionScannerPremium from './EmotionScannerPremium';
import { EmotionsCareRecommendation } from '@/components/music/emotionscare';
import type { EmotionResult as BaseEmotionResult } from '@/types/emotion';
import type { EmotionResult as IndexEmotionResult, EmotionConfidence } from '@/types';

interface EmotionAnalysisDashboardProps {
  className?: string;
}

// Helper to get confidence as number from various formats
const getConfidenceNumber = (confidence: number | EmotionConfidence | undefined): number => {
  if (typeof confidence === 'number') return confidence;
  if (confidence && typeof confidence === 'object' && 'overall' in confidence) {
    return confidence.overall;
  }
  return 0;
};

// Adapter to convert between emotion result types
const toIndexEmotionResult = (result: BaseEmotionResult): IndexEmotionResult => ({
  id: result.id ?? `scan-${Date.now()}`,
  emotion: result.emotion,
  confidence: result.confidence,
  timestamp: result.timestamp,
  source: (result.source as IndexEmotionResult['source']) ?? 'manual',
  intensity: result.intensity ?? 50
});

const EmotionAnalysisDashboard: React.FC<EmotionAnalysisDashboardProps> = ({
  className = ''
}) => {
  const [currentEmotionResult, setCurrentEmotionResult] = useState<IndexEmotionResult | null>(null);
  const [emotionHistory, setEmotionHistory] = useState<IndexEmotionResult[]>([]);

  const handleEmotionAnalyzed = (result: BaseEmotionResult) => {
    const indexResult = toIndexEmotionResult(result);
    setCurrentEmotionResult(indexResult);
    setEmotionHistory(prev => [indexResult, ...prev.slice(0, 9)]);
  };

  const getEmotionColor = (emotion: string) => {
    const colors: Record<string, string> = {
      joy: 'text-yellow-600 bg-yellow-50 border-yellow-200',
      happiness: 'text-orange-600 bg-orange-50 border-orange-200',
      calm: 'text-blue-600 bg-blue-50 border-blue-200',
      sadness: 'text-purple-600 bg-purple-50 border-purple-200',
      anger: 'text-red-600 bg-red-50 border-red-200',
      anxiety: 'text-gray-600 bg-gray-50 border-gray-200',
      neutral: 'text-slate-600 bg-slate-50 border-slate-200'
    };
    return colors[emotion.toLowerCase()] || colors.neutral;
  };

  const getMoodStats = () => {
    if (emotionHistory.length === 0) return null;
    
    const moodCounts = emotionHistory.reduce((acc, result) => {
      const mood = result.emotion || 'neutral';
      acc[mood] = (acc[mood] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    
    const totalCount = emotionHistory.length;
    const dominantMood = Object.entries(moodCounts)
      .sort(([,a], [,b]) => b - a)[0];
    
    return {
      dominantMood: dominantMood[0],
      percentage: Math.round((dominantMood[1] / totalCount) * 100),
      distribution: moodCounts
    };
  };

  const getAverageConfidence = () => {
    if (emotionHistory.length === 0) return 0;
    const total = emotionHistory.reduce((sum, result) => {
      return sum + getConfidenceNumber(result.confidence);
    }, 0);
    return Math.round(total / emotionHistory.length);
  };

  const stats = getMoodStats();
  const avgConfidence = getAverageConfidence();

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header */}
      <div className="text-center">
        <h2 className="text-3xl font-bold mb-2">Analyse Émotionnelle Premium</h2>
        <p className="text-muted-foreground">
          Découvrez votre état émotionnel avec l'IA et recevez une musicothérapie personnalisée
        </p>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Analyses Totales</CardTitle>
            <Brain className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{emotionHistory.length}</div>
            <p className="text-xs text-muted-foreground">Sessions d'analyse</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Humeur Dominante</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold capitalize">
              {stats?.dominantMood || 'N/A'}
            </div>
            <p className="text-xs text-muted-foreground">
              {stats?.percentage || 0}% du temps
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Confiance Moyenne</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{avgConfidence}%</div>
            <Progress value={avgConfidence} className="mt-2" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">État Actuel</CardTitle>
            <Heart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold capitalize">
              {currentEmotionResult?.emotion || 'Inconnue'}
            </div>
            <p className="text-xs text-muted-foreground">
              {currentEmotionResult ? 'Analysé' : 'En attente'}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs defaultValue="scanner" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="scanner">Scanner Émotionnel</TabsTrigger>
          <TabsTrigger value="musicotherapy">Musicothérapie</TabsTrigger>
          <TabsTrigger value="history">Historique</TabsTrigger>
        </TabsList>

        <TabsContent value="scanner" className="space-y-4">
          <EmotionScannerPremium
            onEmotionDetected={handleEmotionAnalyzed}
          />
        </TabsContent>

        <TabsContent value="musicotherapy" className="space-y-4">
          {currentEmotionResult ? (
            <EmotionsCareRecommendation
              emotionResult={currentEmotionResult}
              autoGenerate={false}
            />
          ) : (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <Music className="w-16 h-16 text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">Musicothérapie IA</h3>
                <p className="text-muted-foreground text-center mb-6 max-w-md">
                  Effectuez d'abord une analyse émotionnelle pour recevoir 
                  une musicothérapie personnalisée générée par IA
                </p>
                <Button 
                  onClick={() => {
                    const el = document.querySelector('[value="scanner"]');
                    if (el instanceof HTMLElement) el.click();
                  }}
                  variant="outline"
                >
                  Commencer l'analyse
                </Button>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="history" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <BarChart3 className="w-5 h-5 mr-2" />
                Historique des Analyses
              </CardTitle>
              <CardDescription>
                Vos dernières analyses émotionnelles
              </CardDescription>
            </CardHeader>
            <CardContent>
              {emotionHistory.length > 0 ? (
                <div className="space-y-4">
                  {emotionHistory.map((result, index) => (
                    <div 
                      key={result.id || index}
                      className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                    >
                      <div className="flex items-center space-x-4">
                        <div className="w-10 h-10 bg-gradient-to-r from-primary/20 to-primary/10 rounded-full flex items-center justify-center">
                          <span className="text-sm font-medium">{index + 1}</span>
                        </div>
                        <div>
                          <div className="flex items-center space-x-2 mb-1">
                            <Badge className={getEmotionColor(result.emotion || 'neutral')}>
                              {result.emotion || 'Neutre'}
                            </Badge>
                            <span className="text-sm text-muted-foreground">
                              {getConfidenceNumber(result.confidence)}% confiance
                            </span>
                          </div>
                          <p className="text-sm text-muted-foreground">
                            {result.timestamp ? new Date(result.timestamp).toLocaleString('fr-FR') : 'Date inconnue'}
                          </p>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <Clock className="w-4 h-4 text-muted-foreground" />
                        <span className="text-sm text-muted-foreground">
                          {result.source || 'Scan'}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Activity className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">Aucun historique</h3>
                  <p className="text-muted-foreground">
                    Commencez votre première analyse pour voir l'historique ici
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default EmotionAnalysisDashboard;
