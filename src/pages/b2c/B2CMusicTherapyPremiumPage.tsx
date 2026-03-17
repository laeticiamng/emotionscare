/**
 * B2CMusicTherapyPremiumPage - Expérience musicothérapie premium complète
 * Génération IA Suno, bibliothèque étendue, égaliseur, sessions guidées
 */

import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Play, Pause, Crown, Sparkles, Brain, Heart, Moon, Zap, 
  Music, Headphones, Volume2, Clock, Star, Filter, Wand2,
  ChevronRight, Loader2, Settings2, Waves, Timer
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import Card3D from '@/components/ui/Card3D';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { Slider } from '@/components/ui/slider';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ScrollArea } from '@/components/ui/scroll-area';
import { usePageSEO } from '@/hooks/usePageSEO';
import PageRoot from '@/components/common/PageRoot';
import { ConsentGate } from '@/features/clinical-optin/ConsentGate';
import { SoundForestVisualizer } from '@/components/music/SoundForestVisualizer';
import AudioEqualizer from '@/components/music/AudioEqualizer';
import SunoCreditsDisplay from '@/components/music/SunoCreditsDisplay';
import { useSunoMusic } from '@/hooks/api/useSunoMusic';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

// ═══════════════════════════════════════════════════════════════════
// Types & Interfaces
// ═══════════════════════════════════════════════════════════════════

interface PremiumTrack {
  id: string;
  title: string;
  artist: string;
  duration: string;
  durationSeconds: number;
  category: 'focus' | 'relaxation' | 'energy' | 'healing' | 'meditation' | 'sleep';
  frequency: string;
  description: string;
  intensity: number; // 1-10
  premium: boolean;
  isNew?: boolean;
  isFavorite?: boolean;
}

interface TherapySession {
  id: string;
  title: string;
  description: string;
  duration: number; // minutes
  category: string;
  icon: React.FC<{ className?: string }>;
  color: string;
  steps: string[];
}

type CategoryFilter = 'all' | PremiumTrack['category'];

// ═══════════════════════════════════════════════════════════════════
// Constants - Bibliothèque étendue
// ═══════════════════════════════════════════════════════════════════

