import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Slider } from '@/components/ui/slider';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Music, 
  Play, 
  Pause, 
  Volume2, 
  VolumeX,
  Heart,
  Brain,
  Waves,
  Sparkles,
  Settings,
  Download,
  Share2,
  RotateCcw,
  Wand2,
  Headphones,
  Activity,
  Target
} from 'lucide-react';

interface MusicTherapyConfig {
  emotion: string;
  intensity: number; // 0-100
  duration: number; // en minutes
  style: 'ambient' | 'classical' | 'nature' | 'binaural' | 'adaptive';
  bpm: number; // battements par minute
  key: string; // tonalité musicale
  instruments: string[];
  effectsLevel: number; // 0-100
}

interface TherapySession {
  id: string;
  config: MusicTherapyConfig;
  startTime: Date;
  duration: number;
  effectiveness: number; // 0-100 basé sur feedback
  emotionBefore: string;
  emotionAfter?: string;
}

interface MusicTherapyEngineProps {
  initialEmotion?: string;
  onSessionStart?: (session: TherapySession) => void;
  onSessionEnd?: (session: TherapySession) => void;
  realTimeAnalysis?: boolean;
  biometricSync?: boolean;
}

/**
 * Moteur de musicothérapie IA avancé
 * Génère de la musique thérapeutique adaptée aux émotions en temps réel
 */
