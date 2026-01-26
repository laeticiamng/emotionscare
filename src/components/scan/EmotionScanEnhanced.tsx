
import { useState, useRef, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Camera, Upload, RefreshCw, CheckCircle, AlertCircle, 
  TrendingUp, Heart, Zap, Activity, BarChart3
} from 'lucide-react';
import { useUserMedia } from '@/hooks/useUserMedia';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

interface EmotionResult {
  mode: string;
  mood: {
    valence: number;
    arousal: number;
  };
  emotions: Record<string, number>;
  confidence: number;
  insight: string;
  recommendations: string[];
  duration?: number;
}

interface ScanHistory {
  timestamp: string;
  valence: number;
  arousal: number;
  confidence: number;
}

export default function EmotionScanEnhanced() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const { stream, startMedia, stopMedia, isActive, error: _cameraError } = useUserMedia();
  const { toast } = useToast();
  
  // Aliases for compatibility
  const startCamera = async () => startMedia({ video: true, audio: false });
  const stopCamera = stopMedia;
  const isStreaming = isActive;
  
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<EmotionResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [useCamera, setUseCamera] = useState(true);
  const [scanHistory, setScanHistory] = useState<ScanHistory[]>([]);
  const [progress, setProgress] = useState(0);

  // Load scan history
  useEffect(() => {
    const loadHistory = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from('user_mood_states')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(10);

      if (data && !error) {
        const history = data.map(item => ({
          timestamp: item.created_at,
          valence: item.valence || 0.5,
          arousal: item.arousal || 0.5,
          confidence: item.confidence || 0.5
        }));
        setScanHistory(history);
      }
    };

    loadHistory();
  }, [result]);

  const captureFrame = useCallback(() => {
    if (!videoRef.current || !canvasRef.current) return null;
    
    const canvas = canvasRef.current;
    const video = videoRef.current;
    const ctx = canvas.getContext('2d');
    
    if (!ctx) return null;
    
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    ctx.drawImage(video, 0, 0);
    
    return canvas.toDataURL('image/jpeg', 0.8);
  }, []);

  const analyzeImage = async (imageData: string, mode: 'face' | 'voice' | 'upload') => {
    setIsAnalyzing(true);
    setError(null);
    setProgress(0);

    const progressInterval = setInterval(() => {
      setProgress(prev => Math.min(prev + 10, 90));
    }, 200);
    
    try {
      const { data, error: supabaseError } = await supabase.functions.invoke('emotion-scan', {
        body: {
          mode,
          imageData: mode === 'face' ? imageData : undefined
        }
      });

      clearInterval(progressInterval);
      setProgress(100);
      
      if (supabaseError) throw supabaseError;
      
      if (data.success || data.mode) {
        setResult(data);
        
        toast({
          title: "✨ Scan terminé",
          description: `Analyse ${mode} réussie avec ${Math.round((data.confidence || 0.8) * 100)}% de confiance`,
        });
      } else if (data.fallback) {
        setResult(data.fallback);
        toast({
          title: "⚠️ Mode de secours",
          description: "Analyse de base utilisée",
          variant: "default"
        });
      }
    } catch (err) {
      clearInterval(progressInterval);
      setError(err instanceof Error ? err.message : 'Erreur d\'analyse');
      toast({
        title: "❌ Erreur",
        description: "Impossible de compléter l'analyse",
        variant: "destructive"
      });
    } finally {
      setIsAnalyzing(false);
      setTimeout(() => setProgress(0), 1000);
    }
  };

  const handleCameraCapture = async () => {
    if (!isStreaming) {
      try {
        await startCamera();
      } catch (err) {
        setError('Impossible d\'accéder à la caméra');
        setUseCamera(false);
        toast({
          title: "Caméra indisponible",
          description: "Vous pouvez uploader une image à la place",
          variant: "default"
        });
      }
      return;
    }
    
    const imageData = captureFrame();
    if (imageData) {
      await analyzeImage(imageData, 'face');
    }
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = async (e) => {
      const result = e.target?.result as string;
      await analyzeImage(result, 'upload');
    };
    reader.readAsDataURL(file);
  };

  const resetScan = () => {
    setResult(null);
    setError(null);
    stopCamera();
  };

  const getMoodEmoji = (valence: number, arousal: number) => {
    if (valence > 0.6 && arousal > 0.6) return '😄';
    if (valence > 0.6 && arousal < 0.4) return '😌';
    if (valence < 0.4 && arousal > 0.6) return '😰';
    if (valence < 0.4 && arousal < 0.4) return '😔';
    return '😐';
  };

  const getEmotionColor = (_emotion: string, value: number) => {
    const intensity = Math.round(value * 100);
    if (intensity > 70) return 'bg-green-500/20 text-green-700 border-green-500/30';
    if (intensity > 40) return 'bg-yellow-500/20 text-yellow-700 border-yellow-500/30';
    return 'bg-gray-500/20 text-gray-600 border-gray-500/30';
  };

  // Chart data for history
  const chartData = {
    labels: scanHistory.map((_, i) => `Scan ${scanHistory.length - i}`).reverse(),
    datasets: [
      {
        label: 'Valence (Positivité)',
        data: scanHistory.map(s => s.valence * 100).reverse(),
        borderColor: 'rgb(34, 197, 94)',
        backgroundColor: 'rgba(34, 197, 94, 0.1)',
        fill: true,
        tension: 0.4
      },
      {
        label: 'Arousal (Énergie)',
        data: scanHistory.map(s => s.arousal * 100).reverse(),
        borderColor: 'rgb(59, 130, 246)',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        fill: true,
        tension: 0.4
      }
    ]
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5 p-4 md:p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header avec stats */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid grid-cols-1 md:grid-cols-4 gap-4"
        >
          <Card className="bg-gradient-to-br from-primary/10 to-primary/5">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Scans Total</p>
                  <p className="text-2xl font-bold">{scanHistory.length}</p>
                </div>
                <BarChart3 className="h-8 w-8 text-primary/50" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-green-500/10 to-green-500/5">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Bien-être Moy.</p>
                  <p className="text-2xl font-bold">
                    {scanHistory.length > 0 
                      ? Math.round(scanHistory.reduce((acc, s) => acc + s.valence, 0) / scanHistory.length * 100)
                      : 0}%
                  </p>
                </div>
                <Heart className="h-8 w-8 text-green-500/50" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-blue-500/10 to-blue-500/5">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Énergie Moy.</p>
                  <p className="text-2xl font-bold">
                    {scanHistory.length > 0 
                      ? Math.round(scanHistory.reduce((acc, s) => acc + s.arousal, 0) / scanHistory.length * 100)
                      : 0}%
                  </p>
                </div>
                <Zap className="h-8 w-8 text-blue-500/50" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-purple-500/10 to-purple-500/5">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Confiance Moy.</p>
                  <p className="text-2xl font-bold">
                    {scanHistory.length > 0 
                      ? Math.round(scanHistory.reduce((acc, s) => acc + s.confidence, 0) / scanHistory.length * 100)
                      : 0}%
                  </p>
                </div>
                <Activity className="h-8 w-8 text-purple-500/50" />
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main scan interface */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-2"
          >
            <Card className="border-2">
              <CardHeader className="text-center">
                <CardTitle className="text-2xl flex items-center justify-center gap-2">
                  <Camera className="h-6 w-6" />
                  Scan Émotionnel Avancé
                </CardTitle>
                <p className="text-sm text-muted-foreground">
                  Analyse en temps réel de votre état émotionnel
                </p>
              </CardHeader>
              
              <CardContent className="space-y-6">
                {/* Zone de capture */}
                {useCamera && (
                  <motion.div 
                    initial={{ scale: 0.95, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="relative bg-black rounded-xl overflow-hidden shadow-2xl"
                  >
                    <video
                      ref={videoRef}
                      autoPlay
                      playsInline
                      muted
                      className="w-full h-64 md:h-80 object-cover"
                      onLoadedMetadata={() => {
                        if (stream && videoRef.current) {
                          videoRef.current.srcObject = stream;
                        }
                      }}
                    />
                    <canvas ref={canvasRef} className="hidden" />
                    
                    {!isStreaming && (
                      <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="absolute inset-0 flex items-center justify-center bg-black/60 backdrop-blur-sm"
                      >
                        <div className="text-white text-center">
                          <motion.div
                            animate={{ scale: [1, 1.1, 1] }}
                            transition={{ repeat: Infinity, duration: 2 }}
                          >
                            <Camera className="h-16 w-16 mx-auto mb-4" />
                          </motion.div>
                          <p className="text-lg font-medium">Cliquez pour activer la caméra</p>
                        </div>
                      </motion.div>
                    )}
                    
                    {isAnalyzing && (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="absolute inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center"
                      >
                        <div className="text-center text-white">
                          <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                            className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4"
                          />
                          <p className="text-lg font-medium">Analyse en cours...</p>
                          <Progress value={progress} className="w-48 mx-auto mt-4" />
                        </div>
                      </motion.div>
                    )}
                  </motion.div>
                )}

                {/* Contrôles */}
                <div className="flex flex-wrap justify-center gap-3">
                  {useCamera && (
                    <Button 
                      onClick={handleCameraCapture}
                      disabled={isAnalyzing}
                      size="lg"
                      className="flex items-center gap-2 shadow-lg"
                    >
                      <Camera className="h-5 w-5" />
                      {isStreaming ? 'Analyser' : 'Activer Caméra'}
                    </Button>
                  )}
                  
                  <Button
                    onClick={() => fileInputRef.current?.click()}
                    variant="outline"
                    size="lg"
                    disabled={isAnalyzing}
                    className="flex items-center gap-2"
                  >
                    <Upload className="h-5 w-5" />
                    Upload Image
                  </Button>
                  
                  {(result || error) && (
                    <Button
                      onClick={resetScan}
                      variant="outline"
                      size="lg"
                      className="flex items-center gap-2"
                    >
                      <RefreshCw className="h-5 w-5" />
                      Nouveau Scan
                    </Button>
                  )}
                </div>
                
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="hidden"
                />

                {/* Erreurs */}
                <AnimatePresence>
                  {error && !result && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="flex items-center gap-2 p-4 bg-red-50 text-red-700 rounded-lg border border-red-200"
                    >
                      <AlertCircle className="h-5 w-5 flex-shrink-0" />
                      <span>{error}</span>
                    </motion.div>
                  )}
                </AnimatePresence>
              </CardContent>
            </Card>
          </motion.div>

          {/* Résultats et historique */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-6"
          >
            <AnimatePresence mode="wait">
              {result && (
                <motion.div
                  key="result"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                >
                  <Card className="border-2 border-primary/20 shadow-xl">
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <CardTitle className="flex items-center gap-2">
                          <CheckCircle className="h-5 w-5 text-green-600" />
                          Résultats
                        </CardTitle>
                        <motion.div
                          animate={{ scale: [1, 1.2, 1] }}
                          transition={{ repeat: Infinity, duration: 2 }}
                          className="text-4xl"
                        >
                          {getMoodEmoji(result.mood.valence, result.mood.arousal)}
                        </motion.div>
                      </div>
                    </CardHeader>

                    <CardContent className="space-y-6">
                      {/* Scores principaux */}
                      <div className="space-y-4">
                        <div>
                          <div className="flex justify-between mb-2">
                            <span className="text-sm font-medium">Bien-être</span>
                            <span className="text-sm font-bold text-primary">
                              {Math.round(result.mood.valence * 100)}%
                            </span>
                          </div>
                          <Progress value={result.mood.valence * 100} className="h-2" />
                        </div>

                        <div>
                          <div className="flex justify-between mb-2">
                            <span className="text-sm font-medium">Énergie</span>
                            <span className="text-sm font-bold text-blue-600">
                              {Math.round(result.mood.arousal * 100)}%
                            </span>
                          </div>
                          <Progress 
                            value={result.mood.arousal * 100} 
                            className="h-2"
                            indicatorClassName="bg-blue-600"
                          />
                        </div>

                        <div>
                          <div className="flex justify-between mb-2">
                            <span className="text-sm font-medium">Confiance</span>
                            <span className="text-sm font-bold text-purple-600">
                              {Math.round(result.confidence * 100)}%
                            </span>
                          </div>
                          <Progress 
                            value={result.confidence * 100} 
                            className="h-2"
                            indicatorClassName="bg-purple-600"
                          />
                        </div>
                      </div>

                      {/* Insight */}
                      <div className="p-4 bg-muted rounded-lg">
                        <p className="text-sm italic text-muted-foreground">
                          "{result.insight}"
                        </p>
                      </div>

                      {/* Émotions détaillées */}
                      {result.emotions && Object.keys(result.emotions).length > 0 && (
                        <div>
                          <h4 className="font-semibold mb-3 text-sm">Émotions détectées</h4>
                          <div className="flex flex-wrap gap-2">
                            {Object.entries(result.emotions).map(([emotion, value]) => (
                              <Badge 
                                key={emotion}
                                className={getEmotionColor(emotion, value as number)}
                                variant="outline"
                              >
                                {emotion} {Math.round((value as number) * 100)}%
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Recommandations */}
                      <div>
                        <h4 className="font-semibold mb-3 text-sm flex items-center gap-2">
                          <TrendingUp className="h-4 w-4" />
                          Recommandations
                        </h4>
                        <div className="space-y-2">
                          {result.recommendations.map((rec, index) => (
                            <motion.div
                              key={index}
                              initial={{ opacity: 0, x: -10 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: index * 0.1 }}
                              className="flex items-start gap-2 text-sm p-2 rounded bg-muted/50"
                            >
                              <div className="w-1.5 h-1.5 bg-primary rounded-full mt-2 flex-shrink-0" />
                              <span className="text-muted-foreground">{rec}</span>
                            </motion.div>
                          ))}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Historique graphique */}
            {scanHistory.length > 1 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Évolution</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="h-48">
                      <Line 
                        data={chartData}
                        options={{
                          responsive: true,
                          maintainAspectRatio: false,
                          plugins: {
                            legend: {
                              display: true,
                              position: 'bottom'
                            }
                          },
                          scales: {
                            y: {
                              beginAtZero: true,
                              max: 100
                            }
                          }
                        }}
                      />
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
}