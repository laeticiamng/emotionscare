/**
 * Flash Glow Page - Luminothérapie et exercices de visualisation
 * Module complet avec séances, presets et statistiques
 */

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { logger } from '@/lib/logger';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Sun,
  Moon,
  Zap,
  Sparkles,
  Play,
  Pause,
  RotateCcw,
  Settings2,
  Timer,
  TrendingUp,
  Trophy,
  Heart,
  Eye,
  Palette,
  Volume2,
  VolumeX,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Slider } from '@/components/ui/slider';
import { Progress } from '@/components/ui/progress';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';

// Types
interface FlashPreset {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  colors: string[];
  duration: number;
  intensity: 'low' | 'medium' | 'high';
  category: 'relaxation' | 'energy' | 'focus' | 'sleep';
  bpm: number;
}

// Presets de luminothérapie
const FLASH_PRESETS: FlashPreset[] = [
  {
    id: 'calm-ocean',
    name: 'Océan Calme',
    description: 'Vagues de bleu apaisantes pour la relaxation',
    icon: <Moon className="h-5 w-5" />,
    colors: ['#1E3A5F', '#2E5A8F', '#1E3A5F', '#0F1F3F'],
    duration: 300,
    intensity: 'low',
    category: 'relaxation',
    bpm: 6
  },
  {
    id: 'sunset-glow',
    name: 'Lueur du Coucher',
    description: 'Dégradés chauds pour la transition vers le sommeil',
    icon: <Sun className="h-5 w-5" />,
    colors: ['#FF6B35', '#F7931E', '#FF6B35', '#8B4513'],
    duration: 600,
    intensity: 'low',
    category: 'sleep',
    bpm: 4
  },
  {
    id: 'energy-boost',
    name: 'Boost Énergie',
    description: 'Couleurs vives pour stimuler l\'éveil',
    icon: <Zap className="h-5 w-5" />,
    colors: ['#FF4500', '#FFD700', '#32CD32', '#00CED1'],
    duration: 180,
    intensity: 'high',
    category: 'energy',
    bpm: 12
  },
  {
    id: 'focus-pulse',
    name: 'Pulse Focus',
    description: 'Pulsations rythmées pour la concentration',
    icon: <Eye className="h-5 w-5" />,
    colors: ['#4169E1', '#6495ED', '#4169E1', '#191970'],
    duration: 300,
    intensity: 'medium',
    category: 'focus',
    bpm: 8
  },
  {
    id: 'aurora',
    name: 'Aurore Boréale',
    description: 'Spectacle lumineux naturel apaisant',
    icon: <Sparkles className="h-5 w-5" />,
    colors: ['#00FF7F', '#40E0D0', '#8A2BE2', '#00CED1'],
    duration: 420,
    intensity: 'medium',
    category: 'relaxation',
    bpm: 5
  },
  {
    id: 'forest-bath',
    name: 'Bain de Forêt',
    description: 'Verts apaisants inspirés de la nature',
    icon: <Heart className="h-5 w-5" />,
    colors: ['#228B22', '#2E8B57', '#006400', '#90EE90'],
    duration: 480,
    intensity: 'low',
    category: 'relaxation',
    bpm: 6
  }
];

// Hook pour les sessions Flash Glow
function useFlashGlowStats() {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    totalSessions: 0,
    totalMinutes: 0,
    favoritePreset: '',
    avgMoodImprovement: 0,
    streak: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user?.id) return;

    const fetchStats = async () => {
      try {
        const { data } = await supabase
          .from('activity_sessions')
          .select('*')
          .eq('user_id', user.id)
          .contains('metadata', { type: 'flash-glow' });

        if (data && data.length > 0) {
          const presetCounts: Record<string, number> = {};
          let totalImprovement = 0;
          let improvementCount = 0;

          data.forEach(s => {
            const preset = (s.metadata as Record<string, string>)?.preset || '';
            presetCounts[preset] = (presetCounts[preset] || 0) + 1;
            
            if (s.mood_before && s.mood_after) {
              totalImprovement += s.mood_after - s.mood_before;
              improvementCount++;
            }
          });

          const favorite = Object.entries(presetCounts)
            .sort(([,a], [,b]) => b - a)[0]?.[0] || '';

          setStats({
            totalSessions: data.length,
            totalMinutes: data.reduce((sum, s) => sum + Math.round((s.duration_seconds || 0) / 60), 0),
            favoritePreset: favorite,
            avgMoodImprovement: improvementCount > 0 
              ? Math.round((totalImprovement / improvementCount) * 10) / 10 
              : 0,
            streak: Math.min(data.length, 7)
          });
        }
      } catch (error) {
        logger.error('Error fetching flash glow stats:', error, 'FLASH');
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [user?.id]);

  return { stats, loading };
}