const MusicTherapyEngine: React.FC<MusicTherapyEngineProps> = ({
  initialEmotion = 'neutre',
  onSessionStart,
  onSessionEnd,
  realTimeAnalysis = false,
  biometricSync = false
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState([75]);
  const [currentConfig, setCurrentConfig] = useState<MusicTherapyConfig>({
    emotion: initialEmotion,
    intensity: 50,
    duration: 15,
    style: 'adaptive',
    bpm: 72,
    key: 'C major',
    instruments: ['piano', 'strings', 'pad'],
    effectsLevel: 30
  });
  
  const [currentSession, setCurrentSession] = useState<TherapySession | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [heartRate, setHeartRate] = useState(72);
  const [progress, setProgress] = useState(0);
  const [visualizerData, setVisualizerData] = useState<number[]>([]);
  
  const audioRef = useRef<HTMLAudioElement>(null);
  const intervalRef = useRef<NodeJS.Timeout>();

  // Simulation de génération musicale IA
  const generateTherapyMusic = useCallback(async (config: MusicTherapyConfig) => {
    setIsGenerating(true);
    
    // Simulation de génération IA (normalement appel API)
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Adaptation BPM selon l'émotion
    let targetBpm = config.bpm;
    switch (config.emotion.toLowerCase()) {
      case 'anxieux':
      case 'stress':
        targetBpm = Math.max(60, heartRate - 10); // Ralentir pour calmer
        break;
      case 'tristesse':
        targetBpm = heartRate - 5; // Légèrement plus lent
        break;
      case 'colère':
        targetBpm = Math.max(50, heartRate - 15); // Très lent pour apaiser
        break;
      case 'joie':
        targetBpm = heartRate + 5; // Légèrement plus rapide
        break;
      default:
        targetBpm = heartRate; // Synchronisé
    }

    const optimizedConfig = {
      ...config,
      bpm: targetBpm,
      key: getOptimalKey(config.emotion),
      instruments: getOptimalInstruments(config.emotion, config.style)
    };

    setCurrentConfig(optimizedConfig);
    setIsGenerating(false);
    
    return optimizedConfig;
  }, [heartRate]);

  const getOptimalKey = (emotion: string): string => {
    const keyMap: Record<string, string> = {
      'joie': 'C major',
      'tristesse': 'D minor',
      'colère': 'E minor',
      'anxieux': 'F major',
      'calme': 'G major',
      'stress': 'A minor',
      'neutre': 'C major'
    };
    return keyMap[emotion.toLowerCase()] || 'C major';
  };

  const getOptimalInstruments = (emotion: string, style: string): string[] => {
    const baseInstruments = {
      'ambient': ['pad', 'strings', 'reverb'],
      'classical': ['piano', 'violin', 'cello'],
      'nature': ['flute', 'birds', 'water'],
      'binaural': ['sine', 'theta', 'alpha'],
      'adaptive': ['piano', 'strings', 'pad']
    };

    const emotionMods = {
      'anxieux': ['slow-strings', 'deep-pad'],
      'colère': ['soft-piano', 'calming-pad'],
      'tristesse': ['gentle-strings', 'warm-pad'],
      'joie': ['bright-piano', 'uplifting-strings']
    };

    return [
      ...baseInstruments[style],
      ...(emotionMods[emotion.toLowerCase() as keyof typeof emotionMods] || [])
    ];
  };

  // Démarrage de session thérapeutique
  const startTherapySession = async () => {
    const optimizedConfig = await generateTherapyMusic(currentConfig);
    
    const session: TherapySession = {
      id: `session-${Date.now()}`,
      config: optimizedConfig,
      startTime: new Date(),
      duration: optimizedConfig.duration,
      effectiveness: 0,
      emotionBefore: optimizedConfig.emotion
    };

    setCurrentSession(session);
    setIsPlaying(true);
    setProgress(0);
    onSessionStart?.(session);

    // Simulation de progression
    intervalRef.current = setInterval(() => {
      setProgress(prev => {
        const newProgress = prev + (100 / (optimizedConfig.duration * 60)); // progression par seconde
        if (newProgress >= 100) {
          endTherapySession();
          return 100;
        }
        return newProgress;
      });
    }, 1000);
  };

  const endTherapySession = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    
    if (currentSession) {
      const completedSession = {
        ...currentSession,
        effectiveness: Math.floor(70 + Math.random() * 30), // 70-100%
        emotionAfter: getImprovedEmotion(currentSession.emotionBefore)
      };
      onSessionEnd?.(completedSession);
    }
    
    setIsPlaying(false);
    setCurrentSession(null);
    setProgress(0);
  };

  const getImprovedEmotion = (beforeEmotion: string): string => {
    const improvements: Record<string, string> = {
      'anxieux': 'calme',
      'stress': 'détendu',
      'colère': 'apaisé',
      'tristesse': 'mélancolique',
      'neutre': 'content'
    };
    return improvements[beforeEmotion.toLowerCase()] || 'équilibré';
  };

  // Mise à jour du visualiseur (simulation)
  useEffect(() => {
    if (isPlaying) {
      const updateVisualizer = () => {
        const newData = Array.from({ length: 32 }, () => Math.random() * 100);
        setVisualizerData(newData);
      };
      
      const visualizerInterval = setInterval(updateVisualizer, 100);
      return () => clearInterval(visualizerInterval);
    }
  }, [isPlaying]);

  // Simulation biométrie (normalement capteurs réels)
  useEffect(() => {
    if (biometricSync && isPlaying) {
      const biometricInterval = setInterval(() => {
        setHeartRate(prev => {
          const variation = (Math.random() - 0.5) * 4;
          const newRate = prev + variation;
          return Math.max(50, Math.min(120, newRate));
        });
      }, 2000);
      
      return () => clearInterval(biometricInterval);
    }
  }, [biometricSync, isPlaying]);

  const togglePlayback = () => {
    if (isPlaying) {
      endTherapySession();
    } else {
      startTherapySession();
    }
  };

  const MusicVisualizer = () => (
    <div className="flex items-end justify-center h-24 gap-1 bg-gradient-to-t from-primary/20 to-transparent rounded-lg p-4">
      {visualizerData.map((height, index) => (
        <motion.div
          key={index}
          className="bg-gradient-to-t from-primary to-primary/60 rounded-sm"
          style={{ width: '4px' }}
          animate={{ height: `${height}%` }}
          transition={{ duration: 0.1 }}
        />
      ))}
    </div>
  );

  const EmotionIndicator = ({ emotion }: { emotion: string }) => {
    const getEmotionColor = (emotion: string) => {
      const colors: Record<string, string> = {
        'joie': 'bg-yellow-100 text-yellow-800',
        'calme': 'bg-green-100 text-green-800',
        'tristesse': 'bg-blue-100 text-blue-800',
        'anxieux': 'bg-orange-100 text-orange-800',
        'colère': 'bg-red-100 text-red-800',
        'neutre': 'bg-gray-100 text-gray-800'
      };
      return colors[emotion.toLowerCase()] || 'bg-gray-100 text-gray-800';
    };

    return (
      <Badge className={getEmotionColor(emotion)}>
        {emotion}
      </Badge>
    );
  };

  return (
    <div className="space-y-6">
      {/* Interface principale */}
      <Card className="border-2 border-primary/20 bg-gradient-to-br from-background to-primary/5">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-full bg-gradient-to-r from-purple-500 to-pink-500">
                <Music className="h-5 w-5 text-white" />
              </div>
              Musicothérapie IA Avancée
            </div>
            <div className="flex gap-2">
              <EmotionIndicator emotion={currentConfig.emotion} />
              {biometricSync && (
                <Badge variant="outline" className="flex items-center gap-1">
                  <Heart className="h-3 w-3 text-red-500" />
                  {heartRate} BPM
                </Badge>
              )}
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Visualiseur musical */}
          <div className="relative">
            <MusicVisualizer />
            
            {/* Contrôles de lecture */}
            <div className="flex items-center justify-center gap-4 mt-4">
              <Button
                onClick={togglePlayback}
                disabled={isGenerating}
                size="lg"
                className="w-16 h-16 rounded-full"
              >
                {isGenerating ? (
                  <Wand2 className="h-6 w-6 animate-spin" />
                ) : isPlaying ? (
                  <Pause className="h-6 w-6" />
                ) : (
                  <Play className="h-6 w-6" />
                )}
              </Button>
              
              <div className="flex items-center gap-2">
                {volume[0] === 0 ? (
                  <VolumeX className="h-4 w-4 text-muted-foreground" />
                ) : (
                  <Volume2 className="h-4 w-4 text-muted-foreground" />
                )}
                <Slider
                  value={volume}
                  onValueChange={setVolume}
                  max={100}
                  step={1}
                  className="w-24"
                />
              </div>
            </div>

            {/* Barre de progression */}
            {isPlaying && currentSession && (
              <div className="mt-4 space-y-2">
                <div className="flex justify-between text-sm text-muted-foreground">
                  <span>Session en cours</span>
                  <span>{Math.round(progress)}% • {currentConfig.duration}min</span>
                </div>
                <div className="w-full bg-muted rounded-full h-2">
                  <motion.div
                    className="bg-gradient-to-r from-primary to-primary/70 h-2 rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: `${progress}%` }}
                    transition={{ duration: 0.5 }}
                  />
                </div>
              </div>
            )}
          </div>

          {/* Configuration thérapeutique */}
          <Tabs defaultValue="emotion" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="emotion">Émotion</TabsTrigger>
              <TabsTrigger value="style">Style</TabsTrigger>
              <TabsTrigger value="advanced">Avancé</TabsTrigger>
              <TabsTrigger value="biometric">Biométrie</TabsTrigger>
            </TabsList>

            <TabsContent value="emotion" className="space-y-4 mt-4">
              <div className="grid grid-cols-3 gap-3">
                {['anxieux', 'stress', 'tristesse', 'colère', 'neutre', 'calme'].map((emotion) => (
                  <Button
                    key={emotion}
                    variant={currentConfig.emotion === emotion ? 'default' : 'outline'}
                    onClick={() => setCurrentConfig(prev => ({ ...prev, emotion }))}
                    className="capitalize"
                  >
                    {emotion}
                  </Button>
                ))}
              </div>
              
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Intensité thérapeutique</span>
                  <span className="text-sm text-muted-foreground">{currentConfig.intensity}%</span>
                </div>
                <Slider
                  value={[currentConfig.intensity]}
                  onValueChange={(value) => setCurrentConfig(prev => ({ ...prev, intensity: value[0] }))}
                  max={100}
                  step={5}
                />
              </div>
            </TabsContent>

            <TabsContent value="style" className="space-y-4 mt-4">
              <div className="grid grid-cols-2 gap-3">
                {[
                  { key: 'adaptive', label: 'Adaptatif IA', icon: Brain },
                  { key: 'ambient', label: 'Ambiance', icon: Waves },
                  { key: 'classical', label: 'Classique', icon: Music },
                  { key: 'binaural', label: 'Binaural', icon: Headphones },
                  { key: 'nature', label: 'Nature', icon: Sparkles }
                ].map(({ key, label, icon: Icon }) => (
                  <Button
                    key={key}
                    variant={currentConfig.style === key ? 'default' : 'outline'}
                    onClick={() => setCurrentConfig(prev => ({ ...prev, style: key as any }))}
                    className="flex items-center gap-2 h-12"
                  >
                    <Icon className="h-4 w-4" />
                    {label}
                  </Button>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="advanced" className="space-y-4 mt-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">BPM (Battements/min)</label>
                  <Slider
                    value={[currentConfig.bpm]}
                    onValueChange={(value) => setCurrentConfig(prev => ({ ...prev, bpm: value[0] }))}
                    min={40}
                    max={120}
                    step={2}
                  />
                  <span className="text-xs text-muted-foreground">{currentConfig.bpm} BPM</span>
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium">Durée (minutes)</label>
                  <Slider
                    value={[currentConfig.duration]}
                    onValueChange={(value) => setCurrentConfig(prev => ({ ...prev, duration: value[0] }))}
                    min={5}
                    max={60}
                    step={5}
                  />
                  <span className="text-xs text-muted-foreground">{currentConfig.duration} min</span>
                </div>
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">Tonalité: {currentConfig.key}</label>
                <div className="flex flex-wrap gap-2">
                  {['C major', 'D minor', 'E minor', 'F major', 'G major', 'A minor'].map((key) => (
                    <Button
                      key={key}
                      variant={currentConfig.key === key ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setCurrentConfig(prev => ({ ...prev, key }))}
                    >
                      {key}
                    </Button>
                  ))}
                </div>
              </div>
            </TabsContent>

            <TabsContent value="biometric" className="space-y-4 mt-4">
              <div className="grid grid-cols-2 gap-4">
                <Card className="p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Heart className="h-4 w-4 text-red-500" />
                    <span className="font-medium">Rythme Cardiaque</span>
                  </div>
                  <div className="text-2xl font-bold">{heartRate} BPM</div>
                  <div className="text-xs text-muted-foreground">Synchronisation auto</div>
                </Card>
                
                <Card className="p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Activity className="h-4 w-4 text-blue-500" />
                    <span className="font-medium">Cohérence</span>
                  </div>
                  <div className="text-2xl font-bold">
                    {Math.abs(currentConfig.bpm - heartRate) < 5 ? '✓' : '○'}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {Math.abs(currentConfig.bpm - heartRate) < 5 ? 'Synchronisé' : 'Adaptation...'}
                  </div>
                </Card>
              </div>
              
              <div className="p-4 bg-muted/30 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <Target className="h-4 w-4 text-green-500" />
                  <span className="font-medium">Objectif thérapeutique</span>
                </div>
                <p className="text-sm text-muted-foreground">
                  La musique s'adapte automatiquement à votre rythme cardiaque pour optimiser l'effet thérapeutique selon votre état émotionnel actuel.
                </p>
              </div>
            </TabsContent>
          </Tabs>

          {/* Actions rapides */}
          <div className="flex justify-between items-center pt-4 border-t">
            <div className="flex gap-2">
              <Button variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" />
                Exporter
              </Button>
              <Button variant="outline" size="sm">
                <Share2 className="h-4 w-4 mr-2" />
                Partager
              </Button>
            </div>
            
            <Button variant="ghost" size="sm" onClick={() => generateTherapyMusic(currentConfig)}>
              <RotateCcw className="h-4 w-4 mr-2" />
              Régénérer
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Session en cours */}
      {currentSession && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
        >
          <Card className="border-green-200 bg-gradient-to-r from-green-50 to-green-100">
            <CardContent className="pt-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse" />
                  <div>
                    <div className="font-medium">Session thérapeutique active</div>
                    <div className="text-sm text-muted-foreground">
                      Démarrée à {currentSession.startTime.toLocaleTimeString()}
                    </div>
                  </div>
                </div>
                
                <Button variant="ghost" onClick={endTherapySession}>
                  Terminer
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}
    </div>
  );
};

export default MusicTherapyEngine;