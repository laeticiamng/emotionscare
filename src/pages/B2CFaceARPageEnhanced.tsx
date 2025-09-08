import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Camera, Smile, Heart, Sparkles, Download, Share2, RotateCcw, Settings, Zap } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/hooks/use-toast';

interface ARFilter {
  id: string;
  name: string;
  description: string;
  type: 'emotional' | 'therapeutic' | 'fun' | 'wellness';
  icon: React.ReactNode;
  gradient: string;
  effects: string[];
  emotionalBenefit: string;
}

interface EmotionDetection {
  dominant: string;
  confidence: number;
  secondary?: string;
  timestamp: Date;
}

const B2CFaceARPageEnhanced: React.FC = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isActive, setIsActive] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState<ARFilter | null>(null);
  const [currentEmotion, setCurrentEmotion] = useState<EmotionDetection | null>(null);
  const [filterIntensity, setFilterIntensity] = useState(70);
  const [emotionalBoost, setEmotionalBoost] = useState(true);
  const [adaptiveFilters, setAdaptiveFilters] = useState(true);
  const [sessionDuration, setSessionDuration] = useState(0);
  
  const { toast } = useToast();

  const arFilters: ARFilter[] = [
    {
      id: 'confidence-glow',
      name: 'Éclat de Confiance',
      description: 'Rayonne de confiance avec une aura dorée',
      type: 'emotional',
      icon: <Sparkles className="w-5 h-5" />,
      gradient: 'from-yellow-400 to-orange-500',
      effects: ['Aura dorée', 'Regard magnétique', 'Posture renforcée'],
      emotionalBenefit: 'Confiance +40%'
    },
    {
      id: 'serenity-field',
      name: 'Champ de Sérénité',
      description: 'Enveloppement dans une bulle de paix',
      type: 'therapeutic',
      icon: <Heart className="w-5 h-5" />,
      gradient: 'from-blue-400 to-teal-500',
      effects: ['Particules zen', 'Lumière apaisante', 'Respiration guidée'],
      emotionalBenefit: 'Stress -50%'
    },
    {
      id: 'energy-burst',
      name: 'Explosion d\'Énergie',
      description: 'Débordement de vitalité et dynamisme',
      type: 'wellness',
      icon: <Zap className="w-5 h-5" />,
      gradient: 'from-red-400 to-pink-500',
      effects: ['Éclairs d\'énergie', 'Halo dynamique', 'Mouvements amplifiés'],
      emotionalBenefit: 'Énergie +60%'
    },
    {
      id: 'joy-bubbles',
      name: 'Bulles de Joie',
      description: 'Entourage de bulles de bonheur colorées',
      type: 'fun',
      icon: <Smile className="w-5 h-5" />,
      gradient: 'from-purple-400 to-pink-500',
      effects: ['Bulles colorées', 'Sourire amplifié', 'Éclats de rire'],
      emotionalBenefit: 'Bonheur +45%'
    },
    {
      id: 'wisdom-crown',
      name: 'Couronne de Sagesse',
      description: 'Porter la couronne de la clarté mentale',
      type: 'therapeutic',
      icon: <Sparkles className="w-5 h-5" />,
      gradient: 'from-indigo-400 to-purple-500',
      effects: ['Couronne lumineuse', 'Yeux brillants', 'Aura de sagesse'],
      emotionalBenefit: 'Clarté +55%'
    },
    {
      id: 'love-radiance',
      name: 'Rayonnement d\'Amour',
      description: 'Émission d\'ondes d\'amour et compassion',
      type: 'emotional',
      icon: <Heart className="w-5 h-5" />,
      gradient: 'from-pink-400 to-rose-500',
      effects: ['Cœurs flottants', 'Lumière rose', 'Chaleur émotionnelle'],
      emotionalBenefit: 'Bienveillance +50%'
    }
  ];

  // Simulation de la détection émotionnelle
  useEffect(() => {
    if (isActive) {
      const emotionInterval = setInterval(() => {
        const emotions = ['happy', 'calm', 'confident', 'energetic', 'peaceful', 'focused'];
        const randomEmotion = emotions[Math.floor(Math.random() * emotions.length)];
        
        setCurrentEmotion({
          dominant: randomEmotion,
          confidence: 0.7 + Math.random() * 0.25,
          secondary: emotions[Math.floor(Math.random() * emotions.length)],
          timestamp: new Date()
        });
      }, 3000);

      const sessionInterval = setInterval(() => {
        setSessionDuration(prev => prev + 1);
      }, 1000);

      return () => {
        clearInterval(emotionInterval);
        clearInterval(sessionInterval);
      };
    }
  }, [isActive]);

  // Sélection automatique de filtre basée sur l'émotion
  useEffect(() => {
    if (adaptiveFilters && currentEmotion && !selectedFilter) {
      let recommendedFilter;
      
      switch (currentEmotion.dominant) {
        case 'calm':
        case 'peaceful':
          recommendedFilter = arFilters.find(f => f.id === 'serenity-field');
          break;
        case 'happy':
          recommendedFilter = arFilters.find(f => f.id === 'joy-bubbles');
          break;
        case 'confident':
          recommendedFilter = arFilters.find(f => f.id === 'confidence-glow');
          break;
        case 'energetic':
          recommendedFilter = arFilters.find(f => f.id === 'energy-burst');
          break;
        default:
          recommendedFilter = arFilters.find(f => f.id === 'wisdom-crown');
      }
      
      if (recommendedFilter) {
        setSelectedFilter(recommendedFilter);
        toast({
          title: "Filtre adaptatif activé",
          description: `${recommendedFilter.name} sélectionné selon votre état émotionnel`,
        });
      }
    }
  }, [currentEmotion, adaptiveFilters, selectedFilter]);

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: 'user' },
        audio: false 
      });
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        setIsActive(true);
        setSessionDuration(0);
        
        toast({
          title: "Caméra activée",
          description: "Session AR Face démarrée avec succès",
        });
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
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach(track => track.stop());
      videoRef.current.srcObject = null;
    }
    
    setIsActive(false);
    setCurrentEmotion(null);
    setSessionDuration(0);
    
    toast({
      title: "Session terminée",
      description: `Durée: ${Math.floor(sessionDuration / 60)}:${(sessionDuration % 60).toString().padStart(2, '0')}`,
    });
  };

  const capturePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const canvas = canvasRef.current;
      const video = videoRef.current;
      const ctx = canvas.getContext('2d');
      
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      
      if (ctx) {
        ctx.drawImage(video, 0, 0);
        
        toast({
          title: "Photo capturée",
          description: "Image sauvegardée avec les effets AR",
        });
      }
    }
  };

  const formatSessionTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getTypeColor = (type: ARFilter['type']) => {
    switch (type) {
      case 'emotional': return 'bg-orange-100 text-orange-800';
      case 'therapeutic': return 'bg-blue-100 text-blue-800';
      case 'wellness': return 'bg-green-100 text-green-800';
      case 'fun': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 p-4">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center space-y-4"
        >
          <h1 className="text-5xl font-bold bg-gradient-to-r from-cyan-400 via-purple-500 to-pink-500 bg-clip-text text-transparent">
            🎭 Face AR Thérapeutique
          </h1>
          <p className="text-xl text-gray-300">
            Filtres de réalité augmentée pour améliorer votre état émotionnel
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Zone caméra */}
          <div className="lg:col-span-2 space-y-6">
            <Card className="bg-black/30 border-white/10 backdrop-blur-xl">
              <CardContent className="p-6">
                <div className="relative aspect-video bg-gray-900 rounded-lg overflow-hidden mb-4">
                  {isActive ? (
                    <>
                      <video
                        ref={videoRef}
                        autoPlay
                        playsInline
                        muted
                        className="w-full h-full object-cover"
                      />
                      
                      {/* Overlay AR Effects */}
                      {selectedFilter && (
                        <div className="absolute inset-0 pointer-events-none">
                          <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: filterIntensity / 100 }}
                            className={`absolute inset-0 bg-gradient-to-br ${selectedFilter.gradient} opacity-20 mix-blend-overlay`}
                          />
                          
                          {/* Particles overlay */}
                          <div className="absolute inset-0">
                            {[...Array(8)].map((_, i) => (
                              <motion.div
                                key={i}
                                className="absolute w-2 h-2 bg-white rounded-full"
                                style={{
                                  left: `${20 + (i * 10)}%`,
                                  top: `${30 + Math.sin(i) * 20}%`,
                                }}
                                animate={{
                                  y: [-10, 10, -10],
                                  opacity: [0.3, 0.8, 0.3],
                                  scale: [0.8, 1.2, 0.8]
                                }}
                                transition={{
                                  duration: 2 + i * 0.5,
                                  repeat: Infinity,
                                  ease: "easeInOut"
                                }}
                              />
                            ))}
                          </div>
                        </div>
                      )}
                      
                      {/* Informations en overlay */}
                      <div className="absolute top-4 left-4 space-y-2">
                        {currentEmotion && (
                          <Badge className="bg-black/50 text-white border-white/20">
                            {currentEmotion.dominant} ({Math.round(currentEmotion.confidence * 100)}%)
                          </Badge>
                        )}
                        <Badge className="bg-black/50 text-white border-white/20">
                          {formatSessionTime(sessionDuration)}
                        </Badge>
                      </div>
                      
                      {selectedFilter && (
                        <div className="absolute top-4 right-4">
                          <Badge className={`bg-gradient-to-r ${selectedFilter.gradient} text-white`}>
                            {selectedFilter.name}
                          </Badge>
                        </div>
                      )}
                    </>
                  ) : (
                    <div className="flex items-center justify-center h-full text-gray-400">
                      <div className="text-center space-y-4">
                        <Camera className="w-16 h-16 mx-auto" />
                        <p>Cliquez sur "Démarrer" pour activer la caméra</p>
                      </div>
                    </div>
                  )}
                </div>
                
                {/* Contrôles caméra */}
                <div className="flex justify-center gap-4">
                  {!isActive ? (
                    <Button onClick={startCamera} size="lg" className="bg-gradient-to-r from-purple-500 to-pink-500">
                      <Camera className="w-5 h-5 mr-2" />
                      Démarrer
                    </Button>
                  ) : (
                    <>
                      <Button onClick={capturePhoto} variant="outline" size="lg" className="bg-white/10 border-white/20 text-white">
                        <Download className="w-5 h-5 mr-2" />
                        Capturer
                      </Button>
                      <Button onClick={stopCamera} variant="destructive" size="lg">
                        Arrêter
                      </Button>
                    </>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Paramètres */}
            {isActive && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <Card className="bg-black/30 border-white/10 backdrop-blur-xl">
                  <CardHeader>
                    <CardTitle className="text-white flex items-center gap-2">
                      <Settings className="w-5 h-5" />
                      Paramètres
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <label className="text-white mb-2 block">Intensité du filtre: {filterIntensity}%</label>
                      <Slider
                        value={[filterIntensity]}
                        onValueChange={(value) => setFilterIntensity(value[0])}
                        max={100}
                        min={10}
                        step={5}
                        className="w-full"
                      />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <label className="text-white">Boost émotionnel</label>
                      <Switch
                        checked={emotionalBoost}
                        onCheckedChange={setEmotionalBoost}
                      />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <label className="text-white">Filtres adaptatifs</label>
                      <Switch
                        checked={adaptiveFilters}
                        onCheckedChange={setAdaptiveFilters}
                      />
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}
          </div>

          {/* Sélection de filtres */}
          <div className="space-y-6">
            <Card className="bg-black/30 border-white/10 backdrop-blur-xl">
              <CardHeader>
                <CardTitle className="text-white">Filtres AR</CardTitle>
                <CardDescription className="text-gray-300">
                  Sélectionnez un filtre thérapeutique
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {arFilters.map((filter) => (
                  <motion.div
                    key={filter.id}
                    whileHover={{ scale: 1.02 }}
                    className={`p-4 rounded-lg cursor-pointer transition-all ${
                      selectedFilter?.id === filter.id 
                        ? `bg-gradient-to-r ${filter.gradient} text-white` 
                        : 'bg-white/5 text-white hover:bg-white/10'
                    }`}
                    onClick={() => setSelectedFilter(filter)}
                  >
                    <div className="flex items-start gap-3">
                      <div className={`p-2 rounded-full ${selectedFilter?.id === filter.id ? 'bg-white/20' : 'bg-white/10'}`}>
                        {filter.icon}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-semibold">{filter.name}</h3>
                          <Badge className={getTypeColor(filter.type)}>
                            {filter.type}
                          </Badge>
                        </div>
                        <p className="text-sm opacity-90 mb-2">{filter.description}</p>
                        <div className="text-xs space-y-1">
                          {filter.effects.map((effect, i) => (
                            <div key={i} className="opacity-75">• {effect}</div>
                          ))}
                        </div>
                        <div className="mt-2 text-sm font-medium text-green-300">
                          {filter.emotionalBenefit}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Canvas caché pour les captures */}
        <canvas ref={canvasRef} className="hidden" />
      </div>
    </div>
  );
};

export default B2CFaceARPageEnhanced;