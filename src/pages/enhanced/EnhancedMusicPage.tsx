import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Play, 
  Pause, 
  SkipForward, 
  SkipBack, 
  Volume2, 
  VolumeX,
  Shuffle,
  Repeat,
  Music,
  Heart,
  Brain,
  Waves,
  Sun,
  Moon,
  Cloud,
  TreePine,
  Mountain,
  Sparkles,
  Headphones,
  Mic,
  Activity,
  Zap,
  Timer,
  BarChart3
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface Track {
  id: string;
  title: string;
  artist: string;
  genre: string;
  duration: number;
  emotionTarget: string;
  biometricData?: {
    heartRateImpact: number;
    stressReduction: number;
    focusBoost: number;
  };
  visualizer?: 'waves' | 'particles' | 'geometric' | 'nature';
  environment?: 'forest' | 'ocean' | 'space' | 'mountain';
}

interface BiometricReading {
  timestamp: number;
  heartRate: number;
  stress: number;
  focus: number;
  enjoyment: number;
}

const EnhancedMusicPage: React.FC = () => {
  const [currentTrack, setCurrentTrack] = useState<Track | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState([75]);
  const [progress, setProgress] = useState(0);
  const [isGenerating, setIsGenerating] = useState(false);
  const [biometrics, setBiometrics] = useState<BiometricReading[]>([]);
  const [visualizerType, setVisualizerType] = useState<'waves' | 'particles' | 'spectrum'>('waves');
  const [emotionalGoal, setEmotionalGoal] = useState('relaxation');
  const [adaptiveMode, setAdaptiveMode] = useState(true);
  const { toast } = useToast();
  const audioContext = useRef<AudioContext | null>(null);

  const tracks: Track[] = [
    {
      id: '1',
      title: 'Forêt Apaisante',
      artist: 'IA Thérapeutique',
      genre: 'Nature Healing',
      duration: 480,
      emotionTarget: 'Relaxation profonde',
      biometricData: {
        heartRateImpact: -12,
        stressReduction: 45,
        focusBoost: 25
      },
      visualizer: 'nature',
      environment: 'forest'
    },
    {
      id: '2', 
      title: 'Vagues Cosmiques',
      artist: 'IA Créative',
      genre: 'Ambient Therapy',
      duration: 600,
      emotionTarget: 'Méditation transcendante',
      biometricData: {
        heartRateImpact: -8,
        stressReduction: 52,
        focusBoost: 40
      },
      visualizer: 'waves',
      environment: 'space'
    },
    {
      id: '3',
      title: 'Énergie Matinale',
      artist: 'IA Motivante',
      genre: 'Energizing',
      duration: 360,
      emotionTarget: 'Stimulation positive',
      biometricData: {
        heartRateImpact: 8,
        stressReduction: 20,
        focusBoost: 60
      },
      visualizer: 'particles',
      environment: 'mountain'
    }
  ];

  const environments = [
    { id: 'forest', name: 'Forêt', icon: TreePine, color: 'from-green-400 to-emerald-600' },
    { id: 'ocean', name: 'Océan', icon: Waves, color: 'from-blue-400 to-cyan-600' },
    { id: 'space', name: 'Cosmos', icon: Sparkles, color: 'from-purple-400 to-indigo-600' },
    { id: 'mountain', name: 'Montagne', icon: Mountain, color: 'from-gray-400 to-slate-600' }
  ];

  const emotionalGoals = [
    { id: 'relaxation', name: 'Relaxation', icon: Moon, description: 'Apaisement et détente' },
    { id: 'energy', name: 'Énergie', icon: Sun, description: 'Stimulation et motivation' },
    { id: 'focus', name: 'Concentration', icon: Brain, description: 'Amélioration du focus' },
    { id: 'healing', name: 'Guérison', icon: Heart, description: 'Thérapie émotionnelle' }
  ];

  // Simulate biometric readings during playback
  useEffect(() => {
    if (isPlaying && currentTrack) {
      const interval = setInterval(() => {
        const newReading: BiometricReading = {
          timestamp: Date.now(),
          heartRate: 70 + Math.random() * 20,
          stress: Math.max(0, 50 - progress * 0.5 + Math.random() * 10),
          focus: Math.min(100, 60 + progress * 0.4 + Math.random() * 15),
          enjoyment: Math.min(100, 70 + Math.random() * 25)
        };
        
        setBiometrics(prev => [...prev.slice(-20), newReading]);
      }, 2000);

      return () => clearInterval(interval);
    }
  }, [isPlaying, currentTrack, progress]);

  // Simulate track progress
  useEffect(() => {
    if (isPlaying && currentTrack) {
      const interval = setInterval(() => {
        setProgress(prev => {
          if (prev >= 100) {
            // Auto next track or stop
            setIsPlaying(false);
            return 0;
          }
          return prev + (100 / currentTrack.duration);
        });
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [isPlaying, currentTrack]);

  const generatePersonalizedTrack = async () => {
    setIsGenerating(true);
    toast({
      title: "Génération en cours...",
      description: "Création d'une composition personnalisée basée sur vos données biométriques"
    });

    // Simulate AI generation
    setTimeout(() => {
      const newTrack: Track = {
        id: `generated_${Date.now()}`,
        title: `Composition Personnalisée ${new Date().toLocaleTimeString()}`,
        artist: 'IA Adaptive',
        genre: 'Personalized Therapy',
        duration: 420,
        emotionTarget: emotionalGoal,
        biometricData: {
          heartRateImpact: Math.random() * 20 - 10,
          stressReduction: 30 + Math.random() * 30,
          focusBoost: 20 + Math.random() * 40
        },
        visualizer: 'particles',
        environment: 'forest'
      };

      setCurrentTrack(newTrack);
      setIsGenerating(false);
      toast({
        title: "Composition générée !",
        description: "Votre track personnalisé est prêt à être écouté"
      });
    }, 3000);
  };

  const MusicVisualizer: React.FC<{ type: string; isActive: boolean }> = ({ type, isActive }) => {
    if (!isActive) return null;

    const visualizerVariants = {
      waves: (
        <div className="flex items-end justify-center gap-1 h-32">
          {[...Array(32)].map((_, i) => (
            <motion.div
              key={i}
              className="bg-gradient-to-t from-primary to-primary/50 rounded-full"
              style={{ width: '4px' }}
              animate={{
                height: [
                  Math.random() * 40 + 20,
                  Math.random() * 80 + 20,
                  Math.random() * 60 + 20
                ]
              }}
              transition={{
                duration: 0.5 + Math.random() * 0.5,
                repeat: Infinity,
                ease: "easeInOut",
                delay: i * 0.05
              }}
            />
          ))}
        </div>
      ),
      particles: (
        <div className="relative h-32 overflow-hidden">
          {[...Array(20)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-2 h-2 bg-primary rounded-full"
              animate={{
                x: [0, Math.random() * 200 - 100, Math.random() * 200 - 100, 0],
                y: [0, Math.random() * 100 - 50, Math.random() * 100 - 50, 0],
                opacity: [0.8, 0.3, 0.8, 0.8]
              }}
              transition={{
                duration: 3 + Math.random() * 2,
                repeat: Infinity,
                ease: "easeInOut",
                delay: i * 0.2
              }}
            />
          ))}
        </div>
      ),
      spectrum: (
        <div className="flex items-end justify-center gap-2 h-32">
          {[...Array(16)].map((_, i) => (
            <motion.div
              key={i}
              className="bg-gradient-to-t from-purple-500 to-pink-500 rounded-t"
              style={{ width: '8px' }}
              animate={{
                height: [
                  Math.random() * 30 + 10,
                  Math.random() * 120 + 10,
                  Math.random() * 80 + 10
                ]
              }}
              transition={{
                duration: 0.3,
                repeat: Infinity,
                ease: "easeOut",
                delay: i * 0.03
              }}
            />
          ))}
        </div>
      )
    };

    return (
      <div className="flex items-center justify-center">
        {visualizerVariants[type as keyof typeof visualizerVariants]}
      </div>
    );
  };

  const BiometricChart: React.FC = () => {
    if (biometrics.length < 2) return null;

    const latestReading = biometrics[biometrics.length - 1];

    return (
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="text-center">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Heart className="h-5 w-5 text-red-500" />
              <span className="text-sm font-medium">Rythme Cardiaque</span>
            </div>
            <div className="text-2xl font-bold">{latestReading.heartRate.toFixed(0)} BPM</div>
          </div>
          
          <div className="text-center">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Zap className="h-5 w-5 text-yellow-500" />
              <span className="text-sm font-medium">Niveau de Stress</span>
            </div>
            <div className="text-2xl font-bold">{latestReading.stress.toFixed(0)}%</div>
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Concentration</span>
            <span>{latestReading.focus.toFixed(0)}%</span>
          </div>
          <Progress value={latestReading.focus} className="h-2" />
        </div>

        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Appréciation</span>
            <span>{latestReading.enjoyment.toFixed(0)}%</span>
          </div>
          <Progress value={latestReading.enjoyment} className="h-2" />
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900/20 via-blue-900/10 to-green-900/20 p-6">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* En-tête */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center space-y-4"
        >
          <div className="flex items-center justify-center gap-3">
            <Headphones className="h-8 w-8 text-primary animate-pulse" />
            <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
              Musicothérapie Adaptive
            </h1>
          </div>
          <p className="text-lg text-muted-foreground">
            Intelligence artificielle musicale qui s'adapte à votre état émotionnel et biométrique
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Lecteur principal */}
          <div className="lg:col-span-2 space-y-6">
            {/* Lecteur */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
            >
              <Card className="backdrop-blur-sm bg-white/90 dark:bg-gray-900/90">
                <CardContent className="p-8">
                  {currentTrack ? (
                    <div className="space-y-6">
                      {/* Info piste */}
                      <div className="text-center space-y-2">
                        <h2 className="text-2xl font-bold">{currentTrack.title}</h2>
                        <p className="text-muted-foreground">{currentTrack.artist}</p>
                        <Badge variant="outline">{currentTrack.emotionTarget}</Badge>
                      </div>

                      {/* Visualiseur */}
                      <MusicVisualizer type={visualizerType} isActive={isPlaying} />

                      {/* Barre de progression */}
                      <div className="space-y-2">
                        <Progress value={progress} className="h-2" />
                        <div className="flex justify-between text-sm text-muted-foreground">
                          <span>{Math.floor((progress / 100) * currentTrack.duration / 60)}:{String(Math.floor(((progress / 100) * currentTrack.duration) % 60)).padStart(2, '0')}</span>
                          <span>{Math.floor(currentTrack.duration / 60)}:{String(currentTrack.duration % 60).padStart(2, '0')}</span>
                        </div>
                      </div>

                      {/* Contrôles */}
                      <div className="flex items-center justify-center gap-4">
                        <Button variant="ghost" size="icon">
                          <SkipBack className="h-5 w-5" />
                        </Button>
                        <Button
                          onClick={() => setIsPlaying(!isPlaying)}
                          size="lg"
                          className="rounded-full w-16 h-16"
                        >
                          {isPlaying ? <Pause className="h-6 w-6" /> : <Play className="h-6 w-6" />}
                        </Button>
                        <Button variant="ghost" size="icon">
                          <SkipForward className="h-5 w-5" />
                        </Button>
                      </div>

                      {/* Volume et options */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <Button variant="ghost" size="icon">
                            <Shuffle className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon">
                            <Repeat className="h-4 w-4" />
                          </Button>
                        </div>
                        
                        <div className="flex items-center gap-3">
                          <VolumeX className="h-4 w-4" />
                          <Slider
                            value={volume}
                            onValueChange={setVolume}
                            max={100}
                            step={1}
                            className="w-24"
                          />
                          <Volume2 className="h-4 w-4" />
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-12 space-y-4">
                      <Music className="h-16 w-16 text-muted-foreground mx-auto" />
                      <h3 className="text-xl font-semibold">Aucune piste sélectionnée</h3>
                      <p className="text-muted-foreground">Choisissez une composition ou générez-en une personnalisée</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>

            {/* Génération IA */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <Card className="backdrop-blur-sm bg-white/90 dark:bg-gray-900/90">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Sparkles className="h-6 w-6 text-primary" />
                    Génération IA Personnalisée
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Objectif émotionnel */}
                  <div>
                    <h4 className="font-semibold mb-3">Objectif émotionnel</h4>
                    <div className="grid grid-cols-2 gap-2">
                      {emotionalGoals.map(goal => {
                        const Icon = goal.icon;
                        return (
                          <Button
                            key={goal.id}
                            variant={emotionalGoal === goal.id ? "default" : "outline"}
                            onClick={() => setEmotionalGoal(goal.id)}
                            className="h-auto p-3 flex-col gap-2"
                          >
                            <Icon className="h-5 w-5" />
                            <div className="text-center">
                              <div className="font-medium">{goal.name}</div>
                              <div className="text-xs opacity-70">{goal.description}</div>
                            </div>
                          </Button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Génération */}
                  <Button
                    onClick={generatePersonalizedTrack}
                    disabled={isGenerating}
                    className="w-full h-12 text-lg"
                  >
                    {isGenerating ? (
                      <>
                        <Activity className="mr-2 h-5 w-5 animate-spin" />
                        Génération en cours...
                      </>
                    ) : (
                      <>
                        <Sparkles className="mr-2 h-5 w-5" />
                        Générer une composition
                      </>
                    )}
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          </div>

          {/* Panneau latéral */}
          <div className="space-y-6">
            {/* Biométrie temps réel */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
            >
              <Card className="backdrop-blur-sm bg-white/90 dark:bg-gray-900/90">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Activity className="h-5 w-5 text-primary" />
                    Biométrie Temps Réel
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <BiometricChart />
                </CardContent>
              </Card>
            </motion.div>

            {/* Playlist */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
            >
              <Card className="backdrop-blur-sm bg-white/90 dark:bg-gray-900/90">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Music className="h-5 w-5 text-primary" />
                    Compositions Thérapeutiques
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {tracks.map(track => (
                      <div
                        key={track.id}
                        className={`p-3 rounded-lg cursor-pointer transition-all ${
                          currentTrack?.id === track.id 
                            ? 'bg-primary/10 border border-primary/20' 
                            : 'hover:bg-muted/50'
                        }`}
                        onClick={() => setCurrentTrack(track)}
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded bg-gradient-to-r from-primary/20 to-purple-600/20 flex items-center justify-center">
                            <Music className="h-5 w-5 text-primary" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h4 className="font-medium truncate">{track.title}</h4>
                            <p className="text-xs text-muted-foreground">{track.artist}</p>
                            <Badge variant="secondary" className="text-xs mt-1">
                              {track.emotionTarget}
                            </Badge>
                          </div>
                        </div>
                        
                        {track.biometricData && (
                          <div className="mt-2 text-xs space-y-1">
                            <div className="flex justify-between">
                              <span>Stress</span>
                              <span className="text-green-600">-{track.biometricData.stressReduction}%</span>
                            </div>
                            <div className="flex justify-between">
                              <span>Focus</span>
                              <span className="text-blue-600">+{track.biometricData.focusBoost}%</span>
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Environnements */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 }}
            >
              <Card className="backdrop-blur-sm bg-white/90 dark:bg-gray-900/90">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TreePine className="h-5 w-5 text-primary" />
                    Environnements Immersifs
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-2">
                    {environments.map(env => {
                      const Icon = env.icon;
                      return (
                        <Button
                          key={env.id}
                          variant="outline"
                          className="h-auto p-3 flex-col gap-2"
                        >
                          <div className={`w-8 h-8 rounded-full bg-gradient-to-r ${env.color} flex items-center justify-center`}>
                            <Icon className="h-4 w-4 text-white" />
                          </div>
                          <span className="text-sm">{env.name}</span>
                        </Button>
                      );
                    })}
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

export default EnhancedMusicPage;