// Composant principal
const FlashGlowPage: React.FC = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const { stats, loading: statsLoading } = useFlashGlowStats();
  
  // State
  const [selectedPreset, setSelectedPreset] = useState<FlashPreset>(FLASH_PRESETS[0]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [elapsed, setElapsed] = useState(0);
  const [currentColorIndex, setCurrentColorIndex] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [customDuration, setCustomDuration] = useState(300);
  const [moodBefore, setMoodBefore] = useState(5);
  const [showSettings, setShowSettings] = useState(false);
  const [activeCategory, setActiveCategory] = useState<string>('all');
  
  const animationRef = useRef<NodeJS.Timeout | null>(null);
  const colorIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Animation des couleurs
  useEffect(() => {
    if (isPlaying) {
      const interval = 60000 / selectedPreset.bpm;
      colorIntervalRef.current = setInterval(() => {
        setCurrentColorIndex(prev => (prev + 1) % selectedPreset.colors.length);
      }, interval);
    }
    
    return () => {
      if (colorIntervalRef.current) {
        clearInterval(colorIntervalRef.current);
      }
    };
  }, [isPlaying, selectedPreset]);

  // Timer
  useEffect(() => {
    if (isPlaying && elapsed < customDuration) {
      animationRef.current = setInterval(() => {
        setElapsed(prev => prev + 1);
      }, 1000);
    } else if (elapsed >= customDuration && isPlaying) {
      handleComplete();
    }

    return () => {
      if (animationRef.current) {
        clearInterval(animationRef.current);
      }
    };
  }, [isPlaying, elapsed, customDuration]);

  const handleStart = () => {
    setIsPlaying(true);
    setElapsed(0);
    setCurrentColorIndex(0);
    toast({
      title: 'Session Flash Glow',
      description: `${selectedPreset.name} - ${Math.floor(customDuration / 60)} minutes`
    });
  };

  const handlePause = () => {
    setIsPlaying(false);
  };

  const handleReset = () => {
    setIsPlaying(false);
    setElapsed(0);
    setCurrentColorIndex(0);
  };

  const handleComplete = async () => {
    setIsPlaying(false);
    
    if (user?.id) {
      try {
        await supabase.from('activity_sessions').insert({
          user_id: user.id,
          activity_id: `flash-glow-${selectedPreset.id}`,
          started_at: new Date(Date.now() - elapsed * 1000).toISOString(),
          completed_at: new Date().toISOString(),
          duration_seconds: elapsed,
          mood_before: moodBefore,
          mood_after: Math.min(10, moodBefore + 2),
          completed: true,
          metadata: { 
            type: 'flash-glow', 
            preset: selectedPreset.id,
            category: selectedPreset.category
          }
        });

        toast({
          title: 'Session terminée !',
          description: `Excellent travail avec ${selectedPreset.name}`
        });
      } catch (error) {
        logger.error('Error saving flash glow session:', error, 'FLASH');
      }
    }

    setElapsed(0);
    setCurrentColorIndex(0);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const progress = (elapsed / customDuration) * 100;
  const currentColor = selectedPreset.colors[currentColorIndex];

  const filteredPresets = activeCategory === 'all' 
    ? FLASH_PRESETS 
    : FLASH_PRESETS.filter(p => p.category === activeCategory);

  return (
    <div className="container mx-auto py-8 px-4 max-w-7xl space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <div className="flex items-center justify-center gap-3 mb-4">
          <div className="p-3 rounded-full bg-gradient-to-br from-yellow-400 to-orange-500">
            <Sparkles className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-4xl font-bold">Flash Glow</h1>
        </div>
        <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
          Luminothérapie chromatique pour réguler votre énergie et votre humeur
        </p>
      </motion.div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <Palette className="h-5 w-5 text-purple-500" />
            <div>
              <p className="text-2xl font-bold">{stats.totalSessions}</p>
              <p className="text-xs text-muted-foreground">Sessions</p>
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <Timer className="h-5 w-5 text-blue-500" />
            <div>
              <p className="text-2xl font-bold">{stats.totalMinutes}</p>
              <p className="text-xs text-muted-foreground">Minutes</p>
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <TrendingUp className="h-5 w-5 text-green-500" />
            <div>
              <p className="text-2xl font-bold">+{stats.avgMoodImprovement}</p>
              <p className="text-xs text-muted-foreground">Humeur moyenne</p>
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <Trophy className="h-5 w-5 text-yellow-500" />
            <div>
              <p className="text-2xl font-bold">{stats.streak}</p>
              <p className="text-xs text-muted-foreground">Série</p>
            </div>
          </div>
        </Card>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Zone principale - Visualisation */}
        <div className="lg:col-span-2 space-y-6">
          {/* Écran de luminothérapie */}
          <Card className="overflow-hidden">
            <motion.div
              className="relative h-72 md:h-96 flex items-center justify-center"
              animate={{
                backgroundColor: currentColor,
              }}
              transition={{
                duration: 60 / selectedPreset.bpm,
                ease: 'easeInOut'
              }}
            >
              <AnimatePresence mode="wait">
                <motion.div
                  key={`${selectedPreset.id}-${currentColorIndex}`}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ 
                    opacity: isPlaying ? [0.6, 1, 0.6] : 1, 
                    scale: isPlaying ? [0.95, 1.05, 0.95] : 1 
                  }}
                  transition={{ 
                    duration: isPlaying ? 60 / selectedPreset.bpm : 0.3,
                    repeat: isPlaying ? Infinity : 0
                  }}
                  className="text-center text-white"
                >
                  <div className="mb-4 inline-block p-6 rounded-full bg-white/20 backdrop-blur-sm">
                    {selectedPreset.icon}
                  </div>
                  <h2 className="text-2xl font-bold mb-2">{selectedPreset.name}</h2>
                  <p className="text-white/80 text-sm max-w-xs mx-auto">
                    {selectedPreset.description}
                  </p>
                </motion.div>
              </AnimatePresence>

              {/* Timer overlay */}
              <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-black/30 backdrop-blur-sm px-6 py-2 rounded-full">
                <span className="text-white font-mono text-xl">
                  {formatTime(elapsed)} / {formatTime(customDuration)}
                </span>
              </div>

              {/* Contrôles */}
              <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between">
                <Button
                  variant="ghost"
                  size="icon"
                  className="bg-white/20 hover:bg-white/30 text-white"
                  onClick={() => setIsMuted(!isMuted)}
                  aria-label={isMuted ? 'Activer le son' : 'Couper le son'}
                >
                  {isMuted ? <VolumeX className="h-5 w-5" /> : <Volume2 className="h-5 w-5" />}
                </Button>
                
                <Badge variant="secondary" className="bg-white/20 text-white">
                  {selectedPreset.bpm} BPM
                </Badge>

                <Button
                  variant="ghost"
                  size="icon"
                  className="bg-white/20 hover:bg-white/30 text-white"
                  onClick={() => setShowSettings(!showSettings)}
                  aria-label="Paramètres"
                >
                  <Settings2 className="h-5 w-5" />
                </Button>
              </div>

              {/* Progress */}
              <div className="absolute bottom-0 left-0 right-0">
                <Progress value={progress} className="h-1 rounded-none" />
              </div>
            </motion.div>

            <CardContent className="p-6">
              {/* Contrôles de lecture */}
              <div className="flex items-center justify-center gap-4 mb-6">
                <Button
                  size="icon"
                  variant="outline"
                  onClick={handleReset}
                  disabled={elapsed === 0}
                  aria-label="Réinitialiser"
                >
                  <RotateCcw className="h-5 w-5" />
                </Button>

                {!isPlaying ? (
                  <Button size="lg" className="gap-2 px-8" onClick={handleStart}>
                    <Play className="h-5 w-5" />
                    Démarrer
                  </Button>
                ) : (
                  <Button size="lg" variant="outline" onClick={handlePause}>
                    <Pause className="h-5 w-5" />
                    Pause
                  </Button>
                )}

                {isPlaying && (
                  <Button size="lg" onClick={handleComplete}>
                    Terminer
                  </Button>
                )}
              </div>

              {/* Paramètres */}
              <AnimatePresence>
                {showSettings && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="space-y-4 pt-6 border-t"
                  >
                    <div className="space-y-2">
                      <Label htmlFor="custom-duration">Durée: {Math.floor(customDuration / 60)} min</Label>
                      <Slider
                        id="custom-duration"
                        value={[customDuration]}
                        onValueChange={([v]) => setCustomDuration(v)}
                        min={60}
                        max={900}
                        step={60}
                        disabled={isPlaying}
                        aria-label="Durée de la session"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="mood-before">Humeur actuelle: {moodBefore}/10</Label>
                      <Slider
                        id="mood-before"
                        value={[moodBefore]}
                        onValueChange={([v]) => setMoodBefore(v)}
                        min={1}
                        max={10}
                        disabled={isPlaying}
                        aria-label="Humeur actuelle"
                      />
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </CardContent>
          </Card>

          {/* Sélection de preset */}
          <Card>
            <CardHeader>
              <CardTitle>Programmes</CardTitle>
              <CardDescription>Choisissez votre ambiance lumineuse</CardDescription>
            </CardHeader>
            <CardContent>
              {/* Filtres par catégorie */}
              <div className="flex gap-2 mb-4 overflow-x-auto pb-2">
                {['all', 'relaxation', 'energy', 'focus', 'sleep'].map(cat => (
                  <Button
                    key={cat}
                    variant={activeCategory === cat ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setActiveCategory(cat)}
                  >
                    {cat === 'all' ? 'Tous' : 
                     cat === 'relaxation' ? 'Relaxation' :
                     cat === 'energy' ? 'Énergie' :
                     cat === 'focus' ? 'Focus' : 'Sommeil'}
                  </Button>
                ))}
              </div>

              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredPresets.map((preset) => (
                  <motion.button
                    key={preset.id}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => !isPlaying && setSelectedPreset(preset)}
                    disabled={isPlaying}
                    className={`p-4 rounded-xl text-left transition-all ${
                      selectedPreset.id === preset.id 
                        ? 'ring-2 ring-primary bg-primary/5' 
                        : 'bg-muted/50 hover:bg-muted'
                    } ${isPlaying ? 'opacity-50 cursor-not-allowed' : ''}`}
                  >
                    <div 
                      className="p-2 rounded-lg text-white w-fit mb-3"
                      style={{ background: `linear-gradient(135deg, ${preset.colors[0]}, ${preset.colors[1]})` }}
                    >
                      {preset.icon}
                    </div>
                    <h4 className="font-semibold mb-1">{preset.name}</h4>
                    <p className="text-xs text-muted-foreground line-clamp-2">
                      {preset.description}
                    </p>
                    <div className="mt-2 flex gap-1 flex-wrap">
                      <Badge variant="outline" className="text-xs">
                        {Math.floor(preset.duration / 60)} min
                      </Badge>
                      <Badge variant="outline" className="text-xs">
                        {preset.intensity === 'low' ? 'Doux' : 
                         preset.intensity === 'medium' ? 'Modéré' : 'Intense'}
                      </Badge>
                    </div>
                  </motion.button>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Guide d'utilisation */}
          <Card className="bg-gradient-to-br from-yellow-500/10 to-orange-500/10">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <Eye className="h-5 w-5" />
                Guide d'utilisation
              </CardTitle>
            </CardHeader>
            <CardContent className="text-sm space-y-3">
              <p>• Installez-vous dans un endroit calme et sombre</p>
              <p>• Positionnez l'écran à 50-80cm de vos yeux</p>
              <p>• Respirez lentement en suivant les pulsations</p>
              <p>• Gardez le regard détendu, sans fixer intensément</p>
              <p>• Commencez par des sessions de 5-10 minutes</p>
            </CardContent>
          </Card>

          {/* Bienfaits par catégorie */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Bienfaits</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Badge className="mb-2 bg-blue-500">Relaxation</Badge>
                <p className="text-xs text-muted-foreground">Réduit le stress et apaise le système nerveux</p>
              </div>
              <div>
                <Badge className="mb-2 bg-orange-500">Énergie</Badge>
                <p className="text-xs text-muted-foreground">Stimule l'éveil et combat la fatigue</p>
              </div>
              <div>
                <Badge className="mb-2 bg-indigo-500">Focus</Badge>
                <p className="text-xs text-muted-foreground">Améliore la concentration et la clarté</p>
              </div>
              <div>
                <Badge className="mb-2 bg-purple-500">Sommeil</Badge>
                <p className="text-xs text-muted-foreground">Prépare le corps à un repos réparateur</p>
              </div>
            </CardContent>
          </Card>

          {/* Avertissement */}
          <Card className="border-yellow-500/50 bg-yellow-500/5">
            <CardContent className="p-4">
              <p className="text-xs text-muted-foreground">
                <strong>Attention :</strong> Si vous êtes sensible aux lumières clignotantes 
                ou souffrez d'épilepsie photosensible, consultez un médecin avant utilisation.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default FlashGlowPage;
