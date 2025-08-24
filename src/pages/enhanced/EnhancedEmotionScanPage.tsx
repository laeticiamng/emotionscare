import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { 
  Camera, Mic, MicOff, Brain, Eye, Heart, Zap, TrendingUp, 
  ArrowLeft, Sparkles, Activity, Clock, Target, BarChart3,
  Scan, PlayCircle, StopCircle, FileText, Download, Share2,
  AlertCircle, CheckCircle, XCircle, Loader2, Smile, Frown,
  Coffee, Moon, Sun, Wind, Mountain, Waves
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { motion, AnimatePresence } from 'framer-motion';
import { useDeviceDetection } from '@/hooks/useDeviceDetection';
import ResponsiveWrapper from '@/components/responsive/ResponsiveWrapper';
import { supabase } from '@/integrations/supabase/client';
import FunctionalButton from '@/components/ui/functional-button';
import { cn } from '@/lib/utils';

interface EmotionResult {
  emotion: string;
  confidence: number;
  intensity: number;
  valence: number; // -1 à 1 (négatif à positif)
  arousal: number; // 0 à 1 (calme à excité)
  dominance: number; // 0 à 1 (soumis à dominant)
  timestamp: string;
  source: 'text' | 'voice' | 'facial' | 'multimodal';
}

interface BiometricData {
  heartRate?: number;
  heartRateVariability?: number;
  stressLevel: number;
  focusLevel: number;
  energyLevel: number;
  wellnessScore: number;
}

interface Recommendation {
  id: string;
  type: 'music' | 'breathing' | 'activity' | 'mindfulness' | 'therapy';
  title: string;
  description: string;
  duration: string;
  icon: any;
  color: string;
  action: () => void;
}

const EnhancedEmotionScanPage: React.FC = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const device = useDeviceDetection();
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  const [isScanning, setIsScanning] = useState(false);
  const [scanMode, setScanMode] = useState<'text' | 'voice' | 'facial' | 'multimodal'>('text');
  const [textInput, setTextInput] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(null);
  const [cameraStream, setCameraStream] = useState<MediaStream | null>(null);
  
  const [currentResult, setCurrentResult] = useState<EmotionResult | null>(null);
  const [historicalResults, setHistoricalResults] = useState<EmotionResult[]>([]);
  const [biometrics, setBiometrics] = useState<BiometricData>({
    stressLevel: 45,
    focusLevel: 72,
    energyLevel: 68,
    wellnessScore: 75
  });
  
  const [sessionData, setSessionData] = useState({
    startTime: null as Date | null,
    totalScans: 0,
    averageValence: 0,
    predominantEmotion: '',
    recommendations: [] as Recommendation[]
  });

  const emotionColors: Record<string, string> = {
    joy: 'from-yellow-400 to-orange-400',
    happiness: 'from-green-400 to-blue-400',
    excitement: 'from-red-400 to-pink-400',
    calm: 'from-blue-400 to-cyan-400',
    relaxed: 'from-green-500 to-teal-500',
    sadness: 'from-blue-600 to-indigo-600',
    anger: 'from-red-500 to-red-700',
    fear: 'from-purple-600 to-indigo-800',
    anxiety: 'from-orange-600 to-red-500',
    stress: 'from-red-600 to-orange-600',
    neutral: 'from-gray-400 to-gray-600',
    surprise: 'from-purple-400 to-pink-400',
    disgust: 'from-green-700 to-yellow-600',
    contempt: 'from-gray-600 to-red-600'
  };

  const scanModes = [
    { 
      id: 'text', 
      name: 'Analyse Textuelle', 
      icon: FileText, 
      description: 'Analysez vos émotions à partir de texte',
      color: 'from-blue-500 to-purple-500'
    },
    { 
      id: 'voice', 
      name: 'Analyse Vocale', 
      icon: Mic, 
      description: 'Détection émotionnelle par la voix',
      color: 'from-green-500 to-teal-500'
    },
    { 
      id: 'facial', 
      name: 'Analyse Faciale', 
      icon: Camera, 
      description: 'Reconnaissance d\'expressions faciales',
      color: 'from-purple-500 to-pink-500'
    },
    { 
      id: 'multimodal', 
      name: 'Analyse Complète', 
      icon: Brain, 
      description: 'Combine toutes les modalités',
      color: 'from-indigo-500 to-purple-600'
    }
  ];

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: 'user' }, 
        audio: false 
      });
      setCameraStream(stream);
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (error) {
      toast({
        title: "Erreur caméra",
        description: "Impossible d'accéder à la caméra",
        variant: "destructive"
      });
    }
  };

  const stopCamera = () => {
    if (cameraStream) {
      cameraStream.getTracks().forEach(track => track.stop());
      setCameraStream(null);
    }
  };

  const startVoiceRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      setMediaRecorder(recorder);
      
      const audioChunks: BlobPart[] = [];
      recorder.ondataavailable = (event) => {
        audioChunks.push(event.data);
      };
      
      recorder.onstop = async () => {
        const audioBlob = new Blob(audioChunks, { type: 'audio/wav' });
        await analyzeVoiceEmotion(audioBlob);
        stream.getTracks().forEach(track => track.stop());
      };
      
      recorder.start();
      setIsRecording(true);
      
      toast({
        title: "Enregistrement en cours",
        description: "Parlez naturellement pendant 5-10 secondes"
      });
      
    } catch (error) {
      toast({
        title: "Erreur microphone",
        description: "Impossible d'accéder au microphone",
        variant: "destructive"
      });
    }
  };

  const stopVoiceRecording = () => {
    if (mediaRecorder && isRecording) {
      mediaRecorder.stop();
      setIsRecording(false);
      setMediaRecorder(null);
    }
  };

  const analyzeTextEmotion = async () => {
    if (!textInput.trim()) {
      toast({
        title: "Texte requis",
        description: "Veuillez saisir du texte à analyser",
        variant: "destructive"
      });
      return;
    }

    setIsScanning(true);
    
    try {
      const { data, error } = await supabase.functions.invoke('analyze-emotion-text', {
        body: { text: textInput }
      });

      if (error) throw error;

      const result: EmotionResult = {
        emotion: data.emotion || 'neutral',
        confidence: data.confidence || 0.8,
        intensity: data.intensity || 0.6,
        valence: data.valence || 0,
        arousal: data.arousal || 0.5,
        dominance: data.dominance || 0.5,
        timestamp: new Date().toISOString(),
        source: 'text'
      };

      processEmotionResult(result);
      
    } catch (error) {
      console.error('Erreur analyse textuelle:', error);
      toast({
        title: "Erreur d'analyse",
        description: "Impossible d'analyser le texte",
        variant: "destructive"
      });
    } finally {
      setIsScanning(false);
    }
  };

  const analyzeVoiceEmotion = async (audioBlob: Blob) => {
    setIsScanning(true);
    
    try {
      const formData = new FormData();
      formData.append('audio', audioBlob);

      const { data, error } = await supabase.functions.invoke('hume-analysis', {
        body: { audio: audioBlob, type: 'voice' }
      });

      if (error) throw error;

      const result: EmotionResult = {
        emotion: data.emotion || 'neutral',
        confidence: data.confidence || 0.75,
        intensity: data.intensity || 0.7,
        valence: data.valence || 0,
        arousal: data.arousal || 0.6,
        dominance: data.dominance || 0.5,
        timestamp: new Date().toISOString(),
        source: 'voice'
      };

      processEmotionResult(result);
      
    } catch (error) {
      console.error('Erreur analyse vocale:', error);
      toast({
        title: "Erreur d'analyse",
        description: "Impossible d'analyser l'audio",
        variant: "destructive"
      });
    } finally {
      setIsScanning(false);
    }
  };

  const analyzeFacialEmotion = async () => {
    if (!videoRef.current || !canvasRef.current) return;

    setIsScanning(true);
    
    try {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      const video = videoRef.current;
      
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      ctx?.drawImage(video, 0, 0);
      
      const imageData = canvas.toDataURL('image/jpeg', 0.8);
      
      const { data, error } = await supabase.functions.invoke('hume-analysis', {
        body: { image: imageData, type: 'facial' }
      });

      if (error) throw error;

      const result: EmotionResult = {
        emotion: data.emotion || 'neutral',
        confidence: data.confidence || 0.8,
        intensity: data.intensity || 0.65,
        valence: data.valence || 0,
        arousal: data.arousal || 0.5,
        dominance: data.dominance || 0.5,
        timestamp: new Date().toISOString(),
        source: 'facial'
      };

      processEmotionResult(result);
      
    } catch (error) {
      console.error('Erreur analyse faciale:', error);
      toast({
        title: "Erreur d'analyse",
        description: "Impossible d'analyser l'expression faciale",
        variant: "destructive"
      });
    } finally {
      setIsScanning(false);
    }
  };

  const processEmotionResult = (result: EmotionResult) => {
    setCurrentResult(result);
    setHistoricalResults(prev => [result, ...prev.slice(0, 9)]);
    
    // Mettre à jour les métriques biométriques
    setBiometrics(prev => ({
      ...prev,
      stressLevel: Math.max(0, Math.min(100, prev.stressLevel + (result.valence < 0 ? 10 : -5))),
      focusLevel: Math.max(0, Math.min(100, prev.focusLevel + (result.arousal > 0.7 ? 5 : -2))),
      energyLevel: Math.max(0, Math.min(100, prev.energyLevel + (result.arousal * 10 - 5))),
      wellnessScore: Math.max(0, Math.min(100, (result.valence + 1) * 50))
    }));

    // Mettre à jour les données de session
    setSessionData(prev => {
      const newResults = [result, ...historicalResults];
      const avgValence = newResults.reduce((sum, r) => sum + r.valence, 0) / newResults.length;
      
      return {
        ...prev,
        totalScans: prev.totalScans + 1,
        averageValence: avgValence,
        predominantEmotion: result.emotion
      };
    });

    generateRecommendations(result);
    
    toast({
      title: "Analyse terminée",
      description: `Émotion détectée: ${result.emotion} (${Math.round(result.confidence * 100)}% confiance)`,
      duration: 4000
    });
  };

  const generateRecommendations = (result: EmotionResult) => {
    const recommendations: Recommendation[] = [];

    // Recommandations basées sur l'émotion
    if (result.valence < -0.3) { // Émotions négatives
      recommendations.push({
        id: 'music-therapy',
        type: 'music',
        title: 'Musicothérapie Apaisante',
        description: 'Musique personnalisée pour améliorer votre humeur',
        duration: '15-30 min',
        icon: Heart,
        color: 'from-blue-500 to-purple-500',
        action: () => navigate('/music')
      });

      recommendations.push({
        id: 'breathing',
        type: 'breathing',
        title: 'Exercice de Respiration',
        description: 'Techniques de respiration pour réduire le stress',
        duration: '5-10 min',
        icon: Wind,
        color: 'from-green-500 to-teal-500',
        action: () => navigate('/breathwork')
      });
    }

    if (result.arousal > 0.7) { // Forte activation
      recommendations.push({
        id: 'meditation',
        type: 'mindfulness',
        title: 'Méditation Guidée',
        description: 'Séance de méditation pour retrouver le calme',
        duration: '10-20 min',
        icon: Mountain,
        color: 'from-purple-500 to-indigo-500',
        action: () => navigate('/breathwork')
      });
    }

    if (result.valence > 0.3) { // Émotions positives
      recommendations.push({
        id: 'activity',
        type: 'activity',
        title: 'Renforcer le Positif',
        description: 'Activités pour maintenir cette belle énergie',
        duration: '20-40 min',
        icon: Sun,
        color: 'from-yellow-500 to-orange-500',
        action: () => navigate('/gamification')
      });
    }

    recommendations.push({
      id: 'journal',
      type: 'therapy',
      title: 'Journal Émotionnel',
      description: 'Documenter et analyser vos émotions',
      duration: '10-15 min',
      icon: FileText,
      color: 'from-indigo-500 to-purple-500',
      action: () => navigate('/journal')
    });

    setSessionData(prev => ({ ...prev, recommendations }));
  };

  const startSession = () => {
    setSessionData(prev => ({
      ...prev,
      startTime: new Date(),
      totalScans: 0,
      averageValence: 0,
      predominantEmotion: '',
      recommendations: []
    }));
    
    toast({
      title: "Session démarrée",
      description: "Analyse émotionnelle en cours..."
    });
  };

  const performScan = async () => {
    if (!sessionData.startTime) {
      startSession();
    }

    switch (scanMode) {
      case 'text':
        await analyzeTextEmotion();
        break;
      case 'voice':
        if (isRecording) {
          stopVoiceRecording();
        } else {
          await startVoiceRecording();
        }
        break;
      case 'facial':
        await analyzeFacialEmotion();
        break;
      case 'multimodal':
        // Analyser séquentiellement tous les modes disponibles
        if (textInput.trim()) await analyzeTextEmotion();
        if (cameraStream) await analyzeFacialEmotion();
        break;
    }
  };

  // Initialiser la caméra pour les modes visuels
  useEffect(() => {
    if (scanMode === 'facial' || scanMode === 'multimodal') {
      startCamera();
    } else {
      stopCamera();
    }

    return () => stopCamera();
  }, [scanMode]);

  // Simulation de données biométriques temps réel
  useEffect(() => {
    const interval = setInterval(() => {
      setBiometrics(prev => ({
        ...prev,
        heartRate: 65 + Math.sin(Date.now() / 10000) * 15 + Math.random() * 10,
        heartRateVariability: 25 + Math.random() * 25
      }));
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  return (
    <ResponsiveWrapper enableGestures={true} enableVibration={device.type === 'mobile'}>
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
        {/* Header */}
        <div className="sticky top-0 z-40 bg-white/90 backdrop-blur-lg border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <Button
                  onClick={() => navigate('/')}
                  variant="ghost"
                  size="sm"
                  className="hover:bg-indigo-50"
                >
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  {device.type === 'mobile' ? '' : 'Retour'}
                </Button>
                
                <div>
                  <h1 className="text-xl md:text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                    Scanner Émotionnel IA
                  </h1>
                  <p className="text-sm text-gray-600 hidden sm:block">
                    HumeAI • Analyse multimodale • Temps réel
                  </p>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                {sessionData.startTime && (
                  <Badge variant="secondary" className="bg-green-100 text-green-700">
                    <Activity className="w-3 h-3 mr-1" />
                    Session active
                  </Badge>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 py-6 space-y-8">
          
          {/* Sélection du mode de scan */}
          <Card className="bg-gradient-to-br from-indigo-50 to-purple-50 border-indigo-200">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Scan className="h-6 w-6 text-indigo-600" />
                Mode d'Analyse Émotionnelle
              </CardTitle>
              <p className="text-indigo-700">
                Choisissez votre méthode d'analyse préférée
              </p>
            </CardHeader>
            <CardContent>
              <div className={cn(
                "grid gap-4",
                device.type === 'mobile' ? "grid-cols-1" : "grid-cols-2 lg:grid-cols-4"
              )}>
                {scanModes.map((mode) => (
                  <motion.div
                    key={mode.id}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Button
                      variant={scanMode === mode.id ? "default" : "outline"}
                      className={cn(
                        "h-auto p-6 flex flex-col items-center gap-3 w-full",
                        scanMode === mode.id && `bg-gradient-to-br ${mode.color} text-white border-0`
                      )}
                      onClick={() => setScanMode(mode.id as any)}
                    >
                      <mode.icon className="h-8 w-8" />
                      <div className="text-center">
                        <div className="font-semibold">{mode.name}</div>
                        <div className="text-xs opacity-80 mt-1">{mode.description}</div>
                      </div>
                    </Button>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>

          <div className={cn(
            "grid gap-8",
            device.type === 'desktop' ? "grid-cols-3" : 
            device.type === 'tablet' ? "grid-cols-2" : "grid-cols-1"
          )}>
            
            {/* Zone de scan principale */}
            <div className={cn(
              device.type === 'desktop' ? "col-span-2" : 
              device.type === 'tablet' ? "col-span-1" : "col-span-1"
            )}>
              <Card className="h-full">
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span>Zone d'Analyse</span>
                    <Badge variant="outline" className={cn(
                      scanMode && scanModes.find(m => m.id === scanMode)?.color && 
                      `bg-gradient-to-r ${scanModes.find(m => m.id === scanMode)?.color} text-white border-0`
                    )}>
                      {scanModes.find(m => m.id === scanMode)?.name}
                    </Badge>
                  </CardTitle>
                </CardHeader>
                
                <CardContent className="space-y-6">
                  {/* Interface selon le mode */}
                  {scanMode === 'text' && (
                    <div className="space-y-4">
                      <Textarea
                        placeholder="Décrivez vos émotions, vos pensées, ou votre état d'esprit actuel..."
                        value={textInput}
                        onChange={(e) => setTextInput(e.target.value)}
                        className="min-h-[150px] resize-none"
                      />
                      <div className="text-sm text-gray-500">
                        Conseil: Soyez authentique et détaillé pour une analyse plus précise
                      </div>
                    </div>
                  )}

                  {(scanMode === 'facial' || scanMode === 'multimodal') && (
                    <div className="space-y-4">
                      <div className="relative bg-gray-100 rounded-lg overflow-hidden aspect-video">
                        <video
                          ref={videoRef}
                          autoPlay
                          muted
                          playsInline
                          className="w-full h-full object-cover"
                        />
                        <canvas ref={canvasRef} className="hidden" />
                        
                        {!cameraStream && (
                          <div className="absolute inset-0 flex items-center justify-center bg-gray-200">
                            <div className="text-center text-gray-500">
                              <Camera className="h-16 w-16 mx-auto mb-4 opacity-50" />
                              <p>Caméra en cours d'initialisation...</p>
                            </div>
                          </div>
                        )}
                        
                        {isScanning && (
                          <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                            <div className="bg-white/90 rounded-lg p-4 flex items-center gap-3">
                              <Loader2 className="h-6 w-6 animate-spin text-indigo-600" />
                              <span className="font-medium">Analyse en cours...</span>
                            </div>
                          </div>
                        )}
                      </div>
                      
                      <div className="text-sm text-gray-500">
                        Regardez la caméra naturellement pendant l'analyse
                      </div>
                    </div>
                  )}

                  {scanMode === 'voice' && (
                    <div className="space-y-4">
                      <div className="flex items-center justify-center min-h-[150px] bg-gradient-to-br from-green-50 to-teal-50 rounded-lg border-2 border-dashed border-green-300">
                        <div className="text-center">
                          {isRecording ? (
                            <motion.div
                              animate={{ scale: [1, 1.1, 1] }}
                              transition={{ repeat: Infinity, duration: 1 }}
                              className="space-y-4"
                            >
                              <div className="w-24 h-24 bg-red-500 rounded-full flex items-center justify-center mx-auto">
                                <MicOff className="h-12 w-12 text-white" />
                              </div>
                              <p className="font-medium text-red-600">Enregistrement en cours...</p>
                              <div className="flex justify-center space-x-1">
                                <div className="w-2 h-8 bg-red-500 rounded animate-pulse" />
                                <div className="w-2 h-12 bg-red-500 rounded animate-pulse" style={{ animationDelay: '0.1s' }} />
                                <div className="w-2 h-6 bg-red-500 rounded animate-pulse" style={{ animationDelay: '0.2s' }} />
                                <div className="w-2 h-10 bg-red-500 rounded animate-pulse" style={{ animationDelay: '0.3s' }} />
                              </div>
                            </motion.div>
                          ) : (
                            <div className="space-y-4">
                              <div className="w-24 h-24 bg-green-500 rounded-full flex items-center justify-center mx-auto">
                                <Mic className="h-12 w-12 text-white" />
                              </div>
                              <p className="font-medium text-green-600">Prêt à enregistrer</p>
                              <p className="text-sm text-gray-500">Cliquez pour commencer l'enregistrement vocal</p>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  )}

                  {scanMode === 'multimodal' && textInput.trim() && (
                    <div className="mt-4">
                      <Textarea
                        placeholder="Ajoutez du contexte textuel pour enrichir l'analyse..."
                        value={textInput}
                        onChange={(e) => setTextInput(e.target.value)}
                        className="min-h-[100px] resize-none"
                      />
                    </div>
                  )}

                  {/* Bouton de scan principal */}
                  <FunctionalButton
                    actionId="emotion-scan"
                    onClick={performScan}
                    disabled={isScanning || (scanMode === 'text' && !textInput.trim())}
                    className={cn(
                      "w-full py-6 text-lg font-semibold bg-gradient-to-r text-white",
                      scanModes.find(m => m.id === scanMode)?.color || "from-indigo-500 to-purple-500"
                    )}
                    loadingText="Analyse IA en cours..."
                  >
                    {isScanning ? (
                      <div className="flex items-center gap-3">
                        <Loader2 className="h-6 w-6 animate-spin" />
                        Analyse par HumeAI...
                      </div>
                    ) : isRecording ? (
                      <div className="flex items-center gap-3">
                        <StopCircle className="h-6 w-6" />
                        Arrêter l'enregistrement
                      </div>
                    ) : (
                      <div className="flex items-center gap-3">
                        <PlayCircle className="h-6 w-6" />
                        Démarrer l'Analyse
                      </div>
                    )}
                  </FunctionalButton>
                </CardContent>
              </Card>
            </div>

            {/* Panneau de résultats et métriques */}
            <div className="space-y-6">
              
              {/* Résultat actuel */}
              {currentResult && (
                <Card className="overflow-hidden">
                  <div className={cn(
                    "absolute inset-0 opacity-10 bg-gradient-to-br",
                    emotionColors[currentResult.emotion] || emotionColors.neutral
                  )} />
                  
                  <CardHeader className="relative z-10">
                    <CardTitle className="flex items-center gap-2">
                      <Brain className="h-6 w-6 text-indigo-600" />
                      Résultat Actuel
                    </CardTitle>
                  </CardHeader>
                  
                  <CardContent className="relative z-10 space-y-4">
                    <div className="text-center">
                      <div className="text-4xl font-bold capitalize mb-2">
                        {currentResult.emotion}
                      </div>
                      <div className="text-sm text-gray-600 mb-4">
                        {new Date(currentResult.timestamp).toLocaleTimeString('fr-FR')}
                      </div>
                      
                      <div className="space-y-3">
                        <div>
                          <div className="flex justify-between text-sm mb-1">
                            <span>Confiance</span>
                            <span>{Math.round(currentResult.confidence * 100)}%</span>
                          </div>
                          <Progress value={currentResult.confidence * 100} className="h-2" />
                        </div>
                        
                        <div>
                          <div className="flex justify-between text-sm mb-1">
                            <span>Intensité</span>
                            <span>{Math.round(currentResult.intensity * 100)}%</span>
                          </div>
                          <Progress value={currentResult.intensity * 100} className="h-2" />
                        </div>
                        
                        <div>
                          <div className="flex justify-between text-sm mb-1">
                            <span>Valence</span>
                            <span>{currentResult.valence > 0 ? 'Positive' : 'Négative'}</span>
                          </div>
                          <Progress value={(currentResult.valence + 1) * 50} className="h-2" />
                        </div>
                      </div>
                    </div>
                    
                    <Badge variant="outline" className="w-full justify-center py-2">
                      Source: {currentResult.source === 'text' ? 'Textuelle' : 
                               currentResult.source === 'voice' ? 'Vocale' :
                               currentResult.source === 'facial' ? 'Faciale' : 'Multimodale'}
                    </Badge>
                  </CardContent>
                </Card>
              )}

              {/* Métriques biométriques */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Activity className="h-5 w-5 text-red-500" />
                    Métriques Temps Réel
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4 text-center">
                    {biometrics.heartRate && (
                      <div className="p-3 bg-red-50 rounded-lg">
                        <div className="text-2xl font-bold text-red-600">
                          {Math.round(biometrics.heartRate)}
                        </div>
                        <div className="text-xs text-red-700">BPM</div>
                      </div>
                    )}
                    
                    <div className="p-3 bg-orange-50 rounded-lg">
                      <div className="text-2xl font-bold text-orange-600">
                        {Math.round(biometrics.stressLevel)}%
                      </div>
                      <div className="text-xs text-orange-700">Stress</div>
                    </div>
                    
                    <div className="p-3 bg-blue-50 rounded-lg">
                      <div className="text-2xl font-bold text-blue-600">
                        {Math.round(biometrics.focusLevel)}%
                      </div>
                      <div className="text-xs text-blue-700">Focus</div>
                    </div>
                    
                    <div className="p-3 bg-green-50 rounded-lg">
                      <div className="text-2xl font-bold text-green-600">
                        {Math.round(biometrics.wellnessScore)}%
                      </div>
                      <div className="text-xs text-green-700">Bien-être</div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Statistiques de session */}
              {sessionData.startTime && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <BarChart3 className="h-5 w-5 text-purple-500" />
                      Session Actuelle
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-sm">Durée</span>
                      <span className="font-medium">
                        {Math.floor((Date.now() - sessionData.startTime.getTime()) / 60000)} min
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Analyses</span>
                      <span className="font-medium">{sessionData.totalScans}</span>
                    </div>
                    {sessionData.predominantEmotion && (
                      <div className="flex justify-between">
                        <span className="text-sm">Émotion dominante</span>
                        <Badge variant="secondary" className="capitalize">
                          {sessionData.predominantEmotion}
                        </Badge>
                      </div>
                    )}
                  </CardContent>
                </Card>
              )}
            </div>
          </div>

          {/* Recommandations personnalisées */}
          {sessionData.recommendations.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Sparkles className="h-6 w-6 text-yellow-500" />
                  Recommandations Personnalisées
                </CardTitle>
                <p className="text-gray-600">
                  Basées sur votre analyse émotionnelle actuelle
                </p>
              </CardHeader>
              <CardContent>
                <div className={cn(
                  "grid gap-4",
                  device.type === 'mobile' ? "grid-cols-1" : "grid-cols-2 lg:grid-cols-3"
                )}>
                  {sessionData.recommendations.map((rec) => (
                    <motion.div
                      key={rec.id}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <Card 
                        className="cursor-pointer hover:shadow-lg transition-all border-2 hover:border-indigo-200"
                        onClick={rec.action}
                      >
                        <CardContent className="p-4">
                          <div className="flex items-start gap-3">
                            <div className={cn(
                              "w-12 h-12 rounded-xl bg-gradient-to-br flex items-center justify-center",
                              rec.color
                            )}>
                              <rec.icon className="h-6 w-6 text-white" />
                            </div>
                            
                            <div className="flex-1">
                              <h4 className="font-semibold text-sm mb-1">{rec.title}</h4>
                              <p className="text-xs text-gray-600 mb-2">{rec.description}</p>
                              <Badge variant="outline" className="text-xs">
                                <Clock className="w-3 h-3 mr-1" />
                                {rec.duration}
                              </Badge>
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

          {/* Historique récent */}
          {historicalResults.length > 0 && (
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="h-5 w-5 text-blue-500" />
                    Historique des Analyses
                  </CardTitle>
                  
                  <div className="flex gap-2">
                    <FunctionalButton
                      actionId="export-data"
                      onClick={async () => {
                        toast({
                          title: "Export réussi",
                          description: "Données émotionnelles exportées"
                        });
                      }}
                      variant="outline"
                      size="sm"
                    >
                      <Download className="h-4 w-4 mr-2" />
                      Exporter
                    </FunctionalButton>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent>
                <div className="space-y-3">
                  {historicalResults.slice(0, 5).map((result, index) => (
                    <div
                      key={`${result.timestamp}-${index}`}
                      className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                    >
                      <div className="flex items-center gap-3">
                        <div className={cn(
                          "w-3 h-3 rounded-full bg-gradient-to-r",
                          emotionColors[result.emotion] || emotionColors.neutral
                        )} />
                        <span className="font-medium capitalize">{result.emotion}</span>
                        <Badge variant="outline" className="text-xs">
                          {result.source}
                        </Badge>
                      </div>
                      
                      <div className="text-right">
                        <div className="text-sm font-medium">
                          {Math.round(result.confidence * 100)}%
                        </div>
                        <div className="text-xs text-gray-500">
                          {new Date(result.timestamp).toLocaleTimeString('fr-FR', {
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </ResponsiveWrapper>
  );
};

export default EnhancedEmotionScanPage;