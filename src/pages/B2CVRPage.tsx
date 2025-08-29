import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Headphones, 
  Play, 
  Pause, 
  RotateCcw,
  Volume2,
  VolumeX,
  Maximize,
  Settings,
  Heart,
  Brain,
  Waves,
  Sparkles,
  Mountain,
  TreePine,
  Fish,
  Cloud,
  Star,
  Flame,
  Moon,
  Sun,
  Wind
} from 'lucide-react';

interface VREnvironment {
  id: string;
  name: string;
  description: string;
  icon: React.ComponentType<any>;
  thumbnail: string;
  category: 'nature' | 'space' | 'meditation' | 'fantasy';
  benefits: string[];
  color: string;
  duration: number;
  ambientSounds: string[];
}

interface BiometricData {
  heartRate: number;
  stressLevel: number;
  focusLevel: number;
  relaxationIndex: number;
}

const vrEnvironments: VREnvironment[] = [
  {
    id: 'forest',
    name: 'Forêt Enchantée',
    description: 'Promenade apaisante dans une forêt mystique avec des arbres centenaires',
    icon: TreePine,
    thumbnail: '/api/placeholder/300/200',
    category: 'nature',
    benefits: ['Réduction du stress', 'Connexion nature', 'Calme mental'],
    color: 'from-green-400 to-emerald-600',
    duration: 15,
    ambientSounds: ['Oiseaux', 'Vent dans les feuilles', 'Ruisseau']
  },
  {
    id: 'ocean',
    name: 'Profondeurs Océaniques',
    description: 'Exploration sous-marine dans un récif corallien coloré',
    icon: Fish,
    thumbnail: '/api/placeholder/300/200',
    category: 'nature',
    benefits: ['Apaisement profond', 'Méditation aquatique', 'Lâcher-prise'],
    color: 'from-blue-400 to-cyan-600',
    duration: 20,
    ambientSounds: ['Vagues', 'Bulles', 'Chants de baleines']
  },
  {
    id: 'galaxy',
    name: 'Voyage Galactique',
    description: 'Exploration de nebuleuses et systèmes stellaires lointains',
    icon: Star,
    thumbnail: '/api/placeholder/300/200',
    category: 'space',
    benefits: ['Perspective cosmique', 'Inspiration', 'Transcendance'],
    color: 'from-purple-400 to-indigo-600',
    duration: 25,
    ambientSounds: ['Ambiance spatiale', 'Harmoniques', 'Vent stellaire']
  },
  {
    id: 'mountain',
    name: 'Sommet Himalayen',
    description: 'Méditation au sommet des plus hautes montagnes du monde',
    icon: Mountain,
    thumbnail: '/api/placeholder/300/200',
    category: 'meditation',
    benefits: ['Clarté mentale', 'Force intérieure', 'Détermination'],
    color: 'from-slate-400 to-stone-600',
    duration: 18,
    ambientSounds: ['Vent montagnard', 'Échos', 'Silence profond']
  },
  {
    id: 'crystal',
    name: 'Caverne de Cristal',
    description: 'Temple souterrain illuminé de cristaux aux propriétés curatives',
    icon: Sparkles,
    thumbnail: '/api/placeholder/300/200',
    category: 'fantasy',
    benefits: ['Guérison énergétique', 'Harmonisation', 'Purification'],
    color: 'from-pink-400 to-rose-600',
    duration: 22,
    ambientSounds: ['Résonance cristalline', 'Harmoniques', 'Écho mystique']
  },
  {
    id: 'aurora',
    name: 'Aurores Boréales',
    description: 'Spectacle lumineux dans la toundra arctique sous les étoiles',
    icon: Wind,
    thumbnail: '/api/placeholder/300/200',
    category: 'nature',
    benefits: ['Émerveillement', 'Connexion cosmique', 'Paix intérieure'],
    color: 'from-teal-400 to-green-600',
    duration: 16,
    ambientSounds: ['Vent polaire', 'Craquements glace', 'Silence arctique']
  }
];

