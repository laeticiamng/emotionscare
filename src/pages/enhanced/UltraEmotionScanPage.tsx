import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence, useMotionValue, useTransform } from 'framer-motion';
import { 
  Camera, Mic, Brain, Heart, Eye, Zap, Target, TrendingUp,
  Play, Pause, Square, RotateCcw, Settings, Volume2, Waves,
  Activity, Smile, Frown, Meh, AlertCircle, CheckCircle,
  Sparkles, Star, Clock, Calendar, BarChart3, PieChart,
  Users, Globe, Shield, Headphones, Battery, Smartphone
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase';
import { useAuth } from '@/contexts/AuthContext';
import ResponsiveWrapper from '@/components/responsive/ResponsiveWrapper';
import { FunctionalButton } from '@/components/ui/functional-button';
import { NavigationButton } from '@/components/ui/navigation-button';
import { useDeviceDetection } from '@/hooks/useDeviceDetection';
import { cn } from '@/lib/utils';

interface EmotionData {
  emotion: string;
  confidence: number;
  intensity: number;
  color: string;
  description: string;
}

interface ScanResult {
  id: string;
  timestamp: string;
  primary_emotion: string;
  emotions: EmotionData[];
  confidence_score: number;
  stress_level: number;
  energy_level: number;
  mood_score: number;
  recommendations: string[];
  biometric_data?: {
    heart_rate?: number;
    skin_conductance?: number;
    voice_stress?: number;
  };
  analysis_metadata: {
    scan_duration: number;
    modalities_used: string[];
    ai_model_version: string;
  };
}

interface RealtimeMetrics {
  current_emotion: string;
  confidence: number;
  heart_rate: number;
  stress_indicator: number;
  focus_level: number;
  timestamp: number;
}

const UltraEmotionScanPage: React.FC = () => {
  const { user, isAuthenticated } = useAuth();
  const { toast } = useToast();
  const device = useDeviceDetection();
  
  // Refs pour les médias
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);
  const animationFrameRef = useRef<number>();
  
  // États de l'interface
  const [isScanning, setIsScanning] = useState(false);
  const [scanMode, setScanMode] = useState<'camera' | 'voice' | 'multimodal'>('multimodal');
  const [currentResult, setCurrentResult] = useState<ScanResult | null>(null);
  const [realtimeData, setRealtimeData] = useState<RealtimeMetrics | null>(null);
  const [scanHistory, setScanHistory] = useState<ScanResult[]>([]);
  const [scanProgress, setScanProgress] = useState(0);
  const [isInitializing, setIsInitializing] = useState(false);
  const [permissionsGranted, setPermissionsGranted] = useState({ camera: false, microphone: false });
  const [aiProcessingStatus, setAiProcessingStatus] = useState<'idle' | 'processing' | 'completed' | 'error'>('idle');
  
  // Configuration avancée
  const [scanSettings, setScanSettings] = useState({
    duration: 30, // secondes
    sensitivity: 'medium',
    real_time_feedback: true,
    biometric_integration: true,
    ai_coaching: true,
    privacy_mode: false
  });

  // Animation values
  const scanRotation = useMotionValue(0);
  const confidenceScale = useTransform(
    useMotionValue(realtimeData?.confidence || 0), 
    [0, 100], 
    [0.8, 1.2]
  );

  useEffect(() => {
    if (isAuthenticated) {
      loadScanHistory();
    }
    checkDeviceCapabilities();
  }, [isAuthenticated]);

  useEffect(() => {
    if (isScanning) {
      startRealtimeAnimation();
    } else {
      stopRealtimeAnimation();
    }
    
    return () => stopRealtimeAnimation();
  }, [isScanning]);

  const checkDeviceCapabilities = async () => {
    try {
      // Vérifier les permissions caméra
      const cameraPermission = await navigator.mediaDevices.getUserMedia({ video: true });
      setPermissionsGranted(prev => ({ ...prev, camera: true }));
      cameraPermission.getTracks().forEach(track => track.stop());
      
      // Vérifier les permissions microphone
      const micPermission = await navigator.mediaDevices.getUserMedia({ audio: true });
      setPermissionsGranted(prev => ({ ...prev, microphone: true }));
      micPermission.getTracks().forEach(track => track.stop());
      
    } catch (error) {
      console.warn('Device permissions not granted:', error);
      toast({
        title: "Permissions requises",
        description: "Accordez l'accès à la caméra et au microphone pour une analyse complète",
        variant: "default",
        duration: 5000
      });
    }
  };

  const loadScanHistory = async () => {
    try {
      const { data, error } = await supabase
        .from('emotion_scans')
        .select('*')
        .eq('user_id', user?.id)
        .order('created_at', { ascending: false })
        .limit(10);

      if (error) throw error;
      setScanHistory(data || []);
    } catch (error) {
      console.error('Error loading scan history:', error);
    }
  };

  const initializeMediaStreams = async () => {
    setIsInitializing(true);
    try {
      const constraints: MediaStreamConstraints = {
        video: scanMode !== 'voice' ? {
          width: { ideal: 1280 },
          height: { ideal: 720 },
          frameRate: { ideal: 30 },
          facingMode: device.type === 'mobile' ? 'user' : 'user'
        } : false,
        audio: scanMode !== 'camera' ? {
          echoCancellation: true,
          noiseSuppression: true,
          sampleRate: 44100
        } : false
      };

      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      mediaStreamRef.current = stream;

      if (videoRef.current && stream.getVideoTracks().length > 0) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
      }

      if (stream.getAudioTracks().length > 0) {
        audioContextRef.current = new AudioContext();
      }

      toast({
        title: "Flux média initialisé",
        description: "Prêt pour l'analyse émotionnelle",
        duration: 2000
      });

    } catch (error) {
      toast({
        title: "Erreur d'initialisation",
        description: "Impossible d'accéder aux périphériques média",
        variant: "destructive"
      });
    } finally {
      setIsInitializing(false);
    }
  };

  const startEmotionScan = async () => {
    if (!mediaStreamRef.current) {
      await initializeMediaStreams();
    }

    setIsScanning(true);
    setAiProcessingStatus('processing');
    setScanProgress(0);
    
    // Démarrer le timer de scan
    const scanInterval = setInterval(() => {
      setScanProgress(prev => {
        if (prev >= 100) {
          clearInterval(scanInterval);
          completeScan();
          return 100;
        }
        return prev + (100 / (scanSettings.duration * 10)); // 10 updates per second
      });
    }, 100);

    // Simuler l'analyse en temps réel
    const realtimeInterval = setInterval(() => {
      if (scanProgress < 100) {
        generateRealtimeMetrics();
      } else {
        clearInterval(realtimeInterval);
      }
    }, 500);

    try {
      // Démarrer l'analyse IA réelle
      await performAIAnalysis();
    } catch (error) {
      setAiProcessingStatus('error');
      toast({
        title: "Erreur d'analyse",
        description: "L'analyse IA a échoué, veuillez réessayer",
        variant: "destructive"
      });
    }
  };

  const performAIAnalysis = async () => {
    try {
      // Capturer une frame pour l'analyse
      const canvas = canvasRef.current;
      const video = videoRef.current;
      
      if (canvas && video && scanMode !== 'voice') {
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
          const imageData = canvas.toDataURL('image/jpeg', 0.8);
          
          // Envoyer à l'API Hume AI pour analyse émotionnelle
          const response = await supabase.functions.invoke('hume-analysis', {
            body: {
              image_data: imageData,
              analysis_type: 'multimodal',
              user_id: user?.id,
              scan_settings: scanSettings
            }
          });

          if (response.data) {
            processAnalysisResult(response.data);
          }
        }
      }

      // Analyse audio si disponible
      if (audioContextRef.current && scanMode !== 'camera') {
        // Traitement audio en temps réel (simplifié)
        const response = await supabase.functions.invoke('voice-emotion-analysis', {
          body: {
            audio_context: 'real-time',
            user_id: user?.id
          }
        });
      }

    } catch (error) {
      console.error('AI Analysis error:', error);
      throw error;
    }
  };

  const processAnalysisResult = (analysisData: any) => {
    const emotions: EmotionData[] = analysisData.emotions.map((emotion: any) => ({
      emotion: emotion.name,
      confidence: emotion.confidence * 100,
      intensity: emotion.intensity * 100,
      color: getEmotionColor(emotion.name),
      description: getEmotionDescription(emotion.name)
    }));

    const result: ScanResult = {
      id: Date.now().toString(),
      timestamp: new Date().toISOString(),
      primary_emotion: analysisData.dominant_emotion,
      emotions,
      confidence_score: analysisData.confidence_score * 100,
      stress_level: (1 - analysisData.overall_sentiment) * 100,
      energy_level: Math.random() * 100, // À connecter aux vraies données biométriques
      mood_score: analysisData.overall_sentiment * 10,
      recommendations: generatePersonalizedRecommendations(emotions),
      analysis_metadata: {
        scan_duration: scanSettings.duration,
        modalities_used: [scanMode],
        ai_model_version: 'HumeAI-v2.1'
      }
    };

    setCurrentResult(result);
    setAiProcessingStatus('completed');
  };

  const generateRealtimeMetrics = () => {
    // Simulation de métriques en temps réel (à remplacer par de vraies données)
    const emotions = ['joy', 'calm', 'excitement', 'focus', 'confidence', 'stress', 'fatigue'];
    const currentEmotion = emotions[Math.floor(Math.random() * emotions.length)];
    
    setRealtimeData({
      current_emotion: currentEmotion,
      confidence: 70 + Math.random() * 30,
      heart_rate: 60 + Math.random() * 40,
      stress_indicator: Math.random() * 100,
      focus_level: 50 + Math.random() * 50,
      timestamp: Date.now()
    });
  };

  const completeScan = async () => {
    setIsScanning(false);
    setScanProgress(100);
    
    if (currentResult) {
      // Sauvegarder le résultat
      try {
        const { error } = await supabase
          .from('emotion_scans')
          .insert([{
            user_id: user?.id,
            scan_data: currentResult,
            created_at: new Date().toISOString()
          }]);

        if (error) throw error;

        // Mettre à jour l'historique
        setScanHistory(prev => [currentResult, ...prev.slice(0, 9)]);
        
        toast({
          title: "Analyse terminée !",
          description: `Émotion principale détectée: ${currentResult.primary_emotion}`,
          duration: 4000
        });

        // Générer des recommandations personnalisées
        await generateAIRecommendations(currentResult);

      } catch (error) {
        console.error('Error saving scan:', error);
      }
    }

    // Nettoyer les flux média
    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach(track => track.stop());
      mediaStreamRef.current = null;
    }
  };

  const generateAIRecommendations = async (result: ScanResult) => {
    try {
      const response = await supabase.functions.invoke('personalized-recommendations', {
        body: {
          user_id: user?.id,
          emotion_data: result,
          historical_data: scanHistory.slice(0, 5)
        }
      });

      if (response.data) {
        toast({
          title: "Recommandations personnalisées prêtes",
          description: "Découvrez vos conseils bien-être adaptatifs",
          duration: 3000
        });
      }
    } catch (error) {
      console.error('Error generating recommendations:', error);
    }
  };

  const generatePersonalizedRecommendations = (emotions: EmotionData[]): string[] => {
    const primaryEmotion = emotions[0]?.emotion.toLowerCase() || 'neutral';
    
    const recommendationsMap: Record<string, string[]> = {
      joy: [
        "Partagez ce moment positif avec vos proches",
        "Pratiquez la gratitude pour ancrer cette émotion",
        "Planifiez une activité créative pour prolonger cette énergie"
      ],
      stress: [
        "Pratiquez 5 minutes de respiration profonde",
        "Essayez une session de méditation guidée",
        "Prenez une pause et sortez prendre l'air"
      ],
      calm: [
        "Profitez de cet état pour planifier votre journée",
        "C'est le moment idéal pour une activité créative",
        "Pratiquez la pleine conscience pour maintenir cet équilibre"
      ],
      excitement: [
        "Canalisez cette énergie dans un projet important",
        "Partagez votre enthousiasme avec d'autres",
        "Planifiez des objectifs ambitieux mais réalisables"
      ]
    };

    return recommendationsMap[primaryEmotion] || [
      "Prenez un moment pour observer vos émotions",
      "Pratiquez l'auto-compassion",
      "Considérez tenir un journal émotionnel"
    ];
  };

  const getEmotionColor = (emotion: string): string => {
    const colorMap: Record<string, string> = {
      joy: '#10B981', // emerald-500
      happiness: '#F59E0B', // amber-500
      excitement: '#EF4444', // red-500
      calm: '#3B82F6', // blue-500
      sadness: '#6366F1', // indigo-500
      anger: '#DC2626', // red-600
      fear: '#7C3AED', // violet-600
      surprise: '#EC4899', // pink-500
      disgust: '#059669', // emerald-600
      neutral: '#6B7280', // gray-500
      stress: '#F97316', // orange-500
      focus: '#8B5CF6', // violet-500
      confidence: '#10B981', // emerald-500
      fatigue: '#64748B' // slate-500
    };
    
    return colorMap[emotion.toLowerCase()] || '#6B7280';
  };

  const getEmotionDescription = (emotion: string): string => {
    const descriptions: Record<string, string> = {
      joy: "Sentiment de bonheur et de satisfaction",
      happiness: "État de bien-être général",
      excitement: "Énergie positive et anticipation",
      calm: "Sérénité et tranquillité d'esprit",
      sadness: "Sentiment de mélancolie temporaire",
      anger: "Réaction à une frustration",
      fear: "Appréhension face à l'incertain",
      surprise: "Réaction à l'inattendu",
      stress: "Tension émotionnelle élevée",
      focus: "Concentration et attention soutenue",
      confidence: "Assurance et estime de soi",
      fatigue: "Épuisement mental ou physique"
    };
    
    return descriptions[emotion.toLowerCase()] || "État émotionnel en cours d'analyse";
  };

  const startRealtimeAnimation = () => {
    const animate = () => {
      scanRotation.set(scanRotation.get() + 2);
      animationFrameRef.current = requestAnimationFrame(animate);
    };
    animate();
  };

  const stopRealtimeAnimation = () => {
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
    }
  };

  const EmotionVisualization = ({ emotions }: { emotions: EmotionData[] }) => (
    <div className="space-y-4">
      {emotions.slice(0, 5).map((emotion, index) => (
        <motion.div
          key={emotion.emotion}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: index * 0.1 }}
          className="flex items-center space-x-4"
        >
          <div 
            className="w-4 h-4 rounded-full flex-shrink-0"
            style={{ backgroundColor: emotion.color }}
          />
          <div className="flex-1">
            <div className="flex items-center justify-between mb-1">
              <span className="text-sm font-medium text-foreground capitalize">
                {emotion.emotion}
              </span>
              <span className="text-xs text-muted-foreground">
                {emotion.confidence.toFixed(1)}%
              </span>
            </div>
            <Progress value={emotion.confidence} className="h-2" />
          </div>
        </motion.div>
      ))}
    </div>
  );

  const RealtimeDisplay = () => (
    <div className="space-y-6">
      {realtimeData && (
        <>
          <div className="text-center">
            <motion.div
              className="w-32 h-32 mx-auto mb-4 rounded-full border-4 border-primary/30 flex items-center justify-center"
              style={{ 
                borderColor: getEmotionColor(realtimeData.current_emotion),
                scale: confidenceScale 
              }}
              animate={{ rotate: 360 }}
              transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
            >
              <div className="text-center">
                <div className="text-2xl mb-1">
                  {realtimeData.current_emotion === 'joy' && '😊'}
                  {realtimeData.current_emotion === 'calm' && '😌'}
                  {realtimeData.current_emotion === 'stress' && '😰'}
                  {realtimeData.current_emotion === 'excitement' && '🤩'}
                  {realtimeData.current_emotion === 'focus' && '🎯'}
                  {realtimeData.current_emotion === 'confidence' && '😎'}
                  {!['joy', 'calm', 'stress', 'excitement', 'focus', 'confidence'].includes(realtimeData.current_emotion) && '🙂'}
                </div>
                <div className="text-xs font-medium text-muted-foreground capitalize">
                  {realtimeData.current_emotion}
                </div>
              </div>
            </motion.div>
            
            <div className="text-lg font-semibold mb-2">
              Confiance: {realtimeData.confidence.toFixed(1)}%
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Card className="bg-gradient-to-br from-red-50 to-pink-50 dark:from-red-900/20 dark:to-pink-900/20 border-red-200 dark:border-red-800">
              <CardContent className="p-4 text-center">
                <Heart className="h-6 w-6 mx-auto mb-2 text-red-500" />
                <div className="text-lg font-bold text-red-600">
                  {realtimeData.heart_rate.toFixed(0)}
                </div>
                <div className="text-xs text-red-500">BPM</div>
              </CardContent>
            </Card>
            
            <Card className="bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 border-blue-200 dark:border-blue-800">
              <CardContent className="p-4 text-center">
                <Target className="h-6 w-6 mx-auto mb-2 text-blue-500" />
                <div className="text-lg font-bold text-blue-600">
                  {realtimeData.focus_level.toFixed(0)}%
                </div>
                <div className="text-xs text-blue-500">Focus</div>
              </CardContent>
            </Card>
          </div>
        </>
      )}
    </div>
  );

  return (
    <ResponsiveWrapper>
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-cyan-50 dark:from-gray-900 dark:via-indigo-900 dark:to-cyan-900">
        <div className={cn(
          "container mx-auto py-8",
          device.type === 'desktop' && "px-8 max-w-7xl",
          device.type === 'tablet' && "px-6 max-w-6xl",
          "px-4"
        )}>
          {/* En-tête */}
          <motion.div
            className="text-center mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="flex items-center justify-center mb-4">
              <motion.div
                className="p-4 bg-gradient-to-br from-purple-500 to-blue-600 rounded-2xl"
                whileHover={{ scale: 1.05, rotate: 5 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <Brain className="h-8 w-8 text-white" />
              </motion.div>
            </div>
            
            <h1 className={cn(
              "font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent mb-4",
              device.type === 'desktop' && "text-5xl",
              device.type === 'tablet' && "text-4xl",
              "text-3xl"
            )}>
              Scan Émotionnel IA
            </h1>
            
            <p className="text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              Analyse émotionnelle avancée avec intelligence artificielle multimodale
            </p>

            {/* Statut du système */}
            <div className="flex items-center justify-center space-x-4 mt-6">
              <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                <div className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse" />
                Système IA Actif
              </Badge>
              <Badge variant="outline">
                Version 2.1
              </Badge>
              {device.type === 'desktop' && (
                <Badge variant="outline">
                  <Zap className="h-3 w-3 mr-1" />
                  Temps réel
                </Badge>
              )}
            </div>
          </motion.div>

          <div className={cn(
            "grid gap-8",
            device.type === 'desktop' && "grid-cols-3",
            device.type === 'tablet' && "grid-cols-2",
            "grid-cols-1"
          )}>
            {/* Zone de scan principal */}
            <motion.div
              className={cn(
                device.type === 'desktop' && "col-span-2",
                device.type === 'tablet' && "col-span-1",
                "space-y-6"
              )}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <Card className="bg-gradient-to-br from-white to-blue-50/50 dark:from-gray-800 dark:to-indigo-900/50 border-0 shadow-2xl">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center space-x-2">
                      <Camera className="h-5 w-5 text-blue-600" />
                      <span>Analyse en Direct</span>
                    </CardTitle>
                    
                    <div className="flex items-center space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setScanMode(scanMode === 'multimodal' ? 'camera' : 'multimodal')}
                        className="h-8"
                      >
                        {scanMode === 'multimodal' ? 'Multi' : 'Cam'}
                      </Button>
                      <Button variant="ghost" size="sm" className="h-8">
                        <Settings className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                
                <CardContent className="space-y-6">
                  {/* Zone vidéo */}
                  <div className="relative">
                    <div className={cn(
                      "relative bg-black rounded-xl overflow-hidden",
                      device.type === 'mobile' ? "aspect-[4/3]" : "aspect-video"
                    )}>
                      <video
                        ref={videoRef}
                        className="w-full h-full object-cover"
                        playsInline
                        muted
                      />
                      <canvas
                        ref={canvasRef}
                        className="hidden"
                        width={640}
                        height={480}
                      />
                      
                      {/* Overlay de scan */}
                      {isScanning && (
                        <div className="absolute inset-0 flex items-center justify-center">
                          <motion.div
                            className="w-64 h-64 border-2 border-cyan-400 rounded-full"
                            style={{ rotate: scanRotation }}
                            animate={{ scale: [1, 1.1, 1] }}
                            transition={{ duration: 2, repeat: Infinity }}
                          >
                            <div className="absolute inset-4 border border-cyan-300 rounded-full opacity-50" />
                            <div className="absolute inset-8 border border-cyan-200 rounded-full opacity-30" />
                          </motion.div>
                        </div>
                      )}

                      {/* Indicateurs temps réel */}
                      {isScanning && realtimeData && (
                        <div className="absolute top-4 left-4 space-y-2">
                          <div className="bg-black/50 backdrop-blur-sm rounded-lg px-3 py-2 text-white text-sm">
                            <div className="flex items-center space-x-2">
                              <div 
                                className="w-3 h-3 rounded-full"
                                style={{ backgroundColor: getEmotionColor(realtimeData.current_emotion) }}
                              />
                              <span className="capitalize">{realtimeData.current_emotion}</span>
                            </div>
                          </div>
                          <div className="bg-black/50 backdrop-blur-sm rounded-lg px-3 py-2 text-white text-sm">
                            {realtimeData.confidence.toFixed(1)}% confiance
                          </div>
                        </div>
                      )}

                      {/* Status overlay */}
                      {!isScanning && !mediaStreamRef.current && (
                        <div className="absolute inset-0 flex items-center justify-center bg-black/80">
                          <div className="text-center text-white space-y-4">
                            <Eye className="h-12 w-12 mx-auto opacity-50" />
                            <p className="text-lg">Prêt pour l'analyse</p>
                            <p className="text-sm opacity-75">
                              {!permissionsGranted.camera ? 'Autorisez l\'accès caméra' : 'Cliquez pour commencer'}
                            </p>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Barre de progression */}
                    {isScanning && (
                      <div className="mt-4">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm text-muted-foreground">
                            Analyse en cours...
                          </span>
                          <span className="text-sm font-medium">
                            {scanProgress.toFixed(0)}%
                          </span>
                        </div>
                        <Progress value={scanProgress} className="h-2" />
                      </div>
                    )}
                  </div>

                  {/* Contrôles */}
                  <div className="flex items-center justify-center space-x-4">
                    {!isScanning ? (
                      <FunctionalButton
                        actionId="start-scan"
                        onClick={startEmotionScan}
                        disabled={isInitializing}
                        size="lg"
                        className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white px-8"
                        loadingText="Initialisation..."
                      >
                        <Play className="h-5 w-5 mr-2" />
                        {isInitializing ? 'Préparation...' : 'Démarrer l\'Analyse'}
                      </FunctionalButton>
                    ) : (
                      <FunctionalButton
                        actionId="stop-scan"
                        onClick={completeScan}
                        variant="outline"
                        size="lg"
                        className="px-8"
                      >
                        <Square className="h-5 w-5 mr-2" />
                        Arrêter
                      </FunctionalButton>
                    )}
                    
                    <Button
                      variant="ghost"
                      size="lg"
                      onClick={() => {
                        if (videoRef.current) {
                          videoRef.current.play();
                        }
                      }}
                      disabled={isScanning}
                    >
                      <RotateCcw className="h-5 w-5" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Panneau de résultats */}
            <motion.div
              className="space-y-6"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
            >
              <Tabs defaultValue="realtime">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="realtime">Temps Réel</TabsTrigger>
                  <TabsTrigger value="results">Résultats</TabsTrigger>
                </TabsList>

                <TabsContent value="realtime" className="space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center space-x-2">
                        <Activity className="h-5 w-5 text-green-500" />
                        <span>Métriques Live</span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      {isScanning ? (
                        <RealtimeDisplay />
                      ) : (
                        <div className="text-center py-8 text-muted-foreground">
                          <Waves className="h-12 w-12 mx-auto mb-4 opacity-50" />
                          <p>Démarrez un scan pour voir les métriques en temps réel</p>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="results" className="space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center space-x-2">
                        <BarChart3 className="h-5 w-5 text-blue-500" />
                        <span>Dernière Analyse</span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      {currentResult ? (
                        <div className="space-y-6">
                          <div className="text-center pb-4 border-b">
                            <div className="text-3xl mb-2">
                              {currentResult.primary_emotion === 'joy' && '😊'}
                              {currentResult.primary_emotion === 'calm' && '😌'}
                              {currentResult.primary_emotion === 'stress' && '😰'}
                              {!['joy', 'calm', 'stress'].includes(currentResult.primary_emotion) && '🙂'}
                            </div>
                            <div className="text-lg font-semibold capitalize mb-1">
                              {currentResult.primary_emotion}
                            </div>
                            <div className="text-sm text-muted-foreground">
                              Confiance: {currentResult.confidence_score.toFixed(1)}%
                            </div>
                          </div>

                          <div>
                            <h4 className="font-medium mb-3">Distribution Émotionnelle</h4>
                            <EmotionVisualization emotions={currentResult.emotions} />
                          </div>

                          <div className="grid grid-cols-2 gap-4">
                            <div className="text-center p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                              <div className="text-2xl font-bold text-blue-600">
                                {currentResult.mood_score.toFixed(1)}
                              </div>
                              <div className="text-xs text-blue-500">Score Humeur</div>
                            </div>
                            <div className="text-center p-3 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
                              <div className="text-2xl font-bold text-orange-600">
                                {currentResult.stress_level.toFixed(0)}%
                              </div>
                              <div className="text-xs text-orange-500">Niveau Stress</div>
                            </div>
                          </div>

                          {currentResult.recommendations.length > 0 && (
                            <div>
                              <h4 className="font-medium mb-3 flex items-center">
                                <Sparkles className="h-4 w-4 mr-2 text-yellow-500" />
                                Recommandations IA
                              </h4>
                              <div className="space-y-2">
                                {currentResult.recommendations.slice(0, 3).map((rec, index) => (
                                  <div key={index} className="flex items-start space-x-2 p-3 bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20 rounded-lg">
                                    <div className="w-6 h-6 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                                      <span className="text-white text-xs font-bold">{index + 1}</span>
                                    </div>
                                    <p className="text-sm leading-relaxed">{rec}</p>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      ) : (
                        <div className="text-center py-8 text-muted-foreground">
                          <PieChart className="h-12 w-12 mx-auto mb-4 opacity-50" />
                          <p>Aucune analyse récente</p>
                          <p className="text-xs mt-2">Effectuez un scan pour voir les résultats détaillés</p>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>

              {/* Historique compact */}
              {scanHistory.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <Clock className="h-5 w-5 text-gray-500" />
                      <span>Historique</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {scanHistory.slice(0, 3).map((scan, index) => (
                        <div key={scan.id} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                          <div className="flex items-center space-x-3">
                            <div 
                              className="w-3 h-3 rounded-full"
                              style={{ backgroundColor: getEmotionColor(scan.primary_emotion) }}
                            />
                            <div>
                              <div className="text-sm font-medium capitalize">
                                {scan.primary_emotion}
                              </div>
                              <div className="text-xs text-muted-foreground">
                                {new Date(scan.timestamp).toLocaleDateString('fr-FR')}
                              </div>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="text-sm font-medium">
                              {scan.confidence_score.toFixed(0)}%
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                    
                    {scanHistory.length > 3 && (
                      <NavigationButton
                        to="/activity-history"
                        variant="ghost"
                        size="sm"
                        className="w-full mt-4"
                      >
                        Voir tout l'historique
                      </NavigationButton>
                    )}
                  </CardContent>
                </Card>
              )}
            </motion.div>
          </div>
        </div>
      </div>
    </ResponsiveWrapper>
  );
};

export default UltraEmotionScanPage;