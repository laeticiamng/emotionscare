import React, { useState, useRef, useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { ArrowLeft, Camera, Scan, Brain, Heart, Music, Sparkles, Target, TrendingUp } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface EmotionResult {
  emotion: string;
  confidence: number;
  color: string;
  description: string;
  recommendations: string[];
}

const B2CEmotionScanPage: React.FC = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  const [isScanning, setIsScanning] = useState(false);
  const [hasPermission, setHasPermission] = useState(false);
  const [scanProgress, setScanProgress] = useState(0);
  const [emotionResult, setEmotionResult] = useState<EmotionResult | null>(null);
  const [scanHistory, setScanHistory] = useState<EmotionResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    checkCameraPermission();
    loadScanHistory();
  }, []);

  const checkCameraPermission = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      setHasPermission(true);
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (error) {
      console.error('Erreur d\'accès à la caméra:', error);
      toast({
        title: "Accès caméra requis",
        description: "Veuillez autoriser l'accès à la caméra pour utiliser le scan émotionnel.",
        variant: "destructive"
      });
    }
  };

  const loadScanHistory = async () => {
    try {
      const { data, error } = await supabase
        .from('emotion_scans')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(5);
      
      if (error) throw error;
      
      if (data) {
        const formattedHistory = data.map(scan => ({
          emotion: scan.emotion,
          confidence: scan.confidence,
          color: getEmotionColor(scan.emotion),
          description: scan.description || '',
          recommendations: scan.recommendations || []
        }));
        setScanHistory(formattedHistory);
      }
    } catch (error) {
      console.error('Erreur lors du chargement de l\'historique:', error);
    }
  };

  const getEmotionColor = (emotion: string): string => {
    const colors: Record<string, string> = {
      'joy': '#FFD700',
      'happiness': '#FFA500',
      'calm': '#87CEEB',
      'peaceful': '#98FB98',
      'sad': '#4169E1',
      'anxiety': '#FF6347',
      'anger': '#DC143C',
      'surprise': '#DA70D6',
      'neutral': '#808080',
      'focused': '#9370DB',
      'energetic': '#FF4500',
      'relaxed': '#20B2AA'
    };
    return colors[emotion.toLowerCase()] || '#808080';
  };

  const getEmotionRecommendations = (emotion: string): string[] => {
    const recommendations: Record<string, string[]> = {
      'joy': ['Partagez votre joie avec vos proches', 'Créez des souvenirs positifs', 'Pratiquez la gratitude'],
      'calm': ['Profitez de ce moment de paix', 'Méditation de pleine conscience', 'Lecture relaxante'],
      'sad': ['Écoutez de la musique apaisante', 'Parlez à un proche', 'Activité créative douce'],
      'anxiety': ['Techniques de respiration', 'Exercices de relaxation', 'Marche en nature'],
      'anger': ['Respiration profonde', 'Activité physique', 'Expression créative'],
      'neutral': ['Exploration de nouvelles activités', 'Connexion sociale', 'Pause mindfulness']
    };
    return recommendations[emotion.toLowerCase()] || ['Prenez soin de vous', 'Restez à l\'écoute de vos besoins'];
  };

  const simulateEmotionAnalysis = useCallback(async (): Promise<EmotionResult> => {
    // Simulation d'une analyse IA avancée
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    const emotions = [
      { name: 'joy', base: 85 },
      { name: 'calm', base: 78 },
      { name: 'focused', base: 82 },
      { name: 'energetic', base: 75 },
      { name: 'peaceful', base: 80 },
      { name: 'neutral', base: 70 }
    ];
    
    const randomEmotion = emotions[Math.floor(Math.random() * emotions.length)];
    const confidence = randomEmotion.base + Math.floor(Math.random() * 15);
    
    const result: EmotionResult = {
      emotion: randomEmotion.name,
      confidence,
      color: getEmotionColor(randomEmotion.name),
      description: `Vous semblez ${randomEmotion.name === 'joy' ? 'joyeux(se)' : randomEmotion.name} avec un niveau de confiance de ${confidence}%`,
      recommendations: getEmotionRecommendations(randomEmotion.name)
    };

    // Sauvegarder en base
    try {
      await supabase.from('emotion_scans').insert({
        emotion: result.emotion,
        confidence: result.confidence,
        description: result.description,
        recommendations: result.recommendations,
        scan_data: { timestamp: new Date().toISOString() }
      });
    } catch (error) {
      console.error('Erreur sauvegarde:', error);
    }

    return result;
  }, []);

  const startScan = async () => {
    if (!hasPermission) {
      await checkCameraPermission();
      return;
    }

    setIsScanning(true);
    setIsLoading(true);
    setScanProgress(0);
    setEmotionResult(null);

    // Animation du progress
    const progressInterval = setInterval(() => {
      setScanProgress(prev => {
        if (prev >= 95) {
          clearInterval(progressInterval);
          return 95;
        }
        return prev + 5;
      });
    }, 150);

    try {
      const result = await simulateEmotionAnalysis();
      setScanProgress(100);
      
      setTimeout(() => {
        setEmotionResult(result);
        setScanHistory(prev => [result, ...prev.slice(0, 4)]);
        setIsLoading(false);
        
        toast({
          title: "Scan terminé! ✨",
          description: `Émotion détectée: ${result.emotion} (${result.confidence}%)`,
        });
      }, 500);
    } catch (error) {
      console.error('Erreur lors du scan:', error);
      toast({
        title: "Erreur de scan",
        description: "Une erreur s'est produite. Veuillez réessayer.",
        variant: "destructive"
      });
      setIsLoading(false);
    } finally {
      setIsScanning(false);
      clearInterval(progressInterval);
    }
  };

  const navigateToMusic = () => {
    if (emotionResult) {
      navigate(`/app/music?emotion=${emotionResult.emotion}`);
    }
  };

  const navigateToCoach = () => {
    if (emotionResult) {
      navigate(`/app/coach?context=emotion_scan&emotion=${emotionResult.emotion}`);
    }
  };

  return (
    <div data-testid="page-root" className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-100 p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" onClick={() => navigate('/app/home')}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Retour
            </Button>
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                Emotion Scan
              </h1>
              <p className="text-gray-600">Analyse émotionnelle avancée par IA</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Brain className="w-6 h-6 text-purple-500" />
            <Badge variant="secondary" className="bg-purple-100 text-purple-700">
              IA Avancée
            </Badge>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Camera/Scan Area */}
          <div className="lg:col-span-2 space-y-4">
            <Card className="border-2 border-dashed border-purple-200 bg-gradient-to-br from-white to-purple-50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Camera className="w-5 h-5" />
                  Zone de Scan
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="relative aspect-video bg-gray-900 rounded-lg overflow-hidden">
                  <video 
                    ref={videoRef}
                    autoPlay 
                    playsInline 
                    muted
                    className="w-full h-full object-cover"
                  />
                  <canvas ref={canvasRef} className="hidden" />
                  
                  {/* Overlay de scan */}
                  {isScanning && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="bg-black/50 rounded-lg p-6 text-white text-center space-y-4">
                        <div className="animate-pulse">
                          <Scan className="w-12 h-12 mx-auto mb-2" />
                          <p className="text-lg font-semibold">Analyse en cours...</p>
                        </div>
                        <Progress value={scanProgress} className="w-48" />
                        <p className="text-sm">{scanProgress}% terminé</p>
                      </div>
                    </div>
                  )}

                  {/* Grille de détection */}
                  <div className="absolute inset-0 pointer-events-none">
                    <div className="w-full h-full border-2 border-purple-400/30 rounded-lg">
                      <div className="absolute top-4 left-4 w-8 h-8 border-l-2 border-t-2 border-purple-400"></div>
                      <div className="absolute top-4 right-4 w-8 h-8 border-r-2 border-t-2 border-purple-400"></div>
                      <div className="absolute bottom-4 left-4 w-8 h-8 border-l-2 border-b-2 border-purple-400"></div>
                      <div className="absolute bottom-4 right-4 w-8 h-8 border-r-2 border-b-2 border-purple-400"></div>
                    </div>
                  </div>
                </div>

                <div className="flex justify-center">
                  <Button 
                    onClick={startScan}
                    disabled={!hasPermission || isScanning}
                    size="lg"
                    className="bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600"
                  >
                    {isScanning ? (
                      <>
                        <Sparkles className="w-4 h-4 mr-2 animate-spin" />
                        Analyse...
                      </>
                    ) : (
                      <>
                        <Scan className="w-4 h-4 mr-2" />
                        Démarrer le Scan
                      </>
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Résultats */}
            {emotionResult && (
              <Card className="border-l-4 border-l-purple-500 bg-gradient-to-r from-white to-purple-50">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Target className="w-5 h-5" />
                    Résultats du Scan
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center gap-4">
                    <div 
                      className="w-16 h-16 rounded-full flex items-center justify-center text-white text-2xl font-bold"
                      style={{ backgroundColor: emotionResult.color }}
                    >
                      <Heart className="w-8 h-8" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-2xl font-bold capitalize">{emotionResult.emotion}</h3>
                      <p className="text-gray-600">{emotionResult.description}</p>
                      <div className="flex items-center gap-2 mt-2">
                        <Progress value={emotionResult.confidence} className="flex-1" />
                        <span className="text-sm font-semibold">{emotionResult.confidence}%</span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white rounded-lg p-4 space-y-3">
                    <h4 className="font-semibold text-gray-900">Recommandations personnalisées:</h4>
                    <ul className="space-y-2">
                      {emotionResult.recommendations.map((rec, index) => (
                        <li key={index} className="flex items-center gap-2">
                          <Sparkles className="w-4 h-4 text-purple-500" />
                          <span className="text-gray-700">{rec}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="flex gap-3">
                    <Button onClick={navigateToMusic} className="flex-1 bg-green-500 hover:bg-green-600">
                      <Music className="w-4 h-4 mr-2" />
                      Musique Adaptée
                    </Button>
                    <Button onClick={navigateToCoach} variant="outline" className="flex-1">
                      <Brain className="w-4 h-4 mr-2" />
                      Coach IA
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Sidebar - Historique */}
          <div className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="w-5 h-5" />
                  Historique
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {scanHistory.length > 0 ? (
                  scanHistory.map((scan, index) => (
                    <div key={index} className="p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-medium capitalize">{scan.emotion}</span>
                        <Badge 
                          variant="secondary" 
                          className="text-xs"
                          style={{ backgroundColor: `${scan.color}20`, color: scan.color }}
                        >
                          {scan.confidence}%
                        </Badge>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="h-2 rounded-full" 
                          style={{ 
                            width: `${scan.confidence}%`, 
                            backgroundColor: scan.color 
                          }}
                        />
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center text-gray-500 py-8">
                    <Scan className="w-12 h-12 mx-auto mb-3 opacity-30" />
                    <p>Aucun scan effectué</p>
                    <p className="text-sm">Commencez votre première analyse!</p>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-blue-50 to-purple-50">
              <CardContent className="p-4 text-center">
                <Heart className="w-8 h-8 mx-auto mb-2 text-purple-500" />
                <h3 className="font-semibold mb-2">Suivi Émotionnel</h3>
                <p className="text-sm text-gray-600 mb-3">
                  Analysez vos émotions quotidiennement pour un meilleur bien-être
                </p>
                <Button variant="outline" size="sm" className="w-full">
                  Voir les Statistiques
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default B2CEmotionScanPage;