export default function B2CVRExperienceEnhanced() {
  const [selectedEnvironment, setSelectedEnvironment] = useState<VREnvironment | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [volume, setVolume] = useState(70);
  const [isMuted, setIsMuted] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [biometrics, setBiometrics] = useState<BiometricData>({
    heartRate: 72,
    stressLevel: 45,
    focusLevel: 60,
    relaxationIndex: 0
  });
  const [vrConnected, setVrConnected] = useState(false);
  const [sessionData, setSessionData] = useState({
    totalTime: 0,
    environmentsVisited: 0,
    stressReduction: 0,
    focusImprovement: 0
  });
  
  const timerRef = useRef<NodeJS.Timeout>();
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Simulation des données biométriques
  useEffect(() => {
    if (isPlaying && selectedEnvironment) {
      const interval = setInterval(() => {
        setBiometrics(prev => ({
          heartRate: Math.max(60, prev.heartRate + (Math.random() - 0.6) * 2),
          stressLevel: Math.max(0, Math.min(100, prev.stressLevel - Math.random() * 0.5)),
          focusLevel: Math.min(100, prev.focusLevel + Math.random() * 0.3),
          relaxationIndex: Math.min(100, prev.relaxationIndex + 0.2)
        }));
      }, 2000);
      return () => clearInterval(interval);
    }
  }, [isPlaying, selectedEnvironment]);

  // Timer de session
  useEffect(() => {
    if (isPlaying) {
      timerRef.current = setInterval(() => {
        setCurrentTime(prev => prev + 1);
        setSessionData(prev => ({ ...prev, totalTime: prev.totalTime + 1 }));
      }, 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }
    
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isPlaying]);

  // Animation du canvas 3D simulé
  useEffect(() => {
    if (!canvasRef.current || !selectedEnvironment) return;
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationId: number;
    let time = 0;

    const animate = () => {
      time += 0.01;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Gradient de fond basé sur l'environnement
      const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
      if (selectedEnvironment.id === 'ocean') {
        gradient.addColorStop(0, '#1e3a8a');
        gradient.addColorStop(1, '#0891b2');
      } else if (selectedEnvironment.id === 'forest') {
        gradient.addColorStop(0, '#15803d');
        gradient.addColorStop(1, '#166534');
      } else if (selectedEnvironment.id === 'galaxy') {
        gradient.addColorStop(0, '#312e81');
        gradient.addColorStop(1, '#1e1b4b');
      } else {
        gradient.addColorStop(0, '#374151');
        gradient.addColorStop(1, '#111827');
      }
      
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      // Particules animées
      for (let i = 0; i < 50; i++) {
        const x = (i * 50 + time * 20) % canvas.width;
        const y = Math.sin(time + i) * 20 + canvas.height / 2;
        const opacity = Math.sin(time + i) * 0.5 + 0.5;
        
        ctx.fillStyle = `rgba(255, 255, 255, ${opacity * 0.3})`;
        ctx.beginPath();
        ctx.arc(x, y, 2, 0, Math.PI * 2);
        ctx.fill();
      }
      
      animationId = requestAnimationFrame(animate);
    };
    
    animate();
    return () => cancelAnimationFrame(animationId);
  }, [selectedEnvironment]);

  const startExperience = (environment: VREnvironment) => {
    setSelectedEnvironment(environment);
    setCurrentTime(0);
    setBiometrics({
      heartRate: 75,
      stressLevel: 50,
      focusLevel: 50,
      relaxationIndex: 0
    });
    setIsPlaying(true);
    setSessionData(prev => ({
      ...prev,
      environmentsVisited: prev.environmentsVisited + 1
    }));
  };

  const togglePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  const resetSession = () => {
    setIsPlaying(false);
    setCurrentTime(0);
    setBiometrics({
      heartRate: 72,
      stressLevel: 45,
      focusLevel: 60,
      relaxationIndex: 0
    });
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const connectVR = async () => {
    // Simulation de connexion VR
    setVrConnected(true);
    await new Promise(resolve => setTimeout(resolve, 2000));
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'nature': return 'bg-green-100 text-green-800';
      case 'space': return 'bg-purple-100 text-purple-800';
      case 'meditation': return 'bg-blue-100 text-blue-800';
      case 'fantasy': return 'bg-pink-100 text-pink-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white">
      <div className="max-w-7xl mx-auto p-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="p-3 rounded-full bg-gradient-to-r from-purple-500 to-blue-500">
              <Headphones className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              Expérience VR Thérapeutique
            </h1>
          </div>
          <p className="text-gray-300 max-w-2xl mx-auto">
            Immersion totale dans des environnements conçus pour votre bien-être mental et émotionnel
          </p>
        </motion.div>

        {!selectedEnvironment ? (
          /* Sélection d'environnement */
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {vrEnvironments.map((env, index) => {
              const Icon = env.icon;
              return (
                <motion.div
                  key={env.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className="bg-gray-800/50 border-gray-700 hover:border-purple-500 transition-all cursor-pointer group overflow-hidden">
                    <div className={`h-48 bg-gradient-to-br ${env.color} relative`}>
                      <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors" />
                      <div className="absolute top-4 left-4">
                        <Badge className={getCategoryColor(env.category)}>
                          {env.category}
                        </Badge>
                      </div>
                      <div className="absolute bottom-4 right-4">
                        <Icon className="w-8 h-8 text-white/80" />
                      </div>
                      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <Button
                          onClick={() => startExperience(env)}
                          className="bg-white/20 backdrop-blur-sm border-white/30"
                        >
                          <Play className="w-4 h-4 mr-2" />
                          Commencer
                        </Button>
                      </div>
                    </div>
                    <CardContent className="p-6">
                      <h3 className="text-xl font-bold mb-2">{env.name}</h3>
                      <p className="text-gray-400 text-sm mb-4">{env.description}</p>
                      <div className="flex items-center justify-between text-sm text-gray-300 mb-3">
                        <span>{env.duration} min</span>
                        <span>{env.ambientSounds.length} sons</span>
                      </div>
                      <div className="space-y-2">
                        <h4 className="text-sm font-medium text-gray-300">Bienfaits:</h4>
                        <div className="flex flex-wrap gap-1">
                          {env.benefits.map(benefit => (
                            <Badge key={benefit} variant="outline" className="text-xs border-gray-600 text-gray-300">
                              {benefit}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        ) : (
          /* Interface d'expérience */
          <div className="space-y-6">
            {/* Viewer principal */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="relative"
            >
              <Card className="bg-gray-900/50 border-gray-700 overflow-hidden">
                <div className="relative h-96 lg:h-[500px]">
                  <canvas
                    ref={canvasRef}
                    width={800}
                    height={500}
                    className="w-full h-full object-cover"
                  />
                  
                  {/* Overlay d'informations */}
                  <div className="absolute top-4 left-4 space-y-2">
                    <Badge className={`${getCategoryColor(selectedEnvironment.category)} bg-black/50 backdrop-blur-sm`}>
                      {selectedEnvironment.name}
                    </Badge>
                    <div className="bg-black/50 backdrop-blur-sm rounded-lg p-2 text-sm">
                      {formatTime(currentTime)} / {formatTime(selectedEnvironment.duration * 60)}
                    </div>
                  </div>

                  {/* Contrôles */}
                  <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2">
                    <div className="bg-black/50 backdrop-blur-sm rounded-full p-2 flex items-center gap-3">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={togglePlayPause}
                        className="text-white hover:bg-white/20"
                      >
                        {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={resetSession}
                        className="text-white hover:bg-white/20"
                      >
                        <RotateCcw className="w-4 h-4" />
                      </Button>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setIsMuted(!isMuted)}
                          className="text-white hover:bg-white/20"
                        >
                          {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                        </Button>
                        <input
                          type="range"
                          min="0"
                          max="100"
                          value={isMuted ? 0 : volume}
                          onChange={(e) => setVolume(parseInt(e.target.value))}
                          className="w-16 accent-purple-500"
                        />
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setIsFullscreen(!isFullscreen)}
                        className="text-white hover:bg-white/20"
                      >
                        <Maximize className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>

                  {/* Indicateur VR */}
                  <div className="absolute top-4 right-4">
                    <Button
                      onClick={connectVR}
                      variant={vrConnected ? "default" : "outline"}
                      size="sm"
                      className={vrConnected ? "bg-green-600 hover:bg-green-700" : "border-gray-600"}
                    >
                      <Headphones className="w-4 h-4 mr-2" />
                      {vrConnected ? "VR Connecté" : "Connecter VR"}
                    </Button>
                  </div>
                </div>
              </Card>
            </motion.div>

            <div className="grid lg:grid-cols-3 gap-6">
              {/* Données biométriques */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
              >
                <Card className="bg-gray-800/50 border-gray-700">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Heart className="w-5 h-5 text-red-500" />
                      Données Biométriques
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {[
                      { label: 'Rythme cardiaque', value: Math.round(biometrics.heartRate), unit: 'bpm', icon: Heart, color: 'red' },
                      { label: 'Niveau de stress', value: Math.round(biometrics.stressLevel), unit: '%', icon: Brain, color: 'orange' },
                      { label: 'Niveau de focus', value: Math.round(biometrics.focusLevel), unit: '%', icon: Waves, color: 'blue' },
                      { label: 'Index relaxation', value: Math.round(biometrics.relaxationIndex), unit: '%', icon: Cloud, color: 'green' }
                    ].map(({ label, value, unit, icon: Icon, color }) => (
                      <div key={label} className="space-y-2">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <Icon className={`w-4 h-4 text-${color}-500`} />
                            <span className="text-sm font-medium">{label}</span>
                          </div>
                          <span className="text-sm text-gray-300">{value}{unit}</span>
                        </div>
                        <Progress value={value} className="h-2" />
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </motion.div>

              {/* Contrôles d'environnement */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <Card className="bg-gray-800/50 border-gray-700">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Settings className="w-5 h-5 text-purple-500" />
                      Personnalisation
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <label className="text-sm font-medium text-gray-300 mb-2 block">
                        Sons d'ambiance
                      </label>
                      <div className="space-y-2">
                        {selectedEnvironment.ambientSounds.map(sound => (
                          <div key={sound} className="flex items-center justify-between">
                            <span className="text-sm">{sound}</span>
                            <input
                              type="range"
                              min="0"
                              max="100"
                              defaultValue="70"
                              className="w-20 accent-purple-500"
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    <div>
                      <label className="text-sm font-medium text-gray-300 mb-2 block">
                        Intensité visuelle
                      </label>
                      <input
                        type="range"
                        min="0"
                        max="100"
                        defaultValue="80"
                        className="w-full accent-purple-500"
                      />
                    </div>

                    <div>
                      <label className="text-sm font-medium text-gray-300 mb-2 block">
                        Guidage vocal
                      </label>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm" className="flex-1">Aucun</Button>
                        <Button variant="outline" size="sm" className="flex-1">Léger</Button>
                        <Button variant="outline" size="sm" className="flex-1">Complet</Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Statistiques de session */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
              >
                <Card className="bg-gray-800/50 border-gray-700">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Sparkles className="w-5 h-5 text-yellow-500" />
                      Session Actuelle
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-purple-400">
                          {formatTime(sessionData.totalTime)}
                        </div>
                        <div className="text-xs text-gray-400">Temps total</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-blue-400">
                          {sessionData.environmentsVisited}
                        </div>
                        <div className="text-xs text-gray-400">Environnements</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-green-400">
                          -{Math.round(50 - biometrics.stressLevel)}%
                        </div>
                        <div className="text-xs text-gray-400">Stress</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-orange-400">
                          +{Math.round(biometrics.focusLevel - 50)}%
                        </div>
                        <div className="text-xs text-gray-400">Focus</div>
                      </div>
                    </div>

                    <div className="pt-4 border-t border-gray-700">
                      <h4 className="font-medium mb-2">Recommandations IA</h4>
                      <div className="text-sm text-gray-300 space-y-1">
                        <p>• Continuez cette session 5 min de plus</p>
                        <p>• Essayez "Forêt Enchantée" ensuite</p>
                        <p>• Votre rythme cardiaque se stabilise</p>
                      </div>
                    </div>

                    <Button
                      onClick={() => setSelectedEnvironment(null)}
                      variant="outline"
                      className="w-full border-gray-600 hover:bg-gray-700"
                    >
                      Changer d'environnement
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}