const PREMIUM_TRACKS: PremiumTrack[] = [
  // Focus
  { id: 'focus-1', title: 'Deep Focus Alpha Waves', artist: 'EmotionsCare Studio', duration: '45:00', durationSeconds: 2700, category: 'focus', frequency: '10Hz Alpha', description: 'Ondes alpha pour concentration profonde et créativité', intensity: 6, premium: true },
  { id: 'focus-2', title: 'Productivity Flow State', artist: 'EmotionsCare Studio', duration: '60:00', durationSeconds: 3600, category: 'focus', frequency: '12Hz Alpha', description: 'État de flow optimal pour le travail intensif', intensity: 7, premium: true, isNew: true },
  { id: 'focus-3', title: 'Study Session Beta', artist: 'EmotionsCare Studio', duration: '30:00', durationSeconds: 1800, category: 'focus', frequency: '18Hz Beta', description: 'Concentration active pour apprentissage', intensity: 8, premium: true },
  
  // Relaxation
  { id: 'relax-1', title: 'Ocean Waves Serenity', artist: 'EmotionsCare Studio', duration: '40:00', durationSeconds: 2400, category: 'relaxation', frequency: '8Hz Alpha', description: 'Vagues océaniques apaisantes pour détente profonde', intensity: 3, premium: true },
  { id: 'relax-2', title: 'Forest Rain Therapy', artist: 'EmotionsCare Studio', duration: '55:00', durationSeconds: 3300, category: 'relaxation', frequency: '7Hz Theta', description: 'Pluie en forêt pour relaxation immersive', intensity: 2, premium: true },
  { id: 'relax-3', title: 'Sunset Calm', artist: 'EmotionsCare Studio', duration: '35:00', durationSeconds: 2100, category: 'relaxation', frequency: '9Hz Alpha', description: 'Atmosphère crépusculaire apaisante', intensity: 4, premium: true, isNew: true },
  
  // Healing
  { id: 'heal-1', title: 'Healing Theta Journey', artist: 'EmotionsCare Studio', duration: '60:00', durationSeconds: 3600, category: 'healing', frequency: '6Hz Theta', description: 'Thérapie par les fréquences pour guérison émotionnelle', intensity: 5, premium: true },
  { id: 'heal-2', title: '432Hz Harmonic Healing', artist: 'EmotionsCare Studio', duration: '50:00', durationSeconds: 3000, category: 'healing', frequency: '432Hz', description: 'Fréquence harmonique naturelle pour équilibre', intensity: 4, premium: true },
  { id: 'heal-3', title: 'Cellular Regeneration', artist: 'EmotionsCare Studio', duration: '45:00', durationSeconds: 2700, category: 'healing', frequency: '528Hz', description: 'Fréquence de réparation ADN', intensity: 6, premium: true },
  
  // Energy
  { id: 'energy-1', title: 'Morning Power Boost', artist: 'EmotionsCare Studio', duration: '20:00', durationSeconds: 1200, category: 'energy', frequency: '20Hz Beta', description: 'Activation énergétique pour démarrer la journée', intensity: 9, premium: true },
  { id: 'energy-2', title: 'Workout Intensity', artist: 'EmotionsCare Studio', duration: '30:00', durationSeconds: 1800, category: 'energy', frequency: '25Hz Beta', description: 'Musique dynamique pour entraînement', intensity: 10, premium: true },
  { id: 'energy-3', title: 'Motivation Wave', artist: 'EmotionsCare Studio', duration: '25:00', durationSeconds: 1500, category: 'energy', frequency: '22Hz Beta', description: 'Boost de motivation et confiance', intensity: 8, premium: true, isNew: true },
  
  // Meditation
  { id: 'med-1', title: 'Zen Garden Meditation', artist: 'EmotionsCare Studio', duration: '30:00', durationSeconds: 1800, category: 'meditation', frequency: '4Hz Theta', description: 'Méditation profonde inspirée des jardins zen', intensity: 2, premium: true },
  { id: 'med-2', title: 'Tibetan Bowls Journey', artist: 'EmotionsCare Studio', duration: '45:00', durationSeconds: 2700, category: 'meditation', frequency: '5Hz Theta', description: 'Bols tibétains pour méditation ancestrale', intensity: 3, premium: true },
  { id: 'med-3', title: 'Mindfulness Space', artist: 'EmotionsCare Studio', duration: '20:00', durationSeconds: 1200, category: 'meditation', frequency: '6Hz Theta', description: 'Espace de pleine conscience guidée', intensity: 2, premium: true },
  
  // Sleep
  { id: 'sleep-1', title: 'Delta Dream Waves', artist: 'EmotionsCare Studio', duration: '90:00', durationSeconds: 5400, category: 'sleep', frequency: '2Hz Delta', description: 'Ondes delta pour sommeil réparateur profond', intensity: 1, premium: true },
  { id: 'sleep-2', title: 'Night Sky Lullaby', artist: 'EmotionsCare Studio', duration: '60:00', durationSeconds: 3600, category: 'sleep', frequency: '1.5Hz Delta', description: 'Berceuse céleste pour endormissement', intensity: 1, premium: true },
  { id: 'sleep-3', title: 'Sleep Sanctuary', artist: 'EmotionsCare Studio', duration: '120:00', durationSeconds: 7200, category: 'sleep', frequency: '3Hz Delta', description: 'Sanctuaire sonore pour nuit complète', intensity: 1, premium: true, isNew: true },
];

const THERAPY_SESSIONS: TherapySession[] = [
  {
    id: 'session-anxiety',
    title: 'Libération de l\'anxiété',
    description: 'Session guidée de 20 min pour réduire l\'anxiété',
    duration: 20,
    category: 'anxiety',
    icon: Brain,
    color: 'from-blue-500 to-cyan-500',
    steps: ['Respiration 4-7-8', 'Scan corporel', 'Visualisation', 'Ancrage']
  },
  {
    id: 'session-focus',
    title: 'Concentration Optimale',
    description: 'Préparez votre esprit pour un travail profond',
    duration: 15,
    category: 'focus',
    icon: Zap,
    color: 'from-amber-500 to-orange-500',
    steps: ['Centrage', 'Activation mentale', 'Flow state', 'Engagement']
  },
  {
    id: 'session-sleep',
    title: 'Préparation au sommeil',
    description: 'Transition douce vers un sommeil réparateur',
    duration: 30,
    category: 'sleep',
    icon: Moon,
    color: 'from-indigo-500 to-purple-500',
    steps: ['Relaxation progressive', 'Respiration lente', 'Body scan', 'Visualisation nocturne']
  },
  {
    id: 'session-heart',
    title: 'Cohérence Cardiaque',
    description: 'Synchronisez votre rythme cardiaque',
    duration: 10,
    category: 'heart',
    icon: Heart,
    color: 'from-rose-500 to-pink-500',
    steps: ['Respiration guidée', 'Synchronisation', 'Équilibre', 'Harmonie']
  },
];

