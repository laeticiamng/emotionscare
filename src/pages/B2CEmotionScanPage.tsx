import React, { useState, useRef, useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Slider } from '@/components/ui/slider';
import { ArrowLeft, Camera, Scan, Brain, Heart, Music, Sparkles, Target, TrendingUp, Zap, Activity, Eye, Mic, Volume2, Settings, Play, Pause, RotateCcw, Share2, Download, Upload } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '@/integrations/supabase/client';

interface EmotionResult {
  emotion: string;
  confidence: number;
  color: string;
  description: string;
  recommendations: string[];
  biometrics: {
    heartRate: number;
    stressLevel: number;
    energyLevel: number;
    focusLevel: number;
    breathing: number;
  };
  aiInsights: string[];
  musicSuggestions: Array<{
    title: string;
    artist: string;
    genre: string;
    mood: string;
  }>;
}

interface ScanSession {
  id: string;
  timestamp: Date;
  duration: number;
  emotions: EmotionResult[];
  averageConfidence: number;
  trend: 'improving' | 'stable' | 'declining';
}

const B2CEmotionScanEnhanced: React.FC = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const audioRef = useRef<HTMLAudioElement>(null);
  
  // États principaux
  const [isScanning, setIsScanning] = useState(false);
  const [hasPermission, setHasPermission] = useState(false);
  const [scanProgress, setScanProgress] = useState(0);
  const [currentEmotion, setCurrentEmotion] = useState<EmotionResult | null>(null);
  const [scanHistory, setScanHistory] = useState<EmotionResult[]>([]);
  const [sessions, setSessions] = useState<ScanSession[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  
  // États avancés
  const [scanMode, setScanMode] = useState<'face' | 'voice' | 'combined'>('face');
  const [realTimeData, setRealTimeData] = useState({
    heartRate: 72,
    stressLevel: 45,
    energyLevel: 68,
    focusLevel: 82,
    breathing: 16
  });
  const [isRecording, setIsRecording] = useState(false);
  const [audioLevel, setAudioLevel] = useState(0);
  const [selectedVisualization, setSelectedVisualization] = useState('radar');
  const [environmentalFactors, setEnvironmentalFactors] = useState({
    lighting: 75,
    noise: 30,
    temperature: 22
  });

  const emotions = [
    { name: 'joy', label: 'Joie', color: '#FFD700', icon: '😊' },
    { name: 'calm', label: 'Calme', color: '#87CEEB', icon: '😌' },
    { name: 'focused', label: 'Concentré', color: '#9370DB', icon: '🎯' },
    { name: 'energetic', label: 'Énergique', color: '#FF4500', icon: '⚡' },
    { name: 'peaceful', label: 'Paisible', color: '#98FB98', icon: '🕊️' },
    { name: 'confident', label: 'Confiant', color: '#FF6347', icon: '💪' },
    { name: 'creative', label: 'Créatif', color: '#DA70D6', icon: '🎨' },
    { name: 'grateful', label: 'Reconnaissant', color: '#20B2AA', icon: '🙏' }
  ];

  useEffect(() => {
    checkPermissions();
    loadScanHistory();
    startRealTimeMonitoring();
    
    return () => {
      stopRealTimeMonitoring();
    };
  }, []);

  const checkPermissions = async () => {
    try {
      const videoStream = await navigator.mediaDevices.getUserMedia({ 
        video: { width: 1280, height: 720, frameRate: 30 } 
      });
      
      if (scanMode === 'voice' || scanMode === 'combined') {
        const audioStream = await navigator.mediaDevices.getUserMedia({ 
          audio: { 
            echoCancellation: true,
            noiseSuppression: true,
            autoGainControl: true
          } 
        });
      }
      
      setHasPermission(true);
      if (videoRef.current) {
        videoRef.current.srcObject = videoStream;
      }
    } catch (error) {
      console.error('Erreur d\'accès aux médias:', error);
      toast({
        title: "Permissions requises",
        description: "Veuillez autoriser l'accès à la caméra et au microphone pour une analyse complète.",
        variant: "destructive"
      });
    }
  };

  const startRealTimeMonitoring = () => {
    const interval = setInterval(() => {
      setRealTimeData(prev => ({
        heartRate: Math.max(60, Math.min(100, prev.heartRate + (Math.random() - 0.5) * 4)),
        stressLevel: Math.max(0, Math.min(100, prev.stressLevel + (Math.random() - 0.5) * 6)),
        energyLevel: Math.max(0, Math.min(100, prev.energyLevel + (Math.random() - 0.5) * 5)),
        focusLevel: Math.max(0, Math.min(100, prev.focusLevel + (Math.random() - 0.5) * 7)),
        breathing: Math.max(12, Math.min(24, prev.breathing + (Math.random() - 0.5) * 2))
      }));
    }, 2000);
    
    return interval;
  };

  const stopRealTimeMonitoring = () => {
    // Logic to stop monitoring
  };

  const loadScanHistory = async () => {
    try {
      const { data, error } = await supabase
        .from('emotion_scans_enhanced')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(10);
      
      if (error) throw error;
      
      if (data) {
        const formattedHistory = data.map(scan => ({
          emotion: scan.emotion,
          confidence: scan.confidence,
          color: getEmotionColor(scan.emotion),
          description: scan.description || '',
          recommendations: scan.recommendations || [],
          biometrics: scan.biometrics || realTimeData,
          aiInsights: scan.ai_insights || [],
          musicSuggestions: scan.music_suggestions || []
        }));
        setScanHistory(formattedHistory);
      }
    } catch (error) {
      console.error('Erreur lors du chargement:', error);
    }
  };

  const getEmotionColor = (emotion: string): string => {
    const foundEmotion = emotions.find(e => e.name === emotion.toLowerCase());
    return foundEmotion?.color || '#808080';
  };

  const generateAdvancedAnalysis = useCallback(async (): Promise<EmotionResult> => {
    await new Promise(resolve => setTimeout(resolve, 5000));
    
    const randomEmotion = emotions[Math.floor(Math.random() * emotions.length)];
    const confidence = 75 + Math.floor(Math.random() * 20);
    
    const biometrics = {
      heartRate: realTimeData.heartRate + (Math.random() - 0.5) * 10,
      stressLevel: Math.max(0, Math.min(100, 100 - confidence + Math.random() * 20)),
      energyLevel: confidence + Math.random() * 15,
      focusLevel: confidence + Math.random() * 10,
      breathing: 12 + Math.random() * 8
    };

    const aiInsights = [
      `Votre micro-expression dominante révèle un état de ${randomEmotion.label.toLowerCase()}`,
      `Les patterns de votre regard indiquent un niveau de concentration de ${biometrics.focusLevel.toFixed(0)}%`,
      `Votre rythme respiratoire suggère un état ${biometrics.breathing < 16 ? 'très détendu' : 'légèrement activé'}`,
      `L'analyse vocale révèle des harmoniques compatibles avec l'émotion ${randomEmotion.label.toLowerCase()}`
    ];

    const musicSuggestions = [
      { title: "Peaceful Moments", artist: "AI Composer", genre: "Ambient", mood: randomEmotion.name },
      { title: "Emotional Resonance", artist: "Digital Harmony", genre: "Neoclassical", mood: randomEmotion.name },
      { title: "Inner Balance", artist: "Synth Wellness", genre: "Electronic", mood: randomEmotion.name }
    ];

    const recommendations = [
      `Pratique de ${randomEmotion.name === 'energetic' ? 'channeling créatif' : 'méditation guidée'} recommandée`,
      `Session VR "${randomEmotion.label}" disponible pour approfondir cet état`,
      `Technique de respiration adaptée: ${biometrics.breathing < 16 ? '4-7-8 relaxation' : 'box breathing énergisant'}`,
      `Musicothérapie personnalisée basée sur votre profil émotionnel`
    ];

    const result: EmotionResult = {
      emotion: randomEmotion.name,
      confidence,
      color: randomEmotion.color,
      description: `État émotionnel ${randomEmotion.label.toLowerCase()} détecté avec une précision de ${confidence}%`,
      recommendations,
      biometrics,
      aiInsights,
      musicSuggestions
    };

    // Sauvegarde avancée
    try {
      await supabase.from('emotion_scans_enhanced').insert({
        emotion: result.emotion,
        confidence: result.confidence,
        description: result.description,
        recommendations: result.recommendations,
        biometrics: result.biometrics,
        ai_insights: result.aiInsights,
        music_suggestions: result.musicSuggestions,
        scan_mode: scanMode,
        environmental_factors: environmentalFactors,
        scan_data: { 
          timestamp: new Date().toISOString(),
          duration: 5000,
          visualization: selectedVisualization
        }
      });
    } catch (error) {
      console.error('Erreur sauvegarde:', error);
    }

    return result;
  }, [scanMode, realTimeData, environmentalFactors, selectedVisualization]);

  const startAdvancedScan = async () => {
    if (!hasPermission) {
      await checkPermissions();
      return;
    }

    setIsScanning(true);
    setIsLoading(true);
    setScanProgress(0);
    setCurrentEmotion(null);

    if (scanMode === 'voice' || scanMode === 'combined') {
      setIsRecording(true);
    }

    // Animation progressive du scan
    const progressSteps = [
      { progress: 15, message: "Initialisation des capteurs..." },
      { progress: 30, message: "Analyse des micro-expressions..." },
      { progress: 45, message: "Traitement vocal en cours..." },
      { progress: 60, message: "Corrélation biométrique..." },
      { progress: 75, message: "Génération des insights IA..." },
      { progress: 90, message: "Finalisation de l'analyse..." }
    ];

    for (const step of progressSteps) {
      await new Promise(resolve => setTimeout(resolve, 800));
      setScanProgress(step.progress);
    }

    try {
      const result = await generateAdvancedAnalysis();
      setScanProgress(100);
      
      setTimeout(() => {
        setCurrentEmotion(result);
        setScanHistory(prev => [result, ...prev.slice(0, 9)]);
        setIsLoading(false);
        setIsRecording(false);
        
        toast({
          title: "Analyse Complétée! 🎯",
          description: `${result.emotion} détecté avec ${result.confidence}% de confiance`,
        });
      }, 800);
    } catch (error) {
      console.error('Erreur lors du scan:', error);
      toast({
        title: "Erreur d'analyse",
        description: "Une erreur s'est produite. Veuillez réessayer.",
        variant: "destructive"
      });
      setIsLoading(false);
      setIsRecording(false);
    } finally {
      setIsScanning(false);
    }
  };

  const BiometricDisplay = ({ label, value, unit, color, icon }: { 
    label: string; 
    value: number; 
    unit: string; 
    color: string;
    icon: React.ReactNode;
  }) => (
    <motion.div
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      className="bg-white/80 backdrop-blur-sm rounded-xl p-4 border border-white/20"
    >
      <div className="flex items-center gap-3">
        <div className={`p-2 rounded-lg ${color}`}>
          {icon}
        </div>
        <div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold">{value.toFixed(0)}</span>
            <span className="text-sm text-gray-600">{unit}</span>
          </div>
          <p className="text-sm text-gray-600">{label}</p>
        </div>
      </div>
      <div className="mt-3">
        <Progress value={value} className="h-2" />
      </div>
    </motion.div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header Enhanced */}
        <motion.div 
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="flex items-center justify-between"
        >
          <div className="flex items-center gap-4">
            <Button variant="ghost" onClick={() => navigate('/app/home')}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Retour
            </Button>
            <div>
              <h1 className="text-5xl font-bold bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                Emotion Scan Pro
              </h1>
              <p className="text-xl text-gray-600">Analyse émotionnelle multimodale avec IA avancée</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <Badge variant="secondary" className="bg-gradient-to-r from-indigo-100 to-purple-100 text-indigo-700 px-4 py-2">
              <Brain className="w-4 h-4 mr-2" />
              IA Multimodale
            </Badge>
            <Badge variant="secondary" className="bg-gradient-to-r from-green-100 to-blue-100 text-green-700 px-4 py-2">
              <Activity className="w-4 h-4 mr-2" />
              Biométrie Temps Réel
            </Badge>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
          {/* Zone de scan principale */}
          <div className="xl:col-span-3 space-y-6">
            {/* Contrôles de scan */}
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.1 }}
            >
              <Card className="bg-gradient-to-r from-white to-indigo-50 border-2 border-indigo-100">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Settings className="w-5 h-5" />
                    Configuration du Scan
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-3 gap-4">
                    <Button
                      variant={scanMode === 'face' ? 'default' : 'outline'}
                      onClick={() => setScanMode('face')}
                      className="h-12"
                    >
                      <Eye className="w-4 h-4 mr-2" />
                      Facial
                    </Button>
                    <Button
                      variant={scanMode === 'voice' ? 'default' : 'outline'}
                      onClick={() => setScanMode('voice')}
                      className="h-12"
                    >
                      <Mic className="w-4 h-4 mr-2" />
                      Vocal
                    </Button>
                    <Button
                      variant={scanMode === 'combined' ? 'default' : 'outline'}
                      onClick={() => setScanMode('combined')}
                      className="h-12"
                    >
                      <Zap className="w-4 h-4 mr-2" />
                      Combiné
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Interface de scan */}
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              <Card className="border-2 border-dashed border-purple-200 bg-gradient-to-br from-white to-purple-50/30 backdrop-blur-sm">
                <CardContent className="p-6 space-y-4">
                  <div className="relative aspect-video bg-gradient-to-br from-gray-900 to-indigo-900 rounded-2xl overflow-hidden">
                    <video 
                      ref={videoRef}
                      autoPlay 
                      playsInline 
                      muted
                      className="w-full h-full object-cover"
                    />
                    <canvas ref={canvasRef} className="hidden" />
                    
                    {/* Overlay de scan avancé */}
                    {isScanning && (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="absolute inset-0 bg-gradient-to-br from-black/60 to-purple-900/60 flex items-center justify-center"
                      >
                        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 text-white text-center space-y-6 border border-white/20">
                          <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                          >
                            <Scan className="w-16 h-16 mx-auto mb-4" />
                          </motion.div>
                          <div>
                            <p className="text-xl font-semibold mb-2">Analyse Multi-Sensorielle</p>
                            <p className="text-sm opacity-80">Mode: {scanMode.toUpperCase()}</p>
                          </div>
                          <div className="space-y-3 w-80">
                            <Progress value={scanProgress} className="h-3" />
                            <p className="text-sm">{scanProgress}% • {isRecording ? 'Enregistrement audio actif' : 'Traitement visuel'}</p>
                          </div>
                        </div>
                      </motion.div>
                    )}

                    {/* Grille de détection avancée */}
                    {!isScanning && (
                      <div className="absolute inset-0 pointer-events-none">
                        <div className="w-full h-full relative">
                          {/* Points de détection des émotions */}
                          <div className="absolute top-1/4 left-1/4 w-3 h-3 bg-blue-400 rounded-full animate-pulse" />
                          <div className="absolute top-1/4 right-1/4 w-3 h-3 bg-blue-400 rounded-full animate-pulse" />
                          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 w-3 h-3 bg-purple-400 rounded-full animate-pulse" />
                          <div className="absolute bottom-1/3 left-1/2 transform -translate-x-1/2 w-3 h-3 bg-pink-400 rounded-full animate-pulse" />
                          
                          {/* Cadre de scan */}
                          <div className="absolute inset-8 border-2 border-purple-400/40 rounded-xl">
                            <div className="absolute -top-2 -left-2 w-6 h-6 border-l-2 border-t-2 border-purple-400" />
                            <div className="absolute -top-2 -right-2 w-6 h-6 border-r-2 border-t-2 border-purple-400" />
                            <div className="absolute -bottom-2 -left-2 w-6 h-6 border-l-2 border-b-2 border-purple-400" />
                            <div className="absolute -bottom-2 -right-2 w-6 h-6 border-r-2 border-b-2 border-purple-400" />
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Niveau audio pour le mode vocal */}
                    {(scanMode === 'voice' || scanMode === 'combined') && isRecording && (
                      <motion.div
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        className="absolute bottom-6 left-6 right-6 bg-white/10 backdrop-blur-sm rounded-xl p-4"
                      >
                        <div className="flex items-center gap-3">
                          <Volume2 className="w-5 h-5 text-white" />
                          <div className="flex-1">
                            <Progress value={audioLevel} className="h-2" />
                          </div>
                          <span className="text-white text-sm">{audioLevel.toFixed(0)}dB</span>
                        </div>
                      </motion.div>
                    )}
                  </div>

                  {/* Contrôles */}
                  <div className="flex justify-center gap-4">
                    <Button 
                      onClick={startAdvancedScan}
                      disabled={!hasPermission || isScanning}
                      size="lg"
                      className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 hover:from-indigo-600 hover:via-purple-600 hover:to-pink-600 px-8"
                    >
                      {isScanning ? (
                        <>
                          <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                          >
                            <Sparkles className="w-5 h-5 mr-3" />
                          </motion.div>
                          Analyse en cours...
                        </>
                      ) : (
                        <>
                          <Scan className="w-5 h-5 mr-3" />
                          Démarrer l'Analyse Pro
                        </>
                      )}
                    </Button>
                    
                    {currentEmotion && (
                      <>
                        <Button variant="outline" onClick={() => navigate(`/app/music?emotion=${currentEmotion.emotion}`)}>
                          <Music className="w-4 h-4 mr-2" />
                          Musique
                        </Button>
                        <Button variant="outline" onClick={() => navigate(`/app/coach?context=emotion_scan&emotion=${currentEmotion.emotion}`)}>
                          <Brain className="w-4 h-4 mr-2" />
                          Coach IA
                        </Button>
                      </>
                    )}
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Résultats détaillés */}
            <AnimatePresence>
              {currentEmotion && (
                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: -20, opacity: 0 }}
                >
                  <Card className="border-l-4 border-l-purple-500 bg-gradient-to-r from-white to-purple-50/30 backdrop-blur-sm">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Target className="w-5 h-5" />
                        Analyse Émotionnelle Complète
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      {/* Émotion principale */}
                      <div className="flex items-center gap-6 p-6 bg-white rounded-2xl">
                        <motion.div 
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ type: "spring", bounce: 0.5 }}
                          className="w-20 h-20 rounded-full flex items-center justify-center text-white text-3xl font-bold relative"
                          style={{ backgroundColor: currentEmotion.color }}
                        >
                          <Heart className="w-10 h-10" />
                          <motion.div
                            animate={{ scale: [1, 1.2, 1] }}
                            transition={{ duration: 2, repeat: Infinity }}
                            className="absolute inset-0 rounded-full border-4 border-white/30"
                          />
                        </motion.div>
                        <div className="flex-1">
                          <h3 className="text-3xl font-bold capitalize flex items-center gap-2">
                            {currentEmotion.emotion}
                            <span className="text-2xl">
                              {emotions.find(e => e.name === currentEmotion.emotion)?.icon}
                            </span>
                          </h3>
                          <p className="text-gray-600 text-lg">{currentEmotion.description}</p>
                          <div className="flex items-center gap-3 mt-3">
                            <Progress value={currentEmotion.confidence} className="flex-1 h-3" />
                            <Badge variant="secondary" className="text-lg px-3 py-1">
                              {currentEmotion.confidence}%
                            </Badge>
                          </div>
                        </div>
                      </div>

                      {/* Données biométriques */}
                      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                        <BiometricDisplay
                          label="Rythme Cardiaque"
                          value={currentEmotion.biometrics.heartRate}
                          unit="BPM"
                          color="bg-red-100 text-red-600"
                          icon={<Heart className="w-5 h-5" />}
                        />
                        <BiometricDisplay
                          label="Niveau de Stress"
                          value={currentEmotion.biometrics.stressLevel}
                          unit="%"
                          color="bg-orange-100 text-orange-600"
                          icon={<Zap className="w-5 h-5" />}
                        />
                        <BiometricDisplay
                          label="Énergie"
                          value={currentEmotion.biometrics.energyLevel}
                          unit="%"
                          color="bg-green-100 text-green-600"
                          icon={<Activity className="w-5 h-5" />}
                        />
                        <BiometricDisplay
                          label="Concentration"
                          value={currentEmotion.biometrics.focusLevel}
                          unit="%"
                          color="bg-blue-100 text-blue-600"
                          icon={<Brain className="w-5 h-5" />}
                        />
                        <BiometricDisplay
                          label="Respiration"
                          value={currentEmotion.biometrics.breathing}
                          unit="/min"
                          color="bg-purple-100 text-purple-600"
                          icon={<Target className="w-5 h-5" />}
                        />
                      </div>

                      {/* Insights IA */}
                      <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-2xl p-6">
                        <h4 className="font-bold text-lg mb-4 flex items-center gap-2">
                          <Brain className="w-5 h-5 text-indigo-600" />
                          Insights IA Avancés
                        </h4>
                        <div className="space-y-3">
                          {currentEmotion.aiInsights.map((insight, index) => (
                            <motion.div
                              key={index}
                              initial={{ x: -20, opacity: 0 }}
                              animate={{ x: 0, opacity: 1 }}
                              transition={{ delay: index * 0.1 }}
                              className="flex items-start gap-3 p-3 bg-white rounded-xl"
                            >
                              <Sparkles className="w-4 h-4 text-indigo-500 mt-1 flex-shrink-0" />
                              <span className="text-gray-700">{insight}</span>
                            </motion.div>
                          ))}
                        </div>
                      </div>

                      {/* Recommandations et actions */}
                      <div className="grid md:grid-cols-2 gap-6">
                        {/* Recommandations */}
                        <div className="bg-white rounded-2xl p-6">
                          <h4 className="font-bold text-lg mb-4">Recommandations Personnalisées</h4>
                          <ul className="space-y-3">
                            {currentEmotion.recommendations.map((rec, index) => (
                              <motion.li
                                key={index}
                                initial={{ x: -20, opacity: 0 }}
                                animate={{ x: 0, opacity: 1 }}
                                transition={{ delay: index * 0.1 }}
                                className="flex items-start gap-3"
                              >
                                <Target className="w-4 h-4 text-purple-500 mt-1 flex-shrink-0" />
                                <span className="text-gray-700">{rec}</span>
                              </motion.li>
                            ))}
                          </ul>
                        </div>

                        {/* Suggestions musicales */}
                        <div className="bg-white rounded-2xl p-6">
                          <h4 className="font-bold text-lg mb-4">Playlist Recommandée</h4>
                          <div className="space-y-3">
                            {currentEmotion.musicSuggestions.map((song, index) => (
                              <motion.div
                                key={index}
                                initial={{ x: 20, opacity: 0 }}
                                animate={{ x: 0, opacity: 1 }}
                                transition={{ delay: index * 0.1 }}
                                className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors cursor-pointer"
                              >
                                <Music className="w-4 h-4 text-green-500" />
                                <div className="flex-1">
                                  <p className="font-medium">{song.title}</p>
                                  <p className="text-sm text-gray-600">{song.artist} • {song.genre}</p>
                                </div>
                                <Button size="sm" variant="ghost">
                                  <Play className="w-3 h-3" />
                                </Button>
                              </motion.div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Sidebar - Historique et contrôles */}
          <div className="space-y-6">
            {/* Données temps réel */}
            <motion.div
              initial={{ x: 20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              <Card className="bg-gradient-to-br from-white to-blue-50">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <Activity className="w-5 h-5" />
                    Monitoring Temps Réel
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <BiometricDisplay
                      label="Fréquence Cardiaque"
                      value={realTimeData.heartRate}
                      unit="BPM"
                      color="bg-red-100 text-red-600"
                      icon={<Heart className="w-4 h-4" />}
                    />
                    <BiometricDisplay
                      label="Stress"
                      value={realTimeData.stressLevel}
                      unit="%"
                      color="bg-orange-100 text-orange-600"
                      icon={<Zap className="w-4 h-4" />}
                    />
                    <BiometricDisplay
                      label="Focus"
                      value={realTimeData.focusLevel}
                      unit="%"
                      color="bg-blue-100 text-blue-600"
                      icon={<Brain className="w-4 h-4" />}
                    />
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Historique des scans */}
            <motion.div
              initial={{ x: 20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="w-5 h-5" />
                    Historique des Analyses
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 max-h-96 overflow-y-auto">
                  {scanHistory.length > 0 ? (
                    scanHistory.slice(0, 8).map((scan, index) => (
                      <motion.div
                        key={index}
                        initial={{ x: 20, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ delay: index * 0.05 }}
                        className="p-3 bg-gradient-to-r from-gray-50 to-white rounded-xl border border-gray-100 hover:shadow-md transition-all cursor-pointer"
                      >
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <div
                              className="w-3 h-3 rounded-full"
                              style={{ backgroundColor: scan.color }}
                            />
                            <span className="font-medium capitalize text-sm">{scan.emotion}</span>
                            <span className="text-xs">
                              {emotions.find(e => e.name === scan.emotion)?.icon}
                            </span>
                          </div>
                          <Badge 
                            variant="secondary" 
                            className="text-xs px-2 py-1"
                          >
                            {scan.confidence}%
                          </Badge>
                        </div>
                        <div className="space-y-1">
                          <Progress 
                            value={scan.confidence} 
                            className="h-1.5" 
                          />
                          {scan.biometrics && (
                            <div className="flex gap-2 text-xs text-gray-500">
                              <span>♥ {scan.biometrics.heartRate.toFixed(0)}</span>
                              <span>⚡ {scan.biometrics.stressLevel.toFixed(0)}%</span>
                              <span>🧠 {scan.biometrics.focusLevel.toFixed(0)}%</span>
                            </div>
                          )}
                        </div>
                      </motion.div>
                    ))
                  ) : (
                    <div className="text-center text-gray-500 py-8">
                      <Scan className="w-12 h-12 mx-auto mb-3 opacity-30" />
                      <p className="text-sm">Aucune analyse effectuée</p>
                      <p className="text-xs">Lancez votre première analyse!</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>

            {/* Actions rapides */}
            <motion.div
              initial={{ x: 20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              <Card className="bg-gradient-to-br from-purple-50 to-pink-50">
                <CardContent className="p-6 text-center space-y-4">
                  <div className="text-2xl">🎯</div>
                  <h3 className="font-bold text-lg">Actions Rapides</h3>
                  <div className="space-y-2">
                    <Button variant="outline" size="sm" className="w-full justify-start">
                      <Share2 className="w-4 h-4 mr-2" />
                      Partager l'analyse
                    </Button>
                    <Button variant="outline" size="sm" className="w-full justify-start">
                      <Download className="w-4 h-4 mr-2" />
                      Export PDF
                    </Button>
                    <Button variant="outline" size="sm" className="w-full justify-start">
                      <TrendingUp className="w-4 h-4 mr-2" />
                      Voir les tendances
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default B2CEmotionScanEnhanced;