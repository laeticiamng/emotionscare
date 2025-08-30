/**
 * B2CEmotionScanPage - Analyse émotionnelle avancée par IA
 */

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Camera, Brain, Zap, Heart, TrendingUp, 
  Play, Pause, RotateCcw, Download, Share2,
  Eye, Smile, Frown, Meh, AlertCircle, CheckCircle
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface EmotionResult {
  emotion: string;
  confidence: number;
  color: string;
  icon: React.ElementType;
  description: string;
}

interface ScanSession {
  id: string;
  timestamp: Date;
  duration: number;
  emotions: EmotionResult[];
  averageConfidence: number;
  recommendations: string[];
}

const emotionsList: EmotionResult[] = [
  { emotion: 'Joie', confidence: 0, color: 'text-yellow-500', icon: Smile, description: 'Sentiment de bonheur et de satisfaction' },
  { emotion: 'Tristesse', confidence: 0, color: 'text-blue-500', icon: Frown, description: 'Mélancolie ou sentiment de perte' },
  { emotion: 'Colère', confidence: 0, color: 'text-red-500', icon: AlertCircle, description: 'Frustration ou irritation' },
  { emotion: 'Peur', confidence: 0, color: 'text-purple-500', icon: Eye, description: 'Anxiété ou appréhension' },
  { emotion: 'Surprise', confidence: 0, color: 'text-orange-500', icon: Zap, description: 'Étonnement ou surprise' },
  { emotion: 'Dégoût', confidence: 0, color: 'text-green-500', icon: Meh, description: 'Aversion ou répulsion' },
  { emotion: 'Neutre', confidence: 0, color: 'text-gray-500', icon: CheckCircle, description: 'État émotionnel équilibré' },
];

