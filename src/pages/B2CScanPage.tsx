import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Camera, Eye, Brain, Heart, Zap, Play, Square, RotateCcw,
  CheckCircle, AlertCircle, Sparkles, TrendingUp, Star,
  Activity, Smile, Frown, Meh, Timer, Target, Award,
  Mic, Settings, Volume2, VolumeX, RefreshCw, Download
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Slider } from '@/components/ui/slider';
import PremiumBackground from '@/components/premium/PremiumBackground';
import ImmersiveExperience from '@/components/premium/ImmersiveExperience';
import EnhancedCard from '@/components/premium/EnhancedCard';

import GamificationSystem from '@/components/premium/GamificationSystem';
import SmartRecommendations from '@/components/premium/SmartRecommendations';
import { cn } from '@/lib/utils';

interface ScanResult {
  emotion: string;
  confidence: number;
  stress_level: number;
  energy_level: number;
  focus_level: number;
  recommendations: string[];
  color: string;
  icon: React.ReactNode;
  biometrics?: {
    heartRate: number;
    breathingRate: number;
    skinConductance: number;
  };
}

interface ScanHistory {
  id: string;
  timestamp: Date;
  result: ScanResult;
  duration: number;
  scanType: 'facial' | 'voice' | 'text';
}

const B2CScanPage: React.FC = () => {
  const [isScanning, setIsScanning] = useState(false);
  const [scanProgress, setScanProgress] = useState(0);
  const [currentResult, setCurrentResult] = useState<ScanResult | null>(null);
  const [scanHistory, setScanHistory] = useState<ScanHistory[]>([]);
  const [showCamera, setShowCamera] = useState(false);
  const [scanDuration, setScanDuration] = useState(0);
  const [scanType, setScanType] = useState<'facial' | 'voice' | 'text'>('facial');
  const [cameraPermission, setCameraPermission] = useState(true);
  const [micPermission, setMicPermission] = useState(true);
  const [audioEnabled, setAudioEnabled] = useState(true);
  const [sensitivity, setSensitivity] = useState([75]);
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const emotionTypes = [
    { name: 'Joyeux', icon: <Smile className="w-5 h-5" />, color: 'bg-yellow-500', textColor: 'text-yellow-600' },
    { name: 'Calme', icon: <Meh className="w-5 h-5" />, color: 'bg-blue-500', textColor: 'text-blue-600' },
    { name: 'Stressé', icon: <Frown className="w-5 h-5" />, color: 'bg-red-500', textColor: 'text-red-600' },
    { name: 'Énergique', icon: <Zap className="w-5 h-5" />, color: 'bg-green-500', textColor: 'text-green-600' },
    { name: 'Concentré', icon: <Target className="w-5 h-5" />, color: 'bg-purple-500', textColor: 'text-purple-600' }
  ];

  const scanModes = [
    {
      id: 'facial',
      name: 'Analyse Faciale',
      description: 'Reconnaissance d\'émotions par caméra',
      icon: <Camera className="w-5 h-5" />,
      color: 'bg-blue-500',
      permission: cameraPermission
    },
    {
      id: 'voice',
      name: 'Analyse Vocale',
      description: 'Détection d\'émotions par la voix',
      icon: <Mic className="w-5 h-5" />,
      color: 'bg-green-500',
      permission: micPermission
    },
    {
      id: 'text',
      name: 'Analyse Textuelle',
      description: 'Sentiment analysis du texte écrit',
      icon: <Eye className="w-5 h-5" />,
      color: 'bg-purple-500',
      permission: true
    }
  ];

  const checkPermissions = async () => {
    try {
      if (scanType === 'facial') {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        stream.getTracks().forEach(track => track.stop());
        setCameraPermission(true);
      } else if (scanType === 'voice') {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        stream.getTracks().forEach(track => track.stop());
        setMicPermission(true);
      }
    } catch (error) {
      console.error('Permission denied:', error);
      if (scanType === 'facial') setCameraPermission(false);
      if (scanType === 'voice') setMicPermission(false);
    }
  };

  useEffect(() => {
    checkPermissions();
  }, [scanType]);

  const startScan = async () => {
    setIsScanning(true);
    setScanProgress(0);
    setScanDuration(0);
    setShowCamera(scanType === 'facial');

    // Demander l'accès aux médias selon le type de scan
    try {
      if (scanType === 'facial') {
        const stream = await navigator.mediaDevices.getUserMedia({ 
          video: { 
            facingMode: 'user',
            width: { ideal: 1280 },
            height: { ideal: 720 }
          } 
        });
        streamRef.current = stream;
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      } else if (scanType === 'voice') {
        const stream = await navigator.mediaDevices.getUserMedia({ 
          audio: {
            echoCancellation: true,
            noiseSuppression: true
          }
        });
        streamRef.current = stream;
      }
    } catch (error) {
      console.error('Media access error:', error);
      setIsScanning(false);
      return;
    }

    // Simuler le scan progressif avec étapes réalistes
    const scanSteps = [
      { progress: 10, message: 'Initialisation des capteurs...' },
      { progress: 25, message: 'Détection du visage...' },
      { progress: 40, message: 'Analyse des micro-expressions...' },
      { progress: 60, message: 'Traitement IA en cours...' },
      { progress: 80, message: 'Calcul des métriques...' },
      { progress: 95, message: 'Finalisation des résultats...' },
      { progress: 100, message: 'Analyse terminée' }
    ];

    let stepIndex = 0;
    const scanInterval = setInterval(() => {
      if (stepIndex < scanSteps.length) {
        setScanProgress(scanSteps[stepIndex].progress);
        stepIndex++;
        setScanDuration(prev => prev + 300);
      } else {
        clearInterval(scanInterval);
        completeScan();
      }
    }, 300);
  };

  const completeScan = () => {
    // Arrêter les flux média
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }

    // Générer un résultat réaliste avec biométrie
    const randomEmotion = emotionTypes[Math.floor(Math.random() * emotionTypes.length)];
    const result: ScanResult = {
      emotion: randomEmotion.name,
      confidence: 85 + Math.random() * 15,
      stress_level: Math.random() * 100,
      energy_level: Math.random() * 100,
      focus_level: Math.random() * 100,
      recommendations: [
        'Pratiquer 5 minutes de respiration profonde',
        'Écouter une playlist relaxante personnalisée',
        'Faire une courte méditation guidée',
        'Prendre une pause et s\'hydrater',
        'Effectuer des étirements légers'
      ].slice(0, 3 + Math.floor(Math.random() * 2)),
      color: randomEmotion.color,
      icon: randomEmotion.icon,
      biometrics: {
        heartRate: 60 + Math.random() * 40,
        breathingRate: 12 + Math.random() * 8,
        skinConductance: Math.random() * 100
      }
    };

    const historyEntry: ScanHistory = {
      id: Date.now().toString(),
      timestamp: new Date(),
      result,
      duration: scanDuration,
      scanType
    };

    setCurrentResult(result);
    setScanHistory(prev => [historyEntry, ...prev.slice(0, 9)]);
    setIsScanning(false);
    setShowCamera(false);
  };

  const stopScan = () => {
    setIsScanning(false);
    setScanProgress(0);
    setShowCamera(false);
    setScanDuration(0);
    
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
  };

  const restartScan = () => {
    setCurrentResult(null);
    setScanProgress(0);
  };

  const exportResults = () => {
    if (currentResult) {
      const data = {
        timestamp: new Date().toISOString(),
        emotion: currentResult.emotion,
        confidence: currentResult.confidence,
        metrics: {
          stress: currentResult.stress_level,
          energy: currentResult.energy_level,
          focus: currentResult.focus_level
        },
        biometrics: currentResult.biometrics,
        recommendations: currentResult.recommendations
      };
      
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `emotion-scan-${Date.now()}.json`;
      a.click();
      URL.revokeObjectURL(url);
    }
  };

  return (
    <div className="min-h-screen relative" data-testid="page-root">
      <PremiumBackground />
      
      <div className="relative z-10 p-6 max-w-7xl mx-auto">
        <ImmersiveExperience
          title="Scanner Émotionnel IA Avancé"
          subtitle="Analysez votre état émotionnel en temps réel avec notre IA de nouvelle génération"
          variant="scan"
        />

        <Tabs defaultValue="scan" className="mt-8">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="scan">Scanner</TabsTrigger>
            <TabsTrigger value="history">Historique</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>

          <TabsContent value="scan" className="grid lg:grid-cols-3 gap-8 mt-6">
            {/* Interface de scan principale */}
            <div className="lg:col-span-2 space-y-6">
              {/* Sélection du mode de scan */}
              <EnhancedCard title="Mode d'Analyse" icon={<Settings className="w-5 h-5" />}>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {scanModes.map(mode => (
                    <motion.div
                      key={mode.id}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className={cn(
                        "p-4 rounded-xl border-2 cursor-pointer transition-all duration-300",
                        scanType === mode.id
                          ? `${mode.color} text-white border-white shadow-lg`
                          : "bg-card hover:bg-accent border-border",
                        !mode.permission && "opacity-50 cursor-not-allowed"
                      )}
                      onClick={() => mode.permission && setScanType(mode.id as typeof scanType)}
                    >
                      <div className="flex flex-col items-center gap-2">
                        <div className={cn(
                          "p-2 rounded-lg",
                          scanType === mode.id ? "bg-white/20" : mode.color + " text-white"
                        )}>
                          {mode.icon}
                        </div>
                        <div className="text-center">
                          <h4 className="font-semibold text-sm">{mode.name}</h4>
                          <p className="text-xs opacity-90">{mode.description}</p>
                        </div>
                        {!mode.permission && (
                          <Badge variant="destructive" className="text-xs">
                            Permission requise
                          </Badge>
                        )}
                      </div>
                    </motion.div>
                  ))}
                </div>
              </EnhancedCard>

              {/* Interface de scan */}
              <EnhancedCard title="Scanner Émotionnel IA" icon={<Eye className="w-5 h-5" />} className="h-fit">
                <div className="space-y-6">
                  {/* Zone de capture/résultat */}
                  <div className="relative aspect-video bg-gradient-to-br from-gray-900 to-gray-800 rounded-xl overflow-hidden">
                    {showCamera && scanType === 'facial' ? (
                      <>
                        <video
                          ref={videoRef}
                          autoPlay
                          playsInline
                          muted
                          className="w-full h-full object-cover"
                        />
                        <canvas ref={canvasRef} className="hidden" />
                        
                        {/* Overlay de détection */}
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="relative">
                            <motion.div 
                              className="w-64 h-64 border-2 border-primary rounded-lg"
                              animate={isScanning ? { scale: [1, 1.05, 1] } : {}}
                              transition={{ duration: 2, repeat: Infinity }}
                            >
                              <div className="absolute inset-0 bg-primary/10 rounded-lg"></div>
                              {/* Coins de détection animés */}
                              {[
                                'top-0 left-0 border-t-4 border-l-4',
                                'top-0 right-0 border-t-4 border-r-4', 
                                'bottom-0 left-0 border-b-4 border-l-4',
                                'bottom-0 right-0 border-b-4 border-r-4'
                              ].map((pos, i) => (
                                <motion.div
                                  key={i}
                                  className={`absolute w-8 h-8 border-primary ${pos}`}
                                  animate={isScanning ? { 
                                    opacity: [0.5, 1, 0.5],
                                    scale: [1, 1.1, 1]
                                  } : {}}
                                  transition={{ 
                                    duration: 1.5, 
                                    repeat: Infinity,
                                    delay: i * 0.2
                                  }}
                                />
                              ))}
                            </motion.div>
                            
                            {/* Indicateur de progression */}
                            <div className="absolute -bottom-12 left-1/2 transform -translate-x-1/2">
                              <div className="bg-black/75 px-4 py-2 rounded-full text-white text-sm backdrop-blur-sm">
                                Analyse en cours... {scanProgress}%
                              </div>
                            </div>
                          </div>
                        </div>
                      </>
                    ) : currentResult ? (
                      <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary/20 to-accent/20 relative overflow-hidden">
                        {/* Particules de fond */}
                        <div className="absolute inset-0">
                          {[...Array(20)].map((_, i) => (
                            <motion.div
                              key={i}
                              className="absolute w-2 h-2 bg-primary/30 rounded-full"
                              animate={{
                                x: [Math.random() * 400, Math.random() * 400],
                                y: [Math.random() * 300, Math.random() * 300],
                                scale: [0, 1, 0],
                                opacity: [0, 0.6, 0]
                              }}
                              transition={{
                                duration: 3 + Math.random() * 2,
                                repeat: Infinity,
                                delay: Math.random() * 2
                              }}
                            />
                          ))}
                        </div>
                        
                        <motion.div
                          initial={{ scale: 0, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          className="text-center z-10"
                        >
                          <motion.div 
                            className={cn("w-24 h-24 rounded-full mx-auto mb-4 flex items-center justify-center", currentResult.color)}
                            animate={{ rotate: [0, 5, -5, 0] }}
                            transition={{ duration: 3, repeat: Infinity }}
                          >
                            {currentResult.icon}
                          </motion.div>
                          <h3 className="text-2xl font-bold mb-2">État détecté: {currentResult.emotion}</h3>
                          <div className="flex items-center justify-center gap-4 mb-4">
                            <Badge variant="outline" className="bg-white/10 backdrop-blur-sm">
                              <Star className="w-3 h-3 mr-1" />
                              Confiance: {currentResult.confidence.toFixed(1)}%
                            </Badge>
                            {currentResult.biometrics && (
                              <Badge variant="outline" className="bg-white/10 backdrop-blur-sm">
                                <Heart className="w-3 h-3 mr-1" />
                                {Math.round(currentResult.biometrics.heartRate)} BPM
                              </Badge>
                            )}
                          </div>
                          <Button onClick={exportResults} variant="ghost" size="sm">
                            <Download className="w-4 h-4 mr-2" />
                            Exporter les résultats
                          </Button>
                        </motion.div>
                      </div>
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <div className="text-center text-white">
                          <motion.div
                            animate={{ scale: [1, 1.1, 1] }}
                            transition={{ duration: 2, repeat: Infinity }}
                          >
                            {scanModes.find(m => m.id === scanType)?.icon || <Camera className="w-16 h-16 mx-auto mb-4 opacity-50" />}
                          </motion.div>
                          <p className="text-lg mb-2">Scanner Émotionnel IA</p>
                          <p className="text-sm opacity-75">
                            {scanType === 'facial' && 'Cliquez sur "Démarrer" pour analyser vos expressions faciales'}
                            {scanType === 'voice' && 'Préparez-vous à parler pour l\'analyse vocale'}
                            {scanType === 'text' && 'Mode d\'analyse textuelle sélectionné'}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Contrôles principaux */}
                  <div className="flex justify-center gap-4">
                    {!isScanning && !currentResult && (
                      <Button 
                        onClick={startScan} 
                        size="lg"
                        disabled={!scanModes.find(m => m.id === scanType)?.permission}
                        className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white"
                      >
                        <Play className="w-5 h-5 mr-2" />
                        Démarrer le Scan
                      </Button>
                    )}
                    
                    {isScanning && (
                      <Button onClick={stopScan} variant="destructive" size="lg">
                        <Square className="w-5 h-5 mr-2" />
                        Arrêter
                      </Button>
                    )}
                    
                    {currentResult && (
                      <>
                        <Button onClick={restartScan} variant="outline" size="lg">
                          <RotateCcw className="w-5 h-5 mr-2" />
                          Nouveau Scan
                        </Button>
                        <Button onClick={() => checkPermissions()} variant="ghost" size="lg">
                          <RefreshCw className="w-5 h-5 mr-2" />
                          Recalibrer
                        </Button>
                      </>
                    )}
                  </div>

                  {/* Barre de progression détaillée */}
                  {isScanning && (
                    <motion.div 
                      className="space-y-2"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                    >
                      <Progress value={scanProgress} className="h-3" />
                      <div className="flex justify-between text-sm text-muted-foreground">
                        <span>
                          {scanProgress < 25 ? 'Initialisation...' :
                           scanProgress < 50 ? 'Détection...' :
                           scanProgress < 75 ? 'Analyse IA...' : 'Finalisation...'}
                        </span>
                        <span>{(scanDuration / 1000).toFixed(1)}s</span>
                      </div>
                    </motion.div>
                  )}

                  {/* Paramètres avancés */}
                  <Card className="p-4 bg-accent/10">
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="font-semibold flex items-center gap-2">
                        <Settings className="w-4 h-4" />
                        Paramètres Avancés
                      </h4>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setAudioEnabled(!audioEnabled)}
                      >
                        {audioEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
                      </Button>
                    </div>
                    
                    <div className="space-y-4">
                      <div>
                        <div className="flex justify-between items-center mb-2">
                          <label className="text-sm font-medium">Sensibilité de détection</label>
                          <span className="text-sm text-muted-foreground">{sensitivity[0]}%</span>
                        </div>
                        <Slider
                          value={sensitivity}
                          onValueChange={setSensitivity}
                          max={100}
                          step={5}
                          className="w-full"
                        />
                      </div>
                    </div>
                  </Card>
                </div>
              </EnhancedCard>

              {/* Résultats détaillés */}
              <AnimatePresence>
                {currentResult && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="animate-fade-in"
                  >
                    <EnhancedCard title="Analyse Détaillée" icon={<Brain className="w-5 h-5" />}>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Métriques principales */}
                        <div className="space-y-4">
                          <h4 className="font-semibold mb-3">Métriques Émotionnelles</h4>
                          {[
                            { name: 'Niveau de Stress', value: currentResult.stress_level, color: 'red' },
                            { name: 'Niveau d\'Énergie', value: currentResult.energy_level, color: 'green' },
                            { name: 'Concentration', value: currentResult.focus_level, color: 'blue' }
                          ].map((metric, i) => (
                            <motion.div
                              key={metric.name}
                              initial={{ x: -20, opacity: 0 }}
                              animate={{ x: 0, opacity: 1 }}
                              transition={{ delay: i * 0.1 }}
                            >
                              <div className="flex justify-between items-center mb-2">
                                <span className="text-sm font-medium">{metric.name}</span>
                                <span className="text-sm text-muted-foreground">{metric.value.toFixed(0)}%</span>
                              </div>
                              <Progress value={metric.value} className="h-2" />
                            </motion.div>
                          ))}
                        </div>

                        {/* Biométrie */}
                        {currentResult.biometrics && (
                          <div className="space-y-4">
                            <h4 className="font-semibold mb-3">Données Biométriques</h4>
                            <div className="grid grid-cols-2 gap-4">
                              <div className="text-center p-3 bg-accent/30 rounded-lg">
                                <div className="text-lg font-bold text-red-500">
                                  {Math.round(currentResult.biometrics.heartRate)}
                                </div>
                                <div className="text-xs text-muted-foreground">BPM</div>
                              </div>
                              <div className="text-center p-3 bg-accent/30 rounded-lg">
                                <div className="text-lg font-bold text-blue-500">
                                  {Math.round(currentResult.biometrics.breathingRate)}
                                </div>
                                <div className="text-xs text-muted-foreground">Resp/min</div>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Recommandations */}
                      <div className="mt-6">
                        <h4 className="font-semibold mb-3 flex items-center gap-2">
                          <Sparkles className="w-4 h-4 text-primary" />
                          Recommandations Personnalisées
                        </h4>
                        <ul className="space-y-2">
                          {currentResult.recommendations.map((rec, index) => (
                            <motion.li 
                              key={index} 
                              className="flex items-start gap-2 text-sm hover-scale cursor-pointer p-2 rounded hover:bg-accent/30"
                              initial={{ x: -20, opacity: 0 }}
                              animate={{ x: 0, opacity: 1 }}
                              transition={{ delay: index * 0.1 }}
                            >
                              <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                              <span>{rec}</span>
                            </motion.li>
                          ))}
                        </ul>
                      </div>
                    </EnhancedCard>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Statistiques rapides */}
              <EnhancedCard title="Vos Stats Aujourd'hui" icon={<Activity className="w-5 h-5" />}>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Scans effectués</span>
                    <Badge variant="secondary">{scanHistory.length}</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Bien-être moyen</span>
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 text-yellow-500" />
                      <span className="font-semibold">7.2/10</span>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Streak actuel</span>
                    <div className="flex items-center gap-1">
                      <Award className="w-4 h-4 text-orange-500" />
                      <span className="font-semibold">5 jours</span>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Amélioration</span>
                    <div className="flex items-center gap-1">
                      <TrendingUp className="w-4 h-4 text-green-500" />
                      <span className="font-semibold text-green-600">+12%</span>
                    </div>
                  </div>
                </div>
              </EnhancedCard>

              {/* Gamification */}
              <GamificationSystem 
                currentXP={740}
                level={6}
                nextLevelXP={1000}
                achievements={[
                  { name: "Scanner Expert", description: "50 analyses réalisées", icon: "🔬" },
                  { name: "Explorateur", description: "Tous les modes testés", icon: "🚀" }
                ]}
                compact
              />

              {/* Recommandations IA */}
              <SmartRecommendations 
                recommendations={[
                  {
                    title: "Session de respiration",
                    description: "Votre niveau de stress nécessite une pause",
                    confidence: 94,
                    action: () => window.open('/app/breath', '_blank')
                  },
                  {
                    title: "Boost d'énergie",
                    description: "Flash Glow recommandé pour votre profil",
                    confidence: 89,
                    action: () => window.open('/app/flash-glow', '_blank')
                  }  
                ]}
                compact
              />

              {/* Actions rapides */}
              <EnhancedCard title="Actions Recommandées" icon={<Zap className="w-5 h-5" />}>
                <div className="space-y-2">
                  <Button variant="outline" className="w-full justify-start" size="sm">
                    <Heart className="w-4 h-4 mr-2" />
                    Méditation 5min
                  </Button>
                  <Button variant="outline" className="w-full justify-start" size="sm">
                    <Zap className="w-4 h-4 mr-2" />
                    Boost d'énergie
                  </Button>
                  <Button variant="outline" className="w-full justify-start" size="sm">
                    <Brain className="w-4 h-4 mr-2" />
                    Exercice de focus
                  </Button>
                  <Button variant="outline" className="w-full justify-start" size="sm">
                    <Activity className="w-4 h-4 mr-2" />
                    Voir l'historique
                  </Button>
                </div>
              </EnhancedCard>
            </div>
          </TabsContent>

          <TabsContent value="history" className="animate-fade-in">
            <EnhancedCard title="Historique des Scans" icon={<Timer className="w-5 h-5" />}>
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {scanHistory.map((scan, index) => (
                  <motion.div
                    key={scan.id}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-center gap-4 p-4 rounded-lg bg-accent/30 border border-border hover-scale cursor-pointer"
                  >
                    <div className={cn("p-3 rounded-full", scan.result.color)}>
                      {scan.result.icon}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-medium">{scan.result.emotion}</span>
                        <Badge variant="outline" className="text-xs">
                          {scan.result.confidence.toFixed(0)}%
                        </Badge>
                      </div>
                      <div className="text-sm text-muted-foreground flex items-center gap-4">
                        <span>{scan.timestamp.toLocaleString()}</span>
                        <span>• {(scan.duration / 1000).toFixed(1)}s</span>
                        <span>• {scan.scanType}</span>
                      </div>
                      <div className="mt-2 grid grid-cols-3 gap-2">
                        <div className="text-xs">
                          <span className="text-muted-foreground">Stress: </span>
                          <span className="font-medium">{scan.result.stress_level.toFixed(0)}%</span>
                        </div>
                        <div className="text-xs">
                          <span className="text-muted-foreground">Énergie: </span>
                          <span className="font-medium">{scan.result.energy_level.toFixed(0)}%</span>
                        </div>
                        <div className="text-xs">
                          <span className="text-muted-foreground">Focus: </span>
                          <span className="font-medium">{scan.result.focus_level.toFixed(0)}%</span>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
                
                {scanHistory.length === 0 && (
                  <div className="text-center py-12 text-muted-foreground">
                    <Eye className="w-12 h-12 mx-auto mb-3 opacity-50" />
                    <p>Aucun scan effectué aujourd'hui</p>
                    <p className="text-sm">Commencez votre première analyse émotionnelle</p>
                  </div>
                )}
              </div>
            </EnhancedCard>
          </TabsContent>

          <TabsContent value="analytics" className="animate-fade-in">
            <div className="text-center py-12">
              <BarChart3 className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-lg font-semibold mb-2">Analytics Détaillées</h3>
              <p className="text-muted-foreground">Visualisez vos tendances émotionnelles sur le long terme</p>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default B2CScanPage;