const CATEGORY_INFO: Record<CategoryFilter, { label: string; icon: React.FC<{ className?: string }>; color: string }> = {
  all: { label: 'Tout', icon: Music, color: 'text-primary' },
  focus: { label: 'Focus', icon: Brain, color: 'text-warning' },
  relaxation: { label: 'Relaxation', icon: Waves, color: 'text-accent' },
  healing: { label: 'Guérison', icon: Heart, color: 'text-destructive' },
  energy: { label: 'Énergie', icon: Zap, color: 'text-warning' },
  meditation: { label: 'Méditation', icon: Sparkles, color: 'text-accent' },
  sleep: { label: 'Sommeil', icon: Moon, color: 'text-primary' },
};

// ═══════════════════════════════════════════════════════════════════
// Components
// ═══════════════════════════════════════════════════════════════════

const AIGeneratorSection: React.FC<{
  onGenerate: (prompt: string, mood: string) => void;
  isGenerating: boolean;
}> = ({ onGenerate, isGenerating }) => {
  const [prompt, setPrompt] = useState('');
  const [selectedMood, setSelectedMood] = useState<string>('calm');
  const [intensity, setIntensity] = useState([5]);

  const moods = [
    { value: 'calm', label: 'Calme', emoji: '🌊' },
    { value: 'focus', label: 'Focus', emoji: '🎯' },
    { value: 'energy', label: 'Énergie', emoji: '⚡' },
    { value: 'healing', label: 'Guérison', emoji: '💚' },
    { value: 'sleep', label: 'Sommeil', emoji: '🌙' },
  ];

  const handleGenerate = () => {
    if (!prompt.trim()) {
      toast.error('Décrivez la musique que vous souhaitez');
      return;
    }
    onGenerate(`${prompt}. Intensity: ${intensity[0]}/10`, selectedMood);
  };

  return (
    <Card3D className="border-primary/20 bg-gradient-to-br from-primary/5 to-accent/5" hoverLift>
      <CardHeader>
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-gradient-to-br from-primary to-accent">
            <Wand2 className="h-5 w-5 text-white" />
          </div>
          <div>
            <CardTitle className="text-lg">Génération IA Personnalisée</CardTitle>
            <CardDescription>Créez votre musique thérapeutique unique avec Suno AI</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Mood Selection */}
        <div className="space-y-2">
          <Label className="text-sm font-medium">Ambiance souhaitée</Label>
          <div className="flex flex-wrap gap-2">
            {moods.map((mood) => (
              <Button
                key={mood.value}
                size="sm"
                variant={selectedMood === mood.value ? 'default' : 'outline'}
                onClick={() => setSelectedMood(mood.value)}
                className="gap-1.5"
              >
                <span>{mood.emoji}</span>
                {mood.label}
              </Button>
            ))}
          </div>
        </div>

        {/* Intensity Slider */}
        <div className="space-y-2">
          <div className="flex justify-between">
            <Label className="text-sm font-medium">Intensité</Label>
            <span className="text-sm text-muted-foreground">{intensity[0]}/10</span>
          </div>
          <Slider
            value={intensity}
            onValueChange={setIntensity}
            min={1}
            max={10}
            step={1}
            className="w-full"
          />
        </div>

        {/* Custom Prompt */}
        <div className="space-y-2">
          <Label className="text-sm font-medium">Description personnalisée</Label>
          <Input
            placeholder="Ex: Musique apaisante avec piano et sons de nature..."
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            disabled={isGenerating}
          />
        </div>

        {/* Generate Button */}
        <Button 
          onClick={handleGenerate} 
          disabled={isGenerating || !prompt.trim()}
          className="w-full gap-2 bg-gradient-to-r from-primary to-accent hover:opacity-90"
        >
          {isGenerating ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Génération en cours...
            </>
          ) : (
            <>
              <Sparkles className="h-4 w-4" />
              Générer ma musique
            </>
          )}
        </Button>
      </CardContent>
    </Card3D>
  );
};