export default function B2CEmotionScanPage() {
  const [isScanning, setIsScanning] = useState(false);
  const [scanProgress, setScanProgress] = useState(0);
  const [emotions, setEmotions] = useState<EmotionResult[]>(emotionsList);
  const [currentSession, setCurrentSession] = useState<ScanSession | null>(null);
  const [hasCamera, setHasCamera] = useState(false);
  const [sessions, setSessions] = useState<ScanSession[]>([]);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Vérifier l'accès à la caméra
  useEffect(() => {
    navigator.mediaDevices?.getUserMedia({ video: true })
      .then(stream => {
        setHasCamera(true);
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      })
      .catch(() => setHasCamera(false));
  }, []);

  // Simulation du scan émotionnel
  const startScan = async () => {
    if (!hasCamera) return;
    
    setIsScanning(true);
    setScanProgress(0);
    
    // Simulation progressive
    const interval = setInterval(() => {
      setScanProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          completeScan();
          return 100;
        }
        
        // Mettre à jour les émotions en temps réel
        setEmotions(prev => prev.map(emotion => ({
          ...emotion,
          confidence: Math.random() * 100
        })));
        
        return prev + 2;
      });
    }, 100);
  };

  const completeScan = () => {
    const finalEmotions = emotions.map(emotion => ({
      ...emotion,
      confidence: Math.random() * 100
    }));
    
    const dominantEmotion = finalEmotions.reduce((max, current) =>
      current.confidence > max.confidence ? current : max
    );
    
    const newSession: ScanSession = {
      id: Date.now().toString(),
      timestamp: new Date(),
      duration: 5,
      emotions: finalEmotions,
      averageConfidence: finalEmotions.reduce((sum, e) => sum + e.confidence, 0) / finalEmotions.length,
      recommendations: generateRecommendations(dominantEmotion)
    };
    
    setCurrentSession(newSession);
    setSessions(prev => [newSession, ...prev.slice(0, 4)]);
    setEmotions(finalEmotions);
    setIsScanning(false);
  };

  const generateRecommendations = (dominantEmotion: EmotionResult): string[] => {
    const recommendations: Record<string, string[]> = {
      'Joie': [
        'Partager ce moment positif avec vos proches',
        'Pratiquer la gratitude pour maintenir cet état',
        'Utiliser cette énergie pour des activités créatives'
      ],
      'Tristesse': [
        'Écouter de la musique apaisante',
        'Pratiquer des exercices de respiration',
        'Contacter un proche de confiance'
      ],
      'Colère': [
        'Prendre quelques respirations profondes',
        'Faire de l\'exercice physique',
        'Utiliser les techniques de relaxation'
      ],
      'Peur': [
        'Pratiquer la méditation de pleine conscience',
        'Utiliser des exercices de grounding',
        'Parler de vos inquiétudes avec quelqu\'un'
      ],
      'Surprise': [
        'Prendre le temps d\'analyser la situation',
        'Noter vos réactions dans votre journal',
        'Rester ouvert aux nouvelles expériences'
      ]
    };
    
    return recommendations[dominantEmotion.emotion] || [
      'Continuer à observer vos émotions',
      'Pratiquer l\'auto-compassion',
      'Maintenir vos routines de bien-être'
    ];
  };

  const resetScan = () => {
    setEmotions(emotionsList);
    setCurrentSession(null);
    setScanProgress(0);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background/95 to-accent/5 p-6" data-testid="page-root">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header */}
        <motion.div 
          className="text-center space-y-4"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="text-4xl font-bold bg-gradient-to-r from-primary via-accent to-secondary bg-clip-text text-transparent">
            Analyse Émotionnelle IA
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Découvrez vos émotions en temps réel grâce à l'intelligence artificielle
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Scanner */}
          <Card className="overflow-hidden">
            <CardHeader className="bg-gradient-to-r from-primary/10 to-accent/10">
              <CardTitle className="flex items-center gap-2">
                <Camera className="h-5 w-5" />
                Scanner Émotionnel
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-6">
                {/* Caméra */}
                <div className="relative aspect-video bg-black rounded-lg overflow-hidden">
                  {hasCamera ? (
                    <video
                      ref={videoRef}
                      autoPlay
                      muted
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="flex items-center justify-center h-full text-white">
                      <div className="text-center space-y-2">
                        <Camera className="h-12 w-12 mx-auto opacity-50" />
                        <p>Caméra non disponible</p>
                        <p className="text-sm opacity-75">Mode démo activé</p>
                      </div>
                    </div>
                  )}
                  
                  {/* Overlay de scan */}
                  {isScanning && (
                    <div className="absolute inset-0 bg-primary/20 flex items-center justify-center">
                      <motion.div
                        className="w-3/4 h-3/4 border-2 border-primary rounded-lg"
                        animate={{
                          scale: [1, 1.1, 1],
                          opacity: [0.5, 1, 0.5]
                        }}
                        transition={{
                          duration: 2,
                          repeat: Infinity
                        }}
                      />
                    </div>
                  )}
                </div>

                {/* Contrôles */}
                <div className="space-y-4">
                  {isScanning && (
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Analyse en cours...</span>
                        <span>{scanProgress}%</span>
                      </div>
                      <Progress value={scanProgress} />
                    </div>
                  )}
                  
                  <div className="flex gap-3">
                    <Button
                      onClick={startScan}
                      disabled={isScanning}
                      className="flex-1"
                    >
                      {isScanning ? (
                        <>
                          <Brain className="h-4 w-4 mr-2 animate-pulse" />
                          Analyse...
                        </>
                      ) : (
                        <>
                          <Play className="h-4 w-4 mr-2" />
                          Démarrer
                        </>
                      )}
                    </Button>
                    
                    <Button
                      onClick={resetScan}
                      variant="outline"
                      disabled={isScanning}
                    >
                      <RotateCcw className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Résultats */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Brain className="h-5 w-5" />
                Résultats d'Analyse
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-4">
                {emotions.map((emotion, index) => (
                  <motion.div
                    key={emotion.emotion}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-center gap-3"
                  >
                    <emotion.icon className={cn("h-5 w-5", emotion.color)} />
                    <div className="flex-1">
                      <div className="flex justify-between items-center mb-1">
                        <span className="font-medium">{emotion.emotion}</span>
                        <span className="text-sm text-muted-foreground">
                          {emotion.confidence.toFixed(1)}%
                        </span>
                      </div>
                      <Progress value={emotion.confidence} className="h-2" />
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Recommandations */}
              {currentSession && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-6 p-4 bg-accent/10 rounded-lg"
                >
                  <h4 className="font-semibold mb-3 flex items-center gap-2">
                    <Heart className="h-4 w-4" />
                    Recommandations
                  </h4>
                  <ul className="space-y-2">
                    {currentSession.recommendations.map((rec, index) => (
                      <li key={index} className="text-sm flex items-start gap-2">
                        <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                        {rec}
                      </li>
                    ))}
                  </ul>
                </motion.div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Historique */}
        {sessions.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                Historique des Analyses
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {sessions.map((session, index) => (
                  <motion.div
                    key={session.id}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Card className="hover:shadow-md transition-shadow">
                      <CardContent className="p-4">
                        <div className="space-y-3">
                          <div className="flex justify-between items-center">
                            <Badge variant="outline">
                              {session.timestamp.toLocaleDateString()}
                            </Badge>
                            <span className="text-sm text-muted-foreground">
                              {session.duration}s
                            </span>
                          </div>
                          
                          <div className="space-y-2">
                            {session.emotions
                              .sort((a, b) => b.confidence - a.confidence)
                              .slice(0, 3)
                              .map((emotion, i) => (
                                <div key={i} className="flex items-center gap-2 text-sm">
                                  <emotion.icon className={cn("h-3 w-3", emotion.color)} />
                                  <span>{emotion.emotion}</span>
                                  <span className="ml-auto text-muted-foreground">
                                    {emotion.confidence.toFixed(0)}%
                                  </span>
                                </div>
                              ))}
                          </div>
                          
                          <div className="flex gap-2 pt-2">
                            <Button size="sm" variant="outline" className="flex-1">
                              <Download className="h-3 w-3 mr-1" />
                              Export
                            </Button>
                            <Button size="sm" variant="outline" className="flex-1">
                              <Share2 className="h-3 w-3 mr-1" />
                              Partager
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}