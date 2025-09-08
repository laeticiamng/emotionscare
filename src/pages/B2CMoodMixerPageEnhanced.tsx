import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Palette, 
  Music, 
  Zap, 
  Heart,
  Brain,
  Waves,
  Sun,
  Moon,
  Coffee,
  Target,
  Shuffle,
  Play,
  Pause,
  Volume2,
  Settings,
  Sparkles,
  TrendingUp,
  RotateCcw,
  Save,
  Share2,
  Download,
  Headphones,
  Activity
} from 'lucide-react';

interface MoodParameter {
  id: string;
  name: string;
  value: number;
  min: number;
  max: number;
  step: number;
  color: string;
  icon: React.ElementType;
  description: string;
}

interface GeneratedTrack {
  id: string;
  title: string;
  duration: string;
  bpm: number;
  key: string;
  mood: string;
  energy: number;
  valence: number;
  audioUrl?: string;
  waveform: number[];
  isGenerating: boolean;
}

interface MoodPreset {
  id: string;
  name: string;
  description: string;
  icon: React.ElementType;
  parameters: Record<string, number>;
  color: string;
}

export default function B2CMoodMixerPageEnhanced() {
  const [isGenerating, setIsGenerating] = useState(false);
  const [currentTrack, setCurrentTrack] = useState<GeneratedTrack | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(75);
  const [generationProgress, setGenerationProgress] = useState(0);
  const [isAIMode, setIsAIMode] = useState(true);
  const [selectedPreset, setSelectedPreset] = useState<string>('');
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const [moodParameters, setMoodParameters] = useState<MoodParameter[]>([
    {
      id: 'energy',
      name: 'Énergie',
      value: 50,
      min: 0,
      max: 100,
      step: 1,
      color: 'hsl(45 93% 47%)',
      icon: Zap,
      description: 'Niveau d\'énergie et de dynamisme'
    },
    {
      id: 'valence',
      name: 'Positivité',
      value: 60,
      min: 0,
      max: 100,
      step: 1,
      color: 'hsl(142 76% 36%)',
      icon: Heart,
      description: 'Sentiment positif ou négatif'
    },
    {
      id: 'relaxation',
      name: 'Relaxation',
      value: 40,
      min: 0,
      max: 100,
      step: 1,
      color: 'hsl(221.2 83.2% 53.3%)',
      icon: Waves,
      description: 'Niveau de calme et apaisement'
    },
    {
      id: 'focus',
      name: 'Concentration',
      value: 70,
      min: 0,
      max: 100,
      step: 1,
      color: 'hsl(250 100% 60%)',
      icon: Target,
      description: 'Capacité de concentration'
    },
    {
      id: 'creativity',
      name: 'Créativité',
      value: 55,
      min: 0,
      max: 100,
      step: 1,
      color: 'hsl(300 100% 60%)',
      icon: Sparkles,
      description: 'Stimulation créative'
    },
    {
      id: 'motivation',
      name: 'Motivation',
      value: 65,
      min: 0,
      max: 100,
      step: 1,
      color: 'hsl(15 100% 60%)',
      icon: TrendingUp,
      description: 'Boost motivationnel'
    }
  ]);

  const moodPresets: MoodPreset[] = [
    {
      id: 'energizing',
      name: 'Énergisant',
      description: 'Boost d\'énergie matinal',
      icon: Sun,
      color: 'hsl(45 93% 47%)',
      parameters: { energy: 85, valence: 80, relaxation: 20, focus: 60, creativity: 70, motivation: 90 }
    },
    {
      id: 'relaxing',
      name: 'Relaxant',
      description: 'Détente et apaisement',
      icon: Moon,
      color: 'hsl(221.2 83.2% 53.3%)',
      parameters: { energy: 25, valence: 65, relaxation: 90, focus: 40, creativity: 50, motivation: 30 }
    },
    {
      id: 'focus',
      name: 'Focus Intense',
      description: 'Concentration maximale',
      icon: Brain,
      color: 'hsl(250 100% 60%)',
      parameters: { energy: 60, valence: 70, relaxation: 50, focus: 95, creativity: 75, motivation: 80 }
    },
    {
      id: 'creative',
      name: 'Créatif',
      description: 'Inspiration artistique',
      icon: Palette,
      color: 'hsl(300 100% 60%)',
      parameters: { energy: 70, valence: 85, relaxation: 45, focus: 65, creativity: 95, motivation: 75 }
    },
    {
      id: 'workout',
      name: 'Sport',
      description: 'Entraînement physique',
      icon: Activity,
      color: 'hsl(15 100% 60%)',
      parameters: { energy: 95, valence: 80, relaxation: 10, focus: 70, creativity: 40, motivation: 100 }
    },
    {
      id: 'study',
      name: 'Étude',
      description: 'Apprentissage optimal',
      icon: Coffee,
      color: 'hsl(35 100% 50%)',
      parameters: { energy: 55, valence: 60, relaxation: 60, focus: 90, creativity: 65, motivation: 70 }
    }
  ];

  // Generation simulation
  useEffect(() => {
    if (isGenerating) {
      const interval = setInterval(() => {
        setGenerationProgress(prev => {
          if (prev >= 100) {
            setIsGenerating(false);
            generateMockTrack();
            return 0;
          }
          return prev + Math.random() * 15;
        });
      }, 200);
      
      return () => clearInterval(interval);
    }
  }, [isGenerating]);

  // Waveform animation
  useEffect(() => {
    if (currentTrack && canvasRef.current) {
      animateWaveform();
    }
  }, [currentTrack, isPlaying]);

  const updateParameter = (id: string, value: number) => {
    setMoodParameters(prev => 
      prev.map(param => param.id === id ? { ...param, value } : param)
    );
  };

  const applyPreset = (presetId: string) => {
    const preset = moodPresets.find(p => p.id === presetId);
    if (!preset) return;

    setSelectedPreset(presetId);
    setMoodParameters(prev => 
      prev.map(param => ({
        ...param,
        value: preset.parameters[param.id] || param.value
      }))
    );
  };

  const generateMockTrack = () => {
    const energy = moodParameters.find(p => p.id === 'energy')?.value || 50;
    const valence = moodParameters.find(p => p.id === 'valence')?.value || 50;
    
    const track: GeneratedTrack = {
      id: Date.now().toString(),
      title: `Mix Personnalisé ${Math.floor(Math.random() * 1000)}`,
      duration: `${Math.floor(Math.random() * 3) + 3}:${Math.floor(Math.random() * 60).toString().padStart(2, '0')}`,
      bpm: Math.floor(energy * 1.2 + 60),
      key: ['C', 'D', 'E', 'F', 'G', 'A', 'B'][Math.floor(Math.random() * 7)] + [' Major', ' Minor'][Math.floor(Math.random() * 2)],
      mood: energy > 70 ? 'Énergique' : energy < 30 ? 'Calme' : 'Équilibré',
      energy,
      valence,
      waveform: Array.from({ length: 100 }, () => Math.random() * 100),
      isGenerating: false
    };

    setCurrentTrack(track);
  };

  const startGeneration = () => {
    setIsGenerating(true);
    setGenerationProgress(0);
    setCurrentTrack(null);
  };

  const randomizeParameters = () => {
    setMoodParameters(prev => 
      prev.map(param => ({
        ...param,
        value: Math.floor(Math.random() * (param.max - param.min) + param.min)
      }))
    );
    setSelectedPreset('');
  };

  const animateWaveform = () => {
    if (!canvasRef.current || !currentTrack) return;
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      const barWidth = canvas.width / currentTrack.waveform.length;
      const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
      gradient.addColorStop(0, 'hsl(var(--primary))');
      gradient.addColorStop(1, 'hsl(var(--primary) / 0.3)');
      
      ctx.fillStyle = gradient;
      
      currentTrack.waveform.forEach((value, index) => {
        const height = (value / 100) * canvas.height * (isPlaying ? 1 : 0.3);
        const x = index * barWidth;
        const y = (canvas.height - height) / 2;
        
        ctx.fillRect(x, y, barWidth - 1, height);
      });
      
      if (isPlaying) {
        requestAnimationFrame(animate);
      }
    };
    
    animate();
  };

  const getMoodColor = () => {
    const energy = moodParameters.find(p => p.id === 'energy')?.value || 50;
    const valence = moodParameters.find(p => p.id === 'valence')?.value || 50;
    
    if (energy > 70 && valence > 70) return 'from-yellow-400 to-red-500';
    if (energy < 30 && valence > 70) return 'from-green-400 to-blue-500';
    if (energy > 70 && valence < 30) return 'from-red-500 to-purple-600';
    if (energy < 30 && valence < 30) return 'from-blue-600 to-gray-700';
    return 'from-purple-500 to-blue-600';
  };

  return (
    <div data-testid="page-root" className="min-h-screen bg-gradient-to-br from-purple-50 via-background to-pink-50 dark:from-purple-950 dark:via-background dark:to-pink-950 p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center space-y-4"
        >
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="p-3 rounded-2xl bg-gradient-to-r from-purple-500/10 to-pink-500/10 backdrop-blur-sm">
              <Palette className="h-8 w-8 text-purple-600" />
            </div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 bg-clip-text text-transparent">
              Mood Mixer IA
            </h1>
          </div>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Créez de la musique thérapeutique personnalisée basée sur vos émotions et objectifs
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Mixer Panel */}
          <div className="lg:col-span-2 space-y-6">
            {/* Mood Visualization */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="premium-card p-8"
            >
              <div className="text-center space-y-6">
                <div className={`w-48 h-48 mx-auto rounded-full bg-gradient-to-br ${getMoodColor()} shadow-2xl flex items-center justify-center`}>
                  <div className="w-32 h-32 bg-white/20 rounded-full backdrop-blur-sm flex items-center justify-center">
                    <Headphones className="h-16 w-16 text-white" />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <h3 className="text-2xl font-bold">
                    {selectedPreset ? moodPresets.find(p => p.id === selectedPreset)?.name : 'Mix Personnalisé'}
                  </h3>
                  <div className="flex items-center justify-center gap-4 text-sm text-muted-foreground">
                    <span>Énergie: {moodParameters.find(p => p.id === 'energy')?.value}%</span>
                    <span>•</span>
                    <span>Positivité: {moodParameters.find(p => p.id === 'valence')?.value}%</span>
                  </div>
                </div>

                <div className="flex items-center justify-center gap-4">
                  <Button
                    onClick={startGeneration}
                    disabled={isGenerating}
                    size="lg"
                    className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 px-8"
                  >
                    {isGenerating ? (
                      <>
                        <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent mr-2" />
                        Génération...
                      </>
                    ) : (
                      <>
                        <Sparkles className="h-5 w-5 mr-2" />
                        Générer la Musique
                      </>
                    )}
                  </Button>
                  
                  <Button variant="outline" onClick={randomizeParameters}>
                    <Shuffle className="h-4 w-4 mr-2" />
                    Aléatoire
                  </Button>
                </div>

                {isGenerating && (
                  <div className="space-y-2">
                    <div className="w-full bg-muted rounded-full h-3">
                      <div 
                        className="bg-gradient-to-r from-purple-500 to-pink-500 h-3 rounded-full transition-all duration-300"
                        style={{ width: `${generationProgress}%` }}
                      />
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {generationProgress < 30 ? 'Analyse de vos paramètres...' :
                       generationProgress < 60 ? 'Génération des mélodies...' :
                       generationProgress < 90 ? 'Mixage et harmonisation...' :
                       'Finalisation...'}
                    </p>
                  </div>
                )}
              </div>
            </motion.div>

            {/* Parameter Controls */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="premium-card p-6"
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold">Paramètres d'Humeur</h3>
                <div className="flex items-center gap-2">
                  <span className="text-sm">Mode IA</span>
                  <Switch checked={isAIMode} onCheckedChange={setIsAIMode} />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                {moodParameters.map((param, index) => {
                  const Icon = param.icon;
                  return (
                    <motion.div
                      key={param.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.1 * index }}
                      className="space-y-3"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Icon className="h-5 w-5" style={{ color: param.color }} />
                          <span className="font-medium">{param.name}</span>
                        </div>
                        <Badge style={{ backgroundColor: param.color, color: 'white' }}>
                          {param.value}%
                        </Badge>
                      </div>
                      
                      <Slider
                        value={[param.value]}
                        onValueChange={([value]) => updateParameter(param.id, value)}
                        min={param.min}
                        max={param.max}
                        step={param.step}
                        className="w-full"
                      />
                      
                      <p className="text-xs text-muted-foreground">
                        {param.description}
                      </p>
                    </motion.div>
                  );
                })}
              </div>
            </motion.div>

            {/* Generated Track Player */}
            {currentTrack && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="premium-card p-6"
              >
                <h3 className="text-lg font-semibold mb-4">Piste Générée</h3>
                
                <div className="flex items-center gap-6 mb-6">
                  <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
                    <Music className="h-8 w-8 text-white" />
                  </div>
                  
                  <div className="flex-1">
                    <h4 className="text-xl font-bold">{currentTrack.title}</h4>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <span>{currentTrack.duration}</span>
                      <span>•</span>
                      <span>{currentTrack.bpm} BPM</span>
                      <span>•</span>
                      <span>{currentTrack.key}</span>
                      <span>•</span>
                      <Badge variant="outline">{currentTrack.mood}</Badge>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Button size="sm" variant="outline">
                      <Save className="h-4 w-4" />
                    </Button>
                    <Button size="sm" variant="outline">
                      <Share2 className="h-4 w-4" />
                    </Button>
                    <Button size="sm" variant="outline">
                      <Download className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                {/* Waveform Visualization */}
                <div className="space-y-4">
                  <canvas
                    ref={canvasRef}
                    width={800}
                    height={100}
                    className="w-full h-25 bg-muted rounded-lg"
                  />
                  
                  <div className="flex items-center gap-4">
                    <Button
                      size="lg"
                      onClick={() => setIsPlaying(!isPlaying)}
                      className="rounded-full p-4"
                    >
                      {isPlaying ? <Pause className="h-6 w-6" /> : <Play className="h-6 w-6" />}
                    </Button>
                    
                    <div className="flex items-center gap-2 flex-1">
                      <Volume2 className="h-4 w-4" />
                      <Slider
                        value={[volume]}
                        onValueChange={([value]) => setVolume(value)}
                        max={100}
                        step={1}
                        className="flex-1 max-w-xs"
                      />
                      <span className="text-sm w-8">{volume}%</span>
                    </div>
                  </div>
                </div>

                {/* Track Analytics */}
                <div className="grid grid-cols-4 gap-4 mt-6 p-4 bg-accent/30 rounded-lg">
                  <div className="text-center">
                    <div className="text-lg font-bold" style={{ color: 'hsl(45 93% 47%)' }}>
                      {currentTrack.energy}%
                    </div>
                    <div className="text-xs text-muted-foreground">Énergie</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-bold" style={{ color: 'hsl(142 76% 36%)' }}>
                      {currentTrack.valence}%
                    </div>
                    <div className="text-xs text-muted-foreground">Positivité</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-bold text-blue-600">
                      {Math.round(currentTrack.bpm / 10)}
                    </div>
                    <div className="text-xs text-muted-foreground">Intensité</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-bold text-purple-600">
                      A+
                    </div>
                    <div className="text-xs text-muted-foreground">Qualité IA</div>
                  </div>
                </div>
              </motion.div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Presets */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="premium-card p-6"
            >
              <h3 className="text-lg font-semibold mb-4">Presets d'Humeur</h3>
              <div className="space-y-3">
                {moodPresets.map((preset) => {
                  const Icon = preset.icon;
                  return (
                    <Button
                      key={preset.id}
                      variant={selectedPreset === preset.id ? "default" : "outline"}
                      onClick={() => applyPreset(preset.id)}
                      className="w-full justify-start gap-3 h-auto py-3"
                    >
                      <Icon className="h-5 w-5" style={{ color: preset.color }} />
                      <div className="text-left">
                        <div className="font-semibold">{preset.name}</div>
                        <div className="text-xs text-muted-foreground">
                          {preset.description}
                        </div>
                      </div>
                    </Button>
                  );
                })}
              </div>
            </motion.div>

            {/* AI Recommendations */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="premium-card p-6"
            >
              <div className="flex items-center gap-2 mb-4">
                <Brain className="h-5 w-5 text-primary" />
                <h3 className="text-lg font-semibold">Recommandations IA</h3>
              </div>

              <div className="space-y-4">
                <div className="p-3 bg-blue-50 dark:bg-blue-950 rounded-lg">
                  <div className="flex items-center gap-2 text-blue-700 dark:text-blue-300 mb-1">
                    <Target className="h-4 w-4" />
                    <span className="font-medium">Suggestion</span>
                  </div>
                  <p className="text-sm text-blue-600 dark:text-blue-400">
                    Pour améliorer votre concentration, essayez d'augmenter le paramètre Focus à 85%.
                  </p>
                </div>

                <div className="p-3 bg-green-50 dark:bg-green-950 rounded-lg">
                  <div className="flex items-center gap-2 text-green-700 dark:text-green-300 mb-1">
                    <TrendingUp className="h-4 w-4" />
                    <span className="font-medium">Optimisation</span>
                  </div>
                  <p className="text-sm text-green-600 dark:text-green-400">
                    Vos paramètres actuels sont parfaits pour une session de travail créatif.
                  </p>
                </div>

                <div className="p-3 bg-purple-50 dark:bg-purple-950 rounded-lg">
                  <div className="flex items-center gap-2 text-purple-700 dark:text-purple-300 mb-1">
                    <Sparkles className="h-4 w-4" />
                    <span className="font-medium">Nouveauté</span>
                  </div>
                  <p className="text-sm text-purple-600 dark:text-purple-400">
                    Nouveau : Essayez le mode "Méditation Active" pour une relaxation énergisante.
                  </p>
                </div>
              </div>
            </motion.div>

            {/* Quick Stats */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
              className="premium-card p-6"
            >
              <h3 className="text-lg font-semibold mb-4">Statistiques</h3>
              
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-sm">Pistes générées aujourd'hui</span>
                  <span className="font-medium">12</span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-sm">Temps d'écoute</span>
                  <span className="font-medium">2h 34m</span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-sm">Humeur favorite</span>
                  <span className="font-medium">Créatif</span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-sm">Efficacité moyenne</span>
                  <span className="font-medium text-green-600">94%</span>
                </div>
              </div>

              <Button variant="outline" className="w-full mt-4">
                Voir le rapport complet
              </Button>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}