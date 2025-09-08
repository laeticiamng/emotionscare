/**
 * 🎭 EMOTION ANALYSIS VISUALIZATION - EmotionsCare
 * Visualisation avancée des analyses émotionnelles avec accessibilité
 */

import React, { useState, useRef } from 'react';
import { useAccessibility } from '@/components/accessibility/AccessibilityProvider';
import { usePlatformManager } from '@/hooks/usePlatformManager';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Camera, 
  Mic, 
  Play, 
  Pause, 
  RotateCcw,
  TrendingUp,
  Heart,
  Brain,
  Zap
} from 'lucide-react';

interface EmotionData {
  emotion: string;
  confidence: number;
  intensity: number;
  color: string;
  description: string;
}

interface EmotionAnalysisVisualizationProps {
  className?: string;
  mode?: 'face' | 'voice' | 'text';
}

export const EmotionAnalysisVisualization: React.FC<EmotionAnalysisVisualizationProps> = ({
  className = "",
  mode = 'face'
}) => {
  const { announce } = useAccessibility();
  const { emotionManager } = usePlatformManager();
  
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [currentEmotions, setCurrentEmotions] = useState<EmotionData[]>([]);
  const [dominantEmotion, setDominantEmotion] = useState<EmotionData | null>(null);
  const [analysisHistory, setAnalysisHistory] = useState<EmotionData[]>([]);
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Mock emotion data
  const mockEmotions: EmotionData[] = [
    { emotion: 'Joie', confidence: 85, intensity: 0.7, color: '#10B981', description: 'Émotion positive dominante' },
    { emotion: 'Calme', confidence: 72, intensity: 0.6, color: '#3B82F6', description: 'État de sérénité' },
    { emotion: 'Concentration', confidence: 68, intensity: 0.5, color: '#8B5CF6', description: 'Focus mental' },
    { emotion: 'Curiosité', confidence: 45, intensity: 0.3, color: '#F59E0B', description: 'Intérêt et ouverture' },
    { emotion: 'Fatigue', confidence: 30, intensity: 0.2, color: '#6B7280', description: 'Légère fatigue' },
  ];

  const startAnalysis = async () => {
    setIsAnalyzing(true);
    announce(`Démarrage de l'analyse émotionnelle par ${mode === 'face' ? 'caméra' : mode === 'voice' ? 'microphone' : 'texte'}`, 'assertive');
    
    // Simulate analysis
    setTimeout(() => {
      setCurrentEmotions(mockEmotions);
      setDominantEmotion(mockEmotions[0]);
      setAnalysisHistory(prev => [...prev, mockEmotions[0]]);
      setIsAnalyzing(false);
      
      announce(`Analyse terminée. Émotion dominante: ${mockEmotions[0].emotion} avec ${mockEmotions[0].confidence}% de confiance`, 'assertive');
    }, 3000);
  };

  const stopAnalysis = () => {
    setIsAnalyzing(false);
    announce('Analyse émotionnelle arrêtée', 'polite');
  };

  const resetAnalysis = () => {
    setCurrentEmotions([]);
    setDominantEmotion(null);
    setIsAnalyzing(false);
    announce('Analyse émotionnelle réinitialisée', 'polite');
  };

  const getEmotionIcon = (emotion: string) => {
    const icons: Record<string, React.ReactNode> = {
      'Joie': <Heart className="w-4 h-4" />,
      'Calme': <Brain className="w-4 h-4" />,
      'Concentration': <Zap className="w-4 h-4" />,
      'Curiosité': <TrendingUp className="w-4 h-4" />,
    };
    return icons[emotion] || <Heart className="w-4 h-4" />;
  };

  return (
    <div className={`w-full max-w-4xl mx-auto space-y-6 ${className}`}>
      {/* Analysis Controls */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            {mode === 'face' && <Camera className="w-5 h-5" />}
            {mode === 'voice' && <Mic className="w-5 h-5" />}
            {mode === 'text' && <Brain className="w-5 h-5" />}
            Analyse Émotionnelle {mode === 'face' ? 'Faciale' : mode === 'voice' ? 'Vocale' : 'Textuelle'}
          </CardTitle>
        </CardHeader>
        
        <CardContent>
          <div className="flex items-center gap-4 mb-6">
            <Button
              onClick={isAnalyzing ? stopAnalysis : startAnalysis}
              disabled={false}
              size="lg"
              className="flex items-center gap-2"
            >
              {isAnalyzing ? (
                <>
                  <Pause className="w-4 h-4" />
                  Arrêter l'analyse
                </>
              ) : (
                <>
                  <Play className="w-4 h-4" />
                  Démarrer l'analyse
                </>
              )}
            </Button>
            
            <Button
              onClick={resetAnalysis}
              variant="outline"
              size="lg"
              className="flex items-center gap-2"
            >
              <RotateCcw className="w-4 h-4" />
              Réinitialiser
            </Button>
            
            {isAnalyzing && (
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                Analyse en cours...
              </div>
            )}
          </div>
          
          {/* Live Feed */}
          {mode === 'face' && (
            <div className="relative mb-6">
              <div className="w-full h-64 bg-gray-900 rounded-lg flex items-center justify-center">
                <Camera className="w-12 h-12 text-gray-400" />
                <span className="ml-2 text-gray-400">Flux vidéo en direct</span>
              </div>
              {isAnalyzing && (
                <div className="absolute inset-0 border-2 border-green-500 rounded-lg animate-pulse" />
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Results */}
      {currentEmotions.length > 0 && (
        <Tabs defaultValue="current" className="w-full">
          <TabsList className="grid grid-cols-3 w-full">
            <TabsTrigger value="current">Analyse Actuelle</TabsTrigger>
            <TabsTrigger value="detailed">Détails</TabsTrigger>
            <TabsTrigger value="history">Historique</TabsTrigger>
          </TabsList>
          
          <TabsContent value="current" className="space-y-4">
            {/* Dominant Emotion */}
            {dominantEmotion && (
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      {getEmotionIcon(dominantEmotion.emotion)}
                      <div>
                        <h3 className="font-semibold text-lg">{dominantEmotion.emotion}</h3>
                        <p className="text-sm text-muted-foreground">{dominantEmotion.description}</p>
                      </div>
                    </div>
                    <Badge 
                      variant="secondary"
                      className="text-lg px-3 py-1"
                      style={{ backgroundColor: `${dominantEmotion.color}20`, color: dominantEmotion.color }}
                    >
                      {dominantEmotion.confidence}%
                    </Badge>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Confiance</span>
                      <span>{dominantEmotion.confidence}%</span>
                    </div>
                    <Progress 
                      value={dominantEmotion.confidence} 
                      className="h-2"
                      aria-label={`Confiance: ${dominantEmotion.confidence}%`}
                    />
                    
                    <div className="flex justify-between text-sm">
                      <span>Intensité</span>
                      <span>{Math.round(dominantEmotion.intensity * 100)}%</span>
                    </div>
                    <Progress 
                      value={dominantEmotion.intensity * 100} 
                      className="h-2"
                      aria-label={`Intensité: ${Math.round(dominantEmotion.intensity * 100)}%`}
                    />
                  </div>
                </CardContent>
              </Card>
            )}
            
            {/* All Emotions */}
            <Card>
              <CardHeader>
                <CardTitle>Toutes les émotions détectées</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {currentEmotions.map((emotion, index) => (
                    <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                      <div className="flex items-center gap-3">
                        {getEmotionIcon(emotion.emotion)}
                        <div>
                          <span className="font-medium">{emotion.emotion}</span>
                          <p className="text-xs text-muted-foreground">{emotion.description}</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-3">
                        <div className="text-right">
                          <div className="text-sm font-medium">{emotion.confidence}%</div>
                          <div className="w-16">
                            <Progress 
                              value={emotion.confidence} 
                              className="h-1"
                              aria-label={`${emotion.emotion}: ${emotion.confidence}%`}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="detailed">
            <Card>
              <CardHeader>
                <CardTitle>Analyse Détaillée</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <h4 className="font-medium">Métriques Techniques</h4>
                    <div className="text-sm space-y-1">
                      <div className="flex justify-between">
                        <span>Qualité de l'analyse</span>
                        <span className="text-green-600">Excellente</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Visages détectés</span>
                        <span>1</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Durée d'analyse</span>
                        <span>2.3s</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <h4 className="font-medium">Recommandations</h4>
                    <div className="text-sm space-y-1 text-muted-foreground">
                      <p>• Continuez cette émotion positive</p>
                      <p>• Musique recommandée: Uplifting</p>
                      <p>• Activité suggérée: Méditation de gratitude</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="history">
            <Card>
              <CardHeader>
                <CardTitle>Historique des Analyses</CardTitle>
              </CardHeader>
              <CardContent>
                {analysisHistory.length > 0 ? (
                  <div className="space-y-2">
                    {analysisHistory.map((emotion, index) => (
                      <div key={index} className="flex items-center justify-between p-2 rounded bg-muted/30">
                        <div className="flex items-center gap-2">
                          {getEmotionIcon(emotion.emotion)}
                          <span className="text-sm">{emotion.emotion}</span>
                        </div>
                        <Badge variant="outline">{emotion.confidence}%</Badge>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-muted-foreground text-center py-8">
                    Aucun historique d'analyse disponible
                  </p>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      )}
    </div>
  );
};