const TrackCard: React.FC<{
  track: PremiumTrack;
  isSelected: boolean;
  isPlaying: boolean;
  onPlay: () => void;
}> = ({ track, isSelected, isPlaying, onPlay }) => {
  const CategoryIcon = CATEGORY_INFO[track.category].icon;
  
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      whileHover={{ scale: 1.01 }}
      className={cn(
        "group relative rounded-xl border p-4 transition-all cursor-pointer",
        isSelected 
          ? "border-primary bg-primary/5 shadow-lg shadow-primary/10" 
          : "border-border/30 bg-card/40 hover:border-primary/30 hover:bg-card/60"
      )}
      onClick={onPlay}
    >
      <div className="flex items-center gap-4">
        {/* Play Button */}
        <button
          className={cn(
            "flex h-12 w-12 shrink-0 items-center justify-center rounded-full transition-all",
            isSelected && isPlaying
              ? "bg-primary text-primary-foreground"
              : "bg-muted/50 group-hover:bg-primary/20"
          )}
        >
          {isSelected && isPlaying ? (
            <Pause className="h-5 w-5" />
          ) : (
            <Play className="ml-0.5 h-5 w-5" />
          )}
        </button>

        {/* Track Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <h3 className="font-semibold text-foreground truncate">{track.title}</h3>
            {track.isNew && (
              <Badge variant="secondary" className="text-[10px] px-1.5 py-0 bg-accent/20 text-accent">
                Nouveau
              </Badge>
            )}
            <Crown className="h-3.5 w-3.5 text-warning shrink-0" />
          </div>
          <p className="text-sm text-muted-foreground truncate">{track.description}</p>
          <div className="flex items-center gap-3 mt-1.5 text-xs text-muted-foreground">
            <span className="flex items-center gap-1">
              <CategoryIcon className={cn("h-3 w-3", CATEGORY_INFO[track.category].color)} />
              {CATEGORY_INFO[track.category].label}
            </span>
            <span className="flex items-center gap-1">
              <Clock className="h-3 w-3" />
              {track.duration}
            </span>
          </div>
        </div>

        {/* Frequency Badge */}
        <div className="text-right shrink-0">
          <Badge variant="outline" className="text-xs font-mono bg-background/50">
            {track.frequency}
          </Badge>
          <div className="mt-1 flex items-center gap-1 justify-end">
            <span className="text-[10px] text-muted-foreground">Int.</span>
            <div className="flex gap-0.5">
              {Array.from({ length: 10 }).map((_, i) => (
                <div
                  key={i}
                  className={cn(
                    "w-1 h-2 rounded-sm",
                    i < track.intensity ? "bg-primary" : "bg-muted/30"
                  )}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

const SessionCard: React.FC<{
  session: TherapySession;
  onStart: () => void;
}> = ({ session, onStart }) => {
  const Icon = session.icon;
  
  return (
    <Card3D className="group cursor-pointer overflow-hidden" hoverLift onClick={onStart}>
      <div className={cn("h-2 bg-gradient-to-r", session.color)} />
      <CardContent className="p-4">
        <div className="flex items-start gap-3">
          <div className={cn("p-2 rounded-xl bg-gradient-to-br", session.color)}>
            <Icon className="h-5 w-5 text-white" />
          </div>
          <div className="flex-1">
            <h3 className="font-semibold mb-1">{session.title}</h3>
            <p className="text-sm text-muted-foreground mb-2">{session.description}</p>
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Timer className="h-3 w-3" />
              <span>{session.duration} min</span>
              <span className="text-muted-foreground/50">•</span>
              <span>{session.steps.length} étapes</span>
            </div>
          </div>
          <ChevronRight className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors" />
        </div>
      </CardContent>
    </Card3D>
  );
};

// ═══════════════════════════════════════════════════════════════════
// Main Component
// ═══════════════════════════════════════════════════════════════════

const B2CMusicTherapyPremiumPage: React.FC = () => {
  const [selectedTrack, setSelectedTrack] = useState<PremiumTrack | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [categoryFilter, setCategoryFilter] = useState<CategoryFilter>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [showEqualizer, setShowEqualizer] = useState(false);
  const [playProgress, setPlayProgress] = useState(0);
  
  const { generateTherapeuticMusic, isGenerating } = useSunoMusic();
  
  usePageSEO({
    title: 'Musicothérapie Premium - Génération IA & Fréquences',
    description: 'Expérience musicothérapie premium avec génération IA Suno, fréquences binaurales, sessions guidées et égaliseur avancé.',
    keywords: 'musicothérapie, génération IA, suno, fréquences binaurales, thérapie sonore'
  });

  // Filtered tracks
  const filteredTracks = useMemo(() => {
    return PREMIUM_TRACKS.filter((track) => {
      const matchesCategory = categoryFilter === 'all' || track.category === categoryFilter;
      const matchesSearch = !searchQuery || 
        track.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        track.description.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [categoryFilter, searchQuery]);

  const handlePlayPause = (track: PremiumTrack) => {
    if (selectedTrack?.id === track.id) {
      setIsPlaying(!isPlaying);
    } else {
      setSelectedTrack(track);
      setIsPlaying(true);
      setPlayProgress(0);
    }
  };

  const handleAIGenerate = async (prompt: string, mood: string) => {
    const emotionMap: Record<string, string> = {
      calm: 'relaxed',
      focus: 'focused',
      energy: 'energetic',
      healing: 'healing',
      sleep: 'sleepy'
    };
    
    try {
      const result = await generateTherapeuticMusic(emotionMap[mood] || 'neutral', 5);
      if (result.success && result.data) {
        toast.success('Musique générée !', {
          description: result.data.title || 'Votre piste personnalisée est prête'
        });
      } else {
        toast.error('Erreur de génération', {
          description: result.error || 'Veuillez réessayer'
        });
      }
    } catch {
      toast.error('Erreur de génération');
    }
  };

  const handleStartSession = (session: TherapySession) => {
    toast.info(`Session "${session.title}" démarrée`, {
      description: `Durée: ${session.duration} minutes`
    });
  };

  // Simulate play progress
  React.useEffect(() => {
    if (!isPlaying || !selectedTrack) return;
    
    const interval = setInterval(() => {
      setPlayProgress((prev) => {
        const newProgress = prev + (100 / selectedTrack.durationSeconds);
        if (newProgress >= 100) {
          setIsPlaying(false);
          return 0;
        }
        return newProgress;
      });
    }, 1000);
    
    return () => clearInterval(interval);
  }, [isPlaying, selectedTrack]);

  return (
    <ConsentGate>
      <PageRoot>
        <div className="min-h-screen bg-gradient-to-br from-background via-primary/5 to-background">
          <div className="container mx-auto px-4 py-8 max-w-7xl">
            
            {/* Header */}
            <motion.div 
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-8"
            >
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <div className="p-2 rounded-xl bg-gradient-to-br from-warning to-warning/70">
                      <Crown className="h-6 w-6 text-white" />
                    </div>
                    <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-warning to-accent bg-clip-text text-transparent">
                      Music Therapy Premium
                    </h1>
                  </div>
                  <p className="text-muted-foreground max-w-xl">
                    Génération IA, fréquences thérapeutiques et sessions guidées pour votre bien-être
                  </p>
                </div>
                <SunoCreditsDisplay compact className="self-start" />
              </div>
            </motion.div>

            {/* Main Content */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              
              {/* Left Column - Player & Visualizer */}
              <div className="lg:col-span-2 space-y-6">
                
                {/* Visualizer & Now Playing */}
                <Card3D className="overflow-hidden border-primary/20">
                  <div className="h-[300px] md:h-[350px] relative">
                    <SoundForestVisualizer isPlaying={isPlaying} />
                    
                    {/* Overlay Controls */}
                    {selectedTrack && (
                      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-background/95 to-transparent p-4">
                        <div className="flex items-center justify-between mb-3">
                          <div>
                            <p className="font-semibold text-foreground">{selectedTrack.title}</p>
                            <p className="text-sm text-muted-foreground">{selectedTrack.artist}</p>
                          </div>
                          <div className="flex items-center gap-2">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => setShowEqualizer(!showEqualizer)}
                              className="h-9 w-9"
                            >
                              <Settings2 className="h-4 w-4" />
                            </Button>
                            <Button
                              size="icon"
                              onClick={() => handlePlayPause(selectedTrack)}
                              className="h-10 w-10 rounded-full bg-primary"
                            >
                              {isPlaying ? (
                                <Pause className="h-5 w-5" />
                              ) : (
                                <Play className="h-5 w-5 ml-0.5" />
                              )}
                            </Button>
                          </div>
                        </div>
                        <Progress value={playProgress} className="h-1" />
                      </div>
                    )}
                    
                    {!selectedTrack && (
                      <div className="absolute inset-0 flex items-center justify-center bg-background/60 backdrop-blur-sm">
                        <div className="text-center">
                          <Headphones className="h-12 w-12 mx-auto mb-3 text-muted-foreground/50" />
                          <p className="text-muted-foreground">Sélectionnez une piste pour commencer</p>
                        </div>
                      </div>
                    )}
                  </div>
                </Card3D>

                {/* Equalizer (conditional) */}
                <AnimatePresence>
                  {showEqualizer && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                    >
                      <AudioEqualizer />
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Tabs: Library & Sessions */}
                <Tabs defaultValue="library" className="space-y-4">
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="library" className="gap-2">
                      <Music className="h-4 w-4" />
                      Bibliothèque
                    </TabsTrigger>
                    <TabsTrigger value="sessions" className="gap-2">
                      <Sparkles className="h-4 w-4" />
                      Sessions guidées
                    </TabsTrigger>
                  </TabsList>

                  <TabsContent value="library" className="space-y-4">
                    {/* Filters */}
                    <div className="flex flex-col sm:flex-row gap-3">
                      <Input
                        placeholder="Rechercher une piste..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="flex-1"
                      />
                      <ScrollArea className="w-full sm:w-auto pb-2">
                        <div className="flex gap-1.5">
                          {(Object.keys(CATEGORY_INFO) as CategoryFilter[]).map((cat) => {
                            const Icon = CATEGORY_INFO[cat].icon;
                            return (
                              <Button
                                key={cat}
                                size="sm"
                                variant={categoryFilter === cat ? 'default' : 'ghost'}
                                onClick={() => setCategoryFilter(cat)}
                                className="gap-1.5 shrink-0"
                              >
                                <Icon className="h-3.5 w-3.5" />
                                {CATEGORY_INFO[cat].label}
                              </Button>
                            );
                          })}
                        </div>
                      </ScrollArea>
                    </div>

                    {/* Track List */}
                    <ScrollArea className="h-[400px] pr-4">
                      <div className="space-y-3">
                        <AnimatePresence mode="popLayout">
                          {filteredTracks.map((track) => (
                            <TrackCard
                              key={track.id}
                              track={track}
                              isSelected={selectedTrack?.id === track.id}
                              isPlaying={isPlaying && selectedTrack?.id === track.id}
                              onPlay={() => handlePlayPause(track)}
                            />
                          ))}
                        </AnimatePresence>
                        
                        {filteredTracks.length === 0 && (
                          <div className="text-center py-12 text-muted-foreground">
                            <Filter className="h-8 w-8 mx-auto mb-2 opacity-50" />
                            <p>Aucune piste ne correspond à votre recherche</p>
                          </div>
                        )}
                      </div>
                    </ScrollArea>
                  </TabsContent>

                  <TabsContent value="sessions" className="space-y-3">
                    {THERAPY_SESSIONS.map((session) => (
                      <SessionCard
                        key={session.id}
                        session={session}
                        onStart={() => handleStartSession(session)}
                      />
                    ))}
                  </TabsContent>
                </Tabs>
              </div>

              {/* Right Column - AI Generator & Stats */}
              <div className="space-y-6">
                <AIGeneratorSection
                  onGenerate={handleAIGenerate}
                  isGenerating={isGenerating}
                />
                
                <SunoCreditsDisplay />
                
                {/* Quick Stats */}
                <Card3D hoverLift>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium flex items-center gap-2">
                      <Star className="h-4 w-4 text-warning" />
                      Statistiques Premium
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Pistes disponibles</span>
                      <span className="font-semibold">{PREMIUM_TRACKS.length}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Sessions guidées</span>
                      <span className="font-semibold">{THERAPY_SESSIONS.length}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Catégories</span>
                      <span className="font-semibold">{Object.keys(CATEGORY_INFO).length - 1}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Durée totale</span>
                      <span className="font-semibold">
                        {Math.round(PREMIUM_TRACKS.reduce((acc, t) => acc + t.durationSeconds, 0) / 3600)}h+
                      </span>
                    </div>
                  </CardContent>
                </Card3D>
              </div>
            </div>
          </div>
        </div>
      </PageRoot>
    </ConsentGate>
  );
};

export default B2CMusicTherapyPremiumPage;
